# Contexto del proyecto: maxan-erp

## Estado actual
- Sistema de facturación electrónica DIAN UBL 2.1 funcional
- Backend: Node.js + Express 5 + PostgreSQL (pg, sin ORM) en puerto 3000
- Frontend: React 19 + TypeScript 6 + Tailwind CSS 4 + Vite 8
- UI: Sidebar lateral con grupos (VENTAS azul, COSTOS naranja, CARTERA púrpura, INVENTARIO verde) + header, Tailwind puro
- BD vacía (todos los registros borrados)

## Arquitectura de módulos
- `/` — Landing page con 4 módulos (Financiero, Helpdesk, Configuración, CRM)
- `/financiero/*` — Layout sidebar (VENTAS azul, COSTOS naranja, CARTERA púrpura, INVENTARIO verde). Header con "← Atrás" (navega hacia atrás).
- `/helpdesk/*` — Layout simple (header + contenido)
- `/configuracion/*` — Usuarios, roles y copia de seguridad
- `/crm` — Placeholder
- `/terceros` — Standalone, sin sidebar (usa HelpdeskLayout con header "Maxan ERP")
- `/nuevo-tercero` — Standalone, con sidebar teal (usa BasesDeDatosLayout)
- `/financiero/nuevo-gasto` — Ruta bajo Layout financiero para crear gastos

## Sidebar Financiero (Layout.tsx)
```
📊 Dashboard
── VENTAS ──        (bg-blue-50)
  📄 Facturación
  📋 Ventas Items
  ➕ Nueva Venta
  👤 Terceros
── COSTOS ──        (bg-orange-50)
  📥 Compras
  💰 Gastos
── CARTERA ──       (bg-purple-50)
  📋 Cartera
  💳 Pagos
  🧾 Retenciones
── INVENTARIO ──    (bg-emerald-50)
  📦 Productos
  📊 Stock
  🔄 Movimientos
📈 Utilidad
```

## Módulo facturación (NO MODIFICAR)
- Backend: `routes/facturas.js` — CRUD completo + parseo XML
- Frontend: `pages/Facturas.tsx` (lista con filtros, ordenación por columnas, exportar Excel), `Factura.tsx` (detalle), `NuevaFactura.tsx` (upload XML)
- Schema: `facturacion` en PostgreSQL

## Nuevos módulos backend
- **Clientes** — `routes/terceros.js` → `GET /api/terceros` (con filtro `?q=`, `?tipo=cliente|proveedor`, `?tipo_documento=`), `GET /api/terceros/:id`, `POST /api/terceros` (crear/upsert con `es_cliente`/`es_proveedor`), `PUT /api/terceros/:id`, `DELETE /api/terceros/:id` (protegido con `authorize("terceros.gestionar")` + verifica `usuarios.gestionar` en controller — solo admins). `tipo_documento` y `numero_documento` opcionales (migración `24_terceros_documento_opcional.sql`).
- **Productos** — `routes/productos.js` → `POST/GET/PUT /api/productos`, `GET/POST/DELETE /api/productos/categorias`
- **Gastos** — `routes/gastos.js` → `POST/GET /api/gastos`, `PUT /api/gastos/:id`, `PUT /api/gastos/:id/vincular` (vincular/desvincular a venta_item_id), filtros `?producto_id=`, `?venta_item_id=`, `?sin_vinculo=true`
- **Clasificaciones de Gasto** — `routes/clasificacionesGasto.js` → `GET/POST/DELETE /api/gastos/clasificaciones` (maestro como categorías de producto, con FK en `gastos.gastos.clasificacion`)
- **Compras** — `routes/compras.js` → `POST /api/compras/upload` (multer + reuso de `parseInvoiceXML`), `POST /api/compras/parsear-xml` (solo parseo, sin guardar), `GET /api/compras`
  - Al guardar una compra, por cada línea crea un gasto en `gastos.gastos` y por cada impuesto (>0) crea un gasto adicional distribuido proporcionalmente según `item.valor_linea / subtotal_total`
- **Inventario** — `routes/inventario.js` → `GET /api/inventario/stock`, `GET /api/inventario/movimientos/:producto_id`, `POST /api/inventario/consumir` (FIFO transaccional)
- **Ventas** — `routes/ventas.js` → `GET /api/ventas/items`, `PUT /api/ventas/items/:id` (asignar producto_id), `POST /api/ventas` (crear), `GET /api/ventas/:id` (obtener con items), `PUT /api/ventas/:id` (editar solo si cufe IS NULL)
- **Utilidad** — `routes/facturacion.js` → `GET /api/facturacion/:factura_id/utilidad`, `GET /api/facturacion/utilidad/productos`, `GET /api/facturacion/utilidad/facturas?q=` (lista facturas con totales utilidad)
- **Categorías** — `routes/categorias.js` → `GET/POST/DELETE /api/productos/categorias` (maestro de categorías)
- **Dashboard** — `routes/dashboard.js` → `GET /api/dashboard` con filtros `?mes=&cliente_id=&factura_id=`
  - Retorna: resumen, ventas_por_mes, gastos_por_mes, gastos_por_clasificacion, top_clientes, ultimas_facturas, clientes, productos_utilidad
- **Cartera/Pagos** — `routes/cartera.js` → `GET /api/cartera/activa` (aging A/R), `POST/GET /api/cartera/pagos` (crear/listar), `GET /api/cartera/pagos/:id` (detalle), `PUT /api/cartera/pagos/:id` (editar fecha/medio/referencia/observaciones), `POST /api/cartera/pagos/:id/anular`, `GET /api/cartera/clientes-deuda` (clientes con saldo), `GET /api/cartera/clientes-deuda/:id/facturas` (facturas pendientes), `GET/POST /api/cartera/medios-pago`, `GET /api/cartera/retenciones` (listado de retenciones realizadas)
- **Backup** — `routes/backup.js` → `GET /api/backup/descargar` (stream pg_dump con `--column-inserts` via Docker, genera `.sql` ejecutable en DBeaver), `GET /api/backup/verificar` (comprueba disponibilidad). Protegido con `usuarios.gestionar`.

