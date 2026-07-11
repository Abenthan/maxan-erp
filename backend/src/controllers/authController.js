const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/auth");
const { seedPermisos } = require("../seed/permisos");

function getPool(req) {
  return req.app.locals.pool;
}

async function checkFirstRun(req, res) {
  const pool = getPool(req);
  try {
    const result = await pool.query("SELECT COUNT(*)::int AS count FROM usuarios.usuarios");
    res.json({ firstRun: result.rows[0].count === 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function register(req, res) {
  const pool = getPool(req);
  try {
    const existentes = await pool.query("SELECT COUNT(*)::int AS count FROM usuarios.usuarios");
    if (existentes.rows[0].count > 0) {
      return res.status(400).json({ error: "Ya existen usuarios en el sistema. Solo un administrador puede crear nuevos usuarios." });
    }

    const { empresa_nombre, empresa_nit, username, email, password, nombres, apellidos } = req.body;
    if (!empresa_nombre || !empresa_nit || !username || !email || !password || !nombres || !apellidos) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    await pool.query("BEGIN");

    const empresaResult = await pool.query(
      "INSERT INTO usuarios.empresas (nombre, nit) VALUES ($1, $2) RETURNING id",
      [empresa_nombre, empresa_nit]
    );
    const empresaId = empresaResult.rows[0].id;

    const password_hash = await bcrypt.hash(password, 10);
    const usuarioResult = await pool.query(
      `INSERT INTO usuarios.usuarios (empresa_id, username, email, password_hash, nombres, apellidos)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [empresaId, username, email, password_hash, nombres, apellidos]
    );
    const usuarioId = usuarioResult.rows[0].id;

    await seedPermisos(pool);

    const rolResult = await pool.query("SELECT id FROM usuarios.roles WHERE nombre = $1", ["Administrador"]);
    if (rolResult.rows.length > 0) {
      await pool.query(
        "INSERT INTO usuarios.usuarios_roles (usuario_id, rol_id) VALUES ($1, $2)",
        [usuarioId, rolResult.rows[0].id]
      );
    }

    await pool.query("COMMIT");

    res.status(201).json({ success: true, message: "Usuario administrador creado exitosamente" });
  } catch (error) {
    await pool.query("ROLLBACK");
    if (error.code === "23505") {
      const campo = error.constraint?.includes("username") ? "nombre de usuario" : "email";
      return res.status(409).json({ error: `El ${campo} ya está registrado` });
    }
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  const pool = getPool(req);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }

    const userResult = await pool.query(
      `SELECT u.*, e.nombre AS empresa_nombre, e.nit AS empresa_nit
       FROM usuarios.usuarios u
       JOIN usuarios.empresas e ON e.id = u.empresa_id
       WHERE (u.username = $1 OR u.email = $1) AND u.activo = true AND e.activa = true`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const rolesResult = await pool.query(
      `SELECT r.id, r.nombre
       FROM usuarios.roles r
       JOIN usuarios.usuarios_roles ur ON ur.rol_id = r.id
       WHERE ur.usuario_id = $1`,
      [user.id]
    );
    const roles = rolesResult.rows.map((r) => r.nombre);

    const permisosResult = await pool.query(
      `SELECT DISTINCT p.codigo
       FROM usuarios.permisos p
       JOIN usuarios.roles_permisos rp ON rp.permiso_id = p.id
       JOIN usuarios.usuarios_roles ur ON ur.rol_id = rp.rol_id
       WHERE ur.usuario_id = $1`,
      [user.id]
    );
    const permisos = permisosResult.rows.map((p) => p.codigo);

    const tokenPayload = {
      id: user.id,
      empresa_id: user.empresa_id,
      username: user.username,
      nombres: user.nombres,
      apellidos: user.apellidos,
      roles,
      permisos,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: user.id,
        empresa_id: user.empresa_id,
        empresa_nombre: user.empresa_nombre,
        username: user.username,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        roles,
        permisos,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function me(req, res) {
  const pool = getPool(req);
  try {
    const userResult = await pool.query(
      `SELECT u.id, u.empresa_id, e.nombre AS empresa_nombre, u.username, u.email, u.nombres, u.apellidos, u.activo
       FROM usuarios.usuarios u
       JOIN usuarios.empresas e ON e.id = u.empresa_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      ...userResult.rows[0],
      roles: req.user.roles,
      permisos: req.user.permisos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function changePassword(req, res) {
  const pool = getPool(req);
  try {
    const { password_actual, password_nueva } = req.body;
    if (!password_actual || !password_nueva) {
      return res.status(400).json({ error: "Contraseña actual y nueva son requeridas" });
    }
    if (password_nueva.length < 6) {
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const userResult = await pool.query("SELECT password_hash FROM usuarios.usuarios WHERE id = $1", [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password_actual, userResult.rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ error: "La contraseña actual no es correcta" });
    }

    const password_hash = await bcrypt.hash(password_nueva, 10);
    await pool.query("UPDATE usuarios.usuarios SET password_hash = $1 WHERE id = $2", [password_hash, req.user.id]);

    res.json({ success: true, message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { checkFirstRun, register, login, me, changePassword };
