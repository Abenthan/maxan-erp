const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/facturacionController");

router.get("/utilidad/productos", ctrl.utilidadProductos);
router.get("/utilidad/facturas", ctrl.utilidadFacturas);
router.get("/:factura_id/utilidad", ctrl.utilidad);

module.exports = router;
