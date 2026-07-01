function getPool(req) {
  return req.app.locals.pool;
}

async function list(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query("SELECT * FROM inventario.categorias ORDER BY nombre");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar categorías:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  const pool = getPool(req);
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "El nombre de la categoría es obligatorio" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO inventario.categorias (nombre) VALUES ($1) RETURNING *",
      [nombre.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: `La categoría '${nombre}' ya existe` });
    }
    console.error("Error al crear categoría:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM inventario.categorias WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ deleted: true });
  } catch (error) {
    console.error("Error al eliminar categoría:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { list, create, remove };
