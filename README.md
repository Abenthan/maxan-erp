# maxan-erp

Sistema de facturación electrónica colombiano para DIAN (UBL 2.1).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 + React Router 7 |
| Backend | Node.js + Express 5 + fast-xml-parser |
| BD | PostgreSQL 16 |
| Infra | Docker Compose (solo BD en dev) |

## Endpoints API

### Facturación
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Healthcheck con conexión a BD |
| `GET` | `/api/facturas` | Listado de facturas (vista resumen) |
| `GET` | `/api/facturas/:id` | Detalle de factura con items e impuestos |
| `POST` | `/api/facturas/parsear-xml` | Enviar XML → devuelve JSON + indica si ya existe |
| `POST` | `/api/facturas` | Guardar factura (JSON) en BD (detecta duplicados) |

### Helpdesk
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/helpdesk/recursos` | `helpdesk.ver` | Listar recursos (filtros: `q`, `cliente_id`, `tipo`) |
| `GET` | `/api/helpdesk/recursos/:id` | `helpdesk.ver` | Obtener recurso con `atributos` JSONB |
| `POST` | `/api/helpdesk/recursos` | `helpdesk.gestionar` | Crear recurso |
| `PUT` | `/api/helpdesk/recursos/:id` | `helpdesk.gestionar` | Actualizar recurso |
| `DELETE` | `/api/helpdesk/recursos/:id` | `helpdesk.gestionar` | Eliminar recurso |
| `GET` | `/api/helpdesk/recursos/script` | `helpdesk.ver` | Generar script PowerShell detectar PC |
| `POST` | `/api/helpdesk/recursos/detectar-pc` | **Público** | Recibir datos desde script PS |
| `GET` | `/api/helpdesk/recursos/detectar-pc/pending/:code` | `helpdesk.ver` | Obtener datos pendientes de detección |
| `GET` | `/api/helpdesk/mantenimientos` | `helpdesk.ver` | Listar mantenimientos |
| `POST` | `/api/helpdesk/mantenimientos` | `helpdesk.gestionar` | Crear mantenimiento |
| `GET` | `/api/helpdesk/mantenimientos/:id` | `helpdesk.ver` | Obtener mantenimiento |
| `PUT` | `/api/helpdesk/mantenimientos/:id` | `helpdesk.gestionar` | Actualizar mantenimiento |
| `GET` | `/api/helpdesk/detalles/:mid` | `helpdesk.ver` | Obtener detalles/bitácora de mantenimiento |
| `POST` | `/api/helpdesk/detalles/:mid` | `helpdesk.gestionar` | Agregar detalle a mantenimiento |
| `GET` | `/api/helpdesk/categorias-mantenimiento` | `helpdesk.ver` | Listar categorías de mantenimiento |

## Desarrollo

```bash
# 1. Base de datos (Docker)
docker-compose -f docker-compose.dev.yml up postgres

# 2. Backend (otra terminal)
cd backend
npm run dev

