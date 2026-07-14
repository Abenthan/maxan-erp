const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/recursosController");

const router = Router();

router.get("/", authorize("helpdesk.ver"), controller.listar);
router.get("/script", authorize("helpdesk.ver"), controller.scriptPS);
router.get("/detectar-pc/pending/:session_code", authorize("helpdesk.ver"), controller.obtenerPendiente);

router.get("/:id", authorize("helpdesk.ver"), controller.obtener);
router.post("/", authorize("helpdesk.gestionar"), controller.crear);
router.put("/:id", authorize("helpdesk.gestionar"), controller.actualizar);
router.delete("/:id", authorize("helpdesk.gestionar"), controller.eliminar);

module.exports = router;
