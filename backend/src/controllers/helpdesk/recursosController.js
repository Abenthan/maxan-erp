const db = (req) => req.app.locals.pool;

const pendingDetections = new Map();

setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [key, val] of pendingDetections) {
    if (val.timestamp < cutoff) pendingDetections.delete(key);
  }
}, 5 * 60 * 1000);

exports.listar = async (req, res) => {
  const { q, cliente_id, tipo } = req.query;
  let sql = `SELECT r.*, t.razon_social AS cliente_nombre
             FROM helpdesk.recursos r
             LEFT JOIN facturacion.terceros t ON t.id = r.cliente_id
             WHERE r.activo = true`;
  const params = [];
  if (q) {
    params.push(`%${q}%`);
    sql += ` AND (r.nombre ILIKE $${params.length} OR r.serial ILIKE $${params.length} OR r.marca ILIKE $${params.length})`;
  }
  if (cliente_id) {
    params.push(cliente_id);
    sql += ` AND r.cliente_id = $${params.length}`;
  }
  if (tipo) {
    params.push(tipo);
    sql += ` AND r.tipo = $${params.length}`;
  }
  sql += " ORDER BY r.nombre";
  try {
    const result = await db(req).query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const result = await db(req).query(
      `SELECT r.*, t.razon_social AS cliente_nombre
       FROM helpdesk.recursos r
       LEFT JOIN facturacion.terceros t ON t.id = r.cliente_id
       WHERE r.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { cliente_id, nombre, tipo, marca, modelo, referencia, serial, procesador, memoria_gb, almacenamiento_gb, sistema_operativo, ubicacion, descripcion, atributos } = req.body;
  try {
    const result = await db(req).query(
      `INSERT INTO helpdesk.recursos (cliente_id, nombre, tipo, marca, modelo, referencia, serial, procesador, memoria_gb, almacenamiento_gb, sistema_operativo, ubicacion, descripcion, atributos)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb) RETURNING *`,
      [cliente_id, nombre, tipo || 'Computador', marca, modelo, referencia, serial, procesador, memoria_gb, almacenamiento_gb, sistema_operativo, ubicacion, descripcion, JSON.stringify(atributos || {})]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505' && err.constraint?.includes('serial')) {
      return res.status(409).json({ error: "Ya existe un recurso con ese serial", code: "DUPLICATE_SERIAL" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.actualizar = async (req, res) => {
  const { cliente_id, nombre, tipo, marca, modelo, referencia, serial, procesador, memoria_gb, almacenamiento_gb, sistema_operativo, ubicacion, descripcion, activo, atributos } = req.body;
  try {
    const result = await db(req).query(
      `UPDATE helpdesk.recursos SET
        cliente_id=$1, nombre=$2, tipo=$3, marca=$4, modelo=$5, referencia=$6,
        serial=$7, procesador=$8, memoria_gb=$9, almacenamiento_gb=$10,
        sistema_operativo=$11, ubicacion=$12, descripcion=$13, activo=$14,
        atributos=$16::jsonb
       WHERE id=$15 RETURNING *`,
      [cliente_id, nombre, tipo, marca, modelo, referencia, serial, procesador, memoria_gb, almacenamiento_gb, sistema_operativo, ubicacion, descripcion, activo, req.params.id, JSON.stringify(atributos || {})]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505' && err.constraint?.includes('serial')) {
      return res.status(409).json({ error: "Ya existe un recurso con ese serial", code: "DUPLICATE_SERIAL" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.eliminar = async (req, res) => {
  if (!req.user.permisos.includes("usuarios.gestionar")) {
    return res.status(403).json({ error: "Solo administradores pueden eliminar recursos" });
  }
  try {
    const result = await db(req).query("DELETE FROM helpdesk.recursos WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.detectarPC = async (req, res) => {
  const { serial, marca, modelo, procesador, memoria_gb, almacenamiento_gb, sistema_operativo, nombre, session_code, atributos } = req.body;
  if (!serial) return res.status(400).json({ error: "Serial es requerido" });
  if (!session_code) return res.status(400).json({ error: "session_code es requerido" });

  let serialExists = false;
  let existingRecurso = null;
  try {
    const result = await db(req).query(
      `SELECT r.*, t.razon_social AS cliente_nombre
       FROM helpdesk.recursos r
       LEFT JOIN facturacion.terceros t ON t.id = r.cliente_id
       WHERE r.serial = $1`,
      [serial]
    );
    if (result.rows.length > 0) {
      serialExists = true;
      existingRecurso = result.rows[0];
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  pendingDetections.set(session_code, {
    serial,
    marca: marca || null,
    modelo: modelo || null,
    procesador: procesador || null,
    memoria_gb: memoria_gb ? Number(memoria_gb) : null,
    almacenamiento_gb: almacenamiento_gb ? Number(almacenamiento_gb) : null,
    sistema_operativo: sistema_operativo || null,
    nombre: nombre || serial,
    atributos: atributos || {},
    serial_exists: serialExists,
    existing_recurso: existingRecurso,
    timestamp: Date.now()
  });

  res.json({ recibido: true, session_code, serial_exists: serialExists, existing_recurso: existingRecurso });
};

exports.obtenerPendiente = async (req, res) => {
  const { session_code } = req.params;
  const data = pendingDetections.get(session_code);
  if (!data) return res.status(404).json({ error: "No hay datos pendientes para este código" });
  res.json(data);
};

exports.scriptPS = async (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const serverUrl = `${proto}://${req.get('host')}`;
  const clienteId = req.query.cliente_id ? Number(req.query.cliente_id) : null;
  const sessionCode = req.query.session || "";

  const clienteLine = clienteId
    ? `$clienteId = ${clienteId}`
    : `$clienteId = $null`;

  const sessionLine = sessionCode
    ? `$sessionCode = "${sessionCode}"`
    : `$sessionCode = ""`;

  const psScript = `# Maxan Helpdesk - Detectar PC
# Ejecutar en PowerShell como Administrador

$bios = Get-CimInstance Win32_BIOS
$cs = Get-CimInstance Win32_ComputerSystem
$cpu = Get-CimInstance Win32_Processor
$ram = [math]::Round((Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum).Sum / 1GB, 1)
$disk = [math]::Round((Get-CimInstance Win32_DiskDrive | Where-Object { $_.MediaType -ne "Removable Media" } | Measure-Object -Property Size -Sum).Sum / 1GB, 1)
$os = (Get-CimInstance Win32_OperatingSystem).Caption
$nombrePC = $env:COMPUTERNAME

# --- Tipo de almacenamiento (SSD/HDD) ---
$tipoDisco = "Desconocido"
try {
    $discoFisico = Get-CimInstance MSFT_PhysicalDisk -Namespace root\Microsoft\Windows\Storage -ErrorAction Stop | Where-Object { $_.MediaType -ne 0 } | Select-Object -First 1
    if ($discoFisico) {
        switch ($discoFisico.MediaType) {
            4 { $tipoDisco = "SSD" }
            3 { $tipoDisco = "HDD" }
            default { $tipoDisco = "Desconocido" }
        }
    }
} catch {
    try {
        $disco = Get-CimInstance Win32_DiskDrive | Where-Object { $_.MediaType -ne "Removable Media" } | Select-Object -First 1
        if ($disco -and $disco.Caption -match "SSD") { $tipoDisco = "SSD" }
        elseif ($disco) { $tipoDisco = "HDD" }
    } catch {}
}

# --- Chip de video ---
$gpuName = ""
$vramMB = $null
try {
    $gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1
    if ($gpu) {
        $gpuName = $gpu.Name
        if ($gpu.AdapterRAM -gt 0) { $vramMB = [math]::Round($gpu.AdapterRAM / 1MB, 0) }
    }
} catch {}

${clienteLine}
${sessionLine}

$atributos = @{
    tipo_almacenamiento = $tipoDisco
    chip_video = $gpuName
    memoria_video_mb = $vramMB
}

$body = @{
    serial = $bios.SerialNumber.Trim()
    marca = $cs.Manufacturer
    modelo = $cs.Model
    procesador = $cpu.Name
    memoria_gb = $ram
    almacenamiento_gb = $disk
    sistema_operativo = $os
    nombre = $nombrePC
    cliente_id = $clienteId
    session_code = $sessionCode
    atributos = $atributos
} | ConvertTo-Json -Depth 5

try {
    $res = Invoke-RestMethod -Uri '${serverUrl}/api/helpdesk/recursos/detectar-pc' \`
      -Method Post -Body $body -ContentType "application/json"
    if ($res.serial_exists) {
        Write-Host "ATENCION: El serial ya existe registrado en otro equipo" -ForegroundColor Yellow
        Write-Host "Equipo actual: $($res.existing_recurso.nombre) - Cliente: $($res.existing_recurso.cliente_nombre)" -ForegroundColor Yellow
    } else {
        Write-Host "Datos enviados correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Read-Host "Presiona Enter para salir"`;

  if (req.query.format === 'bat') {
    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    const batScript = `@echo off
powershell -ExecutionPolicy Bypass -NoProfile -EncodedCommand ${encoded}
`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send(batScript);
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(psScript);
};
