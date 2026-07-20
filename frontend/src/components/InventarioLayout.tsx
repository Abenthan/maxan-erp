import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

const SIDEBAR_ITEMS = [
  { to: "/inventario/productos", label: "Productos", icon: "📦", permiso: "productos.ver" },
  { to: "/inventario/stock", label: "Stock", icon: "📊", permiso: "inventario.ver" },
  { to: "/inventario/movimientos", label: "Movimientos", icon: "🔄", permiso: "inventario.ver" },
];

export default function InventarioLayout({ children }: { children: ReactNode }) {
  const { user, logout, hasPermiso } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const itemsVisibles = SIDEBAR_ITEMS.filter((i) => !i.permiso || hasPermiso(i.permiso));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <Link to="/" className="text-lg font-bold text-gray-800 hover:text-emerald-600">Maxan ERP</Link>
        </div>
        <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
          <div className="bg-emerald-50 rounded-xl p-2 space-y-0.5">
            <span className="block px-2 pt-1 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              INVENTARIO
            </span>
            {itemsVisibles.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:bg-white/60"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
          Maxan Sistemas &copy; {new Date().getFullYear()}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-gray-600">
              ← Inicio
            </button>
            <span className="text-sm font-bold text-gray-700">Inventario</span>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{user.nombres} {user.apellidos}</span>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
                {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
              </div>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-600">
                Cerrar sesión
              </button>
            </div>
          )}
          {!user && <span className="text-sm text-gray-500">Maxan Sistemas</span>}
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
