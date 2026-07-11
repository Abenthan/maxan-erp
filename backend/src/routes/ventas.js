const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ventasController");

router.get("/items", ctrl.listItems);
router.put("/items/:id", ctrl.updateItem);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.update);
router.post("/", ctrl.create);

module.exports = router;
