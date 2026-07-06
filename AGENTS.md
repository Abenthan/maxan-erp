# Contexto del proyecto: maxan-erp

## Estado actual
- Sistema de facturación electrónica DIAN UBL 2.1 funcional
- Backend: Node.js + Express 5 + PostgreSQL (pg, sin ORM) en puerto 3000
- Frontend: React 19 + TypeScript 6 + Tailwind CSS 4 + Vite 8
- UI: Sidebar lateral con grupos (VENTAS azul, COSTOS naranja, CARTERA púrpura, INVENTARIO verde) + header, Tailwind puro
- BD vacía (todos los registros borrados)

## Sidebar (Layout.tsx)
```
📊 Dashboard
── VENTAS ──        (bg-blue-50)
  📄 Facturación
  📋 Ventas Items
  ➕ Nueva Venta
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
- **Clientes** — `routes/terceros.js` → `GET /api/terceros` (con filtro `?q=` y `?tipo_documento=`), `GET /api/terceros/:id`, `POST /api/terceros` (crear/upsert), `PUT /api/terceros/:id`, `DELETE /api/terceros/:id`
- **Productos** — `routes/productos.js` → `POST/GET/PUT /api/productos`, `GET/POST/DELETE /api/productos/categorias`
- **Gastos** — `routes/gastos.js` → `POST/GET /api/gastos`, `PUT /api/gastos/:id`, `PUT /api/gastos/:id/vincular` (vincular/desvincular a venta_item_id), filtros `?producto_id=`, `?venta_item_id=`, `?sin_vinculo=true`
- **Clasificaciones de Gasto** — `routes/clasificacionesGasto.js` → `GET/POST/DELETE /api/gastos/clasificaciones` (maestro como categorías de producto, con FK en `gastos.gastos.clasificacion`)
- **Compras** — `routes/compras.js` → `POST /api/compras/upload` (multer + reuso de `parseInvoiceXML`), `POST /api/compras/parsear-xml` (solo parseo, sin guardar), `GET /api/compras`
  - Al guardar una compra, por cada línea crea un gasto en `gastos.gastos` y por cada impuesto (>0) crea un gasto adicional distribuido proporcionalmente según `item.valor_linea / subtotal_total`
- **Inventario** — `routes/inventario.js` → `GET /api/inventario/stock`, `GET /api/inventario/movimientos/:producto_id`, `POST /api/inventario/consumir` (FIFO transaccional)
- **Ventas** — `routes/ventas.js` → `GET /api/ventas/items`, `PUT /api/ventas/items/:id` (asignar producto_id), `POST /api/ventas` (crear)
- **Utilidad** — `routes/facturacion.js` → `GET /api/facturacion/:factura_id/utilidad`, `GET /api/facturacion/utilidad/productos`
- **Categorías** — `routes/categorias.js` → `GET/POST/DELETE /api/productos/categorias` (maestro de categorías)
- **Dashboard** — `routes/dashboard.js` → `GET /api/dashboard` con filtros `?mes=&cliente_id=&factura_id=`
  - Retorna: resumen, ventas_por_mes, gastos_por_mes, gastos_por_clasificacion, top_clientes, ultimas_facturas, clientes, productos_utilidad
- **Cartera/Pagos** — `routes/cartera.js` → `GET /api/cartera/activa` (aging A/R), `POST/GET /api/cartera/pagos` (crear/listar), `GET /api/cartera/pagos/:id` (detalle), `PUT /api/cartera/pagos/:id` (editar fecha/medio/referencia/observaciones), `POST /api/cartera/pagos/:id/anular`, `GET /api/cartera/clientes-deuda` (clientes con saldo), `GET /api/cartera/clientes-deuda/:id/facturas` (facturas pendientes), `GET/POST /api/cartera/medios-pago`, `GET /api/cartera/retenciones` (listado de retenciones realizadas)

## Frontend módulos (implementados)
- `pages/Dashboard.tsx` — Página principal `/` con cards de resumen, barras ventas/gastos/clasificación, top clientes, últimas facturas, utilidad por producto. Filtros: mes (select últimos 12 meses), cliente, factura ID.
- `pages/Productos.tsx` — Listado de catálogo con filtros (búsqueda + categoría), tabla, formulario crear/editar abajo, links a Stock y Gastos
- `pages/Gastos.tsx` — Listado con filtros (descripción + rango fechas + producto_id por URL), scroll vertical, fila clickeable para editar en modal, Ctrl+G shortcut, quick-create product modal con checkbox inventariable. Clasificación con select dinámico desde `/api/gastos/clasificaciones` + botón ⚙ para administrar (agregar/eliminar) clasificaciones. Default "Administrativo". Cantidad limitada a 2 decimales.
- `pages/Compras.tsx` — Listado de facturas compra
- `pages/NuevaCompra.tsx` — Subir XML de compra con preview + botón guardar (paso doble: parsear → mostrar → guardar)
- `pages/Inventario.tsx` — Stock desde `vw_stock_disponible`
- `pages/VentasItems.tsx` — Items de venta con filtros, dropdown de producto por fila + botón Consumir stock (PUT item + POST consumir), badge "Consumido"
- `pages/Utilidad.tsx` — Dos tabs: Por Producto (tabla desde vw_utilidad_productos) y Por Factura (input ID + resumen + detalle líneas)
- `pages/Terceros.tsx` — `/terceros` CRUD completo con tabla, filtro búsqueda, fila clickeable → modal edición, eliminar
- `pages/NuevoTercero.tsx` — `/nuevo-tercero` Formulario para crear nuevo tercero
- `pages/Cartera.tsx` — `/cartera` Tabla cartera activa con aging (días vencido coloreado, totales), filtro cliente como input texto (búsqueda en tiempo real por nombre/NIT), filtro estado, modal rápido para registrar pago con distribución por factura. Medio de pago limitado a Efectivo/Transferencia Bancaria, default Transferencia.
- `pages/Pagos.tsx` — `/cartera/pagos` Historial de pagos recibidos. Click en fila activa → modal de edición (fecha, medio, referencia, observaciones) con PUT. Botón anular preservado.
- `pages/NuevoPago.tsx` — `/cartera/nuevo-pago` Página dedicada paso a paso (cliente → facturas → confirmar)
- `pages/Retenciones.tsx` — `/cartera/retenciones` Listado de retenciones realizadas con total acumulado
- `context/ApiContext.tsx` — Métodos: `get`, `post`, `put`, `del`, `postXml`, `upload`

## Schemas SQL
- `db/01_schema.sql` — Schema `facturacion` (aplicado)
- `db/02_compras_gastos_inventario.sql` — Schemas `compras`, `inventario`, `gastos` con tablas, triggers, vistas (`vw_stock_disponible`, `vw_utilidad_items`, `vw_utilidad_productos`) — **YA aplicado**
- Migraciones aplicadas: `03_codigo_producto.sql`, `03_rename_facturas_ventas.sql`, `04_categorias_codigo_producto.sql`, `05_trigger_update_gasto.sql`, `06_trigger_clasificacion.sql`, `07_ventas_producto_utilidad.sql`, `08_cartera_pagos.sql`, `09_clasificaciones_gasto.sql`, `10_cufe_nullable.sql`, `11_retenciones_ventas_items.sql`

## Dependencias adicionales
- `multer` (upload XML en compras)
- `xlsx` (exportar Excel en facturas)

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

## Cálculo de utilidad (`vw_utilidad_productos`)
- **costo_adquisiciones** = SUM(entradas.cantidad × costo_unitario) — todo lo que entró a inventario (gastos Suministros que generan entrada via trigger)
- **ingreso_ventas** = SUM(ventas_items.valor_linea) donde el ítem fue consumido (via salidas)
- **otros_costos** = SUM(gastos.valor_total) con producto_id, **excluyendo** clasificacion = 'Suministros' (esos ya están en costo_adquisiciones)
- **utilidad** = ingreso_ventas - costo_adquisiciones - otros_costos
- **Importante**: los gastos Suministros crean TANTO un gasto como una entrada de inventario. El gasto Suministros no debe contarse en otros_costos para evitar doble conteo del costo de adquisición.

## Lo que sigue (pendiente)
1. Backend: probar todos los endpoints nuevos a fondo
2. Módulo cartera/pagos: añadir dashboard de cartera al endpoint `/api/dashboard` (totales de cartera activa, vencidos)

## Vinculación gastos operativos a items de venta

Un gasto operativo (ej: "Transporte para mantenimiento") se puede vincular a un `venta_item_id` específico para que su costo se refleje SOLO contra esa línea de factura, no contra todas las ventas de ese producto.

### Cómo funciona
- `gastos.gastos.venta_item_id` → FK a `facturacion.ventas_items(id)`
- Excluyente: no puede tener `producto_id` Y `venta_item_id` al mismo tiempo (CHECK constraint)
- `vw_utilidad_items` suma `SUM(gastos.valor_total) WHERE venta_item_id IS NOT NULL` como `costo_directo` por línea

### Frontend: Gastos.tsx
- Formulario incluye select anidado: "Factura de Venta" → "Item de Venta"
- Si se selecciona item de venta, se limpia producto_id (y viceversa)
- Guarda `venta_item_id` en POST y PUT

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
docker exec -it maxan_db_dev psql -U maxan_user -d maxan_erp -c "TRUNCATE TABLE facturacion.factura_archivos, facturacion.factura_impuestos, facturacion.factura_respuestas_dian, facturacion.ventas_items, facturacion.ventas, facturacion.terceros, compras.facturas_compra_archivos, compras.facturas_compra, gastos.gastos, inventario.salida_detalle, inventario.salidas, inventario.entradas, inventario.productos, inventario.categorias CASCADE;"
```

## Conexión BD
- Host: localhost:5432
- User: maxan_user
- Pass: dev_password_segura
- DB: maxan_erp
- Schema: facturacion, compras, inventario, gastos, cartera, public
