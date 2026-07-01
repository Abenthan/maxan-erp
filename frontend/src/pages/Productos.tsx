import { useEffect, useState, useCallback } from "react";
import { useApi } from "../context/ApiContext";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  inventariable: boolean;
  unidad_medida: string;
}

export default function Productos() {
  const api = useApi();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("UND");
  const [inventariable, setInventariable] = useState(true);
  const [creando, setCreando] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    api.get<Producto[]>("/productos")
      .then(setProductos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => { cargar(); }, [cargar]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setCreando(true);
    setError("");
    try {
      await api.post("/productos", {
        nombre: nombre.trim(),
        categoria: categoria.trim() || undefined,
        unidad_medida: unidad,
        inventariable,
      });
      setNombre("");
      setCategoria("");
      setUnidad("UND");
      setInventariable(true);
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setCreando(false);
    }
  }

  if (loading && productos.length === 0) return <p className="text-gray-500">Cargando productos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Productos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Nuevo Producto</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Nombre del producto"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ej: Equipos de Cómputo"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UND">Unidad (UND)</option>
              <option value="NIU">Pieza (NIU)</option>
              <option value="KGM">Kilogramo (KGM)</option>
              <option value="LTR">Litro (LTR)</option>
              <option value="MTR">Metro (MTR)</option>
              <option value="MTK">Metro cuadrado (MTK)</option>
              <option value="HUR">Hora (HUR)</option>
              <option value="DAY">Día (DAY)</option>
              <option value="MON">Mes (MON)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="inventariable"
              checked={inventariable}
              onChange={(e) => setInventariable(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="inventariable" className="text-sm text-gray-700">Inventariable</label>
          </div>
          <button
            type="submit"
            disabled={creando || !nombre.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {creando ? "Creando..." : "Crear Producto"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600">Nombre</th>
              <th className="p-3 font-semibold text-gray-600">Categoría</th>
              <th className="p-3 font-semibold text-gray-600">U. Medida</th>
              <th className="p-3 font-semibold text-gray-600">Inventariable</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{p.nombre}</td>
                <td className="p-3 text-gray-600">{p.categoria || "-"}</td>
                <td className="p-3 text-gray-600">{p.unidad_medida}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${p.inventariable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {p.inventariable ? "Sí" : "No"}
                  </span>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">No hay productos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
