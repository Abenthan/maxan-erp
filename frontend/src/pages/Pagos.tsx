import { useEffect, useState, useMemo } from "react";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Pago {
  id: number;
  fecha_pago: string;
  valor_total: string;
  referencia: string;
  anulado: boolean;
  medio_pago: string;
  cliente_id: number;
  cliente: string;
  nit_cliente: string | null;
  facturas_aplicadas: number;
}

interface PagoDetalle extends Pago {
  medio_pago_id?: number;
  observaciones?: string;
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

interface MedioPago {
  id: number;
  nombre: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string): string {
  if (!d) return "-";
  const parts = d.split("T")[0].split("-");
  if (parts.length !== 3) return d;
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).toLocaleDateString("es-CO");
}

const mediosPermitidos = ["Efectivo", "Transferencia Bancaria"];

export default function Pagos() {
  const api = useApi();
  const puedeGestionar = usePermiso("cartera.gestionar");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [filtroAnulado, setFiltroAnulado] = useState("");

  const pagosFiltrados = useMemo(() => {
    if (!filtroCliente) return pagos;
    const t = filtroCliente.toLowerCase();
    return pagos.filter((p) =>
      p.cliente.toLowerCase().includes(t) || (p.nit_cliente ?? "").toLowerCase().includes(t)
    );
  }, [pagos, filtroCliente]);

  const [detalle, setDetalle] = useState<PagoDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [editFecha, setEditFecha] = useState("");
  const [editMedio, setEditMedio] = useState("");
  const [editReferencia, setEditReferencia] = useState("");
  const [editObservaciones, setEditObservaciones] = useState("");

  const cargar = () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (filtroFechaDesde) params.set("fecha_desde", filtroFechaDesde);
    if (filtroFechaHasta) params.set("fecha_hasta", filtroFechaHasta);
    if (filtroAnulado) params.set("anulado", filtroAnulado);
    Promise.all([
      api.get<Pago[]>(`/cartera/pagos?${params.toString()}`),
      api.get<MedioPago[]>("/cartera/medios-pago"),
    ])
      .then(([p, mp]) => { setPagos(p); setMediosPago(mp); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, [api, filtroFechaDesde, filtroFechaHasta, filtroAnulado]);

  const abrirModal = async (id: number) => {
    setLoadingDetalle(true);
    setError("");
    try {
      const data = await api.get<PagoDetalle>(`/cartera/pagos/${id}`);
      setDetalle(data);
      setEditFecha(data.fecha_pago ? data.fecha_pago.slice(0, 10) : "");
      setEditMedio(data.medio_pago_id ? String(data.medio_pago_id) : "");
      setEditReferencia(data.referencia || "");
      setEditObservaciones(data.observaciones || "");
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

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detalle) return;
    setGuardando(true);
    setError("");
    try {
      const updated = await api.put<Pago>(`/cartera/pagos/${detalle.id}`, {
        fecha_pago: editFecha || null,
        medio_pago_id: editMedio ? parseInt(editMedio, 10) : null,
        referencia: editReferencia || null,
        observaciones: editObservaciones || null,
      });
      setPagos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setDetalle(null);
    } catch (e: any) {
      setError(e.message || "Error al guardar cambios");
    } finally {
      setGuardando(false);
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
              ) : pagosFiltrados.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">{pagos.length === 0 ? "No hay pagos registrados" : "No se encontraron pagos con esos filtros"}</td></tr>
              ) : (
                pagosFiltrados.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => !p.anulado && puedeGestionar && abrirModal(p.id)}
                    className={`border-b hover:bg-gray-50 ${!p.anulado && puedeGestionar ? "cursor-pointer" : ""} ${p.anulado ? "opacity-50" : ""}`}
                  >
                    <td className="p-3">{formatDate(p.fecha_pago)}</td>
                    <td className="p-3">
                      <div className="font-medium">{p.cliente}</div>
                      <div className="text-xs text-gray-500">{p.nit_cliente ?? ""}</div>
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

      {detalle && !loadingDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetalle(null)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Editar Pago</h2>
              <button onClick={() => setDetalle(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={guardarCambios} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
                <p className="text-sm font-medium text-gray-800">{detalle.cliente}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Valor total</label>
                <p className="text-sm font-semibold text-gray-800">{formatCurrency(Number(detalle.valor_total))}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de pago</label>
                  <input
                    type="date"
                    value={editFecha}
                    onChange={(e) => setEditFecha(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Medio de pago</label>
                  <select
                    value={editMedio}
                    onChange={(e) => setEditMedio(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Seleccionar...</option>
                    {mediosPago.filter((mp) => mediosPermitidos.includes(mp.nombre)).map((mp) => (
                      <option key={mp.id} value={mp.id}>{mp.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Referencia</label>
                <input
                  type="text"
                  value={editReferencia}
                  onChange={(e) => setEditReferencia(e.target.value)}
                  placeholder="N° transferencia, cheque..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Observaciones</label>
                <input
                  type="text"
                  value={editObservaciones}
                  onChange={(e) => setEditObservaciones(e.target.value)}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="border-t pt-4">
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
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {puedeGestionar && (
                  <button
                    type="button"
                    onClick={() => anularPago(detalle.id)}
                    className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 mr-auto"
                  >
                    Anular Pago
                  </button>
                )}
                {!detalle.anulado && (
                  <button
                    type="submit"
                    disabled={guardando}
                    className="px-6 py-2 text-sm rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                  >
                    {guardando ? "Guardando..." : "Guardar Cambios"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
