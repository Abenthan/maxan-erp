function getPool(req) {
  return req.app.locals.pool;
}

async function stock(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      "SELECT * FROM inventario.vw_stock_disponible ORDER BY nombre"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar stock:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function movimientos(req, res) {
  const pool = getPool(req);
  const { producto_id } = req.params;

  try {
    const entradas = await pool.query(
      `SELECT e.id, e.cantidad, e.cantidad_disponible, e.costo_unitario,
              e.fecha, g.descripcion, 'entrada' AS tipo
       FROM inventario.entradas e
       LEFT JOIN gastos.gastos g ON g.id = e.gasto_id
       WHERE e.producto_id = $1
       ORDER BY e.fecha ASC, e.id ASC`,
      [producto_id]
    );

    const salidas = await pool.query(
      `SELECT sd.id, sd.cantidad_consumida AS cantidad, sd.costo_unitario,
              s.created_at AS fecha, fi.descripcion, 'salida' AS tipo
       FROM inventario.salida_detalle sd
       JOIN inventario.salidas s ON s.id = sd.salida_id
       LEFT JOIN facturacion.factura_items fi ON fi.id = s.factura_item_id
       WHERE s.producto_id = $1
       ORDER BY s.created_at ASC`,
      [producto_id]
    );

    res.json({
      entradas: entradas.rows,
      salidas: salidas.rows,
    });
  } catch (error) {
    console.error("Error al consultar movimientos:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function consumir(req, res) {
  const pool = getPool(req);

  const { factura_item_id, producto_id, cantidad } = req.body;

  if (!factura_item_id) {
    return res.status(400).json({ error: "factura_item_id es requerido" });
  }
  if (!producto_id) {
    return res.status(400).json({ error: "producto_id es requerido" });
  }
  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lotesResult = await client.query(
      `SELECT id, cantidad_disponible, costo_unitario
       FROM inventario.entradas
       WHERE producto_id = $1 AND cantidad_disponible > 0
       ORDER BY fecha ASC, id ASC
       FOR UPDATE`,
      [producto_id]
    );

    const lotes = lotesResult.rows;
    const totalDisponible = lotes.reduce((sum, l) => sum + parseFloat(l.cantidad_disponible), 0);

    if (totalDisponible < cantidad) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${totalDisponible}, solicitado: ${cantidad}`,
      });
    }

    let pendiente = cantidad;
    const detalleConsumido = [];

    for (const lote of lotes) {
      if (pendiente <= 0) break;

      const loteDisp = parseFloat(lote.cantidad_disponible);
      const aConsumir = Math.min(loteDisp, pendiente);

      await client.query(
        `UPDATE inventario.entradas
         SET cantidad_disponible = cantidad_disponible - $1
         WHERE id = $2`,
        [aConsumir, lote.id]
      );

      detalleConsumido.push({
        entrada_id: lote.id,
        cantidad_consumida: aConsumir,
        costo_unitario: parseFloat(lote.costo_unitario),
      });

      pendiente -= aConsumir;
    }

    const costoTotal = detalleConsumido.reduce(
      (sum, d) => sum + d.cantidad_consumida * d.costo_unitario,
      0
    );

    const salidaResult = await client.query(
      `INSERT INTO inventario.salidas
         (factura_item_id, producto_id, cantidad, costo_total)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [factura_item_id, producto_id, cantidad, costoTotal]
    );

    const salidaId = salidaResult.rows[0].id;

    for (const detalle of detalleConsumido) {
      await client.query(
        `INSERT INTO inventario.salida_detalle
           (salida_id, entrada_id, cantidad_consumida, costo_unitario)
         VALUES ($1, $2, $3, $4)`,
        [salidaId, detalle.entrada_id, detalle.cantidad_consumida, detalle.costo_unitario]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      salida_id: salidaId,
      cantidad_total: cantidad,
      costo_total: costoTotal,
      lotes_usados: detalleConsumido.map((d) => ({
        entrada_id: d.entrada_id,
        cantidad_consumida: d.cantidad_consumida,
        costo_unitario: d.costo_unitario,
        subtotal: d.cantidad_consumida * d.costo_unitario,
      })),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23503") {
      const detail = error.detail || "";
      if (detail.includes("factura_item_id")) {
        return res.status(400).json({ error: "El ítem de factura especificado no existe" });
      }
      if (detail.includes("producto_id")) {
        return res.status(400).json({ error: "El producto especificado no existe" });
      }
    }
    console.error("Error al consumir inventario:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

module.exports = { stock, movimientos, consumir };
