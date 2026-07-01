function getPool(req) {
  return req.app.locals.pool;
}

async function listItems(req, res) {
  const pool = getPool(req);
  const { venta_id, descripcion, fecha_desde, fecha_hasta } = req.query;

  try {
    let sql = `
      SELECT vi.*, v.numero_completo, v.fecha_emision,
             t.razon_social AS cliente, t.numero_documento AS nit_cliente
      FROM facturacion.ventas_items vi
      JOIN facturacion.ventas v ON v.id = vi.venta_id
      LEFT JOIN facturacion.terceros t ON t.id = v.receptor_id
      WHERE 1=1`;
    const params = [];
    let idx = 1;

    if (venta_id) {
      sql += ` AND vi.venta_id = $${idx++}`;
      params.push(venta_id);
    }
    if (descripcion) {
      sql += ` AND vi.descripcion ILIKE $${idx++}`;
      params.push(`%${descripcion}%`);
    }
    if (fecha_desde) {
      sql += ` AND v.fecha_emision >= $${idx++}`;
      params.push(fecha_desde);
    }
    if (fecha_hasta) {
      sql += ` AND v.fecha_emision <= $${idx++}`;
      params.push(fecha_hasta);
    }

    sql += " ORDER BY v.fecha_emision DESC, vi.venta_id, vi.numero_linea";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar items de venta:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  const pool = getPool(req);
  const client = await pool.connect();

  try {
    const {
      receptor,
      fecha_emision,
      moneda,
      items,
    } = req.body;

    if (!receptor || !receptor.razon_social || !receptor.numero_documento) {
      return res.status(400).json({ error: "Se requiere receptor con razon_social y numero_documento" });
    }
    if (!fecha_emision) {
      return res.status(400).json({ error: "La fecha de emisión es obligatoria" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Debe incluir al menos un ítem" });
    }

    await client.query("BEGIN");

    const upsertQ = `
      INSERT INTO facturacion.terceros
        (tipo_documento, numero_documento, razon_social, direccion, ciudad, departamento, pais)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (tipo_documento, numero_documento)
      DO UPDATE SET
        razon_social = EXCLUDED.razon_social,
        direccion = EXCLUDED.direccion,
        ciudad = EXCLUDED.ciudad,
        departamento = EXCLUDED.departamento,
        updated_at = now()
      RETURNING id`;

    const receptorVals = [
      receptor.tipo_documento || "13",
      receptor.numero_documento,
      receptor.razon_social,
      receptor.direccion || null,
      receptor.ciudad || null,
      receptor.departamento || null,
      "CO",
    ];
    const receptorResult = await client.query(upsertQ, receptorVals);
    const receptorId = receptorResult.rows[0].id;

    const subtotal = items.reduce((s, it) => s + (it.valor_linea || 0), 0);
    const total = items.reduce((s, it) => s + (it.valor_total || it.valor_linea || 0), 0);

    const ventaResult = await client.query(
      `INSERT INTO facturacion.ventas
         (numero_completo, fecha_emision, moneda,
          valor_subtotal, valor_a_pagar,
          emisor_id, receptor_id, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        `VENTA-${Date.now()}`,
        fecha_emision,
        moneda || "COP",
        subtotal,
        total || subtotal,
        1,
        receptorId,
        "recibida",
      ]
    );
    const ventaId = ventaResult.rows[0].id;

    let linea = 1;
    for (const item of items) {
      if (!item.descripcion || !item.valor_unitario) continue;
      await client.query(
        `INSERT INTO facturacion.ventas_items
           (venta_id, numero_linea, descripcion, codigo_producto,
            cantidad, unidad_medida, valor_unitario, valor_linea)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          ventaId,
          linea++,
          item.descripcion,
          item.codigo_producto || null,
          item.cantidad || 1,
          item.unidad_medida || "UND",
          item.valor_unitario,
          item.valor_linea || (item.cantidad || 1) * item.valor_unitario,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      venta_id: ventaId,
      numero: `VENTA-${ventaId}`,
      total: total || subtotal,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear venta manual:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

module.exports = { listItems, create };
