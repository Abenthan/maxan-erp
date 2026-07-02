import { useEffect, useState, useMemo, useCallback } from "react";
import { useApi } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";

interface ClienteDeuda {
  id: number;
  razon_social: string;
  numero_documento: string;
  total_deuda: string;
  facturas_pendientes: number;
}

interface CarteraItem {
  venta_id: number;
  numero_completo: string;
  fecha_emision: string;
  fecha_vencimiento: string | null;
  fecha_vencimiento_pago: string | null;
  valor_a_pagar: string;
  total_pagado: string;
  saldo_pendiente: string;
  cliente_id: number;
  cliente: string;
  nit_cliente: string;
  estado: string;
  estado_cartera: string;
  dias_vencida: number;
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
  return new Date(d).toLocaleDateString("es-CO");
}

const estadoBadge: Record<string, string> = {
  "Al día": "bg-green-100 text-green-800",
  "Vencida": "bg-red-100 text-red-800",
  "Sin vencimiento": "bg-gray-100 text-gray-800",
  "Pagada": "bg-blue-100 text-blue-800",
};

const diasColor = (dias: number): string => {
  if (dias <= 0) return "text-green-600";
  if (dias <= 30) return "text-yellow-600";
  if (dias <= 60) return "text-orange-600";
  if (dias <= 90) return "text-red-500";
  return "text-red-700 font-bold";
};

