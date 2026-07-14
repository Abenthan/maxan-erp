import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

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
  const navigate = useNavigate();
  const puedeCrear = usePermiso("compras.crear");
  const [compras, setCompras] = useState<FacturaCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState<keyof FacturaCompra>("fecha_emision");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    api.get<FacturaCompra[]>("/compras")
      .then(setCompras)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  function toggleSort(key: keyof FacturaCompra) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtrados = useMemo(() => {
    return compras.filter((c) => {
      const matchBusq = !busqueda
        || c.numero_completo.toLowerCase().includes(busqueda.toLowerCase())
        || c.proveedor.toLowerCase().includes(busqueda.toLowerCase())
        || c.nit_proveedor.includes(busqueda);
      const matchDesde = !fechaDesde || c.fecha_emision >= fechaDesde;
      const matchHasta = !fechaHasta || c.fecha_emision <= fechaHasta;
      return matchBusq && matchDesde && matchHasta;
    });
  }, [compras, busqueda, fechaDesde, fechaHasta]);

  const sorted = useMemo(() => {
    return [...filtrados].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "fecha_emision":
          cmp = a.fecha_emision.localeCompare(b.fecha_emision);
          break;
        case "numero_completo":
          cmp = a.numero_completo.localeCompare(b.numero_completo);
          break;
        case "proveedor":
          cmp = a.proveedor.localeCompare(b.proveedor);
          break;
        case "valor_a_pagar":
          cmp = Number(a.valor_a_pagar) - Number(b.valor_a_pagar);
          break;
        case "estado":
          cmp = a.estado.localeCompare(b.estado);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtrados, sortKey, sortDir]);

  function SortIcon({ column }: { column: keyof FacturaCompra }) {
    if (sortKey !== column) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  if (loading) return <p className="text-gray-500">Cargando compras...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
        {puedeCrear && (
          <Link
            to="/financiero/nueva-compra"
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            + Subir XML
          </Link>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar por factura o proveedor</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="N° factura o proveedor..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(busqueda || fechaDesde || fechaHasta) && (
            <button
              onClick={() => { setBusqueda(""); setFechaDesde(""); setFechaHasta(""); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("numero_completo")}>N° Factura<SortIcon column="numero_completo" /></th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("fecha_emision")}>Fecha<SortIcon column="fecha_emision" /></th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("proveedor")}>Proveedor<SortIcon column="proveedor" /></th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none text-right" onClick={() => toggleSort("valor_a_pagar")}>Valor<SortIcon column="valor_a_pagar" /></th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("estado")}>Estado<SortIcon column="estado" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/financiero/compra/${c.id}`)}>
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
            {sorted.length === 0 && (
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
