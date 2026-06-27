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

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Healthcheck con conexión a BD |
| `GET` | `/api/facturas` | Listado de facturas (vista resumen) |
| `GET` | `/api/facturas/:id` | Detalle de factura con items e impuestos |
| `POST` | `/api/facturas/parsear-xml` | Enviar XML → devuelve JSON + indica si ya existe |
| `POST` | `/api/facturas` | Guardar factura (JSON) en BD (detecta duplicados) |

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
| `/` | Home con botón a Facturas |
| `/facturas` | Listado de facturas en tabla (N°, Fecha, Cliente, Valor, Estado) |
| `/factura/:id` | Detalle de factura con items e impuestos |
| `/nueva-factura` | Carga XML → si ya existe redirige a detalle, si no, vista previa + guardar |

## Estructura del proyecto

```
maxan-erp/
├── backend/
│   ├── src/
│   │   ├── index.js              # Servidor Express
│   │   ├── routes/facturas.js    # Endpoints de facturas
│   │   └── services/xmlParser.js # Parser XML DIAN UBL 2.1
│   ├── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Router
│   │   ├── main.tsx              # Entry point
│   │   ├── pages/
│   │   │   ├── Facturas.tsx
│   │   │   ├── Factura.tsx
│   │   │   └── NuevaFactura.tsx
│   │   ├── components/           # (vacío, listo para crecer)
│   │   └── context/              # (vacío, listo para crecer)
│   ├── index.html
│   └── vite.config.ts
├── db/
│   ├── 01_schema.sql
│   └── init/01_schema.sql
└── docker-compose.dev.yml
```

## Notas importantes

- El NIT/CC en los XML colombianos puede estar en `PartyLegalEntity.CompanyID` en lugar de `PartyIdentification.ID`. El parser revisa ambas ubicaciones.
- La BD usa el esquema `facturacion`. Ver credenciales en `backend/.env` y `.env` (raíz).
- Docker container name: `maxan_db_dev`, DB: `maxan_erp`.
