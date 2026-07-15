import { useEffect, useState, useMemo, useCallback } from "react";
import { useApi } from "../context/ApiContext";

interface DashboardData {
  resumen: {
    total_ventas: number;
    cantidad_ventas: number;
    total_gastos: number;
    cantidad_gastos: number;
    utilidad: number;
    margen_porcentaje: number;
  };
  ventas_por_mes: { mes: string; cantidad: number; total: number }[];
  gastos_por_mes: { mes: string; cantidad: number; total: number }[];
  gastos_por_clasificacion: { clasificacion: string; cantidad: number; total: number }[];
  top_clientes: { cliente_id: number; razon_social: string; cantidad_facturas: number; total_ventas: number }[];
  ultimas_facturas: { id: number; numero_completo: string; fecha_emision: string; cliente: string; valor_a_pagar: number }[];
  clientes: { id: number; razon_social: string; numero_documento: string }[];
  productos_utilidad: {
    producto_id: number; codigo: string; nombre: string;
    costo_adquisiciones: number; ingreso_ventas: number; otros_costos: number; utilidad: number;
  }[];
  cartera: {
    total_cartera: number;
    facturas_en_cartera: number;
    facturas_con_saldo: number;
    total_vencido: number;
    facturas_vencidas: number;
    proximos_a_vencer: number;
    total_por_vencer: number;
  };
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("es-CO");
}

function mesesOptions(): string[] {
  const opts: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    opts.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return opts;
}

