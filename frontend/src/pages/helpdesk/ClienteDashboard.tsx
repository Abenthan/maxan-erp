import { useNavigate } from "react-router-dom";
import { useHelpdesk } from "../../context/HelpdeskContext";
import { usePermiso } from "../../context/AuthContext";

export default function ClienteDashboard() {
  const { cliente } = useHelpdesk();
  const navigate = useNavigate();
  const puedeCasos = usePermiso("helpdesk.casos.ver");
  const puedeRecursos = usePermiso("helpdesk.ver");
  const puedeMantenimientos = usePermiso("helpdesk.ver");

  const cards = [
    ...(puedeCasos ? [{
      titulo: "Casos",
      descripcion: "Gestionar casos de soporte del cliente",
      ruta: "/helpdesk/casos",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      icono: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    }] : []),
    ...(puedeRecursos ? [{
      titulo: "Recursos",
      descripcion: "Equipos informáticos y dispositivos del cliente",
      ruta: "/helpdesk/recursos",
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
      icono: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    }] : []),
    ...(puedeMantenimientos ? [{
      titulo: "Mantenimientos",
      descripcion: "Historial de mantenimientos realizados",
      ruta: "/helpdesk/mantenimientos",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      icono: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    }] : []),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {cliente && (
        <div className="bg-white border rounded-xl p-5">
          <h1 className="text-2xl font-bold text-gray-800">{cliente.razon_social}</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 text-sm">
            <div>
              <span className="text-xs text-gray-400">Documento</span>
              <p className="font-medium text-gray-700">{cliente.tipo_documento} {cliente.numero_documento}</p>
            </div>
            {cliente.ciudad && (
              <div>
                <span className="text-xs text-gray-400">Ciudad</span>
                <p className="font-medium text-gray-700">{cliente.ciudad}</p>
              </div>
            )}
            {cliente.telefono && (
              <div>
                <span className="text-xs text-gray-400">Teléfono</span>
                <p className="font-medium text-gray-700">{cliente.telefono}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <button
            key={card.titulo}
            onClick={() => navigate(card.ruta)}
            className={`${card.color} border-2 rounded-2xl p-8 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-center text-center`}
          >
            <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={card.icono} />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{card.titulo}</h3>
            <p className="text-sm text-gray-500">{card.descripcion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
