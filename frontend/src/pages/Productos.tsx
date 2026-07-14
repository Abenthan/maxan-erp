import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  inventariable: boolean;
  unidad_medida: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

export default function Productos() {
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("productos.gestionar");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("UND");
  const [inventariable, setInventariable] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [creando, setCreando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const [showCatModal, setShowCatModal] = useState(false);
  const [nuevaCat, setNuevaCat] = useState("");
  const [creandoCat, setCreandoCat] = useState(false);
  const [catError, setCatError] = useState("");

  const cargar = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get<Producto[]>("/productos"),
      api.get<Categoria[]>("/productos/categorias"),
    ])
      .then(([p, c]) => { setProductos(p); setCategorias(c); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => { cargar(); }, [cargar]);

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const matchBusq = !busqueda
        || p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        || p.codigo.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = !filtroCategoria || p.categoria === filtroCategoria;
      return matchBusq && matchCat;
    });
  }, [productos, busqueda, filtroCategoria]);

  function limpiarForm() {
    setEditId(null);
    setEditModalOpen(false);
    setCodigo("");
    setNombre("");
    setCategoria("");
    setUnidad("UND");
    setInventariable(true);
  }

  function seleccionar(p: Producto) {
    setEditId(p.id);
    setEditModalOpen(true);
    setCodigo(p.codigo);
    setNombre(p.nombre);
    setCategoria(p.categoria);
    setUnidad(p.unidad_medida);
    setInventariable(p.inventariable);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim() || !nombre.trim()) return;
    setCreando(true);
    setError("");
    try {
      const body = {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoria: categoria || undefined,
        unidad_medida: unidad,
        inventariable,
      };
      if (editId) {
        await api.put(`/productos/${editId}`, body);
      } else {
        await api.post("/productos", body);
      }
      limpiarForm();
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar producto");
    } finally {
      setCreando(false);
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

  if (loading && productos.length === 0) return <p className="text-gray-500">Cargando productos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Productos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Código o nombre..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
          </div>
          {(busqueda || filtroCategoria) && (
            <button
              onClick={() => { setBusqueda(""); setFiltroCategoria(""); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600">Código</th>
              <th className="p-3 font-semibold text-gray-600">Nombre</th>
              <th className="p-3 font-semibold text-gray-600">Categoría</th>
              <th className="p-3 font-semibold text-gray-600">U. Medida</th>
              <th className="p-3 font-semibold text-gray-600">Inventariable</th>
              <th className="p-3 font-semibold text-gray-600">Stock</th>
              <th className="p-3 font-semibold text-gray-600">Gastos</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  {productos.length === 0 ? "No hay productos registrados" : "No se encontraron productos con esos filtros"}
                </td>
              </tr>
            ) : (
              filtrados.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => puedeGestionar && seleccionar(p)}
                  className={`border-b hover:bg-gray-50 ${puedeGestionar ? "cursor-pointer" : ""} ${editId === p.id ? "bg-blue-50 ring-2 ring-blue-400 ring-inset" : ""}`}
                >
                  <td className="p-3 font-medium text-gray-800">{p.codigo}</td>
                  <td className="p-3 font-medium">{p.nombre}</td>
                  <td className="p-3 text-gray-600">{p.categoria || "-"}</td>
                  <td className="p-3 text-gray-600">{p.unidad_medida}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${p.inventariable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {p.inventariable ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); navigate(`/financiero/inventario/movimientos?producto_id=${p.id}&nombre=${encodeURIComponent(p.nombre)}`); }}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Stock
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); navigate(`/financiero/gastos?producto_id=${p.id}&nombre=${encodeURIComponent(p.nombre)}`); }}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Gastos
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {puedeGestionar && !editId && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Código *</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                placeholder="Ej: PROD-001"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              <div className="flex gap-1">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
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
                  className="px-2.5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600"
                >
                  ⚙
                </button>
              </div>
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
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creando || !codigo.trim() || !nombre.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {creando ? "Guardando..." : "Crear Producto"}
              </button>
            </div>
          </form>
        </div>
      )}

      {puedeGestionar && editId && editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => limpiarForm()}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Editar Producto</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Código *</label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                  placeholder="Ej: PROD-001"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
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
                <div className="flex gap-1">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-2.5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600"
                  >
                    ⚙
                  </button>
                </div>
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inventariable-modal"
                  checked={inventariable}
                  onChange={(e) => setInventariable(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="inventariable-modal" className="text-sm text-gray-700">Inventariable</label>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={limpiarForm}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creando || !codigo.trim() || !nombre.trim()}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {creando ? "Guardando..." : "Actualizar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={creandoCat || !nuevaCat.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
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
