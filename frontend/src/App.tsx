import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import { ApiProvider } from "./context/ApiContext";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <DashboardProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/facturas" element={<ProtectedRoute permiso="facturas.ver"><Facturas /></ProtectedRoute>} />
                  <Route path="/factura/:id" element={<ProtectedRoute permiso="facturas.ver"><Factura /></ProtectedRoute>} />
                  <Route path="/nueva-factura" element={<ProtectedRoute permiso="facturas.crear"><NuevaFactura /></ProtectedRoute>} />
                  <Route path="/productos" element={<ProtectedRoute permiso="productos.ver"><Productos /></ProtectedRoute>} />
                  <Route path="/gastos" element={<ProtectedRoute permiso="gastos.ver"><Gastos /></ProtectedRoute>} />
                  <Route path="/compras" element={<ProtectedRoute permiso="compras.ver"><Compras /></ProtectedRoute>} />
                  <Route path="/nueva-compra" element={<ProtectedRoute permiso="compras.crear"><NuevaCompra /></ProtectedRoute>} />
                  <Route path="/compra/:id" element={<ProtectedRoute permiso="compras.ver"><CompraDetalle /></ProtectedRoute>} />
                  <Route path="/nueva-venta" element={<ProtectedRoute permiso="ventas.crear"><NuevaVenta /></ProtectedRoute>} />
                  <Route path="/nueva-venta/:id" element={<ProtectedRoute permiso="ventas.crear"><NuevaVenta /></ProtectedRoute>} />
                  <Route path="/ventas-items" element={<ProtectedRoute permiso="ventas.ver"><VentasItems /></ProtectedRoute>} />
                  <Route path="/ventas-items/:id/gastos" element={<ProtectedRoute permiso="gastos.ver"><GastosPorVentaItem /></ProtectedRoute>} />
                  <Route path="/inventario" element={<ProtectedRoute permiso="inventario.ver"><Inventario /></ProtectedRoute>} />
                  <Route path="/inventario/movimientos" element={<ProtectedRoute permiso="inventario.ver"><MovimientosInventario /></ProtectedRoute>} />
                  <Route path="/utilidad" element={<ProtectedRoute permiso="utilidad.ver"><Utilidad /></ProtectedRoute>} />
                  <Route path="/cartera" element={<ProtectedRoute permiso="cartera.ver"><Cartera /></ProtectedRoute>} />
                  <Route path="/cartera/pagos" element={<ProtectedRoute permiso="cartera.ver"><Pagos /></ProtectedRoute>} />
                  <Route path="/cartera/nuevo-pago" element={<ProtectedRoute permiso="cartera.gestionar"><NuevoPago /></ProtectedRoute>} />
                  <Route path="/cartera/retenciones" element={<ProtectedRoute permiso="cartera.ver"><Retenciones /></ProtectedRoute>} />
                  <Route path="/terceros" element={<ProtectedRoute permiso="terceros.ver"><Terceros /></ProtectedRoute>} />
                  <Route path="/nuevo-tercero" element={<ProtectedRoute permiso="terceros.gestionar"><NuevoTercero /></ProtectedRoute>} />
                  <Route path="/usuarios" element={<ProtectedRoute permiso="usuarios.gestionar"><Usuarios /></ProtectedRoute>} />
                  <Route path="/roles" element={<ProtectedRoute permiso="usuarios.gestionar"><Roles /></ProtectedRoute>} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </DashboardProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
