function getPool(req) {
  return req.app.locals.pool;
}

async function utilidad(req, res) {
  const pool = getPool(req);
  const { factura_id } = req.params;

  try {
    const facturaResult = await pool.query(
      `SELECT id, numero_completo, valor_subtotal, valor_total_impuestos, valor_a_pagar
       FROM facturacion.ventas WHERE id = $1`,
      [factura_id]
    );
    if (facturaResult.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    const utilidadResult = await pool.query(
      `SELECT v.*
       FROM facturacion.vw_utilidad_items v
       JOIN facturacion.ventas_items fi ON fi.id = v.factura_item_id
       WHERE fi.venta_id = $1
       ORDER BY fi.numero_linea`,
      [factura_id]
    );

    const lineas = utilidadResult.rows;
    const totalUtilidad = lineas.reduce((sum, l) => sum + parseFloat(l.utilidad || 0), 0);
    const totalCostoInventario = lineas.reduce((sum, l) => sum + parseFloat(l.costo_inventario || 0), 0);
    const totalCostoDirecto = lineas.reduce((sum, l) => sum + parseFloat(l.costo_directo || 0), 0);

    res.json({
      factura: facturaResult.rows[0],
      resumen: {
        total_ingresos: parseFloat(facturaResult.rows[0].valor_a_pagar),
        total_costo_inventario: totalCostoInventario,
        total_costo_directo: totalCostoDirecto,
        total_costos: totalCostoInventario + totalCostoDirecto,
        total_utilidad: totalUtilidad,
        margen_porcentaje: facturaResult.rows[0].valor_a_pagar > 0
          ? Math.round((totalUtilidad / facturaResult.rows[0].valor_a_pagar) * 10000) / 100
          : 0,
      },
      lineas,
    });
  } catch (error) {
    console.error("Error al calcular utilidad:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { utilidad };