export default function Cartera() {
  const api = useApi();
  const navigate = useNavigate();

  const [items, setItems] = useState<CarteraItem[]>([]);
  const [clientes, setClientes] = useState<ClienteDeuda[]>([]);
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const cargar = useCallback(() => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (filtroCliente) params.set("cliente_id", filtroCliente);
    if (filtroEstado) params.set("estado_cartera", filtroEstado);
    Promise.all([
      api.get<CarteraItem[]>(`/cartera/activa?${params.toString()}`),
      api.get<ClienteDeuda[]>("/cartera/clientes-deuda"),
      api.get<MedioPago[]>("/cartera/medios-pago"),
    ])
      .then(([cartera, cl, mp]) => { setItems(cartera); setClientes(cl); setMediosPago(mp); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, filtroCliente, filtroEstado]);

  useEffect(() => { cargar(); }, [cargar]);

  const totales = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        valor: acc.valor + Number(i.valor_a_pagar),
        pagado: acc.pagado + Number(i.total_pagado),
        saldo: acc.saldo + Number(i.saldo_pendiente),
      }),
      { valor: 0, pagado: 0, saldo: 0 }
    );
  }, [items]);

  const [showModal, setShowModal] = useState(false);
  const [modalClienteId, setModalClienteId] = useState<number | null>(null);
  const [modalClienteNombre, setModalClienteNombre] = useState("");
  const [facturasCliente, setFacturasCliente] = useState<any[]>([]);
  const [cargandoFacturas, setCargandoFacturas] = useState(false);
  const [pagoFecha, setPagoFecha] = useState(new Date().toISOString().slice(0, 10));
  const [pagoMedio, setPagoMedio] = useState("");
  const [pagoReferencia, setPagoReferencia] = useState("");
  const [pagoObservaciones, setPagoObservaciones] = useState("");
  const [pagoValor, setPagoValor] = useState("");
  const [pagoAplicaciones, setPagoAplicaciones] = useState<Record<number, string>>({});
  const [guardando, setGuardando] = useState(false);

  function abrirModal(clienteId: number, clienteNombre: string) {
    setModalClienteId(clienteId);
    setModalClienteNombre(clienteNombre);
    setPagoFecha(new Date().toISOString().slice(0, 10));
    setPagoMedio("");
    setPagoReferencia("");
    setPagoObservaciones("");
    setPagoValor("");
    setPagoAplicaciones({});
    setCargandoFacturas(true);
    api.get<any[]>(`/cartera/clientes-deuda/${clienteId}/facturas`)
      .then((facturas) => {
        setFacturasCliente(facturas);
        const totalDeuda = facturas.reduce((s: number, f: any) => s + Number(f.saldo_pendiente), 0);
        setPagoValor(totalDeuda.toString());
        const apps: Record<number, string> = {};
        facturas.forEach((f: any) => { apps[f.venta_id] = f.saldo_pendiente; });
        setPagoAplicaciones(apps);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargandoFacturas(false));
    setShowModal(true);
  }

  function handleAplicacionChange(ventaId: number, valor: string) {
    const nuevas = { ...pagoAplicaciones, [ventaId]: valor };
    setPagoAplicaciones(nuevas);
    const total = Object.values(nuevas).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    setPagoValor(total.toString());
  }

  function distribuirPorcentaje(pct: number) {
    const nuevas: Record<number, string> = {};
    facturasCliente.forEach((f) => {
      nuevas[f.venta_id] = ((Number(f.saldo_pendiente) * pct) / 100).toFixed(2);
    });
    setPagoAplicaciones(nuevas);
    const total = Object.values(nuevas).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    setPagoValor(total.toString());
  }

  async function handleGuardarPago(e: React.FormEvent) {
    e.preventDefault();
    if (!modalClienteId || !pagoValor) return;
    setGuardando(true);
    setError("");
    try {
      const aplicaciones = Object.entries(pagoAplicaciones)
        .filter(([, v]) => parseFloat(v) > 0)
        .map(([ventaId, valor]) => ({ venta_id: parseInt(ventaId, 10), valor_aplicado: parseFloat(valor) }));

      await api.post("/cartera/pagos", {
        cliente_id: modalClienteId,
        medio_pago_id: pagoMedio ? parseInt(pagoMedio, 10) : null,
        referencia: pagoReferencia || null,
        fecha_pago: pagoFecha,
        valor_total: parseFloat(pagoValor),
        observaciones: pagoObservaciones || null,
        aplicaciones,
      });
      setShowModal(false);
      cargar();
    } catch (e: any) {
      setError(e.message || "Error al guardar pago");
    } finally {
      setGuardando(false);
    }
  }

  if (loading && items.length === 0) return <p className="text-gray-500">Cargando cartera...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cartera</h1>
        <button
          onClick={() => navigate("/cartera/nuevo-pago")}
          className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
        >
          + Nuevo Pago
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
            <select
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos los clientes</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.razon_social} - ${formatCurrency(Number(c.total_deuda))}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos</option>
              <option value="Al día">Al día</option>
              <option value="Vencida">Vencida</option>
              <option value="Sin vencimiento">Sin vencimiento</option>
            </select>
          </div>
          <button
            onClick={() => { setFiltroCliente(""); setFiltroEstado(""); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600">Factura</th>
                <th className="p-3 font-semibold text-gray-600">Cliente</th>
                <th className="p-3 font-semibold text-gray-600">Emisión</th>
                <th className="p-3 font-semibold text-gray-600">Vcto</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Original</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Pagado</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Saldo</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Días</th>
                <th className="p-3 font-semibold text-gray-600">Estado</th>
                <th className="p-3 font-semibold text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-400">No hay facturas pendientes</td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.venta_id} className={`border-b hover:bg-gray-50 ${it.dias_vencida > 0 ? "bg-red-50/30" : ""}`}>
                    <td className="p-3 font-medium">{it.numero_completo}</td>
                    <td className="p-3">
                      <div className="font-medium">{it.cliente}</div>
                      <div className="text-xs text-gray-500">{it.nit_cliente}</div>
                    </td>
                    <td className="p-3 text-gray-600">{formatDate(it.fecha_emision)}</td>
                    <td className="p-3 text-gray-600">{it.fecha_vencimiento_pago ? formatDate(it.fecha_vencimiento_pago) : "-"}</td>
                    <td className="p-3 text-right">{formatCurrency(Number(it.valor_a_pagar))}</td>
                    <td className="p-3 text-right text-green-600">{formatCurrency(Number(it.total_pagado))}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(Number(it.saldo_pendiente))}</td>
                    <td className={`p-3 text-right ${diasColor(it.dias_vencida)}`}>
                      {it.dias_vencida > 0 ? `${it.dias_vencida}d` : it.dias_vencida === 999 ? "90+" : "-"}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${estadoBadge[it.estado_cartera] || "bg-gray-100 text-gray-800"}`}>
                        {it.estado_cartera}
                      </span>
                    </td>
                    <td className="p-3">
                      {Number(it.saldo_pendiente) > 0 && (
                        <button
                          onClick={() => abrirModal(it.cliente_id, it.cliente)}
                          className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                        >
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {items.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={4} className="p-3 font-semibold text-gray-700">Totales</td>
                  <td className="p-3 text-right font-semibold">{formatCurrency(totales.valor)}</td>
                  <td className="p-3 text-right font-semibold text-green-600">{formatCurrency(totales.pagado)}</td>
                  <td className="p-3 text-right font-semibold text-purple-700">{formatCurrency(totales.saldo)}</td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !guardando && setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Pago - {modalClienteNombre}</h3>

            {cargandoFacturas ? (
              <p className="text-gray-500">Cargando facturas del cliente...</p>
            ) : (
              <form onSubmit={handleGuardarPago} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de pago</label>
                    <input
                      type="date"
                      value={pagoFecha}
                      onChange={(e) => setPagoFecha(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Medio de pago</label>
                    <select
                      value={pagoMedio}
                      onChange={(e) => setPagoMedio(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar...</option>
                      {mediosPago.map((mp) => (
                        <option key={mp.id} value={mp.id}>{mp.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Referencia</label>
                    <input
                      type="text"
                      value={pagoReferencia}
                      onChange={(e) => setPagoReferencia(e.target.value)}
                      placeholder="N° transferencia, cheque..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Valor total del pago</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pagoValor}
                      onChange={(e) => setPagoValor(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Observaciones</label>
                  <input
                    type="text"
                    value={pagoObservaciones}
                    onChange={(e) => setPagoObservaciones(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Distribución del pago</h4>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => distribuirPorcentaje(100)} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Pagar todo</button>
                      <button type="button" onClick={() => distribuirPorcentaje(50)} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">50%</button>
                    </div>
                  </div>
                  {facturasCliente.length === 0 ? (
                    <p className="text-sm text-gray-400">Este cliente no tiene facturas pendientes</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b text-xs text-gray-500">
                          <th className="pb-2 font-medium">Factura</th>
                          <th className="pb-2 font-medium">Fecha</th>
                          <th className="pb-2 font-medium text-right">Vcto</th>
                          <th className="pb-2 font-medium text-right">Saldo</th>
                          <th className="pb-2 font-medium text-right">A pagar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facturasCliente.map((f: any) => (
                          <tr key={f.venta_id} className="border-b last:border-0">
                            <td className="py-2 text-gray-800">{f.numero_completo}</td>
                            <td className="py-2 text-gray-600">{formatDate(f.fecha_emision)}</td>
                            <td className="py-2 text-gray-600 text-right">{f.fecha_vencimiento_pago ? formatDate(f.fecha_vencimiento_pago) : "-"}</td>
                            <td className="py-2 text-right font-medium">{formatCurrency(Number(f.saldo_pendiente))}</td>
                            <td className="py-2 text-right">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max={f.saldo_pendiente}
                                value={pagoAplicaciones[f.venta_id] || ""}
                                onChange={(e) => handleAplicacionChange(f.venta_id, e.target.value)}
                                className="w-28 px-2 py-1 text-xs border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={guardando}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardando || facturasCliente.length === 0}
                    className="px-6 py-2 text-sm rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                  >
                    {guardando ? "Guardando..." : "Confirmar Pago"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
