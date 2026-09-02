const crypto = require("crypto");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { r2, R2_BUCKET, R2_PUBLIC_URL } = require("../config/r2");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 10;

function getPool(req) {
  return req.app.locals.pool;
}

function sanitizeFilename(original) {
  const ext = original.split(".").pop()?.toLowerCase() || "jpg";
  return `${crypto.randomUUID()}.${ext}`;
}

async function validarProducto(pool, productoId) {
  const { rows } = await pool.query(
    "SELECT id, codigo FROM inventario.productos WHERE id = $1",
    [productoId]
  );
  if (rows.length === 0) return null;
  return rows[0];
}

async function contarImagenes(pool, productoId) {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS total FROM inventario.imagenes WHERE producto_id = $1",
    [productoId]
  );
  return rows[0].total;
}

async function listar(pool, productoId) {
  const { rows } = await pool.query(
    `SELECT id, producto_id, url, es_principal, orden, created_at
     FROM inventario.imagenes
     WHERE producto_id = $1
     ORDER BY es_principal DESC, orden ASC, created_at ASC`,
    [productoId]
  );
  return rows;
}

async function subir(pool, productoId, file) {
  const producto = await validarProducto(pool, productoId);
  if (!producto) return { error: "Producto no encontrado" };

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return { error: "Tipo de archivo no permitido. Use JPG, PNG o WebP." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "El archivo excede el límite de 5MB." };
  }

  const total = await contarImagenes(pool, productoId);
  if (total >= MAX_IMAGES) {
    return { error: `Máximo ${MAX_IMAGES} imágenes por producto.` };
  }

  const filename = sanitizeFilename(file.originalname);
  const key = `productos/${producto.codigo}/${filename}`;

  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  const url = `${R2_PUBLIC_URL}/${key}`;
  const esPrincipal = total === 0;
  const orden = total;

  const { rows } = await pool.query(
    `INSERT INTO inventario.imagenes (producto_id, url, es_principal, orden)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [productoId, url, esPrincipal, orden]
  );

  return rows[0];
}

async function eliminar(pool, imagenId) {
  const { rows } = await pool.query(
    "SELECT * FROM inventario.imagenes WHERE id = $1",
    [imagenId]
  );
  if (rows.length === 0) return { error: "Imagen no encontrada" };

  const imagen = rows[0];

  // Extraer key del URL para eliminar de R2
  const publicPrefix = R2_PUBLIC_URL + "/";
  if (imagen.url.startsWith(publicPrefix)) {
    const key = imagen.url.slice(publicPrefix.length);
    try {
      await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    } catch (_) {
      // Continuar aunque falle R2 (archivo podría no existir)
    }
  }

  await pool.query("DELETE FROM inventario.imagenes WHERE id = $1", [imagenId]);

  // Si era principal y quedan imágenes, asignar la primera como principal
  if (imagen.es_principal) {
    const { rows: restantes } = await pool.query(
      `SELECT id FROM inventario.imagenes
       WHERE producto_id = $1 ORDER BY orden ASC LIMIT 1`,
      [imagen.producto_id]
    );
    if (restantes.length > 0) {
      await pool.query(
        "UPDATE inventario.imagenes SET es_principal = TRUE WHERE id = $1",
        [restantes[0].id]
      );
    }
  }

  return { success: true };
}

async function setPrincipal(pool, productoId, imagenId) {
  const { rows } = await pool.query(
    "SELECT id FROM inventario.imagenes WHERE id = $1 AND producto_id = $2",
    [imagenId, productoId]
  );
  if (rows.length === 0) return { error: "Imagen no encontrada para este producto" };

  await pool.query(
    "UPDATE inventario.imagenes SET es_principal = FALSE WHERE producto_id = $1",
    [productoId]
  );
  await pool.query(
    "UPDATE inventario.imagenes SET es_principal = TRUE WHERE id = $1",
    [imagenId]
  );

  return { success: true };
}

async function reordenar(pool, productoId, ordenIds) {
  if (!Array.isArray(ordenIds) || ordenIds.length === 0) {
    return { error: "Se requiere un array de IDs" };
  }

  // Verificar que todos pertenezcan al producto
  const { rows: existentes } = await pool.query(
    "SELECT id FROM inventario.imagenes WHERE producto_id = $1",
    [productoId]
  );
  const idsValidos = new Set(existentes.map((r) => r.id));
  if (ordenIds.some((id) => !idsValidos.has(id))) {
    return { error: "Uno o más IDs no pertenecen a este producto" };
  }

  for (let i = 0; i < ordenIds.length; i++) {
    await pool.query(
      "UPDATE inventario.imagenes SET orden = $1 WHERE id = $2",
      [i, ordenIds[i]]
    );
  }

  return { success: true };
}

module.exports = { listar, subir, eliminar, setPrincipal, reordenar, ALLOWED_TYPES, MAX_SIZE };
