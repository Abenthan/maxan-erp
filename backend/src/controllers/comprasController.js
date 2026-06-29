const { parseInvoiceXML } = require("../services/xmlParser");

function getPool(req) {
  return req.app.locals.pool;
}

async function upload(req, res) {
  const pool = getPool(req);
  const client = await pool.connect();

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Debes enviar un archivo XML en el campo 'archivo'" });
    }

    const xmlString = req.file.buffer.toString("utf-8");
    const data = parseInvoiceXML(xmlString);

    if (!data.emisor || !data.receptor) {
      return res.status(400).json({ error: "El XML no contiene información de emisor y receptor" });
    }

    await client.query("BEGIN");

    const upsertQ = `
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

    const emisorVals = [
      data.emisor.tipo_documento || "31",
      data.emisor.numero_documento,
      data.emisor.digito_verificacion || null,
      data.emisor.tipo_persona || null,
      data.emisor.razon_social,
      data.emisor.direccion || null,
      data.emisor.codigo_ciudad || null,
      data.emisor.ciudad || null,
      data.emisor.departamento || null,
      "CO",
      data.emisor.telefono || null,
      data.emisor.email || null,
    ];
    const emisorResult = await client.query(upsertQ, emisorVals);
    const proveedorId = emisorResult.rows[0].id;

    const receptorVals = [
      data.receptor.tipo_documento || "31",
      data.receptor.numero_documento,
      data.receptor.digito_verificacion || null,
      data.receptor.tipo_persona || null,
      data.receptor.razon_social,
      data.receptor.direccion || null,
      data.receptor.codigo_ciudad || null,
      data.receptor.ciudad || null,
      data.receptor.departamento || null,
      "CO",
      data.receptor.telefono || null,
      data.receptor.email || null,
    ];
    const receptorResult = await client.query(upsertQ, receptorVals);
    const receptorId = receptorResult.rows[0].id;

    const facturaQ = `
      INSERT INTO compras.facturas_compra
        (tipo_documento_compra, codigo_unico_documento, numero_completo,
         fecha_emision, fecha_recepcion, moneda,
         valor_subtotal, valor_total_impuestos, valor_iva, valor_a_pagar,
         proveedor_id, receptor_id, estado)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id`;

    const facturaVals = [
      "factura_electronica",
      data.cufe || null,
      data.numero_completo,
      data.fecha_emision || new Date(),
      new Date(),
      data.moneda || "COP",
      data.valor_subtotal || 0,
      data.valor_total_impuestos || 0,
      data.valor_iva || 0,
      data.valor_a_pagar || 0,
      proveedorId,
      receptorId,
      "recibida",
    ];

    const facturaResult = await client.query(facturaQ, facturaVals);
    const facturaCompraId = facturaResult.rows[0].id;

    const totalGastos = [];
    if (data.items && data.items.length > 0) {
      const subtotalTotal = data.items.reduce((s, it) => s + (it.valor_linea || 0), 0);

      const gastoQ = `
        INSERT INTO gastos.gastos
          (factura_compra_id, proveedor_id, descripcion,
           clasificacion, cantidad, valor_unitario, valor_total, fecha)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING id`;

      for (const item of data.items) {
        const gastoResult = await client.query(gastoQ, [
          facturaCompraId,
          proveedorId,
          item.descripcion || "Sin descripción",
          "Operacional",
          item.cantidad || 1,
          item.valor_unitario || 0,
          item.valor_linea || 0,
          data.fecha_emision || new Date(),
        ]);
        totalGastos.push({
          gasto_id: gastoResult.rows[0].id,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_linea,
        });

        if (data.impuestos && data.impuestos.length > 0 && subtotalTotal > 0) {
          const proporcion = (item.valor_linea || 0) / subtotalTotal;
          for (const imp of data.impuestos) {
            const valor = imp.valor || 0;
            if (valor <= 0) continue;
            const itemImpValor = valor * proporcion;
            if (itemImpValor <= 0) continue;
            const cant = item.cantidad || 1;
            const nombre = imp.nombre_impuesto || `Impuesto ${imp.tipo_impuesto || ""}`;
            await client.query(gastoQ, [
              facturaCompraId,
              proveedorId,
              `${nombre.toLowerCase()} ${item.numero_linea} compra ${data.numero_completo} (${imp.porcentaje || 0}%)`,
              "Operacional",
              cant,
              cant > 0 ? +(itemImpValor / cant).toFixed(2) : 0,
              +itemImpValor.toFixed(2),
              data.fecha_emision || new Date(),
            ]);
          }
        }
      }
    }

    if (req.file) {
      await client.query(
        `INSERT INTO compras.facturas_compra_archivos
           (factura_compra_id, tipo_archivo, nombre_archivo, contenido_xml)
         VALUES ($1, 'xml_invoice', $2, $3)`,
        [facturaCompraId, req.file.originalname, xmlString]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      factura_compra_id: facturaCompraId,
      proveedor: data.emisor.razon_social,
      total: data.valor_a_pagar,
      gastos_creados: totalGastos.length,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      const detail = error.detail || "";
      if (detail.includes("codigo_unico_documento")) {
        return res.status(409).json({ error: "Esta factura de compra ya está registrada (CUFE duplicado)" });
      }
    }
    console.error("Error al procesar XML de compra:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

async function list(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      `SELECT fc.*, t.razon_social AS proveedor, t.numero_documento AS nit_proveedor
       FROM compras.facturas_compra fc
       LEFT JOIN facturacion.terceros t ON t.id = fc.proveedor_id
       ORDER BY fc.fecha_emision DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar facturas de compra:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const facturaResult = await pool.query(
      `SELECT fc.*, t.razon_social AS proveedor, t.numero_documento AS nit_proveedor
       FROM compras.facturas_compra fc
       LEFT JOIN facturacion.terceros t ON t.id = fc.proveedor_id
       WHERE fc.id = $1`,
      [id]
    );
    if (facturaResult.rows.length === 0) {
      return res.status(404).json({ error: "Factura de compra no encontrada" });
    }

    const gastosResult = await pool.query(
      `SELECT * FROM gastos.gastos WHERE factura_compra_id = $1 ORDER BY id`,
      [id]
    );

    res.json({
      ...facturaResult.rows[0],
      lineas: gastosResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener factura de compra:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function parsearXml(req, res) {
  try {
    const xmlString = req.body;
    if (!xmlString || typeof xmlString !== "string") {
      return res.status(400).json({ error: "Se requiere el contenido XML en el cuerpo de la solicitud" });
    }
    const data = parseInvoiceXML(xmlString);
    res.json(data);
  } catch (error) {
    console.error("Error al parsear XML de compra:", error.message);
    res.status(400).json({ error: error.message });
  }
}

module.exports = { upload, list, getById, parsearXml };
