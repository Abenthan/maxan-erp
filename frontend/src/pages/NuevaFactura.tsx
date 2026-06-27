import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Tercero {
  tipo_documento: string;
  numero_documento: string;
  digito_verificacion?: string;
  razon_social: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  email?: string;
  telefono?: string;
}

interface FacturaItem {
  numero_linea: number;
  descripcion: string;
  codigo_producto?: string;
  cantidad: number;
  unidad_medida: string;
  valor_unitario: number;
  porcentaje_descuento: number;
  valor_descuento: number;
  valor_linea: number;
}

interface FacturaImpuesto {
  tipo_impuesto: string;
  nombre_impuesto?: string;
  porcentaje: number;
  base_gravable: number;
  valor: number;
}

interface FacturaData {
  cufe: string;
  prefijo: string;
  numero: string;
  numero_completo: string;
  tipo_documento_code: string;
  customization_id: string;
  fecha_emision: string;
  hora_emision?: string;
  fecha_vencimiento?: string;
  moneda: string;
  valor_subtotal: number;
  valor_descuento: number;
  valor_recargo: number;
  valor_total_bruto: number;
  valor_total_impuestos: number;
  valor_iva: number;
  valor_inc: number;
  valor_ica: number;
  valor_total_neto: number;
  valor_retencion_fuente: number;
  valor_retencion_iva: number;
  valor_retencion_ica: number;
  valor_anticipos: number;
  valor_a_pagar: number;
  medio_pago_code?: string;
  fecha_vencimiento_pago?: string;
  periodo_facturacion?: string;
  qr_code?: string;
  resolucion_numero?: string;
  resolucion_fecha_desde?: string;
  resolucion_fecha_hasta?: string;
  resolucion_prefijo?: string;
  resolucion_rango_desde?: string;
  resolucion_rango_hasta?: string;
  emisor: Tercero;
  receptor: Tercero;
  items: FacturaItem[];
  impuestos: FacturaImpuesto[];
}

const API_BASE = "/api/facturas";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  }).format(n);
}

function getNombreImpuesto(code: string): string {
  const map: Record<string, string> = {
    "01": "IVA",
    "03": "INC",
    "04": "ICA",
    "05": "Rete Fuente",
    "06": "Rete IVA",
    "07": "Rete ICA",
  };
  return map[code] || `Impuesto ${code}`;
}

