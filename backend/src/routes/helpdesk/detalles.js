const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/detallesController");

const router = Router();

router.get("/:mantenimiento_id", authorize("helpdesk.ver"), controller.listar);
router.post("/:mantenimiento_id", authorize("helpdesk.gestionar"), controller.crear);

module.exports = router;
