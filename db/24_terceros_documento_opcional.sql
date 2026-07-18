ALTER TABLE facturacion.terceros ALTER COLUMN tipo_documento DROP NOT NULL;
ALTER TABLE facturacion.terceros ALTER COLUMN numero_documento DROP NOT NULL;

ALTER TABLE facturacion.terceros DROP CONSTRAINT IF EXISTS terceros_tipo_documento_numero_documento_key;

CREATE UNIQUE INDEX IF NOT EXISTS terceros_documento_unique
  ON facturacion.terceros (tipo_documento, numero_documento)
  WHERE tipo_documento IS NOT NULL AND numero_documento IS NOT NULL;
