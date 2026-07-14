import { useState } from "react";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { useHelpdesk } from "../../context/HelpdeskContext";

export default function RegistrarPC() {
  const api = useApi();
  const navigate = useNavigate();
  const { cliente } = useHelpdesk();

  const [paso, setPaso] = useState<"inicial" | "script" | "revision" | "manual">("inicial");
  const [datosPC, setDatosPC] = useState<any>(null);
  const [guardando, setGuardando] = useState(false);
  const [buscando, setBuscando] = useState(false);

  const [sessionCode, setSessionCode] = useState("");
  const [scriptTexto, setScriptTexto] = useState("");
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [serial, setSerial] = useState("");
  const [procesador, setProcesador] = useState("");
  const [memoriaGb, setMemoriaGb] = useState("");
  const [almacenamientoGb, setAlmacenamientoGb] = useState("");
  const [so, setSo] = useState("");
  const [tipoAlmacenamiento, setTipoAlmacenamiento] = useState("");
  const [chipVideo, setChipVideo] = useState("");
  const [memoriaVideoMb, setMemoriaVideoMb] = useState("");

  async function obtenerScript() {
    if (!cliente) return alert("Selecciona un cliente primero");
    const session = crypto.randomUUID();
    setSessionCode(session);
    try {
      const qs = `?cliente_id=${cliente.id}&session=${session}`;
      const script = await api.get<string>(`/helpdesk/recursos/script${qs}`);
      setScriptTexto(script);
      await navigator.clipboard.writeText(script);
      setPaso("script");
    } catch {
      alert("Error al obtener el script");
    }
  }

  async function buscarDatos() {
    setBuscando(true);
    try {
      const data = await api.get<any>(`/helpdesk/recursos/detectar-pc/pending/${sessionCode}`);
      setDatosPC(data);
      setNombre(data.nombre || "");
      setMarca(data.marca || "");
      setModelo(data.modelo || "");
      setSerial(data.serial || "");
      setProcesador(data.procesador || "");
      setMemoriaGb(data.memoria_gb?.toString() || "");
      setAlmacenamientoGb(data.almacenamiento_gb?.toString() || "");
      setSo(data.sistema_operativo || "");
      setTipoAlmacenamiento(data.atributos?.tipo_almacenamiento || "");
      setChipVideo(data.atributos?.chip_video || "");
      setMemoriaVideoMb(data.atributos?.memoria_video_mb?.toString() || "");
      setBuscando(false);
      setPaso("revision");
    } catch {
      setBuscando(false);
      alert("Aún no se han recibido los datos. Asegúrate de ejecutar el script en el PC del cliente y presiona 'Reintentar'.");
    }
  }

  async function guardar() {
    if (!serial) return alert("El serial es obligatorio");
    if (!cliente) return alert("Selecciona un cliente primero");
    setGuardando(true);
    try {
      const res = await api.post("/helpdesk/recursos", {
        cliente_id: cliente.id,
        nombre: nombre || serial,
        tipo: "Computador",
        marca,
        modelo,
        serial,
        procesador,
        memoria_gb: memoriaGb ? Number(memoriaGb) : null,
        almacenamiento_gb: almacenamientoGb ? Number(almacenamientoGb) : null,
        sistema_operativo: so,
        atributos: {
          tipo_almacenamiento: tipoAlmacenamiento || null,
          chip_video: chipVideo || null,
          memoria_video_mb: memoriaVideoMb ? Number(memoriaVideoMb) : null,
        },
      });
      navigate(`/helpdesk/recursos/${res.id}`);
    } catch (err: any) {
      if (err?.response?.data?.code === "DUPLICATE_SERIAL") {
        alert("Ya existe un recurso con ese serial. No se puede guardar duplicado.");
      } else {
        alert("Error al guardar: " + (err?.message || "desconocido"));
      }
    } finally {
      setGuardando(false);
    }
  }

  async function guardarDetectado() {
    if (!datosPC) return;
    if (!cliente) return alert("Selecciona un cliente primero");
    setGuardando(true);
    try {
      const res = await api.post("/helpdesk/recursos", {
        cliente_id: cliente.id,
        nombre: datosPC.nombre || datosPC.serial,
        tipo: "Computador",
        marca: datosPC.marca,
        modelo: datosPC.modelo,
        serial: datosPC.serial,
        procesador: datosPC.procesador,
        memoria_gb: datosPC.memoria_gb,
        almacenamiento_gb: datosPC.almacenamiento_gb,
        sistema_operativo: datosPC.sistema_operativo,
        atributos: datosPC.atributos || {},
      });
      navigate(`/helpdesk/recursos/${res.id}`);
    } catch (err: any) {
      if (err?.response?.data?.code === "DUPLICATE_SERIAL") {
        alert("Ya existe un recurso con ese serial. No se puede guardar duplicado.");
      } else {
        alert("Error al guardar: " + (err?.message || "desconocido"));
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Detectar PC</h1>

      {paso === "inicial" && (
        <div className="space-y-4">
          {cliente && (
            <div className="bg-white border rounded-xl p-4 flex items-center gap-2">
              <span className="text-xs text-gray-500">Cliente:</span>
              <span className="text-sm font-semibold text-gray-800">{cliente.razon_social}</span>
            </div>
          )}
          {!cliente && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              No hay un cliente seleccionado.{' '}
              <button onClick={() => navigate("/helpdesk")} className="underline font-medium">Seleccionar cliente</button>
            </div>
          )}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-amber-800">Opción 1: Detección automática</h2>
            <p className="text-sm text-amber-700">
              Ejecuta un script en el PC del cliente para obtener los datos automáticamente.
            </p>
            <button onClick={obtenerScript} disabled={!cliente} className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50">
              Obtener script
            </button>
          </div>

          <div className="border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">Opción 2: Ingreso manual</h2>
            <p className="text-sm text-gray-500">Llena los datos del equipo a mano.</p>
            <button onClick={() => setPaso("manual")} className="text-amber-600 border border-amber-300 px-6 py-2.5 rounded-lg text-sm hover:bg-amber-50">
              Ir a formulario manual
            </button>
          </div>
        </div>
      )}

      {paso === "script" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-green-800">Script copiado al portapapeles</h2>
          <ol className="text-sm text-green-700 space-y-2 list-decimal list-inside">
            <li>En el PC del cliente, abre <strong>PowerShell como Administrador</strong></li>
            <li>Pega el script (<kbd className="bg-green-100 px-1.5 py-0.5 rounded">Ctrl+V</kbd>)</li>
            <li>Presiona <kbd className="bg-green-100 px-1.5 py-0.5 rounded">Enter</kbd></li>
            <li>Vuelve a esta pantalla y presiona <strong>"Ya ejecuté el script"</strong></li>
          </ol>
          <div className="flex gap-3 pt-2">
            <button onClick={buscarDatos} disabled={buscando}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {buscando ? "Buscando..." : "Ya ejecuté el script"}
            </button>
            <button onClick={obtenerScript} className="text-sm text-green-700 underline">Copiar de nuevo</button>
            <button onClick={async () => { try { const qs = `?format=bat&cliente_id=${cliente?.id}&session=${sessionCode}`; const batScript = await api.get<string>(`/helpdesk/recursos/script${qs}`); const u = URL.createObjectURL(new Blob([batScript], { type: "text/plain;charset=utf-8" })); const a = document.createElement("a"); a.href = u; a.download = "detectar-pc.bat"; a.click(); URL.revokeObjectURL(u); } catch { alert("Error al descargar el script"); } }} className="text-sm text-green-700 underline">Descargar .bat</button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPaso("manual")} className="text-sm text-gray-500 underline">O ingresar manualmente</button>
          </div>
        </div>
      )}

      {paso === "revision" && datosPC && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Datos detectados</h2>

          {datosPC.serial_exists && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              Este serial ya existe registrado en <strong>{datosPC.existing_recurso?.cliente_nombre || "otro equipo"}</strong>
              {" "}({datosPC.existing_recurso?.nombre}). Si guardas de nuevo se creará un duplicado.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Nombre:</span> <span className="font-medium">{datosPC.nombre}</span></div>
            <div><span className="text-gray-500">Serial:</span> <span className="font-mono font-medium">{datosPC.serial}</span></div>
            <div><span className="text-gray-500">Marca:</span> <span>{datosPC.marca || "—"}</span></div>
            <div><span className="text-gray-500">Modelo:</span> <span>{datosPC.modelo || "—"}</span></div>
            <div><span className="text-gray-500">Procesador:</span> <span>{datosPC.procesador || "—"}</span></div>
            <div><span className="text-gray-500">Memoria RAM:</span> <span>{datosPC.memoria_gb ? `${datosPC.memoria_gb} GB` : "—"}</span></div>
            <div><span className="text-gray-500">Almacenamiento:</span> <span>{datosPC.almacenamiento_gb ? `${datosPC.almacenamiento_gb} GB` : "—"}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Sistema Operativo:</span> <span>{datosPC.sistema_operativo || "—"}</span></div>
            {datosPC.atributos?.tipo_almacenamiento && <div><span className="text-gray-500">Tipo disco:</span> <span>{datosPC.atributos.tipo_almacenamiento}</span></div>}
            {datosPC.atributos?.chip_video && <div><span className="text-gray-500">Chip de video:</span> <span>{datosPC.atributos.chip_video}</span></div>}
            {datosPC.atributos?.memoria_video_mb && <div><span className="text-gray-500">VRAM:</span> <span>{datosPC.atributos.memoria_video_mb} MB</span></div>}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={guardarDetectado} disabled={guardando}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar equipo"}
            </button>
            <button onClick={() => setPaso("manual")} className="text-gray-500 text-sm underline">Editar datos antes de guardar</button>
            <button onClick={() => navigate("/helpdesk/recursos")} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </div>
      )}

      {paso === "manual" && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Datos del equipo</h2>

          <div className="grid grid-cols-2 gap-4">
            {cliente && (
              <div className="col-span-2 flex items-center gap-2 pb-1">
                <span className="text-xs text-gray-500">Cliente:</span>
                <span className="text-sm font-semibold text-gray-800">{cliente.razon_social}</span>
              </div>
            )}
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Nombre del equipo *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Lenovo Andres Cortez" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Marca</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="HP / Lenovo / Dell" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Modelo</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="IdeaPad 3 15IRH10" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Serial *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="PF68N6RS" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Procesador</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={procesador} onChange={(e) => setProcesador(e.target.value)} placeholder="Intel Core i5-1135G7" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">RAM (GB)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" step="0.1" value={memoriaGb} onChange={(e) => setMemoriaGb(e.target.value)} placeholder="8" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Almacenamiento (GB)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" step="0.1" value={almacenamientoGb} onChange={(e) => setAlmacenamientoGb(e.target.value)} placeholder="512" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Sistema Operativo</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={so} onChange={(e) => setSo(e.target.value)} placeholder="Windows 11 Pro" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo disco</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={tipoAlmacenamiento} onChange={(e) => setTipoAlmacenamiento(e.target.value)}>
                <option value="">Seleccionar...</option>
                <option value="SSD">SSD</option>
                <option value="HDD">HDD</option>
                <option value="Desconocido">Desconocido</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Chip de video</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={chipVideo} onChange={(e) => setChipVideo(e.target.value)} placeholder="Intel Iris Xe / NVIDIA RTX 3060" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">VRAM (MB)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" value={memoriaVideoMb} onChange={(e) => setMemoriaVideoMb(e.target.value)} placeholder="1024" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={guardar} disabled={guardando || !cliente || !serial}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => navigate("/helpdesk/recursos")} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
