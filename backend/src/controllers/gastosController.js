function getPool(req) {
  return req.app.locals.pool;
}

async function create(req, res) {
  const pool = getPool(req);
  const {
    factura_compra_id,
    proveedor_id,
    producto_id,
    venta_item_id,
    descripcion,
    clasificacion,
    cantidad,
    valor_unitario,
    valor_total,
    fecha,
  } = req.body;

  if (!descripcion || !descripcion.trim()) {
    return res.status(400).json({ error: "La descripción del gasto es obligatoria" });
  }
  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }
  if (!valor_unitario || valor_unitario <= 0) {
    return res.status(400).json({ error: "El valor unitario debe ser mayor a 0" });
  }

  if (!producto_id) {
    if (!clasificacion) {
      return res.status(400).json({
        error: "La clasificación es obligatoria cuando no se especifica un producto. Valores permitidos: Operacional, Administrativo",
      });
    }
    if (!["Operacional", "Administrativo"].includes(clasificacion)) {
      return res.status(400).json({
        error: "La clasificación debe ser 'Operacional' o 'Administrativo' cuando no hay producto",
      });
    }
  }

  if (venta_item_id && producto_id) {
    return res.status(400).json({
      error: "No puedes asignar un gasto de producto directamente a una venta. El producto debe pasar por inventario (usa consumir)",
    });
  }

  try {
    const computed_total = valor_total != null ? valor_total : cantidad * valor_unitario;

    const result = await pool.query(
      `INSERT INTO gastos.gastos
         (factura_compra_id, proveedor_id, producto_id, venta_item_id,
          descripcion, clasificacion, cantidad, valor_unitario, valor_total, fecha)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        factura_compra_id || null,
        proveedor_id || null,
        producto_id || null,
        venta_item_id || null,
        descripcion.trim(),
        clasificacion || null,
        cantidad,
        valor_unitario,
        computed_total,
        fecha || new Date(),
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23514") {
      return res.status(400).json({
        error: "No puedes asignar un gasto de producto a una venta. El producto debe registrarse en inventario y luego consumirse.",
      });
    }
    if (error.code === "23503") {
      const detail = error.detail || "";
      if (detail.includes("producto_id")) {
        return res.status(400).json({ error: "El producto especificado no existe" });
      }
      if (detail.includes("venta_item_id")) {
        return res.status(400).json({ error: "El ítem de venta especificado no existe" });
      }
      if (detail.includes("factura_compra_id")) {
        return res.status(400).json({ error: "La factura de compra especificada no existe" });
      }
      if (detail.includes("proveedor_id")) {
        return res.status(400).json({ error: "El proveedor especificado no existe" });
      }
    }
    console.error("Error al crear gasto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function list(req, res) {
  const pool = getPool(req);
  const { factura_compra_id, clasificacion, fecha_desde, fecha_hasta } = req.query;

  try {
    let sql = "SELECT * FROM gastos.gastos WHERE 1=1";
    const params = [];
    let idx = 1;

    if (factura_compra_id) {
      sql += ` AND factura_compra_id = $${idx++}`;
      params.push(factura_compra_id);
    }
    if (clasificacion) {
      sql += ` AND clasificacion = $${idx++}`;
      params.push(clasificacion);
    }
    if (fecha_desde) {
      sql += ` AND fecha >= $${idx++}`;
      params.push(fecha_desde);
    }
    if (fecha_hasta) {
      sql += ` AND fecha <= $${idx++}`;
      params.push(fecha_hasta);
    }

    sql += " ORDER BY fecha DESC, id DESC";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar gastos:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM gastos.gastos WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener gasto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  const pool = getPool(req);
  const { id } = req.params;
  const {
    descripcion,
    clasificacion,
    cantidad,
    valor_unitario,
    valor_total,
    fecha,
    producto_id,
  } = req.body;

  if (!descripcion || !descripcion.trim()) {
    return res.status(400).json({ error: "La descripción del gasto es obligatoria" });
  }
  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }
  if (!valor_unitario || valor_unitario <= 0) {
    return res.status(400).json({ error: "El valor unitario debe ser mayor a 0" });
  }

  try {
    const computed_total = valor_total != null ? valor_total : cantidad * valor_unitario;
    const result = await pool.query(
      `UPDATE gastos.gastos
       SET descripcion = $1, clasificacion = $2, cantidad = $3,
           valor_unitario = $4, valor_total = $5, fecha = $6,
           producto_id = $7, updated_at = now()
       WHERE id = $8
       RETURNING *`,
      [
        descripcion.trim(),
        clasificacion || null,
        cantidad,
        valor_unitario,
        computed_total,
        fecha || new Date(),
        producto_id || null,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar gasto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, list, getById, update };
