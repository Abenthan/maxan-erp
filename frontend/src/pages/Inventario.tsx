import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface StockItem {
  producto_id: number;
  nombre: string;
  categoria: string;
  stock_actual: string;
}

export default function Inventario() {
  const api = useApi();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<StockItem[]>("/inventario/stock")
      .then(setStock)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  if (loading) return <p className="text-gray-500">Cargando inventario...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventario</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600">Producto</th>
              <th className="p-3 font-semibold text-gray-600">Categoría</th>
              <th className="p-3 font-semibold text-gray-600 text-right">Stock Actual</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((s) => (
              <tr key={s.producto_id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/inventario/movimientos?producto_id=${s.producto_id}&nombre=${encodeURIComponent(s.nombre)}`)}>
                <td className="p-3 font-medium">{s.nombre}</td>
                <td className="p-3 text-gray-600">{s.categoria || "-"}</td>
                <td className={`p-3 text-right font-bold ${Number(s.stock_actual) > 0 ? "text-green-600" : "text-red-600"}`}>
                  {Number(s.stock_actual).toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
            {stock.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">No hay productos en inventario</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
