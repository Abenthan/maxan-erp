const { XMLParser } = require("fast-xml-parser");

const XML_PARSER_OPTIONS = {
  removeNSPrefix: true,
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  trimValues: true,
  allowBooleanAttributes: true,
  isArray: (tagName) =>
    [
      "InvoiceLine",
      "TaxSubtotal",
      "UBLExtension",
      "AllowanceCharge",
      "PaymentMeans",
      "PrepaidPayment",
    ].includes(tagName),
};

function getText(obj) {
  if (typeof obj === "string") return obj;
  if (obj && typeof obj === "object" && "#text" in obj) return obj["#text"];
  return "";
}

function getAttr(obj, attr) {
  if (obj && typeof obj === "object" && `@_${attr}` in obj) return obj[`@_${attr}`];
  return "";
}

function safeArray(val) {
  if (Array.isArray(val)) return val;
  if (val == null) return [];
  return [val];
}

function extractPartyInfo(party) {
  if (!party) return {};
  const identifications = safeArray(party.PartyIdentification);
  const identification = identifications[0];
  const taxSchemes = safeArray(party.PartyTaxScheme);
  const taxScheme = taxSchemes[0];
  const legalEntities = safeArray(party.PartyLegalEntity);
  const legalEntity = legalEntities[0];
  const addresses = safeArray(party.PhysicalLocation?.Address);
  const address = addresses[0];
  const partyNames = safeArray(party.PartyName);
  const partyName = partyNames[0]?.Name;
  const contacts = safeArray(party.Contact);
  const contact = contacts[0];

  let idObj = identification?.ID;

  if (!idObj) {
    idObj = legalEntity?.CompanyID;
  }

  const idNum = (getText(idObj) || "").replace(/-.*$/, "");
  const digitoVerificacion = getText(idObj)?.includes("-")
    ? getText(idObj).split("-")[1]
    : "";
  const schemeID = getAttr(idObj, "schemeID") || getAttr(idObj, "schemeName");

  return {
    tipo_documento: schemeID || "31",
    numero_documento: idNum,
    digito_verificacion: digitoVerificacion,
    tipo_persona: "",
    razon_social:
      getText(legalEntity?.RegistrationName) ||
      getText(taxScheme?.RegistrationName) ||
      (partyName ? getText(partyName) : "") ||
      "",
    direccion: address ? getText(address.AddressLine?.Line) || "" : "",
    codigo_ciudad: address ? getText(address.ID) || "" : "",
    ciudad: address ? getText(address.CityName) || "" : "",
    codigo_departamento: "",
    departamento: address ? getText(address.CountrySubentity) || "" : "",
    codigo_postal: "",
    email: contact ? getText(contact.ElectronicMail) || "" : "",
    telefono: contact ? getText(contact.Telephone) || "" : "",
  };
}

function extractTotals(monetaryTotal) {
  if (!monetaryTotal) return {};
  return {
    valor_subtotal: parseFloat(getText(monetaryTotal.LineExtensionAmount)) || 0,
    valor_total_neto: parseFloat(getText(monetaryTotal.TaxExclusiveAmount)) || 0,
    valor_a_pagar: parseFloat(getText(monetaryTotal.PayableAmount)) || 0,
  };
}

