const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/mantenimientosController");

const router = Router();

router.get("/", authorize("helpdesk.ver"), controller.listar);
router.get("/:id", authorize("helpdesk.ver"), controller.obtener);
router.post("/", authorize("helpdesk.gestionar"), controller.crear);
router.put("/:id", authorize("helpdesk.gestionar"), controller.actualizar);

module.exports = router;
