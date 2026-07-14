import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";

interface Tercero {
  id: number;
  razon_social: string;
  numero_documento: string;
  tipo_documento: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
}

interface Recurso {
  id: number;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
  procesador: string;
  memoria_gb: number;
  almacenamiento_gb: number;
  sistema_operativo: string;
}

export default function ClienteDetalle() {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const puedeGestionar = usePermiso("helpdesk.gestionar");
  const [cliente, setCliente] = useState<Tercero | null>(null);
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  useEffect(() => {
    if (!id) return;
    api.get<Tercero>(`/terceros/${id}`).then(setCliente);
    api.get<Recurso[]>(`/helpdesk/recursos?cliente_id=${id}`).then(setRecursos);
  }, [api, id]);

  if (!cliente) return <div className="text-gray-400 p-8 text-center">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/helpdesk" className="text-sm text-gray-400 hover:text-gray-600 inline-block">← Todos los clientes</Link>

      <div className="bg-white border rounded-xl p-5">
        <h1 className="text-2xl font-bold text-gray-800">{cliente.razon_social}</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
          <div>
            <span className="text-xs text-gray-400">Documento</span>
            <p className="font-medium text-gray-700">{cliente.tipo_documento} {cliente.numero_documento}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">Teléfono</span>
            <p className="font-medium text-gray-700">{cliente.telefono || "-"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">Ciudad</span>
            <p className="font-medium text-gray-700">{cliente.ciudad || "-"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">Email</span>
            <p className="font-medium text-gray-700">{cliente.email || "-"}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          Recursos Informáticos
          <span className="text-sm font-normal text-gray-400 ml-2">({recursos.length})</span>
        </h2>
        {puedeGestionar && (
          <Link
            to={`/helpdesk/obtener-pc?cliente=${cliente.id}&nombre=${encodeURIComponent(cliente.razon_social)}`}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700"
          >+ Nuevo equipo</Link>
        )}
      </div>

      {recursos.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
          Este cliente no tiene recursos informáticos registrados
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 font-medium">Marca</th>
                <th className="text-left px-4 py-3 font-medium">Modelo</th>
                <th className="text-left px-4 py-3 font-medium">Serial</th>
                <th className="text-left px-4 py-3 font-medium">Especificaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recursos.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/helpdesk/recursos/${r.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{r.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">{r.tipo}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.marca || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{r.modelo || "-"}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.serial || "-"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {[r.procesador, r.memoria_gb ? `${r.memoria_gb}GB RAM` : "", r.almacenamiento_gb ? `${r.almacenamiento_gb}GB` : ""].filter(Boolean).join(" | ") || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
