const express = require("express");
const multer = require("multer");
const router = express.Router({ mergeParams: true });
const svc = require("../services/imagenesService");
const { authorize } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: svc.MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (svc.ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido. Use JPG, PNG o WebP."));
    }
  },
});

function getPool(req) {
  return req.app.locals.pool;
}

// GET /api/productos/:producto_id/imagenes
router.get("/", async (req, res) => {
  try {
    const imagenes = await svc.listar(getPool(req), Number(req.params.producto_id));
    res.json(imagenes);
  } catch (error) {
    console.error("Error al listar imágenes:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/productos/:producto_id/imagenes
router.post("/", authorize("productos.gestionar"), upload.single("imagen"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se envió ningún archivo" });
  }
  try {
    const result = await svc.subir(getPool(req), Number(req.params.producto_id), req.file);
    if (result.error) {
      const status = result.error.includes("no encontrado") ? 404 : 400;
      return res.status(status).json({ error: result.error });
    }
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al subir imagen:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/productos/:producto_id/imagenes/:id
router.delete("/:id", authorize("productos.gestionar"), async (req, res) => {
  try {
    const result = await svc.eliminar(getPool(req), Number(req.params.id));
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    res.json(result);
  } catch (error) {
    console.error("Error al eliminar imagen:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/productos/:producto_id/imagenes/:id/principal
router.patch("/:id/principal", authorize("productos.gestionar"), async (req, res) => {
  try {
    const result = await svc.setPrincipal(
      getPool(req),
      Number(req.params.producto_id),
      Number(req.params.id)
    );
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    res.json(result);
  } catch (error) {
    console.error("Error al cambiar principal:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/productos/:producto_id/imagenes/reordenar
router.patch("/reordenar", authorize("productos.gestionar"), async (req, res) => {
  try {
    const result = await svc.reordenar(
      getPool(req),
      Number(req.params.producto_id),
      req.body.orden
    );
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  } catch (error) {
    console.error("Error al reordenar:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
