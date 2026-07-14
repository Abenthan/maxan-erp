const { Router } = require("express");
const { authorize } = require("../../middleware/auth");
const controller = require("../../controllers/helpdesk/categoriasController");

const router = Router();

router.get("/", authorize("helpdesk.ver"), controller.listar);

module.exports = router;