function extractTaxes(taxTotal, invoiceLines) {
  const taxes = [];
  const totals = { valor_total_impuestos: 0, valor_iva: 0, valor_inc: 0, valor_ica: 0 };

  if (!taxTotal) return { taxes, ...totals };

  const taxTotals = safeArray(Array.isArray(taxTotal) ? taxTotal : [taxTotal]);

  for (const tt of taxTotals) {
    const subtotals = safeArray(tt.TaxSubtotal);
    for (const st of subtotals) {
      const taxCategory = st.TaxCategory;
      const taxScheme = taxCategory?.TaxScheme;
      const taxId = getText(taxScheme?.ID) || "";
      const percent = parseFloat(getText(taxCategory?.Percent)) || 0;
      const taxableAmount = parseFloat(getText(st.TaxableAmount)) || 0;
      const taxAmount = parseFloat(getText(st.TaxAmount)) || 0;

      totals.valor_total_impuestos += taxAmount;

      const mappedTax = {
        tipo_impuesto: taxId,
        nombre_impuesto: taxId === "01" ? "IVA" : taxId === "03" ? "INC" : taxId === "04" ? "ICA" : "",
        porcentaje: percent,
        base_gravable: taxableAmount,
        valor: taxAmount,
      };
      taxes.push(mappedTax);

      if (taxId === "01") totals.valor_iva += taxAmount;
      else if (taxId === "03") totals.valor_inc += taxAmount;
      else if (taxId === "04") totals.valor_ica += taxAmount;
    }
  }

  return { taxes, ...totals };
}

function extractLines(invoiceLines) {
  const items = [];
  const lines = safeArray(invoiceLines);
  for (const line of lines) {
    const item = line.Item || {};
    const price = line.Price || {};

    let valor_retencion_fuente = 0;
    const lineWithholding = line.WithholdingTaxTotal;
    if (lineWithholding) {
      const wtSubtotals = safeArray(lineWithholding.TaxSubtotal);
      for (const wt of wtSubtotals) {
        const wtCategory = wt.TaxCategory;
        const wtScheme = wtCategory?.TaxScheme;
        const wtId = getText(wtScheme?.ID) || "";
        if (wtId === "01") {
          valor_retencion_fuente += parseFloat(getText(wt.TaxAmount)) || 0;
        }
      }
    }

    items.push({
      numero_linea: parseInt(getText(line.ID)) || 0,
      descripcion: getText(item.Description) || "",
      codigo_producto: getText(item.SellersItemIdentification?.ID) || "",
      cantidad: parseFloat(getText(line.InvoicedQuantity)) || 0,
      unidad_medida: getAttr(line.InvoicedQuantity, "unitCode") || "UND",
      valor_unitario: parseFloat(getText(price.PriceAmount)) || 0,
      porcentaje_descuento: 0,
      valor_descuento: 0,
      valor_linea: parseFloat(getText(line.LineExtensionAmount)) || 0,
      valor_retencion_fuente,
    });
  }
  return items;
}

function extractWithholdingTax(withholdingTotal, invoiceLines) {
  let valor_retencion_fuente = 0;
  let valor_retencion_iva = 0;
  let valor_retencion_ica = 0;

  if (!withholdingTotal) return { valor_retencion_fuente, valor_retencion_iva, valor_retencion_ica };

  const wtTotals = safeArray(Array.isArray(withholdingTotal) ? withholdingTotal : [withholdingTotal]);

  for (const wt of wtTotals) {
    const subtotals = safeArray(wt.TaxSubtotal);
    for (const st of subtotals) {
      const wtCategory = st.TaxCategory;
      const wtScheme = wtCategory?.TaxScheme;
      const wtId = getText(wtScheme?.ID) || "";
      const taxAmount = parseFloat(getText(st.TaxAmount)) || 0;

      if (wtId === "01") valor_retencion_fuente += taxAmount;
      else if (wtId === "02") valor_retencion_iva += taxAmount;
      else if (wtId === "04") valor_retencion_ica += taxAmount;
    }
  }

  return { valor_retencion_fuente, valor_retencion_iva, valor_retencion_ica };
}

