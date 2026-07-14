const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  const { recurso_id, estado, tecnico_id, cliente_id } = req.query;
  let sql = `SELECT m.*, r.nombre AS recurso_nombre, r.serial AS recurso_serial,
             c.nombre AS categoria_nombre, c.color AS categoria_color,
             u.nombres || ' ' || u.apellidos AS tecnico_nombre
             FROM helpdesk.mantenimientos m
             JOIN helpdesk.recursos r ON r.id = m.recurso_id
             JOIN helpdesk.categorias_mantenimiento c ON c.id = m.categoria_id
             LEFT JOIN usuarios.usuarios u ON u.id = m.tecnico_id
             WHERE 1=1`;
  const params = [];
  if (recurso_id) { params.push(recurso_id); sql += ` AND m.recurso_id = $${params.length}`; }
  if (estado) { params.push(estado); sql += ` AND m.estado = $${params.length}`; }
  if (tecnico_id) { params.push(tecnico_id); sql += ` AND m.tecnico_id = $${params.length}`; }
  if (cliente_id) { params.push(cliente_id); sql += ` AND r.cliente_id = $${params.length}`; }
  sql += " ORDER BY m.created_at DESC";
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
      `SELECT m.*, r.nombre AS recurso_nombre, r.serial AS recurso_serial,
              c.nombre AS categoria_nombre, c.color AS categoria_color,
              u.nombres || ' ' || u.apellidos AS tecnico_nombre
       FROM helpdesk.mantenimientos m
       JOIN helpdesk.recursos r ON r.id = m.recurso_id
       JOIN helpdesk.categorias_mantenimiento c ON c.id = m.categoria_id
       LEFT JOIN usuarios.usuarios u ON u.id = m.tecnico_id
       WHERE m.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Mantenimiento no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { recurso_id, categoria_id, tecnico_id, titulo, descripcion, prioridad, estado, fecha_solicitud, costo_mano_obra, costo_repuestos, observaciones } = req.body;
  try {
    const result = await db(req).query(
      `INSERT INTO helpdesk.mantenimientos
       (recurso_id, categoria_id, tecnico_id, titulo, descripcion, prioridad, estado, fecha_solicitud, costo_mano_obra, costo_repuestos, observaciones)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [recurso_id, categoria_id, tecnico_id, titulo, descripcion, prioridad || 'Media', estado || 'Pendiente', fecha_solicitud || new Date(), costo_mano_obra || 0, costo_repuestos || 0, observaciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizar = async (req, res) => {
  const { recurso_id, categoria_id, tecnico_id, titulo, descripcion, prioridad, estado, fecha_solicitud, fecha_ejecucion, costo_mano_obra, costo_repuestos, venta_item_id, observaciones } = req.body;
  try {
    const result = await db(req).query(
      `UPDATE helpdesk.mantenimientos SET
        recurso_id=$1, categoria_id=$2, tecnico_id=$3, titulo=$4, descripcion=$5,
        prioridad=$6, estado=$7, fecha_solicitud=$8, fecha_ejecucion=$9,
        costo_mano_obra=$10, costo_repuestos=$11, venta_item_id=$12, observaciones=$13
       WHERE id=$14 RETURNING *`,
      [recurso_id, categoria_id, tecnico_id, titulo, descripcion, prioridad, estado, fecha_solicitud, fecha_ejecucion, costo_mano_obra, costo_repuestos, venta_item_id, observaciones, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Mantenimiento no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
