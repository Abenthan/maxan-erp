import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Categoria {
  id: number;
  nombre: string;
}

export default function NuevoProducto() {
  const navigate = useNavigate();
  const api = useApi();

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("UND");
  const [inventariable, setInventariable] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [showCatModal, setShowCatModal] = useState(false);
  const [nuevaCat, setNuevaCat] = useState("");
  const [creandoCat, setCreandoCat] = useState(false);
  const [catError, setCatError] = useState("");

  useEffect(() => {
    api.get<Categoria[]>("/productos/categorias")
      .then(setCategorias)
      .catch(() => {});
  }, [api]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim() || !nombre.trim()) return;
    setGuardando(true);
    setError("");
    try {
      await api.post("/productos", {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoria: categoria || undefined,
        unidad_medida: unidad,
        inventariable,
      });
      navigate("/inventario/productos");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar producto");
    } finally {
      setGuardando(false);
    }
  }

  async function handleAddCategoria(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevaCat.trim()) return;
    setCreandoCat(true);
    setCatError("");
    try {
      const cat = await api.post<Categoria>("/productos/categorias", { nombre: nuevaCat.trim() });
      setCategorias((prev) => [...prev, cat].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setNuevaCat("");
    } catch (err: unknown) {
      setCatError(err instanceof Error ? err.message : "Error al crear categoría");
    } finally {
      setCreandoCat(false);
    }
  }

  async function handleDeleteCategoria(id: number) {
    try {
      await api.del(`/productos/categorias/${id}`);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      setCatError(err instanceof Error ? err.message : "Error al eliminar categoría");
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
        <button
          onClick={() => navigate("/inventario/productos")}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Volver
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Código *</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                placeholder="Ej: PROD-001"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Nombre del producto"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
            <div className="flex gap-1">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Sin categoría --</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => { setNuevaCat(""); setCatError(""); setShowCatModal(true); }}
                title="Administrar categorías"
                className="px-2.5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-emerald-600"
              >
                ⚙
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inventariable"
              checked={inventariable}
              onChange={(e) => setInventariable(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="inventariable" className="text-sm text-gray-700">Inventariable</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/inventario/productos")}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !codigo.trim() || !nombre.trim()}
              className="px-6 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </form>

      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCatModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Administrar Categorías</h3>

            {catError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">{catError}</div>
            )}

            <form onSubmit={handleAddCategoria} className="flex gap-2 mb-4">
              <input
                type="text"
                value={nuevaCat}
                onChange={(e) => setNuevaCat(e.target.value)}
                placeholder="Nueva categoría..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={creandoCat || !nuevaCat.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                {creandoCat ? "..." : "Agregar"}
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-1">
              {categorias.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No hay categorías creadas</p>
              ) : (
                categorias.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                    <span className="text-sm text-gray-700">{c.nombre}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategoria(c.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
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
