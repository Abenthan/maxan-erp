const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productosController");

router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

module.exports = router;