function mesLabel(mes: string): string {
  const [y, m] = mes.split("-");
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${months[+m - 1]} ${y}`;
}

function maxTotal(items: { total: number }[]): number {
  return items.reduce((max, i) => Math.max(max, i.total), 0);
}

export default function Dashboard() {
  const api = useApi();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroMes, setFiltroMes] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroFactura, setFiltroFactura] = useState("");

  const cargar = useCallback(() => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (filtroMes) params.set("mes", filtroMes);
    if (filtroCliente) params.set("cliente_id", filtroCliente);
    if (filtroFactura) params.set("factura_id", filtroFactura);
    api.get<DashboardData>(`/dashboard?${params.toString()}`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, filtroMes, filtroCliente, filtroFactura]);

  useEffect(() => { cargar(); }, [cargar]);

  const mesesDisp = useMemo(() => mesesOptions(), []);

  const maxVentas = useMemo(() => data ? maxTotal(data.ventas_por_mes) : 0, [data]);
  const maxGastos = useMemo(() => data ? maxTotal(data.gastos_por_mes) : 0, [data]);
  const maxClasif = useMemo(() => data ? maxTotal(data.gastos_por_clasificacion) : 0, [data]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Financiero</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Mes</label>
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los meses</option>
              {mesesDisp.map((m) => (
                <option key={m} value={m}>{mesLabel(m)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
            <select
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los clientes</option>
              {data?.clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.razon_social}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Factura ID</label>
            <input
              type="text"
              value={filtroFactura}
              onChange={(e) => setFiltroFactura(e.target.value)}
              placeholder="Ej: 123"
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
            />
          </div>
          <button
            onClick={() => { setFiltroMes(""); setFiltroCliente(""); setFiltroFactura(""); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      {loading && !data && <p className="text-gray-500">Cargando dashboard...</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Ventas</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.resumen.total_ventas)}</div>
              <div className="text-xs text-gray-400 mt-1">{data.resumen.cantidad_ventas} facturas</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Gastos</div>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(data.resumen.total_gastos)}</div>
              <div className="text-xs text-gray-400 mt-1">{data.resumen.cantidad_gastos} registros</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Utilidad Bruta</div>
              <div className={`text-2xl font-bold ${data.resumen.utilidad >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(data.resumen.utilidad)}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Margen</div>
              <div className={`text-2xl font-bold ${data.resumen.margen_porcentaje >= 0 ? "text-green-600" : "text-red-600"}`}>
                {data.resumen.margen_porcentaje}%
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-3">Cartera</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Saldo por Cobrar</div>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(data.cartera.total_cartera)}</div>
              <div className="text-xs text-gray-400 mt-1">{data.cartera.facturas_con_saldo} facturas pendientes</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Vencido</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(data.cartera.total_vencido)}</div>
              <div className="text-xs text-gray-400 mt-1">{data.cartera.facturas_vencidas} facturas vencidas</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Por Vencer (30 días)</div>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(data.cartera.total_por_vencer)}</div>
              <div className="text-xs text-gray-400 mt-1">{data.cartera.proximos_a_vencer} facturas</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-500 mb-1">Facturas en Cartera</div>
              <div className="text-2xl font-bold text-purple-700">{data.cartera.facturas_en_cartera}</div>
              <div className="text-xs text-gray-400 mt-1">total registros</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Ventas por Mes</h2>
              {data.ventas_por_mes.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin datos</p>
              ) : (
                <div className="space-y-2">
                  {data.ventas_por_mes.map((item) => {
                    const pct = maxVentas > 0 ? (item.total / maxVentas) * 100 : 0;
                    return (
                      <div key={item.mes}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{mesLabel(item.mes)}</span>
                          <span>{formatCurrency(item.total)} ({item.cantidad})</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Gastos por Mes</h2>
              {data.gastos_por_mes.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin datos</p>
              ) : (
                <div className="space-y-2">
                  {data.gastos_por_mes.map((item) => {
                    const pct = maxGastos > 0 ? (item.total / maxGastos) * 100 : 0;
                    return (
                      <div key={item.mes}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{mesLabel(item.mes)}</span>
                          <span>{formatCurrency(item.total)} ({item.cantidad})</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Gastos por Clasificación</h2>
              {data.gastos_por_clasificacion.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin datos</p>
              ) : (
                <div className="space-y-3">
                  {data.gastos_por_clasificacion.map((item) => {
                    const pct = maxClasif > 0 ? (item.total / maxClasif) * 100 : 0;
                    const colors: Record<string, string> = {
                      Suministros: "bg-amber-500",
                      Operacional: "bg-violet-500",
                      Administrativo: "bg-rose-500",
                    };
                    return (
                      <div key={item.clasificacion}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{item.clasificacion}</span>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4">
                          <div className={`${colors[item.clasificacion] || "bg-gray-400"} h-4 rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Top Clientes</h2>
              {data.top_clientes.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin datos</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b text-xs text-gray-500">
                        <th className="pb-2 font-medium">Cliente</th>
                        <th className="pb-2 font-medium text-right">Facturas</th>
                        <th className="pb-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.top_clientes.map((c) => (
                        <tr key={c.cliente_id} className="border-b last:border-0">
                          <td className="py-2 text-gray-800">{c.razon_social}</td>
                          <td className="py-2 text-right text-gray-600">{c.cantidad_facturas}</td>
                          <td className="py-2 text-right font-medium">{formatCurrency(c.total_ventas)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Últimas Facturas</h2>
              {data.ultimas_facturas.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin datos</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b text-xs text-gray-500">
                        <th className="pb-2 font-medium">N°</th>
                        <th className="pb-2 font-medium">Cliente</th>
                        <th className="pb-2 font-medium">Fecha</th>
                        <th className="pb-2 font-medium text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ultimas_facturas.map((f) => (
                        <tr key={f.id} className="border-b last:border-0">
                          <td className="py-2 text-gray-800 font-medium">{f.numero_completo}</td>
                          <td className="py-2 text-gray-600">{f.cliente}</td>
                          <td className="py-2 text-gray-500">{formatDate(f.fecha_emision)}</td>
                          <td className="py-2 text-right font-medium">{formatCurrency(f.valor_a_pagar)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Utilidad por Producto</h2>
              {data.productos_utilidad.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin datos</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b text-xs text-gray-500">
                        <th className="pb-2 font-medium">Producto</th>
                        <th className="pb-2 font-medium text-right">Ingreso</th>
                        <th className="pb-2 font-medium text-right">Costo</th>
                        <th className="pb-2 font-medium text-right">Utilidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.productos_utilidad.map((p) => {
                        const util = Number(p.utilidad);
                        return (
                          <tr key={p.producto_id} className="border-b last:border-0">
                            <td className="py-2 text-gray-800">{p.nombre}</td>
                            <td className="py-2 text-right text-gray-600">{formatCurrency(Number(p.ingreso_ventas))}</td>
                            <td className="py-2 text-right text-gray-600">{formatCurrency(Number(p.costo_adquisiciones) + Number(p.otros_costos))}</td>
                            <td className={`py-2 text-right font-medium ${util >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatCurrency(util)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
