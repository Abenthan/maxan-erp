const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  const { estado, categoria_id, recurso_id, cliente_id, tecnico_id, q } = req.query;
  let sql = `SELECT c.*, cat.nombre AS categoria_nombre, cat.color AS categoria_color,
             u.nombres || ' ' || u.apellidos AS tecnico_nombre,
             t.razon_social AS cliente_nombre,
             r.nombre AS recurso_nombre, r.serial AS recurso_serial
             FROM helpdesk.casos c
             LEFT JOIN helpdesk.categorias_caso cat ON cat.id = c.categoria_id
             LEFT JOIN usuarios.usuarios u ON u.id = c.tecnico_id
             LEFT JOIN facturacion.terceros t ON t.id = c.cliente_id
             LEFT JOIN helpdesk.recursos r ON r.id = c.recurso_id
             WHERE 1=1`;
  const params = [];
  if (estado) { params.push(estado); sql += ` AND c.estado = $${params.length}`; }
  if (categoria_id) { params.push(categoria_id); sql += ` AND c.categoria_id = $${params.length}`; }
  if (recurso_id) { params.push(recurso_id); sql += ` AND c.recurso_id = $${params.length}`; }
  if (cliente_id) { params.push(cliente_id); sql += ` AND c.cliente_id = $${params.length}`; }
  if (tecnico_id) { params.push(tecnico_id); sql += ` AND c.tecnico_id = $${params.length}`; }
  if (q) { params.push(`%${q}%`); sql += ` AND (c.titulo ILIKE $${params.length} OR c.numero ILIKE $${params.length} OR t.razon_social ILIKE $${params.length})`; }
  sql += " ORDER BY c.created_at DESC";
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
      `SELECT c.*, cat.nombre AS categoria_nombre, cat.color AS categoria_color,
              u.nombres || ' ' || u.apellidos AS tecnico_nombre,
              t.razon_social AS cliente_nombre, t.numero_documento AS cliente_documento,
              r.nombre AS recurso_nombre, r.serial AS recurso_serial,
              con.nombre AS contacto_nombre, con.telefono AS contacto_telefono, con.whatsapp AS contacto_whatsapp
       FROM helpdesk.casos c
       LEFT JOIN helpdesk.categorias_caso cat ON cat.id = c.categoria_id
       LEFT JOIN usuarios.usuarios u ON u.id = c.tecnico_id
       LEFT JOIN facturacion.terceros t ON t.id = c.cliente_id
       LEFT JOIN helpdesk.recursos r ON r.id = c.recurso_id
       LEFT JOIN helpdesk.contactos con ON con.id = c.contacto_id
       WHERE c.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Caso no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { titulo, descripcion, categoria_id, recurso_id, cliente_id, contacto_id, tecnico_id, fuente, estado } = req.body;
  try {
    const result = await db(req).query(
      `INSERT INTO helpdesk.casos
       (titulo, descripcion, categoria_id, recurso_id, cliente_id, contacto_id, tecnico_id, fuente, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [titulo, descripcion, categoria_id, recurso_id, cliente_id, contacto_id, tecnico_id, fuente || 'Manual', estado || 'Pendiente']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizar = async (req, res) => {
  const { titulo, descripcion, categoria_id, recurso_id, cliente_id, contacto_id, tecnico_id, estado, solucion, resumen, ai_report } = req.body;
  try {
    const result = await db(req).query(
      `UPDATE helpdesk.casos SET
        titulo=$1, descripcion=$2, categoria_id=$3, recurso_id=$4, cliente_id=$5,
        contacto_id=$6, tecnico_id=$7, estado=$8, solucion=$9, resumen=$10, ai_report=$11
       WHERE id=$12 RETURNING *`,
      [titulo, descripcion, categoria_id, recurso_id, cliente_id, contacto_id, tecnico_id, estado, solucion, resumen, ai_report, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Caso no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  const { estado, solucion, resumen } = req.body;
  const estadosValidos = ['Pendiente', 'En Progreso', 'Completado', 'Cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  try {
    const result = await db(req).query(
      `UPDATE helpdesk.casos SET estado=$1, solucion=COALESCE($2, solucion), resumen=COALESCE($3, resumen) WHERE id=$4 RETURNING *`,
      [estado, solucion, resumen, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Caso no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarDetalles = async (req, res) => {
  try {
    const result = await db(req).query(
      `SELECT d.*, u.nombres || ' ' || u.apellidos AS creado_por_nombre
       FROM helpdesk.caso_detalles d
       LEFT JOIN usuarios.usuarios u ON u.id = d.creado_por
       WHERE d.caso_id = $1
       ORDER BY d.created_at`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearDetalle = async (req, res) => {
  const { contenido, tipo } = req.body;
  try {
    const result = await db(req).query(
      `INSERT INTO helpdesk.caso_detalles (caso_id, creado_por, contenido, tipo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.id, req.user?.id, contenido, tipo || 'Comentario']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
