import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface ClienteDeuda {
  id: number;
  razon_social: string;
  numero_documento: string;
  total_deuda: string;
  facturas_pendientes: number;
}

interface FacturaPendiente {
  venta_id: number;
  numero_completo: string;
  fecha_emision: string;
  fecha_vencimiento_pago: string | null;
  valor_a_pagar: string;
  saldo_pendiente: string;
  valor_retencion_fuente: string;
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
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO");
}

export default function NuevoPago() {
  const api = useApi();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<ClienteDeuda[]>([]);
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);

  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [facturas, setFacturas] = useState<FacturaPendiente[]>([]);
  const [cargandoFacturas, setCargandoFacturas] = useState(false);

  const [fechaPago, setFechaPago] = useState(new Date().toISOString().slice(0, 10));
  const [medioPagoId, setMedioPagoId] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [aplicaciones, setAplicaciones] = useState<Record<number, string>>({});
  const [retenciones, setRetenciones] = useState<Record<number, string>>({});
  const [valorTotal, setValorTotal] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<ClienteDeuda[]>("/cartera/clientes-deuda"),
      api.get<MedioPago[]>("/cartera/medios-pago"),
    ])
      .then(([c, mp]) => { setClientes(c); setMediosPago(mp); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  function saldoNeto(f: FacturaPendiente, retencionManual = 0): number {
    const ret = retencionManual || Number(f.valor_retencion_fuente || 0);
    return Math.max(Number(f.saldo_pendiente) - ret, 0);
  }

  const handleClienteChange = async (id: string) => {
    setClienteId(id);
    if (!id) return;
    const cl = clientes.find((c) => c.id === parseInt(id, 10));
    setClienteNombre(cl?.razon_social || "");
    setCargandoFacturas(true);
    setError("");
    try {
      const facs = await api.get<FacturaPendiente[]>(`/cartera/clientes-deuda/${id}/facturas`);
      setFacturas(facs);
      const apps: Record<number, string> = {};
      const totalDeuda = facs.reduce((s, f) => s + saldoNeto(f), 0);
      facs.forEach((f) => { apps[f.venta_id] = String(saldoNeto(f)); });
      setAplicaciones(apps);
      setRetenciones({});
      setValorTotal(totalDeuda.toString());
    } catch (e: any) {
      setError(e.message || "Error al cargar facturas");
    } finally {
      setCargandoFacturas(false);
    }
  };

  const handleRetencionChange = (ventaId: number, valor: string) => {
    const f = facturas.find((ff) => ff.venta_id === ventaId);
    if (!f) return;
    const ret = Math.min(Math.max(parseFloat(valor) || 0, 0), Number(f.saldo_pendiente));
    const nuevasRet = { ...retenciones, [ventaId]: String(ret) };
    setRetenciones(nuevasRet);
    const neto = saldoNeto(f, ret);
    const nuevasApps = { ...aplicaciones, [ventaId]: String(Math.min(parseFloat(aplicaciones[ventaId] || "0"), neto)) };
    setAplicaciones(nuevasApps);
    const total = Object.values(nuevasApps).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    setValorTotal(total.toString());
  };

  const handleAplicacionChange = (ventaId: number, valor: string) => {
    const f = facturas.find((ff) => ff.venta_id === ventaId);
    if (!f) return;
    const ret = parseFloat(retenciones[ventaId] || "0");
    const maxNeto = Math.max(Number(f.saldo_pendiente) - ret, 0);
    const v = Math.min(Math.max(parseFloat(valor) || 0, 0), maxNeto);
    const nuevas = { ...aplicaciones, [ventaId]: String(v || "0") };
    setAplicaciones(nuevas);
    const total = Object.values(nuevas).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    setValorTotal(total.toString());
  };

  const distribuirPorcentaje = (pct: number) => {
    const nuevas: Record<number, string> = {};
    facturas.forEach((f) => {
      const ret = parseFloat(retenciones[f.venta_id] || "0");
      nuevas[f.venta_id] = ((saldoNeto(f, ret) * pct) / 100).toFixed(2);
    });
    setAplicaciones(nuevas);
    const total = Object.values(nuevas).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    setValorTotal(total.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !valorTotal) return;

    setGuardando(true);
    setError("");
    try {
      const apps = Object.entries(aplicaciones)
        .filter(([, v]) => parseFloat(v) > 0)
        .map(([ventaId, valor]) => ({
          venta_id: parseInt(ventaId, 10),
          valor_aplicado: parseFloat(valor),
          retencion: parseFloat(retenciones[ventaId] || "0") || undefined,
        }));

      await api.post("/cartera/pagos", {
        cliente_id: parseInt(clienteId, 10),
        medio_pago_id: medioPagoId ? parseInt(medioPagoId, 10) : null,
        referencia: referencia || null,
        fecha_pago: fechaPago,
        valor_total: parseFloat(valorTotal),
        observaciones: observaciones || null,
        aplicaciones: apps,
      });
      navigate("/cartera/pagos");
    } catch (e: any) {
      setError(e.message || "Error al guardar pago");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">&larr; Volver</button>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Pago</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? "text-purple-700 font-medium" : "text-gray-400"}`}>
                  {s === 1 ? "Cliente" : s === 2 ? "Facturas" : "Confirmar"}
                </span>
                {s < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar cliente</label>
              <select
                value={clienteId}
                onChange={(e) => { handleClienteChange(e.target.value); setStep(2); }}
                className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Seleccionar cliente con deuda --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.razon_social} ({c.facturas_pendientes} facturas - {formatCurrency(Number(c.total_deuda))})
                  </option>
                ))}
              </select>
              {clientes.length === 0 && (
                <p className="mt-3 text-sm text-gray-400">No hay clientes con facturas pendientes</p>
              )}
            </div>
          )}

          {step === 2 && clienteId && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">
                  Facturas pendientes de {clienteNombre}
                </h2>
                <div className="flex gap-2">
                  <button type="button" onClick={() => distribuirPorcentaje(100)} className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Pagar todo</button>
                  <button type="button" onClick={() => distribuirPorcentaje(50)} className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">50%</button>
                  <button type="button" onClick={() => distribuirPorcentaje(0)} className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">0%</button>
                </div>
              </div>

              {cargandoFacturas ? (
                <p className="text-gray-400 text-sm">Cargando facturas...</p>
              ) : facturas.length === 0 ? (
                <p className="text-gray-400 text-sm">Este cliente no tiene facturas pendientes</p>
              ) : (
                <table className="w-full text-sm mb-6">
                  <thead>
                    <tr className="bg-gray-50 border-b text-left">
                      <th className="p-3 font-semibold text-gray-600">Factura</th>
                      <th className="p-3 font-semibold text-gray-600">Fecha</th>
                      <th className="p-3 font-semibold text-gray-600">Vcto</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Original</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Saldo</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Retención</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">A pagar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturas.map((f) => {
                      const ret = parseFloat(retenciones[f.venta_id] || "0") || Number(f.valor_retencion_fuente || 0);
                      return (
                        <tr key={f.venta_id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{f.numero_completo}</td>
                          <td className="p-3 text-gray-600">{formatDate(f.fecha_emision)}</td>
                          <td className="p-3 text-gray-600">{f.fecha_vencimiento_pago ? formatDate(f.fecha_vencimiento_pago) : "-"}</td>
                          <td className="p-3 text-right">{formatCurrency(Number(f.valor_a_pagar))}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(Number(f.saldo_pendiente))}</td>
                          <td className="p-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0"
                              value={retenciones[f.venta_id] || ""}
                              onChange={(e) => handleRetencionChange(f.venta_id, e.target.value)}
                              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-600"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max={saldoNeto(f, ret)}
                              value={aplicaciones[f.venta_id] || ""}
                              onChange={(e) => handleAplicacionChange(f.venta_id, e.target.value)}
                              className="w-28 px-2 py-1 text-xs border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de pago</label>
                  <input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Medio de pago</label>
                  <select
                    value={medioPagoId}
                    onChange={(e) => setMedioPagoId(e.target.value)}
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
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="N° transferencia, cheque..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Valor total a pagar</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorTotal}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 font-semibold"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Observaciones</label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {step === 3 && clienteId && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Confirmar pago</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Cliente:</span><span className="font-medium">{clienteNombre}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span>{formatDate(fechaPago)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Medio:</span><span>{mediosPago.find((m) => m.id === parseInt(medioPagoId))?.nombre || "-"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Referencia:</span><span>{referencia || "-"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Valor total:</span><span className="font-bold text-lg">{formatCurrency(parseFloat(valorTotal || "0"))}</span></div>
              </div>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-left border-b text-xs text-gray-500">
                    <th className="pb-2 font-medium">Factura</th>
                    <th className="pb-2 font-medium text-right">Valor aplicado</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(aplicaciones).filter(([, v]) => parseFloat(v) > 0).map(([ventaId, valor]) => {
                    const fac = facturas.find((f) => f.venta_id === parseInt(ventaId, 10));
                    return (
                      <tr key={ventaId} className="border-b last:border-0">
                        <td className="py-2">{fac?.numero_completo || `Venta #${ventaId}`}</td>
                        <td className="py-2 text-right font-medium">{formatCurrency(parseFloat(valor))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <div>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Atrás
                </button>
              )}
            </div>
            <div>
              {step < 3 && clienteId && (
                <button type="button" onClick={() => setStep(step + 1)} disabled={!clienteId || facturas.length === 0} className="px-6 py-2 text-sm rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50">
                  Siguiente
                </button>
              )}
              {step === 3 && (
                <button type="submit" disabled={guardando || !valorTotal} className="px-6 py-2 text-sm rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50">
                  {guardando ? "Guardando..." : "Confirmar Pago"}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
