import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { usePermiso } from "../context/AuthContext";
import * as XLSX from "xlsx";

interface IngresoInventario {
  id: number;
  producto_id: number;
  producto_nombre: string;
  producto_codigo: string;
  cantidad: string;
  costo_unitario: string;
  fecha: string;
  origen: string;
  referencia: string | null;
  created_at: string;
}

const ORIGEN_LABEL: Record<string, string> = {
  inicial: "Stock inicial",
  ajuste: "Ajuste",
  otro: "Otro",
};

const ORIGEN_COLOR: Record<string, string> = {
  inicial: "bg-emerald-100 text-emerald-700",
  ajuste: "bg-amber-100 text-amber-700",
  otro: "bg-gray-100 text-gray-600",
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function IngresosInventario() {
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("inventario.gestionar");

  const [ingresos, setIngresos] = useState<IngresoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [origenFiltro, setOrigenFiltro] = useState("");

  useEffect(() => {
    api.get<IngresoInventario[]>("/inventario/ingresos")
      .then(setIngresos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  const filtrados = useMemo(() => {
    let items = [...ingresos];
    if (busqueda) {
      const q = busqueda.toLowerCase();
      items = items.filter((i) =>
        i.producto_nombre.toLowerCase().includes(q) ||
        (i.referencia || "").toLowerCase().includes(q)
      );
    }
    if (origenFiltro) {
      items = items.filter((i) => i.origen === origenFiltro);
    }
    return items;
  }, [ingresos, busqueda, origenFiltro]);

  const totalCantidad = useMemo(
    () => filtrados.reduce((sum, i) => sum + parseFloat(i.cantidad), 0),
    [filtrados]
  );
  const totalCosto = useMemo(
    () => filtrados.reduce((sum, i) => sum + parseFloat(i.cantidad) * parseFloat(i.costo_unitario), 0),
    [filtrados]
  );

  function exportarExcel() {
    const data = filtrados.map((i) => ({
      Fecha: i.fecha,
      Origen: ORIGEN_LABEL[i.origen] || i.origen,
      Producto: i.producto_nombre,
      Código: i.producto_codigo,
      Cantidad: parseFloat(i.cantidad),
      "Costo Unitario": parseFloat(i.costo_unitario),
      Total: parseFloat(i.cantidad) * parseFloat(i.costo_unitario),
      Referencia: i.referencia || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingresos de Inventario");
    XLSX.writeFile(wb, "ingresos-inventario.xlsx");
  }

  if (loading) return <p className="text-gray-500">Cargando ingresos de inventario...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ingresos de Inventario</h1>
        <div className="flex gap-2">
          <button
            onClick={exportarExcel}
            disabled={filtrados.length === 0}
            className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
          >
            Exportar a Excel
          </button>
          {puedeGestionar && (
            <button
              onClick={() => navigate("/inventario/ingresos/nuevo")}
              className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              + Nuevo Ingreso
            </button>
          )}
        </div>
      </div>

      {ingresos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-2xl mb-2">📥</p>
          <p className="text-gray-500 mb-4">
            No hay ingresos manuales de inventario registrados.
            <br />
            Aquí se alimenta el stock sin necesidad de compra (stock inicial, ajustes, etc.).
          </p>
          {puedeGestionar && (
            <button
              onClick={() => navigate("/inventario/ingresos/nuevo")}
              className="px-5 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              + Registrar primer ingreso
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-500 mb-1">Buscar producto</label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre del producto o referencia..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Origen</label>
                <select
                  value={origenFiltro}
                  onChange={(e) => setOrigenFiltro(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Todos</option>
                  <option value="inicial">Stock inicial</option>
                  <option value="ajuste">Ajuste</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="flex gap-5 text-sm pb-2">
                <div>
                  <span className="text-gray-400">Cantidad total: </span>
                  <span className="font-semibold">{totalCantidad.toLocaleString("es-CO")}</span>
                </div>
                <div>
                  <span className="text-gray-400">Valor total: </span>
                  <span className="font-semibold">{formatCurrency(totalCosto)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="p-3 font-semibold text-gray-600">Fecha</th>
                  <th className="p-3 font-semibold text-gray-600">Origen</th>
                  <th className="p-3 font-semibold text-gray-600">Producto</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Cantidad</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Costo Unit.</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Total</th>
                  <th className="p-3 font-semibold text-gray-600">Referencia</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((i) => (
                  <tr key={i.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600 whitespace-nowrap">
                      {new Date(i.fecha).toLocaleDateString("es-CO")}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ORIGEN_COLOR[i.origen] || ORIGEN_COLOR.otro}`}>
                        {ORIGEN_LABEL[i.origen] || i.origen}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{i.producto_nombre}</td>
                    <td className="p-3 text-right">{parseFloat(i.cantidad).toLocaleString("es-CO")}</td>
                    <td className="p-3 text-right">{formatCurrency(parseFloat(i.costo_unitario))}</td>
                    <td className="p-3 text-right font-semibold">
                      {formatCurrency(parseFloat(i.cantidad) * parseFloat(i.costo_unitario))}
                    </td>
                    <td className="p-3 text-gray-600">{i.referencia || "-"}</td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No se encontraron ingresos con esos filtros
                    </td>
                  </tr>
                )}
              </tbody>
              {filtrados.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="p-3 text-gray-700">Totales</td>
                    <td className="p-3 text-right text-gray-700">{totalCantidad.toLocaleString("es-CO")}</td>
                    <td colSpan={1}></td>
                    <td className="p-3 text-right text-gray-900">{formatCurrency(totalCosto)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </>
      )}
    </div>
  );
}