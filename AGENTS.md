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
- **Productos** — `routes/productos.js` → `POST/GET/PUT /api/productos`, `GET/POST/DELETE /api/productos/categorias`
- **Gastos** — `routes/gastos.js` → `POST/GET /api/gastos`, `PUT /api/gastos/:id` (crear y editar gasto manual), filtro `?producto_id=`
- **Compras** — `routes/compras.js` → `POST /api/compras/upload` (multer + reuso de `parseInvoiceXML`), `POST /api/compras/parsear-xml` (solo parseo, sin guardar), `GET /api/compras`
  - Al guardar una compra, por cada línea crea un gasto en `gastos.gastos` y por cada impuesto (>0) crea un gasto adicional distribuido proporcionalmente según `item.valor_linea / subtotal_total`
- **Inventario** — `routes/inventario.js` → `GET /api/inventario/stock`, `GET /api/inventario/movimientos/:producto_id`, `POST /api/inventario/consumir` (FIFO transaccional)
- **Ventas** — `routes/ventas.js` → `GET /api/ventas/items`, `PUT /api/ventas/items/:id` (asignar producto_id), `POST /api/ventas` (crear)
- **Utilidad** — `routes/facturacion.js` → `GET /api/facturacion/:factura_id/utilidad`, `GET /api/facturacion/utilidad/productos`
- **Categorías** — `routes/categorias.js` → `GET/POST/DELETE /api/productos/categorias` (maestro de categorías)
- **Dashboard** — `routes/dashboard.js` → `GET /api/dashboard` con filtros `?mes=&cliente_id=&factura_id=`
  - Retorna: resumen, ventas_por_mes, gastos_por_mes, gastos_por_clasificacion, top_clientes, ultimas_facturas, clientes, productos_utilidad
- **Cartera/Pagos** — `routes/cartera.js` → `GET /api/cartera/activa` (aging A/R), `POST/GET /api/cartera/pagos` (crear/listar), `GET /api/cartera/pagos/:id` (detalle), `POST /api/cartera/pagos/:id/anular`, `GET /api/cartera/clientes-deuda` (clientes con saldo), `GET /api/cartera/clientes-deuda/:id/facturas` (facturas pendientes), `GET/POST /api/cartera/medios-pago`

## Frontend módulos (implementados)
- `pages/Dashboard.tsx` — Página principal `/` con cards de resumen, barras ventas/gastos/clasificación, top clientes, últimas facturas, utilidad por producto. Filtros: mes (select últimos 12 meses), cliente, factura ID.
- `pages/Productos.tsx` — Listado de catálogo con filtros (búsqueda + categoría), tabla, formulario crear/editar abajo, links a Stock y Gastos
- `pages/Gastos.tsx` — Listado con filtros (descripción + rango fechas + producto_id por URL), scroll vertical, fila clickeable para editar en formulario inferior, formulario integrado crear/editar, Ctrl+G shortcut, quick-create product modal con checkbox inventariable
- `pages/Compras.tsx` — Listado de facturas compra
- `pages/NuevaCompra.tsx` — Subir XML de compra con preview + botón guardar (paso doble: parsear → mostrar → guardar)
- `pages/Inventario.tsx` — Stock desde `vw_stock_disponible`
- `pages/VentasItems.tsx` — Items de venta con filtros, dropdown de producto por fila + botón Consumir stock (PUT item + POST consumir), badge "Consumido"
- `pages/Utilidad.tsx` — Dos tabs: Por Producto (tabla desde vw_utilidad_productos) y Por Factura (input ID + resumen + detalle líneas)
- `pages/Cartera.tsx` — `/cartera` Tabla cartera activa con aging (días vencido coloreado, totales), filtros (cliente, estado), modal rápido para registrar pago con distribución por factura
- `pages/Pagos.tsx` — `/cartera/pagos` Historial de pagos recibidos con detalle lateral y botón anular
- `pages/NuevoPago.tsx` — `/cartera/nuevo-pago` Página dedicada paso a paso (cliente → facturas → confirmar)
- `context/ApiContext.tsx` — Métodos: `get`, `post`, `put`, `del`, `postXml`, `upload`

## Schemas SQL
- `db/01_schema.sql` — Schema `facturacion` (aplicado)
- `db/02_compras_gastos_inventario.sql` — Schemas `compras`, `inventario`, `gastos` con tablas, triggers, vistas (`vw_stock_disponible`, `vw_utilidad_items`, `vw_utilidad_productos`) — **YA aplicado**
- Migraciones aplicadas: `03_codigo_producto.sql`, `03_rename_facturas_ventas.sql`, `04_categorias_codigo_producto.sql`, `05_trigger_update_gasto.sql`, `06_trigger_clasificacion.sql`, `07_ventas_producto_utilidad.sql`, `08_cartera_pagos.sql`

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

## Cálculo de utilidad (`vw_utilidad_productos`)
- **costo_adquisiciones** = SUM(entradas.cantidad × costo_unitario) — todo lo que entró a inventario (gastos Suministros que generan entrada via trigger)
- **ingreso_ventas** = SUM(ventas_items.valor_linea) donde el ítem fue consumido (via salidas)
- **otros_costos** = SUM(gastos.valor_total) con producto_id, **excluyendo** clasificacion = 'Suministros' (esos ya están en costo_adquisiciones)
- **utilidad** = ingreso_ventas - costo_adquisiciones - otros_costos
- **Importante**: los gastos Suministros crean TANTO un gasto como una entrada de inventario. El gasto Suministros no debe contarse en otros_costos para evitar doble conteo del costo de adquisición.

## Lo que sigue (pendiente)
1. Backend: probar todos los endpoints nuevos a fondo
2. Módulo cartera/pagos: añadir dashboard de cartera al endpoint `/api/dashboard` (totales de cartera activa, vencidos)

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
