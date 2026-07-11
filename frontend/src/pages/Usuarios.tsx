import { useEffect, useState, useCallback } from "react";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Usuario {
  id: number;
  empresa_id: number;
  empresa_nombre: string;
  username: string;
  email: string;
  nombres: string;
  apellidos: string;
  activo: boolean;
  roles: { id: number; nombre: string }[];
  created_at: string;
}

interface Rol {
  id: number;
  nombre: string;
}

export default function Usuarios() {
  const api = useApi();
  const puedeGestionar = usePermiso("usuarios.gestionar");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ username: "", email: "", nombres: "", apellidos: "", password: "", activo: true });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    Promise.all([api.get<Usuario[]>("/usuarios"), api.get<Rol[]>("/roles")])
      .then(([u, r]) => { setUsuarios(u); setRoles(r); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => { cargar(); }, [cargar]);

  function abrirModal(usuario?: Usuario) {
    if (usuario) {
      setEditando(usuario);
      setForm({ username: usuario.username, email: usuario.email, nombres: usuario.nombres, apellidos: usuario.apellidos, password: "", activo: usuario.activo });
      setSelectedRoles(usuario.roles.map((r) => r.id));
    } else {
      setEditando(null);
      setForm({ username: "", email: "", nombres: "", apellidos: "", password: "", activo: true });
      setSelectedRoles([]);
    }
    setShowModal(true);
  }

  function handleChange(k: string, v: string | boolean) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      if (editando) {
        const body: any = { username: form.username, email: form.email, nombres: form.nombres, apellidos: form.apellidos, activo: form.activo };
        if (form.password) body.password = form.password;
        await api.put(`/usuarios/${editando.id}`, body);
        await api.put(`/usuarios/${editando.id}/roles`, { roles: selectedRoles });
      } else {
        const result = await api.post<{ usuario_id: number }>("/usuarios", { ...form, empresa_id: 1 });
        await api.put(`/usuarios/${result.usuario_id}/roles`, { roles: selectedRoles });
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
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await api.del(`/usuarios/${id}`);
      cargar();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function toggleRol(rolId: number) {
    setSelectedRoles((prev) => prev.includes(rolId) ? prev.filter((r) => r !== rolId) : [...prev, rolId]);
  }

  if (!puedeGestionar) return <div className="p-8 text-center text-red-500">No tienes permiso para gestionar usuarios</div>;
  if (loading) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <button onClick={() => abrirModal()} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
          + Nuevo Usuario
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600">Usuario</th>
              <th className="p-3 font-semibold text-gray-600">Nombre</th>
              <th className="p-3 font-semibold text-gray-600">Email</th>
              <th className="p-3 font-semibold text-gray-600">Roles</th>
              <th className="p-3 font-semibold text-gray-600">Estado</th>
              <th className="p-3 font-semibold text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No hay usuarios registrados</td></tr>
            ) : usuarios.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{u.username}</td>
                <td className="p-3">{u.nombres} {u.apellidos}</td>
                <td className="p-3 text-gray-600">{u.email}</td>
                <td className="p-3">{u.roles.map((r) => r.nombre).join(", ") || "-"}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${u.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => abrirModal(u)} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200">Editar</button>
                    <button onClick={() => handleEliminar(u.id)} className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !guardando && setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editando ? "Editar Usuario" : "Nuevo Usuario"}</h3>
            <form onSubmit={handleGuardar} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Usuario *</label>
                  <input type="text" value={form.username} onChange={(e) => handleChange("username", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nombres *</label>
                  <input type="text" value={form.nombres} onChange={(e) => handleChange("nombres", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Apellidos *</label>
                  <input type="text" value={form.apellidos} onChange={(e) => handleChange("apellidos", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Contraseña {editando ? "(dejar vacío para mantener)" : "*"}
                  </label>
                  <input type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required={!editando} minLength={6} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.activo} onChange={(e) => handleChange("activo", e.target.checked)} className="rounded border-gray-300" />
                    <span className="text-gray-700">Usuario activo</span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map((rol) => (
                    <label key={rol.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(rol.id)}
                        onChange={() => toggleRol(rol.id)}
                        className="rounded border-gray-300"
                      />
                      {rol.nombre}
                    </label>
                  ))}
                </div>
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
