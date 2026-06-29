const express = require("express");
const multer = require("multer");
const router = express.Router();
const ctrl = require("../controllers/comprasController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/parsear-xml", ctrl.parsearXml);
router.post("/upload", upload.single("archivo"), ctrl.upload);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

module.exports = router;
