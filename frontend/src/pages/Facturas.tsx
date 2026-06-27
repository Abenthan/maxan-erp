import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FacturaResumen {
  id: number;
  numero_completo: string;
  fecha_emision: string;
  receptor: string;
  nit_receptor: string;
  valor_a_pagar: string;
  estado: string;
  cufe: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  }).format(n);
}

const estadoBadge: Record<string, string> = {
  recibida: "bg-blue-100 text-blue-800",
  pendiente_pago: "bg-yellow-100 text-yellow-800",
  pagada: "bg-green-100 text-green-800",
  anulada: "bg-red-100 text-red-800",
  rechazada: "bg-red-100 text-red-800",
};

export default function Facturas() {
  const [facturas, setFacturas] = useState<FacturaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/facturas")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar facturas");
        return res.json();
      })
      .then((data) => setFacturas(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando facturas...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Facturas</h1>
          <Link
            to="/nueva-factura"
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            + Nueva
          </Link>
        </div>

        {facturas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No hay facturas registradas
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="p-3 font-semibold text-gray-600">N° Factura</th>
                  <th className="p-3 font-semibold text-gray-600">Fecha</th>
                  <th className="p-3 font-semibold text-gray-600">Cliente</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Valor</th>
                  <th className="p-3 font-semibold text-gray-600">Estado</th>
                  <th className="p-3 font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f) => (
                  <tr key={f.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{f.numero_completo}</td>
                    <td className="p-3 text-gray-600">
                      {new Date(f.fecha_emision).toLocaleDateString("es-CO")}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{f.receptor}</div>
                      <div className="text-xs text-gray-500">{f.nit_receptor}</div>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatCurrency(Number(f.valor_a_pagar))}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          estadoBadge[f.estado] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {f.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/factura/${f.id}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
