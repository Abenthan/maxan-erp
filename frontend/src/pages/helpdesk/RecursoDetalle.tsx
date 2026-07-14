import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";

interface Tercero {
  id: number;
  razon_social: string;
}

interface Recurso {
  id: number;
  cliente_id: number;
  cliente_nombre: string;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  referencia: string;
  serial: string;
  procesador: string;
  memoria_gb: number;
  almacenamiento_gb: number;
  sistema_operativo: string;
  ubicacion: string;
  descripcion: string;
  activo: boolean;
  atributos: Record<string, any>;
  created_at: string;
}

interface Mantenimiento {
  id: number;
  titulo: string;
  categoria_nombre: string;
  categoria_color: string;
  prioridad: string;
  estado: string;
  tecnico_nombre: string;
  fecha_solicitud: string;
  fecha_ejecucion: string;
  costo_total: number;
}

export default function RecursoDetalle() {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("helpdesk.gestionar");

  const [recurso, setRecurso] = useState<Recurso | null>(null);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [clientes, setClientes] = useState<Tercero[]>([]);

  const [form, setForm] = useState({
    cliente_id: 0,
    nombre: "",
    tipo: "Computador",
    marca: "",
    modelo: "",
    serial: "",
    procesador: "",
    memoria_gb: "",
    almacenamiento_gb: "",
    sistema_operativo: "",
    ubicacion: "",
    descripcion: "",
    activo: true,
    tipo_almacenamiento: "",
    chip_video: "",
    memoria_video_mb: "",
  });

  function iniciarEdicion() {
    if (!recurso) return;
    const a = recurso.atributos || {};
    setForm({
      cliente_id: recurso.cliente_id,
      nombre: recurso.nombre || "",
      tipo: recurso.tipo || "Computador",
      marca: recurso.marca || "",
      modelo: recurso.modelo || "",
      serial: recurso.serial || "",
      procesador: recurso.procesador || "",
      memoria_gb: recurso.memoria_gb?.toString() || "",
      almacenamiento_gb: recurso.almacenamiento_gb?.toString() || "",
      sistema_operativo: recurso.sistema_operativo || "",
      ubicacion: recurso.ubicacion || "",
      descripcion: recurso.descripcion || "",
      activo: recurso.activo,
      tipo_almacenamiento: a.tipo_almacenamiento || "",
      chip_video: a.chip_video || "",
      memoria_video_mb: a.memoria_video_mb?.toString() || "",
    });
    api.get<Tercero[]>("/terceros?tipo=cliente").then(setClientes).catch(() => {});
    setEditando(true);
  }

  async function guardar() {
    if (!form.nombre || !form.serial) return alert("Nombre y serial son obligatorios");
    setGuardando(true);
    try {
      await api.put(`/helpdesk/recursos/${id}`, {
        cliente_id: form.cliente_id,
        nombre: form.nombre,
        tipo: form.tipo,
        marca: form.marca,
        modelo: form.modelo,
        serial: form.serial,
        procesador: form.procesador,
        memoria_gb: form.memoria_gb ? Number(form.memoria_gb) : null,
        almacenamiento_gb: form.almacenamiento_gb ? Number(form.almacenamiento_gb) : null,
        sistema_operativo: form.sistema_operativo,
        ubicacion: form.ubicacion,
        descripcion: form.descripcion,
        activo: form.activo,
        atributos: {
          tipo_almacenamiento: form.tipo_almacenamiento || null,
          chip_video: form.chip_video || null,
          memoria_video_mb: form.memoria_video_mb ? Number(form.memoria_video_mb) : null,
        },
      });
      const updated = await api.get<Recurso>(`/helpdesk/recursos/${id}`);
      setRecurso(updated);
      setEditando(false);
    } catch (err: any) {
      if (err?.response?.data?.code === "DUPLICATE_SERIAL") {
        alert("Ya existe otro recurso con ese serial");
      } else {
        alert("Error al guardar: " + (err?.message || "desconocido"));
      }
    } finally {
      setGuardando(false);
    }
  }

  useEffect(() => {
    api.get<Recurso>(`/helpdesk/recursos/${id}`).then(setRecurso);
    api.get<Mantenimiento[]>(`/helpdesk/mantenimientos?recurso_id=${id}`).then(setMantenimientos);
  }, [api, id]);

  if (!recurso) return <div className="text-gray-400 p-8">Cargando...</div>;

  const a = recurso.atributos || {};

  if (editando) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Editar recurso</h1>
          <button onClick={() => setEditando(false)} className="text-sm text-gray-500 underline">Cancelar</button>
        </div>

        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Cliente *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.cliente_id} onChange={(e) => setForm({...form, cliente_id: Number(e.target.value)})}>
                <option value="">Seleccionar...</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Serial *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.serial} onChange={(e) => setForm({...form, serial: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Marca</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.marca} onChange={(e) => setForm({...form, marca: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Modelo</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.modelo} onChange={(e) => setForm({...form, modelo: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Procesador</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.procesador} onChange={(e) => setForm({...form, procesador: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">RAM (GB)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" step="0.1" value={form.memoria_gb} onChange={(e) => setForm({...form, memoria_gb: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Almacenamiento (GB)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" step="0.1" value={form.almacenamiento_gb} onChange={(e) => setForm({...form, almacenamiento_gb: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo disco</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.tipo_almacenamiento} onChange={(e) => setForm({...form, tipo_almacenamiento: e.target.value})}>
                <option value="">Seleccionar...</option>
                <option value="SSD">SSD</option>
                <option value="HDD">HDD</option>
                <option value="Desconocido">Desconocido</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Sistema Operativo</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.sistema_operativo} onChange={(e) => setForm({...form, sistema_operativo: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Chip de video</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.chip_video} onChange={(e) => setForm({...form, chip_video: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">VRAM (MB)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" value={form.memoria_video_mb} onChange={(e) => setForm({...form, memoria_video_mb: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ubicación</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.ubicacion} onChange={(e) => setForm({...form, ubicacion: e.target.value})} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.activo} onChange={(e) => setForm({...form, activo: e.target.checked})} className="rounded" />
                Activo
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Descripción</label>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={guardar} disabled={guardando}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
            <button onClick={() => setEditando(false)} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/helpdesk/recursos" className="text-sm text-gray-400 hover:text-gray-600">← Recursos</Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">{recurso.nombre}</h1>
        </div>
        <div className="flex gap-2">
          {puedeGestionar && (
            <button onClick={iniciarEdicion} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
              Editar
            </button>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${recurso.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {recurso.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Cliente</span>
          <p className="font-medium text-gray-800">{recurso.cliente_nombre}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Tipo</span>
          <p className="font-medium text-gray-800">{recurso.tipo}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Marca</span>
          <p className="font-medium text-gray-800">{recurso.marca || "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Modelo</span>
          <p className="font-medium text-gray-800">{recurso.modelo || "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Serial</span>
          <p className="font-medium text-gray-800 font-mono text-sm">{recurso.serial || "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Procesador</span>
          <p className="font-medium text-gray-800 text-sm">{recurso.procesador || "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Memoria RAM</span>
          <p className="font-medium text-gray-800">{recurso.memoria_gb ? `${recurso.memoria_gb} GB` : "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Almacenamiento</span>
          <p className="font-medium text-gray-800">{recurso.almacenamiento_gb ? `${recurso.almacenamiento_gb} GB` : "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Sistema Operativo</span>
          <p className="font-medium text-gray-800">{recurso.sistema_operativo || "-"}</p>
        </div>
        {a.tipo_almacenamiento && (
          <div className="bg-white border rounded-xl p-4">
            <span className="text-xs text-gray-400">Tipo disco</span>
            <p className="font-medium text-gray-800">{a.tipo_almacenamiento}</p>
          </div>
        )}
        {a.chip_video && (
          <div className="bg-white border rounded-xl p-4">
            <span className="text-xs text-gray-400">Chip de video</span>
            <p className="font-medium text-gray-800">{a.chip_video}</p>
          </div>
        )}
        {a.memoria_video_mb && (
          <div className="bg-white border rounded-xl p-4">
            <span className="text-xs text-gray-400">VRAM</span>
            <p className="font-medium text-gray-800">{a.memoria_video_mb} MB</p>
          </div>
        )}
        {recurso.ubicacion && (
          <div className="bg-white border rounded-xl p-4">
            <span className="text-xs text-gray-400">Ubicación</span>
            <p className="font-medium text-gray-800">{recurso.ubicacion}</p>
          </div>
        )}
      </div>

      {recurso.descripcion && (
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Descripción</span>
          <p className="text-sm text-gray-700 mt-1">{recurso.descripcion}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Historial de Mantenimientos</h2>
        <Link to={`/helpdesk/mantenimientos/nuevo?recurso=${recurso.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Nuevo mantenimiento
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Título</th>
              <th className="text-left px-4 py-3 font-medium">Categoría</th>
              <th className="text-left px-4 py-3 font-medium">Prioridad</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="text-left px-4 py-3 font-medium">Técnico</th>
              <th className="text-left px-4 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mantenimientos.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Sin mantenimientos registrados</td></tr>
            )}
            {mantenimientos.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/helpdesk/mantenimientos/${m.id}`)}>
                <td className="px-4 py-3 font-medium text-gray-800">{m.titulo}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: m.categoria_color + '20', color: m.categoria_color }}>
                    {m.categoria_nombre}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    m.prioridad === 'Crítica' ? 'bg-red-100 text-red-700' :
                    m.prioridad === 'Alta' ? 'bg-orange-100 text-orange-700' :
                    m.prioridad === 'Media' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{m.prioridad}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    m.estado === 'Completado' ? 'bg-green-100 text-green-700' :
                    m.estado === 'En Progreso' ? 'bg-blue-100 text-blue-700' :
                    m.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                    m.estado === 'Facturado' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>{m.estado}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{m.tecnico_nombre || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{m.fecha_solicitud}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
