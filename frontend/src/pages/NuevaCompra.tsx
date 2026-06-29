import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Tercero {
  tipo_documento: string;
  numero_documento: string;
  digito_verificacion?: string;
  razon_social: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
}

interface FacturaItem {
  numero_linea: number;
  descripcion: string;
  codigo_producto?: string;
  cantidad: number;
  unidad_medida: string;
  valor_unitario: number;
  valor_linea: number;
}

interface FacturaImpuesto {
  tipo_impuesto: string;
  nombre_impuesto?: string;
  porcentaje: number;
  valor: number;
}

interface CompraData {
  cufe?: string;
  numero_completo: string;
  fecha_emision: string;
  moneda: string;
  valor_subtotal: number;
  valor_total_impuestos: number;
  valor_iva: number;
  valor_a_pagar: number;
  emisor: Tercero;
  receptor: Tercero;
  items: FacturaItem[];
  impuestos: FacturaImpuesto[];
}

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
  };
  return map[code] || `Impuesto ${code}`;
}

export default function NuevaCompra() {
  const navigate = useNavigate();
  const api = useApi();
  const fileRef = useRef<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<CompraData | null>(null);
  const [guardado, setGuardado] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.name.endsWith(".xml")) {
      setError("Solo se permiten archivos XML");
      return;
    }

    setError("");
    setData(null);
    setGuardado(false);

    const text = await f.text();
    fileRef.current = f;

    setLoading(true);
    try {
      const json = await api.postXml<CompraData>("/compras/parsear-xml", text);
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!fileRef.current) return;
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("archivo", fileRef.current);

    try {
      await api.upload<{ success: boolean; factura_compra_id: number }>("/compras/upload", formData);
      setGuardado(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Nueva Compra desde XML
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Selecciona el archivo XML de la factura de compra
        </label>
        <input
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          disabled={loading || saving}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {loading && <p className="mt-2 text-blue-600">Procesando XML...</p>}
        {error && (
          <p className="mt-2 text-red-600 font-medium">{error}</p>
        )}
        {guardado && (
          <p className="mt-2 text-green-600 font-medium">Compra registrada exitosamente</p>
        )}
      </div>

      {data && !guardado && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {data.emisor.razon_social}
                </h2>
                <p className="text-sm text-gray-600">
                  NIT {data.emisor.numero_documento}
                  {data.emisor.digito_verificacion ? `-${data.emisor.digito_verificacion}` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  {data.emisor.direccion || ""}
                  {data.emisor.ciudad ? `, ${data.emisor.ciudad}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  FACTURA ELECTRÓNICA DE COMPRA
                </p>
                <p className="text-sm text-gray-600">
                  No. {data.numero_completo}
                </p>
                {data.cufe && (
                  <p className="text-xs text-gray-500">
                    CUFE: {data.cufe.slice(0, 20)}...
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="font-semibold">Fecha de emisión:</p>
                <p>{data.fecha_emision}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Moneda:</p>
                <p>{data.moneda}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-3 bg-gray-50">
                <p className="font-bold text-sm text-gray-700 mb-1">PROVEEDOR</p>
                <p className="text-sm font-semibold">{data.emisor.razon_social}</p>
                <p className="text-xs text-gray-600">
                  {data.emisor.tipo_documento === "31" ? "NIT" : "CC"}{" "}
                  {data.emisor.numero_documento}
                </p>
                {data.emisor.direccion && (
                  <p className="text-xs text-gray-600">{data.emisor.direccion}</p>
                )}
                {data.emisor.ciudad && (
                  <p className="text-xs text-gray-600">
                    {data.emisor.ciudad}
                    {data.emisor.departamento ? `, ${data.emisor.departamento}` : ""}
                  </p>
                )}
              </div>
              <div className="border rounded-lg p-3 bg-gray-50">
                <p className="font-bold text-sm text-gray-700 mb-1">RECEPTOR</p>
                <p className="text-sm font-semibold">{data.receptor.razon_social}</p>
                <p className="text-xs text-gray-600">
                  {data.receptor.tipo_documento === "31" ? "NIT" : "CC"}{" "}
                  {data.receptor.numero_documento}
                </p>
                {data.receptor.direccion && (
                  <p className="text-xs text-gray-600">{data.receptor.direccion}</p>
                )}
                {data.receptor.ciudad && (
                  <p className="text-xs text-gray-600">
                    {data.receptor.ciudad}
                    {data.receptor.departamento ? `, ${data.receptor.departamento}` : ""}
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
                {data.items.map((item) => (
                  <tr key={item.numero_linea} className="border-b">
                    <td className="p-2">{item.numero_linea}</td>
                    <td className="p-2">{item.codigo_producto || "-"}</td>
                    <td className="p-2">{item.descripcion}</td>
                    <td className="text-center p-2">{item.unidad_medida}</td>
                    <td className="text-right p-2">{item.cantidad}</td>
                    <td className="text-right p-2">{formatCurrency(item.valor_unitario)}</td>
                    <td className="text-right p-2 font-medium">{formatCurrency(item.valor_linea)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-72 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(data.valor_subtotal)}</span>
                </div>
                {data.impuestos.map((imp, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>{imp.nombre_impuesto || getNombreImpuesto(imp.tipo_impuesto)} ({imp.porcentaje}%):</span>
                    <span>{formatCurrency(imp.valor)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(data.valor_a_pagar)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => navigate("/compras")}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Volver
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Compra"}
            </button>
          </div>
        </>
      )}

      {guardado && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => navigate("/compras")}
            className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Ir a Compras
          </button>
        </div>
      )}
    </div>
  );
}
