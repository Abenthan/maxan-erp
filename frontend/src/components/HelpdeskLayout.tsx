import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useHelpdesk } from "../context/HelpdeskContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  titulo?: string;
  color?: string;
}

export default function HelpdeskLayout({ children, titulo = "Mesa de Ayuda", color = "bg-amber-600" }: Props) {
  const { user, logout } = useAuth();
  const { cliente, clearCliente } = useHelpdesk();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function cambiarCliente() {
    clearCliente();
    navigate("/helpdesk");
  }

  const iniciales = user ? `${user.nombres?.charAt(0) || ''}${user.apellidos?.charAt(0) || ''}` : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-bold text-gray-800 hover:text-blue-600 mr-2">
            Maxan ERP
          </Link>
          <span className="text-gray-300 mr-2">|</span>
          <span className="text-sm font-semibold text-gray-600">{titulo}</span>
          {cliente && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-amber-700 font-semibold">{cliente.razon_social}</span>
              <button onClick={cambiarCliente} className="text-xs text-gray-400 hover:text-amber-600 underline">
                Cambiar
              </button>
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.nombres} {user.apellidos}</span>
            <div className={`w-8 h-8 rounded-full ${color} text-white flex items-center justify-center text-sm font-semibold`}>
              {iniciales}
            </div>
            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-600">
              Cerrar sesión
            </button>
          </div>
        )}
      </header>
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}
