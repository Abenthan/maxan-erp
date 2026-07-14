import { BrowserRouter, Route, Routes, Link, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import HelpdeskLayout from "./components/HelpdeskLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import Facturas from "./pages/Facturas";
import Factura from "./pages/Factura";
import NuevaFactura from "./pages/NuevaFactura";
import Productos from "./pages/Productos";
import Gastos from "./pages/Gastos";
import Compras from "./pages/Compras";
import NuevaCompra from "./pages/NuevaCompra";
import CompraDetalle from "./pages/CompraDetalle";
import NuevaVenta from "./pages/NuevaVenta";
import VentasItems from "./pages/VentasItems";
import GastosPorVentaItem from "./pages/GastosPorVentaItem";
import Inventario from "./pages/Inventario";
import MovimientosInventario from "./pages/MovimientosInventario";
import Utilidad from "./pages/Utilidad";
import Cartera from "./pages/Cartera";
import Pagos from "./pages/Pagos";
import NuevoPago from "./pages/NuevoPago";
import Retenciones from "./pages/Retenciones";
import Terceros from "./pages/Terceros";
import NuevoTercero from "./pages/NuevoTercero";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import Backup from "./pages/Backup";
import HelpdeskClientes from "./pages/helpdesk/Clientes";
import ClienteDetalle from "./pages/helpdesk/ClienteDetalle";
import ClienteDashboard from "./pages/helpdesk/ClienteDashboard";
import RecursoDetalle from "./pages/helpdesk/RecursoDetalle";
import Recursos from "./pages/helpdesk/Recursos";
import RegistrarPC from "./pages/helpdesk/RegistrarPC";
import Casos from "./pages/helpdesk/Casos";
import CasoDetalle from "./pages/helpdesk/CasoDetalle";
import CasoNuevo from "./pages/helpdesk/CasoNuevo";
import NuevoRecurso from "./pages/helpdesk/NuevoRecurso";
import Mantenimientos from "./pages/helpdesk/Mantenimientos";
import MantenimientoNuevo from "./pages/helpdesk/MantenimientoNuevo";
import MantenimientoDetalle from "./pages/helpdesk/MantenimientoDetalle";
import CategoriasCaso from "./pages/helpdesk/CategoriasCaso";
import CRM from "./pages/CRM";
import { ApiProvider } from "./context/ApiContext";
import { DashboardProvider } from "./context/DashboardContext";
import { HelpdeskProvider, useHelpdesk } from "./context/HelpdeskContext";
import { useAuth } from "./context/AuthContext";

function FinancieroRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="facturas" element={<ProtectedRoute permiso="facturas.ver"><Facturas /></ProtectedRoute>} />
        <Route path="factura/:id" element={<ProtectedRoute permiso="facturas.ver"><Factura /></ProtectedRoute>} />
        <Route path="nueva-factura" element={<ProtectedRoute permiso="facturas.crear"><NuevaFactura /></ProtectedRoute>} />
        <Route path="productos" element={<ProtectedRoute permiso="productos.ver"><Productos /></ProtectedRoute>} />
        <Route path="gastos" element={<ProtectedRoute permiso="gastos.ver"><Gastos /></ProtectedRoute>} />
        <Route path="compras" element={<ProtectedRoute permiso="compras.ver"><Compras /></ProtectedRoute>} />
        <Route path="nueva-compra" element={<ProtectedRoute permiso="compras.crear"><NuevaCompra /></ProtectedRoute>} />
        <Route path="compra/:id" element={<ProtectedRoute permiso="compras.ver"><CompraDetalle /></ProtectedRoute>} />
        <Route path="nueva-venta" element={<ProtectedRoute permiso="ventas.crear"><NuevaVenta /></ProtectedRoute>} />
        <Route path="nueva-venta/:id" element={<ProtectedRoute permiso="ventas.crear"><NuevaVenta /></ProtectedRoute>} />
        <Route path="ventas-items" element={<ProtectedRoute permiso="ventas.ver"><VentasItems /></ProtectedRoute>} />
        <Route path="ventas-items/:id/gastos" element={<ProtectedRoute permiso="gastos.ver"><GastosPorVentaItem /></ProtectedRoute>} />
        <Route path="inventario" element={<ProtectedRoute permiso="inventario.ver"><Inventario /></ProtectedRoute>} />
        <Route path="inventario/movimientos" element={<ProtectedRoute permiso="inventario.ver"><MovimientosInventario /></ProtectedRoute>} />
        <Route path="utilidad" element={<ProtectedRoute permiso="utilidad.ver"><Utilidad /></ProtectedRoute>} />
        <Route path="cartera" element={<ProtectedRoute permiso="cartera.ver"><Cartera /></ProtectedRoute>} />
        <Route path="cartera/pagos" element={<ProtectedRoute permiso="cartera.ver"><Pagos /></ProtectedRoute>} />
        <Route path="cartera/nuevo-pago" element={<ProtectedRoute permiso="cartera.gestionar"><NuevoPago /></ProtectedRoute>} />
        <Route path="cartera/retenciones" element={<ProtectedRoute permiso="cartera.ver"><Retenciones /></ProtectedRoute>} />
        <Route path="terceros" element={<ProtectedRoute permiso="terceros.ver"><Terceros /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

function HelpdeskNav() {
  const location = useLocation();
  const { cliente } = useHelpdesk();
  const { hasPermiso } = useAuth();
  const puedeCasos = hasPermiso("helpdesk.casos.ver");
  const puedeVer = hasPermiso("helpdesk.ver");
  const puedeGestionarCasos = hasPermiso("helpdesk.casos.gestionar");
  const tabs = [
    ...(cliente ? [{ ruta: "/helpdesk", label: "Inicio" }] : []),
    ...(cliente && puedeCasos ? [{ ruta: "/helpdesk/casos", label: "Casos" }] : []),
    ...(cliente && puedeVer ? [{ ruta: "/helpdesk/recursos", label: "Recursos" }] : []),
    ...(cliente && puedeVer ? [{ ruta: "/helpdesk/mantenimientos", label: "Mantenimientos" }] : []),
    ...(puedeGestionarCasos ? [{ ruta: "/helpdesk/categorias-caso", label: "Categorías" }] : []),
  ];

  return (
    <nav className="flex gap-1 mb-6 border-b border-gray-200">
      {tabs.map((t) => (
        <Link
          key={t.ruta}
          to={t.ruta}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            (location.pathname === t.ruta || (t.ruta !== "/helpdesk" && location.pathname.startsWith(t.ruta + "/")))
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

function HelpdeskRoutes() {
  const { cliente } = useHelpdesk();
  return (
    <HelpdeskLayout>
      <div>
        {cliente && <HelpdeskNav />}
        <Routes>
          <Route path="/" element={
            <ProtectedRoute permiso="helpdesk.ver">
              {cliente ? <ClienteDashboard /> : <HelpdeskClientes />}
            </ProtectedRoute>
          } />
          <Route path="clientes/:id" element={<ProtectedRoute permiso="helpdesk.ver"><ClienteDetalle /></ProtectedRoute>} />
          <Route path="recursos" element={<ProtectedRoute permiso="helpdesk.ver"><Recursos /></ProtectedRoute>} />
          <Route path="recursos/:id" element={<ProtectedRoute permiso="helpdesk.ver"><RecursoDetalle /></ProtectedRoute>} />
          <Route path="obtener-pc" element={<ProtectedRoute permiso="helpdesk.gestionar"><RegistrarPC /></ProtectedRoute>} />
          <Route path="nuevo-recurso" element={<ProtectedRoute permiso="helpdesk.gestionar"><NuevoRecurso /></ProtectedRoute>} />
          <Route path="casos" element={<ProtectedRoute permiso="helpdesk.casos.ver"><Casos /></ProtectedRoute>} />
          <Route path="casos/nuevo" element={<ProtectedRoute permiso="helpdesk.casos.gestionar"><CasoNuevo /></ProtectedRoute>} />
          <Route path="casos/:id" element={<ProtectedRoute permiso="helpdesk.casos.ver"><CasoDetalle /></ProtectedRoute>} />
          <Route path="mantenimientos" element={<ProtectedRoute permiso="helpdesk.ver"><Mantenimientos /></ProtectedRoute>} />
          <Route path="mantenimientos/nuevo" element={<ProtectedRoute permiso="helpdesk.gestionar"><MantenimientoNuevo /></ProtectedRoute>} />
          <Route path="mantenimientos/:id" element={<ProtectedRoute permiso="helpdesk.ver"><MantenimientoDetalle /></ProtectedRoute>} />
          <Route path="categorias-caso" element={<ProtectedRoute permiso="helpdesk.casos.gestionar"><CategoriasCaso /></ProtectedRoute>} />
        </Routes>
      </div>
    </HelpdeskLayout>
  );
}

function ConfiguracionRoutes() {
  const location = useLocation();
  const tabs = [
    { ruta: "/configuracion/usuarios", label: "Usuarios" },
    { ruta: "/configuracion/roles", label: "Roles" },
    { ruta: "/configuracion/backup", label: "Copia de Seguridad" },
  ];
  return (
    <HelpdeskLayout titulo="Configuración" color="bg-gray-600">
      <div>
        <nav className="flex gap-1 mb-6 border-b border-gray-200">
          {tabs.map((t) => (
            <Link
              key={t.ruta}
              to={t.ruta}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === t.ruta
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <Routes>
          <Route index element={<ProtectedRoute permiso="usuarios.gestionar"><Usuarios /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute permiso="usuarios.gestionar"><Usuarios /></ProtectedRoute>} />
          <Route path="roles" element={<ProtectedRoute permiso="usuarios.gestionar"><Roles /></ProtectedRoute>} />
          <Route path="backup" element={<ProtectedRoute permiso="usuarios.gestionar"><Backup /></ProtectedRoute>} />
        </Routes>
      </div>
    </HelpdeskLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <DashboardProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
            <Route path="/financiero/*" element={<FinancieroRoutes />} />
            <Route path="/helpdesk/*" element={<HelpdeskProvider><HelpdeskRoutes /></HelpdeskProvider>} />
            <Route path="/configuracion/*" element={<ConfiguracionRoutes />} />
            <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
            <Route path="/nuevo-tercero" element={<ProtectedRoute permiso="terceros.gestionar"><NuevoTercero /></ProtectedRoute>} />
            <Route path="/terceros" element={<HelpdeskProvider><HelpdeskLayout titulo="Clientes" color="bg-blue-600"><ProtectedRoute permiso="terceros.ver"><Terceros /></ProtectedRoute></HelpdeskLayout></HelpdeskProvider>} />
          </Routes>
        </DashboardProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
