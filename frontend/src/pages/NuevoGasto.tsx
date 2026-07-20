import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Clasificacion {
  id: number;
  nombre: string;
}

interface Venta {
  id: number;
  numero_completo: string;
  fecha_emision: string;
  receptor: string;
  nit_receptor: string;
}

interface VentaItem {
  id: number;
  venta_id: number;
  numero_linea: number;
  descripcion: string;
  valor_linea: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function NuevoGasto() {
  const navigate = useNavigate();
  const api = useApi();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);
  const [ventaItems, setVentaItems] = useState<VentaItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");

  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [desc, setDesc] = useState("");
  const [vrUnit, setVrUnit] = useState("");
  const [cant, setCant] = useState("1");
  const [clasif, setClasif] = useState("Administrativo");
  const [productoId, setProductoId] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [ventaId, setVentaId] = useState("");
  const [ventaItemId, setVentaItemId] = useState("");
  const [loadingVentaItems, setLoadingVentaItems] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [showClasifModal, setShowClasifModal] = useState(false);
  const [nuevaClasif, setNuevaClasif] = useState("");
  const [creandoClasif, setCreandoClasif] = useState(false);

  const [showQuickProductModal, setShowQuickProductModal] = useState(false);
  const [prodCodigo, setProdCodigo] = useState("");
  const [prodNombre, setProdNombre] = useState("");
  const [prodCategoria, setProdCategoria] = useState("0");
  const [prodUnidad, setProdUnidad] = useState("UND");
  const [prodInventariable, setProdInventariable] = useState(true);
  const [creandoProducto, setCreandoProducto] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const searchRef = useRef<HTMLInputElement>(null);

  const productoSeleccionado = useMemo(
    () => productos.find((p) => String(p.id) === productoId),
    [productos, productoId]
  );

