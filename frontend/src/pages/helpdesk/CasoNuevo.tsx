import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface Tercero { id: number; razon_social: string; numero_documento: string; }
interface Recurso { id: number; nombre: string; serial: string; tipo: string; }
interface Usuario { id: number; nombres: string; apellidos: string; }
interface CategoriaCaso { id: number; nombre: string; color: string; }

export default function CasoNuevo() {
  const api = useApi();
  const navigate = useNavigate();
  const { cliente } = useHelpdesk();
  const [guardando, setGuardando] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaCaso[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [form, setForm] = useState({
    titulo: "", descripcion: "", categoria_id: "",
    cliente_id: cliente ? String(cliente.id) : "", contacto_id: "", tecnico_id: "",
  });
  const [busquedaCliente, setBusquedaCliente] = useState(cliente ? `${cliente.razon_social} (${cliente.numero_documento})` : "");
  const [clientes, setClientes] = useState<Tercero[]>([]);
  const [recursoIds, setRecursoIds] = useState<number[]>([]);
  const [recursosDisponibles, setRecursosDisponibles] = useState<Recurso[]>([]);
  const [busquedaRecurso, setBusquedaRecurso] = useState("");
  const [mostrarSelectorRecursos, setMostrarSelectorRecursos] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<CategoriaCaso[]>("/helpdesk/categorias-caso").then(setCategorias).catch(() => {});
    api.get<Usuario[]>("/usuarios").then(setTecnicos).catch(() => {});
  }, [api]);

  useEffect(() => {
    if (cliente || busquedaCliente.length < 2) { setClientes([]); return; }
    api.get<Tercero[]>(`/terceros?tipo=cliente&q=${encodeURIComponent(busquedaCliente)}`)
      .then(setClientes)
      .catch(() => {});
  }, [api, busquedaCliente, cliente]);

  const clienteId = form.cliente_id ? Number(form.cliente_id) : null;

  useEffect(() => {
    if (!clienteId) { setRecursosDisponibles([]); return; }
    api.get<Recurso[]>(`/helpdesk/recursos?cliente_id=${clienteId}`)
      .then(setRecursosDisponibles)
      .catch(() => {});
  }, [api, clienteId]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setMostrarSelectorRecursos(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const recursosFiltrados = recursosDisponibles.filter((r) =>
    !busquedaRecurso || r.nombre.toLowerCase().includes(busquedaRecurso.toLowerCase()) ||
    r.serial?.toLowerCase().includes(busquedaRecurso.toLowerCase()) ||
    r.tipo?.toLowerCase().includes(busquedaRecurso.toLowerCase())
  );

  function toggleRecurso(id: number) {
    setRecursoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function setField(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    setGuardando(true);
    try {
      const result = await api.post<{ id: number }>("/helpdesk/casos", {
        titulo: form.titulo,
        descripcion: form.descripcion,
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        cliente_id: form.cliente_id ? Number(form.cliente_id) : null,
        contacto_id: form.contacto_id ? Number(form.contacto_id) : null,
        tecnico_id: form.tecnico_id ? Number(form.tecnico_id) : null,
        recurso_ids: recursoIds.length > 0 ? recursoIds : undefined,
      });
      navigate(`/helpdesk/casos/${result.id}`);
    } catch (e: any) {
      alert(e.message || "Error al crear caso");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate("/helpdesk/casos")} className="text-sm text-gray-400 hover:text-gray-600 mb-4 block">← Volver a casos</button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Caso</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
          <input type="text" value={form.titulo} onChange={(e) => setField("titulo", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej: PC no enciende" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setField("descripcion", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" rows={3} placeholder="Describe el problema..." />
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
            <label className="block text-xs font-medium text-gray-500 mb-1">Técnico asignado</label>
            <select value={form.tecnico_id} onChange={(e) => setField("tecnico_id", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
              <option value="">Sin asignar</option>
              {tecnicos.map((u) => (
                <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
          {cliente ? (
            <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
              {cliente.razon_social} <span className="text-gray-400">({cliente.numero_documento})</span>
            </div>
          ) : (
            <>
              <input type="text" value={busquedaCliente} onChange={(e) => setBusquedaCliente(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" placeholder="Buscar cliente por nombre o NIT..." />
              {clientes.length > 0 && (
                <div className="mt-1 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                  {clientes.map((c) => (
                    <button key={c.id} type="button" onClick={() => { setField("cliente_id", String(c.id)); setBusquedaCliente(`${c.razon_social} (${c.numero_documento})`); setClientes([]); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-b-0">
                      {c.razon_social} <span className="text-gray-400">{c.numero_documento}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div ref={selectorRef} className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">Recursos vinculados</label>
          {!clienteId ? (
            <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-400">
              Selecciona un cliente primero
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setMostrarSelectorRecursos(!mostrarSelectorRecursos)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-amber-400">
                <span className={recursoIds.length === 0 ? "text-gray-400" : "text-gray-700"}>
                  {recursoIds.length === 0
                    ? "Seleccionar recursos..."
                    : `${recursoIds.length} recurso(s) seleccionado(s)`}
                </span>
                <span className="text-xs text-gray-400">{mostrarSelectorRecursos ? "▲" : "▼"}</span>
              </button>
              {recursoIds.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {recursosDisponibles.filter((r) => recursoIds.includes(r.id)).map((r) => (
                    <span key={r.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                      {r.nombre}
                      <button type="button" onClick={() => toggleRecurso(r.id)} className="hover:text-red-500">✕</button>
                    </span>
                  ))}
                </div>
              )}
              {mostrarSelectorRecursos && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 border-b sticky top-0 bg-white">
                    <input type="text" value={busquedaRecurso} onChange={(e) => setBusquedaRecurso(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded" placeholder="Buscar recurso..." autoFocus />
                  </div>
                  {recursosFiltrados.length === 0 ? (
                    <div className="p-3 text-sm text-gray-400 text-center">Sin resultados</div>
                  ) : (
                    recursosFiltrados.map((r) => (
                      <label key={r.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                        <input type="checkbox" checked={recursoIds.includes(r.id)} onChange={() => toggleRecurso(r.id)} className="rounded" />
                        <span className="font-medium">{r.nombre}</span>
                        {r.serial && <span className="text-xs text-gray-400 font-mono">{r.serial}</span>}
                        <span className="text-xs text-gray-400 ml-auto">{r.tipo}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/helpdesk/casos")} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={guardando} className="px-6 py-2 text-sm rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50">
            {guardando ? "Creando..." : "Crear Caso"}
          </button>
        </div>
      </form>
    </div>
  );
}
