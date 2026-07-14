import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";

interface Detalle {
  id: number;
  contenido: string;
  tipo: string;
  creado_por_nombre: string;
  created_at: string;
}

interface Mantenimiento {
  id: number;
  titulo: string;
  descripcion: string;
  recurso_nombre: string;
  recurso_serial: string;
  categoria_nombre: string;
  categoria_color: string;
  prioridad: string;
  estado: string;
  tecnico_nombre: string;
  fecha_solicitud: string;
  fecha_ejecucion: string;
  costo_mano_obra: number;
  costo_repuestos: number;
  costo_total: number;
  observaciones: string;
}

export default function MantenimientoDetalle() {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("helpdesk.gestionar");
  const [m, setM] = useState<Mantenimiento | null>(null);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState("");
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    estado: "", prioridad: "", observaciones: "", fecha_ejecucion: "",
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<Mantenimiento>(`/helpdesk/mantenimientos/${id}`),
      api.get<Detalle[]>(`/helpdesk/detalles/${id}`),
    ]).then(([mant, dets]) => {
      setM(mant);
      setDetalles(dets);
    }).catch(() => navigate("/helpdesk/mantenimientos"));
  }, [api, id, navigate]);

  function iniciarEdicion() {
    if (!m) return;
    setForm({
      estado: m.estado,
      prioridad: m.prioridad,
      observaciones: m.observaciones || "",
      fecha_ejecucion: m.fecha_ejecucion ? m.fecha_ejecucion.slice(0, 10) : "",
    });
    setEditando(true);
  }

  async function guardarEdicion() {
    if (!m) return;
    try {
      await api.put(`/helpdesk/mantenimientos/${id}`, {
        recurso_id: 0, categoria_id: null, tecnico_id: null,
        titulo: m.titulo, descripcion: m.descripcion,
        prioridad: form.prioridad,
        estado: form.estado,
        fecha_solicitud: m.fecha_solicitud,
        fecha_ejecucion: form.fecha_ejecucion || null,
        costo_mano_obra: m.costo_mano_obra,
        costo_repuestos: m.costo_repuestos,
        observaciones: form.observaciones,
      });
      const updated = await api.get<Mantenimiento>(`/helpdesk/mantenimientos/${id}`);
      setM(updated);
      setEditando(false);
    } catch (err: any) {
      alert("Error al guardar: " + (err?.message || "desconocido"));
    }
  }

  async function agregarDetalle() {
    if (!nuevoDetalle.trim()) return;
    try {
      await api.post(`/helpdesk/detalles/${id}`, { contenido: nuevoDetalle, tipo: "Comentario" });
      const dets = await api.get<Detalle[]>(`/helpdesk/detalles/${id}`);
      setDetalles(dets);
      setNuevoDetalle("");
    } catch {
      alert("Error al agregar detalle");
    }
  }

  if (!m) return <div className="text-gray-400 p-8 text-center">Cargando...</div>;

  const badgeEstado = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "bg-yellow-100 text-yellow-800";
      case "En Progreso": return "bg-blue-100 text-blue-800";
      case "Completado": return "bg-green-100 text-green-800";
      case "Facturado": return "bg-purple-100 text-purple-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const badgePrioridad = (p: string) => {
    switch (p) {
      case "Crítica": return "bg-red-100 text-red-700";
      case "Alta": return "bg-orange-100 text-orange-700";
      case "Media": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (editando) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Editar Mantenimiento</h1>
          <button onClick={() => setEditando(false)} className="text-sm text-gray-500 underline">Cancelar</button>
        </div>
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <select value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completado">Completado</option>
                <option value="Facturado">Facturado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Prioridad</label>
              <select value={form.prioridad} onChange={(e) => setForm({...form, prioridad: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fecha ejecución</label>
              <input type="date" value={form.fecha_ejecucion} onChange={(e) => setForm({...form, fecha_ejecucion: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Observaciones</label>
            <textarea value={form.observaciones} onChange={(e) => setForm({...form, observaciones: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={guardarEdicion} className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-amber-700">Guardar cambios</button>
            <button onClick={() => setEditando(false)} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate("/helpdesk/mantenimientos")} className="text-sm text-gray-400 hover:text-gray-600 block">
        ← Volver a mantenimientos
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{m.titulo}</h1>
        <div className="flex gap-2">
          {puedeGestionar && (
            <button onClick={iniciarEdicion} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
              Editar
            </button>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeEstado(m.estado)}`}>{m.estado}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Recurso</span>
          <p className="font-medium text-gray-800">{m.recurso_nombre || m.recurso_serial || "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Categoría</span>
          <p className="font-medium text-gray-800">
            {m.categoria_nombre ? (
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: m.categoria_color + '20', color: m.categoria_color }}>
                {m.categoria_nombre}
              </span>
            ) : "-"}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Prioridad</span>
          <p><span className={`px-2 py-0.5 rounded text-xs font-medium ${badgePrioridad(m.prioridad)}`}>{m.prioridad}</span></p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Técnico</span>
          <p className="font-medium text-gray-800">{m.tecnico_nombre || "-"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Fecha solicitud</span>
          <p className="font-medium text-gray-800">{new Date(m.fecha_solicitud).toLocaleDateString()}</p>
        </div>
        {m.fecha_ejecucion && (
          <div className="bg-white border rounded-xl p-4">
            <span className="text-xs text-gray-400">Fecha ejecución</span>
            <p className="font-medium text-gray-800">{new Date(m.fecha_ejecucion).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Costo mano de obra</span>
          <p className="font-medium text-gray-800 text-lg">${Number(m.costo_mano_obra || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Costo repuestos</span>
          <p className="font-medium text-gray-800 text-lg">${Number(m.costo_repuestos || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border rounded-xl p-4 bg-amber-50">
          <span className="text-xs text-amber-600">Costo total</span>
          <p className="font-bold text-amber-800 text-lg">${Number(m.costo_total || 0).toLocaleString()}</p>
        </div>
      </div>

      {m.descripcion && (
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Descripción</span>
          <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{m.descripcion}</p>
        </div>
      )}

      {m.observaciones && (
        <div className="bg-white border rounded-xl p-4">
          <span className="text-xs text-gray-400">Observaciones</span>
          <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{m.observaciones}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">Bitácora</h2>

        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {detalles.length === 0 && (
            <div className="p-6 text-center text-gray-400 text-sm">Sin comentarios</div>
          )}
          {detalles.map((d) => (
            <div key={d.id} className="p-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="font-medium text-gray-600">{d.creado_por_nombre || "Sistema"}</span>
                <span>{new Date(d.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{d.contenido}</p>
            </div>
          ))}
        </div>

        {puedeGestionar && (
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 border rounded-lg px-4 py-2.5 text-sm"
              placeholder="Agregar comentario..."
              value={nuevoDetalle}
              onChange={(e) => setNuevoDetalle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") agregarDetalle(); }}
            />
            <button onClick={agregarDetalle} className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700">
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
