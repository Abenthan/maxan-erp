const { Router } = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const permisosController = require("../controllers/permisosController");

const router = Router();

router.use(authenticate, authorize("usuarios.gestionar"));

router.get("/", permisosController.list);
router.post("/", permisosController.create);
router.delete("/:id", permisosController.remove);

module.exports = router;
