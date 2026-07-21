import { useEffect, useState, useCallback, useMemo } from "react";
import { useApi } from "../context/ApiContext";

interface FacturaUtilidad {
  id: number;
  numero_completo: string;
  fecha_emision: string;
  cliente: string;
  total_ingresos: number;
  total_costo_inventario: number;
  total_costo_directo: number;
  total_utilidad: number;
}

interface LineaUtilidad {
  venta_item_id: number;
  descripcion: string;
  valor_linea: string;
  producto_id: number | null;
  costo_inventario: string;
  costo_directo: string;
  utilidad: string;
}

interface UtilidadFactura {
  factura: {
    id: number;
    numero_completo: string;
    valor_subtotal: string;
    valor_total_impuestos: string;
    valor_a_pagar: string;
  };
  resumen: {
    total_ingresos: number;
    total_costo_inventario: number;
    total_costo_directo: number;
    total_costos: number;
    total_utilidad: number;
    margen_porcentaje: number;
  };
  lineas: LineaUtilidad[];
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function Utilidad() {
  const api = useApi();
  const [facturas, setFacturas] = useState<FacturaUtilidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [facturaData, setFacturaData] = useState<UtilidadFactura | null>(null);
  const [facturaLoading, setFacturaLoading] = useState(false);
  const [facturaError, setFacturaError] = useState("");
  const [sortKey, setSortKey] = useState("fecha_emision");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedFacturas = useMemo(() => {
    const arr = [...facturas];
    arr.sort((a, b) => {
      const aVal = a[sortKey as keyof FacturaUtilidad] ?? "";
      const bVal = b[sortKey as keyof FacturaUtilidad] ?? "";
      let cmp = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = (aVal as number) - (bVal as number);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [facturas, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  function SortArrow({ col }: { col: string }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const cargarFacturas = useCallback((q: string) => {
    setLoading(true);
    setError("");
    api.get<FacturaUtilidad[]>(`/facturacion/utilidad/facturas?q=${encodeURIComponent(q)}`)
      .then(setFacturas)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => {
    cargarFacturas("");
  }, [cargarFacturas]);

  const seleccionarFactura = (id: number) => {
    setSelectedId(id);
    setFacturaLoading(true);
    setFacturaError("");
    setFacturaData(null);
    api.get<UtilidadFactura>(`/facturacion/${id}/utilidad`)
      .then(setFacturaData)
      .catch((e) => setFacturaError(e.message))
      .finally(() => setFacturaLoading(false));
  };

  const volver = () => {
    setSelectedId(null);
    setFacturaData(null);
  };

  if (selectedId) {
    if (facturaLoading) {
      return (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={volver} className="text-sm text-blue-600 hover:text-blue-800 font-medium">← Volver</button>
            <h1 className="text-2xl font-bold text-gray-900">Cargando...</h1>
          </div>
        </div>
      );
    }
    if (facturaError) {
      return (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={volver} className="text-sm text-blue-600 hover:text-blue-800 font-medium">← Volver</button>
            <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          </div>
          <p className="text-red-600">{facturaError}</p>
        </div>
      );
    }
    if (!facturaData) return null;

    const { factura, resumen, lineas } = facturaData;
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={volver} className="text-sm text-blue-600 hover:text-blue-800 font-medium">← Volver</button>
          <h1 className="text-2xl font-bold text-gray-900">Utilidad - {factura.numero_completo}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Factura</div>
            <div className="font-semibold">{factura.numero_completo}</div>
            <div className="text-xs text-gray-400">{facturaData.factura.id}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Ingresos</div>
            <div className="font-semibold text-blue-600">{formatCurrency(resumen.total_ingresos)}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Costos</div>
            <div className="font-semibold text-orange-600">
              {formatCurrency(resumen.total_costo_inventario)} + {formatCurrency(resumen.total_costo_directo)}
            </div>
            <div className="text-xs text-gray-400">Inv. + Directos</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Utilidad</div>
            <div className={`font-semibold ${resumen.total_utilidad >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(resumen.total_utilidad)}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Margen</div>
            <div className={`font-semibold ${resumen.margen_porcentaje >= 0 ? "text-green-600" : "text-red-600"}`}>
              {resumen.margen_porcentaje}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="p-3 font-semibold text-gray-600">#</th>
                  <th className="p-3 font-semibold text-gray-600">Descripción</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Ingreso</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Costo Inventario</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Costo Directo</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Utilidad</th>
                </tr>
              </thead>
              <tbody>
                {lineas.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400">Sin datos</td></tr>
                ) : (
                  lineas.map((l, i) => {
                    const util = Number(l.utilidad);
                    return (
                      <tr key={l.venta_item_id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-500">{i + 1}</td>
                        <td className="p-3">{l.descripcion}</td>
                        <td className="p-3 text-right">{formatCurrency(Number(l.valor_linea))}</td>
                        <td className="p-3 text-right">{formatCurrency(Number(l.costo_inventario))}</td>
                        <td className="p-3 text-right">{formatCurrency(Number(l.costo_directo))}</td>
                        <td className={`p-3 text-right font-semibold ${util >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(util)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Utilidad por Factura</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 max-w-sm">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar factura</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && cargarFacturas(search)}
              placeholder="N° de factura o cliente..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => cargarFacturas(search)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("numero_completo")}>N° Factura <SortArrow col="numero_completo" /></th>
                  <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("fecha_emision")}>Fecha <SortArrow col="fecha_emision" /></th>
                  <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("cliente")}>Cliente <SortArrow col="cliente" /></th>
                  <th className="p-3 font-semibold text-gray-600 text-right cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("total_ingresos")}>Ingresos <SortArrow col="total_ingresos" /></th>
                  <th className="p-3 font-semibold text-gray-600 text-right cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("total_costo_inventario")}>Costo Inv. <SortArrow col="total_costo_inventario" /></th>
                  <th className="p-3 font-semibold text-gray-600 text-right cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("total_costo_directo")}>Costo Directo <SortArrow col="total_costo_directo" /></th>
                  <th className="p-3 font-semibold text-gray-600 text-right cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("total_utilidad")}>Utilidad <SortArrow col="total_utilidad" /></th>
                  <th className="p-3 font-semibold text-gray-600 text-right cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("margen")}>Margen <SortArrow col="margen" /></th>
                </tr>
              </thead>
              <tbody>
                {sortedFacturas.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-gray-400">Sin datos</td></tr>
                ) : (
                  sortedFacturas.map((f) => {
                    const util = Number(f.total_utilidad);
                    const margen = f.total_ingresos > 0 ? Math.round((util / f.total_ingresos) * 10000) / 100 : 0;
                    return (
                      <tr
                        key={f.id}
                        className="border-b hover:bg-blue-50 cursor-pointer"
                        onClick={() => seleccionarFactura(f.id)}
                      >
                        <td className="p-3 font-medium text-blue-600">{f.numero_completo}</td>
                        <td className="p-3 text-gray-500">{f.fecha_emision?.split("T")[0]}</td>
                        <td className="p-3">{f.cliente || "-"}</td>
                        <td className="p-3 text-right">{formatCurrency(f.total_ingresos)}</td>
                        <td className="p-3 text-right text-orange-600">{formatCurrency(f.total_costo_inventario)}</td>
                        <td className="p-3 text-right text-orange-600">{formatCurrency(f.total_costo_directo)}</td>
                        <td className={`p-3 text-right font-semibold ${util >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(util)}
                        </td>
                        <td className={`p-3 text-right font-semibold ${margen >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {margen}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
