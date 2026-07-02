import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";

interface Pago {
  id: number;
  fecha_pago: string;
  valor_total: string;
  referencia: string;
  anulado: boolean;
  medio_pago: string;
  cliente_id: number;
  cliente: string;
  nit_cliente: string;
  facturas_aplicadas: number;
}

interface PagoDetalle extends Pago {
  aplicaciones: {
    id: number;
    pago_id: number;
    venta_id: number;
    valor_aplicado: string;
    factura_numero: string;
    factura_fecha: string;
    factura_valor: string;
  }[];
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string): string {
  if (!d) return "-";
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO");
}

export default function Pagos() {
  const api = useApi();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [filtroAnulado, setFiltroAnulado] = useState("");

  const [detalle, setDetalle] = useState<PagoDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const cargar = () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (filtroCliente) params.set("cliente_id", filtroCliente);
    if (filtroFechaDesde) params.set("fecha_desde", filtroFechaDesde);
    if (filtroFechaHasta) params.set("fecha_hasta", filtroFechaHasta);
    if (filtroAnulado) params.set("anulado", filtroAnulado);
    api.get<Pago[]>(`/cartera/pagos?${params.toString()}`)
      .then(setPagos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, [api, filtroCliente, filtroFechaDesde, filtroFechaHasta, filtroAnulado]);

  const verDetalle = async (id: number) => {
    setLoadingDetalle(true);
    setError("");
    try {
      const data = await api.get<PagoDetalle>(`/cartera/pagos/${id}`);
      setDetalle(data);
    } catch (e: any) {
      setError(e.message || "Error al cargar detalle");
    } finally {
      setLoadingDetalle(false);
    }
  };

  const anularPago = async (id: number) => {
    if (!confirm("¿Está seguro de anular este pago? Se revertirán las aplicaciones a las facturas.")) return;
    setError("");
    try {
      await api.post(`/cartera/pagos/${id}/anular`);
      setDetalle(null);
      cargar();
    } catch (e: any) {
      setError(e.message || "Error al anular pago");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pagos Recibidos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
            <input
              type="text"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              placeholder="Nombre o NIT..."
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
            <select
              value={filtroAnulado}
              onChange={(e) => setFiltroAnulado(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos</option>
              <option value="false">Activos</option>
              <option value="true">Anulados</option>
            </select>
          </div>
          <button
            onClick={() => { setFiltroCliente(""); setFiltroFechaDesde(""); setFiltroFechaHasta(""); setFiltroAnulado(""); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${detalle ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="p-3 font-semibold text-gray-600">Fecha</th>
                    <th className="p-3 font-semibold text-gray-600">Cliente</th>
                    <th className="p-3 font-semibold text-gray-600">Medio</th>
                    <th className="p-3 font-semibold text-gray-600">Referencia</th>
                    <th className="p-3 font-semibold text-gray-600 text-right">Valor</th>
                    <th className="p-3 font-semibold text-gray-600 text-right">Facturas</th>
                    <th className="p-3 font-semibold text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && pagos.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">Cargando...</td></tr>
                  ) : pagos.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">No hay pagos registrados</td></tr>
                  ) : (
                    pagos.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => verDetalle(p.id)}
                        className={`border-b hover:bg-gray-50 cursor-pointer ${detalle?.id === p.id ? "bg-purple-50 ring-2 ring-purple-400 ring-inset" : ""} ${p.anulado ? "opacity-50" : ""}`}
                      >
                        <td className="p-3">{formatDate(p.fecha_pago)}</td>
                        <td className="p-3">
                          <div className="font-medium">{p.cliente}</div>
                          <div className="text-xs text-gray-500">{p.nit_cliente}</div>
                        </td>
                        <td className="p-3 text-gray-600">{p.medio_pago || "-"}</td>
                        <td className="p-3 text-gray-500 text-xs">{p.referencia || "-"}</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(Number(p.valor_total))}</td>
                        <td className="p-3 text-right text-gray-600">{p.facturas_aplicadas}</td>
                        <td className="p-3">
                          {p.anulado ? (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Anulado</span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Activo</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {detalle && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Detalle del Pago</h2>
              <button onClick={() => setDetalle(null)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>

            {loadingDetalle ? (
              <p className="text-gray-500 text-sm">Cargando...</p>
            ) : (
              <>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-gray-500">Cliente:</span><span className="font-medium">{detalle.cliente}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span>{formatDate(detalle.fecha_pago)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Medio:</span><span>{detalle.medio_pago || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Referencia:</span><span className="text-xs">{detalle.referencia || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Valor total:</span><span className="font-semibold">{formatCurrency(Number(detalle.valor_total))}</span></div>
                </div>

                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Facturas aplicadas</h3>
                <div className="space-y-2">
                  {detalle.aplicaciones.map((app) => (
                    <div key={app.id} className="flex justify-between items-center bg-gray-50 rounded p-2 text-sm">
                      <div>
                        <div className="font-medium">{app.factura_numero}</div>
                        <div className="text-xs text-gray-500">{formatDate(app.factura_fecha)}</div>
                      </div>
                      <span className="font-medium">{formatCurrency(Number(app.valor_aplicado))}</span>
                    </div>
                  ))}
                </div>

                {!detalle.anulado && (
                  <button
                    onClick={() => anularPago(detalle.id)}
                    className="mt-4 w-full px-3 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Anular Pago
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