## Frontend módulos (implementados)
- `pages/Dashboard.tsx` — Página principal `/` con cards de resumen, barras ventas/gastos/clasificación, top clientes, últimas facturas, utilidad por producto. Filtros: mes (select últimos 12 meses), cliente, factura ID.
- `pages/Contactos.tsx` — CRUD completo de contactos en `/bases-de-datos/contactos`. Tabla con Nombre, Cliente, Teléfono, Email, WhatsApp, Cargo, Estado. Filtros: búsqueda + cliente. Modal edición/creación. Eliminar solo admins (`usuarios.gestionar`).
- `pages/Productos.tsx` — Listado de catálogo con filtros (búsqueda + categoría), tabla, formulario crear/editar abajo, links a Stock y Gastos
- `pages/Gastos.tsx` — Tabla de gastos con filtros (descripción + rango fechas + producto_id por URL), sin scroll vertical, fila clickeable para editar en modal, botón "+ Nuevo Gasto" en el header que navega a `/financiero/nuevo-gasto`. Clasificación con select + ⚙. Modal VinculoProductoModal para vincular/desvincular producto. Botón "Producto" por fila.
- `pages/Compras.tsx` — Listado de facturas compra
- `pages/NuevaCompra.tsx` — Subir XML de compra con preview + botón guardar (paso doble: parsear → mostrar → guardar)
- `pages/Inventario.tsx` — Stock desde `vw_stock_disponible`
- `pages/VentasItems.tsx` — Items de venta con filtros, modal asignar producto con consumo FIFO, botones Ver, Gastos y Editar (solo para ventas sin factura, identificadas por `cufe IS NULL`)
- `pages/Utilidad.tsx` — Tab única "Por Factura": lista de todas las facturas con ingresos, costos y utilidad; búsqueda por N° factura o cliente; columnas ordenables clickeando encabezados; click en fila → detalle (cards resumen + tabla líneas)
- `pages/Terceros.tsx` — `/terceros` CRUD completo con tabla (avatares por iniciales, badges Cliente/Proveedor), filtros búsqueda + tipo, fila clickeable → modal edición, botón Eliminar solo para admins (`usuarios.gestionar`)
- `pages/NuevoTercero.tsx` — `/nuevo-tercero` Formulario para crear nuevo tercero. Ruta standalone fuera de financiero, accesible con solo `terceros.gestionar`
- `pages/Cartera.tsx` — `/cartera` Tabla cartera activa con aging (días vencido coloreado, totales), filtro cliente como input texto (búsqueda en tiempo real por nombre/NIT), filtro estado, modal rápido para registrar pago con distribución por factura. Medio de pago limitado a Efectivo/Transferencia Bancaria, default Transferencia.
- `pages/Pagos.tsx` — `/cartera/pagos` Historial de pagos recibidos. Click en fila activa → modal de edición (fecha, medio, referencia, observaciones) con PUT. Botón anular preservado.
- `pages/NuevoPago.tsx` — `/cartera/nuevo-pago` Página dedicada paso a paso (cliente → facturas → confirmar)
- `pages/Retenciones.tsx` — `/cartera/retenciones` Listado de retenciones realizadas con total acumulado
- `pages/NuevaVenta.tsx` — `/nueva-venta` y `/nueva-venta/:id` (edición). Cliente default "Ventas sin factura" con CC 123456789. Campo Observaciones con auto-focus. Items con dos columnas: Código (input, al perder foco busca producto por código exacto) y Producto (autocomplete por código/nombre, dropdown via `createPortal` para evitar clipping por overflow). Si el producto es inventariable, al crear consume inventario. En modo edición carga datos vía GET y guarda con PUT.
- `pages/NuevoGasto.tsx` — `/financiero/nuevo-gasto` Formulario para crear gastos, organizado en 4 secciones: Descripción del gasto, Clasificación, Producto (input búsqueda + lista filtrada con selección que se repliega a badge), Factura de Venta (opcional). Ruta bajo Layout financiero.
- `context/ApiContext.tsx` — Métodos: `get`, `post`, `put`, `patch`, `del`, `postXml`, `upload`
- `context/AuthContext.tsx` — Provider con `user`, `token`, `login()`, `logout()`, `hasPermiso()`. Hook `usePermiso(codigo)` y `useAuth()`. Detecta `isFirstRun` automáticamente.

## Autenticación y permisos

### Módulo de usuarios (implementado)
- **Schema**: `usuarios` con tablas `empresas`, `usuarios`, `roles`, `permisos`, `roles_permisos`, `usuarios_roles`
- **Backend**: JWT con jsonwebtoken + bcrypt. Middleware `authenticate` (verifica token) y `authorize(...permisos)` (control granular).
  - `routes/auth.js` — Login público, register (solo primer usuario), me, change-password
  - `routes/usuarios.js` — CRUD usuarios + asignar roles (solo admin)
  - `routes/roles.js` — CRUD roles + asignar permisos (solo admin)
  - `routes/permisos.js` — CRUD permisos (solo admin)
- **Seed automático**: al iniciar servidor, crea 21 permisos + 3 roles (Administrador, Operador, Consultor).
- **Protección**: todas las rutas `/api/*` (excepto auth/health) requieren `authenticate`. Control granular por permiso en cada endpoint.

### 19 permisos del sistema
| Código | Módulo | Descripción |
|--------|--------|-------------|
| `dashboard.ver` | Dashboard | Ver dashboard |
| `facturas.ver` | Facturación | Ver facturas |
| `facturas.crear` | Facturación | Subir XML factura |
| `ventas.ver` | Ventas | Ver items de venta |
| `ventas.crear` | Ventas | Crear/editar ventas manuales |
| `productos.ver` | Productos | Ver catálogo |
| `productos.gestionar` | Productos | Crear/editar productos |
| `gastos.ver` | Gastos | Ver gastos |
| `gastos.gestionar` | Gastos | Crear/editar/eliminar gastos |
| `compras.ver` | Compras | Ver compras |
| `compras.crear` | Compras | Subir XML compra |
| `inventario.ver` | Inventario | Ver stock y movimientos |
| `inventario.gestionar` | Inventario | Consumir inventario |
| `cartera.ver` | Cartera | Ver cartera y pagos |
| `cartera.gestionar` | Cartera | Registrar/anular pagos |
| `terceros.ver` | Terceros | Ver terceros |
| `terceros.gestionar` | Terceros | Crear/editar/eliminar terceros |
| `utilidad.ver` | Utilidad | Ver reporte de utilidad |
| `usuarios.gestionar` | Admin | Gestionar usuarios, roles y permisos |

### Frontend — páginas de administración
- `pages/Login.tsx` — `/login` Formulario login. Link a `/register` si es primera vez.
- `pages/Register.tsx` — `/register` Registro primer usuario (crea empresa + admin). Solo accesible si no hay usuarios.
- `pages/Usuarios.tsx` — `/usuarios` CRUD usuarios con asignación de roles. Solo admin.
- `pages/Roles.tsx` — `/roles` CRUD roles con asignación de permisos por módulo. Solo admin.
- `pages/Backup.tsx` — `/configuracion/backup` Descargar copia de seguridad de la BD en formato SQL (.sql) con INSERTs, ejecutable directamente en DBeaver. Verifica disponibilidad de pg_dump al cargar.
- `components/ProtectedRoute.tsx` — Wrapper de rutas. Redirige a `/login` si no autenticado. Acepta `permiso` opcional.

