const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tercerosController");
const { authorize } = require("../middleware/auth");

router.get("/", ctrl.list);
router.get("/:id", ctrl.get);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", authorize("terceros.gestionar"), ctrl.remove);

module.exports = router;
