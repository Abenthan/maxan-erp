# Contexto del proyecto: maxan-erp

## Estado actual
- Sistema funcional de facturación electrónica DIAN UBL 2.1
- Puede parsear XML, previsualizar y guardar facturas con items, impuestos y terceros
- BD limpia, lista para continuar

## Problemas resueltos
1. **CUFE no encontrado** → se amplió búsqueda a `InvoiceControl.UUID/CUFE/CUDE` y fallback en `Invoice.UUID/CUFE/CUDE`
2. **NIT/CC vacío** → los XML colombianos pueden no tener `PartyIdentification`, el NIT está en `PartyLegalEntity.CompanyID` con `schemeName` para el tipo de documento. Se agregó fallback.
3. **Elementos como array** → `PartyIdentification`, `PartyLegalEntity`, etc. pueden ser array en el parseo. Se usa `safeArray()`.

## Lo que sigue (pendiente)
- Módulos adicionales (el proyecto empezó solo con facturas, ahora se expandirá)
- Components y context del frontend están vacíos, listos para crecer

## Comandos
```bash
# BD
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
- Schema: facturacion
