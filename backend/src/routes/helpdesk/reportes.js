const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/reportesController");

const router = Router();

router.get("/", authorize("helpdesk.reportes.ver"), controller.listar);
router.get("/:id", authorize("helpdesk.reportes.ver"), controller.obtener);
router.post("/", authorize("helpdesk.reportes.gestionar"), controller.crear);

module.exports = router;