### Frontend — ocultación condicional por permisos
- Botones "Nuevo", "Editar", "Eliminar" y formularios de creación se ocultan según `usePermiso("codigo")` en cada página.
- Eliminar terceros requiere `usuarios.gestionar` (admin), no solo `terceros.gestionar`.
- Sidebar filtra secciones enteras si el usuario no tiene el permiso `*.ver` correspondiente.
- Header muestra links "Usuarios" y "Roles" solo para admin (`usuarios.gestionar`).
- "Maxan ERP" en todos los headers es un link a `/` (inicio).

### Flujo first-run
1. AuthProvider detecta `isFirstRun` vía `GET /api/auth/check-first-run`
2. Si `true`, redirige a `/register`
3. Formulario crea empresa + usuario admin con rol Administrador
4. Redirige a `/login`
5. Login devuelve JWT (8h de expiración) almacenado en localStorage

### Token JWT
- Contenido: `{ id, empresa_id, username, nombres, apellidos, roles[], permisos[] }`
- Expiración: 8 horas
- Envío: `Authorization: Bearer <token>` en cada request vía interceptor de axios

## Schemas SQL
- `db/init/01_schema.sql` — Schema consolidado (facturacion, compras, inventario, gastos, cartera, usuarios, generales, helpdesk). Se ejecuta automáticamente al crear el contenedor PostgreSQL por primera vez via `docker-entrypoint-initdb.d`.
- `db/migrar_produccion.sql` — Script para ejecutar en DBeaver contra una BD de producción que se creó antes de tener el schema consolidado. Crea schemas cartera, usuarios, helpdesk y tablas faltantes.
- Migraciones individuales en `db/`: `01_schema.sql` a `24_terceros_documento_opcional.sql` (histórico, todo consolidado en `db/init/01_schema.sql`)
- `db/migrar_contactos_a_generales.sql` — Migración para mover `helpdesk.contactos` a `generales.contactos` en BD existentes.
- `db/migrar_terceros_a_generales.sql` — Migración para mover `facturacion.terceros` a `generales.terceros` en BD existentes (ejecutar después de actualizar `01_schema.sql` y backend).

## Schema `generales` (tablas compartidas entre módulos)
- **terceros** — Clientes, proveedores y emisores (migrado desde `facturacion.terceros`).
  - FK desde `facturacion.ventas.emisor_id`, `facturacion.ventas.receptor_id`, `compras.facturas_compra.proveedor_id`, `compras.facturas_compra.receptor_id`, `gastos.gastos.proveedor_id`, `cartera.pagos.cliente_id`, `helpdesk.recursos.cliente_id`, `helpdesk.casos.cliente_id`, `generales.contactos.cliente_id`.
  - Endpoint: `GET/POST/PUT/DELETE /api/terceros` (sin cambios en la ruta).
- **contactos** — Personas de contacto de clientes (`generales.terceros`). FK desde `helpdesk.casos.contacto_id` y `helpdesk.casos_contactos.contacto_id`.
  - Endpoint: `GET/POST/PUT/DELETE /api/generales/contactos`
  - Permisos: `helpdesk.casos.ver` (lectura), `helpdesk.casos.gestionar` (escritura)
  - Anteriormente en `helpdesk.contactos`, migrado a `generales.contactos` para uso cross-module (helpdesk + CRM futuro).

## Dependencias adicionales
### Backend
- `multer` (upload XML en compras)
- `jsonwebtoken` + `bcrypt` (autenticación JWT)
- `cors` (CORS middleware)
### Frontend
- `xlsx` (exportar Excel en facturas)
- `axios` (API calls, ya incluido)
- `react-router-dom` (ruteo, ya incluido)

