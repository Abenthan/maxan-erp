const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productosController");
const { authorize } = require("../middleware/auth");

router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.update);
router.delete("/:id", authorize("productos.gestionar"), ctrl.remove);

module.exports = router;
