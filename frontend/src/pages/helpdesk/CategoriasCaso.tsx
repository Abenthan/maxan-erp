import { useState, useEffect } from "react";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";

interface Categoria {
  id: number; nombre: string; color: string; activo: boolean;
}

export default function CategoriasCaso() {
  const api = useApi();
  const puedeGestionar = usePermiso("helpdesk.casos.gestionar");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoColor, setNuevoColor] = useState("#6B7280");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api.get<Categoria[]>("/helpdesk/categorias-caso").then(setCategorias).catch(() => {});
  }, [api]);

  async function agregar() {
    if (!nuevoNombre.trim()) return;
    setGuardando(true);
    try {
      const c = await api.post<Categoria>("/helpdesk/categorias-caso", { nombre: nuevoNombre, color: nuevoColor });
      setCategorias((prev) => [...prev, c]);
      setNuevoNombre("");
    } catch (e: any) {
      alert(e.message || "Error al crear categoría");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.del(`/helpdesk/categorias-caso/${id}`);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Categorías de Caso</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="space-y-2">
          {categorias.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-sm font-medium">{c.nombre}</span>
                {!c.activo && <span className="text-xs text-gray-400">(inactiva)</span>}
              </div>
              {puedeGestionar && (
                <button onClick={() => eliminar(c.id)} className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
              )}
            </div>
          ))}
        </div>

        {puedeGestionar && (
          <div className="pt-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Nueva categoría..."
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
