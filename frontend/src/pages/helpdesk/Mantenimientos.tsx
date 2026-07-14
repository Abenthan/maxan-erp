import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface Mantenimiento {
  id: number;
  titulo: string;
  recurso_nombre: string;
  recurso_serial: string;
  categoria_nombre: string;
  categoria_color: string;
  prioridad: string;
  estado: string;
  tecnico_nombre: string;
  fecha_solicitud: string;
  costo_total: number;
}

export default function Mantenimientos() {
  const api = useApi();
  const navigate = useNavigate();
  const { cliente } = useHelpdesk();
  const puedeGestionar = usePermiso("helpdesk.gestionar");
  const [lista, setLista] = useState<Mantenimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");

  const cargar = useCallback(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (filtroEstado) params.set("estado", filtroEstado);
    if (cliente) params.set("cliente_id", String(cliente.id));
    api.get<Mantenimiento[]>(`/helpdesk/mantenimientos?${params}`)
      .then(setLista)
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [api, filtroEstado, cliente]);

  useEffect(() => { cargar(); }, [cargar]);

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
      case "Critica": return "bg-red-100 text-red-700";
      case "Alta": return "bg-orange-100 text-orange-700";
      case "Media": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mantenimientos</h1>
        {puedeGestionar && (
          <button onClick={() => navigate("/helpdesk/mantenimientos/nuevo")} className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700">
            + Nuevo Mantenimiento
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <select
          className="border rounded-lg px-3 py-2.5 text-sm"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Completado">Completado</option>
          <option value="Facturado">Facturado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        {cliente && (
          <span className="text-sm text-gray-500 self-center">Cliente: <strong>{cliente.razon_social}</strong></span>
        )}
      </div>

      {cargando ? (
        <div className="text-center py-12 text-gray-400">Cargando mantenimientos...</div>
      ) : lista.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No hay mantenimientos registrados</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600">Título</th>
                <th className="p-3 font-semibold text-gray-600">Recurso</th>
                <th className="p-3 font-semibold text-gray-600">Categoría</th>
                <th className="p-3 font-semibold text-gray-600">Prioridad</th>
                <th className="p-3 font-semibold text-gray-600">Estado</th>
                <th className="p-3 font-semibold text-gray-600">Técnico</th>
                <th className="p-3 font-semibold text-gray-600">Costo</th>
                <th className="p-3 font-semibold text-gray-600">Fecha</th>
                <th className="p-3 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/helpdesk/mantenimientos/${m.id}`)}>
                  <td className="p-3 font-medium">{m.titulo}</td>
                  <td className="p-3 text-gray-600 text-xs">{m.recurso_nombre || m.recurso_serial || "-"}</td>
                  <td className="p-3">
                    {m.categoria_nombre && (
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: m.categoria_color + '20', color: m.categoria_color }}>
                        {m.categoria_nombre}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgePrioridad(m.prioridad)}`}>{m.prioridad}</span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeEstado(m.estado)}`}>{m.estado}</span>
                  </td>
                  <td className="p-3 text-gray-600">{m.tecnico_nombre || "-"}</td>
                  <td className="p-3 text-gray-600 font-mono">${Number(m.costo_total || 0).toLocaleString()}</td>
                  <td className="p-3 text-xs text-gray-400">{new Date(m.fecha_solicitud).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <span className="text-amber-500">→</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
