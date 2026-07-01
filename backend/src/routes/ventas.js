const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ventasController");

router.get("/items", ctrl.listItems);
router.post("/", ctrl.create);

module.exports = router;
