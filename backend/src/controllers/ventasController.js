function getPool(req) {
  return req.app.locals.pool;
}

async function listItems(req, res) {
  const pool = getPool(req);
  const { id, venta_id, descripcion, fecha_desde, fecha_hasta } = req.query;

  try {
    let sql = `
      SELECT vi.*, v.numero_completo, v.fecha_emision, v.cufe,
             t.razon_social AS cliente, t.numero_documento AS nit_cliente,
             CASE WHEN s.id IS NOT NULL THEN true ELSE false END AS consumido
      FROM facturacion.ventas_items vi
      JOIN facturacion.ventas v ON v.id = vi.venta_id
      LEFT JOIN generales.terceros t ON t.id = v.receptor_id
      LEFT JOIN inventario.salidas s ON s.factura_item_id = vi.id
      WHERE 1=1`;
    const params = [];
    let idx = 1;

    if (id) {
      sql += ` AND vi.id = $${idx++}`;
      params.push(id);
    }
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

async function updateItem(req, res) {
  const pool = getPool(req);
  const { id } = req.params;
  const { producto_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE facturacion.ventas_items
       SET producto_id = $1
       WHERE id = $2
       RETURNING *`,
      [producto_id || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item de venta no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ error: "El producto especificado no existe" });
    }
    console.error("Error al actualizar item de venta:", error.message);
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
      observaciones,
    } = req.body;

    if (!receptor || !receptor.razon_social) {
      return res.status(400).json({ error: "Se requiere receptor con razon_social" });
    }
    if (!fecha_emision) {
      return res.status(400).json({ error: "La fecha de emisión es obligatoria" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Debe incluir al menos un ítem" });
    }

    await client.query("BEGIN");

    const tipoDocVal = receptor.tipo_documento || null;
    const numDocVal = receptor.numero_documento || null;

    let receptorId;
    if (tipoDocVal && numDocVal) {
      const result = await client.query(`
        INSERT INTO generales.terceros
          (tipo_documento, numero_documento, razon_social, direccion, ciudad, departamento, pais, es_cliente)
        VALUES ($1,$2,$3,$4,$5,$6,$7,true)
        ON CONFLICT (tipo_documento, numero_documento)
        DO UPDATE SET
          razon_social = EXCLUDED.razon_social,
          direccion = EXCLUDED.direccion,
          ciudad = EXCLUDED.ciudad,
          departamento = EXCLUDED.departamento,
          es_cliente = true,
          updated_at = now()
        RETURNING id`,
        [tipoDocVal, numDocVal, receptor.razon_social, receptor.direccion || null, receptor.ciudad || null, receptor.departamento || null, "CO"]
      );
      receptorId = result.rows[0].id;
    } else {
      const result = await client.query(`
        INSERT INTO generales.terceros
          (tipo_documento, numero_documento, razon_social, direccion, ciudad, departamento, pais, es_cliente)
        VALUES ($1,$2,$3,$4,$5,$6,$7,true)
        RETURNING id`,
        [null, null, receptor.razon_social, receptor.direccion || null, receptor.ciudad || null, receptor.departamento || null, "CO"]
      );
      receptorId = result.rows[0].id;
    }

    const emisorResult = await client.query(
      `SELECT id FROM generales.terceros WHERE es_propio = true LIMIT 1`
    );
    if (emisorResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "No hay un emisor configurado. Cree un tercero con la opción 'Propio' activada." });
    }
    const emisorId = emisorResult.rows[0].id;

    const subtotal = items.reduce((s, it) => s + (it.valor_linea || 0), 0);
    const total = items.reduce((s, it) => s + (it.valor_total || it.valor_linea || 0), 0);

    const valorFinal = total || subtotal;
    const ventaResult = await client.query(
      `INSERT INTO facturacion.ventas
         (numero_completo, fecha_emision, moneda,
          valor_subtotal, valor_a_pagar, saldo_pendiente,
          emisor_id, receptor_id, estado, observaciones)
       VALUES ('VEN' || nextval('facturacion.ventas_manual_seq')::TEXT,
               $1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, numero_completo`,
      [
        fecha_emision,
        moneda || "COP",
        subtotal,
        valorFinal,
        valorFinal,
        emisorId,
        receptorId,
        "pendiente_pago",
        observaciones || null,
      ]
    );
    const ventaId = ventaResult.rows[0].id;
    const venNumero = ventaResult.rows[0].numero_completo;

    let linea = 1;
    const itemsCreados = [];
    for (const item of items) {
      if (!item.descripcion || !item.valor_unitario) continue;
      const itemResult = await client.query(
        `INSERT INTO facturacion.ventas_items
           (venta_id, numero_linea, descripcion, codigo_producto,
            cantidad, unidad_medida, valor_unitario, valor_linea, producto_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING id, producto_id, cantidad`,
        [
          ventaId,
          linea++,
          item.descripcion,
          item.codigo_producto || null,
          item.cantidad || 1,
          item.unidad_medida || "UND",
          item.valor_unitario,
          item.valor_linea || (item.cantidad || 1) * item.valor_unitario,
          item.producto_id || null,
        ]
      );
      itemsCreados.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      venta_id: ventaId,
      numero: venNumero,
      total: total || subtotal,
      items: itemsCreados,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear venta manual:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

async function getById(req, res) {
  const pool = getPool(req);
  const { id } = req.params;

  try {
    const ventaResult = await pool.query(
      `SELECT v.*, t.razon_social, t.numero_documento, t.tipo_documento,
              t.direccion, t.ciudad
       FROM facturacion.ventas v
       JOIN generales.terceros t ON t.id = v.receptor_id
       WHERE v.id = $1`,
      [id]
    );
    if (ventaResult.rows.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const itemsResult = await pool.query(
      `SELECT vi.*, p.inventariable
       FROM facturacion.ventas_items vi
       LEFT JOIN inventario.productos p ON p.id = vi.producto_id
       WHERE vi.venta_id = $1
       ORDER BY vi.numero_linea`,
      [id]
    );

    res.json({
      ...ventaResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener venta:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  const pool = getPool(req);
  const client = await pool.connect();
  const { id } = req.params;

  try {
    const check = await client.query(
      `SELECT id, cufe FROM facturacion.ventas WHERE id = $1`,
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    if (check.rows[0].cufe) {
      return res.status(400).json({ error: "No se puede editar una venta con factura electrónica" });
    }

    const { receptor, fecha_emision, moneda, items, observaciones } = req.body;

    if (!receptor || !receptor.razon_social) {
      return res.status(400).json({ error: "Se requiere receptor con razon_social" });
    }
    if (!fecha_emision) {
      return res.status(400).json({ error: "La fecha de emisión es obligatoria" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Debe incluir al menos un ítem" });
    }

    await client.query("BEGIN");

    const tipoDocVal = receptor.tipo_documento || null;
    const numDocVal = receptor.numero_documento || null;

    let receptorId;
    if (tipoDocVal && numDocVal) {
      const result = await client.query(`
        INSERT INTO generales.terceros
          (tipo_documento, numero_documento, razon_social, direccion, ciudad, departamento, pais, es_cliente)
        VALUES ($1,$2,$3,$4,$5,$6,$7,true)
        ON CONFLICT (tipo_documento, numero_documento)
        DO UPDATE SET
          razon_social = EXCLUDED.razon_social,
          direccion = EXCLUDED.direccion,
          ciudad = EXCLUDED.ciudad,
          departamento = EXCLUDED.departamento,
          es_cliente = true,
          updated_at = now()
        RETURNING id`,
        [tipoDocVal, numDocVal, receptor.razon_social, receptor.direccion || null, receptor.ciudad || null, receptor.departamento || null, "CO"]
      );
      receptorId = result.rows[0].id;
    } else {
      const result = await client.query(`
        INSERT INTO generales.terceros
          (tipo_documento, numero_documento, razon_social, direccion, ciudad, departamento, pais, es_cliente)
        VALUES ($1,$2,$3,$4,$5,$6,$7,true)
        RETURNING id`,
        [null, null, receptor.razon_social, receptor.direccion || null, receptor.ciudad || null, receptor.departamento || null, "CO"]
      );
      receptorId = result.rows[0].id;
    }

    const subtotal = items.reduce((s, it) => s + (it.valor_linea || 0), 0);
    const total = items.reduce((s, it) => s + (it.valor_total || it.valor_linea || 0), 0);
    const valorFinal = total || subtotal;

    await client.query(
      `UPDATE facturacion.ventas SET
        fecha_emision = $1, valor_subtotal = $2, valor_a_pagar = $3,
        saldo_pendiente = $4, receptor_id = $5, observaciones = $6,
        moneda = $7, updated_at = now()
       WHERE id = $8`,
      [fecha_emision, subtotal, valorFinal, valorFinal, receptorId, observaciones || null, moneda || "COP", id]
    );

    await client.query(`DELETE FROM facturacion.ventas_items WHERE venta_id = $1`, [id]);

    let linea = 1;
    const itemsCreados = [];
    for (const item of items) {
      if (!item.descripcion || !item.valor_unitario) continue;
      const itemResult = await client.query(
        `INSERT INTO facturacion.ventas_items
           (venta_id, numero_linea, descripcion, codigo_producto,
            cantidad, unidad_medida, valor_unitario, valor_linea, producto_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING id, producto_id, cantidad`,
        [
          id,
          linea++,
          item.descripcion,
          item.codigo_producto || null,
          item.cantidad || 1,
          item.unidad_medida || "UND",
          item.valor_unitario,
          item.valor_linea || (item.cantidad || 1) * item.valor_unitario,
          item.producto_id || null,
        ]
      );
      itemsCreados.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      venta_id: Number(id),
      total: total || subtotal,
      items: itemsCreados,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar venta:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

module.exports = { listItems, create, updateItem, getById, update };