export default function NuevaFactura() {
  const navigate = useNavigate();

  const [factura, setFactura] = useState<FacturaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [duplicadoId, setDuplicadoId] = useState<number | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.name.endsWith(".xml")) {
      setError("Solo se permiten archivos XML");
      return;
    }

    setError("");
    setSuccess("");
    setDuplicadoId(null);
    setFactura(null);

    const text = await f.text();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/parsear-xml`, {
        method: "POST",
        headers: { "Content-Type": "text/xml" },
        body: text,
      });
      const body = await res.text();
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        throw new Error(
          `El servidor respondió con código ${res.status} pero no devolvió JSON válido.\n` +
          `Posible causa: el backend no está corriendo o falló al procesar el XML.\n` +
          `Respuesta recibida (primeros 200 caracteres):\n${body.slice(0, 200)}`
        );
      }
      if (!res.ok) {
        throw new Error(json.error || "Error al parsear el XML");
      }
      if (json.ya_existe && json.factura_existente_id) {
        navigate(`/factura/${json.factura_existente_id}`);
        return;
      }
      setFactura(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!factura) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factura),
      });
      if (!res.ok) {
        const err = await res.json();
        if (err.factura_existente_id) {
          setDuplicadoId(err.factura_existente_id);
          return;
        }
        throw new Error(err.error || "Error al guardar la factura");
      }
      navigate("/facturas");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Nueva Factura desde XML
        </h1>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Selecciona el archivo XML de la factura
          </label>
          <input
            type="file"
            accept=".xml"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {loading && <p className="mt-2 text-blue-600">Procesando XML...</p>}
          {success && (
            <p className="mt-2 text-green-600 font-medium">{success}</p>
          )}
          {duplicadoId && (
            <p className="mt-2">
              <span className="text-red-600 font-medium">Esta factura ya está registrada. </span>
              <Link to={`/factura/${duplicadoId}`} className="text-blue-600 underline font-medium">
                Ver factura existente
              </Link>
            </p>
          )}
          {error && (
            <p className="mt-2 text-red-600 font-medium">{error}</p>
          )}
        </div>

        {factura && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {factura.emisor.razon_social}
                  </h2>
                  <p className="text-sm text-gray-600">
                    NIT {factura.emisor.numero_documento}
                    {factura.emisor.digito_verificacion
                      ? `-${factura.emisor.digito_verificacion}`
                      : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {factura.emisor.direccion || ""}
                    {factura.emisor.ciudad ? `, ${factura.emisor.ciudad}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    FACTURA ELECTRÓNICA DE VENTA
                  </p>
                  <p className="text-sm text-gray-600">
                    No. {factura.numero_completo}
                  </p>
                  <p className="text-xs text-gray-500">
                    CUFE: {factura.cufe ? factura.cufe.slice(0, 20) + "..." : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="font-semibold">Fecha de emisión:</p>
                  <p>
                    {factura.fecha_emision}
                    {factura.hora_emision ? ` ${factura.hora_emision}` : ""}
                  </p>
                  {factura.fecha_vencimiento && (
                    <>
                      <p className="font-semibold mt-2">Fecha de vencimiento:</p>
                      <p>{factura.fecha_vencimiento}</p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">Moneda:</p>
                  <p>{factura.moneda}</p>
                  {factura.medio_pago_code && (
                    <>
                      <p className="font-semibold mt-2">Medio de pago:</p>
                      <p>{factura.medio_pago_code}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="border rounded p-3 bg-gray-50">
                  <p className="font-bold text-sm text-gray-700 mb-1">EMISOR</p>
                  <p className="text-sm font-semibold">
                    {factura.emisor.razon_social}
                  </p>
                  <p className="text-xs text-gray-600">
                    {factura.emisor.tipo_documento === "31" ? "NIT" : "CC"}{" "}
                    {factura.emisor.numero_documento}
                  </p>
                  {factura.emisor.direccion && (
                    <p className="text-xs text-gray-600">
                      {factura.emisor.direccion}
                    </p>
                  )}
                  {factura.emisor.ciudad && (
                    <p className="text-xs text-gray-600">
                      {factura.emisor.ciudad}
                      {factura.emisor.departamento
                        ? `, ${factura.emisor.departamento}`
                        : ""}
                    </p>
                  )}
                </div>
                <div className="border rounded p-3 bg-gray-50">
                  <p className="font-bold text-sm text-gray-700 mb-1">RECEPTOR</p>
                  <p className="text-sm font-semibold">
                    {factura.receptor.razon_social}
                  </p>
                  <p className="text-xs text-gray-600">
                    {factura.receptor.tipo_documento === "31" ? "NIT" : "CC"}{" "}
                    {factura.receptor.numero_documento}
                  </p>
                  {factura.receptor.direccion && (
                    <p className="text-xs text-gray-600">
                      {factura.receptor.direccion}
                    </p>
                  )}
                  {factura.receptor.ciudad && (
                    <p className="text-xs text-gray-600">
                      {factura.receptor.ciudad}
                      {factura.receptor.departamento
                        ? `, ${factura.receptor.departamento}`
                        : ""}
                    </p>
                  )}
                </div>
              </div>

              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Producto</th>
                    <th className="text-left p-2">Descripción</th>
                    <th className="text-center p-2">Und</th>
                    <th className="text-right p-2">Cantidad</th>
                    <th className="text-right p-2">Vr Unitario</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.items.map((item) => (
                    <tr key={item.numero_linea} className="border-b">
                      <td className="p-2">{item.numero_linea}</td>
                      <td className="p-2">{item.codigo_producto || "-"}</td>
                      <td className="p-2">{item.descripcion}</td>
                      <td className="text-center p-2">{item.unidad_medida}</td>
                      <td className="text-right p-2">{item.cantidad}</td>
                      <td className="text-right p-2">
                        {formatCurrency(item.valor_unitario)}
                      </td>
                      <td className="text-right p-2 font-medium">
                        {formatCurrency(item.valor_linea)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-72 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(factura.valor_subtotal)}</span>
                  </div>
                  {factura.impuestos.map((imp, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>
                        {imp.nombre_impuesto || getNombreImpuesto(imp.tipo_impuesto)}{" "}
                        ({imp.porcentaje}%):
                      </span>
                      <span>{formatCurrency(imp.valor)}</span>
                    </div>
                  ))}
                  {factura.valor_descuento > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Descuento:</span>
                      <span>-{formatCurrency(factura.valor_descuento)}</span>
                    </div>
                  )}
                  {factura.valor_retencion_fuente > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Retención fuente:</span>
                      <span>-{formatCurrency(factura.valor_retencion_fuente)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(factura.valor_a_pagar)}</span>
                  </div>
                </div>
              </div>

              {factura.qr_code && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500 break-all">
                  <p className="font-semibold mb-1">QR / CUFE:</p>
                  <p>{factura.qr_code}</p>
                </div>
              )}
            </div>

              {!factura.cufe && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  ⚠ El XML no contiene un CUFE válido. No se podrá guardar la factura.
                </div>
              )}

              <div className="flex gap-3 justify-end">
              <button
                onClick={() => navigate("/facturas")}
                className="px-4 py-2 text-sm rounded border border-border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Volver
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !factura.cufe}
                className="px-6 py-2 text-sm rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Factura"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
