import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Linea {
  id: number;
  descripcion: string;
  clasificacion: string;
  cantidad: string;
  valor_unitario: string;
  valor_total: string;
  fecha: string;
  producto_id: number | null;
}

interface FacturaCompraDetalle {
  id: number;
  tipo_documento_compra: string;
  codigo_unico_documento: string;
  numero_completo: string;
  fecha_emision: string;
  moneda: string;
  valor_subtotal: string;
  valor_total_impuestos: string;
  valor_iva: string;
  valor_a_pagar: string;
  estado: string;
  proveedor: string;
  nit_proveedor: string;
  lineas: Linea[];
}

interface Producto {
  id: number;
  nombre: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 }).format(n);
}

const estadoBadge: Record<string, string> = {
  recibida: "bg-blue-100 text-blue-800",
  pendiente_pago: "bg-yellow-100 text-yellow-800",
  pagada_parcial: "bg-orange-100 text-orange-800",
  pagada: "bg-green-100 text-green-800",
  anulada: "bg-red-100 text-red-800",
  rechazada: "bg-red-100 text-red-800",
};

export default function CompraDetalle() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [data, setData] = useState<FacturaCompraDetalle | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<FacturaCompraDetalle>(`/compras/${id}`),
      api.get<Producto[]>("/productos"),
    ])
      .then(([d, p]) => { setData(d); setProductos(p); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, id]);

  if (loading) return <p className="text-gray-500">Cargando detalle...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-gray-500">Factura no encontrada</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/compras" className="text-blue-600 hover:underline text-sm">&larr; Volver</Link>
        <h1 className="text-2xl font-bold text-gray-900">Compra {data.numero_completo}</h1>
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${estadoBadge[data.estado] || "bg-gray-100 text-gray-800"}`}>
          {data.estado.replace("_", " ")}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Encabezado</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Proveedor</span>
            <p className="font-medium">{data.proveedor}</p>
            <p className="text-xs text-gray-400">{data.nit_proveedor}</p>
          </div>
          <div>
            <span className="text-gray-500">Fecha emisión</span>
            <p className="font-medium">{new Date(data.fecha_emision).toLocaleDateString("es-CO")}</p>
          </div>
          <div>
            <span className="text-gray-500">Moneda</span>
            <p className="font-medium">{data.moneda}</p>
          </div>
          <div>
            <span className="text-gray-500">CUFE / CUD</span>
            <p className="font-mono text-xs break-all">{data.codigo_unico_documento || "—"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Líneas / Gastos generados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-2 font-semibold text-gray-600">Descripción</th>
                <th className="p-2 font-semibold text-gray-600">Clasificación</th>
                <th className="p-2 font-semibold text-gray-600">Producto</th>
                <th className="p-2 font-semibold text-gray-600 text-right">Cant</th>
                <th className="p-2 font-semibold text-gray-600 text-right">Valor Unit</th>
                <th className="p-2 font-semibold text-gray-600 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {data.lineas.map((l) => {
                const prod = productos.find((p) => p.id === l.producto_id);
                return (
                  <tr key={l.id} className="border-b">
                    <td className="p-2">{l.descripcion}</td>
                    <td className="p-2"><span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{l.clasificacion}</span></td>
                    <td className="p-2 text-sm">{prod ? prod.nombre : "-"}</td>
                    <td className="p-2 text-right">{Number(l.cantidad).toLocaleString("es-CO")}</td>
                    <td className="p-2 text-right">{formatCurrency(Number(l.valor_unitario))}</td>
                    <td className="p-2 text-right font-medium">{formatCurrency(Number(l.valor_total))}</td>
                  </tr>
                );
              })}
              {data.lineas.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Sin líneas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen financiero</h2>
        <div className="max-w-xs ml-auto space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatCurrency(Number(data.valor_subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">IVA</span>
            <span>{formatCurrency(Number(data.valor_iva))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Otros impuestos</span>
            <span>{formatCurrency(Number(data.valor_total_impuestos) - Number(data.valor_iva))}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total a pagar</span>
            <span>{formatCurrency(Number(data.valor_a_pagar))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
