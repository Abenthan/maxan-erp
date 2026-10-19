import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

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

interface ProductoDisponible {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string | null;
  inventariable: boolean;
  unidad_medida: string;
}

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function GestionTienda() {
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("tienda.gestionar");

  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [disponibles, setDisponibles] = useState<ProductoDisponible[]>([]);
  const [busqDisponibles, setBusqDisponibles] = useState("");
  const [cargandoDisponibles, setCargandoDisponibles] = useState(false);
  const [seleccionado, setSeleccionado] = useState<ProductoDisponible | null>(null);
  const [precio, setPrecio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [modalError, setModalError] = useState("");

  const cargar = useCallback(() => {
    setLoading(true);
    api
      .get<ProductoVenta[]>("/tienda/productos-venta")
      .then(setProductos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (!modalOpen) return;
    setCargandoDisponibles(true);
    const t = setTimeout(() => {
      api
        .get<ProductoDisponible[]>(`/tienda/productos-disponibles?q=${encodeURIComponent(busqDisponibles)}`)
        .then(setDisponibles)
        .catch((e) => setModalError(e.message))
        .finally(() => setCargandoDisponibles(false));
    }, 250);
    return () => clearTimeout(t);
  }, [api, modalOpen, busqDisponibles]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  function abrirModal() {
    setModalOpen(true);
    setSeleccionado(null);
    setPrecio("");
    setBusqDisponibles("");
    setModalError("");
  }

  function cerrarModal() {
    setModalOpen(false);
    setSeleccionado(null);
    setPrecio("");
    setModalError("");
  }

  async function handleCrear() {
    if (!seleccionado) return;
    const precioNum = Number(precio);
    if (precio === "" || isNaN(precioNum) || precioNum < 0) {
      setModalError("El precio es obligatorio y debe ser mayor o igual a 0");
      return;
    }
    setGuardando(true);
    setModalError("");
    try {
      await api.post("/tienda/productos-venta", { producto_id: seleccionado.id, precio: precioNum });
      cerrarModal();
      cargar();
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Error al crear el registro");
    } finally {
      setGuardando(false);
    }
  }

  if (loading && productos.length === 0) return <p className="text-gray-500">Cargando productos de la tienda...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tienda</h1>
          <p className="text-sm text-gray-500 mt-1">Productos publicados en tienda.maxansistemas.com</p>
        </div>
        {puedeGestionar && (
          <button
            onClick={abrirModal}
            className="px-4 py-2 text-sm rounded-lg bg-fuchsia-600 text-white font-semibold hover:bg-fuchsia-700"
          >
            + Nuevo registro
          </button>
        )}
      </div>

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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
          {busqueda && (
            <button onClick={() => setBusqueda("")} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
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
              <th className="p-3 font-semibold text-gray-600 text-right">Precio</th>
              <th className="p-3 font-semibold text-gray-600">Activo</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  {productos.length === 0
                    ? "No hay productos registrados en la tienda"
                    : "No se encontraron productos con ese filtro"}
                </td>
              </tr>
            ) : (
              filtrados.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/gestionTienda/editarProducto/${p.producto_id}`)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-3 font-medium text-gray-800">{p.codigo}</td>
                  <td className="p-3 font-medium">{p.nombre}</td>
                  <td className="p-3 text-right text-gray-700">{formatCOP(Number(p.precio))}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${p.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {p.activo ? "Sí" : "No"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={cerrarModal}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Nuevo registro en tienda</h2>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{modalError}</div>
            )}

            {!seleccionado ? (
              <>
                <label className="block text-xs font-medium text-gray-500 mb-1">Producto (solo sin registro en tienda)</label>
                <input
                  type="text"
                  value={busqDisponibles}
                  onChange={(e) => setBusqDisponibles(e.target.value)}
                  placeholder="Buscar por código o nombre..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  autoFocus
                />
                <div className="mt-3 border border-gray-200 rounded-lg max-h-72 overflow-y-auto">
                  {cargandoDisponibles ? (
                    <p className="p-4 text-sm text-gray-400">Cargando...</p>
                  ) : disponibles.length === 0 ? (
                    <p className="p-4 text-sm text-gray-400">No hay productos disponibles para agregar</p>
                  ) : (
                    disponibles.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSeleccionado(d)}
                        className="w-full text-left px-3 py-2 border-b last:border-b-0 hover:bg-fuchsia-50"
                      >
                        <span className="block text-sm font-medium text-gray-800">{d.nombre}</span>
                        <span className="block text-xs text-gray-400">
                          {d.codigo}{d.categoria ? ` · ${d.categoria}` : ""}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{seleccionado.nombre}</p>
                      <p className="text-xs text-gray-500">{seleccionado.codigo}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSeleccionado(null)}
                      className="text-xs text-fuchsia-700 hover:underline shrink-0"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Precio *</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  autoFocus
                />
              </>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={cerrarModal}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              {seleccionado && (
                <button
                  type="button"
                  onClick={handleCrear}
                  disabled={guardando}
                  className="px-4 py-2 text-sm rounded-lg bg-fuchsia-600 text-white font-semibold hover:bg-fuchsia-700 disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Crear registro"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
