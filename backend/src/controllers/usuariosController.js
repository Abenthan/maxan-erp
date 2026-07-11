const bcrypt = require("bcrypt");

function getPool(req) {
  return req.app.locals.pool;
}

async function list(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query(
      `SELECT u.id, u.empresa_id, e.nombre AS empresa_nombre, u.username, u.email, u.nombres, u.apellidos, u.activo, u.created_at, u.updated_at,
              COALESCE(json_agg(json_build_object('id', r.id, 'nombre', r.nombre)) FILTER (WHERE r.id IS NOT NULL), '[]') AS roles
       FROM usuarios.usuarios u
       JOIN usuarios.empresas e ON e.id = u.empresa_id
       LEFT JOIN usuarios.usuarios_roles ur ON ur.usuario_id = u.id
       LEFT JOIN usuarios.roles r ON r.id = ur.rol_id
       GROUP BY u.id, e.nombre
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.empresa_id, e.nombre AS empresa_nombre, u.username, u.email, u.nombres, u.apellidos, u.activo, u.created_at,
              COALESCE(json_agg(json_build_object('id', r.id, 'nombre', r.nombre)) FILTER (WHERE r.id IS NOT NULL), '[]') AS roles
       FROM usuarios.usuarios u
       JOIN usuarios.empresas e ON e.id = u.empresa_id
       LEFT JOIN usuarios.usuarios_roles ur ON ur.usuario_id = u.id
       LEFT JOIN usuarios.roles r ON r.id = ur.rol_id
       WHERE u.id = $1
       GROUP BY u.id, e.nombre`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  const pool = getPool(req);
  try {
    const { empresa_id, username, email, password, nombres, apellidos, activo } = req.body;
    if (!username || !email || !password || !nombres || !apellidos) {
      return res.status(400).json({ error: "Campos requeridos: username, email, password, nombres, apellidos" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO usuarios.usuarios (empresa_id, username, email, password_hash, nombres, apellidos, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [empresa_id || req.user.empresa_id, username, email, password_hash, nombres, apellidos, activo !== false]
    );
    res.status(201).json({ success: true, usuario_id: result.rows[0].id });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "El nombre de usuario o email ya está registrado" });
    }
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const { username, email, nombres, apellidos, activo, password } = req.body;

    const sets = [];
    const vals = [];
    let idx = 1;

    if (username !== undefined) { sets.push(`username = $${idx++}`); vals.push(username); }
    if (email !== undefined) { sets.push(`email = $${idx++}`); vals.push(email); }
    if (nombres !== undefined) { sets.push(`nombres = $${idx++}`); vals.push(nombres); }
    if (apellidos !== undefined) { sets.push(`apellidos = $${idx++}`); vals.push(apellidos); }
    if (activo !== undefined) { sets.push(`activo = $${idx++}`); vals.push(activo); }
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
      const hash = await bcrypt.hash(password, 10);
      sets.push(`password_hash = $${idx++}`);
      vals.push(hash);
    }

    if (sets.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" });

    vals.push(id);
    await pool.query(`UPDATE usuarios.usuarios SET ${sets.join(", ")} WHERE id = $${idx}`, vals);
    res.json({ success: true });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "El nombre de usuario o email ya está registrado" });
    }
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
    }
    await pool.query("DELETE FROM usuarios.usuarios WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function assignRoles(req, res) {
  const pool = getPool(req);
  try {
    const { id } = req.params;
    const { roles: roleIds } = req.body;

    await pool.query("BEGIN");
    await pool.query("DELETE FROM usuarios.usuarios_roles WHERE usuario_id = $1", [id]);
    for (const rolId of roleIds) {
      await pool.query(
        "INSERT INTO usuarios.usuarios_roles (usuario_id, rol_id) VALUES ($1, $2)",
        [id, rolId]
      );
    }
    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
}

module.exports = { list, getById, create, update, remove, assignRoles };
