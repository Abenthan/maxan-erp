const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  try {
    const result = await db(req).query(
      `SELECT d.*, u.nombres || ' ' || u.apellidos AS creado_por_nombre
       FROM helpdesk.mantenimiento_detalles d
       LEFT JOIN usuarios.usuarios u ON u.id = d.creado_por
       WHERE d.mantenimiento_id = $1
       ORDER BY d.created_at`,
      [req.params.mantenimiento_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { contenido, tipo } = req.body;
  try {
    const result = await db(req).query(
      `INSERT INTO helpdesk.mantenimiento_detalles (mantenimiento_id, creado_por, contenido, tipo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.mantenimiento_id, req.user?.id, contenido, tipo || 'Comentario']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