# 3. Frontend (otra terminal)
cd frontend
npm run dev
```

## Páginas frontend

| Ruta | Descripción |
|---|---|
| `/` | Dashboard con resumen, ventas/gastos por mes, top clientes, últimas facturas |
| `/facturas` | Listado de facturas en tabla (N°, Fecha, Cliente, Valor, Estado) |
| `/factura/:id` | Detalle de factura con items e impuestos |
| `/nueva-factura` | Carga XML → si ya existe redirige a detalle, si no, vista previa + guardar |
| `/ventas-items` | Items de venta, asignar producto, ver gastos vinculados |
| `/nueva-venta` | Crear/editar venta manual con búsqueda de productos |
| `/productos` | Catálogo de productos con stock |
| `/inventario` | Stock disponible |
| `/gastos` | Gastos operativos |
| `/compras` | Listado de facturas compra |
| `/nueva-compra` | Subir XML de compra |
| `/terceros` | CRUD de terceros/clientes |
| `/cartera` | Cartera activa con aging, registrar pagos |
| `/cartera/pagos` | Historial de pagos recibidos |
| `/cartera/nuevo-pago` | Paso a paso para registrar pago |
| `/cartera/retenciones` | Listado de retenciones realizadas |
| `/utilidad` | Reporte de utilidad por producto y por factura |
| `/helpdesk` | Seleccionar cliente helpdesk |
| `/helpdesk/clientes/:id` | Recursos del cliente |
| `/helpdesk/recursos/:id` | Detalle del equipo + modo edición inline |
| `/helpdesk/obtener-pc` | Detectar PC remoto via script PowerShell |
| `/login` | Inicio de sesión |
| `/register` | Registro primer usuario (solo si no hay usuarios) |
| `/usuarios` | Gestionar usuarios (solo admin) |
| `/roles` | Gestionar roles y permisos (solo admin) |

## Estructura del proyecto

```
maxan-erp/
├── backend/
│   ├── src/
│   │   ├── index.js                     # Servidor Express
│   │   ├── middleware/auth.js           # JWT authenticate + authorize
│   │   ├── controllers/
│   │   │   ├── facturasController.js
│   │   │   ├── tercerosController.js
│   │   │   ├── productosController.js
│   │   │   ├── gastosController.js
│   │   │   ├── comprasController.js
│   │   │   ├── inventarioController.js
│   │   │   ├── ventasController.js
│   │   │   ├── carteraController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── authController.js
│   │   │   ├── usuariosController.js
│   │   │   ├── rolesController.js
│   │   │   └── helpdesk/
│   │   │       ├── recursosController.js      # CRUD recursos + detectar PC
│   │   │       ├── mantenimientosController.js
│   │   │       └── detallesController.js
│   │   ├── routes/
│   │   │   ├── facturas.js
│   │   │   ├── terceros.js
│   │   │   ├── productos.js
│   │   │   ├── gastos.js
│   │   │   ├── compras.js
│   │   │   ├── inventario.js
│   │   │   ├── ventas.js
│   │   │   ├── cartera.js
│   │   │   ├── dashboard.js
│   │   │   ├── auth.js
│   │   │   ├── usuarios.js
│   │   │   ├── roles.js
│   │   │   └── helpdesk/
│   │   │       ├── recursos.js               # Rutas recursos + detectar PC
│   │   │       ├── mantenimientos.js
│   │   │       └── detalles.js
│   │   └── services/
│   │       └── xmlParser.js            # Parser XML DIAN UBL 2.1
│   ├── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     # Router
│   │   ├── main.tsx                    # Entry point
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Facturas.tsx
│   │   │   ├── Factura.tsx
│   │   │   ├── NuevaFactura.tsx
│   │   │   ├── VentasItems.tsx
│   │   │   ├── NuevaVenta.tsx
│   │   │   ├── Productos.tsx
│   │   │   ├── Inventario.tsx
│   │   │   ├── Gastos.tsx
│   │   │   ├── GastosPorVentaItem.tsx
│   │   │   ├── Compras.tsx
│   │   │   ├── NuevaCompra.tsx
│   │   │   ├── Terceros.tsx
│   │   │   ├── Cartera.tsx
│   │   │   ├── Pagos.tsx
│   │   │   ├── NuevoPago.tsx
│   │   │   ├── Retenciones.tsx
│   │   │   ├── Utilidad.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Usuarios.tsx
│   │   │   ├── Roles.tsx
│   │   │   └── helpdesk/
│   │   │       ├── Clientes.tsx
│   │   │       ├── ClienteDetalle.tsx
│   │   │       ├── RecursoDetalle.tsx   # Detalle + edición inline
│   │   │       └── RegistrarPC.tsx     # Detectar PC (script + revisar + manual)
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx      # Ruta protegida por auth/permiso
│   │   │   └── HelpdeskLayout.tsx
│   │   ├── context/
│   │   │   ├── ApiContext.tsx          # API methods (get, post, put, del, upload)
│   │   │   └── AuthContext.tsx         # Auth provider + JWT + permisos
│   ├── index.html
│   └── vite.config.ts
├── db/
│   ├── 01_schema.sql
│   ├── 02_compras_gastos_inventario.sql
│   ├── ...                             # Migraciones 03-16
│   └── init/01_schema.sql
└── docker-compose.dev.yml
```

## Notas importantes

- El NIT/CC en los XML colombianos puede estar en `PartyLegalEntity.CompanyID` en lugar de `PartyIdentification.ID`. El parser revisa ambas ubicaciones.
- La BD usa el esquema `facturacion`. Ver credenciales en `backend/.env` y `.env` (raíz).
- Docker container name: `maxan_db_dev`, DB: `maxan_erp`.
