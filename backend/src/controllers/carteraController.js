function getPool(req) {
  return req.app.locals.pool;
}

async function listPagos(req, res) {
  const pool = getPool(req);
  const { cliente_id, fecha_desde, fecha_hasta, anulado } = req.query;

  try {
    let sql = "SELECT * FROM cartera.vw_pagos_resumen WHERE 1=1";
    const params = [];
    let idx = 1;

    if (cliente_id) {
      sql += ` AND cliente_id = $${idx++}`;
      params.push(cliente_id);
    }
    if (fecha_desde) {
      sql += ` AND fecha_pago >= $${idx++}`;
      params.push(fecha_desde);
    }
    if (fecha_hasta) {
      sql += ` AND fecha_pago <= $${idx++}`;
      params.push(fecha_hasta);
    }
    if (anulado !== undefined && anulado !== '') {
      sql += ` AND anulado = $${idx++}`;
      params.push(anulado === 'true');
    }

    sql += " ORDER BY fecha_pago DESC, id DESC";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar pagos:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getPago(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const pagoResult = await pool.query(
      "SELECT pr.*, p.medio_pago_id, p.observaciones FROM cartera.vw_pagos_resumen pr JOIN cartera.pagos p ON p.id = pr.id WHERE pr.id = $1",
      [id]
    );
    if (pagoResult.rows.length === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    const aplicaciones = await pool.query(
      `SELECT pa.*, v.numero_completo AS factura_numero, v.fecha_emision AS factura_fecha,
              v.valor_a_pagar AS factura_valor, v.saldo_pendiente
       FROM cartera.pago_aplicaciones pa
       JOIN facturacion.ventas v ON v.id = pa.venta_id
       WHERE pa.pago_id = $1
       ORDER BY pa.id`,
      [id]
    );

    res.json({ ...pagoResult.rows[0], aplicaciones: aplicaciones.rows });
  } catch (error) {
    console.error("Error al obtener pago:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function createPago(req, res) {
  const pool = getPool(req);
  const client = await pool.connect();

  try {
    const { cliente_id, medio_pago_id, referencia, fecha_pago, valor_total, observaciones, aplicaciones } = req.body;

    if (!cliente_id) {
      return res.status(400).json({ error: "El cliente es obligatorio" });
    }
    if (!valor_total || valor_total <= 0) {
      return res.status(400).json({ error: "El valor total debe ser mayor a 0" });
    }
    if (!aplicaciones || aplicaciones.length === 0) {
      return res.status(400).json({ error: "Debe aplicar el pago a al menos una factura" });
    }

    await client.query("BEGIN");

    // Guardar retención a nivel factura
    for (const app of aplicaciones) {
      const retencion = parseFloat(app.retencion) || 0;
      if (retencion > 0 && app.venta_id) {
        await client.query(
          `UPDATE facturacion.ventas SET valor_retencion_fuente = $1 WHERE id = $2`,
          [retencion, app.venta_id]
        );
      }
    }

    const pagoResult = await client.query(
      `INSERT INTO cartera.pagos (cliente_id, medio_pago_id, referencia, fecha_pago, valor_total, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        cliente_id,
        medio_pago_id || null,
        referencia || null,
        fecha_pago || new Date(),
        valor_total,
        observaciones || null,
      ]
    );
    const pago = pagoResult.rows[0];

    let totalAplicado = 0;
    for (const app of aplicaciones) {
      if (!app.venta_id || !app.valor_aplicado || app.valor_aplicado <= 0) continue;
      totalAplicado += app.valor_aplicado;

      await client.query(
        `INSERT INTO cartera.pago_aplicaciones (pago_id, venta_id, valor_aplicado)
         VALUES ($1, $2, $3)`,
        [pago.id, app.venta_id, app.valor_aplicado]
      );
    }

    if (Math.abs(totalAplicado - valor_total) > 0.01) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: `La suma de aplicaciones (${totalAplicado}) no coincide con el valor total del pago (${valor_total})`,
      });
    }

    await client.query("COMMIT");

    const completo = await pool.query(
      "SELECT * FROM cartera.vw_pagos_resumen WHERE id = $1",
      [pago.id]
    );

    res.status(201).json(completo.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear pago:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

async function updatePago(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const { fecha_pago, medio_pago_id, referencia, observaciones } = req.body;

    const existente = await pool.query(
      "SELECT * FROM cartera.pagos WHERE id = $1",
      [id]
    );
    if (existente.rows.length === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    if (existente.rows[0].anulado) {
      return res.status(400).json({ error: "No se puede editar un pago anulado" });
    }

    const result = await pool.query(
      `UPDATE cartera.pagos
       SET fecha_pago = $1, medio_pago_id = $2, referencia = $3, observaciones = $4, updated_at = now()
       WHERE id = $5
       RETURNING *`,
      [
        fecha_pago || existente.rows[0].fecha_pago,
        medio_pago_id || null,
        referencia !== undefined ? referencia : existente.rows[0].referencia,
        observaciones !== undefined ? observaciones : existente.rows[0].observaciones,
        id,
      ]
    );

    const completo = await pool.query(
      "SELECT * FROM cartera.vw_pagos_resumen WHERE id = $1",
      [id]
    );

    res.json(completo.rows[0]);
  } catch (error) {
    console.error("Error al actualizar pago:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function anularPago(req, res) {
  const pool = getPool(req);
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const existente = await client.query(
      "SELECT * FROM cartera.pagos WHERE id = $1",
      [id]
    );
    if (existente.rows.length === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    if (existente.rows[0].anulado) {
      return res.status(400).json({ error: "El pago ya está anulado" });
    }

    await client.query("BEGIN");

    const aplicaciones = await client.query(
      "SELECT * FROM cartera.pago_aplicaciones WHERE pago_id = $1",
      [id]
    );

    for (const app of aplicaciones.rows) {
      await client.query(
        "DELETE FROM cartera.pago_aplicaciones WHERE id = $1",
        [app.id]
      );
    }

    await client.query(
      "UPDATE cartera.pagos SET anulado = TRUE, observaciones = COALESCE(observaciones || ' | ', '') || 'ANULADO', updated_at = now() WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    res.json({ success: true, message: "Pago anulado correctamente" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al anular pago:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

async function listCarteraActiva(req, res) {
  const pool = getPool(req);
  const { cliente_id, estado_cartera, dias_max } = req.query;

  try {
    let sql = "SELECT * FROM cartera.vw_cartera_activa WHERE 1=1";
    const params = [];
    let idx = 1;

    if (cliente_id) {
      sql += ` AND cliente_id = $${idx++}`;
      params.push(cliente_id);
    }
    if (estado_cartera) {
      sql += ` AND estado_cartera = $${idx++}`;
      params.push(estado_cartera);
    }
    if (dias_max) {
      sql += ` AND dias_vencida <= $${idx++}`;
      params.push(parseInt(dias_max, 10));
    }

    sql += " ORDER BY dias_vencida DESC, fecha_vencimiento_pago NULLS LAST";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar cartera activa:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function listMediosPago(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query("SELECT * FROM cartera.medios_pago ORDER BY nombre");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar medios de pago:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function createMedioPago(req, res) {
  const pool = getPool(req);
  const { nombre } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "El nombre del medio de pago es obligatorio" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO cartera.medios_pago (nombre) VALUES ($1) RETURNING *",
      [nombre.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "El medio de pago ya existe" });
    }
    console.error("Error al crear medio de pago:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function listClientesConDeuda(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      `SELECT t.id, t.razon_social, t.numero_documento,
              COALESCE(SUM(v.saldo_pendiente), 0) AS total_deuda,
              COUNT(v.id) AS facturas_pendientes
       FROM facturacion.terceros t
       JOIN facturacion.ventas v ON v.receptor_id = t.id
       WHERE v.estado NOT IN ('anulada', 'rechazada', 'pagada')
         AND COALESCE(v.saldo_pendiente, v.valor_a_pagar) > 0
       GROUP BY t.id, t.razon_social, t.numero_documento
       ORDER BY total_deuda DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar clientes con deuda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getFacturasPendientesCliente(req, res) {
  const pool = getPool(req);
  const { cliente_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT v.id AS venta_id, v.numero_completo, v.fecha_emision,
              v.fecha_vencimiento_pago, v.valor_a_pagar,
              v.valor_retencion_fuente,
              COALESCE(v.saldo_pendiente, v.valor_a_pagar) AS saldo_pendiente
       FROM facturacion.ventas v
       WHERE v.receptor_id = $1
         AND v.estado NOT IN ('anulada', 'rechazada', 'pagada')
         AND COALESCE(v.saldo_pendiente, v.valor_a_pagar) > 0
       ORDER BY v.fecha_vencimiento_pago NULLS LAST, v.fecha_emision`,
      [cliente_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener facturas pendientes del cliente:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function listRetenciones(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      `SELECT
         v.id AS venta_id,
         v.numero_completo,
         t.razon_social AS cliente,
         t.numero_documento AS nit_cliente,
         v.fecha_emision,
         v.valor_a_pagar,
         v.valor_retencion_fuente AS retencion_total,
         v.estado,
         v.saldo_pendiente
       FROM facturacion.ventas v
       JOIN facturacion.terceros t ON t.id = v.receptor_id
       WHERE v.valor_retencion_fuente > 0
       ORDER BY v.fecha_emision DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar retenciones:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  listPagos,
  getPago,
  createPago,
  updatePago,
  anularPago,
  listCarteraActiva,
  listMediosPago,
  createMedioPago,
  listClientesConDeuda,
  getFacturasPendientesCliente,
  listRetenciones,
};
