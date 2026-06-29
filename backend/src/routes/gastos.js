const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/gastosController");

router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.update);

module.exports = router;
