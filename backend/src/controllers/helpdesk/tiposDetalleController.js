const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  try {
    const result = await db(req).query("SELECT * FROM helpdesk.tipos_detalle ORDER BY nombre");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { nombre, color } = req.body;
  if (!nombre || !nombre.trim()) return res.status(400).json({ error: "El nombre es obligatorio" });
  try {
    const result = await db(req).query(
      "INSERT INTO helpdesk.tipos_detalle (nombre, color) VALUES ($1, $2) RETURNING *",
      [nombre.trim(), color || '#92400e']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: "Ya existe un tipo con ese nombre" });
    res.status(500).json({ error: err.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const uso = await db(req).query(
      "SELECT COUNT(*) AS cnt FROM helpdesk.caso_detalles WHERE tipo = (SELECT nombre FROM helpdesk.tipos_detalle WHERE id = $1)",
      [req.params.id]
    );
    if (parseInt(uso.rows[0].cnt) > 0) {
      return res.status(400).json({ error: `No se puede eliminar: está en uso en ${uso.rows[0].cnt} detalle(s)` });
    }
    const result = await db(req).query("DELETE FROM helpdesk.tipos_detalle WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Tipo no encontrado" });
    res.json({ message: "Tipo eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
