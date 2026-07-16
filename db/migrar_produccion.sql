-- ============================================================
-- Migración: Schemas faltantes en producción
-- Ejecutar en DBeaver contra la BD de producción
-- ============================================================

-- ============================================================
-- CARTERA
-- ============================================================
CREATE SCHEMA IF NOT EXISTS cartera;

CREATE TABLE IF NOT EXISTS cartera.medios_pago (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT now()
);

INSERT INTO cartera.medios_pago (nombre) VALUES
    ('Efectivo'),
    ('Transferencia Bancaria'),
    ('Cheque'),
    ('Tarjeta Débito'),
    ('Tarjeta Crédito'),
    ('Consignación'),
    ('Datafono')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS cartera.pagos (
    id              SERIAL PRIMARY KEY,
    cliente_id      INT NOT NULL REFERENCES facturacion.terceros(id),
    medio_pago_id   INT REFERENCES cartera.medios_pago(id),
    referencia      VARCHAR(100),
    fecha_pago      DATE NOT NULL DEFAULT CURRENT_DATE,
    valor_total     NUMERIC(18,2) NOT NULL CHECK (valor_total > 0),
    observaciones   TEXT,
    anulado         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pagos_cliente ON cartera.pagos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha   ON cartera.pagos(fecha_pago);

DROP TRIGGER IF EXISTS trg_pagos_updated_at ON cartera.pagos;
CREATE TRIGGER trg_pagos_updated_at
    BEFORE UPDATE ON cartera.pagos
    FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();

CREATE TABLE IF NOT EXISTS cartera.pago_aplicaciones (
    id              SERIAL PRIMARY KEY,
    pago_id         INT NOT NULL REFERENCES cartera.pagos(id) ON DELETE CASCADE,
    venta_id        INT NOT NULL REFERENCES facturacion.ventas(id) ON DELETE CASCADE,
    valor_aplicado  NUMERIC(18,2) NOT NULL CHECK (valor_aplicado > 0),
    created_at      TIMESTAMP DEFAULT now(),
    UNIQUE (pago_id, venta_id)
);

CREATE INDEX IF NOT EXISTS idx_pago_aplicaciones_pago   ON cartera.pago_aplicaciones(pago_id);
CREATE INDEX IF NOT EXISTS idx_pago_aplicaciones_venta  ON cartera.pago_aplicaciones(venta_id);

-- Agregar saldo_pendiente a ventas si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='facturacion' AND table_name='ventas' AND column_name='saldo_pendiente') THEN
        ALTER TABLE facturacion.ventas ADD COLUMN saldo_pendiente NUMERIC(18,2);
    END IF;
END $$;

-- Actualizar constraint de estado
ALTER TABLE facturacion.ventas DROP CONSTRAINT IF EXISTS facturas_estado_check;
ALTER TABLE facturacion.ventas DROP CONSTRAINT IF EXISTS ventas_estado_check;
ALTER TABLE facturacion.ventas ADD CONSTRAINT ventas_estado_check
    CHECK (estado IN ('recibida','pendiente_pago','pagada_parcial','pagada','anulada','rechazada'));

UPDATE facturacion.ventas SET saldo_pendiente = valor_a_pagar
WHERE saldo_pendiente IS NULL AND estado NOT IN ('anulada', 'rechazada');

UPDATE facturacion.ventas SET estado = 'pendiente_pago'
WHERE estado = 'recibida' AND saldo_pendiente > 0;

-- Trigger para saldo
CREATE OR REPLACE FUNCTION cartera.fn_actualizar_saldo()
RETURNS TRIGGER AS $$
DECLARE
    v_total_pagado      NUMERIC(18,2);
    v_valor_venta       NUMERIC(18,2);
    v_total_retenciones NUMERIC(18,2);
    v_venta_id          INT;
