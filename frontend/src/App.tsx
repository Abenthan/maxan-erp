import {BrowserRouter, Route, Routes} from "react-router-dom";

import Facturas from "./pages/Facturas";
import Factura from "./pages/Factura";
import NuevaFactura from "./pages/NuevaFactura";


function  App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <a
              href="/facturas"
              className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
              Facturas
            </a>
          </div>
        } />
        <Route path="/facturas" element={<Facturas />} />
        <Route path="/factura/:id" element={<Factura />} />
        <Route path="/nueva-factura" element={<NuevaFactura />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
