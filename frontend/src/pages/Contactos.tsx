import { useEffect, useState, useCallback } from "react";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Contacto {
  id: number;
  cliente_id: number | null;
  cliente_nombre: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  whatsapp: string | null;
  cargo: string | null;
  activo: boolean;
}

interface Tercero {
  id: number;
  razon_social: string;
  numero_documento: string;
}

export default function Contactos() {
  const api = useApi();
  const puedeGestionar = usePermiso("helpdesk.casos.gestionar");
  const puedeEliminar = usePermiso("usuarios.gestionar");
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [clientes, setClientes] = useState<{ id: number; razon_social: string }[]>([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contacto>>({});
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (busqueda) params.set("q", busqueda);
    if (filtroCliente) params.set("cliente_id", filtroCliente);
    api.get<Contacto[]>(`/generales/contactos?${params}`)
      .then(setContactos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, busqueda, filtroCliente]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    api.get<Tercero[]>("/terceros?tipo=cliente").then(setClientes).catch(() => {});
  }, [api]);

  function abrirModal(c: Contacto) {
    setEditForm({ ...c });
    setEditandoId(c.id);
    setModalAbierto(true);
  }

  function abrirModalNuevo() {
    setEditForm({ nombre: "", cliente_id: null, telefono: "", email: "", whatsapp: "", cargo: "" });
    setEditandoId(null);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEditForm({});
    setEditandoId(null);
  }

  async function guardarCambios(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.nombre?.trim()) return;
    setGuardando(true);
    setError("");
    try {
      if (editandoId) {
        await api.put(`/generales/contactos/${editandoId}`, editForm);
      } else {
        await api.post("/generales/contactos", editForm);
      }
      cerrarModal();
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarContacto() {
    if (!editandoId) return;
    if (!window.confirm("¿Estás seguro de eliminar este contacto?\nEsta acción no se puede deshacer.")) return;
    setGuardando(true);
    setError("");
    try {
      await api.del(`/generales/contactos/${editandoId}`);
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
              placeholder="Buscar por nombre, teléfono o WhatsApp..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Todos los clientes</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.razon_social}</option>
            ))}
          </select>
          {puedeGestionar && (
            <button
              onClick={abrirModalNuevo}
              className="px-4 py-2 text-sm rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Contacto
            </button>
          )}
          {(busqueda || filtroCliente) && (
            <button
              onClick={() => { setBusqueda(""); setFiltroCliente(""); }}
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
                <th className="p-3 font-semibold text-gray-600">Nombre</th>
                <th className="p-3 font-semibold text-gray-600">Cliente</th>
                <th className="p-3 font-semibold text-gray-600">Teléfono</th>
                <th className="p-3 font-semibold text-gray-600">Email</th>
                <th className="p-3 font-semibold text-gray-600">WhatsApp</th>
                <th className="p-3 font-semibold text-gray-600">Cargo</th>
                <th className="p-3 font-semibold text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && contactos.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-400">Cargando...</td></tr>
              ) : contactos.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-400">
                  {busqueda || filtroCliente
                    ? "No se encontraron contactos con esos filtros"
                    : "No hay contactos registrados"}
                </td></tr>
              ) : (
                contactos.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => puedeGestionar && abrirModal(c)}
                    className={`border-b hover:bg-gray-50 transition-colors ${puedeGestionar ? "cursor-pointer" : ""}`}
                  >
                    <td className="p-3 font-medium text-gray-900">{c.nombre}</td>
                    <td className="p-3 text-gray-600">{c.cliente_nombre || <span className="text-gray-300">—</span>}</td>
                    <td className="p-3 text-gray-600 font-mono text-xs">{c.telefono || <span className="text-gray-300">—</span>}</td>
                    <td className="p-3 text-gray-500 text-xs">{c.email || <span className="text-gray-300">—</span>}</td>
                    <td className="p-3 text-gray-500 text-xs">{c.whatsapp || <span className="text-gray-300">—</span>}</td>
                    <td className="p-3 text-gray-600">{c.cargo || <span className="text-gray-300">—</span>}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${c.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {contactos.length > 0 && (
          <div className="px-3 py-2 text-xs text-gray-400 border-t bg-gray-50/50">
            {contactos.length} contacto{contactos.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {puedeGestionar && modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={cerrarModal}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {editandoId ? "Editar Contacto" : "Nuevo Contacto"}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={guardarCambios} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
                <input type="text" value={editForm.nombre || ""} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
                <select value={editForm.cliente_id || ""} onChange={(e) => setEditForm({ ...editForm, cliente_id: e.target.value ? Number(e.target.value) : null })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                  <option value="">Sin cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.razon_social}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                  <input type="text" value={editForm.telefono || ""} onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input type="email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
                  <input type="text" value={editForm.whatsapp || ""} onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cargo</label>
                  <input type="text" value={editForm.cargo || ""} onChange={(e) => setEditForm({ ...editForm, cargo: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.activo !== false}
                    onChange={(e) => setEditForm({ ...editForm, activo: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Activo</span>
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
                {puedeEliminar && editandoId && (
                  <button
                    type="button"
                    onClick={eliminarContacto}
                    disabled={guardando}
                    className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-6 py-2 text-sm rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-50"
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
