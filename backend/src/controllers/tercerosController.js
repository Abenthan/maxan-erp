function getPool(req) {
  return req.app.locals.pool;
}

async function list(req, res) {
  const pool = getPool(req);
  const { q, tipo_documento, tipo } = req.query;

  try {
    let sql = "SELECT * FROM generales.terceros WHERE 1=1";
    const params = [];
    let idx = 1;

    if (q) {
      sql += ` AND (razon_social ILIKE $${idx} OR (numero_documento IS NOT NULL AND numero_documento::text ILIKE $${idx}))`;
      params.push(`%${q}%`);
      idx++;
    }
    if (tipo_documento) {
      sql += ` AND tipo_documento = $${idx++}`;
      params.push(tipo_documento);
    }
    if (tipo === "cliente") {
      sql += ` AND es_cliente = $${idx++}`;
      params.push(true);
    } else if (tipo === "proveedor") {
      sql += ` AND es_proveedor = $${idx++}`;
      params.push(true);
    }

    sql += " ORDER BY razon_social";
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar terceros:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function get(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query("SELECT * FROM generales.terceros WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Tercero no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  const pool = getPool(req);
  const {
    tipo_documento, numero_documento, digito_verificacion, tipo_persona,
    razon_social, direccion, codigo_ciudad, ciudad, codigo_departamento,
    departamento, codigo_postal, pais, telefono, email, es_propio,
    es_cliente, es_proveedor,
  } = req.body;

    if (!razon_social) {
      return res.status(400).json({ error: "razon_social es obligatorio" });
    }

    const tieneDoc = tipo_documento && numero_documento;

    try {
      let queryText;

      if (tieneDoc) {
        queryText = `INSERT INTO generales.terceros
          (tipo_documento, numero_documento, digito_verificacion, tipo_persona,
           razon_social, direccion, codigo_ciudad, ciudad, codigo_departamento,
           departamento, codigo_postal, pais, telefono, email, es_propio,
           es_cliente, es_proveedor)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         ON CONFLICT (tipo_documento, numero_documento) WHERE tipo_documento IS NOT NULL AND numero_documento IS NOT NULL
         DO UPDATE SET
           razon_social = EXCLUDED.razon_social,
           direccion = EXCLUDED.direccion,
           ciudad = EXCLUDED.ciudad,
           departamento = EXCLUDED.departamento,
           telefono = EXCLUDED.telefono,
           email = EXCLUDED.email,
           es_cliente = CASE WHEN EXCLUDED.es_cliente THEN true ELSE generales.terceros.es_cliente END,
           es_proveedor = CASE WHEN EXCLUDED.es_proveedor THEN true ELSE generales.terceros.es_proveedor END,
           updated_at = now()
       RETURNING *`;
      } else {
        queryText = `INSERT INTO generales.terceros
          (tipo_documento, numero_documento, digito_verificacion, tipo_persona,
           razon_social, direccion, codigo_ciudad, ciudad, codigo_departamento,
           departamento, codigo_postal, pais, telefono, email, es_propio,
           es_cliente, es_proveedor)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         RETURNING *`;
      }

      const queryParams = [
        tipo_documento || null, numero_documento || null, digito_verificacion || null, tipo_persona || null,
        razon_social, direccion || null, codigo_ciudad || null, ciudad || null,
        codigo_departamento || null, departamento || null, codigo_postal || null,
        pais || "CO", telefono || null, email || null, es_propio || false,
        es_cliente ?? false, es_proveedor ?? false,
      ];

      const result = await pool.query(queryText, queryParams);
      res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear tercero:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  const pool = getPool(req);
  const { id } = req.params;
  const fields = req.body;

  try {
    const existente = await pool.query("SELECT * FROM generales.terceros WHERE id = $1", [id]);
    if (existente.rows.length === 0) return res.status(404).json({ error: "Tercero no encontrado" });

    const actualizado = { ...existente.rows[0], ...fields };
    const result = await pool.query(
      `UPDATE generales.terceros SET
        tipo_documento = $1, numero_documento = $2, digito_verificacion = $3,
        tipo_persona = $4, razon_social = $5, direccion = $6,
        codigo_ciudad = $7, ciudad = $8, codigo_departamento = $9,
        departamento = $10, codigo_postal = $11, pais = $12,
        telefono = $13, email = $14, es_propio = $15,
        es_cliente = $16, es_proveedor = $17, updated_at = now()
       WHERE id = $18 RETURNING *`,
      [
        actualizado.tipo_documento, actualizado.numero_documento,
        actualizado.digito_verificacion, actualizado.tipo_persona,
        actualizado.razon_social, actualizado.direccion,
        actualizado.codigo_ciudad, actualizado.ciudad,
        actualizado.codigo_departamento, actualizado.departamento,
        actualizado.codigo_postal, actualizado.pais,
        actualizado.telefono, actualizado.email, actualizado.es_propio,
        actualizado.es_cliente ?? false, actualizado.es_proveedor ?? false,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Ya existe un tercero con ese tipo y número de documento" });
    }
    console.error("Error al actualizar tercero:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  if (!req.user.permisos.includes("usuarios.gestionar")) {
    return res.status(403).json({ error: "Solo administradores pueden eliminar terceros" });
  }
  const pool = getPool(req);
  try {
    const result = await pool.query("DELETE FROM generales.terceros WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Tercero no encontrado" });
    res.json({ success: true, eliminado: result.rows[0] });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({ error: "No se puede eliminar el tercero porque tiene registros asociados (facturas, ventas, pagos, etc.)" });
    }
    console.error("Error al eliminar tercero:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { list, get, create, update, remove };