BEGIN
    v_venta_id := COALESCE(NEW.venta_id, OLD.venta_id);
    SELECT v.valor_a_pagar INTO v_valor_venta FROM facturacion.ventas v WHERE v.id = v_venta_id;
    SELECT COALESCE(SUM(pa.valor_aplicado), 0) INTO v_total_pagado FROM cartera.pago_aplicaciones pa WHERE pa.venta_id = v_venta_id;
    SELECT COALESCE(v.valor_retencion_fuente, 0) INTO v_total_retenciones FROM facturacion.ventas v WHERE v.id = v_venta_id;
    UPDATE facturacion.ventas
    SET saldo_pendiente = GREATEST(v_valor_venta - v_total_pagado - v_total_retenciones, 0),
        estado = CASE
            WHEN v_total_pagado + v_total_retenciones >= v_valor_venta THEN 'pagada'
            WHEN v_total_pagado > 0 THEN 'pagada_parcial'
            ELSE 'pendiente_pago'
        END
    WHERE id = v_venta_id AND estado NOT IN ('anulada', 'rechazada');
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pago_aplicaciones_actualizar_saldo ON cartera.pago_aplicaciones;
CREATE TRIGGER trg_pago_aplicaciones_actualizar_saldo
    AFTER INSERT OR DELETE ON cartera.pago_aplicaciones
    FOR EACH ROW EXECUTE FUNCTION cartera.fn_actualizar_saldo();

-- Vistas
CREATE OR REPLACE VIEW cartera.vw_cartera_activa AS
SELECT
    v.id AS venta_id, v.numero_completo, v.fecha_emision, v.fecha_vencimiento,
    v.fecha_vencimiento_pago, v.valor_a_pagar, v.valor_retencion_fuente,
    v.valor_a_pagar - COALESCE(v.saldo_pendiente, 0) AS total_pagado,
    COALESCE(v.saldo_pendiente, v.valor_a_pagar) AS saldo_pendiente,
    t.id AS cliente_id, t.razon_social AS cliente, t.numero_documento AS nit_cliente,
    v.estado,
    CASE
        WHEN COALESCE(v.saldo_pendiente, v.valor_a_pagar) <= 0 THEN 'Pagada'
        WHEN v.fecha_vencimiento_pago IS NULL THEN 'Sin vencimiento'
        WHEN CURRENT_DATE > v.fecha_vencimiento_pago THEN 'Vencida'
        ELSE 'Al día'
    END AS estado_cartera,
    CASE
        WHEN COALESCE(v.saldo_pendiente, v.valor_a_pagar) <= 0 THEN 0
        WHEN v.fecha_vencimiento_pago IS NULL THEN 0
        WHEN CURRENT_DATE <= v.fecha_vencimiento_pago THEN 0
        WHEN (CURRENT_DATE - v.fecha_vencimiento_pago) <= 30 THEN 30
        WHEN (CURRENT_DATE - v.fecha_vencimiento_pago) <= 60 THEN 60
        WHEN (CURRENT_DATE - v.fecha_vencimiento_pago) <= 90 THEN 90
        ELSE 999
    END AS dias_vencida
FROM facturacion.ventas v
JOIN facturacion.terceros t ON t.id = v.receptor_id
WHERE v.estado NOT IN ('anulada', 'rechazada')
ORDER BY v.fecha_vencimiento_pago NULLS LAST, v.fecha_emision DESC;

CREATE OR REPLACE VIEW cartera.vw_pagos_resumen AS
SELECT p.id, p.fecha_pago, p.valor_total, p.referencia, p.anulado,
    mp.nombre AS medio_pago, t.id AS cliente_id, t.razon_social AS cliente,
    t.numero_documento AS nit_cliente,
    COALESCE(pa.facturas_aplicadas, 0) AS facturas_aplicadas,
    COALESCE(pa.total_aplicado, 0) AS total_aplicado,
    CASE WHEN COALESCE(pa.total_aplicado, 0) < p.valor_total THEN p.valor_total - COALESCE(pa.total_aplicado, 0) ELSE 0 END AS sin_aplicar
FROM cartera.pagos p
JOIN facturacion.terceros t ON t.id = p.cliente_id
LEFT JOIN cartera.medios_pago mp ON mp.id = p.medio_pago_id
LEFT JOIN (SELECT pago_id, COUNT(*) AS facturas_aplicadas, SUM(valor_aplicado) AS total_aplicado FROM cartera.pago_aplicaciones GROUP BY pago_id) pa ON pa.pago_id = p.id
ORDER BY p.fecha_pago DESC, p.id DESC;

