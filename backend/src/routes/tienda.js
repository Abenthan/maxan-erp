const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tiendaController");
const { authorize } = require("../middleware/auth");

router.get("/productos-venta", authorize("tienda.gestionar"), ctrl.listar);
router.get(
  "/productos-venta/:producto_id",
  authorize("tienda.gestionar"),
  ctrl.obtenerPorProducto
);
router.get(
  "/productos-disponibles",
  authorize("tienda.gestionar"),
  ctrl.productosDisponibles
);
router.post("/productos-venta", authorize("tienda.gestionar"), ctrl.crear);
router.put(
  "/productos-venta/:producto_id",
  authorize("tienda.gestionar"),
  ctrl.actualizar
);
router.delete(
  "/productos-venta/:producto_id",
  authorize("usuarios.gestionar"),
  ctrl.eliminar
);

module.exports = router;