## Problemas resueltos
1. **CUFE no encontrado** → búsqueda en `InvoiceControl.UUID/CUFE/CUDE` y fallback en `Invoice.UUID/CUFE/CUDE`
2. **NIT/CC vacío** → fallback a `PartyLegalEntity.CompanyID` con `schemeName`
3. **Elementos como array** → `safeArray()` para normalizar
4. **HTML entities en JSX** → usar caracteres Unicode reales (↑↓↕) en lugar de `&#8593;`
5. **Docker Desktop detenido** → las páginas fallaban con "Internal Server Error" porque el contenedor PostgreSQL no estaba disponible. Solución: iniciar Docker Desktop.
6. **NuevaCompra guardaba inmediatamente** → se separó en dos pasos: `POST /api/compras/parsear-xml` (solo parseo) + botón "Guardar" que llama `POST /api/compras/upload` (multipart).
7. **IVA de compra no registrado como gasto** → ahora se distribuye proporcionalmente por cada ítem (`item.valor_linea / subtotal_total` x `impuesto.valor`).
8. **Gastos sin PUT** → se agregó `PUT /api/gastos/:id` y `api.put` en el context, permitiendo editar desde la misma página.
9. **Trigger creaba entradas para cualquier gasto con producto** → ahora solo crea entrada si `clasificacion = 'Suministros'` (evita stock falso para IVA, transportes, etc.)
10. **VentasItems sin asignación de producto** → se agregó `producto_id` column en `ventas_items` + `PUT /api/ventas/items/:id` + frontend con dropdown y botón Consumir
11. **Per-product utility view** → `vw_utilidad_productos` en schema inventario (costo adquisiciones, ingresos ventas, otros costos)
12. **Filtro cliente en Cartera como input** → se cambió de `<select>` a `<input>` con filtrado client-side por nombre/NIT, eliminando dependencia de `/cartera/clientes-deuda`
13. **Medios de pago limitados** → en Cartera y Pagos solo se muestran Efectivo y Transferencia Bancaria, default Transferencia
14. **Edición de pagos** → se agregó `PUT /api/cartera/pagos/:id` y modal de edición en Pagos.tsx al hacer click en fila activa
15. **Retenciones en pagos** — columna editable "Retención" en modal de pago (Cartera.tsx y NuevoPago.tsx). Al pagar se guarda `ventas.valor_retencion_fuente`. El trigger descuenta retención del saldo: si `pago + retención >= total` → factura pagada. Migración `11_retenciones_ventas_items.sql`: columna en `ventas_items`, trigger y vistas actualizados.
16. **Página Retenciones** — `/cartera/retenciones` lista facturas con retención > 0 con total acumulado.
17. **Observaciones en NuevaVenta** — se agregó columna `observaciones TEXT` en `facturacion.ventas` + textarea en formulario con auto-focus.
18. **Productos en items de NuevaVenta** — items cambiaron de texto libre a búsqueda de productos por código/nombre con autocomplete; columna "Código" con búsqueda por código exacto al perder foco.
19. **Default "Ventas sin factura"** — al cargar `/nueva-venta` se preselecciona el tercero "Ventas sin factura" (CC 123456789) y el foco va al campo Observaciones.
20. **Edición de ventas manuales** — se agregó `GET/PUT /api/ventas/:id` (solo si `cufe IS NULL`), ruta `/nueva-venta/:id`, botón "Editar" en VentasItems para ventas sin factura.
21. **Numeración consecutiva VEN1...VENn** — migración `13_secuencia_ventas_manual.sql` crea secuencia `facturacion.ventas_manual_seq`; las ventas manuales ahora se numeran `VEN1`, `VEN2`, etc. en lugar de `VENTA-{timestamp}`.
22. **Observaciones en detalle de factura** — migración `14_vw_facturas_resumen_observaciones.sql` agrega `observaciones` a la vista. Se muestra condicionalmente en `Factura.tsx`.
23. **Botón Ver en Cartera** — se agregó botón "Ver" en `pages/Cartera.tsx` que abre `/factura/:id` en nueva pestaña.
24. **Script .bat se cerría inmediatamente** → el contenido era PowerShell pero se descargaba como `.bat`, ejecutándose en CMD. Solución: el backend ahora genera un wrapper `.bat` que invoca PowerShell con `-EncodedCommand` (Base64 UTF-16LE) evitando problemas de escaping.
25. **Endpoint detectar-pc requería token JWT** → el script PowerShell se ejecuta en el PC del cliente sin acceso al token. Solución: mover `POST /detectar-pc` fuera del middleware `authenticate`, montándolo en `app` antes del apiRouter.
26. **Auto-guardado de PC sin revisión** → el script guardaba automáticamente en BD si recibía `cliente_id`. Se cambió a flujo de dos pasos: los datos se almacenan temporalmente en memoria (`Map` en el controller), el técnico los revisa en pantalla y decide si guardar.
27. **RecursoDetalle sin edición** → no había forma de editar un recurso helpdesk. Se agregó modo edición inline con formulario completo (campos fijos + `atributos` JSONB: tipo_almacenamiento, chip_video, memoria_video_mb). Guarda vía `PUT /api/helpdesk/recursos/:id`.
28. **pg_dump no disponible en host** → la BD está en Docker, `pg_dump` no está en Windows. Solución: el endpoint `GET /api/backup/descargar` ejecuta `docker exec -i maxan_db_dev pg_dump ...` en lugar de llamar a pg_dump directamente. Configurable via `DB_USE_DOCKER=false` en `.env` para entornos con pg_dump nativo.
29. **Varios recursos por caso helpdesk** — se agregó tabla pivote `helpdesk.casos_recursos` (M2M entre casos y recursos). Migración `21_casos_recursos.sql`. Backend con 3 nuevos endpoints (GET/POST/DELETE). Frontend: multiselect en CasoNuevo, chips + vincular/desvincular en CasoDetalle, columna en Casos, sección inversa en RecursoDetalle.
30. **ApiContext sin método patch** — `CasoDetalle.tsx` usaba `api.patch` que no existía en el context. Se agregó `patch` a la interfaz, implementación y value del provider.
31. **Configuración sin HelpdeskProvider** — `ConfiguracionRoutes` en `App.tsx` usaba `<HelpdeskLayout>` sin estar envuelta en `<HelpdeskProvider>`, causando error `useHelpdesk debe usarse dentro de HelpdeskProvider`. Solución: agregar `<HelpdeskProvider>` en la ruta `/configuracion/*`.
32. **Backup cambiado a full SQL script** — `GET /api/backup/descargar` cambió de `-Fc` (formato binario `.dump`) a `--column-inserts` (SQL plano `.sql`) con `DROP SCHEMA ... CASCADE` prependido manualmente (en lugar de `--clean` que causaba conflictos de dependencias). Genera dump completo (schema + data) ejecutable directamente en DBeaver.
33. **Puerto BD cambiado a 5433** — `docker-compose.dev.yml` cambió de `5432:5432` a `5433:5432` para evitar conflicto con `maxanbotdb` en el servidor. `backend/.env` actualizado con `DB_PORT=5433`.
34. **`\restrict` y `\unrestrict` de pg_dump 16** — pg_dump 16 agrega meta-comandos psql `\restrict`/`\unrestrict` que no son SQL válido y causaban syntax error en DBeaver. Solución: filtro stream que remueve líneas que empiezan con `\restrict` o `\unrestrict`.
35. **POST /api/auth/seed-admin** — endpoint para crear admin inicial en producción (alternativa a `/register`). Crea empresa + usuario admin + asigna rol Administrador. Útil cuando el flujo first-run no está disponible.
36. **Backend .env DB_PORT corregido** — `backend/.env` tenía `DB_PORT=5433` pero el contenedor PostgreSQL en desarrollo usaba `5432:5432` (no el `5433:5432` del compose). Corregido a `DB_PORT=5432`.
37. **HelpdeskNav oculto en /recursos** — el nav solo se mostraba cuando `cliente` estaba seleccionado (`{cliente && <HelpdeskNav />}`), pero pestañas como "Todos los Recursos" y "Categorías" no requieren cliente. Solución: cambiar a siempre mostrar `<HelpdeskNav />` (las pestañas ya se filtran internamente).
38. **CasoDetalle sin modo edición** — no había forma de editar campos del caso (título, descripción, categoría, técnico, contacto). Se agregó botón "Editar" con toggle inline siguiendo el patrón de RecursoDetalle. Guarda vía `PUT /helpdesk/casos/:id`.
39. **helpdesk.contactos movido a generales.contactos** — la tabla de contactos estaba en `helpdesk` pero es necesaria para CRM y otros módulos. Se creó schema `generales`, se migró la tabla y se actualizaron FKs y rutas. Migración en `db/migrar_contactos_a_generales.sql`.
40. **Edición de detalles de caso** — se agregó `PUT /helpdesk/casos/:id/detalles/:detalleId` con UPDATE dinámico. Cada detalle en la bitácora es editable inline (contenido, tipo, fecha, recurso asociado). Validación: fecha del detalle >= fecha de creación del caso.
41. **Nuevos tipos de detalle** — se agregaron "Novedad" y "Observaciones" a la CHECK constraint de `helpdesk.caso_detalles.tipo`.
42. **Recurso asociado a detalle** — columna `recurso_id` en `helpdesk.caso_detalles` (FK → `helpdesk.recursos`). Al crear o editar un detalle se puede seleccionar un recurso vinculado al caso.
43. **Asignación de cliente en Casos.tsx** — columna "Cliente" clickeable que abre modal de búsqueda de terceros para asignar/cambiar cliente. Si hay cliente en HelpdeskContext, se asigna automáticamente. Checkbox "Sin cliente" en filtros.
44. **UPDATE dinámico en casos** — `actualizar` en `casosController.js` ahora solo actualiza los campos enviados en el body, evitando que campos no enviados se pongan NULL.
45. **Requerimiento de SQL habilitado** — se habilitó `require('pg').defaults.parseInt8 = true` para que los IDs grandes no pierdan precisión al serializarse como número.
46. **Tipos de detalle como maestro** — se creó `helpdesk.tipos_detalle` (id, nombre, color) con FK desde `caso_detalles.tipo`, reemplazando el CHECK constraint. CRUD backend + página `/helpdesk/tipos-detalle` con admin visual. Migración `23_tipos_detalle.sql`.
47. **Configuración Helpdesk** — nueva página `/helpdesk/configuracion` con cards de acceso a Categorías, Tipos de Detalle y Todos los Recursos. HelpdeskNav simplificado: se eliminaron esas 3 pestañas individuales + Mantenimientos, reemplazadas por una sola pestaña "Configuración".

