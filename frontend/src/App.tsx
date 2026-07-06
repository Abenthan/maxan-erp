import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
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
import { ApiProvider } from "./context/ApiContext";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <DashboardProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/facturas" element={<Facturas />} />
              <Route path="/factura/:id" element={<Factura />} />
              <Route path="/nueva-factura" element={<NuevaFactura />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/gastos" element={<Gastos />} />
              <Route path="/compras" element={<Compras />} />
              <Route path="/nueva-compra" element={<NuevaCompra />} />
              <Route path="/compra/:id" element={<CompraDetalle />} />
              <Route path="/nueva-venta" element={<NuevaVenta />} />
              <Route path="/ventas-items" element={<VentasItems />} />
              <Route path="/ventas-items/:id/gastos" element={<GastosPorVentaItem />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/inventario/movimientos" element={<MovimientosInventario />} />
              <Route path="/utilidad" element={<Utilidad />} />
              <Route path="/cartera" element={<Cartera />} />
              <Route path="/cartera/pagos" element={<Pagos />} />
              <Route path="/cartera/nuevo-pago" element={<NuevoPago />} />
              <Route path="/cartera/retenciones" element={<Retenciones />} />
              <Route path="/terceros" element={<Terceros />} />
              <Route path="/nuevo-tercero" element={<NuevoTercero />} />
            </Routes>
          </Layout>
        </DashboardProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