CREATE OR REPLACE VIEW cartera.vw_pago_detalle AS
SELECT pa.id AS aplicacion_id, pa.pago_id, pa.venta_id, pa.valor_aplicado,
    pa.created_at AS fecha_aplicacion, v.numero_completo AS factura_numero,
    v.fecha_emision AS factura_fecha, v.valor_a_pagar AS factura_valor
FROM cartera.pago_aplicaciones pa
JOIN facturacion.ventas v ON v.id = pa.venta_id;

ALTER ROLE maxan_user SET search_path TO facturacion, compras, inventario, gastos, cartera, public;

-- ============================================================
-- CLASIFICACIONES DE GASTO (tabla maestra)
-- ============================================================
CREATE TABLE IF NOT EXISTS gastos.clasificaciones (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT now()
);

INSERT INTO gastos.clasificaciones (nombre) VALUES
    ('Suministros'), ('Operacional'), ('Administrativo')
ON CONFLICT (nombre) DO NOTHING;

ALTER TABLE gastos.gastos DROP CONSTRAINT IF EXISTS gastos_clasificacion_check;
ALTER TABLE gastos.gastos DROP CONSTRAINT IF EXISTS gastos_gastos_clasificacion_check;
ALTER TABLE gastos.gastos ADD CONSTRAINT fk_gasto_clasificacion
    FOREIGN KEY (clasificacion) REFERENCES gastos.clasificaciones(nombre);

-- CUFE nullable
ALTER TABLE facturacion.ventas ALTER COLUMN cufe DROP NOT NULL;

-- Retención por línea
ALTER TABLE facturacion.ventas_items ADD COLUMN IF NOT EXISTS valor_retencion_fuente NUMERIC(18,2) NOT NULL DEFAULT 0;

-- Observaciones en ventas
ALTER TABLE facturacion.ventas ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- Secuencia ventas manual
CREATE SEQUENCE IF NOT EXISTS facturacion.ventas_manual_seq START 1;

-- Vista resumen con observaciones
CREATE OR REPLACE VIEW facturacion.vw_facturas_resumen AS
SELECT v.id, v.numero_completo, v.cufe, v.fecha_emision, v.fecha_vencimiento,
    e.razon_social AS emisor, e.numero_documento AS nit_emisor,
    r.razon_social AS receptor, r.numero_documento AS nit_receptor,
    v.valor_a_pagar, v.estado, v.codigo_respuesta_dian, v.estado_validacion_dian,
    v.observaciones
FROM facturacion.ventas v
JOIN facturacion.terceros e ON e.id = v.emisor_id
JOIN facturacion.terceros r ON r.id = v.receptor_id;

-- ============================================================
-- USUARIOS
-- ============================================================
CREATE SCHEMA IF NOT EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios.empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  nit VARCHAR(50) UNIQUE NOT NULL,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_empresas_updated_at ON usuarios.empresas;
CREATE TRIGGER trg_empresas_updated_at
  BEFORE UPDATE ON usuarios.empresas
  FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();

