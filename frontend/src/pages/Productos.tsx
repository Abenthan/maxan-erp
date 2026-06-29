import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  inventariable: boolean;
  unidad_medida: string;
}

export default function Productos() {
  const api = useApi();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Producto[]>("/productos")
      .then(setProductos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  if (loading) return <p className="text-gray-500">Cargando productos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Productos</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="p-3 font-semibold text-gray-600">Nombre</th>
              <th className="p-3 font-semibold text-gray-600">Categoría</th>
              <th className="p-3 font-semibold text-gray-600">U. Medida</th>
              <th className="p-3 font-semibold text-gray-600">Inventariable</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{p.nombre}</td>
                <td className="p-3 text-gray-600">{p.categoria || "-"}</td>
                <td className="p-3 text-gray-600">{p.unidad_medida}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${p.inventariable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {p.inventariable ? "Sí" : "No"}
                  </span>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">No hay productos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
