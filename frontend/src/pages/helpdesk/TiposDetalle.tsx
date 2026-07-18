import { useState, useEffect } from "react";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";

interface TipoDetalle {
  id: number; nombre: string; color: string;
}

export default function TiposDetalle() {
  const api = useApi();
  const puedeGestionar = usePermiso("helpdesk.casos.gestionar");
  const [tipos, setTipos] = useState<TipoDetalle[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoColor, setNuevoColor] = useState("#92400e");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api.get<TipoDetalle[]>("/helpdesk/tipos-detalle").then(setTipos).catch(() => {});
  }, [api]);

  async function agregar() {
    if (!nuevoNombre.trim()) return;
    setGuardando(true);
    try {
      const t = await api.post<TipoDetalle>("/helpdesk/tipos-detalle", { nombre: nuevoNombre, color: nuevoColor });
      setTipos((prev) => [...prev, t]);
      setNuevoNombre("");
    } catch (e: any) {
      alert(e.message || "Error al crear tipo");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar este tipo?")) return;
    try {
      await api.del(`/helpdesk/tipos-detalle/${id}`);
      setTipos((prev) => prev.filter((t) => t.id !== id));
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tipos de Detalle</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="space-y-2">
          {tipos.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-sm font-medium">{t.nombre}</span>
              </div>
              {puedeGestionar && (
                <button onClick={() => eliminar(t.id)} className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
              )}
            </div>
          ))}
        </div>

        {puedeGestionar && (
          <div className="pt-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Nuevo tipo..."
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && agregar()}
            />
            <input
              type="color"
              value={nuevoColor}
              onChange={(e) => setNuevoColor(e.target.value)}
              className="w-10 h-10 p-1 border rounded cursor-pointer"
            />
            <button onClick={agregar} disabled={guardando || !nuevoNombre.trim()} className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50">
              Agregar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
