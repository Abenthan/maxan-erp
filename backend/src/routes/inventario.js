const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/inventarioController");
const { authorize } = require("../middleware/auth");

router.get("/stock", ctrl.stock);
router.get("/movimientos/:producto_id", ctrl.movimientos);
router.get("/ingresos", ctrl.listarIngresos);
router.post("/entradas", authorize("inventario.gestionar"), ctrl.ingresar);
router.post("/consumir", authorize("inventario.gestionar"), ctrl.consumir);

module.exports = router;