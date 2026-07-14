const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  try {
    const result = await db(req).query("SELECT * FROM helpdesk.categorias_caso ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { nombre, color } = req.body;
  try {
    const result = await db(req).query(
      "INSERT INTO helpdesk.categorias_caso (nombre, color) VALUES ($1, $2) RETURNING *",
      [nombre, color || '#6B7280']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
    res.status(500).json({ error: err.message });
  }
};

exports.actualizar = async (req, res) => {
  const { nombre, color, activo } = req.body;
  try {
    const result = await db(req).query(
      "UPDATE helpdesk.categorias_caso SET nombre=$1, color=$2, activo=$3 WHERE id=$4 RETURNING *",
      [nombre, color, activo, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
    res.status(500).json({ error: err.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const result = await db(req).query("DELETE FROM helpdesk.categorias_caso WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
