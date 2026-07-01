import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface ItemLinea {
  descripcion: string;
  cantidad: string;
  valor_unitario: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 }).format(n);
}

export default function NuevaVenta() {
  const navigate = useNavigate();
  const api = useApi();

  const [cliente, setCliente] = useState("");
  const [nit, setNit] = useState("");
  const [tipoDoc, setTipoDoc] = useState("13");
  const [dir, setDir] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [lineas, setLineas] = useState<ItemLinea[]>([
    { descripcion: "", cantidad: "1", valor_unitario: "" },
  ]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  function actualizarLinea(idx: number, campo: keyof ItemLinea, valor: string) {
    setLineas((prev) => {
      const copia = [...prev];
      copia[idx] = { ...copia[idx], [campo]: valor };
      return copia;
    });
  }

  function agregarLinea() {
    setLineas((prev) => [...prev, { descripcion: "", cantidad: "1", valor_unitario: "" }]);
  }

  function eliminarLinea(idx: number) {
    if (lineas.length <= 1) return;
    setLineas((prev) => prev.filter((_, i) => i !== idx));
  }

  const total = lineas.reduce((s, l) => {
    const cant = parseFloat(l.cantidad) || 0;
    const vr = parseFloat(l.valor_unitario) || 0;
    return s + cant * vr;
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente.trim() || !nit.trim()) return;
    if (!lineas.some((l) => l.descripcion.trim() && l.valor_unitario)) return;

    setGuardando(true);
    setError("");
    try {
      await api.post("/ventas", {
        receptor: {
          tipo_documento: tipoDoc,
          numero_documento: nit.trim(),
          razon_social: cliente.trim(),
          direccion: dir.trim() || undefined,
          ciudad: ciudad.trim() || undefined,
        },
        fecha_emision: fecha,
        items: lineas
          .filter((l) => l.descripcion.trim() && l.valor_unitario)
          .map((l) => {
            const cant = parseFloat(l.cantidad) || 1;
            const vr = parseFloat(l.valor_unitario) || 0;
            return {
              descripcion: l.descripcion.trim(),
              cantidad: cant,
              valor_unitario: vr,
              valor_linea: cant * vr,
            };
          }),
      });
      setExito("Venta registrada exitosamente");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Nueva Venta (sin factura)</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}
      {exito && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700 flex items-center justify-between">
          <span>{exito}</span>
          <button
            onClick={() => navigate("/ventas-items")}
            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700"
          >
            Ver items
          </button>
        </div>
      )}

      {!exito && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cliente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo doc.</label>
                <select
                  value={tipoDoc}
                  onChange={(e) => setTipoDoc(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                >
                  <option value="13">Cédula (CC)</option>
                  <option value="31">NIT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">NIT / CC *</label>
                <input
                  type="text"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  required
                  placeholder="123456789"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Cliente *</label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  required
                  placeholder="Nombre o razón social"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dirección</label>
                <input
                  type="text"
                  value={dir}
                  onChange={(e) => setDir(e.target.value)}
                  placeholder="Cra 1 # 2-3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Bogotá"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha *</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Items</h2>
              <button
                type="button"
                onClick={agregarLinea}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                + Agregar línea
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="p-2 font-semibold text-gray-600 w-2/5">Descripción</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-16">Cant</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-28">Vr Unitario</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-28">Total</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.map((l, idx) => {
                    const cant = parseFloat(l.cantidad) || 0;
                    const vr = parseFloat(l.valor_unitario) || 0;
                    return (
                      <tr key={idx} className="border-b">
                        <td className="p-1">
                          <input
                            type="text"
                            value={l.descripcion}
                            onChange={(e) => actualizarLinea(idx, "descripcion", e.target.value)}
                            placeholder="Descripción del item"
                            required
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            value={l.cantidad}
                            onChange={(e) => actualizarLinea(idx, "cantidad", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            value={l.valor_unitario}
                            onChange={(e) => actualizarLinea(idx, "valor_unitario", e.target.value)}
                            placeholder="0"
                            required
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-1 text-right font-medium align-middle">
                          {formatCurrency(cant * vr)}
                        </td>
                        <td className="p-1 text-center">
                          {lineas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => eliminarLinea(idx)}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                              title="Eliminar"
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <div className="w-56 space-y-1 text-sm">
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !cliente.trim() || !nit.trim() || total <= 0}
              className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar Venta"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
