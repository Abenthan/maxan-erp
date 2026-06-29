# Contexto del proyecto: maxan-erp

## Estado actual
- Sistema de facturación electrónica DIAN UBL 2.1 funcional
- Backend: Node.js + Express 5 + PostgreSQL (pg, sin ORM) en puerto 3000
- Frontend: React 19 + TypeScript 6 + Tailwind CSS 4 + Vite 8
- UI: Sidebar lateral + header (Layout.tsx), Tailwind puro (sin librerías de componentes)

## Módulo facturación (NO MODIFICAR)
- Backend: `routes/facturas.js` — CRUD completo + parseo XML
- Frontend: `pages/Facturas.tsx` (lista con filtros, ordenación por columnas, exportar Excel), `Factura.tsx` (detalle), `NuevaFactura.tsx` (upload XML)
- Schema: `facturacion` en PostgreSQL

## Nuevos módulos backend
- **Productos** — `routes/productos.js` → `POST/GET /api/productos`
- **Gastos** — `routes/gastos.js` → `POST/GET /api/gastos`, `PUT /api/gastos/:id` (crear y editar gasto manual)
- **Compras** — `routes/compras.js` → `POST /api/compras/upload` (multer + reuso de `parseInvoiceXML`), `POST /api/compras/parsear-xml` (solo parseo, sin guardar), `GET /api/compras`
  - Al guardar una compra, por cada línea crea un gasto en `gastos.gastos` y por cada impuesto (>0) crea un gasto adicional distribuido proporcionalmente según `item.valor_linea / subtotal_total`
- **Inventario** — `routes/inventario.js` → `GET /api/inventario/stock`, `POST /api/inventario/consumir` (FIFO transaccional)
- **Utilidad** — `routes/facturacion.js` → `GET /api/facturacion/:factura_id/utilidad`

## Frontend módulos (implementados)
- `components/Layout.tsx` — Sidebar + header, navegación a todos los módulos
- `pages/Inicio.tsx` — Dashboard con tarjetas de módulos y estado BD
- `pages/Productos.tsx` — Listado de catálogo
- `pages/Gastos.tsx` — Listado con filtros (descripción + rango fechas), scroll vertical, fila clickeable para editar en el formulario inferior, formulario integrado para crear/editar gastos
- `pages/Compras.tsx` — Listado de facturas compra
- `pages/NuevaCompra.tsx` — Subir XML de compra con preview + botón guardar (paso doble: parsear → mostrar → guardar)
- `pages/Inventario.tsx` — Stock desde `vw_stock_disponible`
- `context/ApiContext.tsx` — Tiene métodos: `get`, `post`, `put`, `postXml`, `upload`

## Schemas SQL
- `db/01_schema.sql` — Schema `facturacion` (aplicado)
- `db/02_compras_gastos_inventario.sql` — Schemas `compras`, `inventario`, `gastos` con tablas, triggers, vistas (`vw_stock_disponible`, `vw_utilidad_items`) — **YA aplicado**

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

## Lo que sigue (pendiente)
1. Frontend: vista de detalle de factura compra con líneas (`/compra/:id`)
2. Frontend: movimientos de inventario por producto
3. Backend: probar todos los endpoints nuevos a fondo

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
```

## Conexión BD
- Host: localhost:5432
- User: maxan_user
- Pass: dev_password_segura
- DB: maxan_erp
- Schema: facturacion, compras, inventario, gastos, public
