function getPool(req) {
  return req.app.locals.pool;
}

async function list(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios.permisos ORDER BY modulo, codigo"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  const pool = getPool(req);
  try {
    const { codigo, nombre, descripcion, modulo } = req.body;
    if (!codigo || !nombre) return res.status(400).json({ error: "Código y nombre son requeridos" });
    const result = await pool.query(
      "INSERT INTO usuarios.permisos (codigo, nombre, descripcion, modulo) VALUES ($1, $2, $3, $4) RETURNING id",
      [codigo, nombre, descripcion || null, modulo || null]
    );
    res.status(201).json({ success: true, permiso_id: result.rows[0].id });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Ya existe un permiso con ese código" });
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios.permisos WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { list, create, remove };
