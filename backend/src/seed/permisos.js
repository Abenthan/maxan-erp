const permisosPorDefecto = [
  { codigo: "dashboard.ver", nombre: "Ver Dashboard", modulo: "Dashboard" },
  { codigo: "facturas.ver", nombre: "Ver facturas", modulo: "Facturación" },
  { codigo: "facturas.crear", nombre: "Crear facturas (subir XML)", modulo: "Facturación" },
  { codigo: "ventas.ver", nombre: "Ver items de venta", modulo: "Ventas" },
  { codigo: "ventas.crear", nombre: "Crear/editar ventas manuales", modulo: "Ventas" },
  { codigo: "productos.ver", nombre: "Ver catálogo de productos", modulo: "Productos" },
  { codigo: "productos.gestionar", nombre: "Crear/editar productos", modulo: "Productos" },
  { codigo: "gastos.ver", nombre: "Ver gastos", modulo: "Gastos" },
  { codigo: "gastos.gestionar", nombre: "Crear/editar/eliminar gastos", modulo: "Gastos" },
  { codigo: "compras.ver", nombre: "Ver compras", modulo: "Compras" },
  { codigo: "compras.crear", nombre: "Subir XML de compra", modulo: "Compras" },
  { codigo: "inventario.ver", nombre: "Ver stock y movimientos", modulo: "Inventario" },
  { codigo: "inventario.gestionar", nombre: "Consumir inventario", modulo: "Inventario" },
  { codigo: "cartera.ver", nombre: "Ver cartera y pagos", modulo: "Cartera" },
  { codigo: "cartera.gestionar", nombre: "Registrar/anular pagos", modulo: "Cartera" },
  { codigo: "terceros.ver", nombre: "Ver terceros", modulo: "Terceros" },
  { codigo: "terceros.gestionar", nombre: "Crear/editar/eliminar terceros", modulo: "Terceros" },
  { codigo: "utilidad.ver", nombre: "Ver reporte de utilidad", modulo: "Utilidad" },
  { codigo: "usuarios.gestionar", nombre: "Gestionar usuarios, roles y permisos", modulo: "Administración" },
  { codigo: "helpdesk.ver", nombre: "Ver recursos y mantenimientos", modulo: "Helpdesk" },
  { codigo: "helpdesk.gestionar", nombre: "Crear/editar recursos y mantenimientos", modulo: "Helpdesk" },
  { codigo: "helpdesk.casos.ver", nombre: "Ver casos de soporte", modulo: "Helpdesk" },
  { codigo: "helpdesk.casos.gestionar", nombre: "Crear/editar/cerrar casos de soporte", modulo: "Helpdesk" },
];

async function seedPermisos(pool) {
  const permisosInsertados = [];

  for (const p of permisosPorDefecto) {
    const result = await pool.query(
      `INSERT INTO usuarios.permisos (codigo, nombre, descripcion, modulo)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (codigo) DO UPDATE SET nombre = EXCLUDED.nombre, modulo = EXCLUDED.modulo
       RETURNING id`,
      [p.codigo, p.nombre, null, p.modulo]
    );
    permisosInsertados.push(result.rows[0].id);
  }

  let rolAdmin = await pool.query("SELECT id FROM usuarios.roles WHERE nombre = $1", ["Administrador"]);
  if (rolAdmin.rows.length === 0) {
    const r = await pool.query(
      "INSERT INTO usuarios.roles (nombre, descripcion) VALUES ($1, $2) RETURNING id",
      ["Administrador", "Acceso total al sistema"]
    );
    rolAdmin = r.rows[0].id;
  } else {
    rolAdmin = rolAdmin.rows[0].id;
  }

  for (const permisoId of permisosInsertados) {
    await pool.query(
      "INSERT INTO usuarios.roles_permisos (rol_id, permiso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [rolAdmin, permisoId]
    );
  }

  let rolOperador = await pool.query("SELECT id FROM usuarios.roles WHERE nombre = $1", ["Operador"]);
  if (rolOperador.rows.length === 0) {
    const r = await pool.query(
      "INSERT INTO usuarios.roles (nombre, descripcion) VALUES ($1, $2) RETURNING id",
      ["Operador", "Puede consultar, crear y editar registros de negocio"]
    );
    rolOperador = r.rows[0].id;
  } else {
    rolOperador = rolOperador.rows[0].id;
  }

  const permisosOperador = permisosPorDefecto
    .filter((p) => p.codigo !== "usuarios.gestionar" && !p.codigo.endsWith(".eliminar"))
    .map((p) => p.codigo);

  for (const codigo of permisosOperador) {
    const perm = await pool.query("SELECT id FROM usuarios.permisos WHERE codigo = $1", [codigo]);
    if (perm.rows.length > 0) {
      await pool.query(
        "INSERT INTO usuarios.roles_permisos (rol_id, permiso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [rolOperador, perm.rows[0].id]
      );
    }
  }

  let rolConsultor = await pool.query("SELECT id FROM usuarios.roles WHERE nombre = $1", ["Consultor"]);
  if (rolConsultor.rows.length === 0) {
    const r = await pool.query(
      "INSERT INTO usuarios.roles (nombre, descripcion) VALUES ($1, $2) RETURNING id",
      ["Consultor", "Solo consulta de datos"]
    );
    rolConsultor = r.rows[0].id;
  } else {
    rolConsultor = rolConsultor.rows[0].id;
  }

  for (const p of permisosPorDefecto) {
    if (p.codigo.endsWith(".ver")) {
      const perm = await pool.query("SELECT id FROM usuarios.permisos WHERE codigo = $1", [p.codigo]);
      if (perm.rows.length > 0) {
        await pool.query(
          "INSERT INTO usuarios.roles_permisos (rol_id, permiso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [rolConsultor, perm.rows[0].id]
        );
      }
    }
  }

  const result = await pool.query("SELECT codigo FROM usuarios.permisos");
  return result.rows.map((r) => r.codigo);
}

module.exports = { seedPermisos, permisosPorDefecto };
