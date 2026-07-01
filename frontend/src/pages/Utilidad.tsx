import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";

interface ProductoUtilidad {
  producto_id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  costo_adquisiciones: string;
  ingreso_ventas: string;
  otros_costos: string;
  utilidad: string;
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
  const [tab, setTab] = useState<"productos" | "factura">("productos");
  const [productos, setProductos] = useState<ProductoUtilidad[]>([]);
  const [productosLoading, setProductosLoading] = useState(false);
  const [productosError, setProductosError] = useState("");

  const [facturaId, setFacturaId] = useState("");
  const [facturaData, setFacturaData] = useState<UtilidadFactura | null>(null);
  const [facturaLoading, setFacturaLoading] = useState(false);
  const [facturaError, setFacturaError] = useState("");

  useEffect(() => {
    if (tab === "productos" && productos.length === 0 && !productosLoading) {
      setProductosLoading(true);
      setProductosError("");
      api.get<ProductoUtilidad[]>("/facturacion/utilidad/productos")
        .then(setProductos)
        .catch((e) => setProductosError(e.message))
        .finally(() => setProductosLoading(false));
    }
  }, [tab]);

  const cargarFactura = () => {
    if (!facturaId.trim()) return;
    setFacturaLoading(true);
    setFacturaError("");
    setFacturaData(null);
    api.get<UtilidadFactura>(`/facturacion/${facturaId.trim()}/utilidad`)
      .then(setFacturaData)
      .catch((e) => setFacturaError(e.message))
      .finally(() => setFacturaLoading(false));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Utilidad</h1>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("productos")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "productos" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Por Producto
        </button>
        <button
          onClick={() => setTab("factura")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "factura" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Por Factura
        </button>
      </div>

      {tab === "productos" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {productosLoading ? (
            <p className="p-6 text-gray-500">Cargando...</p>
          ) : productosError ? (
            <p className="p-6 text-red-600">{productosError}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="p-3 font-semibold text-gray-600">Código</th>
                    <th className="p-3 font-semibold text-gray-600">Nombre</th>
                    <th className="p-3 font-semibold text-gray-600">Categoría</th>
                    <th className="p-3 font-semibold text-gray-600 text-right">Costo Adq.</th>
                    <th className="p-3 font-semibold text-gray-600 text-right">Ingreso Ventas</th>
                    <th className="p-3 font-semibold text-gray-600 text-right">Otros Costos</th>
                    <th className="p-3 font-semibold text-gray-600 text-right">Utilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">Sin datos</td></tr>
                  ) : (
                    productos.map((p) => {
                      const util = Number(p.utilidad);
                      return (
                        <tr key={p.producto_id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-gray-500">{p.codigo}</td>
                          <td className="p-3 font-medium">{p.nombre}</td>
                          <td className="p-3 text-gray-500">{p.categoria || "-"}</td>
                          <td className="p-3 text-right">{formatCurrency(Number(p.costo_adquisiciones))}</td>
                          <td className="p-3 text-right">{formatCurrency(Number(p.ingreso_ventas))}</td>
                          <td className="p-3 text-right">{formatCurrency(Number(p.otros_costos))}</td>
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
          )}
        </div>
      )}

      {tab === "factura" && (
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 max-w-xs">
                <label className="block text-xs font-medium text-gray-500 mb-1">ID o N° de Factura</label>
                <input
                  type="text"
                  value={facturaId}
                  onChange={(e) => setFacturaId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && cargarFactura()}
                  placeholder="Ej: 123"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={cargarFactura}
                disabled={facturaLoading || !facturaId.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {facturaLoading ? "Cargando..." : "Consultar"}
              </button>
            </div>
          </div>

          {facturaError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{facturaError}</div>
          )}

          {facturaData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-xs text-gray-500 mb-1">Factura</div>
                  <div className="font-semibold">{facturaData.factura.numero_completo}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-xs text-gray-500 mb-1">Ingresos</div>
                  <div className="font-semibold text-blue-600">{formatCurrency(facturaData.resumen.total_ingresos)}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-xs text-gray-500 mb-1">Costos</div>
                  <div className="font-semibold text-orange-600">{formatCurrency(facturaData.resumen.total_costos)}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-xs text-gray-500 mb-1">Utilidad</div>
                  <div className={`font-semibold ${facturaData.resumen.total_utilidad >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(facturaData.resumen.total_utilidad)}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-xs text-gray-500 mb-1">Margen</div>
                  <div className={`font-semibold ${facturaData.resumen.margen_porcentaje >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {facturaData.resumen.margen_porcentaje}%
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
                      {facturaData.lineas.map((l, i) => {
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
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}