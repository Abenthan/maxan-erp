import { useEffect, useState, useCallback } from "react";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
  permisos: { id: number; codigo: string; nombre: string; modulo: string }[];
}

interface Permiso {
  id: number;
  codigo: string;
  nombre: string;
  modulo: string;
}

export default function Roles() {
  const api = useApi();
  const puedeGestionar = usePermiso("usuarios.gestionar");

  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Rol | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedPermisos, setSelectedPermisos] = useState<number[]>([]);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    Promise.all([api.get<Rol[]>("/roles"), api.get<Permiso[]>("/permisos")])
      .then(([r, p]) => { setRoles(r); setPermisos(p); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => { cargar(); }, [cargar]);

  function abrirModal(rol?: Rol) {
    if (rol) {
      setEditando(rol);
      setNombre(rol.nombre);
      setDescripcion(rol.descripcion || "");
      setSelectedPermisos(rol.permisos.map((p) => p.id));
    } else {
      setEditando(null);
      setNombre("");
      setDescripcion("");
      setSelectedPermisos([]);
    }
    setShowModal(true);
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      if (editando) {
        await api.put(`/roles/${editando.id}`, { nombre, descripcion });
        await api.put(`/roles/${editando.id}/permisos`, { permisos: selectedPermisos });
      } else {
        const result = await api.post<{ rol_id: number }>("/roles", { nombre, descripcion });
        await api.put(`/roles/${result.rol_id}/permisos`, { permisos: selectedPermisos });
      }
      setShowModal(false);
      cargar();
    } catch (e: any) {
      setError(e.message || "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar este rol?")) return;
    try {
      await api.del(`/roles/${id}`);
      cargar();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function togglePermiso(id: number) {
    setSelectedPermisos((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  const permisosAgrupados = permisos.reduce((acc, p) => {
    if (!acc[p.modulo]) acc[p.modulo] = [];
    acc[p.modulo].push(p);
    return acc;
  }, {} as Record<string, Permiso[]>);

  if (!puedeGestionar) return <div className="p-8 text-center text-red-500">No tienes permiso para gestionar roles</div>;
  if (loading) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
        <button onClick={() => abrirModal()} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
          + Nuevo Rol
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((rol) => (
          <div key={rol.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{rol.nombre}</h3>
                {rol.descripcion && <p className="text-xs text-gray-500">{rol.descripcion}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => abrirModal(rol)} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200">Editar</button>
                <button onClick={() => handleEliminar(rol.id)} className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">Eliminar</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {rol.permisos.length === 0 ? (
                <span className="text-xs text-gray-400">Sin permisos asignados</span>
              ) : rol.permisos.map((p) => (
                <span key={p.id} className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{p.nombre}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !guardando && setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editando ? "Editar Rol" : "Nuevo Rol"}</h3>
            <form onSubmit={handleGuardar} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Permisos</p>
                {Object.entries(permisosAgrupados).map(([modulo, perms]) => (
                  <div key={modulo} className="mb-3">
                    <p className="text-xs font-medium text-gray-400 uppercase mb-1">{modulo}</p>
                    <div className="flex flex-wrap gap-2">
                      {perms.map((p) => (
                        <label key={p.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPermisos.includes(p.id)}
                            onChange={() => togglePermiso(p.id)}
                            className="rounded border-gray-300"
                          />
                          {p.nombre}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} disabled={guardando} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancelar</button>
                <button type="submit" disabled={guardando} className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">{guardando ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
