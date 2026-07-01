import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
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
import Inventario from "./pages/Inventario";
import MovimientosInventario from "./pages/MovimientosInventario";
import { ApiProvider } from "./context/ApiContext";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <DashboardProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Inicio />} />
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
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/inventario/movimientos" element={<MovimientosInventario />} />
            </Routes>
          </Layout>
        </DashboardProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
