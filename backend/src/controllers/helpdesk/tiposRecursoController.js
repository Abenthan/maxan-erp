const db = (req) => req.app.locals.pool;

exports.list = async (req, res) => {
  try {
    const result = await db(req).query("SELECT * FROM helpdesk.tipos_recurso ORDER BY nombre");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "El nombre del tipo es obligatorio" });
  }
  try {
    const result = await db(req).query(
      "INSERT INTO helpdesk.tipos_recurso (nombre) VALUES ($1) RETURNING *",
      [nombre.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: `El tipo '${nombre}' ya existe` });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await db(req).query(
      "DELETE FROM helpdesk.tipos_recurso WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }
    res.json({ deleted: true });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        error: "No se puede eliminar este tipo porque está siendo usado por uno o más recursos"
      });
    }
    res.status(500).json({ error: err.message });
  }
};
