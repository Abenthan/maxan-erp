function getPool(req) {
  return req.app.locals.pool;
}

const SELECT_VENTA = `
  SELECT
    pv.id,
    pv.producto_id,
    p.codigo,
    p.nombre,
    p.categoria,
    p.inventariable,
    p.unidad_medida,
    pv.precio,
    pv.activo,
    pv.destacado,
    pv.descripcion,
    pv.created_at,
    pv.updated_at
  FROM tienda.productos_venta pv
  JOIN inventario.productos p ON p.id = pv.producto_id
`;

async function listar(req, res) {
  const pool = getPool(req);
  const { q } = req.query;

  try {
    const params = [];
    let where = "";
    if (q && q.trim()) {
      where = `WHERE (p.codigo ILIKE $1 OR p.nombre ILIKE $1)`;
      params.push(`%${q.trim()}%`);
    }
    const result = await pool.query(
      `${SELECT_VENTA} ${where} ORDER BY p.nombre`,
      params
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar productos de la tienda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorProducto(req, res) {
  const pool = getPool(req);
  const { producto_id } = req.params;

  try {
    const result = await pool.query(
      `${SELECT_VENTA} WHERE pv.producto_id = $1`,
      [producto_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "El producto no tiene un registro en la tienda" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producto de la tienda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function productosDisponibles(req, res) {
  const pool = getPool(req);
  const { q } = req.query;

  try {
    const params = [];
    let where = "WHERE pv.id IS NULL";
    if (q && q.trim()) {
      where += " AND (p.codigo ILIKE $1 OR p.nombre ILIKE $1)";
      params.push(`%${q.trim()}%`);
    }
    const result = await pool.query(
      `SELECT p.id, p.codigo, p.nombre, p.categoria, p.inventariable, p.unidad_medida
       FROM inventario.productos p
       LEFT JOIN tienda.productos_venta pv ON pv.producto_id = p.id
       ${where}
       ORDER BY p.nombre
       LIMIT 200`,
      params
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar productos disponibles:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function crear(req, res) {
  const pool = getPool(req);
  const { producto_id, precio, activo, destacado, descripcion } = req.body;

  if (!producto_id || !Number.isInteger(Number(producto_id))) {
    return res.status(400).json({ error: "El producto es obligatorio" });
  }
  const precioNum = Number(precio);
  if (precio === undefined || precio === null || precio === "" || isNaN(precioNum) || precioNum < 0) {
    return res.status(400).json({ error: "El precio es obligatorio y debe ser mayor o igual a 0" });
  }

  try {
    const existe = await pool.query(
      "SELECT 1 FROM inventario.productos WHERE id = $1",
      [producto_id]
    );
    if (existe.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado en inventario" });
    }

    const result = await pool.query(
      `INSERT INTO tienda.productos_venta (producto_id, precio, activo, destacado, descripcion)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        producto_id,
        precioNum,
        activo !== false,
        destacado === true,
        descripcion && descripcion.trim() ? descripcion.trim() : null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "El producto ya tiene un registro en la tienda" });
    }
    console.error("Error al crear registro de tienda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  const pool = getPool(req);
  const { producto_id } = req.params;
  const { precio, activo, destacado, descripcion } = req.body;

  const precioNum = Number(precio);
  if (precio === undefined || precio === null || precio === "" || isNaN(precioNum) || precioNum < 0) {
    return res.status(400).json({ error: "El precio es obligatorio y debe ser mayor o igual a 0" });
  }

  try {
    const result = await pool.query(
      `UPDATE tienda.productos_venta
       SET precio = $1, activo = $2, destacado = $3, descripcion = $4, updated_at = now()
       WHERE producto_id = $5
       RETURNING *`,
      [
        precioNum,
        activo !== false,
        destacado === true,
        descripcion && descripcion.trim() ? descripcion.trim() : null,
        producto_id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "El producto no tiene un registro en la tienda" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar registro de tienda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  const pool = getPool(req);
  const { producto_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tienda.productos_venta WHERE producto_id = $1 RETURNING id",
      [producto_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "El producto no tiene un registro en la tienda" });
    }
    res.json({ success: true, message: "Registro eliminado de la tienda" });
  } catch (error) {
    console.error("Error al eliminar registro de tienda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  listar,
  obtenerPorProducto,
  productosDisponibles,
  crear,
  actualizar,
  eliminar,
};
