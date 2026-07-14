import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Gasto {
  id: number;
  descripcion: string;
  clasificacion: string;
  cantidad: string;
  valor_unitario: string;
  valor_total: string;
  fecha: string;
  producto_id: number | null;
  venta_item_id: number | null;
}

interface VentaItemDetalle {
  id: number;
  venta_id: number;
  numero_linea: number;
  descripcion: string;
  valor_linea: string;
  numero_completo: string;
  cliente: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

const clasifBadge: Record<string, string> = {
  Suministros: "bg-blue-100 text-blue-800",
  Operacional: "bg-amber-100 text-amber-800",
  Administrativo: "bg-purple-100 text-purple-800",
};

export default function GastosPorVentaItem() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const navigate = useNavigate();

  const [item, setItem] = useState<VentaItemDetalle | null>(null);
  const [vinculados, setVinculados] = useState<Gasto[]>([]);
  const [libres, setLibres] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accionId, setAccionId] = useState<number | null>(null);

  const [filtroDesc, setFiltroDesc] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  const [editGasto, setEditGasto] = useState<Gasto | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editClasif, setEditClasif] = useState("Operacional");
  const [editCant, setEditCant] = useState("1");
  const [editVrUnit, setEditVrUnit] = useState("");
  const [editFecha, setEditFecha] = useState("");
  const [editGuardando, setEditGuardando] = useState(false);

  const cargar = () => {
    if (!id) return;
    setLoading(true);
    setError("");

    Promise.all([
      api.get<VentaItemDetalle[]>("/ventas/items"),
      api.get<Gasto[]>("/gastos", { venta_item_id: id }),
      api.get<Gasto[]>("/gastos", { sin_vinculo: "true" }),
    ])
      .then(([itemsData, gastosVinculados, gastosLibres]) => {
        const found = itemsData.find((i) => i.id === parseInt(id, 10));
        setItem(found || null);
        setVinculados(gastosVinculados);
        setLibres(gastosLibres);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, [id, api]);

  async function vincular(gastoId: number) {
    if (!id) return;
    setAccionId(gastoId);
    setError("");
    try {
      await api.put(`/gastos/${gastoId}/vincular`, { venta_item_id: parseInt(id, 10) });
      cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al vincular");
    } finally {
      setAccionId(null);
    }
  }

  async function desvincular(gastoId: number) {
    setAccionId(gastoId);
    setError("");
    try {
      await api.put(`/gastos/${gastoId}/vincular`, { venta_item_id: null });
      cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al desvincular");
    } finally {
      setAccionId(null);
    }
  }

  function abrirEdicion(g: Gasto) {
    setEditGasto(g);
    setEditDesc(g.descripcion);
    setEditClasif(g.clasificacion === "Suministros" ? "Operacional" : g.clasificacion);
    setEditCant(g.cantidad);
    setEditVrUnit(g.valor_unitario);
    setEditFecha(g.fecha.slice(0, 10));
  }

  function cerrarEdicion() {
    setEditGasto(null);
    setEditDesc("");
    setEditClasif("Operacional");
    setEditCant("1");
    setEditVrUnit("");
    setEditFecha("");
  }

  const editTotal = (parseFloat(editCant) || 0) * (parseFloat(editVrUnit) || 0);

  async function guardarEdicion(e: React.FormEvent) {
    e.preventDefault();
    if (!editGasto || !editDesc.trim() || !editVrUnit) return;
    setEditGuardando(true);
    setError("");
    try {
      await api.put(`/gastos/${editGasto.id}`, {
        descripcion: editDesc.trim(),
        clasificacion: editClasif,
        cantidad: parseFloat(editCant),
        valor_unitario: parseFloat(editVrUnit),
        valor_total: editTotal,
        fecha: editFecha,
      });
      cerrarEdicion();
      cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setEditGuardando(false);
    }
  }

  const libresFiltrados = libres.filter((g) => {
    if (filtroDesc && !g.descripcion.toLowerCase().includes(filtroDesc.toLowerCase())) return false;
    if (filtroFechaDesde && g.fecha < filtroFechaDesde) return false;
    if (filtroFechaHasta && g.fecha > filtroFechaHasta) return false;
    return true;
  });

  if (loading && !item) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/financiero/ventas-items")}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Gastos del Item</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      {item && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Venta:</span>
              <p className="font-medium">{item.numero_completo}</p>
            </div>
            <div>
              <span className="text-gray-500">Cliente:</span>
              <p className="font-medium">{item.cliente}</p>
            </div>
            <div>
              <span className="text-gray-500">Item:</span>
              <p className="font-medium">#{item.numero_linea} — {item.descripcion}</p>
            </div>
            <div>
              <span className="text-gray-500">Valor:</span>
              <p className="font-medium">{formatCurrency(Number(item.valor_linea))}</p>
            </div>
          </div>
        </div>
      )}

      {vinculados.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-sm font-semibold text-gray-700">
              Gastos vinculados a este item ({vinculados.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white">
                <tr className="border-b text-left">
                  <th className="p-3 font-semibold text-gray-600">Fecha</th>
                  <th className="p-3 font-semibold text-gray-600">Descripción</th>
                  <th className="p-3 font-semibold text-gray-600">Clasificación</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Valor</th>
                  <th className="p-3 font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {vinculados.map((g) => (
                  <tr key={g.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => abrirEdicion(g)}>
                    <td className="p-3 text-gray-600">{new Date(g.fecha).toLocaleDateString("es-CO")}</td>
                    <td className="p-3 font-medium">{g.descripcion}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${clasifBadge[g.clasificacion] || "bg-gray-100 text-gray-800"}`}>
                        {g.clasificacion}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{formatCurrency(Number(g.valor_total))}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => desvincular(g.id)}
                        disabled={accionId === g.id}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        {accionId === g.id ? "..." : "Desvincular"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vinculados.length === 0 && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center text-gray-400">
          No hay gastos vinculados a este item
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar gasto sin vincular</label>
            <input
              type="text"
              value={filtroDesc}
              onChange={(e) => setFiltroDesc(e.target.value)}
              placeholder="Descripción..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
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
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h2 className="text-sm font-semibold text-gray-700">
            Gastos sin vincular ({libresFiltrados.length})
          </h2>
        </div>
        {libresFiltrados.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No hay gastos disponibles para vincular</div>
        ) : (
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-left">
                  <th className="p-3 font-semibold text-gray-600">Fecha</th>
                  <th className="p-3 font-semibold text-gray-600">Descripción</th>
                  <th className="p-3 font-semibold text-gray-600">Clasificación</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Valor</th>
                  <th className="p-3 font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {libresFiltrados.map((g) => (
                  <tr key={g.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => abrirEdicion(g)}>
                    <td className="p-3 text-gray-600">{new Date(g.fecha).toLocaleDateString("es-CO")}</td>
                    <td className="p-3 font-medium">{g.descripcion}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${clasifBadge[g.clasificacion] || "bg-gray-100 text-gray-800"}`}>
                        {g.clasificacion}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{formatCurrency(Number(g.valor_total))}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => vincular(g.id)}
                        disabled={accionId === g.id}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                      >
                        {accionId === g.id ? "..." : "Vincular"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editGasto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!editGuardando) cerrarEdicion(); }}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar Gasto</h3>
            <form onSubmit={guardarEdicion} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
                <input
                  type="date"
                  value={editFecha}
                  onChange={(e) => setEditFecha(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Clasificación</label>
                <select
                  value={editClasif}
                  onChange={(e) => setEditClasif(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Operacional">Operacional</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descripción *</label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Valor Unitario *</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={editVrUnit}
                  onChange={(e) => setEditVrUnit(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={editCant}
                  onChange={(e) => setEditCant(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Total (auto)</label>
                <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium">
                  {formatCurrency(editTotal)}
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarEdicion}
                  disabled={editGuardando}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editGuardando || !editDesc.trim() || !editVrUnit}
                  className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {editGuardando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
