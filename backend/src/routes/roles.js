const { Router } = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const rolesController = require("../controllers/rolesController");

const router = Router();

router.use(authenticate, authorize("usuarios.gestionar"));

router.get("/", rolesController.list);
router.post("/", rolesController.create);
router.put("/:id", rolesController.update);
router.delete("/:id", rolesController.remove);
router.put("/:id/permisos", rolesController.assignPermissions);

module.exports = router;
