import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  inventariable: boolean;
}

interface Linea {
  producto_id: string;
  search_text: string;
  cantidad: string;
  costo_unitario: string;
}

interface EntradaCreada {
  id: number;
  producto_id: number;
  cantidad: string;
  costo_unitario: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function NuevoIngresoInventario() {
  const navigate = useNavigate();
  const api = useApi();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [origen, setOrigen] = useState("inicial");
  const [referencia, setReferencia] = useState("");
  const [lineas, setLineas] = useState<Linea[]>([{ producto_id: "", search_text: "", cantidad: "1", costo_unitario: "" }]);
  const [activeSearchIdx, setActiveSearchIdx] = useState<number | null>(null);

  const searchRefs = useRef<(HTMLInputElement | null)[]>([]);

  const productosInventariables = useMemo(
    () => productos.filter((p) => p.inventariable),
    [productos]
  );

  const productoLabel = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of productos) m[String(p.id)] = `${p.codigo} — ${p.nombre}`;
    return m;
  }, [productos]);

  useEffect(() => {
    api.get<Producto[]>("/productos")
      .then(setProductos)
      .catch((e) => setError(e.message))
      .finally(() => setCargandoProductos(false));
  }, [api]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-search-dropdown]") && !target.closest("[data-search-input]")) {
        setActiveSearchIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const resultadosBusqueda = useMemo(() => {
    if (activeSearchIdx === null) return [];
    const q = lineas[activeSearchIdx].search_text.trim().toLowerCase();
    if (!q) return [];
    return productosInventariables
      .filter((p) => p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q))
      .slice(0, 10);
  }, [activeSearchIdx, lineas, productosInventariables]);

  const totalCalculado = useMemo(
    () => lineas.reduce((sum, l) => sum + (parseFloat(l.cantidad) || 0) * (parseFloat(l.costo_unitario) || 0), 0),
    [lineas]
  );

  function actualizarLinea(idx: number, campo: keyof Linea, valor: string) {
    setLineas((prev) => prev.map((l, i) => (i === idx ? { ...l, [campo]: valor } : l)));
  }

  function seleccionarProducto(idx: number, p: Producto) {
    setLineas((prev) => prev.map((l, i) =>
      i === idx ? { ...l, producto_id: String(p.id), search_text: "" } : l
    ));
  }

  function limpiarProducto(idx: number) {
    setLineas((prev) => prev.map((l, i) =>
      i === idx ? { ...l, producto_id: "", search_text: "" } : l
    ));
  }

  function agregarLinea() {
    setLineas((prev) => [...prev, { producto_id: "", search_text: "", cantidad: "1", costo_unitario: "" }]);
  }

  function quitarLinea(idx: number) {
    setLineas((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  }

  async function guardar() {
    if (cargandoProductos) return;
    setError("");

    if (lineas.length === 0) {
      setError("Debe agregar al menos un producto.");
      return;
    }
    for (const l of lineas) {
      if (!l.producto_id) {
        setError("Seleccione el producto en todas las líneas.");
        return;
      }
      if (!l.cantidad || parseFloat(l.cantidad) <= 0) {
        setError("La cantidad debe ser mayor a 0 en todas las líneas.");
        return;
      }
      const costo = l.costo_unitario.trim() === "" ? 0 : parseFloat(l.costo_unitario);
      if (isNaN(costo) || costo < 0) {
        setError("El costo unitario no puede ser negativo.");
        return;
      }
    }

    setGuardando(true);
    try {
      const items = lineas.map((l) => {
        const costo = l.costo_unitario.trim() === "" ? 0 : parseFloat(l.costo_unitario);
        return {
          producto_id: parseInt(l.producto_id, 10),
          cantidad: parseFloat(l.cantidad),
          costo_unitario: costo,
        };
      });
      await api.post<{ success: boolean; entradas: EntradaCreada[] }>("/inventario/entradas", {
        items,
        fecha,
        origen,
        referencia: referencia.trim() || null,
      });
      navigate("/inventario/ingresos");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Nuevo Ingreso de Inventario</h1>
      <p className="text-sm text-gray-500 mb-6">
        Registra stock sin pasar por una compra: stock inicial, ajustes por conteo, devoluciones, etc.
      </p>

      {cargandoProductos ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            guardar();
          }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Origen del ingreso</label>
                <select
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="inicial">Stock inicial</option>
                  <option value="ajuste">Ajuste</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Referencia / Observación</label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej: Carga inicial 2026, ajuste por conteo..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Productos</h2>
              <button
                type="button"
                onClick={agregarLinea}
                className="ml-auto px-3 py-1.5 text-sm rounded-lg border border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50"
              >
                + Agregar línea
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="p-2 font-semibold text-gray-600 w-1/2">Producto</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-28">Cantidad</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-40">Costo Unit.</th>
                    <th className="p-2 font-semibold text-gray-600 text-right">Total</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.map((l, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-1">
                        {l.producto_id ? (
                          <div className="flex items-center gap-1">
                            <span className="flex-1 px-2 py-1.5 text-sm bg-emerald-50 rounded-lg border border-emerald-200 truncate">
                              {productoLabel[l.producto_id]}
                            </span>
                            <button
                              type="button"
                              onClick={() => limpiarProducto(idx)}
                              className="text-gray-400 hover:text-red-500 text-lg leading-none px-1"
                              title="Cambiar producto"
                            >
                              ↺
                            </button>
                          </div>
                        ) : (
                          <input
                            ref={(el) => { searchRefs.current[idx] = el; }}
                            type="text"
                            value={l.search_text}
                            data-search-input
                            onFocus={() => { if (l.search_text.trim()) setActiveSearchIdx(idx); }}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLineas((prev) => prev.map((li, i) => (i === idx ? { ...li, search_text: val } : li)));
                              setActiveSearchIdx(idx);
                            }}
                            placeholder="Buscar producto por nombre o código..."
                            autoComplete="off"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        )}
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={l.cantidad}
                          onChange={(e) => actualizarLinea(idx, "cantidad", e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={l.costo_unitario}
                          onChange={(e) => actualizarLinea(idx, "costo_unitario", e.target.value)}
                          placeholder="0"
                          title="Déjalo en 0 si el producto no tuvo costo (ej. regalo)"
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-1 text-right font-medium whitespace-nowrap">
                        {formatCurrency((parseFloat(l.cantidad) || 0) * (parseFloat(l.costo_unitario) || 0))}
                      </td>
                      <td className="p-1 text-right">
                        {lineas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => quitarLinea(idx)}
                            className="text-xs text-red-600 hover:text-red-800"
                            title="Quitar línea"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t pt-3 w-64">
                <span>Total:</span>
                <span>{formatCurrency(totalCalculado)}</span>
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/inventario/ingresos")}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar Ingreso"}
            </button>
          </div>
        </form>
      )}

      {activeSearchIdx !== null && resultadosBusqueda.length > 0 && (
        <DropdownPortal
          inputEl={searchRefs.current[activeSearchIdx]}
          items={resultadosBusqueda}
          onSelect={(p) => {
            seleccionarProducto(activeSearchIdx, p);
            setActiveSearchIdx(null);
          }}
        />
      )}
    </div>
  );
}

function DropdownPortal({ inputEl, items, onSelect }: {
  inputEl: HTMLInputElement | null;
  items: Producto[];
  onSelect: (p: Producto) => void;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!inputEl) return;
    const rect = inputEl.getBoundingClientRect();
    setStyle({
      position: "fixed",
      left: rect.left + "px",
      top: rect.bottom + 4 + "px",
      width: rect.width + "px",
      zIndex: 9999,
    });
  }, [inputEl]);

  if (!inputEl) return null;

  return createPortal(
    <div
      data-search-dropdown
      style={style}
      className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
    >
      {items.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p)}
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-emerald-50 border-b border-gray-100 last:border-0"
        >
          <span className="font-medium">[{p.codigo}]</span> {p.nombre}
        </button>
      ))}
    </div>,
    document.body
  );
}