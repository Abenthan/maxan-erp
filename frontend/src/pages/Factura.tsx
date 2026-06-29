import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";

interface FacturaDetalle {
  id: number;
  numero_completo: string;
  cufe: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  emisor: string;
  nit_emisor: string;
  receptor: string;
  nit_receptor: string;
  valor_a_pagar: string;
  estado: string;
  items: {
    id: number;
    numero_linea: number;
    descripcion: string;
    codigo_producto: string;
    cantidad: string;
    unidad_medida: string;
    valor_unitario: string;
    valor_linea: string;
  }[];
  impuestos: {
    id: number;
    tipo_impuesto: string;
    nombre_impuesto: string;
    porcentaje: string;
    base_gravable: string;
    valor: string;
  }[];
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  }).format(n);
}

export default function Factura() {
  const { id } = useParams();
  const api = useApi();
  const [factura, setFactura] = useState<FacturaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<FacturaDetalle>(`/facturas/${id}`)
      .then(setFactura)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [api, id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!factura) return null;

  return (
    <div className="max-w-4xl">
      <div className="mb-4">
        <Link to="/facturas" className="text-blue-600 hover:underline text-sm">&larr; Volver a facturas</Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{factura.emisor}</h2>
            <p className="text-sm text-gray-600">NIT {factura.nit_emisor}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">FACTURA ELECTRÓNICA DE VENTA</p>
            <p className="text-sm text-gray-600">No. {factura.numero_completo}</p>
            <p className="text-xs text-gray-500">
              CUFE: {factura.cufe ? factura.cufe.slice(0, 20) + "..." : "N/A"}
            </p>
          </div>
        </div>

        <div className="text-sm mb-6">
          <p><span className="font-semibold">Fecha de emisión:</span> {new Date(factura.fecha_emision).toLocaleDateString("es-CO")}</p>
          {factura.fecha_vencimiento && (
            <p><span className="font-semibold">Fecha de vencimiento:</span> {new Date(factura.fecha_vencimiento).toLocaleDateString("es-CO")}</p>
          )}
          <p>
            <span className="font-semibold">Estado: </span>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {factura.estado.replace("_", " ")}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="font-bold text-sm text-gray-700 mb-1">EMISOR</p>
            <p className="text-sm font-semibold">{factura.emisor}</p>
            <p className="text-xs text-gray-600">NIT {factura.nit_emisor}</p>
          </div>
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="font-bold text-sm text-gray-700 mb-1">RECEPTOR</p>
            <p className="text-sm font-semibold">{factura.receptor}</p>
            <p className="text-xs text-gray-600">NIT {factura.nit_receptor}</p>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Producto</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-center p-2">Und</th>
              <th className="text-right p-2">Cantidad</th>
              <th className="text-right p-2">Vr Unitario</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {factura.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.numero_linea}</td>
                <td className="p-2">{item.codigo_producto || "-"}</td>
                <td className="p-2">{item.descripcion}</td>
                <td className="text-center p-2">{item.unidad_medida}</td>
                <td className="text-right p-2">{item.cantidad}</td>
                <td className="text-right p-2">{formatCurrency(Number(item.valor_unitario))}</td>
                <td className="text-right p-2 font-medium">{formatCurrency(Number(item.valor_linea))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-72 space-y-1 text-sm">
            {factura.impuestos.map((imp) => (
              <div key={imp.id} className="flex justify-between text-gray-700">
                <span>{imp.nombre_impuesto || `Impuesto ${imp.tipo_impuesto}`} ({imp.porcentaje}%):</span>
                <span>{formatCurrency(Number(imp.valor))}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
              <span>TOTAL:</span>
              <span>{formatCurrency(Number(factura.valor_a_pagar))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
