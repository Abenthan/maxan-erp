import { useNavigate } from "react-router-dom";
import { usePermiso } from "../../context/AuthContext";

export default function ConfiguracionHelpdesk() {
  const navigate = useNavigate();
  const puedeGestionarCasos = usePermiso("helpdesk.casos.gestionar");
  const puedeVer = usePermiso("helpdesk.ver");

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración Helpdesk</h1>
      <div className="grid gap-4">
        {puedeGestionarCasos && (
          <button onClick={() => navigate("/helpdesk/categorias-caso")}
            className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all">
            <span className="text-lg font-semibold text-gray-800">Categorías de Caso</span>
            <p className="text-sm text-gray-500 mt-1">Administrar categorías y colores para clasificar casos</p>
          </button>
        )}
        {puedeGestionarCasos && (
          <button onClick={() => navigate("/helpdesk/tipos-detalle")}
            className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all">
            <span className="text-lg font-semibold text-gray-800">Tipos de Detalle</span>
            <p className="text-sm text-gray-500 mt-1">Administrar tipos (Comentario, Diagnóstico, Solución, etc.)</p>
          </button>
        )}
        {puedeVer && (
          <button onClick={() => navigate("/recursos")}
            className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all">
            <span className="text-lg font-semibold text-gray-800">Todos los Recursos</span>
            <p className="text-sm text-gray-500 mt-1">Ver todos los recursos informáticos sin filtro de cliente</p>
          </button>
        )}
      </div>
    </div>
  );
}
