const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  const { cliente_id, caso_id, q } = req.query;
  let sql = `SELECT r.id, r."numeroReporte", r."idCaso", r.created_at,
                    c.numero AS caso_numero, c.titulo AS caso_titulo, c.estado AS caso_estado,
                    c.cliente_id, t.razon_social AS cliente_nombre
             FROM helpdesk.reportes_caso r
             JOIN helpdesk.casos c ON c.id = r."idCaso"
             LEFT JOIN generales.terceros t ON t.id = c.cliente_id
             WHERE 1=1`;
  const params = [];
  if (cliente_id) { params.push(cliente_id); sql += ` AND c.cliente_id = $${params.length}`; }
  if (caso_id) { params.push(caso_id); sql += ` AND r."idCaso" = $${params.length}`; }
  if (q) {
    params.push(`%${q}%`);
    sql += ` AND (r."numeroReporte"::text ILIKE $${params.length}
                  OR c.numero ILIKE $${params.length}
                  OR c.titulo ILIKE $${params.length}
                  OR t.razon_social ILIKE $${params.length})`;
  }
  sql += ` ORDER BY r."numeroReporte" DESC`;
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
      `SELECT r.id, r."numeroReporte", r."idCaso", r.created_at,
              c.numero AS caso_numero, c.titulo AS caso_titulo, c.descripcion AS caso_descripcion,
              c.estado AS caso_estado, c.fuente, c.solucion, c.resumen,
              c.created_at AS caso_fecha, c.updated_at AS caso_actualizado,
              cat.nombre AS categoria_nombre, cat.color AS categoria_color,
              u.nombres || ' ' || u.apellidos AS tecnico_nombre,
              t.razon_social AS cliente_nombre, t.numero_documento AS cliente_documento,
              t.tipo_documento AS cliente_tipo_documento, t.ciudad AS cliente_ciudad,
              t.telefono AS cliente_telefono, t.email AS cliente_email,
              con.nombre AS contacto_nombre, con.telefono AS contacto_telefono,
              con.whatsapp AS contacto_whatsapp, con.email AS contacto_email,
              COALESCE(
                (SELECT json_agg(json_build_object(
                          'id', r2.id, 'nombre', r2.nombre, 'serial', r2.serial, 'tipo', r2.tipo,
                          'marca', r2.marca, 'modelo', r2.modelo, 'ubicacion', r2.ubicacion)
                         ORDER BY r2.nombre)
                 FROM helpdesk.casos_recursos cr
                 JOIN helpdesk.recursos r2 ON r2.id = cr.recurso_id
                 WHERE cr.caso_id = c.id),
                '[]'::json
              ) AS recursos,
              COALESCE(
                (SELECT json_agg(json_build_object(
                          'id', d.id, 'contenido', d.contenido, 'tipo', d.tipo,
                          'created_at', d.created_at, 'recurso', d2.nombre,
                          'autor', COALESCE(u2.nombres || ' ' || u2.apellidos, 'Sistema'))
                         ORDER BY d.created_at)
                 FROM helpdesk.caso_detalles d
                 LEFT JOIN usuarios.usuarios u2 ON u2.id = d.creado_por
                 LEFT JOIN helpdesk.recursos d2 ON d2.id = d.recurso_id
                 WHERE d.caso_id = c.id),
                '[]'::json
              ) AS detalles
       FROM helpdesk.reportes_caso r
       JOIN helpdesk.casos c ON c.id = r."idCaso"
       LEFT JOIN helpdesk.categorias_caso cat ON cat.id = c.categoria_id
       LEFT JOIN usuarios.usuarios u ON u.id = c.tecnico_id
       LEFT JOIN generales.terceros t ON t.id = c.cliente_id
       LEFT JOIN generales.contactos con ON con.id = c.contacto_id
       WHERE r.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Reporte no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crear = async (req, res) => {
  const { idCaso } = req.body;
  if (!idCaso) return res.status(400).json({ error: "idCaso es requerido" });
  try {
    const caso = await db(req).query("SELECT id FROM helpdesk.casos WHERE id = $1", [idCaso]);
    if (caso.rows.length === 0) return res.status(404).json({ error: "Caso no encontrado" });
    const result = await db(req).query(
      `INSERT INTO helpdesk.reportes_caso ("idCaso") VALUES ($1) RETURNING *`,
      [idCaso]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
