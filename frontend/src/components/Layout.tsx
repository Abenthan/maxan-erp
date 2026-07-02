import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
  bg: string;
}

const groups: NavGroup[] = [
  {
    label: "VENTAS",
    bg: "bg-blue-50",
    items: [
      { to: "/facturas", label: "Facturación", icon: "📄" },
      { to: "/ventas-items", label: "Ventas Items", icon: "📋" },
      { to: "/nueva-venta", label: "Nueva Venta", icon: "➕" },
    ],
  },
  {
    label: "COSTOS",
    bg: "bg-orange-50",
    items: [
      { to: "/compras", label: "Compras", icon: "📥" },
      { to: "/gastos", label: "Gastos", icon: "💰" },
    ],
  },
  {
    label: "CARTERA",
    bg: "bg-purple-50",
    items: [
      { to: "/cartera", label: "Cartera", icon: "📋" },
      { to: "/cartera/pagos", label: "Pagos", icon: "💳" },
    ],
  },
  {
    label: "INVENTARIO",
    bg: "bg-emerald-50",
    items: [
      { to: "/productos", label: "Productos", icon: "📦" },
      { to: "/inventario", label: "Stock", icon: "📊" },
      { to: "/inventario/movimientos", label: "Movimientos", icon: "🔄" },
    ],
  },
];

const soloItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/utilidad", label: "Utilidad", icon: "📈" },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-800">Maxan ERP</span>
        </div>
        <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
          <NavLink
            to="/"
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

          {groups.map((g) => (
            <div key={g.label} className={`${g.bg} rounded-xl p-2 space-y-0.5`}>
              <span className="block px-2 pt-1 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {g.label}
              </span>
              {g.items.map((item) => (
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
          ))}

          <NavLink
            to="/utilidad"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">📈</span>
            Utilidad
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
          Maxan Sistemas &copy; {new Date().getFullYear()}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-4 shrink-0">
          <span className="text-sm text-gray-500">Maxan Sistemas</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            M
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
