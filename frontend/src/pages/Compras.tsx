import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface FacturaCompra {
  id: number;
  numero_completo: string;
  fecha_emision: string;
  proveedor: string;
  nit_proveedor: string;
  valor_a_pagar: string;
  estado: string;
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

export default function Compras() {
  const api = useApi();
  const [compras, setCompras] = useState<FacturaCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<FacturaCompra[]>("/compras")
      .then(setCompras)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  if (loading) return <p className="text-gray-500">Cargando compras...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
        <Link
          to="/nueva-compra"
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          + Subir XML
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600">N° Factura</th>
              <th className="p-3 font-semibold text-gray-600">Fecha</th>
              <th className="p-3 font-semibold text-gray-600">Proveedor</th>
              <th className="p-3 font-semibold text-gray-600 text-right">Valor</th>
              <th className="p-3 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{c.numero_completo}</td>
                <td className="p-3 text-gray-600">{new Date(c.fecha_emision).toLocaleDateString("es-CO")}</td>
                <td className="p-3">
                  <div className="font-medium">{c.proveedor}</div>
                  <div className="text-xs text-gray-500">{c.nit_proveedor}</div>
                </td>
                <td className="p-3 text-right font-medium">{formatCurrency(Number(c.valor_a_pagar))}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${estadoBadge[c.estado] || "bg-gray-100 text-gray-800"}`}>
                    {c.estado.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
            {compras.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">No hay compras registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
