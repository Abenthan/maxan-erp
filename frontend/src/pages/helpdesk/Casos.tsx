import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface Caso {
  id: number;
  numero: string;
  titulo: string;
  descripcion: string;
  estado: string;
  categoria_nombre: string;
  categoria_color: string;
  tecnico_nombre: string;
  cliente_nombre: string;
  recurso_nombre: string;
  recurso_serial: string;
  fuente: string;
  created_at: string;
}

export default function Casos() {
  const api = useApi();
  const navigate = useNavigate();
  const { cliente } = useHelpdesk();
  const puedeGestionar = usePermiso("helpdesk.casos.gestionar");
  const [casos, setCasos] = useState<Caso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const cargar = useCallback(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (filtroEstado) params.set("estado", filtroEstado);
    if (busqueda) params.set("q", busqueda);
    if (cliente) params.set("cliente_id", String(cliente.id));
    api.get<Caso[]>(`/helpdesk/casos?${params}`)
      .then(setCasos)
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [api, filtroEstado, busqueda, cliente]);

  useEffect(() => { cargar(); }, [cargar]);

  const badgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "bg-yellow-100 text-yellow-800";
      case "En Progreso": return "bg-blue-100 text-blue-800";
      case "Completado": return "bg-green-100 text-green-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Casos de Soporte</h1>
        {puedeGestionar && (
          <button onClick={() => navigate("/helpdesk/casos/nuevo")} className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700">
            + Nuevo Caso
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 border rounded-lg px-4 py-2.5 text-sm"
          placeholder="Buscar por título, número o cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border rounded-lg px-3 py-2.5 text-sm"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {cargando ? (
        <div className="text-center py-12 text-gray-400">Cargando casos...</div>
      ) : casos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No hay casos registrados</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600">#</th>
                <th className="p-3 font-semibold text-gray-600">Título</th>
                <th className="p-3 font-semibold text-gray-600">Cliente</th>
                <th className="p-3 font-semibold text-gray-600">Categoría</th>
                <th className="p-3 font-semibold text-gray-600">Técnico</th>
                <th className="p-3 font-semibold text-gray-600">Estado</th>
                <th className="p-3 font-semibold text-gray-600">Fecha</th>
                <th className="p-3 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {casos.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/helpdesk/casos/${c.id}`)}>
                  <td className="p-3 font-mono text-xs text-gray-500">{c.numero}</td>
                  <td className="p-3 font-medium">{c.titulo}</td>
                  <td className="p-3 text-gray-600">{c.cliente_nombre || "-"}</td>
                  <td className="p-3">
                    {c.categoria_nombre && (
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: c.categoria_color + '20', color: c.categoria_color }}>
                        {c.categoria_nombre}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">{c.tecnico_nombre || "-"}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeColor(c.estado)}`}>{c.estado}</span>
                  </td>
                  <td className="p-3 text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
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
