require('dotenv').config();
const express = require("express");
const { Pool } = require("pg");
const facturasRouter = require("./routes/facturas");
const productosRouter = require("./routes/productos");
const gastosRouter = require("./routes/gastos");
const comprasRouter = require("./routes/compras");
const inventarioRouter = require("./routes/inventario");
const facturacionRouter = require("./routes/facturacion");
const ventasRouter = require("./routes/ventas");
const categoriasRouter = require("./routes/categorias");
const dashboardRouter = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.locals.pool = pool;

app.use(express.text({ type: ["text/xml", "application/xml", "text/plain"] }));
app.use(express.json({ type: "application/json" }));

app.use("/api/facturas", facturasRouter);
app.use("/api/productos/categorias", categoriasRouter);
app.use("/api/productos", productosRouter);
app.use("/api/gastos", gastosRouter);
app.use("/api/compras", comprasRouter);
app.use("/api/inventario", inventarioRouter);
app.use("/api/facturacion", facturacionRouter);
app.use("/api/ventas", ventasRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error.message);
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: err.message || "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