function extractInvoiceControl(extensions) {
  if (!extensions) return {};
  const extNodes = safeArray(extensions.UBLExtension);

  let result = {
    cufe: "",
    resolucion_numero: "",
    resolucion_fecha_desde: "",
    resolucion_fecha_hasta: "",
    resolucion_prefijo: "",
    resolucion_rango_desde: "",
    resolucion_rango_hasta: "",
  };

  for (const ext of extNodes) {
    const dianExt = ext.ExtensionContent?.DianExtensions;
    if (!dianExt) continue;
    const control = dianExt.InvoiceControl;
    if (!control) continue;
    const authPeriod = control.AuthorizationPeriod;

    if (!result.cufe) {
      result.cufe = getText(control.UUID) || getText(control.CUFE) || getText(control.CUDE) || "";
    }
    if (!result.resolucion_numero) result.resolucion_numero = getText(control.InvoiceAuthorization) || "";
    if (authPeriod) {
      if (!result.resolucion_fecha_desde) result.resolucion_fecha_desde = getText(authPeriod.StartDate) || "";
      if (!result.resolucion_fecha_hasta) result.resolucion_fecha_hasta = getText(authPeriod.EndDate) || "";
    }
    if (!result.resolucion_prefijo) result.resolucion_prefijo = getText(control.AuthorizedInvoices?.Prefix) || "";
    if (!result.resolucion_rango_desde) result.resolucion_rango_desde = getText(control.AuthorizedInvoices?.From) || "";
    if (!result.resolucion_rango_hasta) result.resolucion_rango_hasta = getText(control.AuthorizedInvoices?.To) || "";
  }

  return result;
}

function extractQRCode(extensions) {
  if (!extensions) return "";
  const extNodes = safeArray(extensions.UBLExtension);
  for (const ext of extNodes) {
    const dianExt = ext.ExtensionContent?.DianExtensions;
    if (!dianExt) continue;
    const issuer = dianExt.InvoiceIssuer;
    if (!issuer) continue;
    const sign = issuer.Identification?.DigitalSignature;
    if (!sign) continue;

    const qrNode = sign.QRCode || sign.Extension || sign.QR;
    if (qrNode) return getText(qrNode);
  }

  for (const ext of extNodes) {
    const dianExt = ext.ExtensionContent?.DianExtensions;
    if (!dianExt) continue;
    const control = dianExt.InvoiceControl;
    if (!control) continue;
    const qrNode = control.QRCode || control.QR;
    if (qrNode) return getText(qrNode);
  }

  return "";
}

function tryExtractInvoiceFromAttachment(attachment) {
  if (!attachment) return null;

  if (attachment.EmbeddedDocument) {
    const embedded = attachment.EmbeddedDocument;
    const invoice = embedded.Invoice ||
                    findNestedInvoice(embedded);
    if (invoice) return invoice;
  }

  if (attachment.ExternalReference?.Description) {
    const xmlString = getText(attachment.ExternalReference.Description);
    if (xmlString) {
      try {
        const subParser = new XMLParser(XML_PARSER_OPTIONS);
        const subParsed = subParser.parse(xmlString);
        return subParsed.Invoice || findNestedInvoice(subParsed);
      } catch (e) {
        console.error("Error al parsear Invoice embebido:", e.message);
      }
    }
  }
  return null;
}

