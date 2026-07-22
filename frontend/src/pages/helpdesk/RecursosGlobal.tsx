import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Recurso {
  id: number;
  cliente_id: number | null;
  cliente_nombre: string | null;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
  procesador: string;
  memoria_gb: number | null;
  almacenamiento_gb: number | null;
  sistema_operativo: string;
  ubicacion: string;
  descripcion: string;
  activo: boolean;
}

interface Tercero {
  id: number;
  razon_social: string;
  numero_documento: string;
}

export default function RecursosGlobal() {
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("helpdesk.gestionar");
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [filtro, setFiltro] = useState("");
  const [soloSinCliente, setSoloSinCliente] = useState(false);
  const [editandoRecurso, setEditandoRecurso] = useState<Recurso | null>(null);
  const [clientes, setClientes] = useState<Tercero[]>([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Tercero | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    const params = new URLSearchParams();
    if (filtro) params.set("q", filtro);
    const data = await api.get<Recurso[]>(`/helpdesk/recursos?${params}`);
    setRecursos(data);
  }, [api, filtro]);

  useEffect(() => { cargar(); }, [cargar]);

  const abrirModal = async (r: Recurso) => {
    setEditandoRecurso(r);
    setClienteSeleccionado(
      r.cliente_id ? { id: r.cliente_id, razon_social: r.cliente_nombre || "", numero_documento: "" } : null,
    );
    setBusquedaCliente("");
    const data = await api.get<Tercero[]>("/terceros?tipo=cliente");
    setClientes(data);
  };

  const clientesFiltrados = busquedaCliente
    ? clientes.filter(
        (c) =>
          c.razon_social.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
          (c.numero_documento ?? "").includes(busquedaCliente),
      )
    : clientes;

  const guardar = async () => {
    if (!editandoRecurso) return;
    setGuardando(true);
    try {
      await api.put(`/helpdesk/recursos/${editandoRecurso.id}`, {
        ...editandoRecurso,
        cliente_id: clienteSeleccionado?.id || null,
      });
      setEditandoRecurso(null);
      cargar();
    } finally {
      setGuardando(false);
    }
  };

  const mostrar = soloSinCliente ? recursos.filter((r) => !r.cliente_id) : recursos;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Todos los Recursos</h1>
        {puedeGestionar && (
          <button
            onClick={() => navigate("/helpdesk/nuevo-recurso")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Nuevo
          </button>
        )}
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <input
          className="border rounded-lg px-3 py-2 text-sm w-64"
          placeholder="Buscar por nombre, serial o marca..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={soloSinCliente}
            onChange={(e) => setSoloSinCliente(e.target.checked)}
            className="rounded"
          />
          Solo sin cliente
        </label>
        <span className="text-sm text-gray-400">
          {mostrar.length} de {recursos.length} recursos
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-amber-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Cliente</th>
              <th className="text-left px-4 py-3 font-medium">Tipo</th>
              <th className="text-left px-4 py-3 font-medium">Marca</th>
              <th className="text-left px-4 py-3 font-medium">Modelo</th>
              <th className="text-left px-4 py-3 font-medium">Serial</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              {puedeGestionar && <th className="text-left px-4 py-3 font-medium">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mostrar.length === 0 && (
              <tr>
                <td colSpan={puedeGestionar ? 8 : 7} className="text-center py-8 text-gray-400">
                  No hay recursos
                </td>
              </tr>
            )}
            {mostrar.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{r.nombre}</td>
                <td className="px-4 py-3">
                  {puedeGestionar ? (
                    <button
                      onClick={() => abrirModal(r)}
                      className={`text-left text-sm ${
                        r.cliente_nombre
                          ? "text-blue-600 hover:text-blue-800 hover:underline"
                          : "text-gray-400 italic hover:text-gray-600"
                      }`}
                    >
                      {r.cliente_nombre || "Sin asignar"}
                    </button>
                  ) : (
                    <span className={`text-sm ${r.cliente_nombre ? "text-gray-500" : "text-gray-400 italic"}`}>
                      {r.cliente_nombre || "Sin asignar"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">{r.tipo}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{r.marca || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{r.modelo || "-"}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.serial || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                {puedeGestionar && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/helpdesk/recursos/${r.id}`)}
                      className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Ver
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editandoRecurso && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => !guardando && setEditandoRecurso(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-[480px] max-w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Asignar cliente — {editandoRecurso.nombre}
            </h2>

            <div className="mb-4">
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="Buscar cliente por nombre o NIT..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                autoFocus
              />
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              <button
                onClick={() => setClienteSeleccionado(null)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  !clienteSeleccionado
                    ? "bg-amber-50 font-semibold text-amber-700"
                    : "text-gray-500 italic"
                }`}
              >
                — Sin cliente —
              </button>
              {clientesFiltrados.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClienteSeleccionado(c)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    clienteSeleccionado?.id === c.id
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  {c.razon_social}
                  <span className="text-gray-400 ml-2 text-xs">{c.numero_documento}</span>
                </button>
              ))}
              {clientesFiltrados.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">No se encontraron clientes</div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditandoRecurso(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
