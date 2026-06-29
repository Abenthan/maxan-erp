const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/facturacionController");

router.get("/:factura_id/utilidad", ctrl.utilidad);

module.exports = router;
