import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

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

type SortKey = "numero_completo" | "fecha_emision" | "receptor" | "valor_a_pagar" | "estado";
type SortDir = "asc" | "desc";

export default function Facturas() {
  const [facturas, setFacturas] = useState<FacturaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("fecha_emision");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const api = useApi();
  const puedeCrear = usePermiso("facturas.crear");

  useEffect(() => {
    api.get<FacturaResumen[]>("/facturas")
      .then(setFacturas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [api]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtradas = useMemo(() => {
    const filtered = facturas.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch = !search
        || f.numero_completo.toLowerCase().includes(q)
        || f.receptor.toLowerCase().includes(q)
        || f.nit_receptor.includes(q);
      const matchFecha = (!fechaDesde || f.fecha_emision >= fechaDesde)
        && (!fechaHasta || f.fecha_emision <= fechaHasta + "T23:59:59");
      return matchSearch && matchFecha;
    });

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "numero_completo":
          cmp = a.numero_completo.localeCompare(b.numero_completo);
          break;
        case "fecha_emision":
          cmp = a.fecha_emision.localeCompare(b.fecha_emision);
          break;
        case "receptor":
          cmp = a.receptor.localeCompare(b.receptor);
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
  }, [facturas, search, fechaDesde, fechaHasta, sortKey, sortDir]);

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  function exportarExcel() {
    const data = filtradas.map((f) => ({
      "N° Factura": f.numero_completo,
      Fecha: new Date(f.fecha_emision).toLocaleDateString("es-CO"),
      Cliente: f.receptor,
      "NIT Cliente": f.nit_receptor,
      Valor: Number(f.valor_a_pagar),
      Estado: f.estado.replace("_", " "),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const colWidths = [
      { wch: 18 }, { wch: 14 }, { wch: 30 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
    ];
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facturas");
    XLSX.writeFile(wb, `facturas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando facturas...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Facturas</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={exportarExcel}
            disabled={filtradas.length === 0}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Excel
          </button>
          {puedeCrear && (
            <Link
              to="/financiero/nueva-factura"
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              + Nueva
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por factura, cliente o NIT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Fecha desde"
        />
        <span className="text-gray-400 text-sm">—</span>
        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Fecha hasta"
        />
        {(search || fechaDesde || fechaHasta) && (
          <button
            onClick={() => { setSearch(""); setFechaDesde(""); setFechaHasta(""); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar
          </button>
        )}
      </div>

      {filtradas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          {facturas.length === 0
            ? "No hay facturas registradas"
            : "No se encontraron facturas con esos filtros"}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("numero_completo")}>
                  <span className="flex items-center gap-1">N° Factura <SortIcon column="numero_completo" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("fecha_emision")}>
                  <span className="flex items-center gap-1">Fecha <SortIcon column="fecha_emision" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("receptor")}>
                  <span className="flex items-center gap-1">Cliente <SortIcon column="receptor" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600 text-right cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("valor_a_pagar")}>
                  <span className="flex items-center justify-end gap-1">Valor <SortIcon column="valor_a_pagar" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("estado")}>
                  <span className="flex items-center gap-1">Estado <SortIcon column="estado" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
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
                        to={`/financiero/factura/${f.id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 text-xs text-gray-400 border-t">
            {filtradas.length} de {facturas.length} facturas
          </div>
        </div>
      )}
    </div>
  );
}
