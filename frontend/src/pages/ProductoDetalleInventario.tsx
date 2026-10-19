import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";
import ImagenesProducto from "../components/ImagenesProducto";

interface Imagen {
  id: number;
  producto_id: number;
  url: string;
  es_principal: boolean;
  orden: number;
  created_at: string;
}

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string | null;
  inventariable: boolean;
  unidad_medida: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

export default function ProductoDetalleInventario() {
  const api = useApi();
  const { id } = useParams<{ id: string }>();
  const puedeGestionar = usePermiso("productos.gestionar");

  const [producto, setProducto] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("UND");
  const [inventariable, setInventariable] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      api.get<Producto>(`/productos/${id}`),
      api.get<Categoria[]>("/productos/categorias"),
      api.get<Imagen[]>(`/productos/${id}/imagenes`),
    ])
      .then(([p, cats, imgs]) => {
        if (!active) return;
        setProducto(p);
        setCodigo(p.codigo);
        setNombre(p.nombre);
        setCategoria(p.categoria || "");
        setUnidad(p.unidad_medida || "UND");
        setInventariable(p.inventariable);
        setCategorias(cats);
        setImagenes(imgs);
      })
      .catch((e) => { if (active) setError(e.message || "No se pudo cargar el producto"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api, id]);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim() || !nombre.trim()) {
      setError("El código y el nombre son obligatorios");
      return;
    }
    setGuardando(true);
    setError("");
    setMensaje("");
    try {
      const actualizado = await api.put<Producto>(`/productos/${id}`, {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoria: categoria || undefined,
        unidad_medida: unidad,
        inventariable,
      });
      setProducto(actualizado);
      setMensaje("Cambios guardados correctamente");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  if (loading) return <p className="text-gray-500">Cargando producto...</p>;
  if (!producto) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error || "Producto no encontrado"}</div>;

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/inventario/productos" className="text-sm text-emerald-600 hover:underline">
        ← Volver a productos
      </Link>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}
      {mensaje && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{mensaje}</div>
      )}

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded">
              {producto.categoria || "Sin categoría"}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{producto.nombre}</h1>
            <p className="mt-1 text-sm text-gray-400">Ref. {producto.codigo}</p>
          </div>
        </div>

        <form onSubmit={handleGuardar} className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos del producto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Código *</label>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} disabled={!puedeGestionar} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={!puedeGestionar} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={!puedeGestionar} className={`${inputCls} bg-white`}>
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Unidad de medida</label>
              <input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} disabled={!puedeGestionar} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={inventariable} onChange={(e) => setInventariable(e.target.checked)} disabled={!puedeGestionar} className="w-4 h-4" />
                Inventariable
              </label>
            </div>
          </div>

          {puedeGestionar && (
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={guardando}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          )}
        </form>

        {puedeGestionar ? (
          <ImagenesProducto productoId={producto.id} imagenes={imagenes} onActualizar={setImagenes} />
        ) : (
          imagenes.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Imágenes del producto</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imagenes.map((img) => (
                  <div key={img.id} className={`rounded-lg overflow-hidden border-2 aspect-square ${img.es_principal ? "border-emerald-500" : "border-gray-200"}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