## Cálculo de utilidad (`vw_utilidad_productos`)
- **costo_adquisiciones** = SUM(entradas.cantidad × costo_unitario) — todo lo que entró a inventario (gastos Suministros que generan entrada via trigger)
- **ingreso_ventas** = SUM(ventas_items.valor_linea) donde el ítem fue consumido (via salidas)
- **otros_costos** = SUM(gastos.valor_total) con producto_id, **excluyendo** clasificacion = 'Suministros' (esos ya están en costo_adquisiciones)
- **utilidad** = ingreso_ventas - costo_adquisiciones - otros_costos
- **Importante**: los gastos Suministros crean TANTO un gasto como una entrada de inventario. El gasto Suministros no debe contarse en otros_costos para evitar doble conteo del costo de adquisición.

## Vinculación gastos operativos a items de venta

Un gasto operativo (ej: "Transporte para mantenimiento") se puede vincular a un `venta_item_id` específico para que su costo se refleje SOLO contra esa línea de factura, no contra todas las ventas de ese producto.

### Cómo funciona
- `gastos.gastos.venta_item_id` → FK a `facturacion.ventas_items(id)`
- Excluyente: no puede tener `producto_id` Y `venta_item_id` al mismo tiempo (CHECK constraint)
- `vw_utilidad_items` suma `SUM(gastos.valor_total) WHERE venta_item_id IS NOT NULL` como `costo_directo` por línea

### Frontend: Gastos.tsx
- Tabla con filtros y filas clickeables para editar en modal
- Botón "Producto" por fila → modal VinculoProductoModal
- El formulario de creación está en `/financiero/nuevo-gasto` (NuevoGasto.tsx)

### Frontend: VentasItems.tsx (página `/ventas-items`)
- Columnas: Fecha, Venta, #, Descripción, Cliente, Cant, Vr Unit, Total, **Acción**
- Botones en Acción:
  - **Producto**: modal para seleccionar producto → hace `PUT /api/ventas/items/:id` (producto_id) + `POST /api/inventario/consumir` (FIFO)
  - **Ver**: navega a `/factura/:id`
  - **Gastos**: navega a `/ventas-items/:id/gastos`
- Ya NO tiene columna Producto dropdown ni botón Consumir en la tabla

### Nueva página: `/ventas-items/:id/gastos`
- Componente: `pages/GastosPorVentaItem.tsx`
- Muestra info del item de venta (factura, cliente, descripción, valor)
- **Tabla 1**: Gastos vinculados (`GET /api/gastos?venta_item_id=X`), cada fila con botón "Desvincular"
- **Tabla 2**: Gastos sin vínculo (`GET /api/gastos?sin_vinculo=true`), cada fila con botón "Vincular"
- Entre ambas tablas: filtros de búsqueda por descripción + rango de fechas para gastos sin vincular
- Filas clickeables: abren modal para editar el gasto (fecha, clasificación, descripción, valor unitario, cantidad)
- Vincular/Desvincular usa `PUT /api/gastos/:id/vincular` con body `{ venta_item_id: X|null }`

### Backend: gastosController.js
- `GET /api/gastos` — nuevos filtros: `?venta_item_id=X`, `?sin_vinculo=true`
- `PUT /api/gastos/:id` — ahora actualiza `venta_item_id` también (con validación mutex producto_id)
- `PUT /api/gastos/:id/vincular` — endpoint dedicado para vincular/desvincular (solo actualiza venta_item_id, sin validaciones de otros campos)

## Migración CSV a Gastos

Script en `backend/scripts/importar-gastos-csv.js` para importar gastos desde archivos CSV bancarios.

### Formato esperado del CSV
- Delimitador: `;` (punto y coma)
- Columnas: `Fecha;Descripcion;Valor`
- Fecha: formato `DD-mmm` (ej. `6-may`, `21-jun`) — mes en español abreviado (ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic)
- Valor: formato `$ X.XXX` (pesos colombianos con . como separador de miles)
- Primera línea = encabezado (se salta)
- Año = año actual del sistema
- Clasificación asignada: `Administrativo`

### Cómo usar
```bash
cd backend
node scripts/importar-gastos-csv.js
```

### Para importar otro archivo CSV
1. Colocar el archivo en `Archivos/`
2. Editar `backend/scripts/importar-gastos-csv.js`:
   - Cambiar `csvName` con el nombre del archivo
   - Si el formato cambia (clasificación diferente, columnas distintas), ajustar el parseo
3. Ejecutar: `node scripts/importar-gastos-csv.js`

