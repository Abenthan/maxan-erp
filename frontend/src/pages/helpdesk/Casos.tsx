import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface RecursoInfo {
  id: number;
  nombre: string;
  serial: string;
  tipo: string;
}

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
  cliente_id: number;
  recurso_nombre: string;
  recurso_serial: string;
  recursos: RecursoInfo[];
  fuente: string;
  created_at: string;
}

interface Tercero {
  id: number;
  razon_social: string;
  numero_documento: string;
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
  const [soloSinCliente, setSoloSinCliente] = useState(false);

  const [asignarCaso, setAsignarCaso] = useState<Caso | null>(null);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clientes, setClientes] = useState<Tercero[]>([]);
  const [buscandoClientes, setBuscandoClientes] = useState(false);

  const cargar = useCallback(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (filtroEstado) params.set("estado", filtroEstado);
    if (busqueda) params.set("q", busqueda);
    if (soloSinCliente) {
      params.set("sin_cliente", "true");
    } else if (cliente) {
      params.set("cliente_id", String(cliente.id));
    }
    api.get<Caso[]>(`/helpdesk/casos?${params}`)
      .then(setCasos)
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [api, filtroEstado, busqueda, cliente, soloSinCliente]);

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

  async function abrirAsignarCliente(e: React.MouseEvent, caso: Caso) {
    e.stopPropagation();
    if (cliente) {
      try {
        await api.put(`/helpdesk/casos/${caso.id}`, { cliente_id: cliente.id });
        cargar();
      } catch (err: any) {
        alert(err.message || "Error al asignar cliente");
      }
      return;
    }
    setAsignarCaso(caso);
    setBusquedaCliente("");
    setClientes([]);
  }

  async function buscarClientes(q: string) {
    setBusquedaCliente(q);
    if (!q.trim()) { setClientes([]); return; }
    setBuscandoClientes(true);
    try {
      const res = await api.get<Tercero[]>(`/terceros?q=${encodeURIComponent(q)}&tipo=cliente`);
      setClientes(res);
    } catch {
      setClientes([]);
    } finally {
      setBuscandoClientes(false);
    }
  }

  async function guardarAsignacion(clienteId: number | null) {
    if (!asignarCaso) return;
    try {
      await api.put(`/helpdesk/casos/${asignarCaso.id}`, { cliente_id: clienteId });
      setAsignarCaso(null);
      cargar();
    } catch (e: any) {
      alert(e.message || "Error al asignar cliente");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Casos de Soporte</h1>
        {puedeGestionar && (
          <button onClick={() => navigate("/helpdesk/casos/nuevo")} className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700">
            + Nuevo Caso
          </button>
        )}
      </div>

      <div className="flex gap-3 items-center">
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
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={soloSinCliente} onChange={(e) => setSoloSinCliente(e.target.checked)}
            className="rounded border-gray-300" />
          Sin cliente
        </label>
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
                <th className="p-3 font-semibold text-gray-600">Recursos</th>
                <th className="p-3 font-semibold text-gray-600">Categoría</th>
                <th className="p-3 font-semibold text-gray-600">Técnico</th>
                <th className="p-3 font-semibold text-gray-600">Estado</th>
                <th className="p-3 font-semibold text-gray-600">Fecha</th>
                <th className="p-3 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {casos.map((c) => {
                const res = c.recursos || [];
                return (
                  <tr key={c.id} className="border-b hover:bg-gray-50" onClick={() => navigate(`/helpdesk/casos/${c.id}`)}>
                    <td className="p-3 font-mono text-xs text-gray-500">{c.numero}</td>
                    <td className="p-3 font-medium">{c.titulo}</td>
                    <td className="p-3">
                      {puedeGestionar ? (
                        <button type="button" onClick={(e) => abrirAsignarCliente(e, c)}
                          className="text-left text-gray-600 hover:text-amber-700 underline decoration-dotted cursor-pointer">
                          {c.cliente_nombre || <span className="text-gray-400 italic">Sin cliente</span>}
                        </button>
                      ) : (
                        <span className="text-gray-600">{c.cliente_nombre || "-"}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {res.length === 0 ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {res.slice(0, 2).map((r) => (
                            <span key={r.id} className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                              {r.nombre}
                            </span>
                          ))}
                          {res.length > 2 && (
                            <span className="text-xs text-gray-400">+{res.length - 2}</span>
                          )}
                        </div>
                      )}
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {asignarCaso && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setAsignarCaso(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Asignar cliente</h3>
            <p className="text-sm text-gray-500 mb-4">Caso {asignarCaso.numero}: <span className="font-medium">{asignarCaso.titulo}</span></p>

            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
              placeholder="Buscar cliente por nombre o NIT..."
              value={busquedaCliente}
              onChange={(e) => buscarClientes(e.target.value)}
              autoFocus
            />

            {buscandoClientes && <p className="text-sm text-gray-400">Buscando...</p>}

            {clientes.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-1 mb-3 border rounded-lg">
                {clientes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => guardarAsignacion(t.id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 flex items-center justify-between"
                  >
                    <span className="font-medium">{t.razon_social}</span>
                    <span className="text-xs text-gray-400">{t.numero_documento}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {asignarCaso.cliente_id && (
                <button type="button" onClick={() => guardarAsignacion(null)}
                  className="px-3 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50">
                  Quitar cliente
                </button>
              )}
              <button type="button" onClick={() => setAsignarCaso(null)}
                className="px-3 py-2 text-sm text-gray-500 underline">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
