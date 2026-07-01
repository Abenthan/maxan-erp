import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface Producto {
  id: number;
  nombre: string;
}

interface Movimiento {
  id: number;
  cantidad: string;
  cantidad_disponible?: string;
  costo_unitario: string;
  fecha: string;
  descripcion: string;
  tipo: string;
}

interface MovimientosData {
  entradas: Movimiento[];
  salidas: Movimiento[];
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 }).format(n);
}

export default function MovimientosInventario() {
  const api = useApi();
  const [searchParams] = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoId, setProductoId] = useState(searchParams.get("producto_id") || "");
  const [data, setData] = useState<MovimientosData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Producto[]>("/productos")
      .then(setProductos)
      .catch(() => {});
  }, [api]);

  useEffect(() => {
    if (!productoId) { setData(null); return; }
    setLoading(true);
    setError("");
    api.get<MovimientosData>(`/inventario/movimientos/${productoId}`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, productoId]);

  const prodName = productos.find((p) => String(p.id) === productoId)?.nombre || "";

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Movimientos de Inventario</h1>

      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-500 mb-1">Producto</label>
        <select
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="">Seleccione un producto...</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">Cargando movimientos...</p>}

      {data && !loading && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">Entradas &mdash; {prodName}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-semibold text-gray-600">#</th>
                    <th className="p-2 font-semibold text-gray-600">Descripción</th>
                    <th className="p-2 font-semibold text-gray-600 text-right">Cantidad</th>
                    <th className="p-2 font-semibold text-gray-600 text-right">Disponible</th>
                    <th className="p-2 font-semibold text-gray-600 text-right">Costo Unit.</th>
                    <th className="p-2 font-semibold text-gray-600">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.entradas.map((e) => (
                    <tr key={e.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-gray-500">{e.id}</td>
                      <td className="p-2 font-medium">{e.descripcion}</td>
                      <td className="p-2 text-right">{parseFloat(e.cantidad).toLocaleString("es-CO")}</td>
                      <td className="p-2 text-right">{parseFloat(e.cantidad_disponible || "0").toLocaleString("es-CO")}</td>
                      <td className="p-2 text-right">{formatCurrency(parseFloat(e.costo_unitario))}</td>
                      <td className="p-2 text-gray-600">{new Date(e.fecha).toLocaleDateString("es-CO")}</td>
                    </tr>
                  ))}
                  {data.entradas.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-gray-400">Sin entradas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">Salidas &mdash; {prodName}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-semibold text-gray-600">#</th>
                    <th className="p-2 font-semibold text-gray-600">Descripción</th>
                    <th className="p-2 font-semibold text-gray-600 text-right">Cantidad</th>
                    <th className="p-2 font-semibold text-gray-600 text-right">Costo Unit.</th>
                    <th className="p-2 font-semibold text-gray-600">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salidas.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-gray-500">{s.id}</td>
                      <td className="p-2 font-medium">{s.descripcion}</td>
                      <td className="p-2 text-right">{parseFloat(s.cantidad).toLocaleString("es-CO")}</td>
                      <td className="p-2 text-right">{formatCurrency(parseFloat(s.costo_unitario))}</td>
                      <td className="p-2 text-gray-600">{new Date(s.fecha).toLocaleDateString("es-CO")}</td>
                    </tr>
                  ))}
                  {data.salidas.length === 0 && (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-400">Sin salidas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
