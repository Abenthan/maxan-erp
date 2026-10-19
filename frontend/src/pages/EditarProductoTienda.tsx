import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Imagen {
  id: number;
  producto_id: number;
  url: string;
  es_principal: boolean;
  orden: number;
  created_at: string;
}

interface ProductoVenta {
  id: number;
  producto_id: number;
  codigo: string;
  nombre: string;
  categoria: string | null;
  inventariable: boolean;
  unidad_medida: string;
  precio: string;
  activo: boolean;
  destacado: boolean;
  descripcion: string | null;
}

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function EditarProductoTienda() {
  const api = useApi();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const puedeEliminar = usePermiso("usuarios.gestionar");

  const [producto, setProducto] = useState<ProductoVenta | null>(null);
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [imgSeleccionada, setImgSeleccionada] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [precio, setPrecio] = useState("");
  const [activo, setActivo] = useState(true);
  const [destacado, setDestacado] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get<ProductoVenta>(`/tienda/productos-venta/${id}`)
      .then((p) => {
        if (!active) return;
        setProducto(p);
        setPrecio(String(Number(p.precio)));
        setActivo(p.activo);
        setDestacado(p.destacado);
        setDescripcion(p.descripcion || "");
        return api.get<Imagen[]>(`/productos/${p.producto_id}/imagenes`).then((imgs) => {
          if (active) setImagenes(imgs);
        });
      })
      .catch((e) => { if (active) setError(e.message || "No se pudo cargar el producto"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api, id]);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!producto) return;
    const precioNum = Number(precio);
    if (precio === "" || isNaN(precioNum) || precioNum < 0) {
      setError("El precio es obligatorio y debe ser mayor o igual a 0");
      return;
    }
    setGuardando(true);
    setError("");
    setMensaje("");
    try {
      const actualizado = await api.put<ProductoVenta>(`/tienda/productos-venta/${producto.producto_id}`, {
        precio: precioNum,
        activo,
        destacado,
        descripcion,
      });
      setProducto((prev) => (prev ? { ...prev, ...actualizado } : prev));
      setMensaje("Cambios guardados correctamente");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar() {
    if (!producto) return;
    if (!confirm(`¿Eliminar "${producto.nombre}" de la tienda? El producto de inventario no se modifica.`)) return;
    setEliminando(true);
    setError("");
    try {
      await api.del(`/tienda/productos-venta/${producto.producto_id}`);
      navigate("/gestionTienda");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
      setEliminando(false);
    }
  }

  if (loading) return <p className="text-gray-500">Cargando producto...</p>;
  if (error && !producto) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
  if (!producto) return <p className="text-gray-500">Producto no encontrado</p>;

  const imgActual = imagenes.length > 0 ? imagenes[imgSeleccionada]?.url : undefined;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/gestionTienda" className="text-sm text-fuchsia-600 hover:underline">
        ← Volver a la tienda
      </Link>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}
      {mensaje && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{mensaje}</div>
      )}

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            {imgActual ? (
              <img src={imgActual} alt={producto.nombre} className="w-full h-80 lg:h-96 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-80 lg:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-6xl text-gray-300">📦</span>
              </div>
            )}
            {imagenes.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {imagenes.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setImgSeleccionada(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === imgSeleccionada ? "border-fuchsia-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/2">
            <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded">
              {producto.categoria || "Sin categoría"}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{producto.nombre}</h1>
            {producto.codigo && <p className="mt-1 text-sm text-gray-400">Ref. {producto.codigo}</p>}

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-4">
                <dt className="text-gray-400">Unidad de medida</dt>
                <dd className="mt-1 font-medium text-gray-900">{producto.unidad_medida || "UND"}</dd>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <dt className="text-gray-400">Precio actual</dt>
                <dd className="mt-1 font-medium text-gray-900">{formatCOP(Number(producto.precio))}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                to={`/inventario/productos/${producto.producto_id}`}
                className="text-sm text-fuchsia-600 hover:underline"
              >
                Ver producto en inventario (editar datos e imágenes) →
              </Link>
            </div>
          </div>
        </div>

        <form onSubmit={handleGuardar} className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos de venta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Precio *</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            <div className="flex items-end gap-6 pb-1">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="w-4 h-4" />
                Activo
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} className="w-4 h-4" />
                Destacado
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                placeholder="Texto descriptivo para la tienda (opcional)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div>
              {puedeEliminar && (
                <button
                  type="button"
                  onClick={handleEliminar}
                  disabled={eliminando}
                  className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
                >
                  {eliminando ? "Eliminando..." : "Eliminar"}
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={guardando}
              className="px-4 py-2 text-sm rounded-lg bg-fuchsia-600 text-white font-semibold hover:bg-fuchsia-700 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