CREATE TABLE IF NOT EXISTS usuarios.usuarios (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES usuarios.empresas(id),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombres VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios.usuarios;
CREATE TRIGGER trg_usuarios_updated_at
  BEFORE UPDATE ON usuarios.usuarios
  FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();

CREATE TABLE IF NOT EXISTS usuarios.roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usuarios.permisos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  modulo VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usuarios.roles_permisos (
  rol_id INTEGER NOT NULL REFERENCES usuarios.roles(id) ON DELETE CASCADE,
  permiso_id INTEGER NOT NULL REFERENCES usuarios.permisos(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS usuarios.usuarios_roles (
  usuario_id INTEGER NOT NULL REFERENCES usuarios.usuarios(id) ON DELETE CASCADE,
  rol_id INTEGER NOT NULL REFERENCES usuarios.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, rol_id)
);

-- ============================================================
-- HELPDESK
-- ============================================================
CREATE SCHEMA IF NOT EXISTS helpdesk;

CREATE TABLE IF NOT EXISTS helpdesk.categorias_mantenimiento (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#6B7280'
);

INSERT INTO helpdesk.categorias_mantenimiento (nombre, color) VALUES
  ('Mantenimiento Preventivo', '#10B981'),
  ('Mantenimiento Correctivo', '#EF4444'),
  ('Instalación / Configuración', '#3B82F6'),
  ('Diagnóstico', '#F59E0B'),
  ('Soporte Remoto', '#8B5CF6'),
  ('Formateo / Backup', '#EC4899'),
  ('Redes / Cableado', '#14B8A6')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS helpdesk.recursos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES facturacion.terceros(id),
  nombre VARCHAR(200) NOT NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'Computador',
  marca VARCHAR(100),
  modelo VARCHAR(100),
  referencia VARCHAR(100),
  serial VARCHAR(100) UNIQUE,
  procesador VARCHAR(200),
  memoria_gb NUMERIC(6,1),
  almacenamiento_gb NUMERIC(8,1),
  sistema_operativo VARCHAR(100),
  ubicacion VARCHAR(200),
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_recursos_updated_at ON helpdesk.recursos;
CREATE TRIGGER trg_recursos_updated_at
  BEFORE UPDATE ON helpdesk.recursos
  FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();

CREATE TABLE IF NOT EXISTS helpdesk.mantenimientos (
  id SERIAL PRIMARY KEY,
  recurso_id INTEGER NOT NULL REFERENCES helpdesk.recursos(id),
  categoria_id INTEGER NOT NULL REFERENCES helpdesk.categorias_mantenimiento(id),
  tecnico_id INTEGER REFERENCES usuarios.usuarios(id),
  titulo VARCHAR(300) NOT NULL,
  descripcion TEXT,
  prioridad VARCHAR(20) DEFAULT 'Media'
    CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Crítica')),
  estado VARCHAR(20) DEFAULT 'Pendiente'
    CHECK (estado IN ('Pendiente', 'En Progreso', 'Completado', 'Facturado', 'Cancelado')),
  fecha_solicitud DATE DEFAULT CURRENT_DATE,
  fecha_ejecucion DATE,
  hora_inicio TIME,
  hora_fin TIME,
  costo_mano_obra NUMERIC(12,2) DEFAULT 0,
  costo_repuestos NUMERIC(12,2) DEFAULT 0,
  costo_total NUMERIC(12,2) GENERATED ALWAYS AS (costo_mano_obra + costo_repuestos) STORED,
  venta_item_id INTEGER REFERENCES facturacion.ventas_items(id),
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_mantenimientos_updated_at ON helpdesk.mantenimientos;
CREATE TRIGGER trg_mantenimientos_updated_at
  BEFORE UPDATE ON helpdesk.mantenimientos
  FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();

CREATE TABLE IF NOT EXISTS helpdesk.mantenimiento_detalles (
  id SERIAL PRIMARY KEY,
  mantenimiento_id INTEGER NOT NULL REFERENCES helpdesk.mantenimientos(id) ON DELETE CASCADE,
  creado_por INTEGER REFERENCES usuarios.usuarios(id),
  contenido TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'Comentario'
    CHECK (tipo IN ('Comentario', 'Diagnóstico', 'Solución', 'Repuesto', 'Acuerdo')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Atributos JSONB en recursos
ALTER TABLE helpdesk.recursos ADD COLUMN IF NOT EXISTS atributos JSONB DEFAULT '{}';

-- Categorías de caso
CREATE TABLE IF NOT EXISTS helpdesk.categorias_caso (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#6B7280',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO helpdesk.categorias_caso (nombre, color) VALUES
  ('Soporte Técnico', '#3B82F6'),
  ('Falla / Error', '#EF4444'),
  ('Instalación', '#10B981'),
  ('Consulta', '#F59E0B'),
  ('Mantenimiento', '#8B5CF6'),
  ('Configuración', '#14B8A6'),
  ('Otro', '#6B7280')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS helpdesk.contactos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES facturacion.terceros(id) ON DELETE CASCADE,
  nombre VARCHAR(200) NOT NULL,
  telefono VARCHAR(50),
  email VARCHAR(200),
  whatsapp VARCHAR(50),
  cargo VARCHAR(200),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_contactos_updated_at ON helpdesk.contactos;
CREATE TRIGGER trg_contactos_updated_at
  BEFORE UPDATE ON helpdesk.contactos
  FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();

CREATE SEQUENCE IF NOT EXISTS helpdesk.caso_numero_seq START 1;

CREATE TABLE IF NOT EXISTS helpdesk.casos (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(20) UNIQUE DEFAULT ('CASO-' || LPAD(nextval('helpdesk.caso_numero_seq')::TEXT, 4, '0')),
  titulo VARCHAR(300) NOT NULL,
  descripcion TEXT,
  categoria_id INTEGER REFERENCES helpdesk.categorias_caso(id),
  recurso_id INTEGER REFERENCES helpdesk.recursos(id),
  cliente_id INTEGER REFERENCES facturacion.terceros(id),
  contacto_id INTEGER REFERENCES helpdesk.contactos(id),
  tecnico_id INTEGER REFERENCES usuarios.usuarios(id),
  estado VARCHAR(20) DEFAULT 'Pendiente'
    CHECK (estado IN ('Pendiente', 'En Progreso', 'Completado', 'Cancelado')),
  solucion TEXT,
  venta_item_id INTEGER REFERENCES facturacion.ventas_items(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_casos_updated_at ON helpdesk.casos;
CREATE TRIGGER trg_casos_updated_at
  BEFORE UPDATE ON helpdesk.casos
  FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();

CREATE TABLE IF NOT EXISTS helpdesk.casos_contactos (
  caso_id INTEGER NOT NULL REFERENCES helpdesk.casos(id) ON DELETE CASCADE,
  contacto_id INTEGER NOT NULL REFERENCES helpdesk.contactos(id) ON DELETE CASCADE,
  PRIMARY KEY (caso_id, contacto_id)
);

CREATE TABLE IF NOT EXISTS helpdesk.caso_detalles (
  id SERIAL PRIMARY KEY,
  caso_id INTEGER NOT NULL REFERENCES helpdesk.casos(id) ON DELETE CASCADE,
  creado_por INTEGER REFERENCES usuarios.usuarios(id),
  contenido TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'Comentario'
    CHECK (tipo IN ('Comentario', 'Diagnóstico', 'Solución', 'Acuerdo', 'Sistema')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- es_cliente / es_proveedor
ALTER TABLE facturacion.terceros ADD COLUMN IF NOT EXISTS es_cliente BOOLEAN DEFAULT FALSE;
ALTER TABLE facturacion.terceros ADD COLUMN IF NOT EXISTS es_proveedor BOOLEAN DEFAULT FALSE;

-- Tipos de recurso
CREATE TABLE IF NOT EXISTS helpdesk.tipos_recurso (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT now()
);

INSERT INTO helpdesk.tipos_recurso (nombre) VALUES
    ('Computador'), ('Hosting'), ('Office 365'), ('Red'),
    ('Celular'), ('Impresora'), ('Servidor'), ('UPS'), ('Cámara'), ('Otro')
ON CONFLICT (nombre) DO NOTHING;

ALTER TABLE helpdesk.recursos DROP CONSTRAINT IF EXISTS helpdesk_recursos_tipo_check;
ALTER TABLE helpdesk.recursos DROP CONSTRAINT IF EXISTS fk_recurso_tipo;
ALTER TABLE helpdesk.recursos ADD CONSTRAINT fk_recurso_tipo
    FOREIGN KEY (tipo) REFERENCES helpdesk.tipos_recurso(nombre) ON DELETE RESTRICT;

-- M2M casos_recursos
CREATE TABLE IF NOT EXISTS helpdesk.casos_recursos (
  caso_id INTEGER NOT NULL REFERENCES helpdesk.casos(id) ON DELETE CASCADE,
  recurso_id INTEGER NOT NULL REFERENCES helpdesk.recursos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (caso_id, recurso_id)
);

INSERT INTO helpdesk.casos_recursos (caso_id, recurso_id)
SELECT id, recurso_id FROM helpdesk.casos WHERE recurso_id IS NOT NULL
ON CONFLICT DO NOTHING;
