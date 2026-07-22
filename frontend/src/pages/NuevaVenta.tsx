import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string | null;
  inventariable: boolean;
  unidad_medida: string;
}

interface ItemLinea {
  producto_id: number | null;
  codigoInput: string;
  searchText: string;
  codigo: string;
  nombre: string;
  cantidad: string;
  valor_unitario: string;
  inventariable: boolean;
}

interface ClienteResult {
  id: number;
  tipo_documento: string | null;
  numero_documento: string | null;
  razon_social: string;
  direccion: string;
  ciudad: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 }).format(n);
}

export default function NuevaVenta() {
  const navigate = useNavigate();
  const api = useApi();
  const { id } = useParams();
  const clienteRef = useRef<HTMLDivElement>(null);
  const obsRef = useRef<HTMLTextAreaElement>(null);

  const [cliente, setCliente] = useState("Ventas sin factura");
  const [nit, setNit] = useState("123456789");
  const [tipoDoc, setTipoDoc] = useState("13");
  const [dir, setDir] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [sugerencias, setSugerencias] = useState<ClienteResult[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(!!id);

  const editandoId = id ? Number(id) : null;

  useEffect(() => {
    obsRef.current?.focus();
  }, []);

  useEffect(() => {
    if (editandoId) {
      Promise.all([
        api.get<{
          id: number; fecha_emision: string; observaciones: string; cufe: string | null;
          razon_social: string; numero_documento: string; tipo_documento: string;
          direccion: string; ciudad: string;
          items: { id: number; producto_id: number | null; descripcion: string; codigo_producto: string; cantidad: string; valor_unitario: string; inventariable: boolean; numero_linea: number }[];
        }>(`/ventas/${editandoId}`),
        api.get<Product[]>("/productos"),
      ])
        .then(([data, prods]) => {
          setProductos(prods);
          setCliente(data.razon_social);
          setNit(data.numero_documento ?? "");
          setTipoDoc(normalizarTipoDoc(data.tipo_documento, data.numero_documento));
          setDir(data.direccion || "");
          setCiudad(data.ciudad || "");
          setFecha(data.fecha_emision ? data.fecha_emision.slice(0, 10) : "");
          setObservaciones(data.observaciones || "");
          if (data.items && data.items.length > 0) {
            setLineas(data.items.map((it) => {
              prods.find((pr) => pr.id === it.producto_id);
              return {
                producto_id: it.producto_id,
                codigoInput: it.codigo_producto || "",
                searchText: it.producto_id ? `[${it.codigo_producto}] ${it.descripcion}` : "",
                codigo: it.codigo_producto || "",
                nombre: it.descripcion,
                cantidad: it.cantidad,
                valor_unitario: it.valor_unitario,
                inventariable: it.inventariable || false,
              };
            }));
          }
          setCargandoDatos(false);
        })
        .catch(() => {
          setError("Error al cargar la venta");
          setCargandoDatos(false);
        });
    } else {
      api.get<Product[]>("/productos").then(setProductos).catch(() => {});
      setCargandoDatos(false);
    }
  }, [api, editandoId]);

  const [lineas, setLineas] = useState<ItemLinea[]>([
    { producto_id: null, codigoInput: "", searchText: "", codigo: "", nombre: "", cantidad: "1", valor_unitario: "", inventariable: false },
  ]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    if (cliente.length < 2) { setSugerencias([]); setMostrarSugerencias(false); return; }
    setBuscando(true);
    const timer = setTimeout(() => {
      api.get<ClienteResult[]>(`/terceros?tipo=cliente&q=${encodeURIComponent(cliente)}`)
        .then((res) => { setSugerencias(res); setMostrarSugerencias(res.length > 0); })
        .catch(() => {})
        .finally(() => setBuscando(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [api, cliente]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (clienteRef.current && !clienteRef.current.contains(e.target as Node)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function normalizarTipoDoc(td: string | null, nd: string | null): string {
    const valido = td === "13" || td === "31";
    if (valido) return td;
    if (nd && nd.trim()) return "31";
    return "";
  }

  function seleccionarCliente(c: ClienteResult) {
    setCliente(c.razon_social);
    setNit(c.numero_documento ?? "");
    setTipoDoc(normalizarTipoDoc(c.tipo_documento, c.numero_documento));
    setDir(c.direccion || "");
    setCiudad(c.ciudad || "");
    setMostrarSugerencias(false);
  }

  function seleccionarProducto(idx: number, p: Product) {
    setLineas((prev) => {
      const copia = [...prev];
      copia[idx] = {
        producto_id: p.id,
        codigoInput: p.codigo,
        searchText: `[${p.codigo}] ${p.nombre}`,
        codigo: p.codigo,
        nombre: p.nombre,
        cantidad: copia[idx].cantidad || "1",
        valor_unitario: copia[idx].valor_unitario,
        inventariable: p.inventariable,
      };
      return copia;
    });
  }

  function limpiarProducto(idx: number) {
    setLineas((prev) => {
      const copia = [...prev];
      copia[idx] = {
        producto_id: null,
        codigoInput: "",
        searchText: "",
        codigo: "",
        nombre: "",
        cantidad: "1",
        valor_unitario: copia[idx].valor_unitario,
        inventariable: false,
      };
      return copia;
    });
  }

  function actualizarLinea(idx: number, campo: Exclude<keyof ItemLinea, "producto_id" | "codigo" | "nombre" | "inventariable">, valor: string) {
    setLineas((prev) => {
      const copia = [...prev];
      (copia[idx] as any)[campo] = valor;
      return copia;
    });
  }

  function agregarLinea() {
    setLineas((prev) => [...prev, { producto_id: null, codigoInput: "", searchText: "", codigo: "", nombre: "", cantidad: "1", valor_unitario: "", inventariable: false }]);
  }

  function eliminarLinea(idx: number) {
    if (lineas.length <= 1) return;
    setLineas((prev) => prev.filter((_, i) => i !== idx));
  }

  function buscarPorCodigo(idx: number) {
    setLineas((prev) => {
      const linea = prev[idx];
      const cod = linea.codigoInput.trim();
      if (!cod) return prev;
      const p = productos.find(
        (prod) => prod.codigo.toLowerCase() === cod.toLowerCase()
      );
      const copia = [...prev];
      if (p) {
        copia[idx] = {
          producto_id: p.id,
          codigoInput: p.codigo,
          searchText: `[${p.codigo}] ${p.nombre}`,
          codigo: p.codigo,
          nombre: p.nombre,
          cantidad: copia[idx].cantidad || "1",
          valor_unitario: copia[idx].valor_unitario,
          inventariable: p.inventariable,
        };
      } else if (linea.producto_id) {
        copia[idx] = {
          producto_id: null,
          codigoInput: cod,
          searchText: "",
          codigo: "",
          nombre: "",
          cantidad: "1",
          valor_unitario: copia[idx].valor_unitario,
          inventariable: false,
        };
      }
      return copia;
    });
  }

  const searchRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeSearchIdx, setActiveSearchIdx] = useState<number | null>(null);

  const resultadosProductos = useMemo(() => {
    if (activeSearchIdx === null) return { idx: -1, items: [] as Product[] };
    const linea = lineas[activeSearchIdx];
    if (!linea || linea.producto_id || !linea.searchText.trim()) return { idx: -1, items: [] };
    const q = linea.searchText.toLowerCase();
    return {
      idx: activeSearchIdx,
      items: productos.filter(
        (p) => p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q)
      ).slice(0, 10),
    };
  }, [lineas, productos, activeSearchIdx]);

  useEffect(() => {
    if (resultadosProductos.items.length === 0) setActiveSearchIdx(null);
  }, [resultadosProductos]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-search-dropdown]") &&
          !target.closest("[data-search-input]")) {
        setActiveSearchIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);



  const total = lineas.reduce((s, l) => {
    const cant = parseFloat(l.cantidad) || 0;
    const vr = parseFloat(l.valor_unitario) || 0;
    return s + cant * vr;
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente.trim()) return;
    if (tipoDoc && !nit.trim()) return;
    if (!lineas.some((l) => l.producto_id && l.valor_unitario)) return;

    setGuardando(true);
    setError("");
    try {
      const body = {
        receptor: {
          tipo_documento: tipoDoc,
          numero_documento: nit.trim(),
          razon_social: cliente.trim(),
          direccion: dir.trim() || undefined,
          ciudad: ciudad.trim() || undefined,
        },
        fecha_emision: fecha,
        observaciones: observaciones.trim() || undefined,
        items: lineas
          .filter((l) => l.producto_id && l.valor_unitario)
          .map((l) => {
            const cant = parseFloat(l.cantidad) || 1;
            const vr = parseFloat(l.valor_unitario) || 0;
            return {
              producto_id: l.producto_id!,
              descripcion: l.nombre,
              codigo_producto: l.codigo,
              cantidad: cant,
              valor_unitario: vr,
              valor_linea: cant * vr,
            };
          }),
      };

      const result = editandoId
        ? await api.put<{ success: boolean; venta_id: number; total: number; items: { id: number; producto_id: number; cantidad: number }[] }>(`/ventas/${editandoId}`, body)
        : await api.post<{ success: boolean; venta_id: number; numero: string; total: number; items: { id: number; producto_id: number; cantidad: number }[] }>("/ventas", body);

      const erroresConsumo: string[] = [];
      if (!editandoId) {
        const itemsInventariables = (result.items || []).filter(
          (it) => lineas.find((l) => l.producto_id === it.producto_id)?.inventariable
        );
        for (const item of itemsInventariables) {
          const linea = lineas.find((l) => l.producto_id === item.producto_id);
          if (!linea) continue;
          try {
            await api.post("/inventario/consumir", {
              factura_item_id: item.id,
              producto_id: item.producto_id,
              cantidad: item.cantidad,
            });
          } catch (e: unknown) {
            const msg = (e as any)?.response?.data?.error
              ?? (e instanceof Error ? e.message : "Error al consumir inventario");
            erroresConsumo.push(`${linea.nombre}: ${msg}`);
          }
        }
      }

      setExito(
        (editandoId ? "Venta actualizada" : "Venta registrada") +
        (erroresConsumo.length > 0 ? " (con errores de inventario)" : "")
      );
      if (erroresConsumo.length > 0) {
        setError("Error al consumir inventario:\n" + erroresConsumo.join("\n"));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{editandoId ? "Editar Venta (sin factura)" : "Nueva Venta (sin factura)"}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}
      {cargandoDatos && (
        <div className="text-center py-12 text-gray-500">Cargando datos de la venta...</div>
      )}

      {exito && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700 flex items-center justify-between">
          <span>{exito}</span>
          <button
            onClick={() => navigate("/financiero/ventas-items")}
            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700"
          >
            Ver items
          </button>
        </div>
      )}

      {!exito && !cargandoDatos && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cliente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo doc.</label>
                <select
                  value={tipoDoc}
                  onChange={(e) => { setTipoDoc(e.target.value); if (e.target.value === "") setNit(""); }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Sin documento</option>
                  <option value="13">Cédula (CC)</option>
                  <option value="31">NIT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">NIT / CC {tipoDoc ? "*" : ""}</label>
                <input
                  type="text"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  required={!!tipoDoc}
                  placeholder={tipoDoc ? "123456789" : ""}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="lg:col-span-2 relative" ref={clienteRef}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cliente *</label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => { setCliente(e.target.value); setNit(""); setDir(""); setCiudad(""); }}
                  required
                  placeholder="Nombre o razón social"
                  autoComplete="off"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {mostrarSugerencias && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {buscando && <p className="p-2 text-xs text-gray-400">Buscando...</p>}
                    {sugerencias.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => seleccionarCliente(c)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium">{c.razon_social}</span>
                        <span className="text-gray-500 ml-2 text-xs">{c.numero_documento}</span>
                        {(c.direccion || c.ciudad) && (
                          <span className="text-gray-400 ml-2 text-xs">· {c.direccion}{c.direccion && c.ciudad ? ", " : ""}{c.ciudad}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dirección</label>
                <input
                  type="text"
                  value={dir}
                  onChange={(e) => setDir(e.target.value)}
                  placeholder="Cra 1 # 2-3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Bogotá"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha *</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Observaciones</label>
              <textarea
                ref={obsRef}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Nombre del cliente u otros datos"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Items</h2>
              <button
                type="button"
                onClick={agregarLinea}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                + Agregar línea
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="p-2 font-semibold text-gray-600 w-24">Código</th>
                    <th className="p-2 font-semibold text-gray-600 w-2/5">Producto</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-16">Cant</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-28">Vr Unitario</th>
                    <th className="p-2 font-semibold text-gray-600 text-right w-28">Total</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.map((l, idx) => {
                    const cant = parseFloat(l.cantidad) || 0;
                    const vr = parseFloat(l.valor_unitario) || 0;
                    return (
                      <tr key={idx} className="border-b">
                        <td className="p-1">
                          <input
                            type="text"
                            value={l.codigoInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLineas((prev) => {
                                const copia = [...prev];
                                copia[idx] = { ...copia[idx], codigoInput: val };
                                return copia;
                              });
                            }}
                            onBlur={() => buscarPorCodigo(idx)}
                            placeholder="Código"
                            autoComplete="off"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-1 relative">
                          {l.producto_id ? (
                            <div className="flex items-center gap-1">
                              <span className="flex-1 px-2 py-1.5 text-sm bg-gray-50 rounded border border-gray-200 truncate">
                                {l.nombre}
                                {l.inventariable && <span className="ml-2 text-xs text-emerald-600">· Inventariable</span>}
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
                            <>
                              <input
                                ref={(el) => { searchRefs.current[idx] = el; }}
                                type="text"
                                value={l.searchText}
                                data-search-input
                                onFocus={() => { if (l.searchText.trim()) setActiveSearchIdx(idx); }}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setLineas((prev) => {
                                    const copia = [...prev];
                                    copia[idx] = { ...copia[idx], searchText: val };
                                    return copia;
                                  });
                                  setActiveSearchIdx(idx);
                                }}
                                placeholder="Buscar producto..."
                                autoComplete="off"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </>
                          )}
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            value={l.cantidad}
                            onChange={(e) => actualizarLinea(idx, "cantidad", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            value={l.valor_unitario}
                            onChange={(e) => actualizarLinea(idx, "valor_unitario", e.target.value)}
                            placeholder="0"
                            required
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-1 text-right font-medium align-middle">
                          {formatCurrency(cant * vr)}
                        </td>
                        <td className="p-1 text-center">
                          {lineas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => eliminarLinea(idx)}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                              title="Eliminar"
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <div className="w-56 space-y-1 text-sm">
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-between items-center">
            <div>
              {editandoId && (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="px-4 py-2 text-sm rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                >
                  Eliminar venta
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando || !cliente.trim() || (tipoDoc && !(nit ?? "").trim()) || total <= 0}
                className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {guardando ? (editandoId ? "Actualizando..." : "Guardando...") : (editandoId ? "Actualizar Venta" : "Guardar Venta")}
              </button>
            </div>
          </div>
        </form>
      )}

      {activeSearchIdx !== null && resultadosProductos.items.length > 0 && (
        <DropdownPortal
          inputEl={searchRefs.current[resultadosProductos.idx]}
          items={resultadosProductos.items}
          onSelect={(p) => {
            seleccionarProducto(resultadosProductos.idx, p);
            setActiveSearchIdx(null);
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!eliminando) setDeleteConfirm(false); }}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Eliminar venta</h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de eliminar esta venta y todos sus items?<br />
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={eliminando}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!editandoId) return;
                  setEliminando(true);
                  try {
                    await api.del(`/ventas/${editandoId}`);
                    navigate("/financiero/facturas");
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : "Error al eliminar");
                    setDeleteConfirm(false);
                    setEliminando(false);
                  }
                }}
                disabled={eliminando}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownPortal({ inputEl, items, onSelect }: {
  inputEl: HTMLInputElement | null;
  items: Product[];
  onSelect: (p: Product) => void;
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
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
        >
          <span className="font-medium">[{p.codigo}]</span> {p.nombre}
          {p.inventariable && <span className="ml-2 text-xs text-emerald-600">· Inv</span>}
        </button>
      ))}
    </div>,
    document.body
  );
}
