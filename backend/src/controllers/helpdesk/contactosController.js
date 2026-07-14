const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  const { cliente_id, q } = req.query;
  let sql = `SELECT con.*, t.razon_social AS cliente_nombre
             FROM helpdesk.contactos con
             LEFT JOIN facturacion.terceros t ON t.id = con.cliente_id
             WHERE 1=1`;
  const params = [];
  if (cliente_id) { params.push(cliente_id); sql += ` AND con.cliente_id = $${params.length}`; }
  if (q) { params.push(`%${q}%`); sql += ` AND (con.nombre ILIKE $${params.length} OR con.telefono ILIKE $${params.length} OR con.whatsapp ILIKE $${params.length})`; }
  sql += " ORDER BY con.nombre";
  try {
    const result = await db(req).query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const result = await db(req).query(
      `SELECT con.*, t.razon_social AS cliente_nombre
       FROM helpdesk.contactos con
       LEFT JOIN facturacion.terceros t ON t.id = con.cliente_id
       WHERE con.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Contacto no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { cliente_id, nombre, telefono, email, whatsapp, cargo } = req.body;
  try {
    const result = await db(req).query(
      `INSERT INTO helpdesk.contactos (cliente_id, nombre, telefono, email, whatsapp, cargo)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [cliente_id, nombre, telefono, email, whatsapp, cargo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizar = async (req, res) => {
  const { nombre, telefono, email, whatsapp, cargo, activo } = req.body;
  try {
    const result = await db(req).query(
      `UPDATE helpdesk.contactos SET nombre=$1, telefono=$2, email=$3, whatsapp=$4, cargo=$5, activo=$6
       WHERE id=$7 RETURNING *`,
      [nombre, telefono, email, whatsapp, cargo, activo, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Contacto no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const result = await db(req).query("DELETE FROM helpdesk.contactos WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Contacto no encontrado" });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
