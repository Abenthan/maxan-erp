import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface Recurso { id: number; nombre: string; serial: string; tipo: string; }
interface Categoria { id: number; nombre: string; color: string; }
interface Usuario { id: number; nombres: string; apellidos: string; }

export default function MantenimientoNuevo() {
  const api = useApi();
  const navigate = useNavigate();
  const { cliente } = useHelpdesk();
  const [searchParams] = useSearchParams();
  const recursoParam = searchParams.get("recurso");

  const [guardando, setGuardando] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  const [form, setForm] = useState({
    recurso_id: recursoParam || "",
    categoria_id: "",
    tecnico_id: "",
    titulo: "",
    descripcion: "",
    prioridad: "Media",
    estado: "Pendiente",
    fecha_solicitud: new Date().toISOString().slice(0, 10),
    costo_mano_obra: "0",
    costo_repuestos: "0",
    observaciones: "",
  });

  useEffect(() => {
    Promise.all([
      api.get<Categoria[]>("/helpdesk/categorias-mantenimiento"),
      api.get<Usuario[]>("/usuarios"),
    ]).then(([cats, users]) => {
      setCategorias(cats);
      setTecnicos(users);
    }).catch(() => {});
  }, [api]);

  useEffect(() => {
    if (cliente) {
      api.get<Recurso[]>(`/helpdesk/recursos?cliente_id=${cliente.id}`)
        .then(setRecursos)
        .catch(() => {});
    }
  }, [api, cliente]);

  function setField(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim() || !form.recurso_id) return;
    setGuardando(true);
    try {
      const result = await api.post<{ id: number }>("/helpdesk/mantenimientos", {
        recurso_id: Number(form.recurso_id),
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        tecnico_id: form.tecnico_id ? Number(form.tecnico_id) : null,
        titulo: form.titulo,
        descripcion: form.descripcion,
        prioridad: form.prioridad,
        estado: form.estado,
        fecha_solicitud: form.fecha_solicitud,
        costo_mano_obra: Number(form.costo_mano_obra) || 0,
        costo_repuestos: Number(form.costo_repuestos) || 0,
        observaciones: form.observaciones,
      });
      navigate(`/helpdesk/mantenimientos/${result.id}`);
    } catch (e: any) {
      alert(e.message || "Error al crear mantenimiento");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate("/helpdesk/mantenimientos")} className="text-sm text-gray-400 hover:text-gray-600 mb-4 block">
        ← Volver a mantenimientos
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Mantenimiento</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Recurso *</label>
          <select value={form.recurso_id} onChange={(e) => setField("recurso_id", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">Seleccionar recurso...</option>
            {recursos.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre} {r.serial ? `(${r.serial})` : ""}</option>
            ))}
          </select>
          {recursos.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">No hay recursos registrados para este cliente</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
          <input type="text" value={form.titulo} onChange={(e) => setField("titulo", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej: Mantenimiento preventivo" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setField("descripcion", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" rows={3} placeholder="Describe el trabajo realizado..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
            <select value={form.categoria_id} onChange={(e) => setField("categoria_id", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prioridad</label>
            <select value={form.prioridad} onChange={(e) => setField("prioridad", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
            <select value={form.estado} onChange={(e) => setField("estado", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Técnico asignado</label>
            <select value={form.tecnico_id} onChange={(e) => setField("tecnico_id", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
              <option value="">Sin asignar</option>
              {tecnicos.map((u) => (
                <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de solicitud</label>
            <input type="date" value={form.fecha_solicitud} onChange={(e) => setField("fecha_solicitud", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Costo mano de obra</label>
            <input type="number" min="0" step="1000" value={form.costo_mano_obra} onChange={(e) => setField("costo_mano_obra", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Costo repuestos</label>
            <input type="number" min="0" step="1000" value={form.costo_repuestos} onChange={(e) => setField("costo_repuestos", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Observaciones</label>
          <textarea value={form.observaciones} onChange={(e) => setField("observaciones", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" rows={2} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/helpdesk/mantenimientos")} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={guardando} className="px-6 py-2 text-sm rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50">
            {guardando ? "Creando..." : "Crear Mantenimiento"}
          </button>
        </div>
      </form>
    </div>
  );
}
