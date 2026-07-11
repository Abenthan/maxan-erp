require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { authenticate } = require("./middleware/auth");
const { seedPermisos } = require("./seed/permisos");

const authRouter = require("./routes/auth");
const usuariosRouter = require("./routes/usuarios");
const rolesRouter = require("./routes/roles");
const permisosRouter = require("./routes/permisos");
const facturasRouter = require("./routes/facturas");
const productosRouter = require("./routes/productos");
const gastosRouter = require("./routes/gastos");
const comprasRouter = require("./routes/compras");
const inventarioRouter = require("./routes/inventario");
const facturacionRouter = require("./routes/facturacion");
const ventasRouter = require("./routes/ventas");
const categoriasRouter = require("./routes/categorias");
const dashboardRouter = require("./routes/dashboard");
const carteraRouter = require("./routes/cartera");
const clasificacionesGastoRouter = require("./routes/clasificacionesGasto");
const tercerosRouter = require("./routes/terceros");

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

app.use(cors());
app.use(express.text({ type: ["text/xml", "application/xml", "text/plain"] }));
app.use(express.json({ type: "application/json" }));

app.use("/api/auth", authRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/permisos", permisosRouter);

const apiRouter = express.Router();
apiRouter.use(authenticate);

apiRouter.use("/facturas", facturasRouter);
apiRouter.use("/productos/categorias", categoriasRouter);
apiRouter.use("/productos", productosRouter);
apiRouter.use("/gastos/clasificaciones", clasificacionesGastoRouter);
apiRouter.use("/gastos", gastosRouter);
apiRouter.use("/compras", comprasRouter);
apiRouter.use("/inventario", inventarioRouter);
apiRouter.use("/facturacion", facturacionRouter);
apiRouter.use("/ventas", ventasRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/cartera", carteraRouter);
apiRouter.use("/terceros", tercerosRouter);

app.use("/api", apiRouter);

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

async function start() {
  try {
    await seedPermisos(pool);
    console.log("Permisos y roles inicializados correctamente");
  } catch (error) {
    if (error.code !== "42P01") {
      console.warn("No se pudieron inicializar permisos (puede que la migración SQL no esté aplicada):", error.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en el puerto ${PORT}`);
  });
}

start();
