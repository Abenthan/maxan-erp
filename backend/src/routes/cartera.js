const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/carteraController");

router.get("/pagos", ctrl.listPagos);
router.get("/pagos/:id", ctrl.getPago);
router.post("/pagos", ctrl.createPago);
router.put("/pagos/:id", ctrl.updatePago);
router.post("/pagos/:id/anular", ctrl.anularPago);

router.get("/activa", ctrl.listCarteraActiva);

router.get("/clientes-deuda", ctrl.listClientesConDeuda);
router.get("/clientes-deuda/:cliente_id/facturas", ctrl.getFacturasPendientesCliente);

router.get("/medios-pago", ctrl.listMediosPago);
router.post("/medios-pago", ctrl.createMedioPago);

router.get("/retenciones", ctrl.listRetenciones);

module.exports = router;
