const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/casosController");

const router = Router();

router.get("/", authorize("helpdesk.casos.ver"), controller.listar);
router.get("/:id", authorize("helpdesk.casos.ver"), controller.obtener);
router.post("/", authorize("helpdesk.casos.gestionar"), controller.crear);
router.put("/:id", authorize("helpdesk.casos.gestionar"), controller.actualizar);
router.patch("/:id/estado", authorize("helpdesk.casos.gestionar"), controller.cambiarEstado);
router.get("/:id/detalles", authorize("helpdesk.casos.ver"), controller.listarDetalles);
router.post("/:id/detalles", authorize("helpdesk.casos.gestionar"), controller.crearDetalle);

router.get("/:id/recursos", authorize("helpdesk.casos.ver"), controller.listarRecursos);
router.post("/:id/recursos", authorize("helpdesk.casos.gestionar"), controller.vincularRecursos);
router.delete("/:id/recursos/:recurso_id", authorize("helpdesk.casos.gestionar"), controller.desvincularRecurso);

module.exports = router;
