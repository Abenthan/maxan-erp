const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/inventarioController");

router.get("/stock", ctrl.stock);
router.get("/movimientos/:producto_id", ctrl.movimientos);
router.post("/consumir", ctrl.consumir);

module.exports = router;
