import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";

interface Caso {
  id: number; numero: string; titulo: string; descripcion: string;
  estado: string; categoria_nombre: string; categoria_color: string;
  tecnico_nombre: string; cliente_nombre: string; cliente_documento: string; cliente_id: number;
  recurso_nombre: string; recurso_serial: string;
  recursos: { id: number; nombre: string; serial: string; tipo: string; marca: string; modelo: string }[];
  contacto_nombre: string; contacto_telefono: string; contacto_whatsapp: string;
  fuente: string; solucion: string; resumen: string; ai_report: string;
  created_at: string; updated_at: string;
}

interface Detalle {
  id: number; contenido: string; tipo: string; creado_por_nombre: string; created_at: string;
}

interface Recurso {
  id: number; nombre: string; serial: string; tipo: string; marca: string; modelo: string;
}

export default function CasoDetalle() {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("helpdesk.casos.gestionar");

  const [caso, setCaso] = useState<Caso | null>(null);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoDetalle, setNuevoDetalle] = useState("");
  const [solucionTexto, setSolucionTexto] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmarCierre, setConfirmarCierre] = useState(false);

  const [mostrarVinculador, setMostrarVinculador] = useState(false);
  const [recursosDisponibles, setRecursosDisponibles] = useState<Recurso[]>([]);
  const [busquedaRecurso, setBusquedaRecurso] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Caso>(`/helpdesk/casos/${id}`),
      api.get<Detalle[]>(`/helpdesk/casos/${id}/detalles`),
    ])
      .then(([c, d]) => { setCaso(c); setDetalles(d); setSolucionTexto(c.solucion || ""); })
      .catch(() => navigate("/helpdesk/casos"))
      .finally(() => setCargando(false));
  }, [id, api, navigate]);

  async function abrirVinculador() {
    setMostrarVinculador(true);
    setBusquedaRecurso("");
    try {
      const res = await api.get<Recurso[]>(`/helpdesk/recursos?cliente_id=${caso?.cliente_id || 0}`);
      const vinculados = new Set(caso?.recursos?.map((r) => r.id) || []);
      setRecursosDisponibles(res.filter((r) => !vinculados.has(r.id)));
    } catch {
      setRecursosDisponibles([]);
    }
  }

  async function vincularRecurso(recursoId: number) {
    setGuardando(true);
    try {
      await api.post(`/helpdesk/casos/${id}/recursos`, { recurso_ids: [recursoId] });
      const updated = await api.get<Caso>(`/helpdesk/casos/${id}`);
      setCaso(updated);
      setRecursosDisponibles((prev) => prev.filter((r) => r.id !== recursoId));
    } catch (e: any) {
      alert(e.message || "Error al vincular recurso");
    } finally {
      setGuardando(false);
    }
  }

  async function desvincularRecurso(recursoId: number) {
    if (!confirm("¿Desvincular este recurso del caso?")) return;
    setGuardando(true);
    try {
      await api.del(`/helpdesk/casos/${id}/recursos/${recursoId}`);
      const updated = await api.get<Caso>(`/helpdesk/casos/${id}`);
      setCaso(updated);
      setRecursosDisponibles((prev) => {
        const found = updated.recursos?.find((r: any) => r.id === recursoId);
        return found ? [...prev, found] : prev;
      });
    } catch (e: any) {
      alert(e.message || "Error al desvincular recurso");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarDetalle() {
    if (!nuevoDetalle.trim()) return;
    setGuardando(true);
    try {
      const d = await api.post<Detalle>(`/helpdesk/casos/${id}/detalles`, { contenido: nuevoDetalle });
      setDetalles((prev) => [...prev, d]);
      setNuevoDetalle("");
    } catch (e: any) {
      alert(e.message || "Error al agregar detalle");
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(estado: string) {
    setGuardando(true);
    try {
      const actualizado = await api.patch<Caso>(`/helpdesk/casos/${id}/estado`, {
        estado,
        solucion: estado === "Completado" ? solucionTexto : undefined,
      });
      setCaso(actualizado);
      setConfirmarCierre(false);
    } catch (e: any) {
      alert(e.message || "Error al cambiar estado");
    } finally {
      setGuardando(false);
    }
  }

  const badgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "bg-yellow-100 text-yellow-800";
      case "En Progreso": return "bg-blue-100 text-blue-800";
      case "Completado": return "bg-green-100 text-green-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tipoBadge = (tipo: string) => {
    switch (tipo) {
      case "Diagnóstico": return "bg-purple-100 text-purple-700";
      case "Solución": return "bg-green-100 text-green-700";
      case "Acuerdo": return "bg-blue-100 text-blue-700";
      case "Sistema": return "bg-gray-100 text-gray-500";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  if (cargando) return <p className="text-center py-12 text-gray-400">Cargando caso...</p>;
  if (!caso) return <p className="text-center py-12 text-gray-400">Caso no encontrado</p>;

  const recursos = caso.recursos || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate("/helpdesk/casos")} className="text-sm text-gray-400 hover:text-gray-600">← Volver a casos</button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs text-gray-400">{caso.numero}</span>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeColor(caso.estado)}`}>{caso.estado}</span>
              {caso.categoria_nombre && (
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: caso.categoria_color + '20', color: caso.categoria_color }}>
                  {caso.categoria_nombre}
                </span>
              )}
              <span className="text-xs text-gray-400">{caso.fuente}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{caso.titulo}</h2>
          </div>
        </div>

        {caso.descripcion && <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{caso.descripcion}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {caso.cliente_nombre && (
            <div><span className="text-gray-400 text-xs block">Cliente</span><span className="font-medium">{caso.cliente_nombre}</span></div>
          )}
          <div>
            <span className="text-gray-400 text-xs block">Recursos</span>
            {recursos.length === 0 ? (
              <span className="text-gray-400">Ninguno</span>
            ) : (
              <div className="flex flex-wrap gap-1 mt-0.5">
                {recursos.map((r) => (
                  <span key={r.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                    {r.nombre}
                    {r.serial && <span className="text-gray-400 font-mono">({r.serial})</span>}
                    {puedeGestionar && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); desvincularRecurso(r.id); }}
                        className="hover:text-red-500 ml-0.5"
                        title="Desvincular"
                      >✕</button>
                    )}
                  </span>
                ))}
              </div>
            )}
            {puedeGestionar && (
              <button type="button" onClick={abrirVinculador} className="text-xs text-amber-600 hover:text-amber-800 mt-1">
                + Vincular recurso
              </button>
            )}
          </div>
          {caso.tecnico_nombre && (
            <div><span className="text-gray-400 text-xs block">Técnico</span><span className="font-medium">{caso.tecnico_nombre}</span></div>
          )}
          {caso.contacto_nombre && (
            <div><span className="text-gray-400 text-xs block">Contacto</span><span className="font-medium">{caso.contacto_nombre}</span></div>
          )}
        </div>

        {mostrarVinculador && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Vincular recurso existente</span>
              <button type="button" onClick={() => setMostrarVinculador(false)} className="text-xs text-gray-400 hover:text-gray-600">Cerrar</button>
            </div>
            <input type="text" value={busquedaRecurso} onChange={(e) => setBusquedaRecurso(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2" placeholder="Buscar recurso..." autoFocus />
            {recursosDisponibles.length === 0 ? (
              <p className="text-sm text-gray-400">No hay más recursos disponibles para este cliente</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {recursosDisponibles
                  .filter((r) => !busquedaRecurso || r.nombre.toLowerCase().includes(busquedaRecurso.toLowerCase()) || r.serial?.toLowerCase().includes(busquedaRecurso.toLowerCase()))
                  .map((r) => (
                    <button key={r.id} type="button" onClick={() => vincularRecurso(r.id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-white rounded border border-transparent hover:border-gray-200 flex items-center justify-between">
                      <span><span className="font-medium">{r.nombre}</span> {r.serial && <span className="text-gray-400 font-mono">({r.serial})</span>}</span>
                      <span className="text-xs text-gray-400">{r.tipo}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {caso.estado !== "Completado" && caso.estado !== "Cancelado" && puedeGestionar && (
          <div className="mt-6 pt-4 border-t flex gap-3">
            {caso.estado === "Pendiente" && (
              <button onClick={() => cambiarEstado("En Progreso")} disabled={guardando} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
                Iniciar Caso
              </button>
            )}
            {caso.estado === "En Progreso" && (
              <button onClick={() => setConfirmarCierre(true)} className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
                Completar Caso
              </button>
            )}
            <button onClick={() => cambiarEstado("Cancelado")} disabled={guardando} className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50">
              Cancelar Caso
            </button>
          </div>
        )}

        {confirmarCierre && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <label className="block text-sm font-medium text-green-800 mb-2">Solución del caso</label>
            <textarea
              className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm mb-3"
              rows={3}
              value={solucionTexto}
              onChange={(e) => setSolucionTexto(e.target.value)}
              placeholder="Describe la solución aplicada..."
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => cambiarEstado("Completado")} disabled={guardando} className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50">
                {guardando ? "Guardando..." : "Confirmar Cierre"}
              </button>
              <button onClick={() => setConfirmarCierre(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bitácora</h3>

        <div className="space-y-3 mb-6">
          {detalles.length === 0 ? (
            <p className="text-sm text-gray-400">Sin novedades registradas</p>
          ) : (
            detalles.map((d) => (
              <div key={d.id} className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-gray-600">{d.creado_por_nombre || "Sistema"}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${tipoBadge(d.tipo)}`}>{d.tipo}</span>
                    <span className="text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{d.contenido}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {puedeGestionar && (
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Agregar novedad..."
              value={nuevoDetalle}
              onChange={(e) => setNuevoDetalle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && agregarDetalle()}
            />
            <button onClick={agregarDetalle} disabled={guardando || !nuevoDetalle.trim()} className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50">
              Agregar
            </button>
          </div>
        )}
      </div>

      {caso.solucion && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Solución</h3>
          <p className="text-sm text-green-700 whitespace-pre-wrap">{caso.solucion}</p>
        </div>
      )}
    </div>
  );
}
