function getPool(req) {
  return req.app.locals.pool;
}

async function upsertTercero(client, tercero) {
  const q = `
    INSERT INTO facturacion.terceros
      (tipo_documento, numero_documento, digito_verificacion, tipo_persona,
       razon_social, direccion, codigo_ciudad, ciudad, departamento, pais,
       telefono, email)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (tipo_documento, numero_documento)
    DO UPDATE SET
      razon_social = EXCLUDED.razon_social,
      direccion = EXCLUDED.direccion,
      ciudad = EXCLUDED.ciudad,
      departamento = EXCLUDED.departamento,
      email = EXCLUDED.email,
      telefono = EXCLUDED.telefono,
      updated_at = now()
    RETURNING id`;
  const vals = [
    tercero.tipo_documento || "31",
    tercero.numero_documento,
    tercero.digito_verificacion || null,
    tercero.tipo_persona || null,
    tercero.razon_social,
    tercero.direccion || null,
    tercero.codigo_ciudad || null,
    tercero.ciudad || null,
    tercero.departamento || null,
    "CO",
    tercero.telefono || null,
    tercero.email || null,
  ];
  const result = await client.query(q, vals);
  return result.rows[0].id;
}

async function list(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      "SELECT id, numero_completo, fecha_emision, receptor, nit_receptor, valor_a_pagar, estado, cufe FROM facturacion.vw_facturas_resumen ORDER BY fecha_emision DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar facturas:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const facturaResult = await pool.query(
      "SELECT * FROM facturacion.vw_facturas_resumen WHERE id = $1",
      [id]
    );
    if (facturaResult.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    const itemsResult = await pool.query(
      "SELECT * FROM facturacion.ventas_items WHERE venta_id = $1 ORDER BY numero_linea",
      [id]
    );
    const impuestosResult = await pool.query(
      "SELECT * FROM facturacion.factura_impuestos WHERE factura_id = $1",
      [id]
    );

    res.json({
      ...facturaResult.rows[0],
      items: itemsResult.rows,
      impuestos: impuestosResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener factura:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function parsearXml(req, res) {
  const { parseInvoiceXML } = require("../services/xmlParser");
  try {
    const xmlString = req.body;
    if (!xmlString || typeof xmlString !== "string") {
      return res.status(400).json({ error: "Se requiere el contenido XML en el cuerpo de la solicitud" });
    }
    const factura = parseInvoiceXML(xmlString);

    const pool = getPool(req);
    const result = {
      ...factura,
      ya_existe: false,
      factura_existente_id: null,
    };

    if (factura.numero_completo && factura.emisor?.numero_documento) {
      const dup = await pool.query(
        `SELECT f.id FROM facturacion.ventas f
         JOIN facturacion.terceros t ON t.id = f.emisor_id
         WHERE f.numero_completo = $1 AND t.numero_documento = $2
         LIMIT 1`,
        [factura.numero_completo, factura.emisor.numero_documento]
      );
      if (dup.rows.length > 0) {
        result.ya_existe = true;
        result.factura_existente_id = dup.rows[0].id;
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Error al parsear XML:", error.message);
    res.status(400).json({ error: error.message });
  }
}

async function create(req, res) {
  const pool = getPool(req);
  const client = await pool.connect();

  try {
    const data = req.body;
    if (!data || !data.emisor || !data.receptor) {
      return res.status(400).json({ error: "Datos incompletos: se requiere emisor y receptor" });
    }
    if (!data.cufe) {
      return res.status(400).json({
        error: "CUFE es requerido: el XML no contiene un CUFE válido en la estructura esperada (UBLExtensions > DianExtensions > InvoiceControl > UUID)"
      });
    }

    await client.query("BEGIN");

    const emisorId = await upsertTercero(client, data.emisor);
    const receptorId = await upsertTercero(client, data.receptor);

    if (data.cufe) {
      const dup = await client.query(
        "SELECT id FROM facturacion.ventas WHERE cufe = $1", [data.cufe]
      );
      if (dup.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          error: "Esta factura ya está registrada",
          factura_existente_id: dup.rows[0].id,
        });
      }
    }
    if (data.numero_completo) {
      const dup = await client.query(
        "SELECT id FROM facturacion.ventas WHERE numero_completo = $1 AND emisor_id = $2",
        [data.numero_completo, emisorId]
      );
      if (dup.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          error: "Esta factura ya está registrada",
          factura_existente_id: dup.rows[0].id,
        });
      }
    }

    const facturaQ = `
      INSERT INTO facturacion.ventas
        (cufe, prefijo, numero, numero_completo, tipo_documento_code,
         customization_id, fecha_emision, hora_emision, fecha_vencimiento,
         moneda, valor_subtotal, valor_descuento, valor_recargo,
         valor_total_bruto, valor_total_impuestos, valor_iva, valor_inc, valor_ica,
         valor_total_neto, valor_retencion_fuente, valor_retencion_iva, valor_retencion_ica,
         valor_anticipos, valor_a_pagar,
         emisor_id, receptor_id,
         resolucion_numero, resolucion_fecha_desde, resolucion_fecha_hasta,
         resolucion_prefijo, resolucion_rango_desde, resolucion_rango_hasta,
         medio_pago_code, fecha_vencimiento_pago, periodo_facturacion,
         qr_code, estado)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37)
      RETURNING id`;

    const facturaVals = [
      data.cufe || null,
      data.prefijo || null,
      data.numero || null,
      data.numero_completo,
      data.tipo_documento_code || null,
      data.customization_id || null,
      data.fecha_emision,
      data.hora_emision || null,
      data.fecha_vencimiento || null,
      data.moneda || "COP",
      data.valor_subtotal || 0,
      data.valor_descuento || 0,
      data.valor_recargo || 0,
      data.valor_total_bruto || 0,
      data.valor_total_impuestos || 0,
      data.valor_iva || 0,
      data.valor_inc || 0,
      data.valor_ica || 0,
      data.valor_total_neto || 0,
      data.valor_retencion_fuente || 0,
      data.valor_retencion_iva || 0,
      data.valor_retencion_ica || 0,
      data.valor_anticipos || 0,
      data.valor_a_pagar || 0,
      emisorId,
      receptorId,
      data.resolucion_numero || null,
      data.resolucion_fecha_desde || null,
      data.resolucion_fecha_hasta || null,
      data.resolucion_prefijo || null,
      data.resolucion_rango_desde || null,
      data.resolucion_rango_hasta || null,
      data.medio_pago_code || null,
      data.fecha_vencimiento_pago || null,
      data.periodo_facturacion || null,
      data.qr_code || null,
      "recibida",
    ];

    const facturaResult = await client.query(facturaQ, facturaVals);
    const facturaId = facturaResult.rows[0].id;

    if (data.items && data.items.length > 0) {
      const itemQ = `
        INSERT INTO facturacion.ventas_items
          (venta_id, numero_linea, descripcion, codigo_producto,
           cantidad, unidad_medida, valor_unitario,
           porcentaje_descuento, valor_descuento, valor_linea)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
      for (const item of data.items) {
        await client.query(itemQ, [
          facturaId,
          item.numero_linea,
          item.descripcion,
          item.codigo_producto || null,
          item.cantidad || 1,
          item.unidad_medida || "UND",
          item.valor_unitario || 0,
          item.porcentaje_descuento || 0,
          item.valor_descuento || 0,
          item.valor_linea || 0,
        ]);
      }
    }

    if (data.impuestos && data.impuestos.length > 0) {
      const taxQ = `
        INSERT INTO facturacion.factura_impuestos
          (factura_id, tipo_impuesto, nombre_impuesto,
           porcentaje, base_gravable, valor)
        VALUES ($1,$2,$3,$4,$5,$6)`;
      for (const tax of data.impuestos) {
        await client.query(taxQ, [
          facturaId,
          tax.tipo_impuesto,
          tax.nombre_impuesto || null,
          tax.porcentaje || 0,
          tax.base_gravable || 0,
          tax.valor || 0,
        ]);
      }
    }

    await client.query("COMMIT");

    res.status(201).json({ success: true, factura_id: facturaId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al guardar factura:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

module.exports = { list, getById, parsearXml, create };
