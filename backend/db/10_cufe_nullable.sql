-- Hacer cufe nullable para permitir ventas sin factura electrónica
ALTER TABLE facturacion.ventas ALTER COLUMN cufe DROP NOT NULL;
