function getPool(req) {
  return req.app.locals.pool;
}

async function create(req, res) {
  const pool = getPool(req);
  const { nombre, categoria, inventariable, unidad_medida } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "El nombre del producto es obligatorio" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO inventario.productos (nombre, categoria, inventariable, unidad_medida)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre.trim(), categoria || null, inventariable !== false, unidad_medida || "UND"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function list(req, res) {
  const pool = getPool(req);
  const { categoria } = req.query;

  try {
    let sql = "SELECT * FROM inventario.productos";
    const params = [];
    if (categoria) {
      sql += " WHERE categoria = $1";
      params.push(categoria);
    }
    sql += " ORDER BY nombre";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar productos:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM inventario.productos WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, list, getById };
