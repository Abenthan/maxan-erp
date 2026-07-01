function getPool(req) {
  return req.app.locals.pool;
}

async function dashboard(req, res) {
  const pool = getPool(req);
  const { mes, cliente_id, factura_id } = req.query;

  try {
    const ventasFilter = [];
    const gastosFilter = [];
    const params = [];
    let idx = 1;

    if (mes) {
      ventasFilter.push(`v.fecha_emision >= $${idx} AND v.fecha_emision < $${idx + 1}`);
      gastosFilter.push(`g.fecha >= $${idx} AND g.fecha < $${idx + 1}`);
      const [year, month] = mes.split("-");
      params.push(`${year}-${month}-01`, `${+month === 12 ? +year + 1 : year}-${+month === 12 ? "01" : String(+month + 1).padStart(2, "0")}-01`);
      idx += 2;
    }

    if (cliente_id) {
      ventasFilter.push(`v.receptor_id = $${idx}`);
      params.push(cliente_id);
      idx++;
    }

    if (factura_id) {
      ventasFilter.push(`v.id = $${idx}`);
      params.push(factura_id);
      idx++;
    }

    const ventasWhere = ventasFilter.length > 0 ? "WHERE " + ventasFilter.join(" AND ") : "";
    const gastosWhere = gastosFilter.length > 0 ? "WHERE " + gastosFilter.join(" AND ") : "";

    const [ventasRes, gastosRes, ventasMesRes, gastosMesRes, clasifRes, topClientesRes, ultimasRes, clientesRes, productosRes] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS cantidad, COALESCE(SUM(valor_a_pagar),0) AS total FROM facturacion.ventas v ${ventasWhere}`, params),
      pool.query(`SELECT COUNT(*)::int AS cantidad, COALESCE(SUM(valor_total),0) AS total FROM gastos.gastos g ${gastosWhere}`, params),
      pool.query(`
        SELECT to_char(v.fecha_emision, 'YYYY-MM') AS mes,
               COUNT(*)::int AS cantidad,
               COALESCE(SUM(valor_a_pagar),0) AS total
        FROM facturacion.ventas v ${ventasWhere}
        GROUP BY mes ORDER BY mes
      `, params),
      pool.query(`
        SELECT to_char(g.fecha, 'YYYY-MM') AS mes,
               COUNT(*)::int AS cantidad,
               COALESCE(SUM(valor_total),0) AS total
        FROM gastos.gastos g ${gastosWhere}
        GROUP BY mes ORDER BY mes
      `, params),
      pool.query(`
        SELECT clasificacion, COUNT(*)::int AS cantidad, COALESCE(SUM(valor_total),0) AS total
        FROM gastos.gastos g ${gastosWhere}
        GROUP BY clasificacion ORDER BY total DESC
      `, params),
      pool.query(`
        SELECT v.receptor_id AS cliente_id, t.razon_social,
               COUNT(*)::int AS cantidad_facturas, COALESCE(SUM(v.valor_a_pagar),0) AS total_ventas
        FROM facturacion.ventas v
        JOIN facturacion.terceros t ON t.id = v.receptor_id
        ${ventasWhere}
        GROUP BY v.receptor_id, t.razon_social ORDER BY total_ventas DESC LIMIT 10
      `, params),
      pool.query(`
        SELECT v.id, v.numero_completo, v.fecha_emision, t.razon_social AS cliente, v.valor_a_pagar
        FROM facturacion.ventas v
        JOIN facturacion.terceros t ON t.id = v.receptor_id
        ${ventasWhere}
        ORDER BY v.fecha_emision DESC LIMIT 10
      `, params),
      pool.query(`
        SELECT id, razon_social, numero_documento FROM facturacion.terceros
        WHERE id IN (SELECT DISTINCT receptor_id FROM facturacion.ventas) OR id IN (SELECT DISTINCT proveedor_id FROM compras.facturas_compra)
        ORDER BY razon_social
      `),
      pool.query(`SELECT * FROM inventario.vw_utilidad_productos ORDER BY ingreso_ventas DESC LIMIT 10`),
    ]);

    const totalVentas = parseFloat(ventasRes.rows[0].total);
    const totalGastos = parseFloat(gastosRes.rows[0].total);
    const utilidad = totalVentas - totalGastos;

    res.json({
      resumen: {
        total_ventas: totalVentas,
        cantidad_ventas: ventasRes.rows[0].cantidad,
        total_gastos: totalGastos,
        cantidad_gastos: gastosRes.rows[0].cantidad,
        utilidad,
        margen_porcentaje: totalVentas > 0 ? Math.round((utilidad / totalVentas) * 10000) / 100 : 0,
      },
      ventas_por_mes: ventasMesRes.rows,
      gastos_por_mes: gastosMesRes.rows,
      gastos_por_clasificacion: clasifRes.rows,
      top_clientes: topClientesRes.rows,
      ultimas_facturas: ultimasRes.rows,
      clientes: clientesRes.rows,
      productos_utilidad: productosRes.rows,
    });
  } catch (error) {
    console.error("Error en dashboard:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { dashboard };
