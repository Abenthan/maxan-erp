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
import Inventario from "./pages/Inventario";
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
              <Route path="/inventario" element={<Inventario />} />
            </Routes>
          </Layout>
        </DashboardProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