function parseInvoiceXML(xmlString) {
  const parser = new XMLParser(XML_PARSER_OPTIONS);
  const parsed = parser.parse(xmlString);

  const rootKeys = Object.keys(parsed);
  const rootKey = rootKeys.find(
    (k) =>
      k === "Invoice" ||
      k === "AttachedDocument" ||
      k === "ApplicationResponse"
  );
  if (!rootKey) {
    throw new Error(
      `No se encontró un elemento Invoice, AttachedDocument o ApplicationResponse en el XML. ` +
      `Claves encontradas: ${rootKeys.join(", ")}`
    );
  }

  let invoice;
  if (rootKey === "Invoice") {
    invoice = parsed.Invoice;
  } else if (rootKey === "AttachedDocument") {
    const doc = parsed.AttachedDocument;
    invoice = tryExtractInvoiceFromAttachment(doc.Attachment) ||
              doc.Invoice ||
              findNestedInvoice(doc);
  } else if (rootKey === "ApplicationResponse") {
    const doc = parsed.ApplicationResponse;
    invoice = doc.Invoice ||
              findNestedInvoice(doc);
  }

  if (!invoice) {
    throw new Error("No se pudo extraer el Invoice del XML");
  }

  const supplierParty = invoice.AccountingSupplierParty?.Party;
  const customerParty = invoice.AccountingCustomerParty?.Party;

  const monetaryTotal = invoice.LegalMonetaryTotal;
  const taxTotal = invoice.TaxTotal;
  const invoiceLines = invoice.InvoiceLine;
  const extensions = invoice.UBLExtensions;
  const paymentMeans = invoice.PaymentMeans;

  const emisor = extractPartyInfo(supplierParty);
  const receptor = extractPartyInfo(customerParty);

  const invoiceControl = extractInvoiceControl(extensions);

  if (!invoiceControl.cufe) {
    invoiceControl.cufe = getText(invoice.UUID) || getText(invoice.CUFE) || getText(invoice.CUDE) || "";
  }

  const { taxes, valor_total_impuestos, valor_iva, valor_inc, valor_ica } =
    extractTaxes(taxTotal, invoiceLines);

  const items = extractLines(invoiceLines);

  const withholding = invoice.WithholdingTaxTotal;
  const retenciones = extractWithholdingTax(withholding, invoiceLines);

  const hasPerItemRetenciones = items.some((it) => it.valor_retencion_fuente > 0);
  if (!hasPerItemRetenciones && retenciones.valor_retencion_fuente > 0 && items.length > 0) {
    const subtotalTotal = items.reduce((s, it) => s + (it.valor_linea || 0), 0);
    if (subtotalTotal > 0) {
      for (const item of items) {
        item.valor_retencion_fuente = Math.round(
          (retenciones.valor_retencion_fuente * (item.valor_linea / subtotalTotal)) * 100
        ) / 100;
      }
    }
  }

  const totals = extractTotals(monetaryTotal);

  const paymentMeansList = safeArray(paymentMeans);
  const medioPago = paymentMeansList.length > 0 ? getText(paymentMeansList[0].PaymentMeansCode) || "" : "";
  const fechaVencPago = paymentMeansList.length > 0
    ? getText(paymentMeansList[0].PaymentDueDate) || getText(paymentMeansList[0].PaymentID) || ""
    : "";

  const qrCode = extractQRCode(extensions);

  const numeroCompleto = getText(invoice.ID) || "";
  const prefijo = invoiceControl.resolucion_prefijo || "";
  const numero = numeroCompleto.startsWith(prefijo)
    ? numeroCompleto.slice(prefijo.length)
    : numeroCompleto;

  return {
    cufe: invoiceControl.cufe || "",
    prefijo,
    numero,
    numero_completo: numeroCompleto,
    tipo_documento_code: getText(invoice.InvoiceTypeCode) || "",
    customization_id: getText(invoice.CustomizationID) || "",
    fecha_emision: getText(invoice.IssueDate) || "",
    hora_emision: getText(invoice.IssueTime) || "",
    fecha_vencimiento: getText(invoice.DueDate) || "",
    moneda: getText(invoice.DocumentCurrencyCode) || "COP",
    ...totals,
    valor_descuento: 0,
    valor_recargo: 0,
    valor_total_bruto: totals.valor_subtotal || 0,
    valor_total_impuestos,
    valor_iva,
    valor_inc,
    valor_ica,
    ...retenciones,
    valor_anticipos: 0,
    medio_pago_code: medioPago,
    fecha_vencimiento_pago: fechaVencPago || getText(invoice.DueDate) || "",
    periodo_facturacion: "",
    qr_code: qrCode,
    ...invoiceControl,
    emisor,
    receptor,
    items,
    impuestos: taxes,
  };
}

function findNestedInvoice(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (obj.Invoice) return obj.Invoice;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      const found = findNestedInvoice(obj[key]);
      if (found) return found;
    }
  }
  return null;
}

module.exports = { parseInvoiceXML };
