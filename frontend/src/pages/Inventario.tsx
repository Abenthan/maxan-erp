import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import * as XLSX from "xlsx";

interface StockItem {
  producto_id: number;
  nombre: string;
  categoria: string;
  stock_actual: string;
}

type SortKey = keyof StockItem;
type SortDir = "asc" | "desc";

export default function Inventario() {
  const api = useApi();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nombre");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    api.get<StockItem[]>("/inventario/stock")
      .then(setStock)
      .catch((e) => setError(e.message))
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

  const categoriasUnicas = useMemo(
    () => [...new Set(stock.map((s) => s.categoria).filter(Boolean))],
    [stock]
  );

  const filtrados = useMemo(() => {
    let items = [...stock];
    if (busqueda) {
      const q = busqueda.toLowerCase();
      items = items.filter((s) => s.nombre.toLowerCase().includes(q));
    }
    if (catFiltro) {
      items = items.filter((s) => s.categoria === catFiltro);
    }
    items.sort((a, b) => {
      let va: string | number = a[sortKey] ?? "";
      let vb: string | number = b[sortKey] ?? "";
      if (sortKey === "stock_actual") {
        va = Number(va);
        vb = Number(vb);
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return items;
  }, [stock, busqueda, catFiltro, sortKey, sortDir]);

  function exportarExcel() {
    const data = filtrados.map((s) => ({
      Producto: s.nombre,
      Categoría: s.categoria || "-",
      "Stock Actual": Number(s.stock_actual),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    XLSX.writeFile(wb, "inventario.xlsx");
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <span className="ml-1 text-gray-300">↕</span>;
    return <span className="ml-1 text-blue-600">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  if (loading) return <p className="text-gray-500">Cargando inventario...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        <button
          onClick={exportarExcel}
          disabled={filtrados.length === 0}
          className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar producto</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre del producto..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
            <select
              value={catFiltro}
              onChange={(e) => setCatFiltro(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todas</option>
              {categoriasUnicas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {filtrados.length < stock.length && (
            <div className="text-xs text-gray-400 pb-2">
              {filtrados.length} de {stock.length}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("nombre")}>
                Producto<SortIcon column="nombre" />
              </th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("categoria")}>
                Categoría<SortIcon column="categoria" />
              </th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none text-right" onClick={() => toggleSort("stock_actual")}>
                Stock Actual<SortIcon column="stock_actual" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((s) => (
              <tr key={s.producto_id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/inventario/movimientos?producto_id=${s.producto_id}&nombre=${encodeURIComponent(s.nombre)}`)}>
                <td className="p-3 font-medium">{s.nombre}</td>
                <td className="p-3 text-gray-600">{s.categoria || "-"}</td>
                <td className={`p-3 text-right font-bold ${Number(s.stock_actual) > 0 ? "text-green-600" : "text-red-600"}`}>
                  {Number(s.stock_actual).toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  {stock.length === 0 ? "No hay productos en inventario" : "No se encontraron productos con esos filtros"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
