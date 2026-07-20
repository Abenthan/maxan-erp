import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
  permiso?: string;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
  bg: string;
}

const ALL_GROUPS: NavGroup[] = [
  {
    label: "VENTAS",
    bg: "bg-blue-50",
    items: [
      { to: "/financiero/facturas", label: "Facturación", icon: "📄", permiso: "facturas.ver" },
      { to: "/financiero/ventas-items", label: "Ventas Items", icon: "📋", permiso: "ventas.ver" },
      { to: "/financiero/nueva-venta", label: "Nueva Venta", icon: "➕", permiso: "ventas.crear" },
      { to: "/financiero/terceros", label: "Terceros", icon: "👤", permiso: "terceros.ver" },
    ],
  },
  {
    label: "COSTOS",
    bg: "bg-orange-50",
    items: [
      { to: "/financiero/compras", label: "Compras", icon: "📥", permiso: "compras.ver" },
      { to: "/financiero/gastos", label: "Gastos", icon: "💰", permiso: "gastos.ver" },
    ],
  },
  {
    label: "CARTERA",
    bg: "bg-purple-50",
    items: [
      { to: "/financiero/cartera", label: "Cartera", icon: "📋", permiso: "cartera.ver" },
      { to: "/financiero/cartera/pagos", label: "Pagos", icon: "💳", permiso: "cartera.ver" },
      { to: "/financiero/cartera/retenciones", label: "Retenciones", icon: "🧾", permiso: "cartera.ver" },
    ],
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout, hasPermiso } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function puedeVer(item: NavItem): boolean {
    if (!item.permiso) return true;
    return hasPermiso(item.permiso);
  }

  const puedeUtilidad = hasPermiso("utilidad.ver");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <Link to="/" className="text-lg font-bold text-gray-800 hover:text-blue-600">Maxan ERP</Link>
        </div>
        <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
          {puedeVer({ to: "/financiero", label: "Dashboard", icon: "📊", end: true, permiso: "dashboard.ver" }) && (
            <NavLink
              to="/financiero"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">📊</span>
              Dashboard
            </NavLink>
          )}

          {ALL_GROUPS.map((g) => {
            const itemsVisibles = g.items.filter(puedeVer);
            if (itemsVisibles.length === 0) return null;
            return (
              <div key={g.label} className={`${g.bg} rounded-xl p-2 space-y-0.5`}>
                <span className="block px-2 pt-1 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {g.label}
                </span>
                {itemsVisibles.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
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
            );
          })}

          {puedeUtilidad && (
            <NavLink
              to="/financiero/utilidad"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">📈</span>
              Utilidad
            </NavLink>
          )}
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
          Maxan Sistemas &copy; {new Date().getFullYear()}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600">
              ← Atrás
            </button>
            <span className="text-sm font-bold text-gray-700">Financiero</span>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{user.nombres} {user.apellidos}</span>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
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
