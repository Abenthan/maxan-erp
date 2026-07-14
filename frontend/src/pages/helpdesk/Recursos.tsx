import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../context/ApiContext";
import { usePermiso } from "../../context/AuthContext";
import { useHelpdesk } from "../../context/HelpdeskContext";
import { Link } from "react-router-dom";

interface Recurso {
  id: number;
  cliente_id: number;
  cliente_nombre: string;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
  procesador: string;
  memoria_gb: number;
  almacenamiento_gb: number;
  sistema_operativo: string;
  ubicacion: string;
  descripcion: string;
  activo: boolean;
}

interface Tercero {
  id: number;
  razon_social: string;
}

export default function Recursos() {
  const api = useApi();
  const { cliente } = useHelpdesk();
  const puedeGestionar = usePermiso("helpdesk.gestionar");
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [filtro, setFiltro] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const cargar = useCallback(async () => {
    const params = new URLSearchParams();
    if (filtro) params.set("q", filtro);
    if (filtroTipo) params.set("tipo", filtroTipo);
    if (cliente) params.set("cliente_id", String(cliente.id));
    const data = await api.get<Recurso[]>(`/helpdesk/recursos?${params}`);
    setRecursos(data);
  }, [api, filtro, filtroTipo, cliente]);

  useEffect(() => { cargar(); }, [cargar]);

  const tipos = ["Computador", "Hosting", "Office 365", "Red", "Celular", "Impresora", "Servidor", "UPS", "Cámara"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Recursos</h1>
        {puedeGestionar && (
          <Link to="/helpdesk/obtener-pc" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
            + Detectar PC
          </Link>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          className="border rounded-lg px-3 py-2 text-sm w-64"
          placeholder="Buscar por nombre, serial o marca..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        {cliente && <span className="text-sm text-gray-500 self-center">Cliente: <strong>{cliente.razon_social}</strong></span>}
        <select className="border rounded-lg px-3 py-2 text-sm" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-amber-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Cliente</th>
              <th className="text-left px-4 py-3 font-medium">Tipo</th>
              <th className="text-left px-4 py-3 font-medium">Marca</th>
              <th className="text-left px-4 py-3 font-medium">Modelo</th>
              <th className="text-left px-4 py-3 font-medium">Serial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recursos.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No hay recursos registrados</td></tr>
            )}
            {recursos.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/helpdesk/recursos/${r.id}`}>
                <td className="px-4 py-3 font-medium text-gray-800">{r.nombre}</td>
                <td className="px-4 py-3 text-gray-500">{r.cliente_nombre}</td>
                <td className="px-4 py-3">
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">{r.tipo}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{r.marca || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{r.modelo || "-"}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.serial || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
