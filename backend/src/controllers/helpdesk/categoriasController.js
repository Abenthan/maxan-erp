const db = (req) => req.app.locals.pool;

exports.listar = async (req, res) => {
  try {
    const result = await db(req).query("SELECT * FROM helpdesk.categorias_mantenimiento ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
