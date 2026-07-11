const { Router } = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const usuariosController = require("../controllers/usuariosController");

const router = Router();

router.use(authenticate, authorize("usuarios.gestionar"));

router.get("/", usuariosController.list);
router.get("/:id", usuariosController.getById);
router.post("/", usuariosController.create);
router.put("/:id", usuariosController.update);
router.delete("/:id", usuariosController.remove);
router.put("/:id/roles", usuariosController.assignRoles);

module.exports = router;
