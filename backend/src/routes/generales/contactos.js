const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/generales/contactosController");

const router = Router();

router.get("/", authorize("helpdesk.casos.ver"), controller.listar);
router.get("/:id", authorize("helpdesk.casos.ver"), controller.obtener);
router.post("/", authorize("helpdesk.casos.gestionar"), controller.crear);
router.put("/:id", authorize("helpdesk.casos.gestionar"), controller.actualizar);
router.delete("/:id", authorize("helpdesk.casos.gestionar"), controller.eliminar);

module.exports = router;
