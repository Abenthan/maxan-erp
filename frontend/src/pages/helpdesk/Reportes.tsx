import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";
import { useHelpdesk } from "../../context/HelpdeskContext";
import { fechaCorta, type ReporteFila } from "../../lib/reportes";

interface Caso {
  id: number;
  numero: string;
  titulo: string;
  estado: string;
  cliente_nombre: string | null;
}

export default function Reportes() {
  const api = useApi();
  const navigate = useNavigate();
  const { cliente } = useHelpdesk();
  const puedeGestionar = usePermiso("helpdesk.reportes.gestionar");

  const [reportes, setReportes] = useState<ReporteFila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [buscandoCasos, setBuscandoCasos] = useState(false);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [qCasos, setQCasos] = useState("");
  const [creando, setCreando] = useState(false);

  const cargar = useCallback(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (cliente) params.set("cliente_id", String(cliente.id));
    if (busqueda) params.set("q", busqueda);
    api.get<ReporteFila[]>(`/helpdesk/reportes?${params}`)
      .then(setReportes)
      .catch(() => setReportes([]))
      .finally(() => setCargando(false));
  }, [api, cliente, busqueda]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (!mostrarNuevo) return;
    setBuscandoCasos(true);
    const params = new URLSearchParams();
    if (cliente) params.set("cliente_id", String(cliente.id));
    if (qCasos) params.set("q", qCasos);
    api.get<Caso[]>(`/helpdesk/casos?${params}`)
      .then(setCasos)
      .catch(() => setCasos([]))
      .finally(() => setBuscandoCasos(false));
  }, [api, mostrarNuevo, cliente, qCasos]);

  async function crearReporte(caso: Caso) {
    setCreando(true);
    try {
      const r = await api.post<{ id: number }>("/helpdesk/reportes", { idCaso: caso.id });
      setMostrarNuevo(false);
      navigate(`/helpdesk/reportes/${r.id}`);
    } catch (e: any) {
      alert(e.message || "Error al crear el reporte");
    } finally {
      setCreando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reportes</h1>
          <p className="text-sm text-gray-500">
            {cliente ? `Reportes de ${cliente.razon_social}` : "Reportes de todos los clientes"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por N°, caso o cliente..."
            className="w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg"
          />
          {puedeGestionar && (
            <button
              onClick={() => { setMostrarNuevo(true); setQCasos(""); }}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700"
            >
              + Nuevo reporte
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {cargando ? (
          <p className="text-center py-12 text-gray-400">Cargando reportes...</p>
        ) : reportes.length === 0 ? (
          <p className="text-center py-12 text-gray-400">No hay reportes registrados</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">N° Reporte</th>
                <th className="px-4 py-3 font-medium">Caso</th>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportes.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/helpdesk/reportes/${r.id}`)}>
                  <td className="px-4 py-3 font-mono font-semibold text-blue-700">{r.numeroReporte}</td>
                  <td className="px-4 py-3 font-mono text-gray-500">{r.caso_numero}</td>
                  <td className="px-4 py-3 text-gray-800">{r.caso_titulo}</td>
                  <td className="px-4 py-3 text-gray-600">{r.cliente_nombre || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{fechaCorta(r.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/helpdesk/reportes/${r.id}`); }}
                      className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mostrarNuevo && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold text-gray-800">Nuevo reporte — seleccionar caso</h3>
              <button onClick={() => setMostrarNuevo(false)} className="text-sm text-gray-400 hover:text-gray-600">
                Cerrar
              </button>
            </div>
            <div className="p-4 border-b">
              <input
                type="text"
                autoFocus
                value={qCasos}
                onChange={(e) => setQCasos(e.target.value)}
                placeholder="Buscar caso por número o título..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
            <div className="overflow-y-auto p-2">
              {buscandoCasos ? (
                <p className="text-sm text-gray-400 p-3">Buscando casos...</p>
              ) : casos.length === 0 ? (
                <p className="text-sm text-gray-400 p-3">No se encontraron casos</p>
              ) : (
                casos.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => crearReporte(c)}
                    disabled={creando}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-amber-50 flex items-start justify-between gap-3 disabled:opacity-50"
                  >
                    <span>
                      <span className="font-mono text-xs text-gray-400 mr-2">{c.numero}</span>
                      <span className="text-sm font-medium text-gray-800">{c.titulo}</span>
                      {c.cliente_nombre && (
                        <span className="block text-xs text-gray-500">{c.cliente_nombre}</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{c.estado}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
