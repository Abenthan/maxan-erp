const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/tiposRecursoController");

const router = Router();

router.get("/", authorize("helpdesk.ver"), controller.list);
router.post("/", authorize("helpdesk.gestionar"), controller.create);
router.delete("/:id", authorize("helpdesk.gestionar"), controller.remove);

module.exports = router;
