import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface TipoRecurso {
  id: number;
  nombre: string;
}

export default function NuevoRecurso() {
  const api = useApi();
  const navigate = useNavigate();
  const { cliente } = useHelpdesk();
  const [tipos, setTipos] = useState<TipoRecurso[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [showTiposModal, setShowTiposModal] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState("");

  useEffect(() => {
    api.get<TipoRecurso[]>("/helpdesk/tipos-recurso").then(setTipos).catch(() => {});
  }, [api]);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "Computador",
    marca: "",
    modelo: "",
    serial: "",
    procesador: "",
    memoria_gb: "",
    almacenamiento_gb: "",
    sistema_operativo: "",
    tipo_almacenamiento: "",
    chip_video: "",
    memoria_video_mb: "",
    ubicacion: "",
    activo: true,
    observaciones: "",
  });

  function setField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente || !form.nombre) return;
    setGuardando(true);
    setError("");
    try {
      const res = await api.post<any>("/helpdesk/recursos", {
        cliente_id: cliente.id,
        nombre: form.nombre,
        tipo: form.tipo,
        marca: form.marca || null,
        modelo: form.modelo || null,
        serial: form.serial || null,
        procesador: form.procesador || null,
        memoria_gb: form.memoria_gb ? Number(form.memoria_gb) : null,
        almacenamiento_gb: form.almacenamiento_gb ? Number(form.almacenamiento_gb) : null,
        sistema_operativo: form.sistema_operativo || null,
        ubicacion: form.ubicacion || null,
        descripcion: form.observaciones || null,
        activo: form.activo,
        atributos: {
          tipo_almacenamiento: form.tipo_almacenamiento || null,
          chip_video: form.chip_video || null,
          memoria_video_mb: form.memoria_video_mb ? Number(form.memoria_video_mb) : null,
        },
      });
      navigate(`/helpdesk/recursos/${res.id}`);
    } catch (err: any) {
      if (err?.response?.data?.code === "DUPLICATE_SERIAL") {
        setError("Ya existe un recurso con ese serial");
      } else {
        setError(err instanceof Error ? err.message : "Error al guardar");
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Nuevo Recurso</h1>
        <Link
          to="/helpdesk/obtener-pc"
          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700"
        >
          Detectar PC
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={guardar} className="bg-white border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {cliente && (
            <div className="col-span-2 flex items-center gap-2 pb-1">
              <span className="text-xs text-gray-500">Cliente:</span>
              <span className="text-sm font-semibold text-gray-800">{cliente.razon_social}</span>
            </div>
          )}
          {!cliente && (
            <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              No hay un cliente seleccionado.{' '}
              <Link to="/helpdesk" className="underline font-medium">Seleccionar cliente</Link>
            </div>
          )}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
            <input
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ej: Servidor correo Cliente X"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
            <div className="flex gap-2">
              <select
                value={form.tipo}
                onChange={(e) => setField("tipo", e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {tipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
              </select>
              <button type="button" onClick={() => setShowTiposModal(true)} title="Administrar tipos" className="px-2.5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 shrink-0">⚙</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Serial</label>
            <input
              value={form.serial}
              onChange={(e) => setField("serial", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Número de serie"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Marca</label>
            <input
              value={form.marca}
              onChange={(e) => setField("marca", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="HP / Lenovo / Dell"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Modelo</label>
            <input
              value={form.modelo}
              onChange={(e) => setField("modelo", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="IdeaPad 3 15IRH10"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Procesador</label>
            <input
              value={form.procesador}
              onChange={(e) => setField("procesador", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Intel Core i5-1135G7"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">RAM (GB)</label>
            <input
              type="number"
              step="0.1"
              value={form.memoria_gb}
              onChange={(e) => setField("memoria_gb", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="8"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Almacenamiento (GB)</label>
            <input
              type="number"
              step="0.1"
              value={form.almacenamiento_gb}
              onChange={(e) => setField("almacenamiento_gb", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="512"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo disco</label>
            <select
              value={form.tipo_almacenamiento}
              onChange={(e) => setField("tipo_almacenamiento", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Seleccionar...</option>
              <option value="SSD">SSD</option>
              <option value="HDD">HDD</option>
              <option value="Desconocido">Desconocido</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Sistema Operativo</label>
            <input
              value={form.sistema_operativo}
              onChange={(e) => setField("sistema_operativo", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Windows 11 Pro / Ubuntu 22.04"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Chip de video</label>
            <input
              value={form.chip_video}
              onChange={(e) => setField("chip_video", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Intel Iris Xe"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">VRAM (MB)</label>
            <input
              type="number"
              value={form.memoria_video_mb}
              onChange={(e) => setField("memoria_video_mb", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="1024"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ubicación</label>
            <input
              value={form.ubicacion}
              onChange={(e) => setField("ubicacion", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Oficina principal / Sala de servidores"
            />
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setField("activo", e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-gray-700 font-medium">Activo</span>
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Observaciones</label>
            <textarea
              value={form.observaciones}
              onChange={(e) => setField("observaciones", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
              placeholder="Notas adicionales sobre el recurso..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={guardando}
            className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/helpdesk/recursos")}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      </form>

      {showTiposModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowTiposModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Administrar Tipos de Recurso</h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    document.querySelector<HTMLButtonElement>("#btn-agregar-tipo")?.click();
                  }
                }}
                placeholder="Nuevo tipo..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                id="btn-agregar-tipo"
                type="button"
                disabled={!nuevoTipo.trim()}
                onClick={async () => {
                  if (!nuevoTipo.trim()) return;
                  try {
                    const creado = await api.post<TipoRecurso>("/helpdesk/tipos-recurso", { nombre: nuevoTipo.trim() });
                    setTipos([...tipos, creado].sort((a, b) => a.nombre.localeCompare(b.nombre)));
                    setNuevoTipo("");
                  } catch (err: unknown) {
                    alert(err instanceof Error ? err.message : "Error al crear tipo");
                  }
                }}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 shrink-0"
              >
                Agregar
              </button>
            </div>

            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {tipos.map((t) => (
                <li key={t.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{t.nombre}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`¿Eliminar tipo "${t.nombre}"?`)) return;
                      try {
                        await api.del(`/helpdesk/tipos-recurso/${t.id}`);
                        setTipos(tipos.filter((x) => x.id !== t.id));
                      } catch (err: unknown) {
                        alert(err instanceof Error ? err.message : "Error al eliminar tipo");
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowTiposModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
