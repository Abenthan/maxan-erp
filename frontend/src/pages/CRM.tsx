import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CRM() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">← Inicio</Link>
          <span className="text-sm font-bold text-gray-700">CRM</span>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.nombres} {user.apellidos}</span>
            <button onClick={() => { logout(); navigate("/login"); }} className="text-xs text-gray-400 hover:text-red-600">Cerrar sesión</button>
          </div>
        )}
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-2xl font-bold text-gray-800">CRM</h1>
          <p className="text-gray-400 mt-2">Módulo en desarrollo — próximamente</p>
        </div>
      </div>
    </div>
  );
}
