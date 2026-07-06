import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";

interface RetencionItem {
  venta_id: number;
  numero_completo: string;
  cliente: string;
  nit_cliente: string;
  fecha_emision: string;
  valor_a_pagar: string;
  retencion_total: string;
  estado: string;
  saldo_pendiente: string | null;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string): string {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("es-CO");
}

const estadoBadge: Record<string, string> = {
  pendiente_pago: "bg-yellow-100 text-yellow-800",
  pagada_parcial: "bg-orange-100 text-orange-800",
  pagada: "bg-green-100 text-green-800",
  anulada: "bg-red-100 text-red-800",
  rechazada: "bg-gray-100 text-gray-800",
};

export default function Retenciones() {
  const api = useApi();
  const [items, setItems] = useState<RetencionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<RetencionItem[]>("/cartera/retenciones")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  const totalRetenciones = items.reduce((s, i) => s + Number(i.retencion_total), 0);

  if (loading) return <p className="text-gray-500">Cargando retenciones...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Retenciones</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Total retenciones registradas:</span>
          <span className="text-lg font-bold text-orange-600">{formatCurrency(totalRetenciones)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600">Factura</th>
                <th className="p-3 font-semibold text-gray-600">Cliente</th>
                <th className="p-3 font-semibold text-gray-600">Emisión</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Total Factura</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Retención</th>
                <th className="p-3 font-semibold text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">No hay retenciones registradas</td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.venta_id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{it.numero_completo}</td>
                    <td className="p-3">
                      <div className="font-medium">{it.cliente}</div>
                      <div className="text-xs text-gray-500">{it.nit_cliente}</div>
                    </td>
                    <td className="p-3 text-gray-600">{formatDate(it.fecha_emision)}</td>
                    <td className="p-3 text-right">{formatCurrency(Number(it.valor_a_pagar))}</td>
                    <td className="p-3 text-right font-semibold text-orange-700">{formatCurrency(Number(it.retencion_total))}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${estadoBadge[it.estado] || "bg-gray-100 text-gray-800"}`}>
                        {it.estado.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {items.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={4} className="p-3 font-semibold text-gray-700">Totales</td>
                  <td className="p-3 text-right font-bold text-orange-700">{formatCurrency(totalRetenciones)}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
