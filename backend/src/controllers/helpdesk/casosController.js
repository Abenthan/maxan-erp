const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  const { estado, categoria_id, recurso_id, cliente_id, tecnico_id, q } = req.query;
  let sql = `SELECT c.*, cat.nombre AS categoria_nombre, cat.color AS categoria_color,
             u.nombres || ' ' || u.apellidos AS tecnico_nombre,
             t.razon_social AS cliente_nombre,
             COALESCE(
               (SELECT json_agg(json_build_object('id', r2.id, 'nombre', r2.nombre, 'serial', r2.serial, 'tipo', r2.tipo))
                FROM helpdesk.casos_recursos cr2
                JOIN helpdesk.recursos r2 ON r2.id = cr2.recurso_id
                WHERE cr2.caso_id = c.id),
               '[]'::json
             ) AS recursos
             FROM helpdesk.casos c
             LEFT JOIN helpdesk.categorias_caso cat ON cat.id = c.categoria_id
             LEFT JOIN usuarios.usuarios u ON u.id = c.tecnico_id
             LEFT JOIN facturacion.terceros t ON t.id = c.cliente_id
             WHERE 1=1`;
  const params = [];
  if (estado) { params.push(estado); sql += ` AND c.estado = $${params.length}`; }
  if (categoria_id) { params.push(categoria_id); sql += ` AND c.categoria_id = $${params.length}`; }
  if (recurso_id) { params.push(recurso_id); sql += ` AND EXISTS (SELECT 1 FROM helpdesk.casos_recursos cr WHERE cr.caso_id = c.id AND cr.recurso_id = $${params.length})`; }
  if (cliente_id) { params.push(cliente_id); sql += ` AND c.cliente_id = $${params.length}`; }
  if (tecnico_id) { params.push(tecnico_id); sql += ` AND c.tecnico_id = $${params.length}`; }
  if (q) { params.push(`%${q}%`); sql += ` AND (c.titulo ILIKE $${params.length} OR c.numero ILIKE $${params.length} OR t.razon_social ILIKE $${params.length})`; }
  sql += " ORDER BY c.created_at DESC";
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
      `SELECT c.*, cat.nombre AS categoria_nombre, cat.color AS categoria_color,
              u.nombres || ' ' || u.apellidos AS tecnico_nombre,
              t.razon_social AS cliente_nombre, t.numero_documento AS cliente_documento,
              con.nombre AS contacto_nombre, con.telefono AS contacto_telefono, con.whatsapp AS contacto_whatsapp,
              COALESCE(
                (SELECT json_agg(json_build_object('id', r2.id, 'nombre', r2.nombre, 'serial', r2.serial, 'tipo', r2.tipo, 'marca', r2.marca, 'modelo', r2.modelo))
                 FROM helpdesk.casos_recursos cr2
                 JOIN helpdesk.recursos r2 ON r2.id = cr2.recurso_id
                 WHERE cr2.caso_id = c.id),
                '[]'::json
              ) AS recursos
       FROM helpdesk.casos c
       LEFT JOIN helpdesk.categorias_caso cat ON cat.id = c.categoria_id
       LEFT JOIN usuarios.usuarios u ON u.id = c.tecnico_id
       LEFT JOIN facturacion.terceros t ON t.id = c.cliente_id
       LEFT JOIN helpdesk.contactos con ON con.id = c.contacto_id
       WHERE c.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Caso no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { titulo, descripcion, categoria_id, recurso_ids, cliente_id, contacto_id, tecnico_id, fuente, estado } = req.body;
  const client = await db(req).connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO helpdesk.casos
       (titulo, descripcion, categoria_id, cliente_id, contacto_id, tecnico_id, fuente, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [titulo, descripcion, categoria_id, cliente_id, contacto_id, tecnico_id, fuente || 'Manual', estado || 'Pendiente']
    );
    const caso = result.rows[0];
    if (recurso_ids && Array.isArray(recurso_ids) && recurso_ids.length > 0) {
      for (const rid of recurso_ids) {
        await client.query(
          `INSERT INTO helpdesk.casos_recursos (caso_id, recurso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [caso.id, rid]
        );
      }
    }
    await client.query("COMMIT");
    res.status(201).json(caso);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.actualizar = async (req, res) => {
  const { titulo, descripcion, categoria_id, recurso_ids, cliente_id, contacto_id, tecnico_id, estado, solucion, resumen, ai_report } = req.body;
  const client = await db(req).connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE helpdesk.casos SET
        titulo=$1, descripcion=$2, categoria_id=$3, cliente_id=$4,
        contacto_id=$5, tecnico_id=$6, estado=$7, solucion=$8, resumen=$9, ai_report=$10
       WHERE id=$11 RETURNING *`,
      [titulo, descripcion, categoria_id, cliente_id, contacto_id, tecnico_id, estado, solucion, resumen, ai_report, req.params.id]
    );
    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Caso no encontrado" });
    }
    if (recurso_ids && Array.isArray(recurso_ids)) {
      await client.query("DELETE FROM helpdesk.casos_recursos WHERE caso_id = $1", [req.params.id]);
      for (const rid of recurso_ids) {
        await client.query(
          `INSERT INTO helpdesk.casos_recursos (caso_id, recurso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [req.params.id, rid]
        );
      }
    }
    await client.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.cambiarEstado = async (req, res) => {
  const { estado, solucion, resumen } = req.body;
  const estadosValidos = ['Pendiente', 'En Progreso', 'Completado', 'Cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  try {
    const result = await db(req).query(
      `UPDATE helpdesk.casos SET estado=$1, solucion=COALESCE($2, solucion), resumen=COALESCE($3, resumen) WHERE id=$4 RETURNING *`,
      [estado, solucion, resumen, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Caso no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarDetalles = async (req, res) => {
  try {
    const result = await db(req).query(
      `SELECT d.*, u.nombres || ' ' || u.apellidos AS creado_por_nombre
       FROM helpdesk.caso_detalles d
       LEFT JOIN usuarios.usuarios u ON u.id = d.creado_por
       WHERE d.caso_id = $1
       ORDER BY d.created_at`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearDetalle = async (req, res) => {
  const { contenido, tipo } = req.body;
  try {
    const result = await db(req).query(
      `INSERT INTO helpdesk.caso_detalles (caso_id, creado_por, contenido, tipo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.id, req.user?.id, contenido, tipo || 'Comentario']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarRecursos = async (req, res) => {
  try {
    const result = await db(req).query(
      `SELECT r.*, cr.created_at AS vinculado_en
       FROM helpdesk.casos_recursos cr
       JOIN helpdesk.recursos r ON r.id = cr.recurso_id
       WHERE cr.caso_id = $1
       ORDER BY r.nombre`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.vincularRecursos = async (req, res) => {
  const { recurso_ids } = req.body;
  if (!recurso_ids || !Array.isArray(recurso_ids) || recurso_ids.length === 0) {
    return res.status(400).json({ error: "recurso_ids es requerido (array no vacío)" });
  }
  try {
    for (const rid of recurso_ids) {
      await db(req).query(
        `INSERT INTO helpdesk.casos_recursos (caso_id, recurso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [req.params.id, rid]
      );
    }
    const result = await db(req).query(
      `SELECT r.* FROM helpdesk.casos_recursos cr
       JOIN helpdesk.recursos r ON r.id = cr.recurso_id
       WHERE cr.caso_id = $1 AND cr.recurso_id = ANY($2)`,
      [req.params.id, recurso_ids]
    );
    res.status(201).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.desvincularRecurso = async (req, res) => {
  try {
    const result = await db(req).query(
      `DELETE FROM helpdesk.casos_recursos WHERE caso_id = $1 AND recurso_id = $2 RETURNING *`,
      [req.params.id, req.params.recurso_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Vínculo no encontrado" });
    res.json({ message: "Recurso desvinculado del caso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