  useEffect(() => {
    Promise.all([
      api.get<Producto[]>("/productos"),
      api.get<Venta[]>("/facturas"),
      api.get<Clasificacion[]>("/gastos/clasificaciones"),
      api.get<Categoria[]>("/productos/categorias"),
    ])
      .then(([p, v, cl, cat]) => { setProductos(p); setVentas(v); setClasificaciones(cl); setCategorias(cat); })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingInitial(false));
  }, [api]);

  const cargarVentaItems = useCallback((vId: string) => {
    if (!vId) { setVentaItems([]); return; }
    setLoadingVentaItems(true);
    api.get<VentaItem[]>(`/ventas/items?venta_id=${vId}`)
      .then((items) => setVentaItems(items))
      .catch(() => setVentaItems([]))
      .finally(() => setLoadingVentaItems(false));
  }, [api]);

  useEffect(() => { cargarVentaItems(ventaId); }, [ventaId, cargarVentaItems]);

  const totalCalculado = useMemo(() => {
    const c = parseFloat(cant) || 0;
    const u = parseFloat(vrUnit) || 0;
    return c * u;
  }, [cant, vrUnit]);

  const productosFiltrados = useMemo(() => {
    if (!busquedaProducto) return productos;
    const q = busquedaProducto.toLowerCase();
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
    );
  }, [productos, busquedaProducto]);

  function limpiarProducto() {
    setProductoId("");
    setBusquedaProducto("");
    setTimeout(() => searchRef.current?.focus(), 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!desc.trim() || !vrUnit) return;

    setGuardando(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        descripcion: desc.trim(),
        clasificacion: clasif,
        cantidad: parseFloat(cant),
        valor_unitario: parseFloat(vrUnit),
        valor_total: totalCalculado,
        fecha,
      };
      if (productoId) {
        body.producto_id = parseInt(productoId, 10);
        body.clasificacion = undefined;
      }
      if (ventaItemId) {
        body.venta_item_id = parseInt(ventaItemId, 10);
        body.producto_id = undefined;
      }
      await api.post("/gastos", body);
      navigate("/financiero/gastos");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function crearClasificacion() {
    if (!nuevaClasif.trim()) return;
    setCreandoClasif(true);
    try {
      await api.post("/gastos/clasificaciones", { nombre: nuevaClasif.trim() });
      setNuevaClasif("");
      const cl = await api.get<Clasificacion[]>("/gastos/clasificaciones");
      setClasificaciones(cl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear clasificación");
    } finally {
      setCreandoClasif(false);
    }
  }

  async function eliminarClasificacion(id: number) {
    if (!confirm("¿Eliminar esta clasificación?")) return;
    try {
      await api.del(`/gastos/clasificaciones/${id}`);
      const cl = await api.get<Clasificacion[]>("/gastos/clasificaciones");
      setClasificaciones(cl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  }

  async function crearProducto() {
    if (!prodNombre.trim()) return;
    setCreandoProducto(true);
    try {
      const body: Record<string, unknown> = {
        codigo: prodCodigo.trim(),
        nombre: prodNombre.trim(),
        categoria_id: prodCategoria !== "0" ? parseInt(prodCategoria, 10) : null,
        unidad: prodUnidad,
        inventariable: prodInventariable,
      };
      const nuevo = await api.post<Producto>("/productos", body);
      setShowQuickProductModal(false);
      const p = await api.get<Producto[]>("/productos");
      setProductos(p);
      setProductoId(String(nuevo.id));
      setBusquedaProducto(nuevo.codigo);
      setClasif("Administrativo");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setCreandoProducto(false);
    }
  }

  if (loadingInitial) {
    return <div className="p-6 text-gray-400">Cargando...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Gasto</h1>
        <button
          onClick={() => navigate("/financiero/gastos")}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Volver
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* ── Descripción del gasto ── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Descripción del gasto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-1 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descripción *</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  placeholder="Ej: Servicio de mensajería"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Valor Unitario *</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={vrUnit}
                  onChange={(e) => setVrUnit(e.target.value)}
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="max-w-28">
                <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={cant}
                  onChange={(e) => setCant(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Total (auto)</label>
                <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium">
                  {formatCurrency(totalCalculado)}
                </div>
              </div>
            </div>
          </div>

          {/* ── Clasificación ── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Clasificación
            </h2>
            <div className="max-w-xs">
              <div className="flex gap-1">
                <select
                  value={clasif}
                  onChange={(e) => setClasif(e.target.value)}
                  disabled={!!productoId}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {clasificaciones.filter((c) => c.nombre !== "Suministros").map((c) => (
                    <option key={c.id} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowClasifModal(true)}
                  title="Administrar clasificaciones"
                  className="px-2.5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 shrink-0"
                >
                  ⚙
                </button>
              </div>
            </div>
          </div>

          {/* ── Producto (opcional) ── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Producto <span className="text-xs font-normal text-gray-400">(opcional)</span>
            </h2>

            {productoSeleccionado ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg max-w-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-emerald-800">
                    <span className="font-mono font-medium">{productoSeleccionado.codigo}</span>
                    {" — "}
                    {productoSeleccionado.nombre}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={limpiarProducto}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setProductoId(""); setBusquedaProducto(""); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium underline"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-lg">
                <div className="flex gap-1 mb-3">
                  <input
                    ref={searchRef}
                    type="text"
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    placeholder="Buscar producto por nombre o código..."
                    autoFocus
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => { setProdCodigo(""); setProdNombre(desc); setProdCategoria("0"); setProdUnidad("UND"); setProdInventariable(true); setShowQuickProductModal(true); }}
                    title="Crear producto rápido"
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 shrink-0"
                  >
                    +
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg max-h-52 overflow-y-auto">
                  {productosFiltrados.length === 0 ? (
                    <p className="p-4 text-sm text-gray-400 text-center">No se encontraron productos</p>
                  ) : (
                    productosFiltrados.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setProductoId(String(p.id)); setClasif("Administrativo"); }}
                        className="w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 hover:bg-emerald-50 transition-colors flex items-center gap-3 last:border-b-0"
                      >
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          String(p.id) === productoId ? "border-emerald-600 bg-emerald-600" : "border-gray-300"
                        }`}>
                          {String(p.id) === productoId && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span className="text-gray-500 font-mono text-xs">{p.codigo}</span>
                        <span className="text-gray-800">{p.nombre}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Factura de Venta (opcional) ── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Factura de Venta <span className="text-xs font-normal text-gray-400">(opcional)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Factura</label>
                <select
                  value={ventaId}
                  onChange={(e) => {
                    setVentaId(e.target.value);
                    setVentaItemId("");
                    if (e.target.value) setProductoId("");
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                >
                  <option value="">-- Ninguna --</option>
                  {ventas.map((v) => (
                    <option key={v.id} value={v.id}>{v.numero_completo} — {v.receptor} ({new Date(v.fecha_emision).toLocaleDateString("es-CO")})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Item de Venta</label>
                <select
                  value={ventaItemId}
                  onChange={(e) => {
                    setVentaItemId(e.target.value);
                    if (e.target.value) setProductoId("");
                    if (!e.target.value) { setVentaId(""); setVentaItems([]); }
                  }}
                  disabled={!ventaId || loadingVentaItems}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">{loadingVentaItems ? "Cargando..." : "-- Seleccionar --"}</option>
                  {ventaItems.map((i) => (
                    <option key={i.id} value={i.id}>Línea {i.numero_linea}: {i.descripcion.slice(0, 60)} — ${Number(i.valor_linea).toLocaleString("es-CO")}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/financiero/gastos")}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !desc.trim() || !vrUnit}
              className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar Gasto"}
            </button>
          </div>
        </div>
      </form>

      {showClasifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Administrar Clasificaciones de Gastos</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={nuevaClasif}
                onChange={(e) => setNuevaClasif(e.target.value)}
                placeholder="Nueva clasificación..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={crearClasificacion}
                disabled={creandoClasif || !nuevaClasif.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creandoClasif ? "..." : "Agregar"}
              </button>
            </div>
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {clasificaciones.filter((c) => c.nombre !== "Suministros").map((c) => (
                <li key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{c.nombre}</span>
                  <button
                    onClick={() => eliminarClasificacion(c.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowClasifModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuickProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowQuickProductModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crear Producto Rápido</h3>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Código</label>
                <input
                  type="text"
                  value={prodCodigo}
                  onChange={(e) => setProdCodigo(e.target.value)}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={prodNombre}
                  onChange={(e) => setProdNombre(e.target.value)}
                  placeholder="Nombre del producto"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
                <select
                  value={prodCategoria}
                  onChange={(e) => setProdCategoria(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                >
                  <option value="0">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
                <select
                  value={prodUnidad}
                  onChange={(e) => setProdUnidad(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                >
                  <option value="UND">Unidad</option>
                  <option value="HRA">Hora</option>
                  <option value="MTR">Metro</option>
                  <option value="KGM">Kilogramo</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inv-check"
                  checked={prodInventariable}
                  onChange={(e) => setProdInventariable(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="inv-check" className="text-sm text-gray-600">Inventariable (genera entrada de inventario)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowQuickProductModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={crearProducto}
                disabled={creandoProducto || !prodNombre.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creandoProducto ? "Creando..." : "Crear Producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
