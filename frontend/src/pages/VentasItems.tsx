import { useEffect, useState, useMemo } from "react";
import { useApi } from "../context/ApiContext";

interface VentaItem {
  id: number;
  venta_id: number;
  numero_linea: number;
  descripcion: string;
  codigo_producto: string;
  cantidad: string;
  unidad_medida: string;
  valor_unitario: string;
  valor_linea: string;
  numero_completo: string;
  fecha_emision: string;
  cliente: string;
  nit_cliente: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 }).format(n);
}

export default function VentasItems() {
  const api = useApi();
  const [items, setItems] = useState<VentaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroDesc, setFiltroDesc] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get<VentaItem[]>("/ventas/items")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  const filtrados = useMemo(() => {
    return items.filter((it) => {
      const matchDesc = !filtroDesc || it.descripcion.toLowerCase().includes(filtroDesc.toLowerCase());
      const matchDesde = !filtroFechaDesde || it.fecha_emision >= filtroFechaDesde;
      const matchHasta = !filtroFechaHasta || it.fecha_emision <= filtroFechaHasta;
      return matchDesc && matchDesde && matchHasta;
    });
  }, [items, filtroDesc, filtroFechaDesde, filtroFechaHasta]);

  if (loading && items.length === 0) return <p className="text-gray-500">Cargando items de venta...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Items de Ventas</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar por descripción</label>
            <input
              type="text"
              value={filtroDesc}
              onChange={(e) => setFiltroDesc(e.target.value)}
              placeholder="Descripción..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(filtroDesc || filtroFechaDesde || filtroFechaHasta) && (
            <button
              onClick={() => { setFiltroDesc(""); setFiltroFechaDesde(""); setFiltroFechaHasta(""); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-y-auto max-h-[500px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600">Venta</th>
                <th className="p-3 font-semibold text-gray-600">#</th>
                <th className="p-3 font-semibold text-gray-600">Descripción</th>
                <th className="p-3 font-semibold text-gray-600">Código</th>
                <th className="p-3 font-semibold text-gray-600">Cliente</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Cant</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Vr Unit</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Total</th>
                <th className="p-3 font-semibold text-gray-600">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    {items.length === 0 ? "No hay items registrados" : "No se encontraron items con esos filtros"}
                  </td>
                </tr>
              ) : (
                filtrados.map((it) => (
                  <tr key={it.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{it.numero_completo}</td>
                    <td className="p-3 text-gray-600">{it.numero_linea}</td>
                    <td className="p-3">{it.descripcion}</td>
                    <td className="p-3 text-gray-500 text-xs">{it.codigo_producto || "-"}</td>
                    <td className="p-3">
                      <div className="text-sm">{it.cliente}</div>
                      <div className="text-xs text-gray-500">{it.nit_cliente}</div>
                    </td>
                    <td className="p-3 text-right">{it.cantidad}</td>
                    <td className="p-3 text-right">{formatCurrency(Number(it.valor_unitario))}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(Number(it.valor_linea))}</td>
                    <td className="p-3 text-gray-600">{new Date(it.fecha_emision).toLocaleDateString("es-CO")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
