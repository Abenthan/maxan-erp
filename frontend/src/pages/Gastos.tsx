import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

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

interface Gasto {
  id: number;
  descripcion: string;
  clasificacion: string;
  cantidad: string;
  valor_unitario: string;
  valor_total: string;
  fecha: string;
  factura_compra_id: number | null;
  producto_id: number | null;
  codigo_producto: string | null;
  venta_item_id: number | null;
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

const clasifBadge: Record<string, string> = {
  Suministros: "bg-blue-100 text-blue-800",
  Operacional: "bg-amber-100 text-amber-800",
  Administrativo: "bg-purple-100 text-purple-800",
};

export default function Gestos() {
  const api = useApi();
  const puedeGestionar = usePermiso("gastos.gestionar");
  const [searchParams, setSearchParams] = useSearchParams();
  const filtroProductoId = searchParams.get("producto_id") || "";
  const filtroProductoNombre = searchParams.get("nombre") || "";
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventaItems, setVentaItems] = useState<VentaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroDesc, setFiltroDesc] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [desc, setDesc] = useState("");
  const [clasif, setClasif] = useState("Administrativo");
  const [cant, setCant] = useState("1");
  const [vrUnit, setVrUnit] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [productoId, setProductoId] = useState("");
  const [codigoProducto, setCodigoProducto] = useState("");
  const [ventaId, setVentaId] = useState("");
  const [ventaItemId, setVentaItemId] = useState("");
  const [loadingVentaItems, setLoadingVentaItems] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Gasto>("fecha");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prodCodigo, setProdCodigo] = useState("");
  const [prodNombre, setProdNombre] = useState("");
  const [prodCategoria, setProdCategoria] = useState("");
  const [prodUnidad, setProdUnidad] = useState("UND");
  const [prodInventariable, setProdInventariable] = useState(true);
  const [creandoProducto, setCreandoProducto] = useState(false);

  const [showClasifModal, setShowClasifModal] = useState(false);
  const [nuevaClasif, setNuevaClasif] = useState("");

  const cargar = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filtroProductoId) params.producto_id = filtroProductoId;
    Promise.all([
      api.get<Gasto[]>("/gastos", params),
      api.get<Producto[]>("/productos"),
      api.get<Categoria[]>("/productos/categorias"),
      api.get<Venta[]>("/facturas"),
      api.get<Clasificacion[]>("/gastos/clasificaciones"),
    ])
      .then(([g, p, c, v, cl]) => { setGastos(g); setProductos(p); setCategorias(c); setVentas(v); setClasificaciones(cl); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, filtroProductoId]);

  useEffect(() => { cargar(); }, [cargar]);

  function limpiarForm() {
    setEditId(null);
    setEditModalOpen(false);
    setDesc("");
    setClasif("Administrativo");
    setCant("1");
    setVrUnit("");
    setFecha(new Date().toISOString().slice(0, 10));
    setProductoId("");
    setCodigoProducto("");
    setVentaId("");
    setVentaItemId("");
    setVentaItems([]);
  }

  function toggleSort(key: keyof Gasto) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ column }: { column: keyof Gasto }) {
    if (sortKey !== column) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const filtrados = useMemo(() => {
    const filtrados = gastos.filter((g) => {
      const matchDesc = !filtroDesc
        || g.descripcion.toLowerCase().includes(filtroDesc.toLowerCase());
      const matchDesde = !filtroFechaDesde || g.fecha >= filtroFechaDesde;
      const matchHasta = !filtroFechaHasta || g.fecha <= filtroFechaHasta;
      return matchDesc && matchDesde && matchHasta;
    });
    return [...filtrados].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "fecha":
          cmp = a.fecha.localeCompare(b.fecha);
          break;
        case "descripcion":
          cmp = a.descripcion.localeCompare(b.descripcion);
          break;
        case "clasificacion":
          cmp = a.clasificacion.localeCompare(b.clasificacion);
          break;
        case "cantidad":
          cmp = Number(a.cantidad) - Number(b.cantidad);
          break;
        case "valor_unitario":
          cmp = Number(a.valor_unitario) - Number(b.valor_unitario);
          break;
        case "valor_total":
          cmp = Number(a.valor_total) - Number(b.valor_total);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [gastos, filtroDesc, filtroFechaDesde, filtroFechaHasta, sortKey, sortDir]);

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

  function seleccionar(g: Gasto) {
    setEditId(g.id);
    setEditModalOpen(true);
    setDesc(g.descripcion);
    setClasif(g.clasificacion === "Suministros" ? "Administrativo" : g.clasificacion);
    setCant(Number(g.cantidad).toString());
    setVrUnit(Number(g.valor_unitario).toString());
    setFecha(g.fecha.slice(0, 10));
    setProductoId(g.producto_id ? String(g.producto_id) : "");
    setCodigoProducto(g.codigo_producto || "");
    setVentaItemId(g.venta_item_id ? String(g.venta_item_id) : "");
    setVentaId("");
    setVentaItems([]);
    if (g.venta_item_id) {
      api.get<VentaItem[]>(`/ventas/items`)
        .then((items) => {
          const item = items.find((i) => i.id === g.venta_item_id);
          if (item) {
            setVentaId(String(item.venta_id));
            setVentaItems(items.filter((i) => i.venta_id === item.venta_id));
          }
        })
        .catch(() => {});
    }
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
      if (editId) {
        await api.put(`/gastos/${editId}`, body);
      } else {
        await api.post("/gastos", body);
      }
      limpiarForm();
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function handleDelete() {
    if (!editId) return;
    if (!confirm("¿Estás seguro de eliminar este gasto?")) return;
    setGuardando(true);
    setError("");
    try {
      await api.del(`/gastos/${editId}`);
      limpiarForm();
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setGuardando(false);
    }
  }

  async function handleQuickCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!prodCodigo.trim() || !prodNombre.trim()) return;
    setCreandoProducto(true);
    setError("");
    try {
      const nuevo = await api.post<Producto>("/productos", {
        codigo: prodCodigo.trim(),
        nombre: prodNombre.trim(),
        categoria: prodCategoria || undefined,
        unidad_medida: prodUnidad,
        inventariable: prodInventariable,
      });
      const actualizados = [...productos, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProductos(actualizados);
      setProductoId(String(nuevo.id));
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setCreandoProducto(false);
    }
  }

  if (loading && gastos.length === 0) return <p className="text-gray-500">Cargando gastos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gastos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar por descripción</label>
            <input
              type="text"
              value={filtroDesc}
              onChange={(e) => setFiltroDesc(e.target.value)}
              placeholder="Descripción..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(filtroDesc || filtroFechaDesde || filtroFechaHasta || filtroProductoId) && (
            <button
              onClick={() => { setFiltroDesc(""); setFiltroFechaDesde(""); setFiltroFechaHasta(""); setSearchParams({}); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
        {filtroProductoId && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              Gastos de: {filtroProductoNombre || `Producto #${filtroProductoId}`}
              <button
                onClick={() => setSearchParams({})}
                className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("fecha")}>Fecha<SortIcon column="fecha" /></th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("descripcion")}>Descripción<SortIcon column="descripcion" /></th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("clasificacion")}>Clasificación<SortIcon column="clasificacion" /></th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("cantidad")}>Cantidad<SortIcon column="cantidad" /></th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none text-right" onClick={() => toggleSort("valor_unitario")}>Vr Unitario<SortIcon column="valor_unitario" /></th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none text-right" onClick={() => toggleSort("valor_total")}>Total<SortIcon column="valor_total" /></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    {gastos.length === 0 ? "No hay gastos registrados" : "No se encontraron gastos con esos filtros"}
                  </td>
                </tr>
              ) : (
                filtrados.map((g) => (
                    <tr
                      key={g.id}
                      onClick={() => puedeGestionar && seleccionar(g)}
                      className={`border-b hover:bg-gray-50 ${puedeGestionar ? "cursor-pointer" : ""} ${editId === g.id ? "bg-blue-50 ring-2 ring-blue-400 ring-inset" : ""}`}
                    >
                      <td className="p-3 text-gray-600">{new Date(g.fecha).toLocaleDateString("es-CO")}</td>
                      <td className="p-3 font-medium">{g.descripcion}</td>
                      <td className="p-3">
                        {g.producto_id ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${clasifBadge["Suministros"]}`}>Suministros</span>
                        ) : (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${clasifBadge[g.clasificacion] || "bg-gray-100 text-gray-800"}`}>
                            {g.clasificacion}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600">{Number(g.cantidad).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right">{formatCurrency(Number(g.valor_unitario))}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(Number(g.valor_total))}</td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {puedeGestionar && !editId && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Nuevo Gasto</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Descripción *</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
                required
                placeholder="Ej: Servicio de mensajería"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
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
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
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
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Clasificación</label>
              <div className="flex gap-1">
                <select
                  value={clasif}
                  onChange={(e) => setClasif(e.target.value)}
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
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
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Producto (opcional)</label>
              <div className="flex gap-1">
                <select
                  value={productoId}
                  onChange={(e) => {
                    setProductoId(e.target.value);
                    if (e.target.value) setClasif("Administrativo");
                  }}
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                >
                  <option value="">-- Ninguno --</option>
                  {productos.filter((p) => p.id).map((p) => (
                    <option key={p.id} value={p.id}>{p.codigo} - {p.nombre}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => { setProdCodigo(codigoProducto); setProdNombre(desc); setProdCategoria(""); setProdUnidad("UND"); setProdInventariable(true); setShowModal(true); }}
                  title="Crear producto rápido"
                  className="px-2.5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 shrink-0"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Factura de Venta (opcional)</label>
              <select
                value={ventaId}
                onChange={(e) => {
                  setVentaId(e.target.value);
                  setVentaItemId("");
                  if (e.target.value) setProductoId("");
                }}
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
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
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto")?.click(); }}}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">{loadingVentaItems ? "Cargando..." : "-- Seleccionar --"}</option>
                {ventaItems.map((i) => (
                  <option key={i.id} value={i.id}>Línea {i.numero_linea}: {i.descripcion.slice(0, 60)} — ${Number(i.valor_linea).toLocaleString("es-CO")}</option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-4 flex justify-end gap-3">
              <button
                id="guardar-gasto"
                type="submit"
                disabled={guardando || !desc.trim() || !vrUnit}
                className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar Gasto"} <span className="text-blue-200 text-xs ml-1">Ctrl+G</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {puedeGestionar && editId && editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => limpiarForm()}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Editar Gasto</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descripción *</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
                  required
                  placeholder="Ej: Servicio de mensajería"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
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
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
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
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Clasificación</label>
                <div className="flex gap-1">
                  <select
                    value={clasif}
                    onChange={(e) => setClasif(e.target.value)}
                    onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
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
              <div className="hidden lg:block"></div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Producto (opcional)</label>
                <div className="flex gap-1">
                  <select
                    value={productoId}
                    onChange={(e) => {
                      setProductoId(e.target.value);
                      if (e.target.value) setClasif("Administrativo");
                    }}
                    onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  >
                    <option value="">-- Ninguno --</option>
                    {productos.filter((p) => p.id).map((p) => (
                      <option key={p.id} value={p.id}>{p.codigo} - {p.nombre}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => { setProdCodigo(codigoProducto); setProdNombre(desc); setProdCategoria(""); setProdUnidad("UND"); setProdInventariable(true); setShowModal(true); }}
                    title="Crear producto rápido"
                    className="px-2.5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Factura de Venta (opcional)</label>
                <select
                  value={ventaId}
                  onChange={(e) => {
                    setVentaId(e.target.value);
                    setVentaItemId("");
                    if (e.target.value) setProductoId("");
                  }}
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
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
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "g") { e.preventDefault(); document.querySelector<HTMLButtonElement>("#guardar-gasto-modal")?.click(); }}}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">{loadingVentaItems ? "Cargando..." : "-- Seleccionar --"}</option>
                  {ventaItems.map((i) => (
                    <option key={i.id} value={i.id}>Línea {i.numero_linea}: {i.descripcion.slice(0, 60)} — ${Number(i.valor_linea).toLocaleString("es-CO")}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={guardando}
                  className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {guardando ? "Eliminando..." : "Eliminar"}
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={limpiarForm}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    id="guardar-gasto-modal"
                    type="submit"
                    disabled={guardando || !desc.trim() || !vrUnit}
                    className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {guardando ? "Guardando..." : "Actualizar Gasto"} <span className="text-blue-200 text-xs ml-1">Ctrl+G</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {puedeGestionar && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nuevo Producto Rápido</h3>
            <form onSubmit={handleQuickCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Código *</label>
                <input
                  type="text"
                  value={prodCodigo}
                  onChange={(e) => setProdCodigo(e.target.value)}
                  required
                  placeholder="Ej: PROD-001"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={prodNombre}
                  onChange={(e) => setProdNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
                <select
                  value={prodCategoria}
                  onChange={(e) => setProdCategoria(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sin categoría --</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
                <select
                  value={prodUnidad}
                  onChange={(e) => setProdUnidad(e.target.value)}
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
                  id="prodInventariable"
                  checked={prodInventariable}
                  onChange={(e) => setProdInventariable(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="prodInventariable" className="text-sm text-gray-700">Inventariable</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creandoProducto || !prodCodigo.trim() || !prodNombre.trim()}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {creandoProducto ? "Creando..." : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {puedeGestionar && showClasifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowClasifModal(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Administrar Clasificaciones de Gastos</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={nuevaClasif}
                onChange={(e) => setNuevaClasif(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    document.querySelector<HTMLButtonElement>("#btn-agregar-clasif")?.click();
                  }
                }}
                placeholder="Nueva clasificación..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                id="btn-agregar-clasif"
                type="button"
                disabled={!nuevaClasif.trim()}
                onClick={async () => {
                  if (!nuevaClasif.trim()) return;
                  try {
                    const creada = await api.post<Clasificacion>("/gastos/clasificaciones", { nombre: nuevaClasif.trim() });
                    setClasificaciones([...clasificaciones, creada].sort((a, b) => a.nombre.localeCompare(b.nombre)));
                    setNuevaClasif("");
                  } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : "Error al crear clasificación");
                  }
                }}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 shrink-0"
              >
                Agregar
              </button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {clasificaciones.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{c.nombre}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`¿Eliminar clasificación "${c.nombre}"?`)) return;
                      try {
                        await api.del(`/gastos/clasificaciones/${c.id}`);
                        setClasificaciones(clasificaciones.filter((x) => x.id !== c.id));
                      } catch (err: unknown) {
                        setError(err instanceof Error ? err.message : "Error al eliminar clasificación");
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowClasifModal(false)}
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