## Comandos
```bash
# Levantar BD
docker-compose -f docker-compose.dev.yml up postgres

# Backend (puerto 3000)
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Consultar BD
docker exec -it maxan_db_dev psql -U maxan_user -d maxan_erp

# Limpiar BD
docker exec -it maxan_db_dev psql -U maxan_user -d maxan_erp -c "TRUNCATE TABLE facturacion.factura_archivos, facturacion.factura_impuestos, facturacion.factura_respuestas_dian, facturacion.ventas_items, facturacion.ventas, generales.terceros, compras.facturas_compra_archivos, compras.facturas_compra, gastos.gastos, inventario.salida_detalle, inventario.salidas, inventario.entradas, inventario.productos, inventario.categorias CASCADE;"

# Backup BD (dump completo: DROP+CREATE+INSERT, ejecutable en DBeaver)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/backup/descargar -o backup.sql

# Restaurar backup en producción
# Abrir backup.sql en DBeaver y ejecutar como script en la BD de producción
# O desde consola:
docker exec -i maxan_db_dev psql -U maxan_user -d maxan_erp < backup.sql

# Restaurar backup en producción
# Abrir backup.sql en DBeaver y ejecutar como script en la BD de producción
# O desde consola:
docker exec -i maxan_db_dev psql -U maxan_user -d maxan_erp < backup.sql
```

## Conexión BD (desarrollo)
- Host: localhost:5433 (mapeado desde contenedor maxan_db_dev)
- User: maxan_user
- Pass: dev_password_segura
- DB: maxan_erp
- Schema: facturacion, compras, inventario, gastos, cartera, usuarios, generales, helpdesk, public

## Notion
- Token almacenado en `D:\Desarrollos\maxan-erp\.env` como `NOTION_TOKEN`
- Usar variable de entorno `$env:NOTION_TOKEN` en scripts

## Módulo Helpdesk

### Schema `helpdesk` (db/16_helpdesk_schema.sql, db/17_helpdesk_atributos.sql)
- **categorias_mantenimiento** — 7 categorías: Preventivo, Correctivo, Instalación, Diagnóstico, Remoto, Formateo, Redes
- **recursos** — Equipos informáticos de clientes (Computador, Hosting, Office 365, Red, etc.)
  - FK: `cliente_id` → `generales.terceros(id)`
  - `serial` UNIQUE para detección de duplicados
  - `tipo` FK → `helpdesk.tipos_recurso(nombre)` (tabla maestra, adminitrable desde `/nuevo-recurso`)
  - Columnas fijas: marca, modelo, serial, procesador, memoria_gb, almacenamiento_gb, sistema_operativo
  - `atributos JSONB` — Campos variables según el tipo (tipo_almacenamiento, chip_video, memoria_video_mb, plan, licencias, fecha_vencimiento, proveedor, dominio, IP, firmware, etc.)
- **tipos_recurso** — Maestro de tipos (Computador, Hosting, Office 365, Red, Celular, Impresora, Servidor, UPS, Cámara, Otro). CRUD via modal ⚙ en `/nuevo-recurso`.
- **mantenimientos** — Tickets/casos de soporte vinculados a un recurso
  - Estados: Pendiente → En Progreso → Completado → Facturado / Cancelado
  - Costos: mano_obra + repuestos = costo_total (GENERATED ALWAYS)
  - Vincular a `facturacion.ventas_items` para facturación
- **mantenimiento_detalles** — Bitácora de cada mantenimiento (comentarios, diagnóstico, solución, repuestos)

### Seed desde Notion
La migración `16_helpdesk_schema.sql` incluye:
- 14 clientes como `generales.terceros` (Gestión Calidad, Transglobal, Montacargas, Promatel, etc.)
- 35+ recursos informáticos migrados desde la base de Notion "Recursos Informáticos"

### Backend — Rutas
| Endpoint | Método | Permiso | Descripción |
|----------|--------|---------|-------------|
| `/api/helpdesk/recursos` | GET | `helpdesk.ver` | Listar recursos (filtros: `q`, `cliente_id`, `tipo`) |
| `/api/helpdesk/recursos/:id` | GET | `helpdesk.ver` | Obtener recurso |
| `/api/helpdesk/recursos` | POST | `helpdesk.gestionar` | Crear recurso |
| `/api/helpdesk/recursos/:id` | PUT | `helpdesk.gestionar` | Actualizar recurso |
| `/api/helpdesk/recursos/:id` | DELETE | `helpdesk.gestionar` | Eliminar recurso |
| `/api/helpdesk/recursos/script` | GET | `helpdesk.ver` | Generar script PowerShell para detectar PC (query params: `?session=UUID&cliente_id=X`, `?format=bat`) |
| `/api/helpdesk/recursos/detectar-pc` | POST | **Público** (sin auth) | Recibir datos desde script PS — almacena en memoria con `session_code` |
| `/api/helpdesk/recursos/detectar-pc/pending/:session_code` | GET | `helpdesk.ver` | Obtener datos pendientes de detección del PC |
| `/api/helpdesk/mantenimientos` | GET/POST | `helpdesk.ver`/`.gestionar` | CRUD mantenimientos |
| `/api/helpdesk/mantenimientos/:id` | GET/PUT | `helpdesk.ver`/`.gestionar` | CRUD mantenimientos |
| `/api/helpdesk/detalles/:mantenimiento_id` | GET/POST | `helpdesk.ver`/`.gestionar` | Bitácora de mantenimiento |
| `/api/helpdesk/categorias-mantenimiento` | GET | `helpdesk.ver` | Listar categorías |
| `/api/helpdesk/casos` | GET/POST | `helpdesk.casos.ver`/`.gestionar` | CRUD casos de soporte (POST acepta `recurso_ids[]`) |
| `/api/helpdesk/casos/:id` | GET/PUT | `helpdesk.casos.ver`/`.gestionar` | Obtener/editar caso (PUT acepta `recurso_ids[]` para reemplazar vínculos) |
| `/api/helpdesk/casos/:id/estado` | PATCH | `helpdesk.casos.gestionar` | Cambiar estado + registrar solución |
| `/api/helpdesk/casos/:id/detalles` | GET/POST | `helpdesk.casos.ver`/`.gestionar` | Bitácora del caso |
| `/api/helpdesk/casos/:id/recursos` | GET | `helpdesk.casos.ver` | Listar recursos vinculados al caso |
| `/api/helpdesk/casos/:id/detalles/:detalleId` | PUT | `helpdesk.casos.gestionar` | Editar detalle (contenido, tipo, created_at, recurso_id). Validación: created_at >= caso.created_at. UPDATE dinámico. |
| `/api/helpdesk/casos/:id/recursos` | GET | `helpdesk.casos.ver` | Listar recursos vinculados al caso |
| `/api/helpdesk/casos/:id/recursos` | POST | `helpdesk.casos.gestionar` | Vincular recurso(s) al caso (`{ recurso_ids: [1,2] }`) |
| `/api/helpdesk/casos/:id/recursos/:recurso_id` | DELETE | `helpdesk.casos.gestionar` | Desvincular recurso del caso |
| `/api/generales/contactos` | GET/POST | `helpdesk.casos.ver`/`.gestionar` | CRUD contactos de clientes (uso cross-module) |
| `/api/generales/contactos/:id` | GET/PUT/DELETE | `helpdesk.casos.ver`/`.gestionar` | CRUD contacto individual |
| `/api/helpdesk/contactos` | GET/POST | `helpdesk.casos.ver`/`.gestionar` | CRUD contactos (compatibilidad, tabla en generales) |
| `/api/helpdesk/contactos/:id` | GET/PUT/DELETE | `helpdesk.casos.ver`/`.gestionar` | CRUD contacto individual (compatibilidad) |
| `/api/helpdesk/categorias-caso` | GET/POST | `helpdesk.casos.ver`/`.gestionar` | Categorías editables de caso |
| `/api/helpdesk/categorias-caso/:id` | PUT/DELETE | `helpdesk.casos.gestionar` | Editar/eliminar categoría |
| `/api/helpdesk/tipos-recurso` | GET | `helpdesk.ver` | Listar tipos de recurso |
| `/api/helpdesk/tipos-recurso` | POST | `helpdesk.gestionar` | Crear tipo de recurso |
| `/api/helpdesk/tipos-recurso/:id` | DELETE | `helpdesk.gestionar` | Eliminar tipo de recurso (solo si no está en uso) |
| `/api/helpdesk/tipos-detalle` | GET | `helpdesk.casos.ver` | Listar tipos de detalle (Comentario, Diagnóstico, etc.) |
| `/api/helpdesk/tipos-detalle` | POST | `helpdesk.casos.gestionar` | Crear tipo de detalle (nombre + color) |
| `/api/helpdesk/tipos-detalle/:id` | DELETE | `helpdesk.casos.gestionar` | Eliminar tipo de detalle (solo si no está en uso) |

