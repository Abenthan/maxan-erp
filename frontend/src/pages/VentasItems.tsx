import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";

interface Product {
  id: number;
  codigo: string;
  nombre: string;
}

interface VentaItem {
  id: number;
  venta_id: number;
  numero_linea: number;
  descripcion: string;
  codigo_producto: string;
  cantidad: string;
  unidad_medida: string;
  valor_unitario: string;
  valor_linea: string;
  numero_completo: string;
  fecha_emision: string;
  cliente: string;
  nit_cliente: string;
  producto_id: number | null;
  consumido: boolean;
  cufe: string | null;
}

type SortKey = "fecha_emision" | "numero_completo" | "cliente";
type SortDir = "asc" | "desc";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function VentasItems() {
  const api = useApi();
  const navigate = useNavigate();
  const puedeCrearVenta = usePermiso("ventas.crear");
  const puedeGestionarInventario = usePermiso("inventario.gestionar");
  const [items, setItems] = useState<VentaItem[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  const [sortKey, setSortKey] = useState<SortKey>("fecha_emision");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [modalItem, setModalItem] = useState<VentaItem | null>(null);
  const [prodSeleccionado, setProdSeleccionado] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [guardandoProd, setGuardandoProd] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const cargarDatos = () => {
    setLoading(true);
    setError("");
    Promise.all([
      api.get<VentaItem[]>("/ventas/items"),
      api.get<Product[]>("/productos"),
    ])
      .then(([itemsData, prodData]) => {
        setItems(itemsData);
        setProductos(prodData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarDatos();
  }, [api]);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    const filtered = items.filter((it) => {
      if (q && !it.numero_completo.toLowerCase().includes(q) && !it.descripcion.toLowerCase().includes(q) && !it.cliente.toLowerCase().includes(q)) return false;
      if (filtroFechaDesde && it.fecha_emision < filtroFechaDesde) return false;
      if (filtroFechaHasta && it.fecha_emision > filtroFechaHasta) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "fecha_emision":
          cmp = a.fecha_emision.localeCompare(b.fecha_emision);
          break;
        case "numero_completo":
          cmp = a.numero_completo.localeCompare(b.numero_completo);
          break;
        case "cliente":
          cmp = a.cliente.localeCompare(b.cliente);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [items, busqueda, filtroFechaDesde, filtroFechaHasta, sortKey, sortDir]);

  function abrirModalProducto(item: VentaItem) {
    setModalItem(item);
    setProdSeleccionado(item.producto_id ? String(item.producto_id) : "");
    setBusquedaProducto("");
    setMensaje(null);
  }

  async function guardarProducto() {
    if (!modalItem || !prodSeleccionado) return;
    setGuardandoProd(true);
    setMensaje(null);
    try {
      await api.put(`/ventas/items/${modalItem.id}`, { producto_id: parseInt(prodSeleccionado, 10) });
      await api.post("/inventario/consumir", {
        factura_item_id: modalItem.id,
        producto_id: parseInt(prodSeleccionado, 10),
        cantidad: Number(modalItem.cantidad),
      });
      setMensaje({ tipo: "ok", texto: `Producto asignado y consumido correctamente` });
      setModalItem(null);
      cargarDatos();
    } catch (e: unknown) {
      setMensaje({ tipo: "error", texto: e instanceof Error ? e.message : "Error al guardar" });
    } finally {
      setGuardandoProd(false);
    }
  }

  function productoNombre(item: VentaItem): string {
    const p = productos.find((p) => p.id === item.producto_id);
    return p ? `[${p.codigo}] ${p.nombre}` : "";
  }

  if (loading && items.length === 0) return <p className="text-gray-500">Cargando items de venta...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Items de Ventas</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      {mensaje && (
        <div className={`mb-4 p-3 rounded text-sm ${mensaje.tipo === "ok" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar por venta, descripción o cliente</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
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
          {(busqueda || filtroFechaDesde || filtroFechaHasta) && (
            <button
              onClick={() => { setBusqueda(""); setFiltroFechaDesde(""); setFiltroFechaHasta(""); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-y-auto max-h-[600px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="bg-gray-50 border-b text-left">
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("fecha_emision")}>
                  <span className="flex items-center gap-1">Fecha <SortIcon column="fecha_emision" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("numero_completo")}>
                  <span className="flex items-center gap-1">Venta <SortIcon column="numero_completo" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600">#</th>
                <th className="p-3 font-semibold text-gray-600">Descripción</th>
                <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort("cliente")}>
                  <span className="flex items-center gap-1">Cliente <SortIcon column="cliente" /></span>
                </th>
                <th className="p-3 font-semibold text-gray-600 text-right">Cant</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Vr Unit</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Total</th>
                <th className="p-3 font-semibold text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    {items.length === 0 ? "No hay items registrados" : "No se encontraron items con esos filtros"}
                  </td>
                </tr>
              ) : (
                filtrados.map((it) => {
                  const prod = productos.find((p) => p.id === it.producto_id);
                  return (
                    <tr key={it.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{new Date(it.fecha_emision).toLocaleDateString("es-CO")}</td>
                      <td className="p-3 font-medium">{it.numero_completo}</td>
                      <td className="p-3 text-gray-600">{it.numero_linea}</td>
                      <td className="p-3 max-w-[200px] truncate" title={it.descripcion}>{it.descripcion}</td>
                      <td className="p-3">
                        <div className="text-sm">{it.cliente}</div>
                        <div className="text-xs text-gray-500">{it.nit_cliente}</div>
                      </td>
                      <td className="p-3 text-right">{Number(it.cantidad).toLocaleString("es-CO", { maximumFractionDigits: 0 })}</td>
                      <td className="p-3 text-right">{formatCurrency(Number(it.valor_unitario))}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(Number(it.valor_linea))}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1.5">
                          {puedeGestionarInventario && (
                            <button
                              onClick={() => abrirModalProducto(it)}
                              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                                it.producto_id
                                  ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                              title={it.producto_id ? `Producto: ${prod?.nombre || ""}` : "Asignar producto"}
                            >
                              Producto
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/financiero/factura/${it.venta_id}`)}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => navigate(`/financiero/ventas-items/${it.id}/gastos`)}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
                          >
                            Gastos
                          </button>
                          {!it.cufe && puedeCrearVenta && (
                            <button
                              onClick={() => navigate(`/financiero/nueva-venta/${it.venta_id}`)}
                              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            >
                              Editar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!guardandoProd) setModalItem(null); }}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {modalItem.producto_id ? "Cambiar producto" : "Asignar producto"}
            </h3>

            <div className="mb-4 text-sm text-gray-500 space-y-1">
              <p>Item: <span className="font-medium text-gray-800">{modalItem.descripcion}</span></p>
              <p>Venta: <span className="font-medium text-gray-800">{modalItem.numero_completo}</span> — {modalItem.cliente}</p>
              <p>Cantidad: <span className="font-medium text-gray-800">{Number(modalItem.cantidad).toLocaleString("es-CO")}</span></p>
            </div>

            {modalItem.producto_id && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-center justify-between">
                <span>
                  Producto actual: {productoNombre(modalItem)} {modalItem.consumido ? "(consumido)" : ""}
                </span>
              </div>
            )}

            <label className="block text-xs font-medium text-gray-500 mb-1">Producto</label>
            <input
              type="text"
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
              placeholder="Buscar producto por nombre o código..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              autoFocus
            />

            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg min-h-0 max-h-52">
              {(() => {
                const q = busquedaProducto.toLowerCase();
                const filtrados = !busquedaProducto
                  ? productos
                  : productos.filter((p) =>
                      p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
                    );
                return filtrados.length === 0 ? (
                  <p className="p-4 text-sm text-gray-400 text-center">No se encontraron productos</p>
                ) : (
                  filtrados.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProdSeleccionado(String(p.id))}
                      className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                        String(p.id) === prodSeleccionado ? "bg-blue-100 font-semibold" : ""
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        String(p.id) === prodSeleccionado ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      }`}>
                        {String(p.id) === prodSeleccionado && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="text-gray-500 font-mono text-xs">{p.codigo}</span>
                      <span className="text-gray-800">{p.nombre}</span>
                    </button>
                  ))
                );
              })()}
            </div>

            {prodSeleccionado && (() => {
              const sel = productos.find((p) => String(p.id) === prodSeleccionado);
              return sel ? (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  Seleccionado: <strong>{sel.codigo}</strong> — {sel.nombre}
                </div>
              ) : null;
            })()}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setModalItem(null)}
                disabled={guardandoProd}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarProducto}
                disabled={guardandoProd || !prodSeleccionado}
                className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {guardandoProd ? "Guardando..." : modalItem.consumido ? "Cambiar y consumir" : "Asignar y consumir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
