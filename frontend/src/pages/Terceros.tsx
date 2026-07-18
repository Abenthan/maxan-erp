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
  es_cliente: boolean;
  es_proveedor: boolean;
  created_at: string;
}

function iniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

function avatarColor(nombre: string): string {
  const colores = [
    "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  return colores[Math.abs(hash) % colores.length];
}

export default function Terceros() {
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("terceros.gestionar");
  const puedeEliminar = usePermiso("usuarios.gestionar");
  const [terceros, setTerceros] = useState<Tercero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Tercero>>({});
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (busqueda) params.set("q", busqueda);
    if (filtroTipo) params.set("tipo", filtroTipo);
    api.get<Tercero[]>(`/terceros?${params}`)
      .then(setTerceros)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, busqueda, filtroTipo]);

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
    if (!editForm.razon_social?.trim()) return;
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

  async function eliminarTercero() {
    if (!editandoId) return;
    if (!window.confirm("¿Estás seguro de eliminar este tercero?\nEsta acción no se puede deshacer.")) return;
    setGuardando(true);
    setError("");
    try {
      await api.del(`/terceros/${editandoId}`);
      cerrarModal();
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o NIT..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="cliente">Clientes</option>
            <option value="proveedor">Proveedores</option>
          </select>
          {puedeGestionar && (
            <button
              onClick={() => navigate("/nuevo-tercero")}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo
            </button>
          )}
          {(busqueda || filtroTipo) && (
            <button
              onClick={() => { setBusqueda(""); setFiltroTipo(""); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600 w-10"></th>
                <th className="p-3 font-semibold text-gray-600">Documento</th>
                <th className="p-3 font-semibold text-gray-600">Razón Social</th>
                <th className="p-3 font-semibold text-gray-600">Tipo</th>
                <th className="p-3 font-semibold text-gray-600">Ciudad</th>
                <th className="p-3 font-semibold text-gray-600">Teléfono</th>
                <th className="p-3 font-semibold text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody>
              {loading && terceros.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-400">Cargando...</td></tr>
              ) : terceros.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-400">
                  {busqueda || filtroTipo
                    ? "No se encontraron terceros con esos filtros"
                    : "No hay terceros registrados"}
                </td></tr>
              ) : (
                terceros.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => puedeGestionar && abrirModal(t)}
                    className={`border-b hover:bg-gray-50 transition-colors ${puedeGestionar ? "cursor-pointer" : ""}`}
                  >
                    <td className="p-3">
                      <div className={`w-8 h-8 rounded-full ${avatarColor(t.razon_social)} text-white flex items-center justify-center text-xs font-bold`}>
                        {iniciales(t.razon_social) || "?"}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {t.tipo_documento && t.numero_documento ? (
                        <>
                          <span className="text-xs text-gray-500 font-medium">
                            {t.tipo_documento === "13" ? "CC" : t.tipo_documento === "31" ? "NIT" : t.tipo_documento}
                          </span>
                          <span className="ml-1 font-mono text-gray-800">{t.numero_documento}{t.digito_verificacion ? `-${t.digito_verificacion}` : ""}</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">S/I</span>
                      )}
                    <td className="p-3 font-medium text-gray-900">{t.razon_social}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {t.es_cliente && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            Cliente
                          </span>
                        )}
                        {t.es_proveedor && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                            Proveedor
                          </span>
                        )}
                        {!t.es_cliente && !t.es_proveedor && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{t.ciudad || <span className="text-gray-300">—</span>}</td>
                    <td className="p-3 text-gray-600 font-mono text-xs">{t.telefono || <span className="text-gray-300">—</span>}</td>
                    <td className="p-3 text-gray-500 text-xs">{t.email || <span className="text-gray-300">—</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {terceros.length > 0 && (
          <div className="px-3 py-2 text-xs text-gray-400 border-t bg-gray-50/50">
            {terceros.length} tercero{terceros.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {puedeGestionar && modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={cerrarModal}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${avatarColor(editForm.razon_social || "")} text-white flex items-center justify-center text-sm font-bold`}>
                  {iniciales(editForm.razon_social || "") || "?"}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Editar Tercero</h2>
                  <p className="text-xs text-gray-500">{editForm.razon_social}</p>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={guardarCambios} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tipo doc.</label>
                  <select
                    value={editForm.tipo_documento || "13"}
                    onChange={(e) => setEditForm({ ...editForm, tipo_documento: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">S/I (Sin Identificación)</option>
                    <option value="13">CC</option>
                    <option value="31">NIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Número</label>
                  <input
                    type="text"
                    value={editForm.numero_documento || ""}
                    onChange={(e) => setEditForm({ ...editForm, numero_documento: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={editForm.ciudad || ""}
                    onChange={(e) => setEditForm({ ...editForm, ciudad: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Departamento</label>
                  <input
                    type="text"
                    value={editForm.departamento || ""}
                    onChange={(e) => setEditForm({ ...editForm, departamento: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dirección</label>
                <input
                  type="text"
                  value={editForm.direccion || ""}
                  onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={editForm.telefono || ""}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.es_cliente || false}
                    onChange={(e) => setEditForm({ ...editForm, es_cliente: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Cliente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.es_proveedor || false}
                    onChange={(e) => setEditForm({ ...editForm, es_proveedor: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Proveedor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.es_propio || false}
                    onChange={(e) => setEditForm({ ...editForm, es_propio: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Empresa propia</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                {puedeEliminar && (
                  <button
                    type="button"
                    onClick={eliminarTercero}
                    disabled={guardando}
                    className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                )}
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