### Frontend — Páginas
| Ruta | Componente | Permiso | Descripción |
|------|-----------|---------|-------------|
| `/helpdesk` | `Clientes.tsx` | `helpdesk.ver` | Seleccionar cliente para trabajar |
| `/helpdesk/clientes/:id` | `ClienteDetalle.tsx` | `helpdesk.ver` | Recursos del cliente |
| `/helpdesk/recursos` | `Recursos.tsx` | `helpdesk.ver` | Listado de recursos con columnas: Nombre, Cliente, Tipo, Marca, Modelo, Serial, Estado (Activo/Inactivo), Observaciones. Botones + Nuevo y + Detectar PC. |
| `/helpdesk/recursos/:id` | `RecursoDetalle.tsx` | `helpdesk.ver` | Detalle del equipo + historial de mantenimientos + **casos de soporte vinculados**. Modo edición con campos fijos y `atributos` (tipo disco, chip video, VRAM). Botón Eliminar solo para admins (`usuarios.gestionar`). |
| `/helpdesk/nuevo-recurso` | `NuevoRecurso.tsx` | `helpdesk.gestionar` | Formulario completo para crear cualquier tipo de recurso. Select tipo desde API + ⚙ para administrar tipos. |
| `/helpdesk/obtener-pc` | `RegistrarPC.tsx` | `helpdesk.gestionar` | Detectar PC: script PS + formulario manual. Cliente desde contexto (no dropdown). |
| `/helpdesk/casos` | `Casos.tsx` | `helpdesk.casos.ver` | Listado de casos con filtros (búsqueda, estado, **checkbox "Sin cliente"**), tabla con #, título, **cliente clickeable (modal asignación)**, recursos, categoría, técnico, estado. Si hay cliente en contexto, se asigna automáticamente al hacer clic. |
| `/helpdesk/casos/nuevo` | `CasoNuevo.tsx` | `helpdesk.casos.gestionar` | Formulario crear caso: título, descripción, categoría, técnico, cliente con búsqueda, **recursos multiselect** filtrado por cliente. |
| `/helpdesk/casos/:id` | `CasoDetalle.tsx` | `helpdesk.casos.ver` | Detalle del caso con **recursos vinculados (chips + desvincular)**, bitácora, cambio de estado (Iniciar/Completar/Cancelar), campo de solución al cerrar. Botón "+ Vincular recurso" con selector. **Modo edición inline** (título, descripción, categoría, técnico, contacto, fecha de creación) con botón "Editar" para usuarios con `helpdesk.casos.gestionar`. **Detalles editables inline** (contenido, tipo, fecha, recurso asociado). Tipos cargados desde API: Comentario, Diagnóstico, Solución, Acuerdo, Sistema, Novedad, Observaciones. |
| `/helpdesk/categorias-caso` | `CategoriasCaso.tsx` | `helpdesk.casos.gestionar` | Administrar categorías (agregar/eliminar con selector de color). |
| `/helpdesk/tipos-detalle` | `TiposDetalle.tsx` | `helpdesk.casos.gestionar` | Administrar tipos de detalle (agregar/eliminar con selector de color). |
| `/helpdesk/configuracion` | `ConfiguracionHelpdesk.tsx` | `helpdesk.ver` | Página de configuración Helpdesk con cards de acceso a Categorías, Tipos de Detalle y Todos los Recursos. |

### Permisos (seed automático)
| Código | Módulo | Descripción |
|--------|--------|-------------|
| `helpdesk.ver` | Helpdesk | Ver recursos y mantenimientos |
| `helpdesk.gestionar` | Helpdesk | Crear/editar recursos y mantenimientos |
| `helpdesk.casos.ver` | Helpdesk | Ver casos de soporte |
| `helpdesk.casos.gestionar` | Helpdesk | Crear/editar/cerrar casos de soporte |

### Flujo Detectar PC
1. Técnico abre `/helpdesk/obtener-pc` (requiere cliente seleccionado en HelpdeskContext, si no hay muestra link para seleccionar)
2. Presiona **"Obtener script"**
3. Se genera un `session_code` UUID único via `crypto.randomUUID()`, se pasa como `?session=UUID&cliente_id=X` al backend, y el script PowerShell se copia al portapapeles (o se descarga como `.bat`)
4. En el PC del cliente: PowerShell como Administrador → pegar → Enter
5. Script recolecta: nombre PC, serial (BIOS), marca, modelo, procesador, RAM, disco, SO, tipo disco (SSD/HDD), chip de video, VRAM
6. Envía vía `POST /api/helpdesk/recursos/detectar-pc` (endpoint **público**, sin JWT)
7. Backend **NO guarda en BD** — almacena los datos en un `Map` en memoria indexado por `session_code`
8. Backend verifica si el serial ya existe en BD y lo informa en la respuesta
9. Técnico presiona **"Ya ejecuté el script"** → `GET /api/helpdesk/recursos/detectar-pc/pending/:session_code`
10. Se muestran los datos detectados en pantalla con advertencia si el serial ya existe
11. Técnico revisa y presiona **"Guardar equipo"** → `POST /api/helpdesk/recursos` (autenticado, requiere `helpdesk.gestionar`)
12. Opcional: "Editar datos antes de guardar" abre formulario manual pre-cargado
13. Formulario manual siempre disponible como alternativa (Opción 2)

