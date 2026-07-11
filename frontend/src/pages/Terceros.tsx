import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Tercero {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  digito_verificacion: string | null;
  tipo_persona: string | null;
  razon_social: string;
  direccion: string | null;
  ciudad: string | null;
  departamento: string | null;
  telefono: string | null;
  email: string | null;
  es_propio: boolean;
  created_at: string;
}

export default function Terceros() {
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("terceros.gestionar");
  const [terceros, setTerceros] = useState<Tercero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Tercero>>({});
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    const params = busqueda ? `?q=${encodeURIComponent(busqueda)}` : "";
    api.get<Tercero[]>(`/terceros${params}`)
      .then(setTerceros)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, busqueda]);

  useEffect(() => { cargar(); }, [cargar]);

  function abrirModal(t: Tercero) {
    setEditForm({ ...t });
    setEditandoId(t.id);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEditForm({});
    setEditandoId(null);
  }

  async function guardarCambios(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.razon_social?.trim() || !editForm.numero_documento?.trim()) return;
    setGuardando(true);
    setError("");
    try {
      await api.put(`/terceros/${editandoId}`, editForm);
      cerrarModal();
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Terceros</h1>
        {puedeGestionar && (
          <button
            onClick={() => navigate("/nuevo-tercero")}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            + Nuevo
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre o NIT..."
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button
            onClick={() => setBusqueda("")}
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
                <th className="p-3 font-semibold text-gray-600">Documento</th>
                <th className="p-3 font-semibold text-gray-600">Razón Social</th>
                <th className="p-3 font-semibold text-gray-600">Ciudad</th>
                <th className="p-3 font-semibold text-gray-600">Teléfono</th>
                <th className="p-3 font-semibold text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody>
              {loading && terceros.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Cargando...</td></tr>
              ) : terceros.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No hay terceros registrados</td></tr>
              ) : (
                terceros.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => puedeGestionar && abrirModal(t)}
                    className={`border-b hover:bg-gray-50 ${puedeGestionar ? "cursor-pointer" : ""}`}
                  >
                    <td className="p-3">
                      <span className="text-xs text-gray-500">{t.tipo_documento === "13" ? "CC" : t.tipo_documento === "31" ? "NIT" : t.tipo_documento}</span>
                      <span className="ml-1">{t.numero_documento}{t.digito_verificacion ? `-${t.digito_verificacion}` : ""}</span>
                    </td>
                    <td className="p-3 font-medium">{t.razon_social}</td>
                    <td className="p-3 text-gray-600">{t.ciudad || "-"}</td>
                    <td className="p-3 text-gray-600">{t.telefono || "-"}</td>
                    <td className="p-3 text-gray-600 text-xs">{t.email || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {puedeGestionar && modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={cerrarModal}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Editar Tercero</h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={guardarCambios} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tipo doc.</label>
                  <select
                    value={editForm.tipo_documento || "13"}
                    onChange={(e) => setEditForm({ ...editForm, tipo_documento: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="13">CC</option>
                    <option value="31">NIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Número *</label>
                  <input
                    type="text"
                    value={editForm.numero_documento || ""}
                    onChange={(e) => setEditForm({ ...editForm, numero_documento: e.target.value })}
                    required
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Razón Social *</label>
                <input
                  type="text"
                  value={editForm.razon_social || ""}
                  onChange={(e) => setEditForm({ ...editForm, razon_social: e.target.value })}
                  required
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={editForm.ciudad || ""}
                    onChange={(e) => setEditForm({ ...editForm, ciudad: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Departamento</label>
                  <input
                    type="text"
                    value={editForm.departamento || ""}
                    onChange={(e) => setEditForm({ ...editForm, departamento: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dirección</label>
                <input
                  type="text"
                  value={editForm.direccion || ""}
                  onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={editForm.telefono || ""}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_es_propio"
                  checked={editForm.es_propio || false}
                  onChange={(e) => setEditForm({ ...editForm, es_propio: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="edit_es_propio" className="text-xs text-gray-600">Es empresa propia</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
