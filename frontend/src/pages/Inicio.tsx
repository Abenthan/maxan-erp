import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const modulos = [
  {
    id: "financiero",
    titulo: "Financiero",
    desc: "Facturación electrónica, compras, inventario, cartera, gastos y más",
    icono: "💰",
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
    ruta: "/financiero",
  },
  {
    id: "clientes",
    titulo: "Clientes",
    desc: "Gestión de terceros, clientes y proveedores",
    icono: "👤",
    gradient: "from-teal-500 to-teal-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-700",
    ruta: "/terceros",
  },
  {
    id: "helpdesk",
    titulo: "Mesa de Ayuda",
    desc: "Gestión de recursos informáticos, mantenimientos y soporte a clientes",
    icono: "🖥️",
    gradient: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700",
    ruta: "/helpdesk",
  },
  {
    id: "configuracion",
    titulo: "Configuración",
    desc: "Usuarios, roles, permisos y copia de seguridad",
    icono: "⚙️",
    gradient: "from-gray-500 to-gray-600",
    bgLight: "bg-gray-50",
    textColor: "text-gray-700",
    ruta: "/configuracion/usuarios",
  },
  {
    id: "bases-datos",
    titulo: "Bases de Datos",
    desc: "Administración de terceros, contactos y datos maestros",
    icono: "🗄️",
    gradient: "from-teal-500 to-teal-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-700",
    ruta: "/bases-de-datos/terceros",
  },
  {
    id: "crm",
    titulo: "CRM",
    desc: "Gestión de clientes, oportunidades y relaciones comerciales",
    icono: "🤝",
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700",
    ruta: "/crm",
  },
];

export default function Inicio() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <span className="text-lg font-bold text-gray-800">Maxan ERP</span>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.nombres} {user.apellidos}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {user.nombres?.charAt(0)}{user.apellidos?.charAt(0)}
            </div>
            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-600">
              Cerrar sesión
            </button>
          </div>
        )}
        {!user && <span className="text-sm text-gray-500">Selecciona un módulo</span>}
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">Bienvenido</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">¿Qué deseas hacer?</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {modulos.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(m.ruta)}
                className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 ${m.bgLight}`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                  {m.icono}
                </div>
                <h3 className={`text-xl font-bold ${m.textColor}`}>{m.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{m.desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${m.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="h-10 flex items-center justify-center text-xs text-gray-400 border-t border-gray-100">
        Maxan Sistemas &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