### Notas técnicas del script
- El endpoint `GET /script` devuelve PowerShell plano por defecto. Con `?format=bat` devuelve un wrapper `.bat` que usa `-EncodedCommand` con Base64 en UTF-16LE para evitar problemas de escaping en CMD.
- El `.bat` invoca: `powershell -ExecutionPolicy Bypass -NoProfile -EncodedCommand <base64>`
- El script incluye `Read-Host "Presiona Enter para salir"` al final para mantener la ventana abierta.
- Datos no reclamados se limpian automáticamente después de 30 minutos.
- Detección de tipo de disco (SSD/HDD) vía `MSFT_PhysicalDisk` (fallback a `Win32_DiskDrive`).
- Detección de chip de video + VRAM vía `Win32_VideoController`.

### Página global de recursos (`/recursos`)
- Ruta **standalone** fuera de `/helpdesk/*`, sin necesidad de cliente seleccionado en HelpdeskContext
- Muestra **todos** los recursos independientemente del cliente
- Usa `HelpdeskLayout` sin `HelpdeskProvider` (el provider se inyecta pero sin cliente)
- Columna "Cliente" clickeable (requiere `helpdesk.gestionar`) → modal con búsqueda de clientes para **asignar/cambiar** el cliente
- Filtro por texto + checkbox "Solo sin cliente"
- Guarda vía `PUT /api/helpdesk/recursos/:id` con todos los campos del recurso
- Pestaña "Todos los Recursos" en `HelpdeskNav` visible siempre que se tenga `helpdesk.ver`, sin depender de cliente seleccionado
- **Backend**: los endpoints `listar`, `obtener` y `detectarPC` usan `LEFT JOIN` en lugar de `JOIN` para incluir recursos sin cliente (`cliente_id IS NULL`)

## Problemas resueltos (continuación)
48. **Backup sin schema generales** — `SCHEMAS_TO_DROP` en `backup.js` no incluía `generales`, causando error al restaurar si la tabla `contactos` ya existía. Se agregó `"generales"` al array.
49. **CasoDetalle null check** — `caso.cliente_id` podía ser null causando error TS. Se cambió a `caso?.cliente_id ?? null`.
50. **Detectar PC 308 redirect** — el script PowerShell usaba `http://` porque nginx sobrescribía `X-Forwarded-Proto` con `$scheme` (http). Solución: `app.set('trust proxy', true)` en backend, prioridad a `x-forwarded-proto` header, nginx preserva header original del proxy externo, y variable de entorno `PUBLIC_URL` como override.
51. **Terceros sin identificación** — `tipo_documento` y `numero_documento` eran obligatorios. Migración `24_terceros_documento_opcional.sql` los hace opcionales + índice parcial UNIQUE. Backend y frontend actualizados para permitir crear terceros solo con nombre.
52. **Terceros movido a schema generales** — `facturacion.terceros` migrado a `generales.terceros` para consistencia cross-module. Schema `01_schema.sql` actualizado, 10 controladores backend corregidos (~37 sentencias SQL), script `db/migrar_terceros_a_generales.sql` para BD existentes.
53. **Formulario de gasto movido a página separada** — el formulario "Nuevo Gasto" se eliminó de `Gastos.tsx` y se movió a `NuevoGasto.tsx` en `/financiero/nuevo-gasto` (bajo Layout financiero). La tabla de gastos ahora ocupa todo el alto sin scroll vertical. Botón "+ Nuevo Gasto" en el header. Sección Producto cambió de `<select>` a input búsqueda + lista filtrada que se repliega a badge al seleccionar. Formulario reorganizado en 4 secciones visuales con `border-b`.
54. **Header financiero cambió "← Inicio" por "← Atrás"** — `components/Layout.tsx` ahora usa `navigate(-1)` en lugar de `navigate("/")` para mejor navegación contextual.
55. **Secuencia terceros eliminada por CASCADE** — la migración `migrar_terceros_a_generales.sql` usaba `LIKE ... INCLUDING DEFAULTS` que copiaba el default apuntando a `facturacion.terceros_id_seq`, luego `DROP TABLE ... CASCADE` eliminaba esa secuencia. Solución: después del DROP, crear secuencia `generales.terceros_id_seq` y hacer `ALTER TABLE ... SET DEFAULT`. Fix agregado a la migración y script `db/fix_produccion.sql` para producción.
56. **NIT null en NuevaVenta** — `!nit.trim()` fallaba cuando `nit` es null (terceros sin identificación). Cambiado a `!(nit ?? "").trim()` en `NuevaVenta.tsx:604`.
57. **Dropdown de productos cortado por overflow** — el dropdown de productos en NuevaVenta se renderizaba dentro de la tabla con `overflow-x-auto`, que el navegador convierte a `overflow: auto` para ambos ejes, cortando el dropdown. Solución: renderizar el dropdown via `createPortal` a `document.body` con `position: fixed`.
58. **Utilidad: página rediseñada** — se eliminó el tab "Por Producto", ahora solo muestra "Por Factura" con listado completo de facturas, búsqueda por N° o cliente, ordenación por columnas clickeando encabezados. Nuevo endpoint `GET /api/facturacion/utilidad/facturas?q=`.
59. **NuevaVenta: soporte "Sin documento"** — se agregó opción "Sin documento" al select Tipo doc. Al seleccionar cliente, el tipo doc se actualiza automáticamente según sus datos (o queda vacío si no tiene). Al guardar con "Sin documento", el backend envía `tipo_documento=NULL` y `numero_documento=NULL` sin `ON CONFLICT` (el índice parcial único los ignora cuando son NULL). Frontend: `NuevaVenta.tsx`, Backend: `ventasController.js`.
60. **Eliminar venta sin factura** — se agregó `DELETE /api/ventas/:id` (protegido con `ventas.crear`, solo si `cufe IS NULL`). En transacción: desvincula gastos/helpdesk, elimina salidas, items y venta. Botón "Eliminar venta" en el formulario de edición `NuevaVenta.tsx` (solo en modo edición), redirige a `/financiero/facturas` tras eliminar. Eliminado el botón de `VentasItems.tsx`. Backend: `ventasController.remove()`, ruta en `routes/ventas.js`.
