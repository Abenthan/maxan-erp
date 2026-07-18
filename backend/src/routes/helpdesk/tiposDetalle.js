const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/tiposDetalleController");

const router = Router();

router.get("/", authorize("helpdesk.casos.ver"), controller.listar);
router.post("/", authorize("helpdesk.casos.gestionar"), controller.crear);
router.delete("/:id", authorize("helpdesk.casos.gestionar"), controller.eliminar);

module.exports = router;
