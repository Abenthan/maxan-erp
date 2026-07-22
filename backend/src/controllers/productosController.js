function getPool(req) {
  return req.app.locals.pool;
}

async function create(req, res) {
  const pool = getPool(req);
  const { codigo, nombre, categoria, inventariable, unidad_medida } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "El nombre del producto es obligatorio" });
  }
  if (!codigo || !codigo.trim()) {
    return res.status(400).json({ error: "El código del producto es obligatorio" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO inventario.productos (codigo, nombre, categoria, inventariable, unidad_medida)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [codigo.trim(), nombre.trim(), categoria || null, inventariable !== false, unidad_medida || "UND"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'uq_productos_codigo') {
      return res.status(409).json({ error: `Ya existe un producto con el código '${codigo}'` });
    }
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

async function update(req, res) {
  const pool = getPool(req);
  const { id } = req.params;
  const { codigo, nombre, categoria, inventariable, unidad_medida } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "El nombre del producto es obligatorio" });
  }
  if (!codigo || !codigo.trim()) {
    return res.status(400).json({ error: "El código del producto es obligatorio" });
  }

  try {
    const result = await pool.query(
      `UPDATE inventario.productos
       SET codigo = $1, nombre = $2, categoria = $3, inventariable = $4, unidad_medida = $5, updated_at = now()
       WHERE id = $6
       RETURNING *`,
      [codigo.trim(), nombre.trim(), categoria || null, inventariable !== false, unidad_medida || "UND", id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'uq_productos_codigo') {
      return res.status(409).json({ error: `Ya existe un producto con el código '${codigo}'` });
    }
    console.error("Error al actualizar producto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  const pool = getPool(req);
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM inventario.productos WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({ error: "No se puede eliminar el producto porque tiene registros asociados (gastos, ventas, inventario, etc.)" });
    }
    console.error("Error al eliminar producto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, list, getById, update, remove };
