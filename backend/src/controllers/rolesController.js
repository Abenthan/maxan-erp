function getPool(req) {
  return req.app.locals.pool;
}

async function list(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      `SELECT r.*,
              COALESCE(json_agg(json_build_object('id', p.id, 'codigo', p.codigo, 'nombre', p.nombre, 'modulo', p.modulo)) FILTER (WHERE p.id IS NOT NULL), '[]') AS permisos
       FROM usuarios.roles r
       LEFT JOIN usuarios.roles_permisos rp ON rp.rol_id = r.id
       LEFT JOIN usuarios.permisos p ON p.id = rp.permiso_id
       GROUP BY r.id
       ORDER BY r.nombre`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  const pool = getPool(req);
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre del rol es requerido" });
    const result = await pool.query(
      "INSERT INTO usuarios.roles (nombre, descripcion) VALUES ($1, $2) RETURNING id",
      [nombre, descripcion || null]
    );
    res.status(201).json({ success: true, rol_id: result.rows[0].id });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Ya existe un rol con ese nombre" });
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    await pool.query(
      "UPDATE usuarios.roles SET nombre = COALESCE($1, nombre), descripcion = COALESCE($2, descripcion) WHERE id = $3",
      [nombre, descripcion, id]
    );
    res.json({ success: true });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Ya existe un rol con ese nombre" });
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios.roles WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function assignPermissions(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const { permisos: permisoIds } = req.body;

    await pool.query("BEGIN");
    await pool.query("DELETE FROM usuarios.roles_permisos WHERE rol_id = $1", [id]);
    for (const permisoId of permisoIds) {
      await pool.query(
        "INSERT INTO usuarios.roles_permisos (rol_id, permiso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [id, permisoId]
      );
    }
    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
}

module.exports = { list, create, update, remove, assignPermissions };
