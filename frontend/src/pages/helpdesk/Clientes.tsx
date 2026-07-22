import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface Tercero {
  id: number;
  razon_social: string;
  numero_documento: string;
  tipo_documento: string;
  ciudad: string;
  telefono: string;
}

export default function HelpdeskClientes() {
  const api = useApi();
  const navigate = useNavigate();
  const { setCliente } = useHelpdesk();
  const [clientes, setClientes] = useState<Tercero[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get<Tercero[]>("/terceros?tipo=cliente")
      .then((data) => setClientes(data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [api]);

  const filtrados = clientes.filter((c) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      c.razon_social.toLowerCase().includes(q) ||
      (c.numero_documento ?? "").includes(q)
    );
  });

  function seleccionar(c: Tercero) {
    setCliente(c);
    navigate("/helpdesk");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Seleccionar Cliente</h1>
      </div>

      <input
        className="w-full border rounded-lg px-4 py-2.5 text-sm"
        placeholder="Buscar cliente por nombre o NIT..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        autoFocus
      />

      {cargando ? (
        <div className="text-center py-12 text-gray-400">Cargando clientes...</div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {busqueda ? "No se encontraron clientes" : "No hay clientes registrados"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map((c) => (
            <button
              key={c.id}
              onClick={() => seleccionar(c)}
              className="w-full text-left bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-amber-300 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-gray-800">{c.razon_social}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {c.tipo_documento} {c.numero_documento}
                  {c.ciudad && ` — ${c.ciudad}`}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.telefono && <span className="text-xs text-gray-400">{c.telefono}</span>}
                <span className="text-amber-500 text-lg">→</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
