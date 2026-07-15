--
-- PostgreSQL database dump
--

\restrict 0PyyGC5fcqp0TyBDFndW0J0HjBzj0TxEn0FsIJmfO3j06ZHLcpA650OgQesswsC

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY usuarios.usuarios_roles DROP CONSTRAINT IF EXISTS usuarios_roles_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY usuarios.usuarios_roles DROP CONSTRAINT IF EXISTS usuarios_roles_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY usuarios.usuarios DROP CONSTRAINT IF EXISTS usuarios_empresa_id_fkey;
ALTER TABLE IF EXISTS ONLY usuarios.roles_permisos DROP CONSTRAINT IF EXISTS roles_permisos_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY usuarios.roles_permisos DROP CONSTRAINT IF EXISTS roles_permisos_permiso_id_fkey;
ALTER TABLE IF EXISTS ONLY inventario.salidas DROP CONSTRAINT IF EXISTS salidas_producto_id_fkey;
ALTER TABLE IF EXISTS ONLY inventario.salidas DROP CONSTRAINT IF EXISTS salidas_factura_item_id_fkey;
ALTER TABLE IF EXISTS ONLY inventario.salida_detalle DROP CONSTRAINT IF EXISTS salida_detalle_salida_id_fkey;
ALTER TABLE IF EXISTS ONLY inventario.salida_detalle DROP CONSTRAINT IF EXISTS salida_detalle_entrada_id_fkey;
ALTER TABLE IF EXISTS ONLY inventario.entradas DROP CONSTRAINT IF EXISTS entradas_producto_id_fkey;
ALTER TABLE IF EXISTS ONLY inventario.entradas DROP CONSTRAINT IF EXISTS entradas_gasto_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.recursos DROP CONSTRAINT IF EXISTS recursos_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimientos DROP CONSTRAINT IF EXISTS mantenimientos_venta_item_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimientos DROP CONSTRAINT IF EXISTS mantenimientos_tecnico_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimientos DROP CONSTRAINT IF EXISTS mantenimientos_recurso_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimientos DROP CONSTRAINT IF EXISTS mantenimientos_categoria_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimiento_detalles DROP CONSTRAINT IF EXISTS mantenimiento_detalles_mantenimiento_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimiento_detalles DROP CONSTRAINT IF EXISTS mantenimiento_detalles_creado_por_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.recursos DROP CONSTRAINT IF EXISTS fk_recurso_tipo;
ALTER TABLE IF EXISTS ONLY helpdesk.contactos DROP CONSTRAINT IF EXISTS contactos_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_venta_item_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_tecnico_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos_recursos DROP CONSTRAINT IF EXISTS casos_recursos_recurso_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos_recursos DROP CONSTRAINT IF EXISTS casos_recursos_caso_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_recurso_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos_contactos DROP CONSTRAINT IF EXISTS casos_contactos_contacto_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos_contactos DROP CONSTRAINT IF EXISTS casos_contactos_caso_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_contacto_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_categoria_id_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.caso_detalles DROP CONSTRAINT IF EXISTS caso_detalles_creado_por_fkey;
ALTER TABLE IF EXISTS ONLY helpdesk.caso_detalles DROP CONSTRAINT IF EXISTS caso_detalles_caso_id_fkey;
ALTER TABLE IF EXISTS ONLY gastos.gastos DROP CONSTRAINT IF EXISTS gastos_venta_item_id_fkey;
ALTER TABLE IF EXISTS ONLY gastos.gastos DROP CONSTRAINT IF EXISTS gastos_proveedor_id_fkey;
ALTER TABLE IF EXISTS ONLY gastos.gastos DROP CONSTRAINT IF EXISTS gastos_producto_id_fkey;
ALTER TABLE IF EXISTS ONLY gastos.gastos DROP CONSTRAINT IF EXISTS gastos_factura_compra_id_fkey;
ALTER TABLE IF EXISTS ONLY gastos.gastos DROP CONSTRAINT IF EXISTS fk_gasto_clasificacion;
ALTER TABLE IF EXISTS ONLY facturacion.ventas_items DROP CONSTRAINT IF EXISTS ventas_items_producto_id_fkey;
ALTER TABLE IF EXISTS ONLY facturacion.ventas DROP CONSTRAINT IF EXISTS facturas_receptor_id_fkey;
ALTER TABLE IF EXISTS ONLY facturacion.ventas DROP CONSTRAINT IF EXISTS facturas_emisor_id_fkey;
ALTER TABLE IF EXISTS ONLY facturacion.factura_respuestas_dian DROP CONSTRAINT IF EXISTS factura_respuestas_dian_factura_id_fkey;
ALTER TABLE IF EXISTS ONLY facturacion.ventas_items DROP CONSTRAINT IF EXISTS factura_items_factura_id_fkey;
ALTER TABLE IF EXISTS ONLY facturacion.factura_impuestos DROP CONSTRAINT IF EXISTS factura_impuestos_factura_item_id_fkey;
ALTER TABLE IF EXISTS ONLY facturacion.factura_impuestos DROP CONSTRAINT IF EXISTS factura_impuestos_factura_id_fkey;
ALTER TABLE IF EXISTS ONLY facturacion.factura_archivos DROP CONSTRAINT IF EXISTS factura_archivos_factura_id_fkey;
ALTER TABLE IF EXISTS ONLY compras.facturas_compra DROP CONSTRAINT IF EXISTS facturas_compra_receptor_id_fkey;
ALTER TABLE IF EXISTS ONLY compras.facturas_compra DROP CONSTRAINT IF EXISTS facturas_compra_proveedor_id_fkey;
ALTER TABLE IF EXISTS ONLY compras.facturas_compra_archivos DROP CONSTRAINT IF EXISTS facturas_compra_archivos_factura_compra_id_fkey;
ALTER TABLE IF EXISTS ONLY cartera.pagos DROP CONSTRAINT IF EXISTS pagos_medio_pago_id_fkey;
ALTER TABLE IF EXISTS ONLY cartera.pagos DROP CONSTRAINT IF EXISTS pagos_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY cartera.pago_aplicaciones DROP CONSTRAINT IF EXISTS pago_aplicaciones_venta_id_fkey;
ALTER TABLE IF EXISTS ONLY cartera.pago_aplicaciones DROP CONSTRAINT IF EXISTS pago_aplicaciones_pago_id_fkey;
DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios.usuarios;
DROP TRIGGER IF EXISTS trg_empresas_updated_at ON usuarios.empresas;
DROP TRIGGER IF EXISTS trg_productos_updated_at ON inventario.productos;
DROP TRIGGER IF EXISTS trg_recursos_updated_at ON helpdesk.recursos;
DROP TRIGGER IF EXISTS trg_mantenimientos_updated_at ON helpdesk.mantenimientos;
DROP TRIGGER IF EXISTS trg_contactos_updated_at ON helpdesk.contactos;
DROP TRIGGER IF EXISTS trg_casos_updated_at ON helpdesk.casos;
DROP TRIGGER IF EXISTS trg_gastos_updated_at ON gastos.gastos;
DROP TRIGGER IF EXISTS trg_gastos_set_clasificacion ON gastos.gastos;
DROP TRIGGER IF EXISTS trg_gastos_crear_entrada ON gastos.gastos;
DROP TRIGGER IF EXISTS trg_terceros_updated_at ON facturacion.terceros;
DROP TRIGGER IF EXISTS trg_facturas_updated_at ON facturacion.ventas;
DROP TRIGGER IF EXISTS trg_facturas_compra_updated_at ON compras.facturas_compra;
DROP TRIGGER IF EXISTS trg_pagos_updated_at ON cartera.pagos;
DROP TRIGGER IF EXISTS trg_pago_aplicaciones_actualizar_saldo ON cartera.pago_aplicaciones;
DROP INDEX IF EXISTS inventario.idx_entradas_producto_fecha;
DROP INDEX IF EXISTS gastos.idx_gastos_venta_item;
DROP INDEX IF EXISTS gastos.idx_gastos_producto;
DROP INDEX IF EXISTS gastos.idx_gastos_factura_compra;
DROP INDEX IF EXISTS facturacion.idx_facturas_receptor;
DROP INDEX IF EXISTS facturacion.idx_facturas_fecha;
DROP INDEX IF EXISTS facturacion.idx_facturas_estado;
DROP INDEX IF EXISTS facturacion.idx_facturas_emisor;
DROP INDEX IF EXISTS cartera.idx_pagos_fecha;
DROP INDEX IF EXISTS cartera.idx_pagos_cliente;
DROP INDEX IF EXISTS cartera.idx_pago_aplicaciones_venta;
DROP INDEX IF EXISTS cartera.idx_pago_aplicaciones_pago;
ALTER TABLE IF EXISTS ONLY usuarios.usuarios DROP CONSTRAINT IF EXISTS usuarios_username_key;
ALTER TABLE IF EXISTS ONLY usuarios.usuarios_roles DROP CONSTRAINT IF EXISTS usuarios_roles_pkey;
ALTER TABLE IF EXISTS ONLY usuarios.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY usuarios.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY usuarios.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY usuarios.roles_permisos DROP CONSTRAINT IF EXISTS roles_permisos_pkey;
ALTER TABLE IF EXISTS ONLY usuarios.roles DROP CONSTRAINT IF EXISTS roles_nombre_key;
ALTER TABLE IF EXISTS ONLY usuarios.permisos DROP CONSTRAINT IF EXISTS permisos_pkey;
ALTER TABLE IF EXISTS ONLY usuarios.permisos DROP CONSTRAINT IF EXISTS permisos_codigo_key;
ALTER TABLE IF EXISTS ONLY usuarios.empresas DROP CONSTRAINT IF EXISTS empresas_pkey;
ALTER TABLE IF EXISTS ONLY usuarios.empresas DROP CONSTRAINT IF EXISTS empresas_nit_key;
ALTER TABLE IF EXISTS ONLY inventario.productos DROP CONSTRAINT IF EXISTS uq_productos_codigo;
ALTER TABLE IF EXISTS ONLY inventario.salidas DROP CONSTRAINT IF EXISTS salidas_pkey;
ALTER TABLE IF EXISTS ONLY inventario.salida_detalle DROP CONSTRAINT IF EXISTS salida_detalle_pkey;
ALTER TABLE IF EXISTS ONLY inventario.productos DROP CONSTRAINT IF EXISTS productos_pkey;
ALTER TABLE IF EXISTS ONLY inventario.entradas DROP CONSTRAINT IF EXISTS entradas_pkey;
ALTER TABLE IF EXISTS ONLY inventario.categorias DROP CONSTRAINT IF EXISTS categorias_pkey;
ALTER TABLE IF EXISTS ONLY inventario.categorias DROP CONSTRAINT IF EXISTS categorias_nombre_key;
ALTER TABLE IF EXISTS ONLY helpdesk.tipos_recurso DROP CONSTRAINT IF EXISTS tipos_recurso_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.tipos_recurso DROP CONSTRAINT IF EXISTS tipos_recurso_nombre_key;
ALTER TABLE IF EXISTS ONLY helpdesk.recursos DROP CONSTRAINT IF EXISTS recursos_serial_key;
ALTER TABLE IF EXISTS ONLY helpdesk.recursos DROP CONSTRAINT IF EXISTS recursos_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimientos DROP CONSTRAINT IF EXISTS mantenimientos_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.mantenimiento_detalles DROP CONSTRAINT IF EXISTS mantenimiento_detalles_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.contactos DROP CONSTRAINT IF EXISTS contactos_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.categorias_mantenimiento DROP CONSTRAINT IF EXISTS categorias_mantenimiento_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.categorias_mantenimiento DROP CONSTRAINT IF EXISTS categorias_mantenimiento_nombre_key;
ALTER TABLE IF EXISTS ONLY helpdesk.categorias_caso DROP CONSTRAINT IF EXISTS categorias_caso_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.categorias_caso DROP CONSTRAINT IF EXISTS categorias_caso_nombre_key;
ALTER TABLE IF EXISTS ONLY helpdesk.casos_recursos DROP CONSTRAINT IF EXISTS casos_recursos_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.casos DROP CONSTRAINT IF EXISTS casos_numero_key;
ALTER TABLE IF EXISTS ONLY helpdesk.casos_contactos DROP CONSTRAINT IF EXISTS casos_contactos_pkey;
ALTER TABLE IF EXISTS ONLY helpdesk.caso_detalles DROP CONSTRAINT IF EXISTS caso_detalles_pkey;
ALTER TABLE IF EXISTS ONLY gastos.gastos DROP CONSTRAINT IF EXISTS gastos_pkey;
ALTER TABLE IF EXISTS ONLY gastos.clasificaciones DROP CONSTRAINT IF EXISTS clasificaciones_pkey;
ALTER TABLE IF EXISTS ONLY gastos.clasificaciones DROP CONSTRAINT IF EXISTS clasificaciones_nombre_key;
ALTER TABLE IF EXISTS ONLY facturacion.terceros DROP CONSTRAINT IF EXISTS terceros_tipo_documento_numero_documento_key;
ALTER TABLE IF EXISTS ONLY facturacion.terceros DROP CONSTRAINT IF EXISTS terceros_pkey;
ALTER TABLE IF EXISTS ONLY facturacion.ventas DROP CONSTRAINT IF EXISTS facturas_pkey;
ALTER TABLE IF EXISTS ONLY facturacion.ventas DROP CONSTRAINT IF EXISTS facturas_cufe_key;
ALTER TABLE IF EXISTS ONLY facturacion.factura_respuestas_dian DROP CONSTRAINT IF EXISTS factura_respuestas_dian_pkey;
ALTER TABLE IF EXISTS ONLY facturacion.ventas_items DROP CONSTRAINT IF EXISTS factura_items_pkey;
ALTER TABLE IF EXISTS ONLY facturacion.ventas_items DROP CONSTRAINT IF EXISTS factura_items_factura_id_numero_linea_key;
ALTER TABLE IF EXISTS ONLY facturacion.factura_impuestos DROP CONSTRAINT IF EXISTS factura_impuestos_pkey;
ALTER TABLE IF EXISTS ONLY facturacion.factura_archivos DROP CONSTRAINT IF EXISTS factura_archivos_pkey;
ALTER TABLE IF EXISTS ONLY compras.facturas_compra DROP CONSTRAINT IF EXISTS facturas_compra_pkey;
ALTER TABLE IF EXISTS ONLY compras.facturas_compra DROP CONSTRAINT IF EXISTS facturas_compra_codigo_unico_documento_key;
ALTER TABLE IF EXISTS ONLY compras.facturas_compra_archivos DROP CONSTRAINT IF EXISTS facturas_compra_archivos_pkey;
ALTER TABLE IF EXISTS ONLY cartera.pagos DROP CONSTRAINT IF EXISTS pagos_pkey;
ALTER TABLE IF EXISTS ONLY cartera.pago_aplicaciones DROP CONSTRAINT IF EXISTS pago_aplicaciones_pkey;
ALTER TABLE IF EXISTS ONLY cartera.pago_aplicaciones DROP CONSTRAINT IF EXISTS pago_aplicaciones_pago_id_venta_id_key;
ALTER TABLE IF EXISTS ONLY cartera.medios_pago DROP CONSTRAINT IF EXISTS medios_pago_pkey;
ALTER TABLE IF EXISTS ONLY cartera.medios_pago DROP CONSTRAINT IF EXISTS medios_pago_nombre_key;
ALTER TABLE IF EXISTS usuarios.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS usuarios.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS usuarios.permisos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS usuarios.empresas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS inventario.salidas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS inventario.salida_detalle ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS inventario.productos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS inventario.entradas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS inventario.categorias ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.tipos_recurso ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.recursos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.mantenimientos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.mantenimiento_detalles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.contactos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.categorias_mantenimiento ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.categorias_caso ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.casos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS helpdesk.caso_detalles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS gastos.gastos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS gastos.clasificaciones ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS facturacion.ventas_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS facturacion.ventas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS facturacion.terceros ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS facturacion.factura_respuestas_dian ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS facturacion.factura_impuestos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS facturacion.factura_archivos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS compras.facturas_compra_archivos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS compras.facturas_compra ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS cartera.pagos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS cartera.pago_aplicaciones ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS cartera.medios_pago ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS usuarios.usuarios_roles;
DROP SEQUENCE IF EXISTS usuarios.usuarios_id_seq;
DROP TABLE IF EXISTS usuarios.usuarios;
DROP TABLE IF EXISTS usuarios.roles_permisos;
DROP SEQUENCE IF EXISTS usuarios.roles_id_seq;
DROP TABLE IF EXISTS usuarios.roles;
DROP SEQUENCE IF EXISTS usuarios.permisos_id_seq;
DROP TABLE IF EXISTS usuarios.permisos;
DROP SEQUENCE IF EXISTS usuarios.empresas_id_seq;
DROP TABLE IF EXISTS usuarios.empresas;
DROP VIEW IF EXISTS inventario.vw_utilidad_productos;
DROP VIEW IF EXISTS inventario.vw_stock_disponible;
DROP SEQUENCE IF EXISTS inventario.salidas_id_seq;
DROP SEQUENCE IF EXISTS inventario.salida_detalle_id_seq;
DROP TABLE IF EXISTS inventario.salida_detalle;
DROP SEQUENCE IF EXISTS inventario.productos_id_seq;
DROP TABLE IF EXISTS inventario.productos;
DROP SEQUENCE IF EXISTS inventario.entradas_id_seq;
DROP TABLE IF EXISTS inventario.entradas;
DROP SEQUENCE IF EXISTS inventario.categorias_id_seq;
DROP TABLE IF EXISTS inventario.categorias;
DROP SEQUENCE IF EXISTS helpdesk.tipos_recurso_id_seq;
DROP TABLE IF EXISTS helpdesk.tipos_recurso;
DROP SEQUENCE IF EXISTS helpdesk.recursos_id_seq;
DROP TABLE IF EXISTS helpdesk.recursos;
DROP SEQUENCE IF EXISTS helpdesk.mantenimientos_id_seq;
DROP TABLE IF EXISTS helpdesk.mantenimientos;
DROP SEQUENCE IF EXISTS helpdesk.mantenimiento_detalles_id_seq;
DROP TABLE IF EXISTS helpdesk.mantenimiento_detalles;
DROP SEQUENCE IF EXISTS helpdesk.contactos_id_seq;
DROP TABLE IF EXISTS helpdesk.contactos;
DROP SEQUENCE IF EXISTS helpdesk.categorias_mantenimiento_id_seq;
DROP TABLE IF EXISTS helpdesk.categorias_mantenimiento;
DROP SEQUENCE IF EXISTS helpdesk.categorias_caso_id_seq;
DROP TABLE IF EXISTS helpdesk.categorias_caso;
DROP TABLE IF EXISTS helpdesk.casos_recursos;
DROP SEQUENCE IF EXISTS helpdesk.casos_id_seq;
DROP TABLE IF EXISTS helpdesk.casos_contactos;
DROP TABLE IF EXISTS helpdesk.casos;
DROP SEQUENCE IF EXISTS helpdesk.caso_numero_seq;
DROP SEQUENCE IF EXISTS helpdesk.caso_detalles_id_seq;
DROP TABLE IF EXISTS helpdesk.caso_detalles;
DROP SEQUENCE IF EXISTS gastos.gastos_id_seq;
DROP SEQUENCE IF EXISTS gastos.clasificaciones_id_seq;
DROP TABLE IF EXISTS gastos.clasificaciones;
DROP VIEW IF EXISTS facturacion.vw_utilidad_items;
DROP TABLE IF EXISTS inventario.salidas;
DROP TABLE IF EXISTS gastos.gastos;
DROP VIEW IF EXISTS facturacion.vw_facturas_resumen;
DROP SEQUENCE IF EXISTS facturacion.ventas_manual_seq;
DROP SEQUENCE IF EXISTS facturacion.ventas_items_id_seq;
DROP TABLE IF EXISTS facturacion.ventas_items;
DROP SEQUENCE IF EXISTS facturacion.ventas_id_seq;
DROP SEQUENCE IF EXISTS facturacion.terceros_id_seq;
DROP SEQUENCE IF EXISTS facturacion.factura_respuestas_dian_id_seq;
DROP TABLE IF EXISTS facturacion.factura_respuestas_dian;
DROP SEQUENCE IF EXISTS facturacion.factura_impuestos_id_seq;
DROP TABLE IF EXISTS facturacion.factura_impuestos;
DROP SEQUENCE IF EXISTS facturacion.factura_archivos_id_seq;
DROP TABLE IF EXISTS facturacion.factura_archivos;
DROP SEQUENCE IF EXISTS compras.facturas_compra_id_seq;
DROP SEQUENCE IF EXISTS compras.facturas_compra_archivos_id_seq;
DROP TABLE IF EXISTS compras.facturas_compra_archivos;
DROP TABLE IF EXISTS compras.facturas_compra;
DROP VIEW IF EXISTS cartera.vw_pagos_resumen;
DROP VIEW IF EXISTS cartera.vw_pago_detalle;
DROP VIEW IF EXISTS cartera.vw_cartera_activa;
DROP TABLE IF EXISTS facturacion.ventas;
DROP TABLE IF EXISTS facturacion.terceros;
DROP SEQUENCE IF EXISTS cartera.pagos_id_seq;
DROP TABLE IF EXISTS cartera.pagos;
DROP SEQUENCE IF EXISTS cartera.pago_aplicaciones_id_seq;
DROP TABLE IF EXISTS cartera.pago_aplicaciones;
DROP SEQUENCE IF EXISTS cartera.medios_pago_id_seq;
DROP TABLE IF EXISTS cartera.medios_pago;
DROP FUNCTION IF EXISTS inventario.fn_crear_entrada();
DROP FUNCTION IF EXISTS gastos.fn_set_clasificacion();
DROP FUNCTION IF EXISTS facturacion.fn_set_updated_at();
DROP FUNCTION IF EXISTS cartera.fn_actualizar_saldo();
DROP SCHEMA IF EXISTS usuarios;
DROP SCHEMA IF EXISTS inventario;
DROP SCHEMA IF EXISTS helpdesk;
DROP SCHEMA IF EXISTS gastos;
DROP SCHEMA IF EXISTS facturacion;
DROP SCHEMA IF EXISTS compras;
DROP SCHEMA IF EXISTS cartera;
--
-- Name: cartera; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA cartera;


--
-- Name: compras; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA compras;


--
-- Name: facturacion; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA facturacion;


--
-- Name: gastos; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA gastos;


--
-- Name: helpdesk; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA helpdesk;


--
-- Name: inventario; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA inventario;


--
-- Name: usuarios; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA usuarios;


--
-- Name: fn_actualizar_saldo(); Type: FUNCTION; Schema: cartera; Owner: -
--

CREATE FUNCTION cartera.fn_actualizar_saldo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_total_pagado      NUMERIC(18,2);
    v_valor_venta       NUMERIC(18,2);
    v_total_retenciones NUMERIC(18,2);
    v_venta_id          INT;
BEGIN
    v_venta_id := COALESCE(NEW.venta_id, OLD.venta_id);

    SELECT v.valor_a_pagar INTO v_valor_venta
    FROM facturacion.ventas v WHERE v.id = v_venta_id;

    SELECT COALESCE(SUM(pa.valor_aplicado), 0) INTO v_total_pagado
    FROM cartera.pago_aplicaciones pa WHERE pa.venta_id = v_venta_id;

    SELECT COALESCE(v.valor_retencion_fuente, 0) INTO v_total_retenciones
    FROM facturacion.ventas v WHERE v.id = v_venta_id;

    UPDATE facturacion.ventas
    SET saldo_pendiente = GREATEST(v_valor_venta - v_total_pagado - v_total_retenciones, 0),
        estado = CASE
            WHEN v_total_pagado + v_total_retenciones >= v_valor_venta THEN 'pagada'
            WHEN v_total_pagado > 0 THEN 'pagada_parcial'
            ELSE 'pendiente_pago'
        END
    WHERE id = v_venta_id
      AND estado NOT IN ('anulada', 'rechazada');

    RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: fn_set_updated_at(); Type: FUNCTION; Schema: facturacion; Owner: -
--

CREATE FUNCTION facturacion.fn_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


--
-- Name: fn_set_clasificacion(); Type: FUNCTION; Schema: gastos; Owner: -
--

CREATE FUNCTION gastos.fn_set_clasificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.producto_id IS NOT NULL THEN
        NEW.clasificacion := 'Suministros';
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_crear_entrada(); Type: FUNCTION; Schema: inventario; Owner: -
--

CREATE FUNCTION inventario.fn_crear_entrada() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inventariable BOOLEAN;
    v_entrada_id INT;
BEGIN
    IF NEW.producto_id IS NOT NULL AND NEW.clasificacion = 'Suministros' THEN
        SELECT inventariable INTO v_inventariable FROM inventario.productos WHERE id = NEW.producto_id;
        IF v_inventariable THEN
            SELECT id INTO v_entrada_id FROM inventario.entradas WHERE gasto_id = NEW.id;
            IF NOT FOUND THEN
                INSERT INTO inventario.entradas (gasto_id, producto_id, cantidad, cantidad_disponible, costo_unitario, fecha)
                VALUES (NEW.id, NEW.producto_id, NEW.cantidad, NEW.cantidad, NEW.valor_unitario, NEW.fecha);
            ELSE
                UPDATE inventario.entradas
                SET producto_id = NEW.producto_id,
                    cantidad = NEW.cantidad,
                    cantidad_disponible = NEW.cantidad,
                    costo_unitario = NEW.valor_unitario,
                    fecha = NEW.fecha
                WHERE id = v_entrada_id;
            END IF;
        END IF;
    ELSE
        DELETE FROM inventario.entradas WHERE gasto_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: medios_pago; Type: TABLE; Schema: cartera; Owner: -
--

CREATE TABLE cartera.medios_pago (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: medios_pago_id_seq; Type: SEQUENCE; Schema: cartera; Owner: -
--

CREATE SEQUENCE cartera.medios_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medios_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: cartera; Owner: -
--

ALTER SEQUENCE cartera.medios_pago_id_seq OWNED BY cartera.medios_pago.id;


--
-- Name: pago_aplicaciones; Type: TABLE; Schema: cartera; Owner: -
--

CREATE TABLE cartera.pago_aplicaciones (
    id integer NOT NULL,
    pago_id integer NOT NULL,
    venta_id integer NOT NULL,
    valor_aplicado numeric(18,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT pago_aplicaciones_valor_aplicado_check CHECK ((valor_aplicado > (0)::numeric))
);


--
-- Name: pago_aplicaciones_id_seq; Type: SEQUENCE; Schema: cartera; Owner: -
--

CREATE SEQUENCE cartera.pago_aplicaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pago_aplicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: cartera; Owner: -
--

ALTER SEQUENCE cartera.pago_aplicaciones_id_seq OWNED BY cartera.pago_aplicaciones.id;


--
-- Name: pagos; Type: TABLE; Schema: cartera; Owner: -
--

CREATE TABLE cartera.pagos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    medio_pago_id integer,
    referencia character varying(100),
    fecha_pago date DEFAULT CURRENT_DATE NOT NULL,
    valor_total numeric(18,2) NOT NULL,
    observaciones text,
    anulado boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT pagos_valor_total_check CHECK ((valor_total > (0)::numeric))
);


--
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: cartera; Owner: -
--

CREATE SEQUENCE cartera.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: cartera; Owner: -
--

ALTER SEQUENCE cartera.pagos_id_seq OWNED BY cartera.pagos.id;


--
-- Name: terceros; Type: TABLE; Schema: facturacion; Owner: -
--

CREATE TABLE facturacion.terceros (
    id integer NOT NULL,
    tipo_documento character varying(5) NOT NULL,
    numero_documento character varying(20) NOT NULL,
    digito_verificacion character varying(1),
    tipo_persona character varying(20),
    razon_social character varying(255) NOT NULL,
    direccion character varying(255),
    codigo_ciudad character varying(10),
    ciudad character varying(100),
    codigo_departamento character varying(10),
    departamento character varying(100),
    codigo_postal character varying(10),
    pais character varying(2) DEFAULT 'CO'::character varying,
    telefono character varying(50),
    email character varying(150),
    es_propio boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    es_cliente boolean DEFAULT false,
    es_proveedor boolean DEFAULT false
);


--
-- Name: ventas; Type: TABLE; Schema: facturacion; Owner: -
--

CREATE TABLE facturacion.ventas (
    id integer NOT NULL,
    cufe character varying(100),
    prefijo character varying(10),
    numero character varying(20),
    numero_completo character varying(30) NOT NULL,
    tipo_documento_code character varying(5),
    customization_id character varying(10),
    fecha_emision date NOT NULL,
    hora_emision time without time zone,
    fecha_vencimiento date,
    moneda character varying(3) DEFAULT 'COP'::character varying,
    valor_subtotal numeric(18,2) DEFAULT 0,
    valor_descuento numeric(18,2) DEFAULT 0,
    valor_recargo numeric(18,2) DEFAULT 0,
    valor_total_bruto numeric(18,2) DEFAULT 0,
    valor_total_impuestos numeric(18,2) DEFAULT 0,
    valor_iva numeric(18,2) DEFAULT 0,
    valor_inc numeric(18,2) DEFAULT 0,
    valor_ica numeric(18,2) DEFAULT 0,
    valor_total_neto numeric(18,2) DEFAULT 0,
    valor_retencion_fuente numeric(18,2) DEFAULT 0,
    valor_retencion_iva numeric(18,2) DEFAULT 0,
    valor_retencion_ica numeric(18,2) DEFAULT 0,
    valor_anticipos numeric(18,2) DEFAULT 0,
    valor_a_pagar numeric(18,2) NOT NULL,
    emisor_id integer NOT NULL,
    receptor_id integer NOT NULL,
    resolucion_numero character varying(50),
    resolucion_fecha_desde date,
    resolucion_fecha_hasta date,
    resolucion_prefijo character varying(10),
    resolucion_rango_desde character varying(20),
    resolucion_rango_hasta character varying(20),
    medio_pago_code character varying(10),
    fecha_vencimiento_pago date,
    periodo_facturacion character varying(255),
    qr_code text,
    codigo_respuesta_dian character varying(10),
    descripcion_respuesta_dian character varying(255),
    estado_validacion_dian character varying(10),
    fecha_validacion_dian date,
    hora_validacion_dian time without time zone,
    estado character varying(20) DEFAULT 'recibida'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    saldo_pendiente numeric(18,2),
    observaciones text,
    CONSTRAINT ventas_estado_check CHECK (((estado)::text = ANY ((ARRAY['recibida'::character varying, 'pendiente_pago'::character varying, 'pagada_parcial'::character varying, 'pagada'::character varying, 'anulada'::character varying, 'rechazada'::character varying])::text[])))
);


--
-- Name: vw_cartera_activa; Type: VIEW; Schema: cartera; Owner: -
--

CREATE VIEW cartera.vw_cartera_activa AS
 SELECT v.id AS venta_id,
    v.numero_completo,
    v.fecha_emision,
    v.fecha_vencimiento,
    v.fecha_vencimiento_pago,
    v.valor_a_pagar,
    v.valor_retencion_fuente,
    (v.valor_a_pagar - COALESCE(v.saldo_pendiente, (0)::numeric)) AS total_pagado,
    COALESCE(v.saldo_pendiente, v.valor_a_pagar) AS saldo_pendiente,
    t.id AS cliente_id,
    t.razon_social AS cliente,
    t.numero_documento AS nit_cliente,
    v.estado,
        CASE
            WHEN (COALESCE(v.saldo_pendiente, v.valor_a_pagar) <= (0)::numeric) THEN 'Pagada'::text
            WHEN (v.fecha_vencimiento_pago IS NULL) THEN 'Sin vencimiento'::text
            WHEN (CURRENT_DATE > v.fecha_vencimiento_pago) THEN 'Vencida'::text
            ELSE 'Al día'::text
        END AS estado_cartera,
        CASE
            WHEN (COALESCE(v.saldo_pendiente, v.valor_a_pagar) <= (0)::numeric) THEN 0
            WHEN (v.fecha_vencimiento_pago IS NULL) THEN 0
            WHEN (CURRENT_DATE <= v.fecha_vencimiento_pago) THEN 0
            WHEN ((CURRENT_DATE - v.fecha_vencimiento_pago) <= 30) THEN 30
            WHEN ((CURRENT_DATE - v.fecha_vencimiento_pago) <= 60) THEN 60
            WHEN ((CURRENT_DATE - v.fecha_vencimiento_pago) <= 90) THEN 90
            ELSE 999
        END AS dias_vencida
   FROM (facturacion.ventas v
     JOIN facturacion.terceros t ON ((t.id = v.receptor_id)))
  WHERE ((v.estado)::text <> ALL ((ARRAY['anulada'::character varying, 'rechazada'::character varying])::text[]))
  ORDER BY v.fecha_vencimiento_pago, v.fecha_emision DESC;


--
-- Name: vw_pago_detalle; Type: VIEW; Schema: cartera; Owner: -
--

CREATE VIEW cartera.vw_pago_detalle AS
 SELECT pa.id AS aplicacion_id,
    pa.pago_id,
    pa.venta_id,
    pa.valor_aplicado,
    pa.created_at AS fecha_aplicacion,
    v.numero_completo AS factura_numero,
    v.fecha_emision AS factura_fecha,
    v.valor_a_pagar AS factura_valor
   FROM (cartera.pago_aplicaciones pa
     JOIN facturacion.ventas v ON ((v.id = pa.venta_id)));


--
-- Name: vw_pagos_resumen; Type: VIEW; Schema: cartera; Owner: -
--

CREATE VIEW cartera.vw_pagos_resumen AS
 SELECT p.id,
    p.fecha_pago,
    p.valor_total,
    p.referencia,
    p.anulado,
    mp.nombre AS medio_pago,
    t.id AS cliente_id,
    t.razon_social AS cliente,
    t.numero_documento AS nit_cliente,
    COALESCE(pa.facturas_aplicadas, (0)::bigint) AS facturas_aplicadas,
    COALESCE(pa.total_aplicado, (0)::numeric) AS total_aplicado,
        CASE
            WHEN (COALESCE(pa.total_aplicado, (0)::numeric) < p.valor_total) THEN (p.valor_total - COALESCE(pa.total_aplicado, (0)::numeric))
            ELSE (0)::numeric
        END AS sin_aplicar
   FROM (((cartera.pagos p
     JOIN facturacion.terceros t ON ((t.id = p.cliente_id)))
     LEFT JOIN cartera.medios_pago mp ON ((mp.id = p.medio_pago_id)))
     LEFT JOIN ( SELECT pago_aplicaciones.pago_id,
            count(*) AS facturas_aplicadas,
            sum(pago_aplicaciones.valor_aplicado) AS total_aplicado
           FROM cartera.pago_aplicaciones
          GROUP BY pago_aplicaciones.pago_id) pa ON ((pa.pago_id = p.id)))
  ORDER BY p.fecha_pago DESC, p.id DESC;


--
-- Name: facturas_compra; Type: TABLE; Schema: compras; Owner: -
--

CREATE TABLE compras.facturas_compra (
    id integer NOT NULL,
    tipo_documento_compra character varying(20) DEFAULT 'factura_electronica'::character varying NOT NULL,
    codigo_unico_documento character varying(100),
    numero_completo character varying(30) NOT NULL,
    fecha_emision date NOT NULL,
    fecha_recepcion date DEFAULT CURRENT_DATE,
    moneda character varying(3) DEFAULT 'COP'::character varying,
    valor_subtotal numeric(18,2) DEFAULT 0,
    valor_total_impuestos numeric(18,2) DEFAULT 0,
    valor_iva numeric(18,2) DEFAULT 0,
    valor_a_pagar numeric(18,2) NOT NULL,
    proveedor_id integer NOT NULL,
    receptor_id integer NOT NULL,
    estado character varying(20) DEFAULT 'recibida'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT facturas_compra_estado_check CHECK (((estado)::text = ANY ((ARRAY['recibida'::character varying, 'pendiente_pago'::character varying, 'pagada_parcial'::character varying, 'pagada'::character varying, 'anulada'::character varying, 'rechazada'::character varying])::text[]))),
    CONSTRAINT facturas_compra_tipo_documento_compra_check CHECK (((tipo_documento_compra)::text = ANY ((ARRAY['factura_electronica'::character varying, 'documento_soporte'::character varying])::text[])))
);


--
-- Name: facturas_compra_archivos; Type: TABLE; Schema: compras; Owner: -
--

CREATE TABLE compras.facturas_compra_archivos (
    id integer NOT NULL,
    factura_compra_id integer NOT NULL,
    tipo_archivo character varying(20) NOT NULL,
    nombre_archivo character varying(255),
    ruta_archivo character varying(500),
    contenido_xml text,
    hash_sha256 character varying(64),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT facturas_compra_archivos_tipo_archivo_check CHECK (((tipo_archivo)::text = ANY ((ARRAY['xml_invoice'::character varying, 'pdf'::character varying, 'otro'::character varying])::text[])))
);


--
-- Name: facturas_compra_archivos_id_seq; Type: SEQUENCE; Schema: compras; Owner: -
--

CREATE SEQUENCE compras.facturas_compra_archivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: facturas_compra_archivos_id_seq; Type: SEQUENCE OWNED BY; Schema: compras; Owner: -
--

ALTER SEQUENCE compras.facturas_compra_archivos_id_seq OWNED BY compras.facturas_compra_archivos.id;


--
-- Name: facturas_compra_id_seq; Type: SEQUENCE; Schema: compras; Owner: -
--

CREATE SEQUENCE compras.facturas_compra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: facturas_compra_id_seq; Type: SEQUENCE OWNED BY; Schema: compras; Owner: -
--

ALTER SEQUENCE compras.facturas_compra_id_seq OWNED BY compras.facturas_compra.id;


--
-- Name: factura_archivos; Type: TABLE; Schema: facturacion; Owner: -
--

CREATE TABLE facturacion.factura_archivos (
    id integer NOT NULL,
    factura_id integer NOT NULL,
    tipo_archivo character varying(20) NOT NULL,
    nombre_archivo character varying(255),
    ruta_archivo character varying(500),
    contenido_xml text,
    hash_sha256 character varying(64),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT factura_archivos_tipo_archivo_check CHECK (((tipo_archivo)::text = ANY ((ARRAY['xml_attached_document'::character varying, 'xml_invoice'::character varying, 'xml_application_response'::character varying, 'pdf'::character varying, 'otro'::character varying])::text[])))
);


--
-- Name: factura_archivos_id_seq; Type: SEQUENCE; Schema: facturacion; Owner: -
--

CREATE SEQUENCE facturacion.factura_archivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: factura_archivos_id_seq; Type: SEQUENCE OWNED BY; Schema: facturacion; Owner: -
--

ALTER SEQUENCE facturacion.factura_archivos_id_seq OWNED BY facturacion.factura_archivos.id;


--
-- Name: factura_impuestos; Type: TABLE; Schema: facturacion; Owner: -
--

CREATE TABLE facturacion.factura_impuestos (
    id integer NOT NULL,
    factura_id integer NOT NULL,
    factura_item_id integer,
    tipo_impuesto character varying(10) NOT NULL,
    nombre_impuesto character varying(50),
    porcentaje numeric(5,2) DEFAULT 0,
    base_gravable numeric(18,2) DEFAULT 0,
    valor numeric(18,2) DEFAULT 0
);


--
-- Name: factura_impuestos_id_seq; Type: SEQUENCE; Schema: facturacion; Owner: -
--

CREATE SEQUENCE facturacion.factura_impuestos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: factura_impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: facturacion; Owner: -
--

ALTER SEQUENCE facturacion.factura_impuestos_id_seq OWNED BY facturacion.factura_impuestos.id;


--
-- Name: factura_respuestas_dian; Type: TABLE; Schema: facturacion; Owner: -
--

CREATE TABLE facturacion.factura_respuestas_dian (
    id integer NOT NULL,
    factura_id integer NOT NULL,
    linea_id integer,
    codigo_respuesta character varying(10),
    descripcion text
);


--
-- Name: factura_respuestas_dian_id_seq; Type: SEQUENCE; Schema: facturacion; Owner: -
--

CREATE SEQUENCE facturacion.factura_respuestas_dian_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: factura_respuestas_dian_id_seq; Type: SEQUENCE OWNED BY; Schema: facturacion; Owner: -
--

ALTER SEQUENCE facturacion.factura_respuestas_dian_id_seq OWNED BY facturacion.factura_respuestas_dian.id;


--
-- Name: terceros_id_seq; Type: SEQUENCE; Schema: facturacion; Owner: -
--

CREATE SEQUENCE facturacion.terceros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: terceros_id_seq; Type: SEQUENCE OWNED BY; Schema: facturacion; Owner: -
--

ALTER SEQUENCE facturacion.terceros_id_seq OWNED BY facturacion.terceros.id;


--
-- Name: ventas_id_seq; Type: SEQUENCE; Schema: facturacion; Owner: -
--

CREATE SEQUENCE facturacion.ventas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ventas_id_seq; Type: SEQUENCE OWNED BY; Schema: facturacion; Owner: -
--

ALTER SEQUENCE facturacion.ventas_id_seq OWNED BY facturacion.ventas.id;


--
-- Name: ventas_items; Type: TABLE; Schema: facturacion; Owner: -
--

CREATE TABLE facturacion.ventas_items (
    id integer NOT NULL,
    venta_id integer NOT NULL,
    numero_linea integer NOT NULL,
    descripcion text NOT NULL,
    codigo_producto character varying(50),
    cantidad numeric(18,6) DEFAULT 1 NOT NULL,
    unidad_medida character varying(10),
    valor_unitario numeric(18,2) NOT NULL,
    porcentaje_descuento numeric(5,2) DEFAULT 0,
    valor_descuento numeric(18,2) DEFAULT 0,
    valor_linea numeric(18,2) NOT NULL,
    producto_id integer,
    valor_retencion_fuente numeric(18,2) DEFAULT 0 NOT NULL
);


--
-- Name: ventas_items_id_seq; Type: SEQUENCE; Schema: facturacion; Owner: -
--

CREATE SEQUENCE facturacion.ventas_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ventas_items_id_seq; Type: SEQUENCE OWNED BY; Schema: facturacion; Owner: -
--

ALTER SEQUENCE facturacion.ventas_items_id_seq OWNED BY facturacion.ventas_items.id;


--
-- Name: ventas_manual_seq; Type: SEQUENCE; Schema: facturacion; Owner: -
--

CREATE SEQUENCE facturacion.ventas_manual_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vw_facturas_resumen; Type: VIEW; Schema: facturacion; Owner: -
--

CREATE VIEW facturacion.vw_facturas_resumen AS
 SELECT v.id,
    v.numero_completo,
    v.cufe,
    v.fecha_emision,
    v.fecha_vencimiento,
    e.razon_social AS emisor,
    e.numero_documento AS nit_emisor,
    r.razon_social AS receptor,
    r.numero_documento AS nit_receptor,
    v.valor_a_pagar,
    v.estado,
    v.codigo_respuesta_dian,
    v.estado_validacion_dian,
    v.observaciones
   FROM ((facturacion.ventas v
     JOIN facturacion.terceros e ON ((e.id = v.emisor_id)))
     JOIN facturacion.terceros r ON ((r.id = v.receptor_id)));


--
-- Name: gastos; Type: TABLE; Schema: gastos; Owner: -
--

CREATE TABLE gastos.gastos (
    id integer NOT NULL,
    factura_compra_id integer,
    proveedor_id integer,
    producto_id integer,
    venta_item_id integer,
    descripcion text NOT NULL,
    clasificacion character varying(20) NOT NULL,
    cantidad numeric(18,6) DEFAULT 1 NOT NULL,
    valor_unitario numeric(18,2) NOT NULL,
    valor_total numeric(18,2) NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    codigo_producto character varying(50),
    CONSTRAINT gastos_check CHECK ((NOT ((producto_id IS NOT NULL) AND (venta_item_id IS NOT NULL))))
);


--
-- Name: salidas; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.salidas (
    id integer NOT NULL,
    factura_item_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad numeric(18,6) NOT NULL,
    costo_total numeric(18,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: vw_utilidad_items; Type: VIEW; Schema: facturacion; Owner: -
--

CREATE VIEW facturacion.vw_utilidad_items AS
 SELECT fi.id AS venta_item_id,
    fi.descripcion,
    fi.valor_linea,
    fi.producto_id,
    COALESCE(v.valor_retencion_fuente, (0)::numeric) AS valor_retencion_fuente,
    COALESCE(sal.costo_inventario, (0)::numeric) AS costo_inventario,
    COALESCE(gd.costo_directo, (0)::numeric) AS costo_directo,
    (((fi.valor_linea - COALESCE(sal.costo_inventario, (0)::numeric)) - COALESCE(gd.costo_directo, (0)::numeric)) - COALESCE(v.valor_retencion_fuente, (0)::numeric)) AS utilidad
   FROM (((facturacion.ventas_items fi
     JOIN facturacion.ventas v ON ((v.id = fi.venta_id)))
     LEFT JOIN ( SELECT salidas.factura_item_id,
            sum(salidas.costo_total) AS costo_inventario
           FROM inventario.salidas
          GROUP BY salidas.factura_item_id) sal ON ((sal.factura_item_id = fi.id)))
     LEFT JOIN ( SELECT gastos.venta_item_id,
            sum(gastos.valor_total) AS costo_directo
           FROM gastos.gastos
          WHERE (gastos.venta_item_id IS NOT NULL)
          GROUP BY gastos.venta_item_id) gd ON ((gd.venta_item_id = fi.id)));


--
-- Name: clasificaciones; Type: TABLE; Schema: gastos; Owner: -
--

CREATE TABLE gastos.clasificaciones (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: clasificaciones_id_seq; Type: SEQUENCE; Schema: gastos; Owner: -
--

CREATE SEQUENCE gastos.clasificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clasificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: gastos; Owner: -
--

ALTER SEQUENCE gastos.clasificaciones_id_seq OWNED BY gastos.clasificaciones.id;


--
-- Name: gastos_id_seq; Type: SEQUENCE; Schema: gastos; Owner: -
--

CREATE SEQUENCE gastos.gastos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gastos_id_seq; Type: SEQUENCE OWNED BY; Schema: gastos; Owner: -
--

ALTER SEQUENCE gastos.gastos_id_seq OWNED BY gastos.gastos.id;


--
-- Name: caso_detalles; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.caso_detalles (
    id integer NOT NULL,
    caso_id integer NOT NULL,
    creado_por integer,
    contenido text NOT NULL,
    tipo character varying(20) DEFAULT 'Comentario'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT caso_detalles_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Comentario'::character varying, 'Diagnóstico'::character varying, 'Solución'::character varying, 'Acuerdo'::character varying, 'Sistema'::character varying])::text[])))
);


--
-- Name: caso_detalles_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.caso_detalles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: caso_detalles_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.caso_detalles_id_seq OWNED BY helpdesk.caso_detalles.id;


--
-- Name: caso_numero_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.caso_numero_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: casos; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.casos (
    id integer NOT NULL,
    numero character varying(20) DEFAULT ('CASO-'::text || lpad((nextval('helpdesk.caso_numero_seq'::regclass))::text, 4, '0'::text)),
    titulo character varying(300) NOT NULL,
    descripcion text,
    categoria_id integer,
    recurso_id integer,
    cliente_id integer,
    contacto_id integer,
    tecnico_id integer,
    estado character varying(20) DEFAULT 'Pendiente'::character varying,
    telegram_chat_id character varying(100),
    telegram_topic_id character varying(100),
    whatsapp_chat_id character varying(100),
    fuente character varying(20) DEFAULT 'Manual'::character varying,
    ai_report text,
    solucion text,
    venta_item_id integer,
    resumen text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT casos_estado_check CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'En Progreso'::character varying, 'Completado'::character varying, 'Cancelado'::character varying])::text[]))),
    CONSTRAINT casos_fuente_check CHECK (((fuente)::text = ANY ((ARRAY['Manual'::character varying, 'WhatsApp'::character varying, 'Telegram'::character varying, 'Email'::character varying, 'Web'::character varying])::text[])))
);


--
-- Name: casos_contactos; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.casos_contactos (
    caso_id integer NOT NULL,
    contacto_id integer NOT NULL
);


--
-- Name: casos_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.casos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: casos_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.casos_id_seq OWNED BY helpdesk.casos.id;


--
-- Name: casos_recursos; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.casos_recursos (
    caso_id integer NOT NULL,
    recurso_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: categorias_caso; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.categorias_caso (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    color character varying(7) DEFAULT '#6B7280'::character varying,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: categorias_caso_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.categorias_caso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_caso_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.categorias_caso_id_seq OWNED BY helpdesk.categorias_caso.id;


--
-- Name: categorias_mantenimiento; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.categorias_mantenimiento (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    color character varying(7) DEFAULT '#6B7280'::character varying
);


--
-- Name: categorias_mantenimiento_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.categorias_mantenimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_mantenimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.categorias_mantenimiento_id_seq OWNED BY helpdesk.categorias_mantenimiento.id;


--
-- Name: contactos; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.contactos (
    id integer NOT NULL,
    cliente_id integer,
    nombre character varying(200) NOT NULL,
    telefono character varying(50),
    email character varying(200),
    whatsapp character varying(50),
    cargo character varying(200),
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: contactos_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.contactos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contactos_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.contactos_id_seq OWNED BY helpdesk.contactos.id;


--
-- Name: mantenimiento_detalles; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.mantenimiento_detalles (
    id integer NOT NULL,
    mantenimiento_id integer NOT NULL,
    creado_por integer,
    contenido text NOT NULL,
    tipo character varying(20) DEFAULT 'Comentario'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT mantenimiento_detalles_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Comentario'::character varying, 'Diagnóstico'::character varying, 'Solución'::character varying, 'Repuesto'::character varying, 'Acuerdo'::character varying])::text[])))
);


--
-- Name: mantenimiento_detalles_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.mantenimiento_detalles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mantenimiento_detalles_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.mantenimiento_detalles_id_seq OWNED BY helpdesk.mantenimiento_detalles.id;


--
-- Name: mantenimientos; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.mantenimientos (
    id integer NOT NULL,
    recurso_id integer NOT NULL,
    categoria_id integer NOT NULL,
    tecnico_id integer,
    titulo character varying(300) NOT NULL,
    descripcion text,
    prioridad character varying(20) DEFAULT 'Media'::character varying,
    estado character varying(20) DEFAULT 'Pendiente'::character varying,
    fecha_solicitud date DEFAULT CURRENT_DATE,
    fecha_ejecucion date,
    hora_inicio time without time zone,
    hora_fin time without time zone,
    costo_mano_obra numeric(12,2) DEFAULT 0,
    costo_repuestos numeric(12,2) DEFAULT 0,
    costo_total numeric(12,2) GENERATED ALWAYS AS ((costo_mano_obra + costo_repuestos)) STORED,
    venta_item_id integer,
    observaciones text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT mantenimientos_estado_check CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'En Progreso'::character varying, 'Completado'::character varying, 'Facturado'::character varying, 'Cancelado'::character varying])::text[]))),
    CONSTRAINT mantenimientos_prioridad_check CHECK (((prioridad)::text = ANY ((ARRAY['Baja'::character varying, 'Media'::character varying, 'Alta'::character varying, 'Crítica'::character varying])::text[])))
);


--
-- Name: mantenimientos_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.mantenimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mantenimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.mantenimientos_id_seq OWNED BY helpdesk.mantenimientos.id;


--
-- Name: recursos; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.recursos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    tipo character varying(50) DEFAULT 'Computador'::character varying NOT NULL,
    marca character varying(100),
    modelo character varying(100),
    referencia character varying(100),
    serial character varying(100),
    procesador character varying(200),
    memoria_gb numeric(6,1),
    almacenamiento_gb numeric(8,1),
    sistema_operativo character varying(100),
    ubicacion character varying(200),
    descripcion text,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    atributos jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT recursos_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Computador'::character varying, 'Hosting'::character varying, 'Office 365'::character varying, 'Red'::character varying, 'Celular'::character varying, 'Impresora'::character varying, 'Servidor'::character varying, 'UPS'::character varying, 'Cámara'::character varying, 'Otro'::character varying])::text[])))
);


--
-- Name: recursos_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.recursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recursos_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.recursos_id_seq OWNED BY helpdesk.recursos.id;


--
-- Name: tipos_recurso; Type: TABLE; Schema: helpdesk; Owner: -
--

CREATE TABLE helpdesk.tipos_recurso (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: tipos_recurso_id_seq; Type: SEQUENCE; Schema: helpdesk; Owner: -
--

CREATE SEQUENCE helpdesk.tipos_recurso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipos_recurso_id_seq; Type: SEQUENCE OWNED BY; Schema: helpdesk; Owner: -
--

ALTER SEQUENCE helpdesk.tipos_recurso_id_seq OWNED BY helpdesk.tipos_recurso.id;


--
-- Name: categorias; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.categorias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.categorias_id_seq OWNED BY inventario.categorias.id;


--
-- Name: entradas; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.entradas (
    id integer NOT NULL,
    gasto_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad numeric(18,6) NOT NULL,
    cantidad_disponible numeric(18,6) NOT NULL,
    costo_unitario numeric(18,2) NOT NULL,
    fecha date NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: entradas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.entradas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: entradas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.entradas_id_seq OWNED BY inventario.entradas.id;


--
-- Name: productos; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.productos (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    categoria character varying(100),
    inventariable boolean DEFAULT true NOT NULL,
    unidad_medida character varying(10) DEFAULT 'UND'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    codigo character varying(50) NOT NULL
);


--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.productos_id_seq OWNED BY inventario.productos.id;


--
-- Name: salida_detalle; Type: TABLE; Schema: inventario; Owner: -
--

CREATE TABLE inventario.salida_detalle (
    id integer NOT NULL,
    salida_id integer NOT NULL,
    entrada_id integer NOT NULL,
    cantidad_consumida numeric(18,6) NOT NULL,
    costo_unitario numeric(18,2) NOT NULL
);


--
-- Name: salida_detalle_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.salida_detalle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: salida_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.salida_detalle_id_seq OWNED BY inventario.salida_detalle.id;


--
-- Name: salidas_id_seq; Type: SEQUENCE; Schema: inventario; Owner: -
--

CREATE SEQUENCE inventario.salidas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: salidas_id_seq; Type: SEQUENCE OWNED BY; Schema: inventario; Owner: -
--

ALTER SEQUENCE inventario.salidas_id_seq OWNED BY inventario.salidas.id;


--
-- Name: vw_stock_disponible; Type: VIEW; Schema: inventario; Owner: -
--

CREATE VIEW inventario.vw_stock_disponible AS
 SELECT p.id AS producto_id,
    p.nombre,
    p.categoria,
    COALESCE(sum(e.cantidad_disponible), (0)::numeric) AS stock_actual
   FROM (inventario.productos p
     LEFT JOIN inventario.entradas e ON ((e.producto_id = p.id)))
  WHERE (p.inventariable = true)
  GROUP BY p.id, p.nombre, p.categoria;


--
-- Name: vw_utilidad_productos; Type: VIEW; Schema: inventario; Owner: -
--

CREATE VIEW inventario.vw_utilidad_productos AS
 SELECT p.id AS producto_id,
    p.codigo,
    p.nombre,
    p.categoria,
    COALESCE(compras.costo_adquisiciones, (0)::numeric) AS costo_adquisiciones,
    COALESCE(ventas.ingreso_ventas, (0)::numeric) AS ingreso_ventas,
    COALESCE(gastos_extra.otros_costos, (0)::numeric) AS otros_costos,
    ((COALESCE(ventas.ingreso_ventas, (0)::numeric) - COALESCE(compras.costo_adquisiciones, (0)::numeric)) - COALESCE(gastos_extra.otros_costos, (0)::numeric)) AS utilidad
   FROM (((inventario.productos p
     LEFT JOIN ( SELECT e.producto_id,
            sum((e.cantidad * e.costo_unitario)) AS costo_adquisiciones
           FROM inventario.entradas e
          GROUP BY e.producto_id) compras ON ((compras.producto_id = p.id)))
     LEFT JOIN ( SELECT s.producto_id,
            sum(vi.valor_linea) AS ingreso_ventas
           FROM (inventario.salidas s
             JOIN facturacion.ventas_items vi ON ((vi.id = s.factura_item_id)))
          GROUP BY s.producto_id) ventas ON ((ventas.producto_id = p.id)))
     LEFT JOIN ( SELECT g.producto_id,
            sum(g.valor_total) AS otros_costos
           FROM gastos.gastos g
          WHERE ((g.producto_id IS NOT NULL) AND (g.venta_item_id IS NULL) AND ((g.clasificacion)::text <> 'Suministros'::text))
          GROUP BY g.producto_id) gastos_extra ON ((gastos_extra.producto_id = p.id)))
  ORDER BY p.nombre;


--
-- Name: empresas; Type: TABLE; Schema: usuarios; Owner: -
--

CREATE TABLE usuarios.empresas (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    nit character varying(50) NOT NULL,
    activa boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: usuarios; Owner: -
--

CREATE SEQUENCE usuarios.empresas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: usuarios; Owner: -
--

ALTER SEQUENCE usuarios.empresas_id_seq OWNED BY usuarios.empresas.id;


--
-- Name: permisos; Type: TABLE; Schema: usuarios; Owner: -
--

CREATE TABLE usuarios.permisos (
    id integer NOT NULL,
    codigo character varying(100) NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    modulo character varying(100),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: permisos_id_seq; Type: SEQUENCE; Schema: usuarios; Owner: -
--

CREATE SEQUENCE usuarios.permisos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: usuarios; Owner: -
--

ALTER SEQUENCE usuarios.permisos_id_seq OWNED BY usuarios.permisos.id;


--
-- Name: roles; Type: TABLE; Schema: usuarios; Owner: -
--

CREATE TABLE usuarios.roles (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: usuarios; Owner: -
--

CREATE SEQUENCE usuarios.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: usuarios; Owner: -
--

ALTER SEQUENCE usuarios.roles_id_seq OWNED BY usuarios.roles.id;


--
-- Name: roles_permisos; Type: TABLE; Schema: usuarios; Owner: -
--

CREATE TABLE usuarios.roles_permisos (
    rol_id integer NOT NULL,
    permiso_id integer NOT NULL
);


--
-- Name: usuarios; Type: TABLE; Schema: usuarios; Owner: -
--

CREATE TABLE usuarios.usuarios (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombres character varying(255) NOT NULL,
    apellidos character varying(255) NOT NULL,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: usuarios; Owner: -
--

CREATE SEQUENCE usuarios.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: usuarios; Owner: -
--

ALTER SEQUENCE usuarios.usuarios_id_seq OWNED BY usuarios.usuarios.id;


--
-- Name: usuarios_roles; Type: TABLE; Schema: usuarios; Owner: -
--

CREATE TABLE usuarios.usuarios_roles (
    usuario_id integer NOT NULL,
    rol_id integer NOT NULL
);


--
-- Name: medios_pago id; Type: DEFAULT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.medios_pago ALTER COLUMN id SET DEFAULT nextval('cartera.medios_pago_id_seq'::regclass);


--
-- Name: pago_aplicaciones id; Type: DEFAULT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pago_aplicaciones ALTER COLUMN id SET DEFAULT nextval('cartera.pago_aplicaciones_id_seq'::regclass);


--
-- Name: pagos id; Type: DEFAULT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pagos ALTER COLUMN id SET DEFAULT nextval('cartera.pagos_id_seq'::regclass);


--
-- Name: facturas_compra id; Type: DEFAULT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra ALTER COLUMN id SET DEFAULT nextval('compras.facturas_compra_id_seq'::regclass);


--
-- Name: facturas_compra_archivos id; Type: DEFAULT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra_archivos ALTER COLUMN id SET DEFAULT nextval('compras.facturas_compra_archivos_id_seq'::regclass);


--
-- Name: factura_archivos id; Type: DEFAULT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_archivos ALTER COLUMN id SET DEFAULT nextval('facturacion.factura_archivos_id_seq'::regclass);


--
-- Name: factura_impuestos id; Type: DEFAULT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_impuestos ALTER COLUMN id SET DEFAULT nextval('facturacion.factura_impuestos_id_seq'::regclass);


--
-- Name: factura_respuestas_dian id; Type: DEFAULT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_respuestas_dian ALTER COLUMN id SET DEFAULT nextval('facturacion.factura_respuestas_dian_id_seq'::regclass);


--
-- Name: terceros id; Type: DEFAULT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.terceros ALTER COLUMN id SET DEFAULT nextval('facturacion.terceros_id_seq'::regclass);


--
-- Name: ventas id; Type: DEFAULT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas ALTER COLUMN id SET DEFAULT nextval('facturacion.ventas_id_seq'::regclass);


--
-- Name: ventas_items id; Type: DEFAULT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas_items ALTER COLUMN id SET DEFAULT nextval('facturacion.ventas_items_id_seq'::regclass);


--
-- Name: clasificaciones id; Type: DEFAULT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.clasificaciones ALTER COLUMN id SET DEFAULT nextval('gastos.clasificaciones_id_seq'::regclass);


--
-- Name: gastos id; Type: DEFAULT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.gastos ALTER COLUMN id SET DEFAULT nextval('gastos.gastos_id_seq'::regclass);


--
-- Name: caso_detalles id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.caso_detalles ALTER COLUMN id SET DEFAULT nextval('helpdesk.caso_detalles_id_seq'::regclass);


--
-- Name: casos id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos ALTER COLUMN id SET DEFAULT nextval('helpdesk.casos_id_seq'::regclass);


--
-- Name: categorias_caso id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.categorias_caso ALTER COLUMN id SET DEFAULT nextval('helpdesk.categorias_caso_id_seq'::regclass);


--
-- Name: categorias_mantenimiento id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.categorias_mantenimiento ALTER COLUMN id SET DEFAULT nextval('helpdesk.categorias_mantenimiento_id_seq'::regclass);


--
-- Name: contactos id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.contactos ALTER COLUMN id SET DEFAULT nextval('helpdesk.contactos_id_seq'::regclass);


--
-- Name: mantenimiento_detalles id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimiento_detalles ALTER COLUMN id SET DEFAULT nextval('helpdesk.mantenimiento_detalles_id_seq'::regclass);


--
-- Name: mantenimientos id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimientos ALTER COLUMN id SET DEFAULT nextval('helpdesk.mantenimientos_id_seq'::regclass);


--
-- Name: recursos id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.recursos ALTER COLUMN id SET DEFAULT nextval('helpdesk.recursos_id_seq'::regclass);


--
-- Name: tipos_recurso id; Type: DEFAULT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.tipos_recurso ALTER COLUMN id SET DEFAULT nextval('helpdesk.tipos_recurso_id_seq'::regclass);


--
-- Name: categorias id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.categorias ALTER COLUMN id SET DEFAULT nextval('inventario.categorias_id_seq'::regclass);


--
-- Name: entradas id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.entradas ALTER COLUMN id SET DEFAULT nextval('inventario.entradas_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.productos ALTER COLUMN id SET DEFAULT nextval('inventario.productos_id_seq'::regclass);


--
-- Name: salida_detalle id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salida_detalle ALTER COLUMN id SET DEFAULT nextval('inventario.salida_detalle_id_seq'::regclass);


--
-- Name: salidas id; Type: DEFAULT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salidas ALTER COLUMN id SET DEFAULT nextval('inventario.salidas_id_seq'::regclass);


--
-- Name: empresas id; Type: DEFAULT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.empresas ALTER COLUMN id SET DEFAULT nextval('usuarios.empresas_id_seq'::regclass);


--
-- Name: permisos id; Type: DEFAULT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.permisos ALTER COLUMN id SET DEFAULT nextval('usuarios.permisos_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.roles ALTER COLUMN id SET DEFAULT nextval('usuarios.roles_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios ALTER COLUMN id SET DEFAULT nextval('usuarios.usuarios_id_seq'::regclass);


--
-- Data for Name: medios_pago; Type: TABLE DATA; Schema: cartera; Owner: -
--

COPY cartera.medios_pago (id, nombre, created_at) FROM stdin;
1	Efectivo	2026-07-02 12:45:03.092456
2	Transferencia Bancaria	2026-07-02 12:45:03.092456
3	Cheque	2026-07-02 12:45:03.092456
4	Tarjeta Débito	2026-07-02 12:45:03.092456
5	Tarjeta Crédito	2026-07-02 12:45:03.092456
6	Consignación	2026-07-02 12:45:03.092456
7	Datafono	2026-07-02 12:45:03.092456
\.


--
-- Data for Name: pago_aplicaciones; Type: TABLE DATA; Schema: cartera; Owner: -
--

COPY cartera.pago_aplicaciones (id, pago_id, venta_id, valor_aplicado, created_at) FROM stdin;
3	2	15	290000.00	2026-07-05 14:55:46.384343
4	3	16	290000.00	2026-07-05 16:30:40.567646
5	4	18	2230000.00	2026-07-05 16:32:48.958715
6	5	19	1802775.00	2026-07-06 11:26:12.68621
7	6	76	375000.00	2026-07-11 12:33:10.700471
8	7	77	120000.00	2026-07-11 12:38:35.382531
9	8	71	25000.00	2026-07-11 16:05:30.14865
10	9	72	40000.00	2026-07-11 16:05:52.247909
11	10	23	145000.00	2026-07-11 16:10:58.108765
12	11	24	545000.00	2026-07-11 16:20:09.232672
13	12	78	235000.00	2026-07-11 16:45:51.35248
14	13	25	110000.00	2026-07-11 16:48:44.747422
15	13	26	95000.00	2026-07-11 16:48:44.747422
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: cartera; Owner: -
--

COPY cartera.pagos (id, cliente_id, medio_pago_id, referencia, fecha_pago, valor_total, observaciones, anulado, created_at, updated_at) FROM stdin;
2	40	2	\N	2026-05-07	290000.00	\N	f	2026-07-05 14:55:46.384343	2026-07-05 15:45:52.323781
3	42	2	\N	2026-05-08	290000.00	\N	f	2026-07-05 16:30:40.567646	2026-07-05 16:30:40.567646
4	46	2	\N	2026-05-11	2230000.00	\N	f	2026-07-05 16:32:48.958715	2026-07-05 16:32:48.958715
5	48	2	\N	2026-05-14	1802775.00	\N	f	2026-07-06 11:26:12.68621	2026-07-06 11:45:23.028607
6	150	2	\N	2026-07-11	375000.00	\N	f	2026-07-11 12:33:10.700471	2026-07-11 12:33:10.700471
7	143	2	\N	2026-05-24	120000.00	\N	f	2026-07-11 12:38:35.382531	2026-07-11 12:38:35.382531
8	143	2	\N	2026-07-16	25000.00	Pago Henry	f	2026-07-11 16:05:30.14865	2026-07-11 16:05:30.14865
9	143	2	\N	2026-05-17	40000.00	Pago Mileidy	f	2026-07-11 16:05:52.247909	2026-07-11 16:05:52.247909
10	56	2	\N	2026-05-26	145000.00	\N	f	2026-07-11 16:10:58.108765	2026-07-11 16:10:58.108765
11	58	2	\N	2026-05-29	545000.00	\N	f	2026-07-11 16:20:09.232672	2026-07-11 16:20:09.232672
12	143	2	\N	2026-06-01	235000.00	Pago Marcela Autonorte	f	2026-07-11 16:45:51.35248	2026-07-11 16:45:51.35248
13	60	2	\N	2026-06-03	205000.00	\N	f	2026-07-11 16:48:44.747422	2026-07-11 16:48:44.747422
\.


--
-- Data for Name: facturas_compra; Type: TABLE DATA; Schema: compras; Owner: -
--

COPY compras.facturas_compra (id, tipo_documento_compra, codigo_unico_documento, numero_completo, fecha_emision, fecha_recepcion, moneda, valor_subtotal, valor_total_impuestos, valor_iva, valor_a_pagar, proveedor_id, receptor_id, estado, created_at, updated_at) FROM stdin;
9	factura_electronica	e2dbe79a29ccf71a9929f32667579a2f2a3394ad01f7f36d609f9c7589ceecdfb4efaf11d42d7d1315be37778e883d86	FEME38737	2026-05-11	2026-07-02	COP	1628571.43	309428.57	309428.57	1938000.00	83	39	recibida	2026-07-03 02:10:09.989427	2026-07-03 02:10:09.989427
10	factura_electronica	c5ce438ed321fc6ca30987b9f8beef220348bd9544083613315dc75306b0f487f63a3dad5bb71a40bb115ee907897fb1	E6059562405	2026-05-14	2026-07-02	COP	50448.33	9686.08	9585.18	60134.41	85	86	recibida	2026-07-03 02:10:36.103673	2026-07-03 02:10:36.103673
11	factura_electronica	5be04e07465f3f48b181186ad3ec2b4360ae8e4688c9c9dde6a07d041798ce25eaca5af406fd20e9e9cf6290870cff3e	FEGL80631	2026-05-14	2026-07-02	COP	1619000.00	0.00	0.00	1619000.00	87	86	recibida	2026-07-03 02:10:48.11119	2026-07-03 02:10:48.11119
12	factura_electronica	c608be689a8ed3c81c3df535ec675d43614ef5d33f67caa3f368eb769fe4473d755e5fa008333968dfd51d1549fb31aa	FEVT144434	2026-05-06	2026-07-02	COP	88235.29	16764.71	16764.71	105000.00	89	86	recibida	2026-07-03 02:10:56.358422	2026-07-03 02:10:56.358422
13	factura_electronica	252c1dc63de434f9a48d60c764360a8ae26104e72974ecb709baa19d720f5bbdba70f44d0dafdaea1f787c9ad0d23e65	POB41584	2026-05-22	2026-07-03	COP	273109.24	51890.76	51890.76	325000.00	93	39	recibida	2026-07-03 10:16:34.493766	2026-07-03 10:16:34.493766
14	factura_electronica	8e26743c27deda2444bdef34857ab405e5a201b2f9af71c758da1aab9612e81522bf8df33f0db714ccf8aa560213ea54	FEVT147561	2026-06-01	2026-07-03	COP	71428.57	13571.43	13571.43	85000.00	89	86	recibida	2026-07-03 10:19:19.089725	2026-07-03 10:19:19.089725
15	factura_electronica	0505435b9e58740f60120f5b6f277bf2cb3fbf3dc0e816640fb2eb07f12ed531879d5df8ce6d43408b94dded0785e6b8	FEVT147752	2026-06-02	2026-07-03	COP	29411.76	5588.24	5588.24	35000.00	89	86	recibida	2026-07-03 10:23:59.279011	2026-07-03 10:23:59.279011
16	factura_electronica	5be808385e3a4aa94503bb7fe6dd99510fcd3030123d770aa0d501b83f4ef1fd69f2f89b60c200e220231105614c74f1	E6070413164	2026-06-14	2026-07-03	COP	50448.33	9686.08	9585.18	60134.41	85	86	recibida	2026-07-03 10:25:25.187827	2026-07-03 10:25:25.187827
17	factura_electronica	9bce35412d61e2410d8fd70067e1a5edd042237b1ebaa2c277a00d0555b79c9351d581b9dee60d44e6f4034cdc8761a2	POB41916	2026-06-17	2026-07-03	COP	396000.00	0.00	0.00	396000.00	93	39	recibida	2026-07-03 10:28:03.881451	2026-07-03 10:28:03.881451
18	factura_electronica	b8a99d1e67a92ea1be8d821d473b59890c898d5efb12a24feca1ce83e91cd48bd428f798578c354e5f24248bbcebffcb	FEVT149159	2026-06-17	2026-07-03	COP	81512.61	15487.39	15487.39	97000.00	89	86	recibida	2026-07-03 10:29:32.232503	2026-07-03 10:29:32.232503
19	factura_electronica	4491ba86b72b4bc9686077aa5a6171d782761f50820cc8b17c5e582008f84c4488ff24792c52f658df30c5219d84a079	FEVT147751	2026-06-02	2026-07-05	COP	33613.45	6386.55	6386.55	40000.00	89	86	recibida	2026-07-05 11:25:45.156031	2026-07-05 11:25:45.156031
20	factura_electronica	1000c48b5f14f5a604970b17fd1717ad04e5438218362423cd3a3a3ea31151f4b0aa769496d22b7235541b7fac224c7f	POB42273	2026-07-10	2026-07-11	COP	164000.00	0.00	0.00	164000.00	93	39	recibida	2026-07-11 12:20:00.111132	2026-07-11 12:20:00.111132
\.


--
-- Data for Name: facturas_compra_archivos; Type: TABLE DATA; Schema: compras; Owner: -
--

COPY compras.facturas_compra_archivos (id, factura_compra_id, tipo_archivo, nombre_archivo, ruta_archivo, contenido_xml, hash_sha256, created_at) FROM stdin;
5	9	xml_invoice	Alhum.xml	\N	<?xml version="1.0" encoding="utf-8"?><AttachedDocument xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-AttachedDocument-2.1.xsd" xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2" xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDataTypes-2" xmlns:sac="urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2" xmlns:sbc="urn:oasis:names:specification:ubl:schema:xsd:SignatureBasicComponents-2" xmlns:udt="urn:oasis:names:specification:ubl:schema:xsd:UnqualifiedDataTypes-2" xmlns:ccts-cct="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-b2e249f3-189b-4979-ad2a-5d53af10d558"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-906096cd-2f4d-42dc-825c-dbd7a6451e0f-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>nliQqBWeiZzk9vvT/cxGGvZAGTW69w56OkqamPx/5NU=</ds:DigestValue></ds:Reference><ds:Reference URI="#xmldsig-b2e249f3-189b-4979-ad2a-5d53af10d558-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>U7JS04aiC2OCU67wstwxQXi1mRtmlMY5zLbetY+Nhl4=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-b2e249f3-189b-4979-ad2a-5d53af10d558-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>mDPj/4vOy37ktWzHb7p5d5LQ5fAr0D9POESZ17+05F0=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-b2e249f3-189b-4979-ad2a-5d53af10d558-sigvalue">QHxSUhxv5Ss/4azD0HfW+MPk3ZolOO6o+FwkFWRv/o+lxbWTI9508r9MGDX/vNNcBAqZtqgcYoNtaGOZkW0Cq4aILOpGkREDWfY7G38b4ZlJY4c1qdCQW5vnikFYUWg9oCFhGb97dLBii1i7eW7HskCZJBvxn4Hcxd/nZCi+PWGPHwa306IdBUXTkrU7xNYvcJBXXBS1RYfj11GIjWMj3AnMw/ooLFzq+Xijvyb/iC29e8VFbsWLea4GNyoo3H0VAhg0w2R0yhEg54a9jOhpGxwhpLSxKbld+uYDxJRAgwcc7KEfb9sZhwO1cMOvZmvPlxIs08ZOv0MXmrVI01VvNQ==</ds:SignatureValue><ds:KeyInfo Id="xmldsig-b2e249f3-189b-4979-ad2a-5d53af10d558-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object Id="XadesObjectId-64d6daa5-bf2f-4364-a8d9-fe4c3cc06a2a"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-04531ead-b42b-4a6d-9d2b-6aeb9427024b" Target="#xmldsig-b2e249f3-189b-4979-ad2a-5d53af10d558"><xades:SignedProperties Id="xmldsig-b2e249f3-189b-4979-ad2a-5d53af10d558-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-11T14:11:33+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>LmW+b6zYzlt1dTxh5wpS1UM4hWX+qe5xvnFDBmics4E=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, 1.2.840.113549.1.9.1=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>5727508615750229015</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#xmldsig-906096cd-2f4d-42dc-825c-dbd7a6451e0f-ref0"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>e2dbe79a29ccf71a9929f32667579a2f2a3394ad01f7f36d609f9c7589ceecdfb4efaf11d42d7d1315be37778e883d86</cbc:ID><cbc:IssueDate>2026-05-11</cbc:IssueDate><cbc:IssueTime>14:11:33</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>FEME38737</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>ALHUM LIMITADA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeID="8" schemeName="31">804016305</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeID="1" schemeName="31">71271339</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8"?>\r\n<Invoice xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:n0="urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2" xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDataTypes-2" xmlns:sac="urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2" xmlns:sbc="urn:oasis:names:specification:ubl:schema:xsd:SignatureBasicComponents-2" xmlns:udt="urn:oasis:names:specification:ubl:schema:xsd:UnqualifiedDataTypes-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\r\n  <ext:UBLExtensions>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent>\r\n        <sts:DianExtensions>\r\n          <sts:InvoiceControl>\r\n            <sts:InvoiceAuthorization>18764091205315</sts:InvoiceAuthorization>\r\n            <sts:AuthorizationPeriod>\r\n              <cbc:StartDate>2025-03-29</cbc:StartDate>\r\n              <cbc:EndDate>2027-03-29</cbc:EndDate>\r\n            </sts:AuthorizationPeriod>\r\n            <sts:AuthorizedInvoices>\r\n              <sts:Prefix>FEME</sts:Prefix>\r\n              <sts:From>20001</sts:From>\r\n              <sts:To>50000</sts:To>\r\n            </sts:AuthorizedInvoices>\r\n          </sts:InvoiceControl>\r\n          <sts:InvoiceSource>\r\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n          </sts:InvoiceSource>\r\n          <sts:SoftwareProvider>\r\n            <sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="8" schemeName="31">830048145</sts:ProviderID>\r\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">708c12e5-c77b-4377-b115-2dba667b9c9b</sts:SoftwareID>\r\n          </sts:SoftwareProvider>\r\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">391a5e069ec6a33fc883e4573bd1cfb9ef199350b8bba9eb5ea01b6206a076dfdc0de637ffb6ce48e10c7c93472808dc</sts:SoftwareSecurityCode>\r\n          <sts:AuthorizationProvider>\r\n            <sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID>\r\n          </sts:AuthorizationProvider>\r\n          <sts:QRCode>NumFac:FEME38737\r\nFecFac:2026-05-11\r\nHorFac:14:11:00-05:00\r\nNitFac:804016305\r\nDocAdq:71271339\r\nValFac:1628571.43\r\nValIva:309428.57\r\nValOtroIm:0\r\nValTolFac:1938000.0\r\nCUFE:e2dbe79a29ccf71a9929f32667579a2f2a3394ad01f7f36d609f9c7589ceecdfb4efaf11d42d7d1315be37778e883d86\r\nhttps://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=e2dbe79a29ccf71a9929f32667579a2f2a3394ad01f7f36d609f9c7589ceecdfb4efaf11d42d7d1315be37778e883d86</sts:QRCode>\r\n        </sts:DianExtensions>\r\n      </ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-61a32ba4-5a3e-48e7-b351-f229598e38d1"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-afbc62c4-0ba2-4807-9ab1-c595d1aba8cb-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>CH5/t4YJTog+K/dr1V6aXLNcC0t8gJdvlbaBr2GdhO8=</ds:DigestValue></ds:Reference><ds:Reference URI="#xmldsig-61a32ba4-5a3e-48e7-b351-f229598e38d1-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>uH5Ec51OMC4qVXodyJsMIcDSMulNFZE24tKRW2NpeaQ=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-61a32ba4-5a3e-48e7-b351-f229598e38d1-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>14EKY2XqnvJMQsYn6wZQs+PcX1ozOqZ18ryuj4HcrGs=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-61a32ba4-5a3e-48e7-b351-f229598e38d1-sigvalue">kgg1uSXwpk1DgulkWpkmGgdXO8eSbo/GMfqvi71DUJxkARhB8e2j+PaT3Nbn3Sii3zetypzzVl8KbGHGZcZyzWhc5VqP0Yc6ryKLa41bWCcDy+IOqYqZJUbM6yKJ9wzgHkI52xfH4WhR4PyCPiKdThe+Yc0+R2je6f9PHwCC97oHLEUEngdYJnlQNobO6f9A7isAJ9axdqkilCa2zAq9steBucDOEvPBvDPh+tkmIDk0DIhLvZXT8aA396ZrVQ1Y3C6S2kQDzg1jsBwjVeKLm0GzECaNiKeM9nWSOQIcl1q/Xr0GJ+VoTneG0u8OwONNkXvcgtDyxdHrRyHTZcBBTQ==</ds:SignatureValue><ds:KeyInfo Id="xmldsig-61a32ba4-5a3e-48e7-b351-f229598e38d1-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object Id="XadesObjectId-bfb37873-0301-43f6-a55d-12547d76d386"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-80b0280c-b356-463e-9914-6215627874e7" Target="#xmldsig-61a32ba4-5a3e-48e7-b351-f229598e38d1"><xades:SignedProperties Id="xmldsig-61a32ba4-5a3e-48e7-b351-f229598e38d1-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-11T14:11:00+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>LmW+b6zYzlt1dTxh5wpS1UM4hWX+qe5xvnFDBmics4E=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, 1.2.840.113549.1.9.1=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>5727508615750229015</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#xmldsig-afbc62c4-0ba2-4807-9ab1-c595d1aba8cb-ref0"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n  </ext:UBLExtensions>\r\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n  <cbc:CustomizationID>10</cbc:CustomizationID>\r\n  <cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID>\r\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n  <cbc:ID>FEME38737</cbc:ID>\r\n  <cbc:UUID schemeID="1" schemeName="CUFE-SHA384">e2dbe79a29ccf71a9929f32667579a2f2a3394ad01f7f36d609f9c7589ceecdfb4efaf11d42d7d1315be37778e883d86</cbc:UUID>\r\n  <cbc:IssueDate>2026-05-11</cbc:IssueDate>\r\n  <cbc:IssueTime>14:11:00-05:00</cbc:IssueTime>\r\n  <cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>\r\n  <cbc:Note>* NO SE ACEPTAN CAMBIOS NI DEVOLUCIONES PASADOS LOS 3 DÍAS.</cbc:Note>\r\n  <cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>\r\n  <cbc:LineCountNumeric>2</cbc:LineCountNumeric>\r\n  <cac:AccountingSupplierParty>\r\n    <cbc:AdditionalAccountID schemeAgencyID="195">1</cbc:AdditionalAccountID>\r\n    <cac:Party>\r\n      <cbc:IndustryClassificationCode>4761</cbc:IndustryClassificationCode>\r\n      <cac:PartyName>\r\n        <cbc:Name>ALHUM LIMITADA</cbc:Name>\r\n      </cac:PartyName>\r\n      <cac:PhysicalLocation>\r\n        <cac:Address>\r\n          <cbc:ID>68001</cbc:ID>\r\n          <cbc:CityName>Bucaramanga</cbc:CityName>\r\n          <cbc:PostalZone>000000</cbc:PostalZone>\r\n          <cbc:CountrySubentity>Santander</cbc:CountrySubentity>\r\n          <cbc:CountrySubentityCode>68</cbc:CountrySubentityCode>\r\n          <cac:AddressLine>\r\n            <cbc:Line>CRA 27 10 26 P1</cbc:Line>\r\n          </cac:AddressLine>\r\n          <cac:Country>\r\n            <cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n            <cbc:Name languageID="es">Colombia</cbc:Name>\r\n          </cac:Country>\r\n        </cac:Address>\r\n      </cac:PhysicalLocation>\r\n      <cac:PartyTaxScheme>\r\n        <cbc:RegistrationName>ALHUM LIMITADA</cbc:RegistrationName>\r\n        <cbc:CompanyID schemeID="8" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">804016305</cbc:CompanyID>\r\n        <cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n        <cac:RegistrationAddress>\r\n          <cbc:ID>68001</cbc:ID>\r\n          <cbc:CityName>Bucaramanga</cbc:CityName>\r\n          <cbc:PostalZone>000000</cbc:PostalZone>\r\n          <cbc:CountrySubentity>Santander</cbc:CountrySubentity>\r\n          <cbc:CountrySubentityCode>68</cbc:CountrySubentityCode>\r\n          <cac:AddressLine>\r\n            <cbc:Line>CRA 27 10 26 P1</cbc:Line>\r\n          </cac:AddressLine>\r\n          <cac:Country>\r\n            <cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n            <cbc:Name languageID="es">Colombia</cbc:Name>\r\n          </cac:Country>\r\n        </cac:RegistrationAddress>\r\n        <cac:TaxScheme>\r\n          <cbc:ID>01</cbc:ID>\r\n          <cbc:Name>IVA</cbc:Name>\r\n        </cac:TaxScheme>\r\n      </cac:PartyTaxScheme>\r\n      <cac:PartyLegalEntity>\r\n        <cbc:RegistrationName>ALHUM LIMITADA</cbc:RegistrationName>\r\n        <cbc:CompanyID schemeID="8" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">804016305</cbc:CompanyID>\r\n        <cac:CorporateRegistrationScheme>\r\n          <cbc:ID>FEME</cbc:ID>\r\n        </cac:CorporateRegistrationScheme>\r\n      </cac:PartyLegalEntity>\r\n      <cac:Contact>\r\n        <cbc:Name>ALHUM LIMITADA</cbc:Name>\r\n        <cbc:Telephone>607|3168345112|</cbc:Telephone>\r\n        <cbc:ElectronicMail>carteraricopiaslpms@hotmail.com</cbc:ElectronicMail>\r\n      </cac:Contact>\r\n    </cac:Party>\r\n  </cac:AccountingSupplierParty>\r\n  <cac:AccountingCustomerParty>\r\n    <cbc:AdditionalAccountID>2</cbc:AdditionalAccountID>\r\n    <cac:Party>\r\n      <cac:PartyIdentification>\r\n        <cbc:ID schemeID="1" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:ID>\r\n      </cac:PartyIdentification>\r\n      <cac:PartyName>\r\n        <cbc:Name></cbc:Name>\r\n      </cac:PartyName>\r\n      <cac:PhysicalLocation>\r\n        <cac:Address>\r\n          <cbc:ID>05001</cbc:ID>\r\n          <cbc:CityName>Medellín</cbc:CityName>\r\n          <cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n          <cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n          <cac:AddressLine>\r\n            <cbc:Line>CALLE 43A SUR 77 13</cbc:Line>\r\n          </cac:AddressLine>\r\n          <cac:Country>\r\n            <cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n            <cbc:Name languageID="es">Colombia</cbc:Name>\r\n          </cac:Country>\r\n        </cac:Address>\r\n      </cac:PhysicalLocation>\r\n      <cac:PartyTaxScheme>\r\n        <cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName>\r\n        <cbc:CompanyID schemeID="1" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n        <cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n        <cac:TaxScheme>\r\n          <cbc:ID>ZZ</cbc:ID>\r\n          <cbc:Name>No aplica</cbc:Name>\r\n        </cac:TaxScheme>\r\n      </cac:PartyTaxScheme>\r\n      <cac:PartyLegalEntity>\r\n        <cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName>\r\n        <cbc:CompanyID schemeID="1" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n      </cac:PartyLegalEntity>\r\n      <cac:Contact>\r\n        <cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name>\r\n        <cbc:Telephone>3134850115</cbc:Telephone>\r\n        <cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail>\r\n      </cac:Contact>\r\n    </cac:Party>\r\n  </cac:AccountingCustomerParty>\r\n  <cac:PaymentMeans>\r\n    <cbc:ID>1</cbc:ID>\r\n    <cbc:PaymentMeansCode>46</cbc:PaymentMeansCode>\r\n    <cbc:PaymentDueDate>2026-05-11</cbc:PaymentDueDate>\r\n  </cac:PaymentMeans>\r\n  <cac:TaxTotal>\r\n    <cbc:TaxAmount currencyID="COP">309428.57</cbc:TaxAmount>\r\n    <cbc:RoundingAmount currencyID="COP">0.0017</cbc:RoundingAmount>\r\n    <cac:TaxSubtotal>\r\n      <cbc:TaxableAmount currencyID="COP">1628571.43</cbc:TaxableAmount>\r\n      <cbc:TaxAmount currencyID="COP">309428.57</cbc:TaxAmount>\r\n      <cac:TaxCategory>\r\n        <cbc:Percent>19.00</cbc:Percent>\r\n        <cac:TaxScheme>\r\n          <cbc:ID>01</cbc:ID>\r\n          <cbc:Name>IVA</cbc:Name>\r\n        </cac:TaxScheme>\r\n      </cac:TaxCategory>\r\n    </cac:TaxSubtotal>\r\n  </cac:TaxTotal>\r\n  <cac:LegalMonetaryTotal>\r\n    <cbc:LineExtensionAmount currencyID="COP">1628571.43</cbc:LineExtensionAmount>\r\n    <cbc:TaxExclusiveAmount currencyID="COP">1628571.43</cbc:TaxExclusiveAmount>\r\n    <cbc:TaxInclusiveAmount currencyID="COP">1938000.00</cbc:TaxInclusiveAmount>\r\n    <cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount>\r\n    <cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount>\r\n    <cbc:PayableAmount currencyID="COP">1938000.00</cbc:PayableAmount>\r\n  </cac:LegalMonetaryTotal>\r\n  <cac:InvoiceLine>\r\n    <cbc:ID>1</cbc:ID>\r\n    <cbc:InvoicedQuantity unitCode="94">1</cbc:InvoicedQuantity>\r\n    <cbc:LineExtensionAmount currencyID="COP">1502521.01</cbc:LineExtensionAmount>\r\n    <cac:TaxTotal>\r\n      <cbc:TaxAmount currencyID="COP">285478.99</cbc:TaxAmount>\r\n      <cbc:RoundingAmount currencyID="COP">0.0019</cbc:RoundingAmount>\r\n      <cac:TaxSubtotal>\r\n        <cbc:TaxableAmount currencyID="COP">1502521.01</cbc:TaxableAmount>\r\n        <cbc:TaxAmount currencyID="COP">285478.99</cbc:TaxAmount>\r\n        <cac:TaxCategory>\r\n          <cbc:Percent>19.00</cbc:Percent>\r\n          <cac:TaxScheme>\r\n            <cbc:ID>01</cbc:ID>\r\n            <cbc:Name>IVA</cbc:Name>\r\n          </cac:TaxScheme>\r\n        </cac:TaxCategory>\r\n      </cac:TaxSubtotal>\r\n    </cac:TaxTotal>\r\n    <cac:Item>\r\n      <cbc:Description>Maquina RICOH M320F MULTIFUNCIONAL A4 ARDF 34 ppm Blanco y Negro.Incluye Toner de Inicio</cbc:Description>\r\n      <cbc:ModelName></cbc:ModelName>\r\n      <cac:StandardItemIdentification>\r\n        <cbc:ID schemeID="999">5855Z510818</cbc:ID>\r\n      </cac:StandardItemIdentification>\r\n    </cac:Item>\r\n    <cac:Price>\r\n      <cbc:PriceAmount currencyID="COP">1502521.0084</cbc:PriceAmount>\r\n      <cbc:BaseQuantity unitCode="94">1</cbc:BaseQuantity>\r\n    </cac:Price>\r\n  </cac:InvoiceLine>\r\n  <cac:InvoiceLine>\r\n    <cbc:ID>2</cbc:ID>\r\n    <cbc:InvoicedQuantity unitCode="94">2</cbc:InvoicedQuantity>\r\n    <cbc:LineExtensionAmount currencyID="COP">126050.42</cbc:LineExtensionAmount>\r\n    <cac:TaxTotal>\r\n      <cbc:TaxAmount currencyID="COP">23949.58</cbc:TaxAmount>\r\n      <cbc:RoundingAmount currencyID="COP">-0.0002</cbc:RoundingAmount>\r\n      <cac:TaxSubtotal>\r\n        <cbc:TaxableAmount currencyID="COP">126050.42</cbc:TaxableAmount>\r\n        <cbc:TaxAmount currencyID="COP">23949.58</cbc:TaxAmount>\r\n        <cac:TaxCategory>\r\n          <cbc:Percent>19.00</cbc:Percent>\r\n          <cac:TaxScheme>\r\n            <cbc:ID>01</cbc:ID>\r\n            <cbc:Name>IVA</cbc:Name>\r\n          </cac:TaxScheme>\r\n        </cac:TaxCategory>\r\n      </cac:TaxSubtotal>\r\n    </cac:TaxTotal>\r\n    <cac:Item>\r\n      <cbc:Description>Toner Ricoh SP 3710DN/SP3710SF  TYPE SP 3710X KATUN</cbc:Description>\r\n      <cbc:BrandName></cbc:BrandName>\r\n      <cbc:ModelName></cbc:ModelName>\r\n      <cac:StandardItemIdentification>\r\n        <cbc:ID schemeID="999">51346S</cbc:ID>\r\n      </cac:StandardItemIdentification>\r\n    </cac:Item>\r\n    <cac:Price>\r\n      <cbc:PriceAmount currencyID="COP">63025.2101</cbc:PriceAmount>\r\n      <cbc:BaseQuantity unitCode="94">2</cbc:BaseQuantity>\r\n    </cac:Price>\r\n  </cac:InvoiceLine>\r\n</Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>FEME38737</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">e2dbe79a29ccf71a9929f32667579a2f2a3394ad01f7f36d609f9c7589ceecdfb4efaf11d42d7d1315be37778e883d86</cbc:UUID><cbc:IssueDate>2026-05-11</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\r\n  <ext:UBLExtensions>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent>\r\n        <sts:DianExtensions>\r\n          <sts:InvoiceSource>\r\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n          </sts:InvoiceSource>\r\n          <sts:SoftwareProvider>\r\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\r\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\r\n          </sts:SoftwareProvider>\r\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\r\n          <sts:AuthorizationProvider>\r\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\r\n          </sts:AuthorizationProvider>\r\n        </sts:DianExtensions>\r\n      </ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-5cf16a36-0b4d-4410-9922-5414069e8621"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-fa13000c-97df-4f1b-a290-7881e1eb2dcd" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>IRjt1bEkfi7xgOZ7FqRSnSBfAJ4ziv+FC8Kid5KRZwc=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-5cf16a36-0b4d-4410-9922-5414069e8621-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>tT6Ze0KSOpZCvjAtxIPFMikTV4JTsRYTl/3q5NGE+2Q=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-5cf16a36-0b4d-4410-9922-5414069e8621-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>MXsfG3a82w4ZzEQe+udaQykHBjKINTCm3ChN8zEU96w=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-5cf16a36-0b4d-4410-9922-5414069e8621">RqVpRrSGkECTyLbQgy65VCm2LDgBhVPD7Xf63lxYvt4SeHhiuI7mnzNhEPGgpB/0A6COv1cNyUOWrU0S9/Ld57x3n+cckAC98GZOICzYUfWs+cYRbVIE2K8UHilBdMBeEjbrwehPI7FouSvedp8CAixYtz//9FOt6hXvce17PgrACTGQ8jKyJzR8x1qAmMJWh3bqwhIEgxM45KZCjzu1Bd1b1mUug0KICwg0AechM889S/ckFLRDPwurtD1ta5HAXI1SRZ0eYRNnlVqEIHF8r9qy7/2GqawUlwStYaQLon6gQpvi37puxH+mA6iYuLcu0axt1/2t80Sg5wTXnQNngg==</ds:SignatureValue><ds:KeyInfo Id="Signature-5cf16a36-0b4d-4410-9922-5414069e8621-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-3e09130f-e4b9-4ad1-9d04-aea184ecc313"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-7bb98fee-a19b-46aa-88b0-205b8165651a" Target="#Signature-5cf16a36-0b4d-4410-9922-5414069e8621"><xades:SignedProperties Id="xmldsig-Signature-5cf16a36-0b4d-4410-9922-5414069e8621-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-11T14:11:32+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-fa13000c-97df-4f1b-a290-7881e1eb2dcd"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n  </ext:UBLExtensions>\r\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n  <cbc:CustomizationID>1</cbc:CustomizationID>\r\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\r\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n  <cbc:ID>28862245</cbc:ID>\r\n  <cbc:UUID schemeName="CUDE-SHA384">b09f804b878d29b198a8540b744929457c88ead676177f9432a6b8cd29c7ca1d88d1974c3e6d52c51db079044e1da0a1</cbc:UUID>\r\n  <cbc:IssueDate>2026-05-11</cbc:IssueDate>\r\n  <cbc:IssueTime>14:11:32-05:00</cbc:IssueTime>\r\n  <cac:SenderParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:SenderParty>\r\n  <cac:ReceiverParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>ALHUM LIMITADA</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="8" schemeName="31">804016305</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:ReceiverParty>\r\n  <cac:DocumentResponse>\r\n    <cac:Response>\r\n      <cbc:ResponseCode>02</cbc:ResponseCode>\r\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\r\n    </cac:Response>\r\n    <cac:DocumentReference>\r\n      <cbc:ID>FEME38737</cbc:ID>\r\n      <cbc:UUID schemeName="CUFE-SHA384">e2dbe79a29ccf71a9929f32667579a2f2a3394ad01f7f36d609f9c7589ceecdfb4efaf11d42d7d1315be37778e883d86</cbc:UUID>\r\n    </cac:DocumentReference>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>1</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\r\n        <cbc:Description>0</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>2</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>3</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n  </cac:DocumentResponse>\r\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>002</cbc:ValidationResultCode><cbc:ValidationDate>2026-05-11</cbc:ValidationDate><cbc:ValidationTime>14:11:33</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-03 02:10:09.989427
6	10	xml_invoice	Claro - mayo.xml	\N	<?xml version="1.0" encoding="utf-8"?><AttachedDocument xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="xmldsig-4e9035d4-94d8-4611-8679-71b03bd07dfd" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-4e9035d4-94d8-4611-8679-71b03bd07dfd-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>NVySkMylADcBtLFniwu7RMN3Oly6iSx9zvWhPhrdVqI=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-4e9035d4-94d8-4611-8679-71b03bd07dfd-ref1" URI="#KeyInfo"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>V5OjMdINAS3t9ym2Pceb/nZlIoRk7yT3TKDkw2PF/Ic=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-4e9035d4-94d8-4611-8679-71b03bd07dfd-ref2" URI="#SignedPropertiesId" Type="http://uri.etsi.org/01903#SignedProperties"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>qtQiLE8M0qZtMh+OhcPnNADhoYRUEq+pSR6NpjN6G9M=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>C6Yv5S5Eg9hkUXQAEp7xTmqYGdLc2paNUON+J3jM69EMpuhZ59QqPlDJaB8/Tz83KrIXP06epUbf5Z7rjjXh5edbWlHrdq70mWhZ/6rA0Yy6zj99zipirFtqoJiQLGPWyCToDUhzu7GHK4UZR07hM+4A9/6svARcxhng9+BzGCQY/S8I1Vrvry69HKq6/EfvXflxadQj+hFsnpRQqIqHVnPYVgFdudr9g/PDFLfmaAhLRCJhh4H8NcCDwOtPtoGKb18Y5Hunv8KYdzFAYfBm5f3mxdo16yPi83c+aJBf7XCzqRX435F1DymiAB1n/80feJEbgl9NPRhYm/1OqPf3Qw==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509Certificate>MIIJSzCCBzOgAwIBAgIQUYuSvbKZRcZpXrfSPj4Y4TANBgkqhkiG9w0BAQsFADCBrTEcMBoGA1UECQwTd3d3LmNlcnRpY2FtYXJhLmNvbTEPMA0GA1UEBwwGQk9HT1RBMRkwFwYDVQQIDBBESVNUUklUTyBDQVBJVEFMMQswCQYDVQQGEwJDTzEYMBYGA1UECwwPTklUIDgzMDA4NDQzMy03MRgwFgYDVQQKDA9DRVJUSUNBTUFSQSBTLkExIDAeBgNVBAMMF0FDIFNVQiA0MDk2IENFUlRJQ0FNQVJBMCAXDTI2MDEwNzE5NDUyMloYDzIwMjgwMTA3MTk0NTIxWjCCAT4xFDASBgNVBAQMC1RBTVVSQSBNQVpPMRkwFwYDVQQJDBBBViAzIEEgTiAyNiBOIDgzMQ4wDAYDVQQIDAVWQUxMRTEcMBoGA1UECwwTRkFDVFVSQSBFTEVDVFJPTklDQTEQMA4GA1UEBRMHMjM2NzcxNjEaMBgGCisGAQQBgbVjAgMTCjg5MDMxOTE5MzMxGDAWBgorBgEEAYG1YwICEwgyOTExNjg1ODEzMDEGA1UECgwqU0lTVEVNQVMgREUgSU5GT1JNQUNJT04gRU1QUkVTQVJJQUwgUy5BLlMuMQ0wCwYDVQQHDARDQUxJMQ8wDQYDVQQqDAZTQVlVUkkxCzAJBgNVBAYTAkNPMTMwMQYDVQQDDCpTSVNURU1BUyBERSBJTkZPUk1BQ0lPTiBFTVBSRVNBUklBTCBTLkEuUy4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCPLoAkqJiUiJhZxO+gy6wSdqmCUcuw4yDi3Gong9TuGC1Qw1sqyjq94yPQTsiKDp865KEehvgG2lZv4RO8eHnPLq7+6smRTS+vjoewIO4YhqZakoZWlZtTIwNgBQ1cteJ7jt/isEwq6BDPqrXQq0dVMhL7+m2V5ypdpZTU9bJmTDSEolA9MDhvRVIvfb9wam/pWfXOLnygkfJRKAwx42j8x5NM1oh0TinAw7YSyF72o17nPugFfDtj7neeOQBazCyvRZF5c2lUzrMkUuGwCuRBP/HnqSbmb/F/heqxGOxvSUxU/NU+TdM1F0j/UViOG8zoqqMNvED+Rsvp/2LlEoDFAgMKALGjggPPMIIDyzA6BggrBgEFBQcBAQQuMCwwKgYIKwYBBQUHMAGGHmh0dHA6Ly9vY3NwNDA5Ni5jZXJ0aWNhbWFyYS5jbzAgBgNVHREEGTAXgRVKVUFOLkFSQU5HT0BTSUVTQS5DT00wggENBgNVHSAEggEEMIIBADCBmgYMKwYBBAGBtWMyAQgEMIGJMCsGCCsGAQUFBwIBFh9odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9kcGMvMFoGCCsGAQUFBwICME4aTExpbWl0YWNpb25lcyBkZSBnYXJhbnTtYXMgZGUgZXN0ZSBjZXJ0aWZpY2FkbyBzZSBwdWVkZW4gZW5jb250cmFyIGVuIGxhIERQQy4wYQYLKwYBBAGBtWMKCgEwUjBQBggrBgEFBQcCAjBEGkJEaXNwb3NpdGl2byBkZSBoYXJkd2FyZSAoVG9rZW4pIEPzZGlnbyBkZSBhY3JlZGl0YWNp8246IDE2LUVDRC0wMDIwDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCA/gwJwYDVR0lBCAwHgYIKwYBBQUHAwEGCCsGAQUFBwMCBggrBgEFBQcDBDAdBgNVHQ4EFgQUe/vcUTmXmIF2xsYKXMac/4QtVfUwHwYDVR0jBBgwFoAUZhmj9ZswsAxOTRmZYEIJ0loxSocwggHRBgNVHR8EggHIMIIBxDCB9aCB8qCB74Z0aHR0cDovL3d3dy5jZXJ0aWNhbWFyYS5jb20vcmVwb3NpdG9yaW9yZXZvY2FjaW9uZXMvYWNfc3Vib3JkaW5hZGFfY2VydGljYW1hcmFfY29uX2V4dGVuc2lvbl9jcml0aWNhXzQwOTYuY3JsP2NybD1jcmyGd2h0dHA6Ly9taXJyb3IuY2VydGljYW1hcmEuY29tL3JlcG9zaXRvcmlvcmV2b2NhY2lvbmVzL2FjX3N1Ym9yZGluYWRhX2NlcnRpY2FtYXJhX2Nvbl9leHRlbnNpb25fY3JpdGljYV80MDk2LmNybD9jcmw9Y3JsMIHJoIHGoIHDhl5odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JshmFodHRwOi8vbWlycm9yLmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JsMA0GCSqGSIb3DQEBCwUAA4ICAQBxabJlMOQcT+hAmqHk+MAUIHCg2e5IfSORvl9Q+BDIptVMiv2TXCfFPlGO251Up6ODWmSCJF+YlxpFBJB7gSyiBYlV7OzdBMQp6E8lQQoAt8EOS2Ds9vXn/nNUrGXQxF5nxSTmSuEIqKQ620ESJKSEJa7XxLMpaCKnY2lF8nYZRnigRNACZDq4+yR6CTYN6abuaq+qu6FogxiJ5WMXsnpMRlUtRu5AZjYHMhBpJfgEiUAe2ziYJ4Aj6lsa5vZBeE/5eSled5AjQAVPcTL3mm0xIfEL4Ytp/+VHiJBMFDjqMfvKausU0THzKrsL3bGm0kgVl4CQ81DdKZW1g9xBWN93G6TgChIgg8iCINzbbqp+2o55rFGLrd9PDoZgWo82jA4ZhRVPhBnCdkiwWC0MOUA3bOk5fa4V+4onQS0lGlIh9Ign4BYa+0wYJLzmWazD+gqz0ggfv7IHqoR4xJ26I9q77fzPXyvtgMfEUbIYCv0EVUmQ9sF9dwD5GLp+7pStKflJX8AWLqBrfGC6n4t8aXGi6vwFP55cMUtShDD3Cq7sc2TCFcr7OpWi85d+zAI3YS3laB0ulW9kOp0+Rr3yN+l/xb1oYOJqzzw2NNzjogcKta6InhxAEMAzgrNMoS1z26vmD51482GlfbSzQrWw79g7ygwgBVC9w2ZYdyMcLne5XQ==</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#xmldsig-4e9035d4-94d8-4611-8679-71b03bd07dfd" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="SignedPropertiesId"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-14T20:36:56.334+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>laQVFI63iHk/FpfiG9sT7TFH2GtX8PJy7RSbsACv3ic=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=AC SUB 4096 CERTICAMARA, O=CERTICAMARA S.A, OU=NIT 830084433-7, C=CO, S=DISTRITO CAPITAL, L=BOGOTA, STREET=www.certicamara.com</ds:X509IssuerName><ds:X509SerialNumber>108392173183113001987351625583124420833</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>E6059562405</cbc:ID><cbc:IssueDate>2026-05-14</cbc:IssueDate><cbc:IssueTime>20:36:56+00:00</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>E6059562405</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName><cbc:CompanyID schemeID="7" schemeName="31" schemeAgencyID="195">800153993</cbc:CompanyID><cbc:TaxLevelCode listName="48">O-13;O-15</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeName="13" schemeAgencyID="195">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="48">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8"?><Invoice xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><sts:DianExtensions><sts:InvoiceControl><sts:InvoiceAuthorization>18764105889351</sts:InvoiceAuthorization><sts:AuthorizationPeriod><cbc:StartDate>2026-02-13</cbc:StartDate><cbc:EndDate>2028-02-13</cbc:EndDate></sts:AuthorizationPeriod><sts:AuthorizedInvoices><sts:Prefix>E</sts:Prefix><sts:From>6028523001</sts:From><sts:To>6078523000</sts:To></sts:AuthorizedInvoices></sts:InvoiceControl><sts:InvoiceSource><cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode></sts:InvoiceSource><sts:SoftwareProvider><sts:ProviderID schemeID="3" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">890319193</sts:ProviderID><sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">363dbee8-27ce-4c85-b588-85d3c4611026</sts:SoftwareID></sts:SoftwareProvider><sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">8d3a094fe788c5dbc96db3b4b43842a355bf0fb4aacb16e311f79f389dc0ffd67d055c72f1f4412a9dbc955d7170b125</sts:SoftwareSecurityCode><sts:AuthorizationProvider><sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID></sts:AuthorizationProvider><sts:QRCode>https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=c5ce438ed321fc6ca30987b9f8beef220348bd9544083613315dc75306b0f487f63a3dad5bb71a40bb115ee907897fb1</sts:QRCode></sts:DianExtensions></ext:ExtensionContent></ext:UBLExtension><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="xmldsig-d454c1ec-2628-4974-ba9d-6e60261e9943" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-d454c1ec-2628-4974-ba9d-6e60261e9943-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>8mRHHAqSHwVTq+yAZqLfeEDdlHTey4oojXZKXC6KcJo=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-d454c1ec-2628-4974-ba9d-6e60261e9943-ref1" URI="#KeyInfo"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>V5OjMdINAS3t9ym2Pceb/nZlIoRk7yT3TKDkw2PF/Ic=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-d454c1ec-2628-4974-ba9d-6e60261e9943-ref2" URI="#SignedPropertiesId" Type="http://uri.etsi.org/01903#SignedProperties"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>kI+SMJD+b04pCgJaXS9yx+Fl/HNprNrKQqV0j3Zs+fg=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>ATQ/4Z6ir1z9eYwT0+Ju4f5BtQ33J7fjMT8mbi96lzedkZlq/bjGFegI8/Kgs7CheXVaEdEGCBxs1Cxp7TsNFm0+BQqsgDk2+c0O8gTgnphOUm+KQc5/okd2PWpTuj6LhqMuKHkLOxeojbT+0bJYdunncawWzvGJTwXe5SjKMooHx4VsExA9nMsnkvLJmKkjiBVdljbSutBpKzUCZ1KkoSyJcX66h1lDlQ2wSqG8ULgeq2CoXJqokvwDsVBFCGNtjTYcx68BCXdCpTKVZr7Hy4NhFLNM/RYW2wauy3tqkILe7sDnoKSPnbSJKhioVCAbL4QAsrEuby4OZH2uLigShQ==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509Certificate>MIIJSzCCBzOgAwIBAgIQUYuSvbKZRcZpXrfSPj4Y4TANBgkqhkiG9w0BAQsFADCBrTEcMBoGA1UECQwTd3d3LmNlcnRpY2FtYXJhLmNvbTEPMA0GA1UEBwwGQk9HT1RBMRkwFwYDVQQIDBBESVNUUklUTyBDQVBJVEFMMQswCQYDVQQGEwJDTzEYMBYGA1UECwwPTklUIDgzMDA4NDQzMy03MRgwFgYDVQQKDA9DRVJUSUNBTUFSQSBTLkExIDAeBgNVBAMMF0FDIFNVQiA0MDk2IENFUlRJQ0FNQVJBMCAXDTI2MDEwNzE5NDUyMloYDzIwMjgwMTA3MTk0NTIxWjCCAT4xFDASBgNVBAQMC1RBTVVSQSBNQVpPMRkwFwYDVQQJDBBBViAzIEEgTiAyNiBOIDgzMQ4wDAYDVQQIDAVWQUxMRTEcMBoGA1UECwwTRkFDVFVSQSBFTEVDVFJPTklDQTEQMA4GA1UEBRMHMjM2NzcxNjEaMBgGCisGAQQBgbVjAgMTCjg5MDMxOTE5MzMxGDAWBgorBgEEAYG1YwICEwgyOTExNjg1ODEzMDEGA1UECgwqU0lTVEVNQVMgREUgSU5GT1JNQUNJT04gRU1QUkVTQVJJQUwgUy5BLlMuMQ0wCwYDVQQHDARDQUxJMQ8wDQYDVQQqDAZTQVlVUkkxCzAJBgNVBAYTAkNPMTMwMQYDVQQDDCpTSVNURU1BUyBERSBJTkZPUk1BQ0lPTiBFTVBSRVNBUklBTCBTLkEuUy4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCPLoAkqJiUiJhZxO+gy6wSdqmCUcuw4yDi3Gong9TuGC1Qw1sqyjq94yPQTsiKDp865KEehvgG2lZv4RO8eHnPLq7+6smRTS+vjoewIO4YhqZakoZWlZtTIwNgBQ1cteJ7jt/isEwq6BDPqrXQq0dVMhL7+m2V5ypdpZTU9bJmTDSEolA9MDhvRVIvfb9wam/pWfXOLnygkfJRKAwx42j8x5NM1oh0TinAw7YSyF72o17nPugFfDtj7neeOQBazCyvRZF5c2lUzrMkUuGwCuRBP/HnqSbmb/F/heqxGOxvSUxU/NU+TdM1F0j/UViOG8zoqqMNvED+Rsvp/2LlEoDFAgMKALGjggPPMIIDyzA6BggrBgEFBQcBAQQuMCwwKgYIKwYBBQUHMAGGHmh0dHA6Ly9vY3NwNDA5Ni5jZXJ0aWNhbWFyYS5jbzAgBgNVHREEGTAXgRVKVUFOLkFSQU5HT0BTSUVTQS5DT00wggENBgNVHSAEggEEMIIBADCBmgYMKwYBBAGBtWMyAQgEMIGJMCsGCCsGAQUFBwIBFh9odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9kcGMvMFoGCCsGAQUFBwICME4aTExpbWl0YWNpb25lcyBkZSBnYXJhbnTtYXMgZGUgZXN0ZSBjZXJ0aWZpY2FkbyBzZSBwdWVkZW4gZW5jb250cmFyIGVuIGxhIERQQy4wYQYLKwYBBAGBtWMKCgEwUjBQBggrBgEFBQcCAjBEGkJEaXNwb3NpdGl2byBkZSBoYXJkd2FyZSAoVG9rZW4pIEPzZGlnbyBkZSBhY3JlZGl0YWNp8246IDE2LUVDRC0wMDIwDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCA/gwJwYDVR0lBCAwHgYIKwYBBQUHAwEGCCsGAQUFBwMCBggrBgEFBQcDBDAdBgNVHQ4EFgQUe/vcUTmXmIF2xsYKXMac/4QtVfUwHwYDVR0jBBgwFoAUZhmj9ZswsAxOTRmZYEIJ0loxSocwggHRBgNVHR8EggHIMIIBxDCB9aCB8qCB74Z0aHR0cDovL3d3dy5jZXJ0aWNhbWFyYS5jb20vcmVwb3NpdG9yaW9yZXZvY2FjaW9uZXMvYWNfc3Vib3JkaW5hZGFfY2VydGljYW1hcmFfY29uX2V4dGVuc2lvbl9jcml0aWNhXzQwOTYuY3JsP2NybD1jcmyGd2h0dHA6Ly9taXJyb3IuY2VydGljYW1hcmEuY29tL3JlcG9zaXRvcmlvcmV2b2NhY2lvbmVzL2FjX3N1Ym9yZGluYWRhX2NlcnRpY2FtYXJhX2Nvbl9leHRlbnNpb25fY3JpdGljYV80MDk2LmNybD9jcmw9Y3JsMIHJoIHGoIHDhl5odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JshmFodHRwOi8vbWlycm9yLmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JsMA0GCSqGSIb3DQEBCwUAA4ICAQBxabJlMOQcT+hAmqHk+MAUIHCg2e5IfSORvl9Q+BDIptVMiv2TXCfFPlGO251Up6ODWmSCJF+YlxpFBJB7gSyiBYlV7OzdBMQp6E8lQQoAt8EOS2Ds9vXn/nNUrGXQxF5nxSTmSuEIqKQ620ESJKSEJa7XxLMpaCKnY2lF8nYZRnigRNACZDq4+yR6CTYN6abuaq+qu6FogxiJ5WMXsnpMRlUtRu5AZjYHMhBpJfgEiUAe2ziYJ4Aj6lsa5vZBeE/5eSled5AjQAVPcTL3mm0xIfEL4Ytp/+VHiJBMFDjqMfvKausU0THzKrsL3bGm0kgVl4CQ81DdKZW1g9xBWN93G6TgChIgg8iCINzbbqp+2o55rFGLrd9PDoZgWo82jA4ZhRVPhBnCdkiwWC0MOUA3bOk5fa4V+4onQS0lGlIh9Ign4BYa+0wYJLzmWazD+gqz0ggfv7IHqoR4xJ26I9q77fzPXyvtgMfEUbIYCv0EVUmQ9sF9dwD5GLp+7pStKflJX8AWLqBrfGC6n4t8aXGi6vwFP55cMUtShDD3Cq7sc2TCFcr7OpWi85d+zAI3YS3laB0ulW9kOp0+Rr3yN+l/xb1oYOJqzzw2NNzjogcKta6InhxAEMAzgrNMoS1z26vmD51482GlfbSzQrWw79g7ygwgBVC9w2ZYdyMcLne5XQ==</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#xmldsig-d454c1ec-2628-4974-ba9d-6e60261e9943" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="SignedPropertiesId"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-14T05:04:00.010-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>laQVFI63iHk/FpfiG9sT7TFH2GtX8PJy7RSbsACv3ic=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=AC SUB 4096 CERTICAMARA, O=CERTICAMARA S.A, OU=NIT 830084433-7, C=CO, S=DISTRITO CAPITAL, L=BOGOTA, STREET=www.certicamara.com</ds:X509IssuerName><ds:X509SerialNumber>108392173183113001987351625583124420833</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>10</cbc:CustomizationID><cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>E6059562405</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">c5ce438ed321fc6ca30987b9f8beef220348bd9544083613315dc75306b0f487f63a3dad5bb71a40bb115ee907897fb1</cbc:UUID><cbc:IssueDate>2026-05-14</cbc:IssueDate><cbc:IssueTime>05:04:00-05:00</cbc:IssueTime><cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode><cbc:Note>Total Intereses: $0.00</cbc:Note><cbc:Note>Total Descuentos: $0.00</cbc:Note><cbc:Note>Total impuestos: $9686.08</cbc:Note><cbc:Note>Deuda anterior: $0.69</cbc:Note><cbc:Note>Total a pagar: $60134.41</cbc:Note><cbc:Note>Total Retefuente: $0.00</cbc:Note><cbc:Note>TAX|01|false|0.19|50448.32|9585.18||</cbc:Note><cbc:Note>TAX|04|false|0.04|2522.50|100.90||</cbc:Note><cbc:Note>1115-Cargos Fijos:50448.33,Impuestos CargosFijos:9686.08</cbc:Note><cbc:Note>1115-Consumos:0.00,Impuestos Consumos:0.00</cbc:Note><cbc:Note>1115-OtrosConceptos:0.00,Impuestos Otros Conceptos:0.00</cbc:Note><cbc:Note>1115-EquiposaCredito:0.00,Impuestos Equipos a Credito:0.00</cbc:Note><cbc:Note>1115-Servicios Adicionales:0.00,Impuestos Servicios Adicionales:0.00</cbc:Note><cbc:Note>1115-EquipoFinanciados:0.00,Impuestos Equipos Financiados:0.00</cbc:Note><cbc:Note>iva:9585.18,consumo:100.90</cbc:Note><cbc:Note>Custcode:1.16581514</cbc:Note><cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>1</cbc:LineCountNumeric><cac:AccountingSupplierParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cac:PartyName><cbc:Name>COMUNICACION CELULAR S A  COMCEL S A</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>11001</cbc:ID><cbc:CityName> BOGOTÁ</cbc:CityName><cbc:PostalZone>110931</cbc:PostalZone><cbc:CountrySubentity>Bogotá, D.C.</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line> CR 68 A 24 B 10 Sede Administrativa Bogotá</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">COLOMBIA</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName><cbc:CompanyID schemeID="7" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800153993</cbc:CompanyID><cbc:TaxLevelCode listName="48">O-13;O-15</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>11001</cbc:ID><cbc:CityName> BOGOTÁ</cbc:CityName><cbc:PostalZone>110931</cbc:PostalZone><cbc:CountrySubentity>Bogotá, D.C.</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line> CR 68 A 24 B 10 Sede Administrativa Bogotá</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">COLOMBIA</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName><cbc:CompanyID schemeID="7" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800153993</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>E</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>comcel_fe@claro.com.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cbc:AdditionalAccountID>2</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID schemeName="13">71271339</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05360</cbc:ID><cbc:CityName /><cbc:PostalZone>05360</cbc:PostalZone><cbc:CountrySubentity /><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CLL 42 A N 55A-28 SANTA MARIA LA</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="48">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:PaymentMeans><cbc:ID>2</cbc:ID><cbc:PaymentMeansCode>1</cbc:PaymentMeansCode><cbc:PaymentDueDate>2026-05-25</cbc:PaymentDueDate></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0008</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">50448.32</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:TaxTotal><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0000</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">2522.50</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>4.00</cbc:Percent><cac:TaxScheme><cbc:ID>04</cbc:ID><cbc:Name>INC</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">50448.33</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="COP">50448.32</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="COP">60134.41</cbc:TaxInclusiveAmount><cbc:PayableRoundingAmount currencyID="COP">0</cbc:PayableRoundingAmount><cbc:PayableAmount currencyID="COP">60134.41</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>01</cbc:ID><cbc:Note>CFM_M|CFM_M</cbc:Note><cbc:InvoicedQuantity unitCode="94">1.00</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="COP">50448.33</cbc:LineExtensionAmount><cac:TaxTotal><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0008</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">50448.32</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:TaxTotal><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0000</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">2522.50</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>4.00</cbc:Percent><cac:TaxScheme><cbc:ID>04</cbc:ID><cbc:Name>INC</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Cargos Fijos</cbc:Description></cac:Item><cac:Price><cbc:PriceAmount currencyID="COP">50448.33</cbc:PriceAmount><cbc:BaseQuantity unitCode="94">1.0</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>E6059562405</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">c5ce438ed321fc6ca30987b9f8beef220348bd9544083613315dc75306b0f487f63a3dad5bb71a40bb115ee907897fb1</cbc:UUID><cbc:IssueDate>2026-05-14</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\r\n  <ext:UBLExtensions>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent>\r\n        <sts:DianExtensions>\r\n          <sts:InvoiceSource>\r\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n          </sts:InvoiceSource>\r\n          <sts:SoftwareProvider>\r\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\r\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\r\n          </sts:SoftwareProvider>\r\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\r\n          <sts:AuthorizationProvider>\r\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\r\n          </sts:AuthorizationProvider>\r\n        </sts:DianExtensions>\r\n      </ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-1ecd93a2-4061-445c-8d55-d0ef2e62ebf9"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-e3aaea84-0fe7-4e5e-b9f7-e869f3ee94f5" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>hGA8CvjtV0fdbPcA2MkBYkw5qaAMS+mJAKBkYaSlIzM=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-1ecd93a2-4061-445c-8d55-d0ef2e62ebf9-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>e7NnrQc4rrRITxBK24Bzoi8A15DQYK+pjhSq8/gYnQ8=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-1ecd93a2-4061-445c-8d55-d0ef2e62ebf9-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>r4HtpP255taelfQxDYxrcc14ilhKAUZe/drVwEdu2sQ=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-1ecd93a2-4061-445c-8d55-d0ef2e62ebf9">RFhhk4/1z4RiDAJEHQ51l0Sa/y297vGLfysBLG4PZZDlgM0UD7cjZbJUPZeJsHKI5+q602Zix5eLqdJHO2WzGiN/plLH2+Ic2Utnj6W1o2bL032lZTHH6hqNylECoemAyGglRjg5gTyBcWLX/BM3PpE25tCICtuNuFReLzYBEoY6TouWctZF9tESM52LuAG1xuul9YgladsLaMLlcY4pRkpt510aXKkaUUV6Sd7naEspQngtuMXSzaHeHMPrRwav6h0So+raorbhluMpk1vkz1b7mKbtlKxaUpBZ3LY1qu2A/Tlosz3H6hKsgeaEq0CFdaUIHZc20MSe+Zfj7FsNVA==</ds:SignatureValue><ds:KeyInfo Id="Signature-1ecd93a2-4061-445c-8d55-d0ef2e62ebf9-KeyInfo"><ds:X509Data><ds:X509Certificate>MIIH/DCCBeSgAwIBAgIQQ0M3OTUxNDY0Ni0wMDAwMTANBgkqhkiG9w0BAQsFADCCASQxFDASBgNVBAUMCzkwMDAzMjc3NC00MRQwEgYDVQQtDAs5MDAwMzI3NzQtNDFDMEEGA1UECQw6U2VlIGN1cnJlbnQgYWRkcmVzcyBhdCBodHRwczovL21pY2VydGlmaWNhZG8ub2xpbXBpYWl0LmNvbTEVMBMGA1UEBwwMQm9nb3TDoSBELkMuMRUwEwYDVQQIDAxCb2dvdMOhIEQuQy4xCzAJBgNVBAYTAkNPMS4wLAYJKoZIhvcNAQkBDB9zZXJ2aWNpb2FsY2xpZW50ZUBvbGltcGlhaXQuY29tMRYwFAYDVQQLDA1PbGltcGlhSVQgRUNEMRIwEAYDVQQKDAlPbGltcGlhSVQxGjAYBgNVBAMMEU9saW1waWFJVCBFQ0QgU3ViMB4XDTI0MTIwMzE3NDA1MFoXDTI2MTIwMzE3Mzk1MFowggEYMQswCQYDVQQGEwJDTzEWMBQGA1UECAwNQk9HT1TDgSwgRC5DLjEWMBQGA1UEBwwNQk9HT1TDgS4gRC5DLjE7MDkGA1UEAwwyVS5BLkUuIERJUkVDQ0lPTiBERSBJTVBVRVNUT1MgWSBBRFVBTkFTIE5BQ0lPTkFMRVMxEjAQBgNVBGEMCTgwMDE5NzI2ODEaMBgGA1UECQwRQ1IgICA3ICAgNiBDICAgNTQxKTAnBgkqhkiG9w0BCQEWGmNoYXJsZXNiMDcyMDA5QGhvdG1haWwuY29tMRkwFwYDVQQMDBBQZXJzb25hIEp1cmlkaWNhMRIwEAYDVQQtDAk4MDAxOTcyNjgxEjAQBgNVBAUMCTgwMDE5NzI2ODCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJhwwdI9JIkxT4tZA+o3Cf2KcHJeJt0INIvrNSAfWrQZPPQ49KNEBzIUzagaVSyI6fuUs77OoJZ1QwF0M3mo2iyoMm9SpwGs+w7xenKDeItVbwUUhZ6CNnLPAYDncXFP2ji0E6w1IDC+NOQFyDC7kyKkkrauTlQ/wbz2VP+bA9XKOLOXr2UoTUb9MVS5CqUe/gAqqXW376yFXavJY2Ow6Pzplg0s9nbidyV3l60jKTydiEyP2nDhrI7PjFeT6NKe9TrEAgf2+DKZLe3eQl/FynsmcsEZJP/d4Vg3AWhpJ9F/Haq4GCUwXX7AR14wvmYzpg+cPrEc7KvunkVQCjXKQSUCAwEAAaOCAjAwggIsMB8GA1UdIwQYMBaAFO61uovEVbW3sfdz8yB58/6rZ6heMB0GA1UdDgQWBBSHXZyHjwrTg+bbEntw6dvmLkT+UjAJBgNVHRMEAjAAMA8GA1UdDwEB/wQFAwMA0AAwgYgGA1UdIASBgDB+MHwGCysGAQQBg41KAgECMG0wawYIKwYBBQUHAgEWX2h0dHBzOi8vbWljZXJ0aWZpY2Fkby5vbGltcGlhaXQuY29tL3JlY3Vyc29zL2FyY2hpdm9zL2RlY2xhcmFjaW9uZGVwcmFjdGljYXNkZWNlcnRpZmljYWNpb24ucGRmMCUGA1UdEQQeMByBGmNoYXJsZXNiMDcyMDA5QGhvdG1haWwuY29tMBUGA1UdEgQOMAyCCjIxLUVDRC0wMDEwPQYDVR0fBDYwNDAyoDCgLoYsaHR0cDovL2NybC5vbGltcGlhaXQuY29tL29saW1waWFpdGVjZHN1Yi5jcmwwgcUGCCsGAQUFBwEBBIG4MIG1MDcGCCsGAQUFBzABhitodHRwczovL29jc3BlY2Qub2xpbXBpYWl0LmNvbTo4MzcyL2FwaS9vY3NwMHoGCCsGAQUFBzAChm5odHRwczovL21pY2VydGlmaWNhZG8ub2xpbXBpYWl0LmNvbS9jb250ZW50L3JlY3Vyc29zL2hvbWUvaW5pY2lhbC9jZXJ0aWZpY2Fkb3MvU3Vib3JkaW5hZGEvb2xpbXBpYWl0ZWNkc3ViLmNydDANBgkqhkiG9w0BAQsFAAOCAgEAYxHJDI6MEohIP5Cy08jck4ko83KREMFZg/Ojnth/KEdyXLlz5huSu2zH1U2OGj0ENqOk1ZtrY/ctZZ+81tY0+oTN9Y29igKTyLCKaDaVRCbokuvoMo0ZuspawLng2TVgFfgbIFRJBmgZhVckoiH97jbScu3J/KMjFfhV/fXEjyS732z38dvY3gYOnZVVImO8hfGMBq62wlvlHcKHaU1ZRRFDyqZpYwpSqIyIxAOEufhIcGy/0ush3bsuVQDmvVENZHjcWsi9Yw/Gh6mfjHm0H1EbqCcApuI1vo2PpkL3zbVp9cb52upKRiXsMaBAkgNHDRE91DZW6Joj40scBdlgRpQs/DDi6JnqZqmr8F2yvloHFchKlCnVrq2DMgfvJ0c0wMwSiKtXuCZfKI/U+hyArRot+xUxDHkzLwQExkWlGWuu+tJ5ANTln+FadZJge4Z5HCSBpLrpEHvYw+/5lK7vhzNmOVNmYaxGeay/E1cR9PQG7xaiuk5S8fky9XDVrxTeUDA70wZxJimXPeNwa06K2tG7SLXuuZLgEs9ZfsbAPZZB7hwt/1ycdFgH0xgtzrnggPTv9wFRe1xEbWBnTWnJVTaZBOEHsPzYfLj3le/Kp/WNDNG0lGSqhhTlTLyasPNKH8EpaMDc6ahN49apm+BEEWve7dh5XE/NJMpOKYmlzfY=</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-31faaf20-26f2-46b9-81f2-650155e178fe"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-9bfc4a39-c599-4300-8c3a-aa819a42b852" Target="#Signature-1ecd93a2-4061-445c-8d55-d0ef2e62ebf9"><xades:SignedProperties Id="xmldsig-Signature-1ecd93a2-4061-445c-8d55-d0ef2e62ebf9-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-14T10:28:39+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-e3aaea84-0fe7-4e5e-b9f7-e869f3ee94f5"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n  </ext:UBLExtensions>\r\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n  <cbc:CustomizationID>1</cbc:CustomizationID>\r\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\r\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n  <cbc:ID>69444680</cbc:ID>\r\n  <cbc:UUID schemeName="CUDE-SHA384">107d1bf19ea2800a78ece9b6608478a160dd43133d63ba962e9d4073ee4be6380185faa3a93ff61bfb7685dd73b00fac</cbc:UUID>\r\n  <cbc:IssueDate>2026-05-14</cbc:IssueDate>\r\n  <cbc:IssueTime>10:28:39-05:00</cbc:IssueTime>\r\n  <cac:SenderParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:SenderParty>\r\n  <cac:ReceiverParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="7" schemeName="31">800153993</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:ReceiverParty>\r\n  <cac:DocumentResponse>\r\n    <cac:Response>\r\n      <cbc:ResponseCode>02</cbc:ResponseCode>\r\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\r\n    </cac:Response>\r\n    <cac:DocumentReference>\r\n      <cbc:ID>E6059562405</cbc:ID>\r\n      <cbc:UUID schemeName="CUFE-SHA384">c5ce438ed321fc6ca30987b9f8beef220348bd9544083613315dc75306b0f487f63a3dad5bb71a40bb115ee907897fb1</cbc:UUID>\r\n    </cac:DocumentReference>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>1</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\r\n        <cbc:Description>0</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>2</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>FAZ09</cbc:ResponseCode>\r\n        <cbc:Description>Debe existir el grupo de información de identificación del bien o servicio</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>3</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>4</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n  </cac:DocumentResponse>\r\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>002</cbc:ValidationResultCode><cbc:ValidationDate>2026-05-14</cbc:ValidationDate><cbc:ValidationTime>10:04:00+00:00</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-03 02:10:36.103673
7	11	xml_invoice	FEGL80631, Ledacom.xml	\N	<?xml version="1.0" encoding="UTF-8" standalone="no"?><AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts-cct="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2" xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDataTypes-2" xmlns:sac="urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2" xmlns:sbc="urn:oasis:names:specification:ubl:schema:xsd:SignatureBasicComponents-2" xmlns:udt="urn:oasis:names:specification:ubl:schema:xsd:UnqualifiedDataTypes-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-AttachedDocument-2.1.xsd">\n    <ext:UBLExtensions>\n        <ext:UBLExtension>\n            <ext:ExtensionContent><ds:Signature Id="xmldsig-4bbd088d-4b3c-4278-bf54-10ed0174a593">\n<ds:SignedInfo>\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>\n<ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>\n<ds:Reference Id="xmldsig-4bbd088d-4b3c-4278-bf54-10ed0174a593-ref0" URI="">\n<ds:Transforms>\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>\n</ds:Transforms>\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>Nn0+TvjeIVDkGvJoQEG8agur6oBErtcFBrCkO4bAPcQ=</ds:DigestValue>\n</ds:Reference>\n<ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-4bbd088d-4b3c-4278-bf54-10ed0174a593-signedprops">\n<ds:Transforms>\n<ds:Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>\n</ds:Transforms>\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>4Wy0Mp4QP5hBfC9Wo6LmZSuPGl7VCVeaDNt4iU6c9xo=</ds:DigestValue>\n</ds:Reference>\n</ds:SignedInfo>\n<ds:SignatureValue Id="xmldsig-4bbd088d-4b3c-4278-bf54-10ed0174a593-sigvalue">\noMtPS30OoBXfH4O7Dk+ievAEwIuxCxK0EJuwiXmB2+8LFjE/TavgrL9LL1ERQoKdlgHagGqPxVe9&#13;\n5yFDXzJ+tLKIVf2vGwc4J2IwhFTyv/cLlDZDI5vSmd4bsdS8Hkn58szqSYkSh/7dl2UkhrzKqR+Q&#13;\neReefUjeKW+RRtstFGQSAs5chfSc1AL5U7r1rab7N96e1WcF4IqCt2tla2DaxCsXe4Wwn7Rv+f3c&#13;\nTG8UOcs4JRw86N0vApKUbiYlOmz2lQYnTOEX+a4EYE5VkXNZD2pwzbCuytlMAjSAe8EMVr9MQ+QO&#13;\nc2FPS+S5qSTUNv/WB7Bu+mlBd9i07mpS/rFcbw==\n</ds:SignatureValue>\n<ds:KeyInfo>\n<ds:X509Data>\n<ds:X509Certificate>\nMIIH/TCCBeWgAwIBAgIIT48jj+Tbwl8wDQYJKoZIhvcNAQELBQAwgbYxIzAhBgkqhkiG9w0BCQEW&#13;\nFGluZm9AYW5kZXNzY2QuY29tLmNvMSYwJAYDVQQDEx1DQSBBTkRFUyBTQ0QgUy5BLiBDbGFzZSBJ&#13;\nSSB2MzEwMC4GA1UECxMnRGl2aXNpb24gZGUgY2VydGlmaWNhY2lvbiBlbnRpZGFkIGZpbmFsMRIw&#13;\nEAYDVQQKEwlBbmRlcyBTQ0QxFDASBgNVBAcTC0JvZ290YSBELkMuMQswCQYDVQQGEwJDTzAeFw0y&#13;\nNjAzMzAwNTAwMDBaFw0yNzAzMzAwNDU5MDBaMIIBPDEWMBQGA1UECRMNQ1IgNTIgQSAxMCA3MDE0&#13;\nMDIGCSqGSIb3DQEJARYlZmFjdHVyYWVncnVwb2xlZGFjb21AZ3J1cG9sZWRhY29tLmNvbTEaMBgG&#13;\nA1UEAxMRR1JVUE8gTEVEQUNPTSBTQVMxEzARBgNVBAUTCjkwMTQ3NjQxMDgxNjA0BgNVBAwTLUVt&#13;\naXNvciBGYWN0dXJhIEVsZWN0cm9uaWNhIC0gUGVyc29uYSBKdXJpZGljYTE7MDkGA1UECxMyRW1p&#13;\ndGlkbyBwb3IgQW5kZXMgU0NEIEFjIDI2IDY5IEMgMDMgVG9ycmUgQiBPZiA3MDExETAPBgNVBAoT&#13;\nCEdFUkVOQ0lBMRIwEAYDVQQHDAlNRURFTEzDjU4xEjAQBgNVBAgTCUFOVElPUVVJQTELMAkGA1UE&#13;\nBhMCQ08wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDAU8awTvqOrsr9KhcEd0Gwrnmm&#13;\nWANWkFUkdvL4OoVhsc3P1hl97XA8dNSvFF2/GF3g04VITbASlp1KHRDgc0a0CI/ob8/pD3LzlExs&#13;\n0l9JuCNzV6r3kYLYUzNBYFjVqsz3KLxOfVDhfFjLu104enTCfVNIUyvSxS6nADPtFOkajwBop3Sv&#13;\nxCzeCpNa+Jr8zvpRfq7oz6wrcPhbmiPMmilqX+GArK1yS4HHjyPnoATooErPU0AHmTlhYyq2wc0M&#13;\nh/QvhK59OOjzsk7Y32wa41/yaWseXSGoxNMsb53uqFLeRS1NwpZ03lYc/7n7fE05UdBk2a88AL4T&#13;\nPVH+63s5WPVpAgMBAAGjggKEMIICgDAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFED+JmlHMicy&#13;\n0awhyC7sz43VNWjoMG8GCCsGAQUFBwEBBGMwYTA2BggrBgEFBQcwAoYqaHR0cDovL2NlcnRzLmFu&#13;\nZGVzc2NkLmNvbS5jby9DbGFzZUlJdjMuY3J0MCcGCCsGAQUFBzABhhtodHRwOi8vb2NzcC5hbmRl&#13;\nc3NjZC5jb20uY28wMAYDVR0RBCkwJ4ElZmFjdHVyYWVncnVwb2xlZGFjb21AZ3J1cG9sZWRhY29t&#13;\nLmNvbTCCASEGA1UdIASCARgwggEUMIHABgwrBgEEAYH0SAECBgswga8wgawGCCsGAQUFBwICMIGf&#13;\nDIGcTGEgdXRpbGl6YWNpw7NuIGRlIGVzdGUgY2VydGlmaWNhZG8gZXN0w6Egc3VqZXRhIGEgbGEg&#13;\nUEMgZGUgRmFjdHVyYWNpw7NuIEVsZWN0csOzbmljYSB5IERQQyBlc3RhYmxlY2lkYXMgcG9yIEFu&#13;\nZGVzIFNDRC4gQ8OzZGlnbyBkZSBBY3JlZGl0YWNpw7NuOiAxNi1FQ0QtMDA0ME8GDCsGAQQBgfRI&#13;\nAQEBDjA/MD0GCCsGAQUFBwIBFjFodHRwczovL3d3dy5hbmRlc3NjZC5jb20uY28vZG9jcy9EUENf&#13;\nQW5kZXNTQ0QucGRmMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDA5BgNVHR8EMjAwMC6g&#13;\nLKAqhihodHRwOi8vY3JsLmFuZGVzc2NkLmNvbS5jby9DbGFzZUlJdjMuY3JsMB0GA1UdDgQWBBSu&#13;\n/VPO+6VSc6K7OPvpijq2TDviuDAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggIBAKgT&#13;\noe+b1z1g7Tkb+ACkaU1zFSSwunQLmTS7P1BFzIv5OYNBfd8JKGkObNngJMLYgO7sZeDcGkdYP6zs&#13;\nVBd/d6lRPQ7KLwZOTNPL8EJH62glKkSRdcoxOHVGGgLOJnTO31TATgtHv5MhOmlTqyE6axDinfU7&#13;\nn0S5pU9AN1k/rBKCGaQzpSDeMDU0t7RRqYuEZg3YJFZh1Ag+7yyT4tXDuYeGWfNy5JOtq5jyxQxJ&#13;\nWDuo6lAh/QB7yYhAyAywpHkiV1oROPqZmFqzn59ITtfz1VJxNVVOJz5+ijHE7s1Ls1bh8Q+xPhws&#13;\nj2c3EqTPdaDH8BKR0g10ZGhlyOjMFR5h1aVVr2jle1nVdQyKvaEbA3tdSvNyYxmCQRIdirCFmwJx&#13;\n7UscxqaF0fw5xgxQWLN0cw80TWJmQKXmyxXD49xEC/b4z9XB/immitv2N7S6uFoGRNCEFo2PEXWx&#13;\nqZTflBywinn+Ge5aAgyk9UBCBKVClqeTMaZGqcLqK2quqtlTmbm04KosHH1IIYwslXDhewoYyAT7&#13;\nN3Kxux6HYtequJRbIaqFHuXhgRApzroFqdWQaUn7g4aWak9dn/UfjLGin8CAeBsJUAL4eTGpdm9q&#13;\nyg8HgLLWAByiXdic8hlHH4gjsD7AkJUn2u2Zp/+0GuSip1Itb+HuGjXCWSrmshehzkFe/EEn\n</ds:X509Certificate>\n<ds:X509IssuerSerial>\n<ds:X509IssuerName>c=CO,l=Bogota D.C.,o=Andes SCD,ou=Division de certificacion entidad final,cn=CA ANDES SCD S.A. Clase II v3,1.2.840.113549.1.9.1=info@andesscd.com.co</ds:X509IssuerName>\n<ds:X509SerialNumber>5732839951592833631</ds:X509SerialNumber>\n</ds:X509IssuerSerial>\n<ds:X509SubjectName>c=CO,st=ANTIOQUIA,l=MEDELLÍN,o=GERENCIA,ou=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701,title=Emisor Factura Electronica - Persona Juridica,serialNumber=9014764108,cn=GRUPO LEDACOM SAS,1.2.840.113549.1.9.1=facturaegrupoledacom@grupoledacom.com,street=CR 52 A 10 70</ds:X509SubjectName>\n</ds:X509Data>\n</ds:KeyInfo>\n<ds:Object><xades:QualifyingProperties xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" Target="#xmldsig-4bbd088d-4b3c-4278-bf54-10ed0174a593"><xades:SignedProperties Id="xmldsig-4bbd088d-4b3c-4278-bf54-10ed0174a593-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-14T11:53:20.206-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>gBHsBce57RwInVxLJauKXLtYsw1Nd5EVnXxF45B00kI=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>c=CO,l=Bogota D.C.,o=Andes SCD,ou=Division de certificacion entidad final,cn=CA ANDES SCD S.A. Clase II v3,1.2.840.113549.1.9.1=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>5732839951592833631</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyImplied/></xades:SignaturePolicyIdentifier></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object>\n</ds:Signature></ext:ExtensionContent>\n        </ext:UBLExtension>\n    </ext:UBLExtensions>\n    <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n    <cbc:CustomizationID>10</cbc:CustomizationID>\n    <cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID>\n    <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n    <cbc:ID>5be04e07465f3f48b181186ad3ec2b4360ae8e4688c9c9dde6a07d041798ce25eaca5af406fd20e9e9cf6290870cff3e</cbc:ID>\n    <cbc:IssueDate>2026-05-14</cbc:IssueDate>\n    <cbc:IssueTime>11:16:43-05:00</cbc:IssueTime>\n    <cbc:DocumentType>Contenedor de Factura Electronica</cbc:DocumentType>\n    <cbc:ParentDocumentID>FEGL80631</cbc:ParentDocumentID>\n    <cac:SenderParty>\n        <cac:PartyTaxScheme>\n            <cbc:RegistrationName>GRUPO LEDACOM SAS</cbc:RegistrationName>\n            <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="8" schemeName="31">901476410</cbc:CompanyID>\n            <cbc:TaxLevelCode listName="48">R-99-PN</cbc:TaxLevelCode>\n            <cac:TaxScheme>\n                <cbc:ID>01</cbc:ID>\n                <cbc:Name>IVA</cbc:Name>\n            </cac:TaxScheme>\n        </cac:PartyTaxScheme>\n    </cac:SenderParty>\n    <cac:ReceiverParty>\n        <cac:PartyTaxScheme>\n            <cbc:RegistrationName>ANDRES  BENTHAN MUNERA</cbc:RegistrationName>\n            <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="" schemeName="13">71271339</cbc:CompanyID>\n            <cbc:TaxLevelCode listName="05">R-99-PN</cbc:TaxLevelCode>\n            <cac:TaxScheme>\n                <cbc:ID>ZZ</cbc:ID>\n                <cbc:Name>No aplica</cbc:Name>\n            </cac:TaxScheme>\n        </cac:PartyTaxScheme>\n    </cac:ReceiverParty>\n    <cac:Attachment>\n        <cac:ExternalReference>\n            <cbc:MimeCode>text/xml</cbc:MimeCode>\n            <cbc:EncodingCode>UTF-8</cbc:EncodingCode>\n            <cbc:Description><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n    <ext:UBLExtensions>\n        <ext:UBLExtension>\n            <ext:ExtensionContent>\n                <sts:DianExtensions>\n                    <sts:InvoiceControl>\n                        <sts:InvoiceAuthorization>18764091889231</sts:InvoiceAuthorization>\n                        <sts:AuthorizationPeriod>\n                            <cbc:StartDate>2025-04-11</cbc:StartDate>\n                            <cbc:EndDate>2027-04-11</cbc:EndDate>\n                        </sts:AuthorizationPeriod>\n                        <sts:AuthorizedInvoices>\n                            <sts:Prefix>FEGL</sts:Prefix>\n                            <sts:From>40001</sts:From>\n                            <sts:To>100000</sts:To>\n                        </sts:AuthorizedInvoices>\n                    </sts:InvoiceControl>\n                    <sts:InvoiceSource>\n                        <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\n                    </sts:InvoiceSource>\n                    <sts:SoftwareProvider>\n                        <sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="8" schemeName="31">901476410</sts:ProviderID>\n                        <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">febaa0be-15da-4d0b-9082-c17668926717</sts:SoftwareID>\n                    </sts:SoftwareProvider>\n                    <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">6785176085de1b0adfd69dbe976cbf18a30c31e702d45aec03abb538f5d25e01a6ad45bcdd03ad65af717f6ba79b633d</sts:SoftwareSecurityCode>\n                    <sts:AuthorizationProvider>\n                        <sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID>\n                    </sts:AuthorizationProvider>\n                    <sts:QRCode>NumFac: FEGL80631 FecFac: 2026-05-14 HorFac: 11:16:43-05:00 NitFac: 901476410 DocAdq: 71271339 ValFac: 1619000.00 ValIva: 0.00 ValOtroIm: 0.00 ValTolFac: 1619000.00 CUFE: 5be04e07465f3f48b181186ad3ec2b4360ae8e4688c9c9dde6a07d041798ce25eaca5af406fd20e9e9cf6290870cff3e https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=5be04e07465f3f48b181186ad3ec2b4360ae8e4688c9c9dde6a07d041798ce25eaca5af406fd20e9e9cf6290870cff3e</sts:QRCode>\n                </sts:DianExtensions>\n            </ext:ExtensionContent>\n        </ext:UBLExtension>\n        <ext:UBLExtension>\n            <ext:ExtensionContent><ds:Signature Id="xmldsig-1efb2465-4cc9-476f-b940-5c6ee56c4d51">\n<ds:SignedInfo>\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>\n<ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>\n<ds:Reference Id="xmldsig-1efb2465-4cc9-476f-b940-5c6ee56c4d51-ref0" URI="">\n<ds:Transforms>\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>\n</ds:Transforms>\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>S2jzsGOQ7FX70WfYUku0xQCkWB+OMkXoQyKwocI0l+A=</ds:DigestValue>\n</ds:Reference>\n<ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-1efb2465-4cc9-476f-b940-5c6ee56c4d51-signedprops">\n<ds:Transforms>\n<ds:Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>\n</ds:Transforms>\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>Lc8jgiGA+QO60db+CnbG7zJL9ctMlELNHqbiqFBtQac=</ds:DigestValue>\n</ds:Reference>\n</ds:SignedInfo>\n<ds:SignatureValue Id="xmldsig-1efb2465-4cc9-476f-b940-5c6ee56c4d51-sigvalue">\nFjBIAG84OYQJlmd+KYBlm85EZZYpbGe4pCerKOOAqxTcfQFHlzWhyietvi129AKi7Z1DV3uhB3Hp&#13;\nGHDXppSj5XsMcjl3qUqnZYLhid75jzr/t8S4w8vBmnti1lSUDCauGllYk3hJfIolU0wBEC/hV4eU&#13;\neYyA3BMYagW0xHM9kH7+hsKQ7VNQYtgWrqFV+V5o8X+X8WbBHAB/YjFTLUnr4pLlhDNe6DDDnFMr&#13;\nOwEFvcGKx0OX3yhynacWr3cqdx8YSyGyz9ySvCyMcGby2Zd4ucCxrt4bg/nOSOzkI8do6/CUk0uF&#13;\nJGV6O3q3ReYy8qtubL5Q5C/T8aO3g8EnNUwdrQ==\n</ds:SignatureValue>\n<ds:KeyInfo>\n<ds:X509Data>\n<ds:X509Certificate>\nMIIH/TCCBeWgAwIBAgIIT48jj+Tbwl8wDQYJKoZIhvcNAQELBQAwgbYxIzAhBgkqhkiG9w0BCQEW&#13;\nFGluZm9AYW5kZXNzY2QuY29tLmNvMSYwJAYDVQQDEx1DQSBBTkRFUyBTQ0QgUy5BLiBDbGFzZSBJ&#13;\nSSB2MzEwMC4GA1UECxMnRGl2aXNpb24gZGUgY2VydGlmaWNhY2lvbiBlbnRpZGFkIGZpbmFsMRIw&#13;\nEAYDVQQKEwlBbmRlcyBTQ0QxFDASBgNVBAcTC0JvZ290YSBELkMuMQswCQYDVQQGEwJDTzAeFw0y&#13;\nNjAzMzAwNTAwMDBaFw0yNzAzMzAwNDU5MDBaMIIBPDEWMBQGA1UECRMNQ1IgNTIgQSAxMCA3MDE0&#13;\nMDIGCSqGSIb3DQEJARYlZmFjdHVyYWVncnVwb2xlZGFjb21AZ3J1cG9sZWRhY29tLmNvbTEaMBgG&#13;\nA1UEAxMRR1JVUE8gTEVEQUNPTSBTQVMxEzARBgNVBAUTCjkwMTQ3NjQxMDgxNjA0BgNVBAwTLUVt&#13;\naXNvciBGYWN0dXJhIEVsZWN0cm9uaWNhIC0gUGVyc29uYSBKdXJpZGljYTE7MDkGA1UECxMyRW1p&#13;\ndGlkbyBwb3IgQW5kZXMgU0NEIEFjIDI2IDY5IEMgMDMgVG9ycmUgQiBPZiA3MDExETAPBgNVBAoT&#13;\nCEdFUkVOQ0lBMRIwEAYDVQQHDAlNRURFTEzDjU4xEjAQBgNVBAgTCUFOVElPUVVJQTELMAkGA1UE&#13;\nBhMCQ08wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDAU8awTvqOrsr9KhcEd0Gwrnmm&#13;\nWANWkFUkdvL4OoVhsc3P1hl97XA8dNSvFF2/GF3g04VITbASlp1KHRDgc0a0CI/ob8/pD3LzlExs&#13;\n0l9JuCNzV6r3kYLYUzNBYFjVqsz3KLxOfVDhfFjLu104enTCfVNIUyvSxS6nADPtFOkajwBop3Sv&#13;\nxCzeCpNa+Jr8zvpRfq7oz6wrcPhbmiPMmilqX+GArK1yS4HHjyPnoATooErPU0AHmTlhYyq2wc0M&#13;\nh/QvhK59OOjzsk7Y32wa41/yaWseXSGoxNMsb53uqFLeRS1NwpZ03lYc/7n7fE05UdBk2a88AL4T&#13;\nPVH+63s5WPVpAgMBAAGjggKEMIICgDAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFED+JmlHMicy&#13;\n0awhyC7sz43VNWjoMG8GCCsGAQUFBwEBBGMwYTA2BggrBgEFBQcwAoYqaHR0cDovL2NlcnRzLmFu&#13;\nZGVzc2NkLmNvbS5jby9DbGFzZUlJdjMuY3J0MCcGCCsGAQUFBzABhhtodHRwOi8vb2NzcC5hbmRl&#13;\nc3NjZC5jb20uY28wMAYDVR0RBCkwJ4ElZmFjdHVyYWVncnVwb2xlZGFjb21AZ3J1cG9sZWRhY29t&#13;\nLmNvbTCCASEGA1UdIASCARgwggEUMIHABgwrBgEEAYH0SAECBgswga8wgawGCCsGAQUFBwICMIGf&#13;\nDIGcTGEgdXRpbGl6YWNpw7NuIGRlIGVzdGUgY2VydGlmaWNhZG8gZXN0w6Egc3VqZXRhIGEgbGEg&#13;\nUEMgZGUgRmFjdHVyYWNpw7NuIEVsZWN0csOzbmljYSB5IERQQyBlc3RhYmxlY2lkYXMgcG9yIEFu&#13;\nZGVzIFNDRC4gQ8OzZGlnbyBkZSBBY3JlZGl0YWNpw7NuOiAxNi1FQ0QtMDA0ME8GDCsGAQQBgfRI&#13;\nAQEBDjA/MD0GCCsGAQUFBwIBFjFodHRwczovL3d3dy5hbmRlc3NjZC5jb20uY28vZG9jcy9EUENf&#13;\nQW5kZXNTQ0QucGRmMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDA5BgNVHR8EMjAwMC6g&#13;\nLKAqhihodHRwOi8vY3JsLmFuZGVzc2NkLmNvbS5jby9DbGFzZUlJdjMuY3JsMB0GA1UdDgQWBBSu&#13;\n/VPO+6VSc6K7OPvpijq2TDviuDAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggIBAKgT&#13;\noe+b1z1g7Tkb+ACkaU1zFSSwunQLmTS7P1BFzIv5OYNBfd8JKGkObNngJMLYgO7sZeDcGkdYP6zs&#13;\nVBd/d6lRPQ7KLwZOTNPL8EJH62glKkSRdcoxOHVGGgLOJnTO31TATgtHv5MhOmlTqyE6axDinfU7&#13;\nn0S5pU9AN1k/rBKCGaQzpSDeMDU0t7RRqYuEZg3YJFZh1Ag+7yyT4tXDuYeGWfNy5JOtq5jyxQxJ&#13;\nWDuo6lAh/QB7yYhAyAywpHkiV1oROPqZmFqzn59ITtfz1VJxNVVOJz5+ijHE7s1Ls1bh8Q+xPhws&#13;\nj2c3EqTPdaDH8BKR0g10ZGhlyOjMFR5h1aVVr2jle1nVdQyKvaEbA3tdSvNyYxmCQRIdirCFmwJx&#13;\n7UscxqaF0fw5xgxQWLN0cw80TWJmQKXmyxXD49xEC/b4z9XB/immitv2N7S6uFoGRNCEFo2PEXWx&#13;\nqZTflBywinn+Ge5aAgyk9UBCBKVClqeTMaZGqcLqK2quqtlTmbm04KosHH1IIYwslXDhewoYyAT7&#13;\nN3Kxux6HYtequJRbIaqFHuXhgRApzroFqdWQaUn7g4aWak9dn/UfjLGin8CAeBsJUAL4eTGpdm9q&#13;\nyg8HgLLWAByiXdic8hlHH4gjsD7AkJUn2u2Zp/+0GuSip1Itb+HuGjXCWSrmshehzkFe/EEn\n</ds:X509Certificate>\n<ds:X509IssuerSerial>\n<ds:X509IssuerName>c=CO,l=Bogota D.C.,o=Andes SCD,ou=Division de certificacion entidad final,cn=CA ANDES SCD S.A. Clase II v3,1.2.840.113549.1.9.1=info@andesscd.com.co</ds:X509IssuerName>\n<ds:X509SerialNumber>5732839951592833631</ds:X509SerialNumber>\n</ds:X509IssuerSerial>\n<ds:X509SubjectName>c=CO,st=ANTIOQUIA,l=MEDELLÍN,o=GERENCIA,ou=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701,title=Emisor Factura Electronica - Persona Juridica,serialNumber=9014764108,cn=GRUPO LEDACOM SAS,1.2.840.113549.1.9.1=facturaegrupoledacom@grupoledacom.com,street=CR 52 A 10 70</ds:X509SubjectName>\n</ds:X509Data>\n</ds:KeyInfo>\n<ds:Object><xades:QualifyingProperties Target="#xmldsig-1efb2465-4cc9-476f-b940-5c6ee56c4d51"><xades:SignedProperties Id="xmldsig-1efb2465-4cc9-476f-b940-5c6ee56c4d51-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-14T11:53:03.776-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>gBHsBce57RwInVxLJauKXLtYsw1Nd5EVnXxF45B00kI=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>c=CO,l=Bogota D.C.,o=Andes SCD,ou=Division de certificacion entidad final,cn=CA ANDES SCD S.A. Clase II v3,1.2.840.113549.1.9.1=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>5732839951592833631</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>/home/release/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object>\n</ds:Signature></ext:ExtensionContent>\n        </ext:UBLExtension>\n    </ext:UBLExtensions>\n    <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n    <cbc:CustomizationID>10</cbc:CustomizationID>\n    <cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID>\n    <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n    <cbc:ID>FEGL80631</cbc:ID>\n    <cbc:UUID schemeID="1" schemeName="CUFE-SHA384">5be04e07465f3f48b181186ad3ec2b4360ae8e4688c9c9dde6a07d041798ce25eaca5af406fd20e9e9cf6290870cff3e</cbc:UUID>\n    <cbc:IssueDate>2026-05-14</cbc:IssueDate>\n    <cbc:IssueTime>11:16:43-05:00</cbc:IssueTime>\n    <cbc:DueDate>2026-05-14</cbc:DueDate>\n    <cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>\n    <cbc:Note>11:07:40\n14 May 202614 May 202627938178742Transferencia cta suc virtual\nCOP $ 1.619.000\n,00</cbc:Note>\n    <cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>\n    <cbc:LineCountNumeric>1</cbc:LineCountNumeric>\n    <cac:OrderReference>\n        <cbc:ID>101,PD00,PGSU,88862</cbc:ID>\n        <cbc:SalesOrderID>101,PD00,PGSU,88862</cbc:SalesOrderID>\n        <cbc:CustomerReference>71271339</cbc:CustomerReference>\n    </cac:OrderReference>\n    <cac:AccountingSupplierParty>\n        <cbc:AdditionalAccountID schemeAgencyID="195" schemeID="8" schemeName="31">1</cbc:AdditionalAccountID>\n        <cac:Party>\n            <cbc:IndustryClassificationCode>4651</cbc:IndustryClassificationCode>\n            <cac:PartyName>\n                <cbc:Name>GRUPO LEDACOM SAS</cbc:Name>\n            </cac:PartyName>\n            <cac:PhysicalLocation>\n                <cac:Address>\n                    <cbc:ID>05001</cbc:ID>\n                    <cbc:CityName>Medellín</cbc:CityName>\n                    <cbc:PostalZone>050001</cbc:PostalZone>\n                    <cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\n                    <cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\n                    <cac:AddressLine>\n                        <cbc:Line>CR 52 A 10 70</cbc:Line>\n                    </cac:AddressLine>\n                    <cac:Country>\n                        <cbc:IdentificationCode>CO</cbc:IdentificationCode>\n                        <cbc:Name languageID="es">Colombia</cbc:Name>\n                    </cac:Country>\n                </cac:Address>\n            </cac:PhysicalLocation>\n            <cac:PartyTaxScheme>\n                <cbc:RegistrationName>GRUPO LEDACOM SAS</cbc:RegistrationName>\n                <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="8" schemeName="31">901476410</cbc:CompanyID>\n                <cbc:TaxLevelCode listName="48">R-99-PN</cbc:TaxLevelCode>\n                <cac:RegistrationAddress>\n                    <cbc:ID>05001</cbc:ID>\n                    <cbc:CityName>MEDELLIN</cbc:CityName>\n                    <cbc:PostalZone>050001</cbc:PostalZone>\n                    <cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\n                    <cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\n                    <cac:AddressLine>\n                        <cbc:Line>CR 52 A 10 70</cbc:Line>\n                    </cac:AddressLine>\n                    <cac:Country>\n                        <cbc:IdentificationCode>CO</cbc:IdentificationCode>\n                        <cbc:Name languageID="es">Colombia</cbc:Name>\n                    </cac:Country>\n                </cac:RegistrationAddress>\n                <cac:TaxScheme>\n                    <cbc:ID>01</cbc:ID>\n                    <cbc:Name>IVA</cbc:Name>\n                </cac:TaxScheme>\n            </cac:PartyTaxScheme>\n            <cac:PartyLegalEntity>\n                <cbc:RegistrationName>GRUPO LEDACOM SAS</cbc:RegistrationName>\n                <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="8" schemeName="31">901476410</cbc:CompanyID>\n                <cac:CorporateRegistrationScheme>\n                    <cbc:ID>FEGL</cbc:ID>\n                    <cbc:Name>GRUPO LEDACOM SAS</cbc:Name>\n                </cac:CorporateRegistrationScheme>\n            </cac:PartyLegalEntity>\n            <cac:Contact>\n                <cbc:Name/>\n                <cbc:Telephone>4442406</cbc:Telephone>\n                <cbc:ElectronicMail>grupoledacomsas@gmail.com</cbc:ElectronicMail>\n                <cbc:Note/>\n                <cbc:Note/>\n            </cac:Contact>\n        </cac:Party>\n    </cac:AccountingSupplierParty>\n    <cac:AccountingCustomerParty>\n        <cbc:AdditionalAccountID>2</cbc:AdditionalAccountID>\n        <cac:Party>\n            <cbc:IndustryClassificationCode>9511</cbc:IndustryClassificationCode>\n            <cac:PartyIdentification>\n                <cbc:ID schemeName="13">71271339</cbc:ID>\n            </cac:PartyIdentification>\n            <cac:PartyName>\n                <cbc:Name>ANDRES  BENTHAN MUNERA</cbc:Name>\n            </cac:PartyName>\n            <cac:PhysicalLocation>\n                <cac:Address>\n                    <cbc:ID>05360</cbc:ID>\n                    <cbc:CityName>ITAGUI</cbc:CityName>\n                    <cbc:CountrySubentity>ANTIOQUIA</cbc:CountrySubentity>\n                    <cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\n                    <cac:AddressLine>\n                        <cbc:Line>CL 42 A 55 A 28</cbc:Line>\n                    </cac:AddressLine>\n                    <cac:Country>\n                        <cbc:IdentificationCode>CO</cbc:IdentificationCode>\n                        <cbc:Name languageID="es">Colombia</cbc:Name>\n                    </cac:Country>\n                </cac:Address>\n            </cac:PhysicalLocation>\n            <cac:PartyTaxScheme>\n                <cbc:RegistrationName>ANDRES  BENTHAN MUNERA</cbc:RegistrationName>\n                <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="" schemeName="13">71271339</cbc:CompanyID>\n                <cbc:TaxLevelCode listName="05">R-99-PN</cbc:TaxLevelCode>\n                <cac:RegistrationAddress>\n                    <cbc:ID>05360</cbc:ID>\n                    <cbc:CityName>ITAGUI</cbc:CityName>\n                    <cbc:CountrySubentity>ANTIOQUIA</cbc:CountrySubentity>\n                    <cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\n                    <cac:AddressLine>\n                        <cbc:Line>CL 42 A 55 A 28</cbc:Line>\n                    </cac:AddressLine>\n                    <cac:Country>\n                        <cbc:IdentificationCode>CO</cbc:IdentificationCode>\n                        <cbc:Name languageID="es">Colombia</cbc:Name>\n                    </cac:Country>\n                </cac:RegistrationAddress>\n                <cac:TaxScheme>\n                    <cbc:ID>ZZ</cbc:ID>\n                    <cbc:Name>No aplica</cbc:Name>\n                </cac:TaxScheme>\n            </cac:PartyTaxScheme>\n            <cac:PartyLegalEntity>\n                <cbc:RegistrationName>ANDRES  BENTHAN MUNERA</cbc:RegistrationName>\n                <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="" schemeName="13">71271339</cbc:CompanyID>\n                <cac:CorporateRegistrationScheme>\n                    <cbc:Name>ANDRES  BENTHAN MUNERA</cbc:Name>\n                </cac:CorporateRegistrationScheme>\n            </cac:PartyLegalEntity>\n            <cac:Contact>\n                <cbc:Telephone>3715726</cbc:Telephone>\n                <cbc:ElectronicMail>andresbenthan@gmail.com,servicioalcliente@maxan.com.co</cbc:ElectronicMail>\n            </cac:Contact>\n        </cac:Party>\n    </cac:AccountingCustomerParty>\n    <cac:PaymentMeans>\n        <cbc:ID>1</cbc:ID>\n        <cbc:PaymentMeansCode>47</cbc:PaymentMeansCode>\n        <cbc:PaymentDueDate>2026-05-14</cbc:PaymentDueDate>\n        <cbc:InstructionNote/>\n        <cbc:PaymentID>71271339</cbc:PaymentID>\n    </cac:PaymentMeans>\n    <cac:LegalMonetaryTotal>\n        <cbc:LineExtensionAmount currencyID="COP">1619000.00</cbc:LineExtensionAmount>\n        <cbc:TaxExclusiveAmount currencyID="COP">0.00</cbc:TaxExclusiveAmount>\n        <cbc:TaxInclusiveAmount currencyID="COP">1619000.00</cbc:TaxInclusiveAmount>\n        <cbc:PayableAmount currencyID="COP">1619000.00</cbc:PayableAmount>\n    </cac:LegalMonetaryTotal>\n    <cac:InvoiceLine>\n        <cbc:ID schemeID="0">1</cbc:ID>\n        <cbc:InvoicedQuantity unitCode="94">1</cbc:InvoicedQuantity>\n        <cbc:LineExtensionAmount currencyID="COP">1619000.00</cbc:LineExtensionAmount>\n        <cbc:FreeOfChargeIndicator>false</cbc:FreeOfChargeIndicator>\n        <cac:AllowanceCharge>\n            <cbc:ID>1</cbc:ID>\n            <cbc:ChargeIndicator>false</cbc:ChargeIndicator>\n            <cbc:AllowanceChargeReason>DESCUENTO APLICADO AL ITEM: 82YT00TKLM</cbc:AllowanceChargeReason>\n            <cbc:MultiplierFactorNumeric>0</cbc:MultiplierFactorNumeric>\n            <cbc:Amount currencyID="COP">0.00</cbc:Amount>\n            <cbc:BaseAmount currencyID="COP">1619000.00</cbc:BaseAmount>\n        </cac:AllowanceCharge>\n        <cac:Item>\n            <cbc:Description>PORTATIL LENOVO V14 GEN4 AMD R5 7520U RAM 16GB , SSD 512GB SSD, PANTALLA 14 FHD, LINUX SERIAL: SPF627SPX</cbc:Description>\n            <cbc:BrandName>PORTATIL LENOVO V14 GEN4 AMD R5 7520U RAM 16GB , SSD 512GB SSD, PANTALLA 14 FHD, LINUX SERIAL: SPF627SPX</cbc:BrandName>\n            <cbc:ModelName>.</cbc:ModelName>\n            <cac:SellersItemIdentification>\n                <cbc:ID>82YT00TKLM</cbc:ID>\n            </cac:SellersItemIdentification>\n            <cac:StandardItemIdentification>\n                <cbc:ID schemeID="999">82YT00TKLM</cbc:ID>\n            </cac:StandardItemIdentification>\n        </cac:Item>\n        <cac:Price>\n            <cbc:PriceAmount currencyID="COP">1619000.00</cbc:PriceAmount>\n            <cbc:BaseQuantity unitCode="94">1</cbc:BaseQuantity>\n        </cac:Price>\n    </cac:InvoiceLine>\n</Invoice>]]></cbc:Description>\n        </cac:ExternalReference>\n    </cac:Attachment>\n    <cac:ParentDocumentLineReference>\n        <cbc:LineID>1</cbc:LineID>\n        <cac:DocumentReference>\n            <cbc:ID>FEGL80631</cbc:ID>\n            <cbc:UUID schemeName="CUFE-SHA384">5be04e07465f3f48b181186ad3ec2b4360ae8e4688c9c9dde6a07d041798ce25eaca5af406fd20e9e9cf6290870cff3e</cbc:UUID>\n            <cbc:IssueDate>2026-05-14</cbc:IssueDate>\n            <cbc:DocumentType>ApplicationResponse</cbc:DocumentType>\n            <cac:Attachment>\n                <cac:ExternalReference>\n                    <cbc:MimeCode>text/xml</cbc:MimeCode>\n                    <cbc:EncodingCode>UTF-8</cbc:EncodingCode>\n                    <cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\n  <ext:UBLExtensions>\n    <ext:UBLExtension>\n      <ext:ExtensionContent>\n        <sts:DianExtensions>\n          <sts:InvoiceSource>\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\n          </sts:InvoiceSource>\n          <sts:SoftwareProvider>\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\n          </sts:SoftwareProvider>\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\n          <sts:AuthorizationProvider>\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\n          </sts:AuthorizationProvider>\n        </sts:DianExtensions>\n      </ext:ExtensionContent>\n    </ext:UBLExtension>\n    <ext:UBLExtension>\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-4344e382-04b3-4e71-86ca-a236a84521c5"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-c1eedf32-b243-421a-8781-fdc681fa4915" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>fDFNMRmuE16SfYNvjaFpXt/8h8SUfJlg4aWUpNv4kuQ=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-4344e382-04b3-4e71-86ca-a236a84521c5-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>yWa9X+ugdax8mkM4qAfowD4nujiFzgmbLcxoZre02no=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-4344e382-04b3-4e71-86ca-a236a84521c5-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>pgLefZMvvtlSluB3skikP1nnlFsWAX1zY1q+zGOwO/Y=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-4344e382-04b3-4e71-86ca-a236a84521c5">Zf7dZDDjEeLogv63Bm4d4LdnOK+rlf1lAy3/dP+aU1FQzi8gUH37YQNjAiiSSbY5XExKTkPXysetYyn9hC63mhbqNfpNrt45O79ZacHRrvtTtooaJAClOIFx4t7oIdTJNPzC+dKw5CI6EY2oFPcNba/30e5qe59UGv2GjTRYBPW+feXzleQs5GrG0qlaieE9EQsYbN4+CpnKYUU7Sn9BHN2iS9NjPSyY5mIGFD7mdGM5ehpTm4S/lk85AklUMK+nwUjyDy7pxcs3cK+Y+YSpqUvR6kn9QgKt4AI3XRSiPMUvttYkaGSU76bz93txCmz6JXEog+pcbdzVRPEtH9qglA==</ds:SignatureValue><ds:KeyInfo Id="Signature-4344e382-04b3-4e71-86ca-a236a84521c5-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-cad773fc-6ba4-417c-ab5d-1c9feb8acf27"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-e5e91471-33c9-41ae-9a1d-e7e8cb8f57d3" Target="#Signature-4344e382-04b3-4e71-86ca-a236a84521c5"><xades:SignedProperties Id="xmldsig-Signature-4344e382-04b3-4e71-86ca-a236a84521c5-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-14T11:53:04+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-c1eedf32-b243-421a-8781-fdc681fa4915"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\n    </ext:UBLExtension>\n  </ext:UBLExtensions>\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n  <cbc:CustomizationID>1</cbc:CustomizationID>\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n  <cbc:ID>79743514</cbc:ID>\n  <cbc:UUID schemeName="CUDE-SHA384">a5f22d642340c8a16099771f61d94bb788a6c577e01efa750dce90532e3cb20249d9a10b7d3c15378e996119cd65070b</cbc:UUID>\n  <cbc:IssueDate>2026-05-14</cbc:IssueDate>\n  <cbc:IssueTime>11:53:04-05:00</cbc:IssueTime>\n  <cac:SenderParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:SenderParty>\n  <cac:ReceiverParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>GRUPO LEDACOM SAS</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="8" schemeName="31">901476410</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:ReceiverParty>\n  <cac:DocumentResponse>\n    <cac:Response>\n      <cbc:ResponseCode>02</cbc:ResponseCode>\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\n    </cac:Response>\n    <cac:DocumentReference>\n      <cbc:ID>FEGL80631</cbc:ID>\n      <cbc:UUID schemeName="CUFE-SHA384">5be04e07465f3f48b181186ad3ec2b4360ae8e4688c9c9dde6a07d041798ce25eaca5af406fd20e9e9cf6290870cff3e</cbc:UUID>\n    </cac:DocumentReference>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>1</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\n        <cbc:Description>0</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>2</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n  </cac:DocumentResponse>\n</ApplicationResponse>]]></cbc:Description>\n                </cac:ExternalReference>\n            </cac:Attachment>\n            <cac:ResultOfVerification>\n                <cbc:ValidatorID>Unidad Especial Direccion de Impuestos y Aduanas Nacionales</cbc:ValidatorID>\n                <cbc:ValidationResultCode>002</cbc:ValidationResultCode>\n                <cbc:ValidationDate>2026-05-14</cbc:ValidationDate>\n                <cbc:ValidationTime>16:58:04-05:00</cbc:ValidationTime>\n            </cac:ResultOfVerification>\n        </cac:DocumentReference>\n    </cac:ParentDocumentLineReference>\n</AttachedDocument>	\N	2026-07-03 02:10:48.11119
8	12	xml_invoice	FEVT144434, 06052026, VirtualTronic.xml	\N	<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-1227afe7-0f4f-48c7-9dac-c346097a873b">\n<ds:SignedInfo>\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>\n<ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>\n<ds:Reference Id="id-1227afe7-0f4f-48c7-9dac-c346097a873b-ref0" URI="">\n<ds:Transforms>\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>\n</ds:Transforms>\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>v8Q591b397RCLx/+XjK+lf14N/mP4VIG4Kc4Oi5Gi38=</ds:DigestValue>\n</ds:Reference>\n<ds:Reference URI="#id-1227afe7-0f4f-48c7-9dac-c346097a873b-ref0">\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>wng5pYJwGY4gKc0j31Ki5h2H/C2mQj4NN5Xp7XjY0fw=</ds:DigestValue>\n</ds:Reference>\n<ds:Reference URI="#id-1227afe7-0f4f-48c7-9dac-c346097a873b-ref0">\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>wng5pYJwGY4gKc0j31Ki5h2H/C2mQj4NN5Xp7XjY0fw=</ds:DigestValue>\n</ds:Reference>\n</ds:SignedInfo>\n<ds:SignatureValue>ZmclQM3zLXRa2Lp9fVWsr3pUJYKHm79NMbyDqHfd0Q2n9f51YA2IQ2/0drw94o2k\nIVu/E8RKa6WJ19oenABWQQFa6n6UvisxBXy/qqrCTt6MQlGgzNgMVyaHujJjPzt5\nSr39GwBQ3C3Pa0DWo49pjdlxpjB+y3wGGPGi4O/4U836ubk/gXI7abI3sXM13XTp\nsIdd4TM0spybU10QTm0BwxI5EEoW2tDyCvmDu9Lwzc7Lu9xNkD7FCX3AjfaTzlVf\n/KePBgOz09HHYdjDzXlEirKFi0rqKXFlvnHjfvZ6pnKO/BZ8Cr0pWn/qFLzoQWHK\nhK8bFLxhz08W+k+PALCtzw==</ds:SignatureValue>\n<ds:KeyInfo Id="id-1227afe7-0f4f-48c7-9dac-c346097a873b-keyinfo">\n<ds:X509Data>\n<ds:X509Certificate>MIIH8TCCBdmgAwIBAgIIJOWx363r6LowDQYJKoZIhvcNAQELBQAwgbYxIzAhBgkq\nhkiG9w0BCQEWFGluZm9AYW5kZXNzY2QuY29tLmNvMSYwJAYDVQQDEx1DQSBBTkRF\nUyBTQ0QgUy5BLiBDbGFzZSBJSSB2MzEwMC4GA1UECxMnRGl2aXNpb24gZGUgY2Vy\ndGlmaWNhY2lvbiBlbnRpZGFkIGZpbmFsMRIwEAYDVQQKEwlBbmRlcyBTQ0QxFDAS\nBgNVBAcTC0JvZ290YSBELkMuMQswCQYDVQQGEwJDTzAeFw0yNTA3MDIxOTMyNDJa\nFw0yNjA3MDIxOTMxNDJaMIIBOjEdMBsGA1UECQwUQ1JBLiA1MCAjOTdBIFNVUi0x\nNTAxLjAsBgkqhkiG9w0BCQEWH2p1bGlhbi5iYXJyaWVudG9zQGNhZGVuYS5jb20u\nY28xFzAVBgNVBAMTDkNBREVOQSBTIC4gQSAuMRMwEQYDVQQFEwo4OTA5MzA1MzQw\nMTYwNAYDVQQMEy1FbWlzb3IgRmFjdHVyYSBFbGVjdHJvbmljYSAtIFBlcnNvbmEg\nSnVyaWRpY2ExOzA5BgNVBAsTMkVtaXRpZG8gcG9yIEFuZGVzIFNDRCBBYyAyNiA2\nOSBDIDAzIFRvcnJlIEIgT2YgNzAxMQ8wDQYDVQQKEwZDQURFTkExFDASBgNVBAcT\nC0xBIEVTVFJFTExBMRIwEAYDVQQIEwlBTlRJT1FVSUExCzAJBgNVBAYTAkNPMIIB\nIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwFZ5YOmFEdi7/LvKsUUPqmuv\n6bDNWzvgN4yowD4ee4/uFgNuPL0dyTzI+rdtk+rcsMhIOxWgE/zcY2KeT5Eto8hJ\n2FzcpRo6aUf4wyKXhK3vXqpHnx3gZCEINyFehYd94vqq8peF/6HN202cueQGUCop\nqxTBEx8SJOWq3IGaBuylLG3yTw/mU2bOV76hHfZfUiL2y1Bq2YdE47uCuAn8Fpyh\noin9hLEJ5wUjNAW71qI1u1PEKSzaSDmLRkaOYo6wkVtLy06ORwvbNDb4FUjfcJeO\nfq0UyxkDaNvZ6PkPA7e6u+V7g4u6M9ZaDbBWuvwm7s1TsokniQp0Eq2esunouQID\nAQABo4ICejCCAnYwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBRA/iZpRzInMtGs\nIcgu7M+N1TVo6DBvBggrBgEFBQcBAQRjMGEwNgYIKwYBBQUHMAKGKmh0dHA6Ly9j\nZXJ0cy5hbmRlc3NjZC5jb20uY28vQ2xhc2VJSXYzLmNydDAnBggrBgEFBQcwAYYb\naHR0cDovL29jc3AuYW5kZXNzY2QuY29tLmNvMCoGA1UdEQQjMCGBH2p1bGlhbi5i\nYXJyaWVudG9zQGNhZGVuYS5jb20uY28wggEdBgNVHSAEggEUMIIBEDCBwAYMKwYB\nBAGB9EgBAgYKMIGvMIGsBggrBgEFBQcCAjCBnwyBnExhIHV0aWxpemFjacOzbiBk\nZSBlc3RlIGNlcnRpZmljYWRvIGVzdMOhIHN1amV0YSBhIGxhIFBDIGRlIEZhY3R1\ncmFjacOzbiBFbGVjdHLDs25pY2EgeSBEUEMgZXN0YWJsZWNpZGFzIHBvciBBbmRl\ncyBTQ0QuIEPDs2RpZ28gZGUgQWNyZWRpdGFjacOzbjogMTYtRUNELTAwNDBLBgwr\nBgEEAYH0SAEBAQ0wOzA5BggrBgEFBQcCARYtaHR0cHM6Ly9hbmRlc3NjZC5jb20u\nY28vZG9jcy9EUENfQW5kZXNTQ0QucGRmMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggr\nBgEFBQcDBDA5BgNVHR8EMjAwMC6gLKAqhihodHRwOi8vY3JsLmFuZGVzc2NkLmNv\nbS5jby9DbGFzZUlJdjMuY3JsMB0GA1UdDgQWBBSjWvuVThoYbK9881WjNp8VCuet\nDzAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggIBAAjXKwaTNM7Ou7HA\nVfCVf9BhGs7Ojo+CxiqoxC09ipGZhMLnmLupnSejijaem/t3sUKxtcl4ZgVu6lJ6\naqxymfHsq63a5HyP26fe7Kb6kzHCSEYjPUh95/y1czhLbyYMDij6IjCrkcjL/qmO\nFLav3mKGI79TYCCYbl/GipQa0FT2sfZkLUzwQelT0iwc3kh0m+mBcqXh520I7gqP\n2szj/wev/HF0N03LFT6ESinkhUynuzQ3TpYUNiHWHbpazEjuDnkM6DOTVWWn8w7k\nyF2jHLp8ob6jmlCnbpuNabmGv1bqy+Q0sWHfjuyhfoo1siNeu5v6MxHaMT9mUkFd\nekcB6+xsxNo4jvFRuBi/EqxlZVf5TV3Bwd36EWg7/C70N0WJJovTCQf6ZHBF1BNd\nuFzPgfUGa2nHGgV77RCSpvdGQVZbkKqQyZ6Cw2FjBtXOEnDJtAP6yFCTp81qEb4T\npuArOB7s221DTsGybpl2Oxcc358XQuZlgjt2jqYXgh6YGHYU5YwpeXWd4maOjCdo\npEgPpiUCxEkpl3bgKfkCFP45uWrtUo08jzFuY+5V29UFpS1635aFVmnfvwZBUhEQ\nL40zfIxwcNdlHtUcnygeWS/8SQQaXXW1Qu4F/UmbtGcKAuQDpTLMlUMnvJjuG/60\nuWIW+l5gcca1SDHJQfVPImEL2hnb</ds:X509Certificate>\n</ds:X509Data>\n<ds:KeyValue>\n<ds:RSAKeyValue>\n<ds:Modulus>wFZ5YOmFEdi7/LvKsUUPqmuv6bDNWzvgN4yowD4ee4/uFgNuPL0dyTzI+rdtk+rc\nsMhIOxWgE/zcY2KeT5Eto8hJ2FzcpRo6aUf4wyKXhK3vXqpHnx3gZCEINyFehYd9\n4vqq8peF/6HN202cueQGUCopqxTBEx8SJOWq3IGaBuylLG3yTw/mU2bOV76hHfZf\nUiL2y1Bq2YdE47uCuAn8Fpyhoin9hLEJ5wUjNAW71qI1u1PEKSzaSDmLRkaOYo6w\nkVtLy06ORwvbNDb4FUjfcJeOfq0UyxkDaNvZ6PkPA7e6u+V7g4u6M9ZaDbBWuvwm\n7s1TsokniQp0Eq2esunouQ==</ds:Modulus>\n<ds:Exponent>AQAB</ds:Exponent>\n</ds:RSAKeyValue>\n</ds:KeyValue>\n</ds:KeyInfo>\n<ds:Object><xades:QualifyingProperties Target="#id-1227afe7-0f4f-48c7-9dac-c346097a873b" Id="id-7f6b70a0-2d18-4b31-951b-ad9842fb73b6"><xades:SignedProperties Id="id-1227afe7-0f4f-48c7-9dac-c346097a873b-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-06T10:37:43.963752-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>PoFW98kcvacIWnmPeKPDsrcHXCz4H6O+QeCJcxURvyg=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>2658726729285888186</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT144434</cbc:ID><cbc:IssueDate>2026-05-06</cbc:IssueDate><cbc:IssueTime>15:37:47-05:00</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>FEVT144434</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeID="6" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">901217437</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeID=" " schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><sts:DianExtensions><sts:InvoiceControl><sts:InvoiceAuthorization>18764092754559</sts:InvoiceAuthorization><sts:AuthorizationPeriod><cbc:StartDate>2025-05-05</cbc:StartDate><cbc:EndDate>2027-05-05</cbc:EndDate></sts:AuthorizationPeriod><sts:AuthorizedInvoices><sts:Prefix>FEVT</sts:Prefix><sts:From>100001</sts:From><sts:To>1000000</sts:To></sts:AuthorizedInvoices></sts:InvoiceControl><sts:InvoiceSource><cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode></sts:InvoiceSource><sts:SoftwareProvider><sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="0" schemeName="31">890930534</sts:ProviderID><sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">49fab599-4556-4828-a30b-852a910c5bb1</sts:SoftwareID></sts:SoftwareProvider><sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">40dcd818fbdd51b77b02db0074e3240832fd7f222472121a8435c862d10e980f5ce7bb05a4a0ac75ad86a4babe3e064d</sts:SoftwareSecurityCode><sts:AuthorizationProvider><sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID></sts:AuthorizationProvider><sts:QRCode>NumFac=FEVT144434 FecFac=2026-05-06 HorFac=10:37:42-05:00 NitFac=901217437 DocAdq=71271339 ValFac=88235.29 ValIva=16764.71 ValOtroIm=0.00 ValTolFac=105000.00 CUFE=c608be689a8ed3c81c3df535ec675d43614ef5d33f67caa3f368eb769fe4473d755e5fa008333968dfd51d1549fb31aa QRCode=https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=c608be689a8ed3c81c3df535ec675d43614ef5d33f67caa3f368eb769fe4473d755e5fa008333968dfd51d1549fb31aa</sts:QRCode></sts:DianExtensions></ext:ExtensionContent></ext:UBLExtension><ext:UBLExtension><ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="id-5d8c66b0-580e-46a7-8770-08805460511a">\n<ds:SignedInfo>\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>\n<ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>\n<ds:Reference Id="id-5d8c66b0-580e-46a7-8770-08805460511a-ref0" URI="">\n<ds:Transforms>\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>\n</ds:Transforms>\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>KGensfHiR9BKKi3YRA+0Gu7TOhK2n/nX0zJbj3BrNOk=</ds:DigestValue>\n</ds:Reference>\n<ds:Reference URI="#id-5d8c66b0-580e-46a7-8770-08805460511a-ref0">\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>WF9Fg3Lm65C0JHofZDbACczaaN53gGNT8KF8H0rDrWA=</ds:DigestValue>\n</ds:Reference>\n<ds:Reference URI="#id-5d8c66b0-580e-46a7-8770-08805460511a-ref0">\n<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\n<ds:DigestValue>WF9Fg3Lm65C0JHofZDbACczaaN53gGNT8KF8H0rDrWA=</ds:DigestValue>\n</ds:Reference>\n</ds:SignedInfo>\n<ds:SignatureValue>MYXBJjCr9JO34tK1+mIuklOvybn0t+W0pKdIbWkvq2tdyC0n9wIHVBIpTq6lS4Yp\naL+MjksJrxIMFovrdmMsiJmn22Bw4HUYjy2IQLr9Xuv3eZJKLt02dVEQzqn9CoeD\nKsZIPEN03HxWBvd1s0INo3KLwTqCA+TR6h1g217lp12yRH19adU6tPrQjhl4aCVz\nZVGPlJKybdTpUiK8fbH6VG9QZQf+GUNGa/dF1+0oFqBbfMGdHpeJZpYqJ8qEvSwI\nIOQb+UEPT5+lITtEE3lxNioN78XzQhA+F9QgfRQXdBXJ7BrK8CJcKog8Y7j0NTUU\n0ZKWkhDVYoWCKxFkj5+IwA==</ds:SignatureValue>\n<ds:KeyInfo Id="id-5d8c66b0-580e-46a7-8770-08805460511a-keyinfo">\n<ds:X509Data>\n<ds:X509Certificate>MIIH8TCCBdmgAwIBAgIIJOWx363r6LowDQYJKoZIhvcNAQELBQAwgbYxIzAhBgkq\nhkiG9w0BCQEWFGluZm9AYW5kZXNzY2QuY29tLmNvMSYwJAYDVQQDEx1DQSBBTkRF\nUyBTQ0QgUy5BLiBDbGFzZSBJSSB2MzEwMC4GA1UECxMnRGl2aXNpb24gZGUgY2Vy\ndGlmaWNhY2lvbiBlbnRpZGFkIGZpbmFsMRIwEAYDVQQKEwlBbmRlcyBTQ0QxFDAS\nBgNVBAcTC0JvZ290YSBELkMuMQswCQYDVQQGEwJDTzAeFw0yNTA3MDIxOTMyNDJa\nFw0yNjA3MDIxOTMxNDJaMIIBOjEdMBsGA1UECQwUQ1JBLiA1MCAjOTdBIFNVUi0x\nNTAxLjAsBgkqhkiG9w0BCQEWH2p1bGlhbi5iYXJyaWVudG9zQGNhZGVuYS5jb20u\nY28xFzAVBgNVBAMTDkNBREVOQSBTIC4gQSAuMRMwEQYDVQQFEwo4OTA5MzA1MzQw\nMTYwNAYDVQQMEy1FbWlzb3IgRmFjdHVyYSBFbGVjdHJvbmljYSAtIFBlcnNvbmEg\nSnVyaWRpY2ExOzA5BgNVBAsTMkVtaXRpZG8gcG9yIEFuZGVzIFNDRCBBYyAyNiA2\nOSBDIDAzIFRvcnJlIEIgT2YgNzAxMQ8wDQYDVQQKEwZDQURFTkExFDASBgNVBAcT\nC0xBIEVTVFJFTExBMRIwEAYDVQQIEwlBTlRJT1FVSUExCzAJBgNVBAYTAkNPMIIB\nIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwFZ5YOmFEdi7/LvKsUUPqmuv\n6bDNWzvgN4yowD4ee4/uFgNuPL0dyTzI+rdtk+rcsMhIOxWgE/zcY2KeT5Eto8hJ\n2FzcpRo6aUf4wyKXhK3vXqpHnx3gZCEINyFehYd94vqq8peF/6HN202cueQGUCop\nqxTBEx8SJOWq3IGaBuylLG3yTw/mU2bOV76hHfZfUiL2y1Bq2YdE47uCuAn8Fpyh\noin9hLEJ5wUjNAW71qI1u1PEKSzaSDmLRkaOYo6wkVtLy06ORwvbNDb4FUjfcJeO\nfq0UyxkDaNvZ6PkPA7e6u+V7g4u6M9ZaDbBWuvwm7s1TsokniQp0Eq2esunouQID\nAQABo4ICejCCAnYwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBRA/iZpRzInMtGs\nIcgu7M+N1TVo6DBvBggrBgEFBQcBAQRjMGEwNgYIKwYBBQUHMAKGKmh0dHA6Ly9j\nZXJ0cy5hbmRlc3NjZC5jb20uY28vQ2xhc2VJSXYzLmNydDAnBggrBgEFBQcwAYYb\naHR0cDovL29jc3AuYW5kZXNzY2QuY29tLmNvMCoGA1UdEQQjMCGBH2p1bGlhbi5i\nYXJyaWVudG9zQGNhZGVuYS5jb20uY28wggEdBgNVHSAEggEUMIIBEDCBwAYMKwYB\nBAGB9EgBAgYKMIGvMIGsBggrBgEFBQcCAjCBnwyBnExhIHV0aWxpemFjacOzbiBk\nZSBlc3RlIGNlcnRpZmljYWRvIGVzdMOhIHN1amV0YSBhIGxhIFBDIGRlIEZhY3R1\ncmFjacOzbiBFbGVjdHLDs25pY2EgeSBEUEMgZXN0YWJsZWNpZGFzIHBvciBBbmRl\ncyBTQ0QuIEPDs2RpZ28gZGUgQWNyZWRpdGFjacOzbjogMTYtRUNELTAwNDBLBgwr\nBgEEAYH0SAEBAQ0wOzA5BggrBgEFBQcCARYtaHR0cHM6Ly9hbmRlc3NjZC5jb20u\nY28vZG9jcy9EUENfQW5kZXNTQ0QucGRmMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggr\nBgEFBQcDBDA5BgNVHR8EMjAwMC6gLKAqhihodHRwOi8vY3JsLmFuZGVzc2NkLmNv\nbS5jby9DbGFzZUlJdjMuY3JsMB0GA1UdDgQWBBSjWvuVThoYbK9881WjNp8VCuet\nDzAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggIBAAjXKwaTNM7Ou7HA\nVfCVf9BhGs7Ojo+CxiqoxC09ipGZhMLnmLupnSejijaem/t3sUKxtcl4ZgVu6lJ6\naqxymfHsq63a5HyP26fe7Kb6kzHCSEYjPUh95/y1czhLbyYMDij6IjCrkcjL/qmO\nFLav3mKGI79TYCCYbl/GipQa0FT2sfZkLUzwQelT0iwc3kh0m+mBcqXh520I7gqP\n2szj/wev/HF0N03LFT6ESinkhUynuzQ3TpYUNiHWHbpazEjuDnkM6DOTVWWn8w7k\nyF2jHLp8ob6jmlCnbpuNabmGv1bqy+Q0sWHfjuyhfoo1siNeu5v6MxHaMT9mUkFd\nekcB6+xsxNo4jvFRuBi/EqxlZVf5TV3Bwd36EWg7/C70N0WJJovTCQf6ZHBF1BNd\nuFzPgfUGa2nHGgV77RCSpvdGQVZbkKqQyZ6Cw2FjBtXOEnDJtAP6yFCTp81qEb4T\npuArOB7s221DTsGybpl2Oxcc358XQuZlgjt2jqYXgh6YGHYU5YwpeXWd4maOjCdo\npEgPpiUCxEkpl3bgKfkCFP45uWrtUo08jzFuY+5V29UFpS1635aFVmnfvwZBUhEQ\nL40zfIxwcNdlHtUcnygeWS/8SQQaXXW1Qu4F/UmbtGcKAuQDpTLMlUMnvJjuG/60\nuWIW+l5gcca1SDHJQfVPImEL2hnb</ds:X509Certificate>\n</ds:X509Data>\n<ds:KeyValue>\n<ds:RSAKeyValue>\n<ds:Modulus>wFZ5YOmFEdi7/LvKsUUPqmuv6bDNWzvgN4yowD4ee4/uFgNuPL0dyTzI+rdtk+rc\nsMhIOxWgE/zcY2KeT5Eto8hJ2FzcpRo6aUf4wyKXhK3vXqpHnx3gZCEINyFehYd9\n4vqq8peF/6HN202cueQGUCopqxTBEx8SJOWq3IGaBuylLG3yTw/mU2bOV76hHfZf\nUiL2y1Bq2YdE47uCuAn8Fpyhoin9hLEJ5wUjNAW71qI1u1PEKSzaSDmLRkaOYo6w\nkVtLy06ORwvbNDb4FUjfcJeOfq0UyxkDaNvZ6PkPA7e6u+V7g4u6M9ZaDbBWuvwm\n7s1TsokniQp0Eq2esunouQ==</ds:Modulus>\n<ds:Exponent>AQAB</ds:Exponent>\n</ds:RSAKeyValue>\n</ds:KeyValue>\n</ds:KeyInfo>\n<ds:Object><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Target="#id-5d8c66b0-580e-46a7-8770-08805460511a" Id="id-5601d719-b6a9-48e0-ba80-140c94295b78"><xades:SignedProperties Id="id-5d8c66b0-580e-46a7-8770-08805460511a-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-06T10:37:43.963752-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>PoFW98kcvacIWnmPeKPDsrcHXCz4H6O+QeCJcxURvyg=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>2658726729285888186</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>10</cbc:CustomizationID><cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT144434</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">c608be689a8ed3c81c3df535ec675d43614ef5d33f67caa3f368eb769fe4473d755e5fa008333968dfd51d1549fb31aa</cbc:UUID><cbc:IssueDate>2026-05-06</cbc:IssueDate><cbc:IssueTime>10:37:42-05:00</cbc:IssueTime><cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode><cbc:Note languageLocaleID="es">Persona jurídica y asimiladas, Régimen ordinario de tributación, Responsable impuesto a las ventas, Agente retenedor (puede practicar retención) y Autorretención de renta (autorretención 0.55%\nFactura de CONTADO: Consignación bancaria.\n</cbc:Note><cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>1</cbc:LineCountNumeric><cac:InvoicePeriod><cbc:StartDate>2026-05-01</cbc:StartDate><cbc:EndDate>2026-05-31</cbc:EndDate></cac:InvoicePeriod><cac:OrderReference><cbc:ID> </cbc:ID><cbc:IssueDate>2026-05-06</cbc:IssueDate></cac:OrderReference><cac:AccountingSupplierParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cac:PartyName><cbc:Name>VIRTUAL TRONIC SAS</cbc:Name></cac:PartyName><cac:PhysicalLocation><cbc:Name>ppal</cbc:Name><cac:Address><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeID="6" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">901217437</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeID="6" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">901217437</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>FEVT</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:Telephone>604 431 0339</cbc:Telephone><cbc:ElectronicMail>info@virtualtronic.com.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cbc:AdditionalAccountID>2</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID schemeName="13">71271339</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeID=" " schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID><cac:CorporateRegistrationScheme/></cac:PartyLegalEntity><cac:Contact><cbc:Telephone>3134850115</cbc:Telephone><cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cbc:ActualDeliveryDate>2026-05-06</cbc:ActualDeliveryDate><cbc:ActualDeliveryTime>10:37:42-05:00</cbc:ActualDeliveryTime></cac:Delivery><cac:PaymentMeans><cbc:ID>1</cbc:ID><cbc:PaymentMeansCode>42</cbc:PaymentMeansCode><cbc:PaymentDueDate>2026-05-06</cbc:PaymentDueDate></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="COP">16764.71</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">88235.29</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">16764.71</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">88235.29</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="COP">88235.29</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="COP">105000.00</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount><cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount><cbc:PayableRoundingAmount currencyID="COP">0.00</cbc:PayableRoundingAmount><cbc:PayableAmount currencyID="COP">105000.00</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID schemeID="0">1</cbc:ID><cbc:Note languageLocaleID="es"> Lotes: VT16122510126 (1)</cbc:Note><cbc:InvoicedQuantity unitCode="WSD">1.0000</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="COP">88235.29</cbc:LineExtensionAmount><cac:TaxTotal><cbc:TaxAmount currencyID="COP">16764.71</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">88235.29</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">16764.71</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Bateria Lenovo L16L2PB2 7.6V 4100mAh 31Wh </cbc:Description><cac:SellersItemIdentification><cbc:ID>BLE-025</cbc:ID></cac:SellersItemIdentification><cac:StandardItemIdentification><cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">BLE-025</cbc:ID></cac:StandardItemIdentification></cac:Item><cac:Price><cbc:PriceAmount currencyID="COP">88235.29</cbc:PriceAmount><cbc:BaseQuantity unitCode="WSD">1.0000</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>FEVT144434</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">c608be689a8ed3c81c3df535ec675d43614ef5d33f67caa3f368eb769fe4473d755e5fa008333968dfd51d1549fb31aa</cbc:UUID><cbc:IssueDate>2026-05-06</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\n  <ext:UBLExtensions>\n    <ext:UBLExtension>\n      <ext:ExtensionContent>\n        <sts:DianExtensions>\n          <sts:InvoiceSource>\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\n          </sts:InvoiceSource>\n          <sts:SoftwareProvider>\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\n          </sts:SoftwareProvider>\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\n          <sts:AuthorizationProvider>\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\n          </sts:AuthorizationProvider>\n        </sts:DianExtensions>\n      </ext:ExtensionContent>\n    </ext:UBLExtension>\n    <ext:UBLExtension>\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-9574e392-3e27-449e-b996-f5cf58a052fc"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-45632319-28f9-40f2-944f-92687b257010" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>jldR01YQskh/NpaCYkoAhoOx01WqKh+S2qPGO3F11Dk=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-9574e392-3e27-449e-b996-f5cf58a052fc-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>3Ul1jsNHwMJPKX7FCAAwDpuwlZbNhK50NbOdxCS5p8U=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-9574e392-3e27-449e-b996-f5cf58a052fc-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>hSMUza/DUGTFF78YkIPvacmKAXWMdMAHKBnyoAn9GBU=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-9574e392-3e27-449e-b996-f5cf58a052fc">PBCrm1aSHzBjevR6X5MB8AdzO1hI/q73n/Ys9Z+VtvrPbL8PUL+A0RA0WGGS1N2xzGIZCJR8nqOUgLzGxSn2U8gKm0AlI43QQz4qzMX1oaGyiUYqzkwS9htRtezJxvlJg2aJjhmc73OqXsZBj+uxRgJwc/dwJgMWqUMTXphRiHJhC2N3PPBoSUypmhhauSsJCW7t2QXgOTZx0FYh+ylcuDhLq6Hh6B2qpj6ySA+3HvdWnkx926GO+xJ7UcA9La9ihyAtQfTFml4nwSH+2sHs9+ZHs3sw3GHfBmPIVY5xO12Bi+0jmJqphUMwHQ3XPgFEKUiyfXtKAX49ZwincUHl6w==</ds:SignatureValue><ds:KeyInfo Id="Signature-9574e392-3e27-449e-b996-f5cf58a052fc-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-60af5449-0a26-4764-aa4f-4a629461406f"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-94206c74-3677-4dd7-bbb0-cfbb21c54c5f" Target="#Signature-9574e392-3e27-449e-b996-f5cf58a052fc"><xades:SignedProperties Id="xmldsig-Signature-9574e392-3e27-449e-b996-f5cf58a052fc-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-06T10:37:46+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-45632319-28f9-40f2-944f-92687b257010"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\n    </ext:UBLExtension>\n  </ext:UBLExtensions>\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n  <cbc:CustomizationID>1</cbc:CustomizationID>\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n  <cbc:ID>79132457</cbc:ID>\n  <cbc:UUID schemeName="CUDE-SHA384">0f0fc8310e474c5cde506c462592590279ea78dff432b5887f1dafe88e16942903ef6338602a8af17d1d1955bebfcd15</cbc:UUID>\n  <cbc:IssueDate>2026-05-06</cbc:IssueDate>\n  <cbc:IssueTime>10:37:46-05:00</cbc:IssueTime>\n  <cac:SenderParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:SenderParty>\n  <cac:ReceiverParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="6" schemeName="31">901217437</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:ReceiverParty>\n  <cac:DocumentResponse>\n    <cac:Response>\n      <cbc:ResponseCode>02</cbc:ResponseCode>\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\n    </cac:Response>\n    <cac:DocumentReference>\n      <cbc:ID>FEVT144434</cbc:ID>\n      <cbc:UUID schemeName="CUFE-SHA384">c608be689a8ed3c81c3df535ec675d43614ef5d33f67caa3f368eb769fe4473d755e5fa008333968dfd51d1549fb31aa</cbc:UUID>\n    </cac:DocumentReference>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>1</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\n        <cbc:Description>0</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>2</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>3</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>4</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n  </cac:DocumentResponse>\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>02</cbc:ValidationResultCode><cbc:ValidationDate>2026-05-06</cbc:ValidationDate><cbc:ValidationTime>10:37:46-05:00</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-03 02:10:56.358422
9	13	xml_invoice	APC Mayorista, POB00041584.xml	\N	<?xml version="1.0" encoding="utf-8"?>\r\n<AttachedDocument xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2">\r\n\t<ext:UBLExtensions>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>VtYOCY//jYrhz94GGVO3o52/BiudNMgriLfDAGIMe4g=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref1" URI="#KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>4o0yJ7pOlsMplx0WLgN59x7COSgZv4hJ8pSog1fcyOw=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>wg9SZVWne+YBH95v7Ktg/L5XUGbBhJVQO3CTD347jxo=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-sigvalue">D0Z6ZzcZAPSHbQO5zYJRSegw+czjDkYCd1KNn4SjGnIdxnNNtzOx9/F3FQKeM3Y5GWz04eTVD8Hh+grE61vrWpeani6ID3kFduErIYkBis3rhe2GV6bHhwbNK5Vi/7DjIavikuv5CD8xO9SH/ZmLROAQKY2PsdviSiDyLFUaaYyjo/SuEwXhmkhRwFxG+Xv4/zA3bko0QT7WSTL12gKk4Zbcp/XjKjDmc9FeI4OOQgdnZq3aM+UIBrSL7nOLYtr3F1BTvrOJi8s+xxME86A1gvU1ib7wUOncNW6tZkq8PlC1/G3MzevSwO6hbxK846seW3cBSQK6xAMKhw08MNV8lw==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></ds:X509IssuerSerial><ds:X509SubjectName>C=CO, S=ANTIOQUIA, L=MEDELLÍN, O=PRINCIPAL, OU=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701, T=Emisor Factura Electronica - Persona Juridica, SERIALNUMBER=9007460544, CN=@PC MAYORISTA S.A.S., E=SERVICIOALCLIENTE@HGI.COM.CO, STREET=CL 16 CR 45 85</ds:X509SubjectName><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" Target="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><xades:SignedProperties Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-22T17:04:38.882-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>no+kgqKFeGb4NWUIHHK8cEsKyBfzedZeQUBYVKyEqL4=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD.,OU=Division de certificacion entidad final,CN=CA ANDES SCD S.A. Clase II,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>Cs7emRwtXWVYHJrqS9eXEXfUcFyJJBqFhDFOetHu8ts=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>3184328748892787122</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>RLYziy/D+T4pgDLc65EboYLzIoC/iYCwrOCGzGo/MO0=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>6218172215901586992</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t</ext:UBLExtensions>\r\n\t<cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n\t<cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID>\r\n\t<cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID>\r\n\t<cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n\t<cbc:ID>POB415840</cbc:ID>\r\n\t<cbc:IssueDate>2026-05-22</cbc:IssueDate>\r\n\t<cbc:IssueTime>22:07:37-05:00</cbc:IssueTime>\r\n\t<cbc:DocumentTypeCode>Contenedor de Factura Electrónica</cbc:DocumentTypeCode>\r\n\t<cbc:ParentDocumentID>POB41584</cbc:ParentDocumentID>\r\n\t<cac:SenderParty>\r\n\t\t<cac:PartyTaxScheme>\r\n\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t<cbc:TaxLevelCode listName="2">R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t<cac:TaxScheme>\r\n\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t</cac:TaxScheme>\r\n\t\t</cac:PartyTaxScheme>\r\n\t</cac:SenderParty>\r\n\t<cac:ReceiverParty>\r\n\t\t<cac:PartyTaxScheme>\r\n\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t<cbc:TaxLevelCode listName="1">R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t<cac:TaxScheme>\r\n\t\t\t\t<cbc:ID>ZZ</cbc:ID>\r\n\t\t\t\t<cbc:Name>No aplica</cbc:Name>\r\n\t\t\t</cac:TaxScheme>\r\n\t\t</cac:PartyTaxScheme>\r\n\t</cac:ReceiverParty>\r\n\t<cac:Attachment>\r\n\t\t<cac:ExternalReference>\r\n\t\t\t<cbc:MimeCode>text/xml</cbc:MimeCode>\r\n\t\t\t<cbc:EncodingCode>UTF-8</cbc:EncodingCode>\r\n\t\t\t<cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8"?>\r\n<Invoice xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">\r\n\t<ext:UBLExtensions>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent>\r\n\t\t\t\t<sts:DianExtensions xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1">\r\n\t\t\t\t\t<sts:InvoiceControl>\r\n\t\t\t\t\t\t<sts:InvoiceAuthorization>18764098255081</sts:InvoiceAuthorization>\r\n\t\t\t\t\t\t<sts:AuthorizationPeriod>\r\n\t\t\t\t\t\t\t<cbc:StartDate>2025-09-05</cbc:StartDate>\r\n\t\t\t\t\t\t\t<cbc:EndDate>2027-09-05</cbc:EndDate>\r\n\t\t\t\t\t\t</sts:AuthorizationPeriod>\r\n\t\t\t\t\t\t<sts:AuthorizedInvoices>\r\n\t\t\t\t\t\t\t<sts:Prefix>POB</sts:Prefix>\r\n\t\t\t\t\t\t\t<sts:From>37973</sts:From>\r\n\t\t\t\t\t\t\t<sts:To>100000</sts:To>\r\n\t\t\t\t\t\t</sts:AuthorizedInvoices>\r\n\t\t\t\t\t</sts:InvoiceControl>\r\n\t\t\t\t\t<sts:InvoiceSource>\r\n\t\t\t\t\t\t<cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n\t\t\t\t\t</sts:InvoiceSource>\r\n\t\t\t\t\t<sts:SoftwareProvider>\r\n\t\t\t\t\t\t<sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">811021438</sts:ProviderID>\r\n\t\t\t\t\t\t<sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">def923e2-8326-42e2-a022-d0fa4a2f8188</sts:SoftwareID>\r\n\t\t\t\t\t</sts:SoftwareProvider>\r\n\t\t\t\t\t<sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">0733f1d365cccdf3f93401e86ffc819de4cdccc69761cca54760b120bdba8b0c360a57c668b2a82d52a7f8103022d48d</sts:SoftwareSecurityCode>\r\n\t\t\t\t\t<sts:AuthorizationProvider>\r\n\t\t\t\t\t\t<sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID>\r\n\t\t\t\t\t</sts:AuthorizationProvider>\r\n\t\t\t\t\t<sts:QRCode>https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=252c1dc63de434f9a48d60c764360a8ae26104e72974ecb709baa19d720f5bbdba70f44d0dafdaea1f787c9ad0d23e65</sts:QRCode>\r\n\t\t\t\t</sts:DianExtensions>\r\n\t\t\t</ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>X40Sbgb8TjeW+tTRP9ceuZEkHV9afVJ/MefF18+PUuc=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref1" URI="#KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>myqPbIAsspfTO7SjX/SJ291aSjYwWZSaX0GLcbwDoAA=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>kAkKMiq4tymYjBVGc7AR7/1HmFMBODNtE6ygjUjHRY8=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-sigvalue">CkTX0thyToQ41iLDYW1QW0NjJrN69aGqeXS5xBgKfsrZd7YP0E+XuZgXsDfOxXvhoeexLMkQQ7e5ZCwDX3zyAMBtgu+/Xnzfe/hNwn4ng+zf33lQe3tG2z4l1uo6qrK7tvEKS1N+/4m1qdAFxLbo3KK5v9i0I++mVijhmjwH4Ntc0JDpIlVo+v8gy1gne4m/xzdpCFG0J0Yt4BIEp/9DpRyqByUAwysymFBW9eJmdtjt58AkptYBh//6djNU9nM0aa5mziXE3iEaTWfu3MQrAreyikYkovVOh2//FVqgjrAc++ohlRC2L6UhKrz9sDDtwW3x/WgMP4VcrHfoOR5gIA==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></ds:X509IssuerSerial><ds:X509SubjectName>C=CO, S=ANTIOQUIA, L=MEDELLÍN, O=PRINCIPAL, OU=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701, T=Emisor Factura Electronica - Persona Juridica, SERIALNUMBER=9007460544, CN=@PC MAYORISTA S.A.S., E=SERVICIOALCLIENTE@HGI.COM.CO, STREET=CL 16 CR 45 85</ds:X509SubjectName><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" Target="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><xades:SignedProperties Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-22T17:04:37.726-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>no+kgqKFeGb4NWUIHHK8cEsKyBfzedZeQUBYVKyEqL4=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD.,OU=Division de certificacion entidad final,CN=CA ANDES SCD S.A. Clase II,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>Cs7emRwtXWVYHJrqS9eXEXfUcFyJJBqFhDFOetHu8ts=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>3184328748892787122</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>RLYziy/D+T4pgDLc65EboYLzIoC/iYCwrOCGzGo/MO0=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>6218172215901586992</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t</ext:UBLExtensions>\r\n\t<cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n\t<cbc:CustomizationID>10</cbc:CustomizationID>\r\n\t<cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID>\r\n\t<cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n\t<cbc:ID>POB41584</cbc:ID>\r\n\t<cbc:UUID schemeID="1" schemeName="CUFE-SHA384">252c1dc63de434f9a48d60c764360a8ae26104e72974ecb709baa19d720f5bbdba70f44d0dafdaea1f787c9ad0d23e65</cbc:UUID>\r\n\t<cbc:IssueDate>2026-05-22</cbc:IssueDate>\r\n\t<cbc:IssueTime>14:59:10-05:00</cbc:IssueTime>\r\n\t<cbc:DueDate>2026-05-23</cbc:DueDate>\r\n\t<cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>\r\n\t<cbc:Note> 18764098255081 de 2025-09-05 del POB-37973 al POB-100000</cbc:Note>\r\n\t<cbc:Note>Transferencia</cbc:Note>\r\n\t<cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>\r\n\t<cbc:LineCountNumeric>1</cbc:LineCountNumeric>\r\n\t<cac:InvoicePeriod>\r\n\t\t<cbc:StartDate>2026-05-01</cbc:StartDate>\r\n\t\t<cbc:EndDate>2026-05-31</cbc:EndDate>\r\n\t</cac:InvoicePeriod>\r\n\t<cac:OrderReference>\r\n\t\t<cbc:ID>0</cbc:ID>\r\n\t</cac:OrderReference>\r\n\t<cac:DespatchDocumentReference>\r\n\t\t<cbc:ID>0</cbc:ID>\r\n\t</cac:DespatchDocumentReference>\r\n\t<cac:AccountingSupplierParty>\r\n\t\t<cbc:AdditionalAccountID schemeAgencyID="195">1</cbc:AdditionalAccountID>\r\n\t\t<cac:Party>\r\n\t\t\t<cbc:IndustryClassificationCode>4652</cbc:IndustryClassificationCode>\r\n\t\t\t<cac:PartyName>\r\n\t\t\t\t<cbc:Name>@PC MAYORISTA S.A.S</cbc:Name>\r\n\t\t\t</cac:PartyName>\r\n\t\t\t<cac:PhysicalLocation>\r\n\t\t\t\t<cac:Address>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>050001</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CRA 51 51 17 ED HENRY LOCAL 210</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:Address>\r\n\t\t\t</cac:PhysicalLocation>\r\n\t\t\t<cac:PartyTaxScheme>\r\n\t\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t\t<cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t\t<cac:RegistrationAddress>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>050001</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CRA 51 51 17 ED HENRY LOCAL 210</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:RegistrationAddress>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:PartyTaxScheme>\r\n\t\t\t<cac:PartyLegalEntity>\r\n\t\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t\t<cac:CorporateRegistrationScheme>\r\n\t\t\t\t\t<cbc:ID>POB</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>0</cbc:Name>\r\n\t\t\t\t</cac:CorporateRegistrationScheme>\r\n\t\t\t</cac:PartyLegalEntity>\r\n\t\t\t<cac:Contact>\r\n\t\t\t\t<cbc:Telephone>5116179</cbc:Telephone>\r\n\t\t\t\t<cbc:ElectronicMail>facturacion.electronica@apcmayorista.com</cbc:ElectronicMail>\r\n\t\t\t</cac:Contact>\r\n\t\t</cac:Party>\r\n\t</cac:AccountingSupplierParty>\r\n\t<cac:AccountingCustomerParty>\r\n\t\t<cbc:AdditionalAccountID>2</cbc:AdditionalAccountID>\r\n\t\t<cac:Party>\r\n\t\t\t<cac:PartyIdentification>\r\n\t\t\t\t<cbc:ID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)">71271339</cbc:ID>\r\n\t\t\t</cac:PartyIdentification>\r\n\t\t\t<cac:PartyName>\r\n\t\t\t\t<cbc:Name>BENTHAN MUNERA ANDRES</cbc:Name>\r\n\t\t\t</cac:PartyName>\r\n\t\t\t<cac:PhysicalLocation>\r\n\t\t\t\t<cac:Address>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>055410</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CL 42 A 55 A 15</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:Address>\r\n\t\t\t</cac:PhysicalLocation>\r\n\t\t\t<cac:PartyTaxScheme>\r\n\t\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t\t<cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t\t<cac:RegistrationAddress>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>055410</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CL 42 A 55 A 15</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:RegistrationAddress>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>ZZ</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>No aplica</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:PartyTaxScheme>\r\n\t\t\t<cac:PartyLegalEntity>\r\n\t\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t\t<cac:CorporateRegistrationScheme>\r\n\t\t\t\t\t<cbc:Name>0</cbc:Name>\r\n\t\t\t\t</cac:CorporateRegistrationScheme>\r\n\t\t\t</cac:PartyLegalEntity>\r\n\t\t\t<cac:Contact>\r\n\t\t\t\t<cbc:Telephone>3715726</cbc:Telephone>\r\n\t\t\t\t<cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail>\r\n\t\t\t</cac:Contact>\r\n\t\t\t<cac:Person>\r\n\t\t\t\t<cbc:FirstName>ANDRES</cbc:FirstName>\r\n\t\t\t\t<cbc:FamilyName>BENTHAN MUNERA</cbc:FamilyName>\r\n\t\t\t\t<cbc:MiddleName />\r\n\t\t\t</cac:Person>\r\n\t\t</cac:Party>\r\n\t</cac:AccountingCustomerParty>\r\n\t<cac:TaxRepresentativeParty>\r\n\t\t<cac:PartyIdentification>\r\n\t\t\t<cbc:ID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">811021438</cbc:ID>\r\n\t\t</cac:PartyIdentification>\r\n\t</cac:TaxRepresentativeParty>\r\n\t<cac:PaymentMeans>\r\n\t\t<cbc:ID>2</cbc:ID>\r\n\t\t<cbc:PaymentMeansCode>1</cbc:PaymentMeansCode>\r\n\t\t<cbc:PaymentDueDate>2026-05-23</cbc:PaymentDueDate>\r\n\t\t<cbc:PaymentID>12345</cbc:PaymentID>\r\n\t</cac:PaymentMeans>\r\n\t<cac:PaymentTerms>\r\n\t\t<cbc:ID>1</cbc:ID>\r\n\t\t<cbc:PaymentMeansID>1</cbc:PaymentMeansID>\r\n\t\t<cbc:Note>Cuota 1 de 1</cbc:Note>\r\n\t\t<cbc:Amount currencyID="COP">325000.00000</cbc:Amount>\r\n\t\t<cbc:PaymentDueDate>2026-05-23</cbc:PaymentDueDate>\r\n\t</cac:PaymentTerms>\r\n\t<cac:TaxTotal>\r\n\t\t<cbc:TaxAmount currencyID="COP">51890.76</cbc:TaxAmount>\r\n\t\t<cbc:RoundingAmount currencyID="COP">0.00</cbc:RoundingAmount>\r\n\t\t<cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator>\r\n\t\t<cac:TaxSubtotal>\r\n\t\t\t<cbc:TaxableAmount currencyID="COP">273109.24</cbc:TaxableAmount>\r\n\t\t\t<cbc:TaxAmount currencyID="COP">51890.76</cbc:TaxAmount>\r\n\t\t\t<cac:TaxCategory>\r\n\t\t\t\t<cbc:Percent>19.00</cbc:Percent>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:TaxCategory>\r\n\t\t</cac:TaxSubtotal>\r\n\t</cac:TaxTotal>\r\n\t<cac:LegalMonetaryTotal>\r\n\t\t<cbc:LineExtensionAmount currencyID="COP">273109.24</cbc:LineExtensionAmount>\r\n\t\t<cbc:TaxExclusiveAmount currencyID="COP">273109.24</cbc:TaxExclusiveAmount>\r\n\t\t<cbc:TaxInclusiveAmount currencyID="COP">325000.00</cbc:TaxInclusiveAmount>\r\n\t\t<cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount>\r\n\t\t<cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount>\r\n\t\t<cbc:PrepaidAmount currencyID="COP">0.00</cbc:PrepaidAmount>\r\n\t\t<cbc:PayableAmount currencyID="COP">325000.00</cbc:PayableAmount>\r\n\t</cac:LegalMonetaryTotal>\r\n\t<cac:InvoiceLine>\r\n\t\t<cbc:ID>1</cbc:ID>\r\n\t\t<cbc:Note>50026B768709CA5</cbc:Note>\r\n\t\t<cbc:InvoicedQuantity unitCode="94">1</cbc:InvoicedQuantity>\r\n\t\t<cbc:LineExtensionAmount currencyID="COP">273109.24</cbc:LineExtensionAmount>\r\n\t\t<cbc:FreeOfChargeIndicator>false</cbc:FreeOfChargeIndicator>\r\n\t\t<cac:TaxTotal>\r\n\t\t\t<cbc:TaxAmount currencyID="COP">51890.76</cbc:TaxAmount>\r\n\t\t\t<cbc:RoundingAmount currencyID="COP">0.00</cbc:RoundingAmount>\r\n\t\t\t<cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator>\r\n\t\t\t<cac:TaxSubtotal>\r\n\t\t\t\t<cbc:TaxableAmount currencyID="COP">273109.24</cbc:TaxableAmount>\r\n\t\t\t\t<cbc:TaxAmount currencyID="COP">51890.76</cbc:TaxAmount>\r\n\t\t\t\t<cac:TaxCategory>\r\n\t\t\t\t\t<cbc:Percent>19.00</cbc:Percent>\r\n\t\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t\t</cac:TaxScheme>\r\n\t\t\t\t</cac:TaxCategory>\r\n\t\t\t</cac:TaxSubtotal>\r\n\t\t</cac:TaxTotal>\r\n\t\t<cac:Item>\r\n\t\t\t<cbc:Description>DISCO SOLIDO KINGSTON M.2 PCI  EXPRESS NV3 500GB SNV3S/500G</cbc:Description>\r\n\t\t\t<cbc:AdditionalInformation>50026B768709CA5</cbc:AdditionalInformation>\r\n\t\t\t<cac:SellersItemIdentification>\r\n\t\t\t\t<cbc:ID>2410020</cbc:ID>\r\n\t\t\t</cac:SellersItemIdentification>\r\n\t\t\t<cac:StandardItemIdentification>\r\n\t\t\t\t<cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">2410020</cbc:ID>\r\n\t\t\t</cac:StandardItemIdentification>\r\n\t\t\t<cac:OriginAddress>\r\n\t\t\t\t<cbc:ID></cbc:ID>\r\n\t\t\t</cac:OriginAddress>\r\n\t\t</cac:Item>\r\n\t\t<cac:Price>\r\n\t\t\t<cbc:PriceAmount currencyID="COP">273109.24</cbc:PriceAmount>\r\n\t\t\t<cbc:BaseQuantity unitCode="94">1</cbc:BaseQuantity>\r\n\t\t</cac:Price>\r\n\t</cac:InvoiceLine>\r\n</Invoice>]]></cbc:Description>\r\n\t\t</cac:ExternalReference>\r\n\t</cac:Attachment>\r\n\t<cac:ParentDocumentLineReference>\r\n\t\t<cbc:LineID>1</cbc:LineID>\r\n\t\t<cac:DocumentReference>\r\n\t\t\t<cbc:ID>POB41584</cbc:ID>\r\n\t\t\t<cbc:UUID schemeName="CUFE-SHA384">252c1dc63de434f9a48d60c764360a8ae26104e72974ecb709baa19d720f5bbdba70f44d0dafdaea1f787c9ad0d23e65</cbc:UUID>\r\n\t\t\t<cbc:IssueDate>2026-05-22</cbc:IssueDate>\r\n\t\t\t<cbc:DocumentType>ApplicationResponse</cbc:DocumentType>\r\n\t\t\t<cac:Attachment>\r\n\t\t\t\t<cac:ExternalReference>\r\n\t\t\t\t\t<cbc:MimeCode>text/xml</cbc:MimeCode>\r\n\t\t\t\t\t<cbc:EncodingCode>UTF-8</cbc:EncodingCode>\r\n\t\t\t\t\t<cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\r\n  <ext:UBLExtensions>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent>\r\n        <sts:DianExtensions>\r\n          <sts:InvoiceSource>\r\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n          </sts:InvoiceSource>\r\n          <sts:SoftwareProvider>\r\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\r\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\r\n          </sts:SoftwareProvider>\r\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\r\n          <sts:AuthorizationProvider>\r\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\r\n          </sts:AuthorizationProvider>\r\n        </sts:DianExtensions>\r\n      </ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-27b02e3a-d8f7-450f-9e09-5344dd983505"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-1b2aee85-d64c-42fb-8cd4-2746832d1c5c" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>HID0rBf3qoUdg4H3wfajsnvfSSBcdBHOXFc0bODFN2c=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-27b02e3a-d8f7-450f-9e09-5344dd983505-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>niTOFo4XnoStGmrIKn/vdLQR1NRSSvXy3v0324mrmes=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-27b02e3a-d8f7-450f-9e09-5344dd983505-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>YB+Wma+6bYNOUfvTQFdo6xpqDsSYJzXUvqoIXnUbbyk=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-27b02e3a-d8f7-450f-9e09-5344dd983505">Pa3HOsZYGlqcAufq7Mn51+9UpRJ5lXrnDnaWHXfYvFE3S/1ikax+sc43SXB0kFE9k/S8R2tqG0YovTcipMNjZHrdYc/FguSrlBKUPIhEKhSFQFouO6XwbiqD5UyvCOwCFrlknvjUnMCkjNF7GFJSSvhUBcOWDKzSPPhnsOnW7KbO4TbllF4FfUYlzPokjuRsVfUTS467ItKwLHb2zXpNsb7sowd4g7y4YeEnatnPRqvCVT8hWHGOVwO9O82kwwufNB/IrpMjgSUyyetI5PbvR3KpZgx7Ngb6UQ1DIgja2nKj9g7APH8Ro0mRNXILnAmZ8SBOuuep43cSoT4hGZPncw==</ds:SignatureValue><ds:KeyInfo Id="Signature-27b02e3a-d8f7-450f-9e09-5344dd983505-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-5019d056-da14-4297-b621-81085e878854"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-6146a4df-ebae-4450-abc7-7559e0ee2042" Target="#Signature-27b02e3a-d8f7-450f-9e09-5344dd983505"><xades:SignedProperties Id="xmldsig-Signature-27b02e3a-d8f7-450f-9e09-5344dd983505-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-05-22T17:05:38+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-1b2aee85-d64c-42fb-8cd4-2746832d1c5c"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n  </ext:UBLExtensions>\r\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n  <cbc:CustomizationID>1</cbc:CustomizationID>\r\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\r\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n  <cbc:ID>55756848</cbc:ID>\r\n  <cbc:UUID schemeName="CUDE-SHA384">f926b5ca885439dce0b1c2731dca39ecd9aaa54a3ed91f0f2c954b14b8dd16bfa7880bfd9aa44db2b3263b2f834cbabc</cbc:UUID>\r\n  <cbc:IssueDate>2026-05-22</cbc:IssueDate>\r\n  <cbc:IssueTime>17:05:38-05:00</cbc:IssueTime>\r\n  <cac:SenderParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:SenderParty>\r\n  <cac:ReceiverParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">900746054</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:ReceiverParty>\r\n  <cac:DocumentResponse>\r\n    <cac:Response>\r\n      <cbc:ResponseCode>02</cbc:ResponseCode>\r\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\r\n    </cac:Response>\r\n    <cac:DocumentReference>\r\n      <cbc:ID>POB41584</cbc:ID>\r\n      <cbc:UUID schemeName="CUFE-SHA384">252c1dc63de434f9a48d60c764360a8ae26104e72974ecb709baa19d720f5bbdba70f44d0dafdaea1f787c9ad0d23e65</cbc:UUID>\r\n    </cac:DocumentReference>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>1</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\r\n        <cbc:Description>0</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>2</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\r\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>3</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>4</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n  </cac:DocumentResponse>\r\n</ApplicationResponse>]]></cbc:Description>\r\n\t\t\t\t</cac:ExternalReference>\r\n\t\t\t</cac:Attachment>\r\n\t\t\t<cac:ResultOfVerification>\r\n\t\t\t\t<cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID>\r\n\t\t\t\t<cbc:ValidationResultCode>02</cbc:ValidationResultCode>\r\n\t\t\t\t<cbc:ValidationDate>2026-05-22</cbc:ValidationDate>\r\n\t\t\t\t<cbc:ValidationTime>22:06:37-05:00</cbc:ValidationTime>\r\n\t\t\t</cac:ResultOfVerification>\r\n\t\t</cac:DocumentReference>\r\n\t</cac:ParentDocumentLineReference>\r\n</AttachedDocument>	\N	2026-07-03 10:16:34.493766
10	14	xml_invoice	VirtualTronic.xml	\N	<AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-09485bc8-6dcd-4d7d-b9cb-e2c2b0da02f6" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-09485bc8-6dcd-4d7d-b9cb-e2c2b0da02f6-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WwQ1xfTnTs30qpCNlceM2AQEK6HLWV6gXsvqsrGNic4=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-09485bc8-6dcd-4d7d-b9cb-e2c2b0da02f6-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>RKs7QuxysWtqoVdVWcgW/dSSYMjGHRGP7eT3QpPSu24=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-09485bc8-6dcd-4d7d-b9cb-e2c2b0da02f6-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>4KKW5zdnBZzGmPomsk11Vp/EnkphoAthStBXfF3nKHg=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>uuoEkymYrfA1I/w2Er2Nc6ey+MoLeV+dnl9uegmJWLzQPT8GO8yZJL4YBjHmvsKA1gonYYH6LDTvxSAIgAvGbn2BtNIAZD79t3DcaQeLxuyhkvC8DnJqCrq3OMmTVP3YnMLe1iIdsSVNUvh96ISDHmp+Ix1eH2VZ6OKyt7jXEjmVc9gFtCvL3AjUZzyWNLnvB99Aasm2OyEt5XOj/KegZ5uAQFoZLEEisq+5JtKb012DmdRHZY/RBQRWT4kBdi6WBV4YdL0jNweRGGnhuYAUgu6YEF5SukVPSzL7/nmnL6prOyVv9s2ScWUY5zfGy6jVVw0fqy54lqvSDaGgKrn3KQ==</ds:SignatureValue><ds:KeyInfo Id="id-09485bc8-6dcd-4d7d-b9cb-e2c2b0da02f6-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-09485bc8-6dcd-4d7d-b9cb-e2c2b0da02f6" Id="id-2a257812-b51b-460d-95de-33cc8f8843ef" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-09485bc8-6dcd-4d7d-b9cb-e2c2b0da02f6-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-01T15:19:34-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT147561</cbc:ID><cbc:IssueDate>2026-06-01</cbc:IssueDate><cbc:IssueTime>15:19:33-05:00</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>FEVT147561</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><sts:DianExtensions><sts:InvoiceControl><sts:InvoiceAuthorization>18764092754559</sts:InvoiceAuthorization><sts:AuthorizationPeriod><cbc:StartDate>2025-05-05</cbc:StartDate><cbc:EndDate>2027-05-05</cbc:EndDate></sts:AuthorizationPeriod><sts:AuthorizedInvoices><sts:Prefix>FEVT</sts:Prefix><sts:From>100001</sts:From><sts:To>1000000</sts:To></sts:AuthorizedInvoices></sts:InvoiceControl><sts:InvoiceSource><cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode></sts:InvoiceSource><sts:SoftwareProvider><sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="9" schemeName="31">810000630</sts:ProviderID><sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">06dbab9e-997b-4e16-a234-e48e27328c95</sts:SoftwareID></sts:SoftwareProvider><sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">20d55580db3dcde3b913b81924d709d038261109e88bd2e301d5fb7799b5608792247a1d76fccb247c72d9d542735336</sts:SoftwareSecurityCode><sts:AuthorizationProvider><sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID></sts:AuthorizationProvider><sts:QRCode>NroFactura=FEVT147561 NitFacturador=901217437 NitAdquiriente=71271339 FechaFactura=2026-06-01 HoraFactura=15:19:33-05:00 ValorFactura=71428.57 ValorIVA=13571.43 ValorOtrosImpuestos=0.00 ValorTotalFactura=85000.00 CUFE=https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=8e26743c27deda2444bdef34857ab405e5a201b2f9af71c758da1aab9612e81522bf8df33f0db714ccf8aa560213ea54</sts:QRCode></sts:DianExtensions></ext:ExtensionContent></ext:UBLExtension><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-155d87af-4047-4f3b-9ee1-9795ab74e8c7" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-155d87af-4047-4f3b-9ee1-9795ab74e8c7-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>KKX21H/hOtZYwPJNqiDg6sugjtOSnEikplePrZ6nE7M=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-155d87af-4047-4f3b-9ee1-9795ab74e8c7-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>9mRgcPN6hx4+wSrgS4U0bzqJMmF4sGz8mkqDS3rqh8w=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-155d87af-4047-4f3b-9ee1-9795ab74e8c7-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>Aw9FGrwzBix05wI0mG23WORq2dGuZtysq42lFpNt74Y=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>MCOBjJS4t29iaPQiumJA1D9IM6vGgJZtGKrU1EOstIsDCsEzR0es3SsBzoIfQ4b87VtRSR971OlQDbS60SIfZkBvstmoT2a2PcuB+/j8AUGfqdsDjq5/a6OCtZeYcH7pgfDJc963imyBMtLAFKvHHs5819ZUKiFBBZK0d93fyb5sVDaQikP98zT8bgnupZHbTvud9omrHHNg+AxeZFBP9uo/BWGJ31eF7quAUGqU23FB/H5VjDjooaVsv9JQ/Yl5uJZ65giDsjRUfNIsPISSQZc/1Fzx8D2cMDsyWgka/xa4NS5ueopAvvMxWaV0R+cnh5oQw7z0579eAQqlKU06lQ==</ds:SignatureValue><ds:KeyInfo Id="id-155d87af-4047-4f3b-9ee1-9795ab74e8c7-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-155d87af-4047-4f3b-9ee1-9795ab74e8c7" Id="id-56e8e9e8-8bf1-41bb-81c1-b18d9eb91ec5" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-155d87af-4047-4f3b-9ee1-9795ab74e8c7-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-01T15:19:33-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>10</cbc:CustomizationID><cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT147561</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">8e26743c27deda2444bdef34857ab405e5a201b2f9af71c758da1aab9612e81522bf8df33f0db714ccf8aa560213ea54</cbc:UUID><cbc:IssueDate>2026-06-01</cbc:IssueDate><cbc:IssueTime>15:19:33-05:00</cbc:IssueTime><cbc:DueDate>2026-06-01</cbc:DueDate><cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode><cbc:Note>Persona jurídica y asimiladas, Régimen ordinario de tributación, Responsable impuesto a las ventas, Agente retenedor (puede practicar retención) y Autorretención de renta (autorretención 0.55%\rFactura de CONTADO: Efectivo.\r</cbc:Note><cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>1</cbc:LineCountNumeric><cac:AccountingSupplierParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cbc:IndustryClassificationCode>4741</cbc:IndustryClassificationCode><cac:PartyName><cbc:Name>VIRTUAL TRONIC SAS</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>FEVT</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:Telephone>604 431 0339</cbc:Telephone><cbc:ElectronicMail>info@virtualtronic.com.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cbc:AdditionalAccountID>2</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID schemeName="13">71271339</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name><cbc:Telephone>3134850115</cbc:Telephone><cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cac:DeliveryAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>05360</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:DeliveryAddress></cac:Delivery><cac:PaymentMeans><cbc:ID>1</cbc:ID><cbc:PaymentMeansCode>10</cbc:PaymentMeansCode><cbc:PaymentID>1</cbc:PaymentID></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="COP">13571.43</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">71428.57</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">13571.43</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">71428.57</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="COP">71428.57</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="COP">85000.00</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount><cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount><cbc:PrepaidAmount currencyID="COP">0.00</cbc:PrepaidAmount><cbc:PayableAmount currencyID="COP">85000.00</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="WSD">1.0000</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="COP">71428.57</cbc:LineExtensionAmount><cac:PricingReference><cac:AlternativeConditionPrice><cbc:PriceAmount currencyID="COP">85000.00</cbc:PriceAmount><cbc:PriceTypeCode/></cac:AlternativeConditionPrice></cac:PricingReference><cac:TaxTotal><cbc:TaxAmount currencyID="COP">13571.43</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">71428.57</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">13571.43</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Bateria Hp HT03 11.4V 3600mAh 41Wh</cbc:Description><cbc:PackSizeNumeric>0.00</cbc:PackSizeNumeric><cbc:BrandName>Hp/Compaq</cbc:BrandName><cac:SellersItemIdentification><cbc:ID>HPP HT03-3S1P</cbc:ID><cbc:ExtendedID/></cac:SellersItemIdentification><cac:StandardItemIdentification><cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">BHP-055</cbc:ID></cac:StandardItemIdentification></cac:Item><cac:Price><cbc:PriceAmount currencyID="COP">71428.57</cbc:PriceAmount><cbc:BaseQuantity unitCode="WSD">1.00</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>FEVT147561</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">8e26743c27deda2444bdef34857ab405e5a201b2f9af71c758da1aab9612e81522bf8df33f0db714ccf8aa560213ea54</cbc:UUID><cbc:IssueDate>2026-06-01</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\n  <ext:UBLExtensions>\n    <ext:UBLExtension>\n      <ext:ExtensionContent>\n        <sts:DianExtensions>\n          <sts:InvoiceSource>\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\n          </sts:InvoiceSource>\n          <sts:SoftwareProvider>\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\n          </sts:SoftwareProvider>\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\n          <sts:AuthorizationProvider>\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\n          </sts:AuthorizationProvider>\n        </sts:DianExtensions>\n      </ext:ExtensionContent>\n    </ext:UBLExtension>\n    <ext:UBLExtension>\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-bf3ffecf-964a-419b-9ef2-9e916b7cf69f"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="Reference-cb71958f-8a9a-4898-90dc-f259a0a8fd16" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>1GPBWXBPUMZ7uhf3dvYvdED6I1Npp4al/2si4hP4Gns=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-bf3ffecf-964a-419b-9ef2-9e916b7cf69f-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>wIuXaVDtqY3Yq5GvoEy84r0/kWpRJkEnJC9XKrjoekg=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-bf3ffecf-964a-419b-9ef2-9e916b7cf69f-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>irSQTsBTlQsSAvRBPZPvZR6wEhgBvYzXl/NXH0vmePs=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-bf3ffecf-964a-419b-9ef2-9e916b7cf69f">Mj6qFGn+9HBLc7AnosiLnCKcwuQANt+5Eij16PK5MfJTza2Y27iQa9pvYpysS39h404beqdh11K2I2ENOKLgYQrrxu992iJNj/T3oT+Lhep76FPUC3w4KhDtqHSCUFRxoJfQm3AkJF9r2TnxhiynlOvNORfZyJsDqB6OMBAJ7zgc+44+2SrCwh87s6OPIfJGgi9aclm9bvt9bqGaQ+aUx6Ed6Pb56Gr5Ylu5Mc06NfnxxkNhrwZv+DDpB+mpRuo7CeZGgqBnJhW4kWgfK1oaLDkBTu3LJ7WRDmCFpYAMcwbb4nLsJIdRPSgLaekHFzClGv81A3E5la5ENW2GBWQ1pg==</ds:SignatureValue><ds:KeyInfo Id="Signature-bf3ffecf-964a-419b-9ef2-9e916b7cf69f-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-4e047d2c-4344-40b3-9afd-7f0b1743f39c"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-02419ec6-5d3e-465b-9dda-9ee2509055ab" Target="#Signature-bf3ffecf-964a-419b-9ef2-9e916b7cf69f"><xades:SignedProperties Id="xmldsig-Signature-bf3ffecf-964a-419b-9ef2-9e916b7cf69f-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-01T15:19:33+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description/></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-cb71958f-8a9a-4898-90dc-f259a0a8fd16"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\n    </ext:UBLExtension>\n  </ext:UBLExtensions>\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n  <cbc:CustomizationID>1</cbc:CustomizationID>\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n  <cbc:ID>11141782</cbc:ID>\n  <cbc:UUID schemeName="CUDE-SHA384">a60e6f3472a1cea72882da21ef38245c3a1f91a02c24e1a24424d5d89856d3a58f6dd98134adace6898cfc88987d9d52</cbc:UUID>\n  <cbc:IssueDate>2026-06-01</cbc:IssueDate>\n  <cbc:IssueTime>15:19:33-05:00</cbc:IssueTime>\n  <cac:SenderParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:SenderParty>\n  <cac:ReceiverParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="6" schemeName="31">901217437</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:ReceiverParty>\n  <cac:DocumentResponse>\n    <cac:Response>\n      <cbc:ResponseCode>02</cbc:ResponseCode>\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\n    </cac:Response>\n    <cac:DocumentReference>\n      <cbc:ID>FEVT147561</cbc:ID>\n      <cbc:UUID schemeName="CUFE-SHA384">8e26743c27deda2444bdef34857ab405e5a201b2f9af71c758da1aab9612e81522bf8df33f0db714ccf8aa560213ea54</cbc:UUID>\n    </cac:DocumentReference>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>1</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\n        <cbc:Description>0</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>2</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAW05</cbc:ResponseCode>\n        <cbc:Description>El valor de campo PriceTypeCode no se encuentra en la lista</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>3</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>4</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>5</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n  </cac:DocumentResponse>\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>02</cbc:ValidationResultCode><cbc:ValidationDate>2026-06-01</cbc:ValidationDate><cbc:ValidationTime>15:19:33-05:00</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-03 10:19:19.089725
11	15	xml_invoice	VirtualTronic, FEVT147752.xml	\N	<AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-642a2054-82c3-4396-b09c-dd04b0e06673" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-642a2054-82c3-4396-b09c-dd04b0e06673-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>lezqd2702q3qYrz801EdTS4I8Z6kU0ugvsoDNI4spSk=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-642a2054-82c3-4396-b09c-dd04b0e06673-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>cxMFVNIvo7SQqyKB4Ovna5GDL+iyNolsHhYTiHFlUXg=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-642a2054-82c3-4396-b09c-dd04b0e06673-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>UWsuf4x8Un/bqO64TFo33giORH5bRizPLYvchfxzubM=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>ERqSJKOgEDHG+jFms5BJm+E5KmA4W6EQqDchEkHxBTfBHko430xjyKsKQN1gfdJ52aZT8MUcltM06ip0c9Vfs5E8MMcyMokzyFrGYqE4AttsNZIMWNTdlXgy/v395gNA1asjY7Dag8DUAUu8xr5jvMqykiPLvPs/+lCktvituxBMR4eUnbxz6bUdmwl0pChl2R7QoITbfjy3riSBNRj7saou+irp5l8aHNPPvOq7AjyNw422TqLTeicXC9egDiZ60+Zbm2ijSxjD43WH+4R+AJ+u1R1bYcACamcSfm8jKG26368DYCx+9EauXfUNL3pQtjnaawafNaAMwMO6C3SKGw==</ds:SignatureValue><ds:KeyInfo Id="id-642a2054-82c3-4396-b09c-dd04b0e06673-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-642a2054-82c3-4396-b09c-dd04b0e06673" Id="id-fe4ca62f-3220-46bc-9214-b21aa2fd95de" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-642a2054-82c3-4396-b09c-dd04b0e06673-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-02T16:16:33-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT147752</cbc:ID><cbc:IssueDate>2026-06-02</cbc:IssueDate><cbc:IssueTime>16:16:32-05:00</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>FEVT147752</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><sts:DianExtensions><sts:InvoiceControl><sts:InvoiceAuthorization>18764092754559</sts:InvoiceAuthorization><sts:AuthorizationPeriod><cbc:StartDate>2025-05-05</cbc:StartDate><cbc:EndDate>2027-05-05</cbc:EndDate></sts:AuthorizationPeriod><sts:AuthorizedInvoices><sts:Prefix>FEVT</sts:Prefix><sts:From>100001</sts:From><sts:To>1000000</sts:To></sts:AuthorizedInvoices></sts:InvoiceControl><sts:InvoiceSource><cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode></sts:InvoiceSource><sts:SoftwareProvider><sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="9" schemeName="31">810000630</sts:ProviderID><sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">06dbab9e-997b-4e16-a234-e48e27328c95</sts:SoftwareID></sts:SoftwareProvider><sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">e72cb4422b15cce15e67d7a674cbdb8abf2c69ba358d88393ad36c05cafb1770aaf89f33e8076e09c9b3c2138597ad92</sts:SoftwareSecurityCode><sts:AuthorizationProvider><sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID></sts:AuthorizationProvider><sts:QRCode>NroFactura=FEVT147752 NitFacturador=901217437 NitAdquiriente=71271339 FechaFactura=2026-06-02 HoraFactura=16:16:32-05:00 ValorFactura=29411.76 ValorIVA=5588.24 ValorOtrosImpuestos=0.00 ValorTotalFactura=35000.00 CUFE=https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=0505435b9e58740f60120f5b6f277bf2cb3fbf3dc0e816640fb2eb07f12ed531879d5df8ce6d43408b94dded0785e6b8</sts:QRCode></sts:DianExtensions></ext:ExtensionContent></ext:UBLExtension><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-09fc0ce2-2d3a-4725-9aa2-ab686bf7226c" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-09fc0ce2-2d3a-4725-9aa2-ab686bf7226c-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>r2Ronh/SDQpWT0rNYRamf11TtCEoBHmgAB4MbbZpxAM=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-09fc0ce2-2d3a-4725-9aa2-ab686bf7226c-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>+V6ncjtHEGFDgc8o3dGqx1uqmTZ/kenmnps+Ah5T9JM=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-09fc0ce2-2d3a-4725-9aa2-ab686bf7226c-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>QyktVVtwgMZreaFLvivJ6C8AAyd9YmI1JLr5s4WH5/o=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>WW5BRfeLwAga8qHFhN0SUK+S/p7m7O5LtDnpYGQU1R4d5PnCBGDn1IGYM5bUGKjg/O9NvhPjmqWyiwlC6D8XsrIHRPVPttAGyr4Trac8Da2x+ozilJAgfy2hHmdEmfHrQZ9Iz9YBUDlDgtfyC+Xgkmi73L8Nj0qEdXYAevNAwYJB7RiwC+PolC6/8FbhrOqShihJU47C2MLoJFiB5jUvwXIQAbUdv3xTQN9l2iIXWzRVdxXLeupcHV11WVKWROVXh7oypLlZTe0ukuCirrV7bnJjjlG6IkP23jJfD+1xLZ1AcWqDhXdg0XFw1jsfJtj0PeQfe7JUSysJzDZfvjhUTQ==</ds:SignatureValue><ds:KeyInfo Id="id-09fc0ce2-2d3a-4725-9aa2-ab686bf7226c-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-09fc0ce2-2d3a-4725-9aa2-ab686bf7226c" Id="id-a0594460-c9cc-48be-b72a-3753dd5d568e" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-09fc0ce2-2d3a-4725-9aa2-ab686bf7226c-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-02T16:16:32-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>10</cbc:CustomizationID><cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT147752</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">0505435b9e58740f60120f5b6f277bf2cb3fbf3dc0e816640fb2eb07f12ed531879d5df8ce6d43408b94dded0785e6b8</cbc:UUID><cbc:IssueDate>2026-06-02</cbc:IssueDate><cbc:IssueTime>16:16:32-05:00</cbc:IssueTime><cbc:DueDate>2026-06-02</cbc:DueDate><cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode><cbc:Note>Persona jurídica y asimiladas, Régimen ordinario de tributación, Responsable impuesto a las ventas, Agente retenedor (puede practicar retención) y Autorretención de renta (autorretención 0.55%\rFactura de CONTADO: Efectivo.\r</cbc:Note><cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>1</cbc:LineCountNumeric><cac:AccountingSupplierParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cbc:IndustryClassificationCode>4741</cbc:IndustryClassificationCode><cac:PartyName><cbc:Name>VIRTUAL TRONIC SAS</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>FEVT</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:Telephone>604 431 0339</cbc:Telephone><cbc:ElectronicMail>info@virtualtronic.com.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cbc:AdditionalAccountID>2</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID schemeName="13">71271339</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name><cbc:Telephone>3134850115</cbc:Telephone><cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cac:DeliveryAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>05360</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:DeliveryAddress></cac:Delivery><cac:PaymentMeans><cbc:ID>1</cbc:ID><cbc:PaymentMeansCode>10</cbc:PaymentMeansCode><cbc:PaymentID>1</cbc:PaymentID></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="COP">5588.24</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">29411.76</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">5588.24</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">29411.76</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="COP">29411.76</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="COP">35000.00</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount><cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount><cbc:PrepaidAmount currencyID="COP">0.00</cbc:PrepaidAmount><cbc:PayableAmount currencyID="COP">35000.00</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="WSD">1.0000</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="COP">29411.76</cbc:LineExtensionAmount><cac:PricingReference><cac:AlternativeConditionPrice><cbc:PriceAmount currencyID="COP">35000.00</cbc:PriceAmount><cbc:PriceTypeCode/></cac:AlternativeConditionPrice></cac:PricingReference><cac:TaxTotal><cbc:TaxAmount currencyID="COP">5588.24</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">29411.76</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">5588.24</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Hub Tipo C con adaptador USB, 8 en 1 ORICO-YSA8-U3-GY-BP</cbc:Description><cbc:PackSizeNumeric>0.00</cbc:PackSizeNumeric><cbc:BrandName>ORICO</cbc:BrandName><cac:SellersItemIdentification><cbc:ID>ORICO-YSA8-U3-GY-BP</cbc:ID><cbc:ExtendedID/></cac:SellersItemIdentification><cac:StandardItemIdentification><cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">4080</cbc:ID></cac:StandardItemIdentification></cac:Item><cac:Price><cbc:PriceAmount currencyID="COP">29411.76</cbc:PriceAmount><cbc:BaseQuantity unitCode="WSD">1.00</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>FEVT147752</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">0505435b9e58740f60120f5b6f277bf2cb3fbf3dc0e816640fb2eb07f12ed531879d5df8ce6d43408b94dded0785e6b8</cbc:UUID><cbc:IssueDate>2026-06-02</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\n  <ext:UBLExtensions>\n    <ext:UBLExtension>\n      <ext:ExtensionContent>\n        <sts:DianExtensions>\n          <sts:InvoiceSource>\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\n          </sts:InvoiceSource>\n          <sts:SoftwareProvider>\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\n          </sts:SoftwareProvider>\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\n          <sts:AuthorizationProvider>\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\n          </sts:AuthorizationProvider>\n        </sts:DianExtensions>\n      </ext:ExtensionContent>\n    </ext:UBLExtension>\n    <ext:UBLExtension>\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-c867cba8-d6a1-43f9-b24f-11e038d43959"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="Reference-ff7f71c5-2467-4336-b06e-77900abdb6f8" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>rgWeNrWWXJ1NTS4YIACMZfhQtplMz/h/uesxfSmS0Lg=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-c867cba8-d6a1-43f9-b24f-11e038d43959-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>lh/8x8jIcej2veCkcFnEGZEroo46XAwC+gF3fWGvQpU=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-c867cba8-d6a1-43f9-b24f-11e038d43959-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>qTPNdVMRMTiyvG0Gu/Xbn/Otuu+otm1Vl3Sjyr6BXyI=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-c867cba8-d6a1-43f9-b24f-11e038d43959">Yue3rNypNwQHBdWhP3RJTosyNXKEXax9Zlia8A98N3UAOKBuCg4oxl9/7JBK8Qw9ZM2FPuqn5eIV5IvXOOiUKa9NuSg0Si18XEvfnLo4mT/aaANgktl8+QYT0QQmnu9jvW7qgFfR6FFS0zApWW0EoC+38W0bsGXLg+OmfaYHvcc4J+Vn2WEeN7M9fVvJcdQY+vtmb/sbeoaY1Rs17i3cXZCo8FxRnpXeKXMBP+gdgJg0ozgXkCLIWeZeopcfMfiFisFouO9Tz4QPYLTyxwvDvSKGLQ+9+jChQnAHMjWJxQu0LUGpRtn0xfI6CM///iYpCr4m7RdlkQa1wUZpN/qQQA==</ds:SignatureValue><ds:KeyInfo Id="Signature-c867cba8-d6a1-43f9-b24f-11e038d43959-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-91713a47-bbf4-4e90-baa0-eb7f9496f09d"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-e426f0b0-24ef-411e-9eb7-77e10ea483ba" Target="#Signature-c867cba8-d6a1-43f9-b24f-11e038d43959"><xades:SignedProperties Id="xmldsig-Signature-c867cba8-d6a1-43f9-b24f-11e038d43959-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-02T16:16:33+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description/></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-ff7f71c5-2467-4336-b06e-77900abdb6f8"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\n    </ext:UBLExtension>\n  </ext:UBLExtensions>\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n  <cbc:CustomizationID>1</cbc:CustomizationID>\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n  <cbc:ID>98669151</cbc:ID>\n  <cbc:UUID schemeName="CUDE-SHA384">2ef695f0047676ff84f5af93e370842e26ffbbb454ae7c9688fa7a6bbb4a8c6a9f5b9767f5ee108c0f7f7ac7dc564eaa</cbc:UUID>\n  <cbc:IssueDate>2026-06-02</cbc:IssueDate>\n  <cbc:IssueTime>16:16:33-05:00</cbc:IssueTime>\n  <cac:SenderParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:SenderParty>\n  <cac:ReceiverParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="6" schemeName="31">901217437</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:ReceiverParty>\n  <cac:DocumentResponse>\n    <cac:Response>\n      <cbc:ResponseCode>02</cbc:ResponseCode>\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\n    </cac:Response>\n    <cac:DocumentReference>\n      <cbc:ID>FEVT147752</cbc:ID>\n      <cbc:UUID schemeName="CUFE-SHA384">0505435b9e58740f60120f5b6f277bf2cb3fbf3dc0e816640fb2eb07f12ed531879d5df8ce6d43408b94dded0785e6b8</cbc:UUID>\n    </cac:DocumentReference>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>1</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\n        <cbc:Description>0</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>2</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAW05</cbc:ResponseCode>\n        <cbc:Description>El valor de campo PriceTypeCode no se encuentra en la lista</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>3</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>4</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>5</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n  </cac:DocumentResponse>\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>02</cbc:ValidationResultCode><cbc:ValidationDate>2026-06-02</cbc:ValidationDate><cbc:ValidationTime>16:16:33-05:00</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-03 10:23:59.279011
12	16	xml_invoice	Claro - Junio.xml	\N	<?xml version="1.0" encoding="utf-8"?><AttachedDocument xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="xmldsig-39bfd2a1-6355-4ed0-81ba-68072c929992" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-39bfd2a1-6355-4ed0-81ba-68072c929992-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>6pRgmo99Wvjo5ni4pI48SmQ6Ha+53t4f0fyHqsXAIco=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-39bfd2a1-6355-4ed0-81ba-68072c929992-ref1" URI="#KeyInfo"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>V5OjMdINAS3t9ym2Pceb/nZlIoRk7yT3TKDkw2PF/Ic=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-39bfd2a1-6355-4ed0-81ba-68072c929992-ref2" URI="#SignedPropertiesId" Type="http://uri.etsi.org/01903#SignedProperties"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>uzWKWOhr5lvV6yWf/KZ+VHPNYc0aTuLE9yAqxdRKftE=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>ZciWGIFJ9XhGR+sx6tmteD4y4/uSoUB2mUkmIWTIsBw5doxIjtlzpVTvimk+Kfwb394dCfWYDexEl9o6grI6fMUpue3Dd6VepdfvSTESJfGdlV1sVt9m8yWGfsJggdvA2xh99h/4puxEcWtvLsbkUiyoZLusHRest85Dqj8/dWL5vODr3weL61Yg9kC1FU3QoY6DsUrKTkaSzCltl7HDdgtWY1ej/paWehe/VJdkgfTp41N1EIzLSu5KwguL5/6n0YBKuQ6Nl3p6HFrJxsxbIyOZIxTMDxMojIESRFmNPAAPQsFovZ2MNoCb+37xPdryK5PqYDrePkbrp5HBQ0OCDQ==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509Certificate>MIIJSzCCBzOgAwIBAgIQUYuSvbKZRcZpXrfSPj4Y4TANBgkqhkiG9w0BAQsFADCBrTEcMBoGA1UECQwTd3d3LmNlcnRpY2FtYXJhLmNvbTEPMA0GA1UEBwwGQk9HT1RBMRkwFwYDVQQIDBBESVNUUklUTyBDQVBJVEFMMQswCQYDVQQGEwJDTzEYMBYGA1UECwwPTklUIDgzMDA4NDQzMy03MRgwFgYDVQQKDA9DRVJUSUNBTUFSQSBTLkExIDAeBgNVBAMMF0FDIFNVQiA0MDk2IENFUlRJQ0FNQVJBMCAXDTI2MDEwNzE5NDUyMloYDzIwMjgwMTA3MTk0NTIxWjCCAT4xFDASBgNVBAQMC1RBTVVSQSBNQVpPMRkwFwYDVQQJDBBBViAzIEEgTiAyNiBOIDgzMQ4wDAYDVQQIDAVWQUxMRTEcMBoGA1UECwwTRkFDVFVSQSBFTEVDVFJPTklDQTEQMA4GA1UEBRMHMjM2NzcxNjEaMBgGCisGAQQBgbVjAgMTCjg5MDMxOTE5MzMxGDAWBgorBgEEAYG1YwICEwgyOTExNjg1ODEzMDEGA1UECgwqU0lTVEVNQVMgREUgSU5GT1JNQUNJT04gRU1QUkVTQVJJQUwgUy5BLlMuMQ0wCwYDVQQHDARDQUxJMQ8wDQYDVQQqDAZTQVlVUkkxCzAJBgNVBAYTAkNPMTMwMQYDVQQDDCpTSVNURU1BUyBERSBJTkZPUk1BQ0lPTiBFTVBSRVNBUklBTCBTLkEuUy4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCPLoAkqJiUiJhZxO+gy6wSdqmCUcuw4yDi3Gong9TuGC1Qw1sqyjq94yPQTsiKDp865KEehvgG2lZv4RO8eHnPLq7+6smRTS+vjoewIO4YhqZakoZWlZtTIwNgBQ1cteJ7jt/isEwq6BDPqrXQq0dVMhL7+m2V5ypdpZTU9bJmTDSEolA9MDhvRVIvfb9wam/pWfXOLnygkfJRKAwx42j8x5NM1oh0TinAw7YSyF72o17nPugFfDtj7neeOQBazCyvRZF5c2lUzrMkUuGwCuRBP/HnqSbmb/F/heqxGOxvSUxU/NU+TdM1F0j/UViOG8zoqqMNvED+Rsvp/2LlEoDFAgMKALGjggPPMIIDyzA6BggrBgEFBQcBAQQuMCwwKgYIKwYBBQUHMAGGHmh0dHA6Ly9vY3NwNDA5Ni5jZXJ0aWNhbWFyYS5jbzAgBgNVHREEGTAXgRVKVUFOLkFSQU5HT0BTSUVTQS5DT00wggENBgNVHSAEggEEMIIBADCBmgYMKwYBBAGBtWMyAQgEMIGJMCsGCCsGAQUFBwIBFh9odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9kcGMvMFoGCCsGAQUFBwICME4aTExpbWl0YWNpb25lcyBkZSBnYXJhbnTtYXMgZGUgZXN0ZSBjZXJ0aWZpY2FkbyBzZSBwdWVkZW4gZW5jb250cmFyIGVuIGxhIERQQy4wYQYLKwYBBAGBtWMKCgEwUjBQBggrBgEFBQcCAjBEGkJEaXNwb3NpdGl2byBkZSBoYXJkd2FyZSAoVG9rZW4pIEPzZGlnbyBkZSBhY3JlZGl0YWNp8246IDE2LUVDRC0wMDIwDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCA/gwJwYDVR0lBCAwHgYIKwYBBQUHAwEGCCsGAQUFBwMCBggrBgEFBQcDBDAdBgNVHQ4EFgQUe/vcUTmXmIF2xsYKXMac/4QtVfUwHwYDVR0jBBgwFoAUZhmj9ZswsAxOTRmZYEIJ0loxSocwggHRBgNVHR8EggHIMIIBxDCB9aCB8qCB74Z0aHR0cDovL3d3dy5jZXJ0aWNhbWFyYS5jb20vcmVwb3NpdG9yaW9yZXZvY2FjaW9uZXMvYWNfc3Vib3JkaW5hZGFfY2VydGljYW1hcmFfY29uX2V4dGVuc2lvbl9jcml0aWNhXzQwOTYuY3JsP2NybD1jcmyGd2h0dHA6Ly9taXJyb3IuY2VydGljYW1hcmEuY29tL3JlcG9zaXRvcmlvcmV2b2NhY2lvbmVzL2FjX3N1Ym9yZGluYWRhX2NlcnRpY2FtYXJhX2Nvbl9leHRlbnNpb25fY3JpdGljYV80MDk2LmNybD9jcmw9Y3JsMIHJoIHGoIHDhl5odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JshmFodHRwOi8vbWlycm9yLmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JsMA0GCSqGSIb3DQEBCwUAA4ICAQBxabJlMOQcT+hAmqHk+MAUIHCg2e5IfSORvl9Q+BDIptVMiv2TXCfFPlGO251Up6ODWmSCJF+YlxpFBJB7gSyiBYlV7OzdBMQp6E8lQQoAt8EOS2Ds9vXn/nNUrGXQxF5nxSTmSuEIqKQ620ESJKSEJa7XxLMpaCKnY2lF8nYZRnigRNACZDq4+yR6CTYN6abuaq+qu6FogxiJ5WMXsnpMRlUtRu5AZjYHMhBpJfgEiUAe2ziYJ4Aj6lsa5vZBeE/5eSled5AjQAVPcTL3mm0xIfEL4Ytp/+VHiJBMFDjqMfvKausU0THzKrsL3bGm0kgVl4CQ81DdKZW1g9xBWN93G6TgChIgg8iCINzbbqp+2o55rFGLrd9PDoZgWo82jA4ZhRVPhBnCdkiwWC0MOUA3bOk5fa4V+4onQS0lGlIh9Ign4BYa+0wYJLzmWazD+gqz0ggfv7IHqoR4xJ26I9q77fzPXyvtgMfEUbIYCv0EVUmQ9sF9dwD5GLp+7pStKflJX8AWLqBrfGC6n4t8aXGi6vwFP55cMUtShDD3Cq7sc2TCFcr7OpWi85d+zAI3YS3laB0ulW9kOp0+Rr3yN+l/xb1oYOJqzzw2NNzjogcKta6InhxAEMAzgrNMoS1z26vmD51482GlfbSzQrWw79g7ygwgBVC9w2ZYdyMcLne5XQ==</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#xmldsig-39bfd2a1-6355-4ed0-81ba-68072c929992" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="SignedPropertiesId"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-14T16:05:19.828+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>laQVFI63iHk/FpfiG9sT7TFH2GtX8PJy7RSbsACv3ic=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=AC SUB 4096 CERTICAMARA, O=CERTICAMARA S.A, OU=NIT 830084433-7, C=CO, S=DISTRITO CAPITAL, L=BOGOTA, STREET=www.certicamara.com</ds:X509IssuerName><ds:X509SerialNumber>108392173183113001987351625583124420833</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>E6070413164</cbc:ID><cbc:IssueDate>2026-06-14</cbc:IssueDate><cbc:IssueTime>16:05:19+00:00</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>E6070413164</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName><cbc:CompanyID schemeID="7" schemeName="31" schemeAgencyID="195">800153993</cbc:CompanyID><cbc:TaxLevelCode listName="48">O-13;O-15</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeName="13" schemeAgencyID="195">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="48">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8"?><Invoice xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><sts:DianExtensions><sts:InvoiceControl><sts:InvoiceAuthorization>18764105889351</sts:InvoiceAuthorization><sts:AuthorizationPeriod><cbc:StartDate>2026-02-13</cbc:StartDate><cbc:EndDate>2028-02-13</cbc:EndDate></sts:AuthorizationPeriod><sts:AuthorizedInvoices><sts:Prefix>E</sts:Prefix><sts:From>6028523001</sts:From><sts:To>6078523000</sts:To></sts:AuthorizedInvoices></sts:InvoiceControl><sts:InvoiceSource><cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode></sts:InvoiceSource><sts:SoftwareProvider><sts:ProviderID schemeID="3" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">890319193</sts:ProviderID><sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">363dbee8-27ce-4c85-b588-85d3c4611026</sts:SoftwareID></sts:SoftwareProvider><sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">91c01eb81cbb3b60b0ca64863666cd65dcd2f62300636e8d1576ea9fbe952809e6a23057d354788b1405bbeb8605e5d0</sts:SoftwareSecurityCode><sts:AuthorizationProvider><sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID></sts:AuthorizationProvider><sts:QRCode>https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=5be808385e3a4aa94503bb7fe6dd99510fcd3030123d770aa0d501b83f4ef1fd69f2f89b60c200e220231105614c74f1</sts:QRCode></sts:DianExtensions></ext:ExtensionContent></ext:UBLExtension><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="xmldsig-a5842e8a-050f-4288-a5e0-5881f0a641b8" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-a5842e8a-050f-4288-a5e0-5881f0a641b8-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>xYZkpPr7BRdgFRHOOQFmw1dl662ht5xQS9wu+gAkOsM=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-a5842e8a-050f-4288-a5e0-5881f0a641b8-ref1" URI="#KeyInfo"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>V5OjMdINAS3t9ym2Pceb/nZlIoRk7yT3TKDkw2PF/Ic=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-a5842e8a-050f-4288-a5e0-5881f0a641b8-ref2" URI="#SignedPropertiesId" Type="http://uri.etsi.org/01903#SignedProperties"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>fYibkHRtevkPkl9TUXClrMcoxgpcEaVa4en8YcVm4Ws=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>hRFmZsXreTAoQamuYmz5FxSLfAbrWwlJvo7dHCiaSS2RWJEYlMGseTufOhfzbOX7mXLBDz/Zq5GjcgYn3hCmvbnlpTRdFnlndxe9hvJboDDNQkOIHt8nxFrip2E7/gbvrTFBzdWikfTQIVAQG+2TzmyYLYGk/kHYt0uT0HGeXbFnBiWWB3FOhbRpLQIaBJNRtypXOUAJPilmaXUdyIrAZ9F3BX70j4EqReuol1BJJGN5KSnrxg2MwKQE71AiCHWF6yq2s5hjanJ1pu3ZqKfrv77cTz6aPchjsR0oBrzfau1IWgWbP2TaLa9erlbLCcbrqAC8g03PJNzuadXN360okg==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509Certificate>MIIJSzCCBzOgAwIBAgIQUYuSvbKZRcZpXrfSPj4Y4TANBgkqhkiG9w0BAQsFADCBrTEcMBoGA1UECQwTd3d3LmNlcnRpY2FtYXJhLmNvbTEPMA0GA1UEBwwGQk9HT1RBMRkwFwYDVQQIDBBESVNUUklUTyBDQVBJVEFMMQswCQYDVQQGEwJDTzEYMBYGA1UECwwPTklUIDgzMDA4NDQzMy03MRgwFgYDVQQKDA9DRVJUSUNBTUFSQSBTLkExIDAeBgNVBAMMF0FDIFNVQiA0MDk2IENFUlRJQ0FNQVJBMCAXDTI2MDEwNzE5NDUyMloYDzIwMjgwMTA3MTk0NTIxWjCCAT4xFDASBgNVBAQMC1RBTVVSQSBNQVpPMRkwFwYDVQQJDBBBViAzIEEgTiAyNiBOIDgzMQ4wDAYDVQQIDAVWQUxMRTEcMBoGA1UECwwTRkFDVFVSQSBFTEVDVFJPTklDQTEQMA4GA1UEBRMHMjM2NzcxNjEaMBgGCisGAQQBgbVjAgMTCjg5MDMxOTE5MzMxGDAWBgorBgEEAYG1YwICEwgyOTExNjg1ODEzMDEGA1UECgwqU0lTVEVNQVMgREUgSU5GT1JNQUNJT04gRU1QUkVTQVJJQUwgUy5BLlMuMQ0wCwYDVQQHDARDQUxJMQ8wDQYDVQQqDAZTQVlVUkkxCzAJBgNVBAYTAkNPMTMwMQYDVQQDDCpTSVNURU1BUyBERSBJTkZPUk1BQ0lPTiBFTVBSRVNBUklBTCBTLkEuUy4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCPLoAkqJiUiJhZxO+gy6wSdqmCUcuw4yDi3Gong9TuGC1Qw1sqyjq94yPQTsiKDp865KEehvgG2lZv4RO8eHnPLq7+6smRTS+vjoewIO4YhqZakoZWlZtTIwNgBQ1cteJ7jt/isEwq6BDPqrXQq0dVMhL7+m2V5ypdpZTU9bJmTDSEolA9MDhvRVIvfb9wam/pWfXOLnygkfJRKAwx42j8x5NM1oh0TinAw7YSyF72o17nPugFfDtj7neeOQBazCyvRZF5c2lUzrMkUuGwCuRBP/HnqSbmb/F/heqxGOxvSUxU/NU+TdM1F0j/UViOG8zoqqMNvED+Rsvp/2LlEoDFAgMKALGjggPPMIIDyzA6BggrBgEFBQcBAQQuMCwwKgYIKwYBBQUHMAGGHmh0dHA6Ly9vY3NwNDA5Ni5jZXJ0aWNhbWFyYS5jbzAgBgNVHREEGTAXgRVKVUFOLkFSQU5HT0BTSUVTQS5DT00wggENBgNVHSAEggEEMIIBADCBmgYMKwYBBAGBtWMyAQgEMIGJMCsGCCsGAQUFBwIBFh9odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9kcGMvMFoGCCsGAQUFBwICME4aTExpbWl0YWNpb25lcyBkZSBnYXJhbnTtYXMgZGUgZXN0ZSBjZXJ0aWZpY2FkbyBzZSBwdWVkZW4gZW5jb250cmFyIGVuIGxhIERQQy4wYQYLKwYBBAGBtWMKCgEwUjBQBggrBgEFBQcCAjBEGkJEaXNwb3NpdGl2byBkZSBoYXJkd2FyZSAoVG9rZW4pIEPzZGlnbyBkZSBhY3JlZGl0YWNp8246IDE2LUVDRC0wMDIwDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCA/gwJwYDVR0lBCAwHgYIKwYBBQUHAwEGCCsGAQUFBwMCBggrBgEFBQcDBDAdBgNVHQ4EFgQUe/vcUTmXmIF2xsYKXMac/4QtVfUwHwYDVR0jBBgwFoAUZhmj9ZswsAxOTRmZYEIJ0loxSocwggHRBgNVHR8EggHIMIIBxDCB9aCB8qCB74Z0aHR0cDovL3d3dy5jZXJ0aWNhbWFyYS5jb20vcmVwb3NpdG9yaW9yZXZvY2FjaW9uZXMvYWNfc3Vib3JkaW5hZGFfY2VydGljYW1hcmFfY29uX2V4dGVuc2lvbl9jcml0aWNhXzQwOTYuY3JsP2NybD1jcmyGd2h0dHA6Ly9taXJyb3IuY2VydGljYW1hcmEuY29tL3JlcG9zaXRvcmlvcmV2b2NhY2lvbmVzL2FjX3N1Ym9yZGluYWRhX2NlcnRpY2FtYXJhX2Nvbl9leHRlbnNpb25fY3JpdGljYV80MDk2LmNybD9jcmw9Y3JsMIHJoIHGoIHDhl5odHRwOi8vd3d3LmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JshmFodHRwOi8vbWlycm9yLmNlcnRpY2FtYXJhLmNvbS9yZXBvc2l0b3Jpb3Jldm9jYWNpb25lcy9hY19zdWJvcmRpbmFkYV9jZXJ0aWNhbWFyYV80MDk2LmNybD9jcmw9Y3JsMA0GCSqGSIb3DQEBCwUAA4ICAQBxabJlMOQcT+hAmqHk+MAUIHCg2e5IfSORvl9Q+BDIptVMiv2TXCfFPlGO251Up6ODWmSCJF+YlxpFBJB7gSyiBYlV7OzdBMQp6E8lQQoAt8EOS2Ds9vXn/nNUrGXQxF5nxSTmSuEIqKQ620ESJKSEJa7XxLMpaCKnY2lF8nYZRnigRNACZDq4+yR6CTYN6abuaq+qu6FogxiJ5WMXsnpMRlUtRu5AZjYHMhBpJfgEiUAe2ziYJ4Aj6lsa5vZBeE/5eSled5AjQAVPcTL3mm0xIfEL4Ytp/+VHiJBMFDjqMfvKausU0THzKrsL3bGm0kgVl4CQ81DdKZW1g9xBWN93G6TgChIgg8iCINzbbqp+2o55rFGLrd9PDoZgWo82jA4ZhRVPhBnCdkiwWC0MOUA3bOk5fa4V+4onQS0lGlIh9Ign4BYa+0wYJLzmWazD+gqz0ggfv7IHqoR4xJ26I9q77fzPXyvtgMfEUbIYCv0EVUmQ9sF9dwD5GLp+7pStKflJX8AWLqBrfGC6n4t8aXGi6vwFP55cMUtShDD3Cq7sc2TCFcr7OpWi85d+zAI3YS3laB0ulW9kOp0+Rr3yN+l/xb1oYOJqzzw2NNzjogcKta6InhxAEMAzgrNMoS1z26vmD51482GlfbSzQrWw79g7ygwgBVC9w2ZYdyMcLne5XQ==</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#xmldsig-a5842e8a-050f-4288-a5e0-5881f0a641b8" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="SignedPropertiesId"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-14T10:36:14.010-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>laQVFI63iHk/FpfiG9sT7TFH2GtX8PJy7RSbsACv3ic=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=AC SUB 4096 CERTICAMARA, O=CERTICAMARA S.A, OU=NIT 830084433-7, C=CO, S=DISTRITO CAPITAL, L=BOGOTA, STREET=www.certicamara.com</ds:X509IssuerName><ds:X509SerialNumber>108392173183113001987351625583124420833</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>10</cbc:CustomizationID><cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>E6070413164</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">5be808385e3a4aa94503bb7fe6dd99510fcd3030123d770aa0d501b83f4ef1fd69f2f89b60c200e220231105614c74f1</cbc:UUID><cbc:IssueDate>2026-06-14</cbc:IssueDate><cbc:IssueTime>10:36:14-05:00</cbc:IssueTime><cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode><cbc:Note>Total Intereses: $0.00</cbc:Note><cbc:Note>Total Descuentos: $0.00</cbc:Note><cbc:Note>Total impuestos: $9686.08</cbc:Note><cbc:Note>Deuda anterior: $0.41</cbc:Note><cbc:Note>Total a pagar: $60134.41</cbc:Note><cbc:Note>Total Retefuente: $0.00</cbc:Note><cbc:Note>TAX|01|false|0.19|50448.32|9585.18||</cbc:Note><cbc:Note>TAX|04|false|0.04|2522.50|100.90||</cbc:Note><cbc:Note>1115-Cargos Fijos:50448.33,Impuestos CargosFijos:9686.08</cbc:Note><cbc:Note>1115-Consumos:0.00,Impuestos Consumos:0.00</cbc:Note><cbc:Note>1115-OtrosConceptos:0.00,Impuestos Otros Conceptos:0.00</cbc:Note><cbc:Note>1115-EquiposaCredito:0.00,Impuestos Equipos a Credito:0.00</cbc:Note><cbc:Note>1115-Servicios Adicionales:0.00,Impuestos Servicios Adicionales:0.00</cbc:Note><cbc:Note>1115-EquipoFinanciados:0.00,Impuestos Equipos Financiados:0.00</cbc:Note><cbc:Note>iva:9585.18,consumo:100.90</cbc:Note><cbc:Note>Custcode:1.16581514</cbc:Note><cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>1</cbc:LineCountNumeric><cac:AccountingSupplierParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cac:PartyName><cbc:Name>COMUNICACION CELULAR S A  COMCEL S A</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>11001</cbc:ID><cbc:CityName> BOGOTÁ</cbc:CityName><cbc:PostalZone>110931</cbc:PostalZone><cbc:CountrySubentity>Bogotá, D.C.</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line> CR 68 A 24 B 10 Sede Administrativa Bogotá</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">COLOMBIA</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName><cbc:CompanyID schemeID="7" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800153993</cbc:CompanyID><cbc:TaxLevelCode listName="48">O-13;O-15</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>11001</cbc:ID><cbc:CityName> BOGOTÁ</cbc:CityName><cbc:PostalZone>110931</cbc:PostalZone><cbc:CountrySubentity>Bogotá, D.C.</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line> CR 68 A 24 B 10 Sede Administrativa Bogotá</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">COLOMBIA</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName><cbc:CompanyID schemeID="7" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800153993</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>E</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>comcel_fe@claro.com.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cbc:AdditionalAccountID>2</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID schemeName="13">71271339</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05360</cbc:ID><cbc:CityName /><cbc:PostalZone>05360</cbc:PostalZone><cbc:CountrySubentity /><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CLL 42 A N 55A-28 SANTA MARIA LA</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="48">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:PaymentMeans><cbc:ID>2</cbc:ID><cbc:PaymentMeansCode>1</cbc:PaymentMeansCode><cbc:PaymentDueDate>2026-06-23</cbc:PaymentDueDate></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0008</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">50448.32</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:TaxTotal><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0000</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">2522.50</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>4.00</cbc:Percent><cac:TaxScheme><cbc:ID>04</cbc:ID><cbc:Name>INC</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">50448.33</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="COP">50448.32</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="COP">60134.41</cbc:TaxInclusiveAmount><cbc:PayableRoundingAmount currencyID="COP">0</cbc:PayableRoundingAmount><cbc:PayableAmount currencyID="COP">60134.41</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>01</cbc:ID><cbc:Note>CFM_M|CFM_M</cbc:Note><cbc:InvoicedQuantity unitCode="94">1.00</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="COP">50448.33</cbc:LineExtensionAmount><cac:TaxTotal><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0008</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">50448.32</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">9585.18</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:TaxTotal><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cbc:RoundingAmount currencyID="COP">0.0000</cbc:RoundingAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">2522.50</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">100.90</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>4.00</cbc:Percent><cac:TaxScheme><cbc:ID>04</cbc:ID><cbc:Name>INC</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Cargos Fijos</cbc:Description></cac:Item><cac:Price><cbc:PriceAmount currencyID="COP">50448.33</cbc:PriceAmount><cbc:BaseQuantity unitCode="94">1.0</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>E6070413164</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">5be808385e3a4aa94503bb7fe6dd99510fcd3030123d770aa0d501b83f4ef1fd69f2f89b60c200e220231105614c74f1</cbc:UUID><cbc:IssueDate>2026-06-14</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\r\n  <ext:UBLExtensions>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent>\r\n        <sts:DianExtensions>\r\n          <sts:InvoiceSource>\r\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n          </sts:InvoiceSource>\r\n          <sts:SoftwareProvider>\r\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\r\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\r\n          </sts:SoftwareProvider>\r\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\r\n          <sts:AuthorizationProvider>\r\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\r\n          </sts:AuthorizationProvider>\r\n        </sts:DianExtensions>\r\n      </ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-cfa78925-ed08-4371-81a4-accdd0ab6289"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-0c1e3203-ef6d-4cb5-9d7d-afe2ad183f18" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>4aFBgVtP6ag+ck0JVqyQD+GImSm4SNq4Q6IpnFHXA6A=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-cfa78925-ed08-4371-81a4-accdd0ab6289-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>oAFPs7nEs4QYmUGK4lHKdSrJi+2a8JOABnsKgIiIDls=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-cfa78925-ed08-4371-81a4-accdd0ab6289-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>55Kt564q9gX67sXbjCaW4NdRiA7+rk31fiO3k293Nr0=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-cfa78925-ed08-4371-81a4-accdd0ab6289">D+BrXZMkiS8C37Jd25c7HjxpfpBnQBGZ60dPtVhsMQ7G/yvCOrK8wt/0DCnVVGu4oSVFTyS5ll47hJqvCv9NIxPPw7KFCO96xwNiM4yS1cHlVV9EsTZxUjSOKPFVIhYn70zKwRil3dKcqqSNh7+oCXgNTD4bSuaHcKx9s8rtwUet0/YwD5slK0FSyNefoh21W4x46GUIWAaccDeZK2U/iOLQfVOC9PlnseU/E2BaJdQgQq7Jdk887UYfkhMxJlrt8X7kv/Rd2fZzAs6M+QRc0fEz9HXdlKZxUvtYnQD0blEwpFIJMZBfz1LVHx7IXJ6HVuzbqAWxQhqG80bATLWaug==</ds:SignatureValue><ds:KeyInfo Id="Signature-cfa78925-ed08-4371-81a4-accdd0ab6289-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-61b85554-34d4-4cdc-8a29-dc8130c40827"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-2c42e46e-3877-4029-b426-bd207202011b" Target="#Signature-cfa78925-ed08-4371-81a4-accdd0ab6289"><xades:SignedProperties Id="xmldsig-Signature-cfa78925-ed08-4371-81a4-accdd0ab6289-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-14T10:39:10+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-0c1e3203-ef6d-4cb5-9d7d-afe2ad183f18"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n  </ext:UBLExtensions>\r\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n  <cbc:CustomizationID>1</cbc:CustomizationID>\r\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\r\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n  <cbc:ID>64243037</cbc:ID>\r\n  <cbc:UUID schemeName="CUDE-SHA384">6e08f9e22513bcfbd0d86d7b8d9d737dd35a8dfc39e729665b6b032f0cca0224a083d620f2beaa20928374ce590e7361</cbc:UUID>\r\n  <cbc:IssueDate>2026-06-14</cbc:IssueDate>\r\n  <cbc:IssueTime>10:39:10-05:00</cbc:IssueTime>\r\n  <cac:SenderParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:SenderParty>\r\n  <cac:ReceiverParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>COMUNICACION CELULAR S A  COMCEL S A</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="7" schemeName="31">800153993</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:ReceiverParty>\r\n  <cac:DocumentResponse>\r\n    <cac:Response>\r\n      <cbc:ResponseCode>02</cbc:ResponseCode>\r\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\r\n    </cac:Response>\r\n    <cac:DocumentReference>\r\n      <cbc:ID>E6070413164</cbc:ID>\r\n      <cbc:UUID schemeName="CUFE-SHA384">5be808385e3a4aa94503bb7fe6dd99510fcd3030123d770aa0d501b83f4ef1fd69f2f89b60c200e220231105614c74f1</cbc:UUID>\r\n    </cac:DocumentReference>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>1</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\r\n        <cbc:Description>0</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>2</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>FAZ09</cbc:ResponseCode>\r\n        <cbc:Description>Debe existir el grupo de información de identificación del bien o servicio</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>3</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>4</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n  </cac:DocumentResponse>\r\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>002</cbc:ValidationResultCode><cbc:ValidationDate>2026-06-14</cbc:ValidationDate><cbc:ValidationTime>15:36:14+00:00</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-03 10:25:25.187827
13	17	xml_invoice	APC Mayoristas, POB41916.xml	\N	<?xml version="1.0" encoding="utf-8"?>\r\n<AttachedDocument xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2">\r\n\t<ext:UBLExtensions>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>0CjQbI6AsPYmBSw1D9/VCR2NGu3Qu8AfN5fbbr4EfGg=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref1" URI="#KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>4o0yJ7pOlsMplx0WLgN59x7COSgZv4hJ8pSog1fcyOw=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>o3Imh4zkRThJHH2Fw7nPsNWU7uWK1Xc/dG4Iricx+Qs=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-sigvalue">mDXgeLJrMyPldYRvd8oJCxBjVDk2DUDHxsanBFJ50n74R3JqsgkwW5V4PIZHTj4L8/Vq0ObW2Ncfkrt7Pw8goRhCh8cp1MKq+E9E5VKCK8YMueKQmHIBT8Nl68s5Nag4H0Y+C69q5dndIgMAE9knX2SFCXdmq+b+QLNYTanK9b41f0Rn9ewom71hr9Wg1Jmayf+5MFFfHhDmvRbez1rmBN6Tsc50RzdNreaJMxYp0Jd4omde/9ORNit3758LHtHlzynlr4+t+VdBzZpfBj4UefVzecXWdEePNewLaoRfTsL44/hc0MZn1cLKR3MU87onMbhqJqtgqq7i/ZdzrJoaqA==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></ds:X509IssuerSerial><ds:X509SubjectName>C=CO, S=ANTIOQUIA, L=MEDELLÍN, O=PRINCIPAL, OU=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701, T=Emisor Factura Electronica - Persona Juridica, SERIALNUMBER=9007460544, CN=@PC MAYORISTA S.A.S., E=SERVICIOALCLIENTE@HGI.COM.CO, STREET=CL 16 CR 45 85</ds:X509SubjectName><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" Target="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><xades:SignedProperties Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-17T12:53:06.893-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>no+kgqKFeGb4NWUIHHK8cEsKyBfzedZeQUBYVKyEqL4=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD.,OU=Division de certificacion entidad final,CN=CA ANDES SCD S.A. Clase II,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>Cs7emRwtXWVYHJrqS9eXEXfUcFyJJBqFhDFOetHu8ts=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>3184328748892787122</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>RLYziy/D+T4pgDLc65EboYLzIoC/iYCwrOCGzGo/MO0=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>6218172215901586992</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t</ext:UBLExtensions>\r\n\t<cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n\t<cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID>\r\n\t<cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID>\r\n\t<cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n\t<cbc:ID>POB419160</cbc:ID>\r\n\t<cbc:IssueDate>2026-06-17</cbc:IssueDate>\r\n\t<cbc:IssueTime>17:56:05-05:00</cbc:IssueTime>\r\n\t<cbc:DocumentTypeCode>Contenedor de Factura Electrónica</cbc:DocumentTypeCode>\r\n\t<cbc:ParentDocumentID>POB41916</cbc:ParentDocumentID>\r\n\t<cac:SenderParty>\r\n\t\t<cac:PartyTaxScheme>\r\n\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t<cbc:TaxLevelCode listName="2">R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t<cac:TaxScheme>\r\n\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t</cac:TaxScheme>\r\n\t\t</cac:PartyTaxScheme>\r\n\t</cac:SenderParty>\r\n\t<cac:ReceiverParty>\r\n\t\t<cac:PartyTaxScheme>\r\n\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t<cbc:TaxLevelCode listName="1">R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t<cac:TaxScheme>\r\n\t\t\t\t<cbc:ID>ZZ</cbc:ID>\r\n\t\t\t\t<cbc:Name>No aplica</cbc:Name>\r\n\t\t\t</cac:TaxScheme>\r\n\t\t</cac:PartyTaxScheme>\r\n\t</cac:ReceiverParty>\r\n\t<cac:Attachment>\r\n\t\t<cac:ExternalReference>\r\n\t\t\t<cbc:MimeCode>text/xml</cbc:MimeCode>\r\n\t\t\t<cbc:EncodingCode>UTF-8</cbc:EncodingCode>\r\n\t\t\t<cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8"?>\r\n<Invoice xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">\r\n\t<ext:UBLExtensions>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent>\r\n\t\t\t\t<sts:DianExtensions xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1">\r\n\t\t\t\t\t<sts:InvoiceControl>\r\n\t\t\t\t\t\t<sts:InvoiceAuthorization>18764098255081</sts:InvoiceAuthorization>\r\n\t\t\t\t\t\t<sts:AuthorizationPeriod>\r\n\t\t\t\t\t\t\t<cbc:StartDate>2025-09-05</cbc:StartDate>\r\n\t\t\t\t\t\t\t<cbc:EndDate>2027-09-05</cbc:EndDate>\r\n\t\t\t\t\t\t</sts:AuthorizationPeriod>\r\n\t\t\t\t\t\t<sts:AuthorizedInvoices>\r\n\t\t\t\t\t\t\t<sts:Prefix>POB</sts:Prefix>\r\n\t\t\t\t\t\t\t<sts:From>37973</sts:From>\r\n\t\t\t\t\t\t\t<sts:To>100000</sts:To>\r\n\t\t\t\t\t\t</sts:AuthorizedInvoices>\r\n\t\t\t\t\t</sts:InvoiceControl>\r\n\t\t\t\t\t<sts:InvoiceSource>\r\n\t\t\t\t\t\t<cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n\t\t\t\t\t</sts:InvoiceSource>\r\n\t\t\t\t\t<sts:SoftwareProvider>\r\n\t\t\t\t\t\t<sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">811021438</sts:ProviderID>\r\n\t\t\t\t\t\t<sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">def923e2-8326-42e2-a022-d0fa4a2f8188</sts:SoftwareID>\r\n\t\t\t\t\t</sts:SoftwareProvider>\r\n\t\t\t\t\t<sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">afe3680357f5cbc9b61d1bc8c60fa35ca872384ed0bbbade933beb675b196f7e198bd88b275a18f0bae7c465243f2141</sts:SoftwareSecurityCode>\r\n\t\t\t\t\t<sts:AuthorizationProvider>\r\n\t\t\t\t\t\t<sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID>\r\n\t\t\t\t\t</sts:AuthorizationProvider>\r\n\t\t\t\t\t<sts:QRCode>https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=9bce35412d61e2410d8fd70067e1a5edd042237b1ebaa2c277a00d0555b79c9351d581b9dee60d44e6f4034cdc8761a2</sts:QRCode>\r\n\t\t\t\t</sts:DianExtensions>\r\n\t\t\t</ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>JvqOdBV5ugAB520+/Q5A3127SBc/lA5nCteiREbCl1w=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref1" URI="#KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>myqPbIAsspfTO7SjX/SJ291aSjYwWZSaX0GLcbwDoAA=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>v8TnotPJH0c2JptP2jHP6ewp/UWr/1PsCDjELOuH8cA=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-sigvalue">NMlAl6dr+6dHO2eAqQrRIlCh3TT2tAShr43XhX7UInT7D2CpbCLEtHuRTGyQlqga1yFRzy15B3mTHEFpnRacOJFIcImT9IU6sDxR4g2RQbbHFl2PHGo/mqDL/kzMvCxxeYCxRENa50xYqosR3AacgOCjOpBDzXz3tvK3VrMoN7lfh7BrhSymcYaAx7pFcsoeCC613dZF0p6zgA0oRbiDYoGLbgTx1MiXe+if16dgag35mYI403Twa8g9gRVyhLPrUTGz7kT/UMYVid4uP14K+k1QGiEO5cz3BUnnmbENg38wX2MIZsbEJXxhrqzYM5RgjTlfqAGVLB7ty7M9AzebaQ==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></ds:X509IssuerSerial><ds:X509SubjectName>C=CO, S=ANTIOQUIA, L=MEDELLÍN, O=PRINCIPAL, OU=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701, T=Emisor Factura Electronica - Persona Juridica, SERIALNUMBER=9007460544, CN=@PC MAYORISTA S.A.S., E=SERVICIOALCLIENTE@HGI.COM.CO, STREET=CL 16 CR 45 85</ds:X509SubjectName><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" Target="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><xades:SignedProperties Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-17T12:53:05.313-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>no+kgqKFeGb4NWUIHHK8cEsKyBfzedZeQUBYVKyEqL4=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD.,OU=Division de certificacion entidad final,CN=CA ANDES SCD S.A. Clase II,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>Cs7emRwtXWVYHJrqS9eXEXfUcFyJJBqFhDFOetHu8ts=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>3184328748892787122</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>RLYziy/D+T4pgDLc65EboYLzIoC/iYCwrOCGzGo/MO0=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>6218172215901586992</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t</ext:UBLExtensions>\r\n\t<cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n\t<cbc:CustomizationID>10</cbc:CustomizationID>\r\n\t<cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID>\r\n\t<cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n\t<cbc:ID>POB41916</cbc:ID>\r\n\t<cbc:UUID schemeID="1" schemeName="CUFE-SHA384">9bce35412d61e2410d8fd70067e1a5edd042237b1ebaa2c277a00d0555b79c9351d581b9dee60d44e6f4034cdc8761a2</cbc:UUID>\r\n\t<cbc:IssueDate>2026-06-17</cbc:IssueDate>\r\n\t<cbc:IssueTime>09:30:11-05:00</cbc:IssueTime>\r\n\t<cbc:DueDate>2026-06-18</cbc:DueDate>\r\n\t<cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>\r\n\t<cbc:Note> 18764098255081 de 2025-09-05 del POB-37973 al POB-100000</cbc:Note>\r\n\t<cbc:Note>Transferencia</cbc:Note>\r\n\t<cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>\r\n\t<cbc:LineCountNumeric>1</cbc:LineCountNumeric>\r\n\t<cac:InvoicePeriod>\r\n\t\t<cbc:StartDate>2026-06-01</cbc:StartDate>\r\n\t\t<cbc:EndDate>2026-06-30</cbc:EndDate>\r\n\t</cac:InvoicePeriod>\r\n\t<cac:OrderReference>\r\n\t\t<cbc:ID>0</cbc:ID>\r\n\t</cac:OrderReference>\r\n\t<cac:DespatchDocumentReference>\r\n\t\t<cbc:ID>0</cbc:ID>\r\n\t</cac:DespatchDocumentReference>\r\n\t<cac:AccountingSupplierParty>\r\n\t\t<cbc:AdditionalAccountID schemeAgencyID="195">1</cbc:AdditionalAccountID>\r\n\t\t<cac:Party>\r\n\t\t\t<cbc:IndustryClassificationCode>4652</cbc:IndustryClassificationCode>\r\n\t\t\t<cac:PartyName>\r\n\t\t\t\t<cbc:Name>@PC MAYORISTA S.A.S</cbc:Name>\r\n\t\t\t</cac:PartyName>\r\n\t\t\t<cac:PhysicalLocation>\r\n\t\t\t\t<cac:Address>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>050001</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CRA 51 51 17 ED HENRY LOCAL 210</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:Address>\r\n\t\t\t</cac:PhysicalLocation>\r\n\t\t\t<cac:PartyTaxScheme>\r\n\t\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t\t<cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t\t<cac:RegistrationAddress>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>050001</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CRA 51 51 17 ED HENRY LOCAL 210</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:RegistrationAddress>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:PartyTaxScheme>\r\n\t\t\t<cac:PartyLegalEntity>\r\n\t\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t\t<cac:CorporateRegistrationScheme>\r\n\t\t\t\t\t<cbc:ID>POB</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>0</cbc:Name>\r\n\t\t\t\t</cac:CorporateRegistrationScheme>\r\n\t\t\t</cac:PartyLegalEntity>\r\n\t\t\t<cac:Contact>\r\n\t\t\t\t<cbc:Telephone>5116179</cbc:Telephone>\r\n\t\t\t\t<cbc:ElectronicMail>facturacion.electronica@apcmayorista.com</cbc:ElectronicMail>\r\n\t\t\t</cac:Contact>\r\n\t\t</cac:Party>\r\n\t</cac:AccountingSupplierParty>\r\n\t<cac:AccountingCustomerParty>\r\n\t\t<cbc:AdditionalAccountID>2</cbc:AdditionalAccountID>\r\n\t\t<cac:Party>\r\n\t\t\t<cac:PartyIdentification>\r\n\t\t\t\t<cbc:ID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)">71271339</cbc:ID>\r\n\t\t\t</cac:PartyIdentification>\r\n\t\t\t<cac:PartyName>\r\n\t\t\t\t<cbc:Name>BENTHAN MUNERA ANDRES</cbc:Name>\r\n\t\t\t</cac:PartyName>\r\n\t\t\t<cac:PhysicalLocation>\r\n\t\t\t\t<cac:Address>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>055410</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CL 42 A 55 A 15</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:Address>\r\n\t\t\t</cac:PhysicalLocation>\r\n\t\t\t<cac:PartyTaxScheme>\r\n\t\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t\t<cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t\t<cac:RegistrationAddress>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>055410</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CL 42 A 55 A 15</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:RegistrationAddress>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>ZZ</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>No aplica</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:PartyTaxScheme>\r\n\t\t\t<cac:PartyLegalEntity>\r\n\t\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t\t<cac:CorporateRegistrationScheme>\r\n\t\t\t\t\t<cbc:Name>0</cbc:Name>\r\n\t\t\t\t</cac:CorporateRegistrationScheme>\r\n\t\t\t</cac:PartyLegalEntity>\r\n\t\t\t<cac:Contact>\r\n\t\t\t\t<cbc:Telephone>3715726</cbc:Telephone>\r\n\t\t\t\t<cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail>\r\n\t\t\t</cac:Contact>\r\n\t\t\t<cac:Person>\r\n\t\t\t\t<cbc:FirstName>ANDRES</cbc:FirstName>\r\n\t\t\t\t<cbc:FamilyName>BENTHAN MUNERA</cbc:FamilyName>\r\n\t\t\t\t<cbc:MiddleName />\r\n\t\t\t</cac:Person>\r\n\t\t</cac:Party>\r\n\t</cac:AccountingCustomerParty>\r\n\t<cac:TaxRepresentativeParty>\r\n\t\t<cac:PartyIdentification>\r\n\t\t\t<cbc:ID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">811021438</cbc:ID>\r\n\t\t</cac:PartyIdentification>\r\n\t</cac:TaxRepresentativeParty>\r\n\t<cac:PaymentMeans>\r\n\t\t<cbc:ID>2</cbc:ID>\r\n\t\t<cbc:PaymentMeansCode>1</cbc:PaymentMeansCode>\r\n\t\t<cbc:PaymentDueDate>2026-06-18</cbc:PaymentDueDate>\r\n\t\t<cbc:PaymentID>12345</cbc:PaymentID>\r\n\t</cac:PaymentMeans>\r\n\t<cac:PaymentTerms>\r\n\t\t<cbc:ID>1</cbc:ID>\r\n\t\t<cbc:PaymentMeansID>1</cbc:PaymentMeansID>\r\n\t\t<cbc:Note>Cuota 1 de 1</cbc:Note>\r\n\t\t<cbc:Amount currencyID="COP">396000.00000</cbc:Amount>\r\n\t\t<cbc:PaymentDueDate>2026-06-18</cbc:PaymentDueDate>\r\n\t</cac:PaymentTerms>\r\n\t<cac:TaxTotal>\r\n\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t<cbc:RoundingAmount currencyID="COP">0.00</cbc:RoundingAmount>\r\n\t\t<cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator>\r\n\t\t<cac:TaxSubtotal>\r\n\t\t\t<cbc:TaxableAmount currencyID="COP">396000.00</cbc:TaxableAmount>\r\n\t\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t\t<cac:TaxCategory>\r\n\t\t\t\t<cbc:Percent>0.00</cbc:Percent>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:TaxCategory>\r\n\t\t</cac:TaxSubtotal>\r\n\t</cac:TaxTotal>\r\n\t<cac:LegalMonetaryTotal>\r\n\t\t<cbc:LineExtensionAmount currencyID="COP">396000.00</cbc:LineExtensionAmount>\r\n\t\t<cbc:TaxExclusiveAmount currencyID="COP">396000.00</cbc:TaxExclusiveAmount>\r\n\t\t<cbc:TaxInclusiveAmount currencyID="COP">396000.00</cbc:TaxInclusiveAmount>\r\n\t\t<cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount>\r\n\t\t<cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount>\r\n\t\t<cbc:PrepaidAmount currencyID="COP">0.00</cbc:PrepaidAmount>\r\n\t\t<cbc:PayableAmount currencyID="COP">396000.00</cbc:PayableAmount>\r\n\t</cac:LegalMonetaryTotal>\r\n\t<cac:InvoiceLine>\r\n\t\t<cbc:ID>1</cbc:ID>\r\n\t\t<cbc:InvoicedQuantity unitCode="94">1</cbc:InvoicedQuantity>\r\n\t\t<cbc:LineExtensionAmount currencyID="COP">396000.00</cbc:LineExtensionAmount>\r\n\t\t<cbc:FreeOfChargeIndicator>false</cbc:FreeOfChargeIndicator>\r\n\t\t<cac:TaxTotal>\r\n\t\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t\t<cbc:RoundingAmount currencyID="COP">0.00</cbc:RoundingAmount>\r\n\t\t\t<cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator>\r\n\t\t\t<cac:TaxSubtotal>\r\n\t\t\t\t<cbc:TaxableAmount currencyID="COP">396000.00</cbc:TaxableAmount>\r\n\t\t\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t\t\t<cac:TaxCategory>\r\n\t\t\t\t\t<cbc:Percent>0.00</cbc:Percent>\r\n\t\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t\t</cac:TaxScheme>\r\n\t\t\t\t</cac:TaxCategory>\r\n\t\t\t</cac:TaxSubtotal>\r\n\t\t</cac:TaxTotal>\r\n\t\t<cac:Item>\r\n\t\t\t<cbc:Description>LICENCIA  KASPERSKY SMALL OFFICE SECURITY 8 / 10 DISPOSITIVOS / 1 SERVER / 1 AÑO / RENOVACIÓN (KL4541DDKFR)</cbc:Description>\r\n\t\t\t<cbc:AdditionalInformation></cbc:AdditionalInformation>\r\n\t\t\t<cac:SellersItemIdentification>\r\n\t\t\t\t<cbc:ID>6175400</cbc:ID>\r\n\t\t\t</cac:SellersItemIdentification>\r\n\t\t\t<cac:StandardItemIdentification>\r\n\t\t\t\t<cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">6175400</cbc:ID>\r\n\t\t\t</cac:StandardItemIdentification>\r\n\t\t\t<cac:OriginAddress>\r\n\t\t\t\t<cbc:ID></cbc:ID>\r\n\t\t\t</cac:OriginAddress>\r\n\t\t</cac:Item>\r\n\t\t<cac:Price>\r\n\t\t\t<cbc:PriceAmount currencyID="COP">396000.00</cbc:PriceAmount>\r\n\t\t\t<cbc:BaseQuantity unitCode="94">1</cbc:BaseQuantity>\r\n\t\t</cac:Price>\r\n\t</cac:InvoiceLine>\r\n</Invoice>]]></cbc:Description>\r\n\t\t</cac:ExternalReference>\r\n\t</cac:Attachment>\r\n\t<cac:ParentDocumentLineReference>\r\n\t\t<cbc:LineID>1</cbc:LineID>\r\n\t\t<cac:DocumentReference>\r\n\t\t\t<cbc:ID>POB41916</cbc:ID>\r\n\t\t\t<cbc:UUID schemeName="CUFE-SHA384">9bce35412d61e2410d8fd70067e1a5edd042237b1ebaa2c277a00d0555b79c9351d581b9dee60d44e6f4034cdc8761a2</cbc:UUID>\r\n\t\t\t<cbc:IssueDate>2026-06-17</cbc:IssueDate>\r\n\t\t\t<cbc:DocumentType>ApplicationResponse</cbc:DocumentType>\r\n\t\t\t<cac:Attachment>\r\n\t\t\t\t<cac:ExternalReference>\r\n\t\t\t\t\t<cbc:MimeCode>text/xml</cbc:MimeCode>\r\n\t\t\t\t\t<cbc:EncodingCode>UTF-8</cbc:EncodingCode>\r\n\t\t\t\t\t<cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\r\n  <ext:UBLExtensions>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent>\r\n        <sts:DianExtensions>\r\n          <sts:InvoiceSource>\r\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n          </sts:InvoiceSource>\r\n          <sts:SoftwareProvider>\r\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\r\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\r\n          </sts:SoftwareProvider>\r\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\r\n          <sts:AuthorizationProvider>\r\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\r\n          </sts:AuthorizationProvider>\r\n        </sts:DianExtensions>\r\n      </ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-9688eeaa-fc27-4d0d-96bd-c28b6ff61249"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-d1d285e5-6f13-46d4-8f70-e6ed8a06cbe2" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>nnrAvHjh5Uocp8LGfHIlxHAfFh8SGQFcRJyvW4yiAEo=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-9688eeaa-fc27-4d0d-96bd-c28b6ff61249-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>a+/MBUMcn4w+yKLV7zR4jcJJYVHm9cc9JAmKCUGJM+c=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-9688eeaa-fc27-4d0d-96bd-c28b6ff61249-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>uPpRVEJlcF+lifwp3GIWL5rZOIcc7BJvhcIb2ICqJw4=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-9688eeaa-fc27-4d0d-96bd-c28b6ff61249">Da7BppQY67Smlkoq7YgW4nXtGyO2tdhACpCOsW+fb7/cGuwRr7HsRRm8CXQRL4EUA0gQXQe0ZAzLTDvYq742/ymVujjTMdvhWxXDHymqzhrk3DiLWqMcNk2w9+dmiXZ2shoeSzPxQb8QlfAzlOH5jLkfoHRNiAwv7LvGkuN8hgdnkFDPjcChn78fJoD9XOSoj9R8YSmqdJxguMTtc9uceenfmxm4Aj040ujctJ6FdWRYdZcA0UNpDwPDanjyJIlietC0xMZ63JaCE8uRKspToS9t8s/Dgvl3Wgj8ukappH6S9vRu1YHt2R3SQ0cr1kn17KjoYFaPM7mlVEsBWuo8eQ==</ds:SignatureValue><ds:KeyInfo Id="Signature-9688eeaa-fc27-4d0d-96bd-c28b6ff61249-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-efbb59d2-84aa-471c-954b-e55f079ac8dd"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-46de390f-ed2e-4a19-ac7b-e18e1c7d032b" Target="#Signature-9688eeaa-fc27-4d0d-96bd-c28b6ff61249"><xades:SignedProperties Id="xmldsig-Signature-9688eeaa-fc27-4d0d-96bd-c28b6ff61249-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-17T12:54:06+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-d1d285e5-6f13-46d4-8f70-e6ed8a06cbe2"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n  </ext:UBLExtensions>\r\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n  <cbc:CustomizationID>1</cbc:CustomizationID>\r\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\r\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n  <cbc:ID>50586659</cbc:ID>\r\n  <cbc:UUID schemeName="CUDE-SHA384">86aee30a4824ea9407c38b7e53ce01be8381cc8c8f87aff1f0dc6b2800c9ea7e5453aad9cd88267be543dbc6bb23c56c</cbc:UUID>\r\n  <cbc:IssueDate>2026-06-17</cbc:IssueDate>\r\n  <cbc:IssueTime>12:54:06-05:00</cbc:IssueTime>\r\n  <cac:SenderParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:SenderParty>\r\n  <cac:ReceiverParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">900746054</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:ReceiverParty>\r\n  <cac:DocumentResponse>\r\n    <cac:Response>\r\n      <cbc:ResponseCode>02</cbc:ResponseCode>\r\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\r\n    </cac:Response>\r\n    <cac:DocumentReference>\r\n      <cbc:ID>POB41916</cbc:ID>\r\n      <cbc:UUID schemeName="CUFE-SHA384">9bce35412d61e2410d8fd70067e1a5edd042237b1ebaa2c277a00d0555b79c9351d581b9dee60d44e6f4034cdc8761a2</cbc:UUID>\r\n    </cac:DocumentReference>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>1</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\r\n        <cbc:Description>0</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>2</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\r\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>3</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>4</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n  </cac:DocumentResponse>\r\n</ApplicationResponse>]]></cbc:Description>\r\n\t\t\t\t</cac:ExternalReference>\r\n\t\t\t</cac:Attachment>\r\n\t\t\t<cac:ResultOfVerification>\r\n\t\t\t\t<cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID>\r\n\t\t\t\t<cbc:ValidationResultCode>02</cbc:ValidationResultCode>\r\n\t\t\t\t<cbc:ValidationDate>2026-06-17</cbc:ValidationDate>\r\n\t\t\t\t<cbc:ValidationTime>17:55:05-05:00</cbc:ValidationTime>\r\n\t\t\t</cac:ResultOfVerification>\r\n\t\t</cac:DocumentReference>\r\n\t</cac:ParentDocumentLineReference>\r\n</AttachedDocument>	\N	2026-07-03 10:28:03.881451
14	18	xml_invoice	VirtualTronic, fevt149159.xml	\N	<AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-7e790317-9264-4150-9e0f-10d16bc2e0cb" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-7e790317-9264-4150-9e0f-10d16bc2e0cb-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>EaUx8Lm7H3EM8SaodoYeZxV+bRKlKMxLekpcf83Jc84=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-7e790317-9264-4150-9e0f-10d16bc2e0cb-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>3t1S3FLcgHuRxkrCKdv/iWRl/wwwXff9w7zBKjaaVl8=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-7e790317-9264-4150-9e0f-10d16bc2e0cb-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>+bLxkpeNQaa5SEyaH2/bNMnJ9LXqvenNE73qbA2R8ko=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>o92DMycEnKV7X4fovJAUldT5to7tvXuyx7Piodti+C67zkfFg3DqnRtghh+VwN/3VErgpJ5aotUAiZC5NwDzbv69a3hP98a9Sl7AMLO19ZMddo8jyw6Wu3RB+N8I3GmlxSpMsm7ybYCeqlpVPHfZpvZngV9hrN705cE+U5OwM8baMYFu6gcDJwyVseao2tG7MYpVJ7mvhVhhgzszJ0b9CzckSEnoOhEHxSbDt9xkDzn+LuHbbRxPjag2e+XyDe7uaW4cMAVOHnDv4NE+c91OMKg04EKVQR6WDVoeaIVMbDcQEK/Uzo/cGIdEDnZwEDQY+QLrhGo4PbZUJ6UeGaUVqw==</ds:SignatureValue><ds:KeyInfo Id="id-7e790317-9264-4150-9e0f-10d16bc2e0cb-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-7e790317-9264-4150-9e0f-10d16bc2e0cb" Id="id-c8cbe7b9-da71-43fa-ab7b-a859a3783624" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-7e790317-9264-4150-9e0f-10d16bc2e0cb-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-17T14:45:16-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT149159</cbc:ID><cbc:IssueDate>2026-06-17</cbc:IssueDate><cbc:IssueTime>14:45:15-05:00</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>FEVT149159</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><sts:DianExtensions><sts:InvoiceControl><sts:InvoiceAuthorization>18764092754559</sts:InvoiceAuthorization><sts:AuthorizationPeriod><cbc:StartDate>2025-05-05</cbc:StartDate><cbc:EndDate>2027-05-05</cbc:EndDate></sts:AuthorizationPeriod><sts:AuthorizedInvoices><sts:Prefix>FEVT</sts:Prefix><sts:From>100001</sts:From><sts:To>1000000</sts:To></sts:AuthorizedInvoices></sts:InvoiceControl><sts:InvoiceSource><cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode></sts:InvoiceSource><sts:SoftwareProvider><sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="9" schemeName="31">810000630</sts:ProviderID><sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">06dbab9e-997b-4e16-a234-e48e27328c95</sts:SoftwareID></sts:SoftwareProvider><sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">4e83e35f1def9fe5ec2f147b20d64e5b0b4d4fb584d8605bd3a76d84f5c61512fa8ffc52ddb87d04b0457ea4f73bc2ba</sts:SoftwareSecurityCode><sts:AuthorizationProvider><sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID></sts:AuthorizationProvider><sts:QRCode>NroFactura=FEVT149159 NitFacturador=901217437 NitAdquiriente=71271339 FechaFactura=2026-06-17 HoraFactura=14:45:15-05:00 ValorFactura=81512.61 ValorIVA=15487.39 ValorOtrosImpuestos=0.00 ValorTotalFactura=97000.00 CUFE=https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=b8a99d1e67a92ea1be8d821d473b59890c898d5efb12a24feca1ce83e91cd48bd428f798578c354e5f24248bbcebffcb</sts:QRCode></sts:DianExtensions></ext:ExtensionContent></ext:UBLExtension><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-b806e744-eb11-4939-881d-94c717c8751d" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-b806e744-eb11-4939-881d-94c717c8751d-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>0BpUNeJcymlKeeD8q55bfVYIqsH9f813mfIeciVHXFI=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-b806e744-eb11-4939-881d-94c717c8751d-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>pkJR4QkKLwGL8qmdoPi8MhCzupSiYETEiSAQNKT4CSw=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-b806e744-eb11-4939-881d-94c717c8751d-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>Z54vOggWylTwbNW975s0uq2F6zdo39OVxxoj/jrsizA=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>zLBte2eAjKabY03sKALQ9Z6aCElTv1undaSvNDPO4vlG2YcgyELPM1RxSGauODSr/s3RkdBElKRM7QhaC7ovzy4aWvrkzltKhFDQzdcbw9WG3Kovvt11LoItxj8mU214X7TJ1IsPP0M2hhVYFRdYsnzqd+Bs4Kxc06Ef+oiEbS/0QmeMSm2l/B3fiZhBL06OZXzedyiTIaUvKqIBJa8hcfthULMItXtpdEbHcxvZvA/Y02MHov15hfYXZFsEj4z/oXa+0BOcyS4HnCIVadXCbrc2O+SDZtUHGih5xMZ026JWp67EEoM2RZ7LQ/KNASbh5RODXnN1R8w6bfZNlEIb4Q==</ds:SignatureValue><ds:KeyInfo Id="id-b806e744-eb11-4939-881d-94c717c8751d-keyinfo"><ds:X509Data><ds:X509Certificate>MIIH2TCCBcGgAwIBAgIIXRshm1fJC8UwDQYJKoZIhvcNAQELBQAwgbYxIzAhBgkqhkiG9w0BCQEWFGluZm9AYW5kZXNzY2QuY29tLmNvMSYwJAYDVQQDEx1DQSBBTkRFUyBTQ0QgUy5BLiBDbGFzZSBJSSB2MzEwMC4GA1UECxMnRGl2aXNpb24gZGUgY2VydGlmaWNhY2lvbiBlbnRpZGFkIGZpbmFsMRIwEAYDVQQKEwlBbmRlcyBTQ0QxFDASBgNVBAcTC0JvZ290YSBELkMuMQswCQYDVQQGEwJDTzAeFw0yNTA1MTkyMTQ3MjJaFw0yNzA1MTkyMTQ2MjJaMIIBLjEcMBoGA1UECQwTQ0FMTEUgNzAgIyAyMyBCIC0wODEiMCAGCSqGSIb3DQEJARYTYWRtaW5AY29udGFweW1lLmNvbTEVMBMGA1UEAxMMSU5TT0ZUIFMuQS5TMRMwEQYDVQQFEwo4MTAwMDA2MzA5MTYwNAYDVQQMEy1FbWlzb3IgRmFjdHVyYSBFbGVjdHJvbmljYSAtIFBlcnNvbmEgSnVyaWRpY2ExOzA5BgNVBAsTMkVtaXRpZG8gcG9yIEFuZGVzIFNDRCBBYyAyNiA2OSBDIDAzIFRvcnJlIEIgT2YgNzAxMRcwFQYDVQQKEw5TRURFIFBSSU5DSVBBTDESMBAGA1UEBxMJTUFOSVpBTEVTMQ8wDQYDVQQIEwZDQUxEQVMxCzAJBgNVBAYTAkNPMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9QIDAQABo4ICbjCCAmowDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBRA/iZpRzInMtGsIcgu7M+N1TVo6DBvBggrBgEFBQcBAQRjMGEwNgYIKwYBBQUHMAKGKmh0dHA6Ly9jZXJ0cy5hbmRlc3NjZC5jb20uY28vQ2xhc2VJSXYzLmNydDAnBggrBgEFBQcwAYYbaHR0cDovL29jc3AuYW5kZXNzY2QuY29tLmNvMB4GA1UdEQQXMBWBE2FkbWluQGNvbnRhcHltZS5jb20wggEdBgNVHSAEggEUMIIBEDCBwAYMKwYBBAGB9EgBAgYKMIGvMIGsBggrBgEFBQcCAjCBnwyBnExhIHV0aWxpemFjacOzbiBkZSBlc3RlIGNlcnRpZmljYWRvIGVzdMOhIHN1amV0YSBhIGxhIFBDIGRlIEZhY3R1cmFjacOzbiBFbGVjdHLDs25pY2EgeSBEUEMgZXN0YWJsZWNpZGFzIHBvciBBbmRlcyBTQ0QuIEPDs2RpZ28gZGUgQWNyZWRpdGFjacOzbjogMTYtRUNELTAwNDBLBgwrBgEEAYH0SAEBAQ0wOzA5BggrBgEFBQcCARYtaHR0cHM6Ly9hbmRlc3NjZC5jb20uY28vZG9jcy9EUENfQW5kZXNTQ0QucGRmMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDA5BgNVHR8EMjAwMC6gLKAqhihodHRwOi8vY3JsLmFuZGVzc2NkLmNvbS5jby9DbGFzZUlJdjMuY3JsMB0GA1UdDgQWBBSU38DcTZy2lzEpQF7HJxczPsO/mzAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggIBAKjKBZXKQr4Xlt1tvUwohE0LEHDqT9ZxTEmqoCO6tJHSt7kiLasopMe2hvXiKjSvfyNDir7STAg+FjIMZklASMzENrJNoJXI4gqwAQKOVGEkAlE3ur5QhUfXnZwCNZvQbkUvowRXckJJ2M0qtp9w38Lgpa16CujXcimX6kor3CvuolX+Wj8Tq+pqdatCGDov4EQAHV1HerztFw1iqzYR1pBPNeZ2+N7xxWIhgG0N0ESbxrowb2qM9UF43CIU2R2wwLme/vQY4ZDx8UITqeXeWEj9Zm02D3jWRmEYFegK09FEqPhnQJMgj2xNvXa/NFgRD7wGpcWTBxA+uiCE1eDZCcsQgA+oY8nadTw9lxOY2Yam7/GyxvYAkUfThc1+Rv94HRSPms/wDKwu/i9K/3BFWnw9V4gSP9JI8cpsf/MrlLAvuOv8s9a5qfjo3lU4rAdD/4jXRCCEy991jPUUQnNmgWGH3AYezwQR5z5z24rYTPRyM1dA0wRzMUsUif8Bx0GOQ5q61lj6cH9uiuhmQ8J7ROtPsCsu1TO9uYleEh0gTw3iUNLjouZOT1k4cBsm2BVI0AW59Y42Jg1NKFeH998mIM13mN8zU5yXy1vkZl91HZSGOoNtW8A6NVTxAeOxsC8aKi5CbuBJqevZfflpn9sq/dfc2qetMDVxEHJS5Mmv8YY2</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-b806e744-eb11-4939-881d-94c717c8751d" Id="id-5f086521-4050-45f4-8758-3f9c074a0fb5" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-b806e744-eb11-4939-881d-94c717c8751d-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-17T14:45:15-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>10</cbc:CustomizationID><cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT149159</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">b8a99d1e67a92ea1be8d821d473b59890c898d5efb12a24feca1ce83e91cd48bd428f798578c354e5f24248bbcebffcb</cbc:UUID><cbc:IssueDate>2026-06-17</cbc:IssueDate><cbc:IssueTime>14:45:15-05:00</cbc:IssueTime><cbc:DueDate>2026-06-17</cbc:DueDate><cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode><cbc:Note>Persona jurídica y asimiladas, Régimen ordinario de tributación, Responsable impuesto a las ventas, Agente retenedor (puede practicar retención) y Autorretención de renta (autorretención 0.55%\rFactura de CONTADO: Consignación bancaria.\r</cbc:Note><cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>1</cbc:LineCountNumeric><cac:AccountingSupplierParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cbc:IndustryClassificationCode>4741</cbc:IndustryClassificationCode><cac:PartyName><cbc:Name>VIRTUAL TRONIC SAS</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>FEVT</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:Telephone>604 431 0339</cbc:Telephone><cbc:ElectronicMail>info@virtualtronic.com.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cbc:AdditionalAccountID>2</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID schemeName="13">71271339</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name><cbc:Telephone>3134850115</cbc:Telephone><cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cac:DeliveryAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>05360</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:DeliveryAddress></cac:Delivery><cac:PaymentMeans><cbc:ID>1</cbc:ID><cbc:PaymentMeansCode>42</cbc:PaymentMeansCode></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="COP">15487.39</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">81512.61</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">15487.39</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">81512.61</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="COP">81512.60</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="COP">97000.00</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount><cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount><cbc:PrepaidAmount currencyID="COP">0.00</cbc:PrepaidAmount><cbc:PayableAmount currencyID="COP">97000.00</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="WSD">1.0000</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="COP">81512.61</cbc:LineExtensionAmount><cac:PricingReference><cac:AlternativeConditionPrice><cbc:PriceAmount currencyID="COP">97000.00</cbc:PriceAmount><cbc:PriceTypeCode/></cac:AlternativeConditionPrice></cac:PricingReference><cac:TaxTotal><cbc:TaxAmount currencyID="COP">15487.39</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">81512.60</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">15487.39</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Bateria Lenovo L16L2PB2 7.6V 4100mAh 2 Celdas</cbc:Description><cbc:PackSizeNumeric>0.00</cbc:PackSizeNumeric><cbc:BrandName>Lenovo</cbc:BrandName><cac:SellersItemIdentification><cbc:ID>LE L16L2PB2-2S1P</cbc:ID><cbc:ExtendedID/></cac:SellersItemIdentification><cac:StandardItemIdentification><cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">BLE-025</cbc:ID></cac:StandardItemIdentification></cac:Item><cac:Price><cbc:PriceAmount currencyID="COP">81512.61</cbc:PriceAmount><cbc:BaseQuantity unitCode="WSD">1.00</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>FEVT149159</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">b8a99d1e67a92ea1be8d821d473b59890c898d5efb12a24feca1ce83e91cd48bd428f798578c354e5f24248bbcebffcb</cbc:UUID><cbc:IssueDate>2026-06-17</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\n  <ext:UBLExtensions>\n    <ext:UBLExtension>\n      <ext:ExtensionContent>\n        <sts:DianExtensions>\n          <sts:InvoiceSource>\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\n          </sts:InvoiceSource>\n          <sts:SoftwareProvider>\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\n          </sts:SoftwareProvider>\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\n          <sts:AuthorizationProvider>\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\n          </sts:AuthorizationProvider>\n        </sts:DianExtensions>\n      </ext:ExtensionContent>\n    </ext:UBLExtension>\n    <ext:UBLExtension>\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-0ac81ed8-257e-4aa5-8732-df5088028f74"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="Reference-78832414-edf3-4183-86bd-4f25162d0544" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>QkW+HsP8mi6Hrtr5iiQxbLh5qr6aiIQ6+SFDSKevq5E=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-0ac81ed8-257e-4aa5-8732-df5088028f74-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>E5Q7F5fi1gDHN74D8P+ddHDAoVfriaWUwb0tvr4s+LY=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-0ac81ed8-257e-4aa5-8732-df5088028f74-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>e4JdFVRI9QIKA9Cua2yUj/0BnYa93Cc1KAdki4PTIBc=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-0ac81ed8-257e-4aa5-8732-df5088028f74">SgNInR+A7YhlEkbxylzdYgJZy73d9h9CjeSaNagpfzYag6ccc6lIEVcfLxKT3196aVoDkFMUecmnGdZEPMyNI9Awf54rZPcsIInZ6pJpghRKlVqqaM5ooScojjyf4sYlJkeCr9nzBN1+BXjM9A7pjKso5nn1Xc4A2c/LibR0oCyOIxp55eyp2Y29zdoRvlQIghRoYDl1TodFTRvblaXXRBu4vWX5tCn40uarIYs+ZADoiZJ6LWaktTs+1yDhwilQZXCiYiZWM4OKWhycNz6x1L44yaJAG/bZe6qLbgEYRRTzndGTsVIVNeJj9DPsK+geTBi+RMq72vvbTPumVE33cQ==</ds:SignatureValue><ds:KeyInfo Id="Signature-0ac81ed8-257e-4aa5-8732-df5088028f74-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-ddae9bb1-2707-47c2-ad9b-571e1b99ff4c"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-0d6c4707-9174-4197-876f-b1acbe805b78" Target="#Signature-0ac81ed8-257e-4aa5-8732-df5088028f74"><xades:SignedProperties Id="xmldsig-Signature-0ac81ed8-257e-4aa5-8732-df5088028f74-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-17T14:45:16+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description/></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-78832414-edf3-4183-86bd-4f25162d0544"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\n    </ext:UBLExtension>\n  </ext:UBLExtensions>\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n  <cbc:CustomizationID>1</cbc:CustomizationID>\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n  <cbc:ID>70307758</cbc:ID>\n  <cbc:UUID schemeName="CUDE-SHA384">7573a3ede0016ac7a8ec49a4309eab1f2c9c34b2de122ba80cdbe4c6ebdd2482e5275acc5d660b1fc00da7caab03556d</cbc:UUID>\n  <cbc:IssueDate>2026-06-17</cbc:IssueDate>\n  <cbc:IssueTime>14:45:16-05:00</cbc:IssueTime>\n  <cac:SenderParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:SenderParty>\n  <cac:ReceiverParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="6" schemeName="31">901217437</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:ReceiverParty>\n  <cac:DocumentResponse>\n    <cac:Response>\n      <cbc:ResponseCode>02</cbc:ResponseCode>\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\n    </cac:Response>\n    <cac:DocumentReference>\n      <cbc:ID>FEVT149159</cbc:ID>\n      <cbc:UUID schemeName="CUFE-SHA384">b8a99d1e67a92ea1be8d821d473b59890c898d5efb12a24feca1ce83e91cd48bd428f798578c354e5f24248bbcebffcb</cbc:UUID>\n    </cac:DocumentReference>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>1</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\n        <cbc:Description>0</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>2</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAW05</cbc:ResponseCode>\n        <cbc:Description>El valor de campo PriceTypeCode no se encuentra en la lista</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>3</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>4</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>5</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n  </cac:DocumentResponse>\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>02</cbc:ValidationResultCode><cbc:ValidationDate>2026-06-17</cbc:ValidationDate><cbc:ValidationTime>14:45:16-05:00</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-03 10:29:32.232503
15	19	xml_invoice	VirtualTronic, FEVT147751.xml	\N	<AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:data:specification:CoreComponentTypeSchemaModule:2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-48ca408a-20b1-486c-b463-232777413bba" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-48ca408a-20b1-486c-b463-232777413bba-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>Cgcr0gL3Yd16L4LKsaFL1zreJDLtzMRzvGq9rToBOwk=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-48ca408a-20b1-486c-b463-232777413bba-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>Y6TpqjnKDAoMQCJv5Upv+o0p239NapWPMtYuo6tvHRo=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-48ca408a-20b1-486c-b463-232777413bba-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>UyRcy6pwMQOhLnR4vpFnx5hHi8SE6/9jmcH1iitgNYk=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>xcxJpSLvV8CbSnZ/rRu7Bze9i9LiqCgGrj/BR8awCo4R8+cE4GDJvHWdjjgOjdAlDIEcOjBROgwdj7GxU9GYgivFO2nYs1r0ZnJAFdalBvWP2JEeZG7t47SGP0QSAxJRsmm1nVL0BKTyVu6d8iPVUEgiU5925phLBGvvBv83f8eRmHie1bSPpMYw1wI67H8lyvfhMX+0U5mF/HYUOMwsLSQ5u/j9ANemuSjYqtuSR5EipFlwx49fM7oFBfQLEbo0VM1yAaQYbj7mB/a09S7SNbcVz4dLMj6pbOUolsNh9HMQNiolT1Nc4COYvMIMaKPm5sQL2LWlrydG0T8SVbB9Kw==</ds:SignatureValue><ds:KeyInfo Id="id-48ca408a-20b1-486c-b463-232777413bba-keyinfo"><ds:X509Data><ds:X509Certificate>MIIH2TCCBcGgAwIBAgIIXRshm1fJC8UwDQYJKoZIhvcNAQELBQAwgbYxIzAhBgkqhkiG9w0BCQEWFGluZm9AYW5kZXNzY2QuY29tLmNvMSYwJAYDVQQDEx1DQSBBTkRFUyBTQ0QgUy5BLiBDbGFzZSBJSSB2MzEwMC4GA1UECxMnRGl2aXNpb24gZGUgY2VydGlmaWNhY2lvbiBlbnRpZGFkIGZpbmFsMRIwEAYDVQQKEwlBbmRlcyBTQ0QxFDASBgNVBAcTC0JvZ290YSBELkMuMQswCQYDVQQGEwJDTzAeFw0yNTA1MTkyMTQ3MjJaFw0yNzA1MTkyMTQ2MjJaMIIBLjEcMBoGA1UECQwTQ0FMTEUgNzAgIyAyMyBCIC0wODEiMCAGCSqGSIb3DQEJARYTYWRtaW5AY29udGFweW1lLmNvbTEVMBMGA1UEAxMMSU5TT0ZUIFMuQS5TMRMwEQYDVQQFEwo4MTAwMDA2MzA5MTYwNAYDVQQMEy1FbWlzb3IgRmFjdHVyYSBFbGVjdHJvbmljYSAtIFBlcnNvbmEgSnVyaWRpY2ExOzA5BgNVBAsTMkVtaXRpZG8gcG9yIEFuZGVzIFNDRCBBYyAyNiA2OSBDIDAzIFRvcnJlIEIgT2YgNzAxMRcwFQYDVQQKEw5TRURFIFBSSU5DSVBBTDESMBAGA1UEBxMJTUFOSVpBTEVTMQ8wDQYDVQQIEwZDQUxEQVMxCzAJBgNVBAYTAkNPMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9QIDAQABo4ICbjCCAmowDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBRA/iZpRzInMtGsIcgu7M+N1TVo6DBvBggrBgEFBQcBAQRjMGEwNgYIKwYBBQUHMAKGKmh0dHA6Ly9jZXJ0cy5hbmRlc3NjZC5jb20uY28vQ2xhc2VJSXYzLmNydDAnBggrBgEFBQcwAYYbaHR0cDovL29jc3AuYW5kZXNzY2QuY29tLmNvMB4GA1UdEQQXMBWBE2FkbWluQGNvbnRhcHltZS5jb20wggEdBgNVHSAEggEUMIIBEDCBwAYMKwYBBAGB9EgBAgYKMIGvMIGsBggrBgEFBQcCAjCBnwyBnExhIHV0aWxpemFjacOzbiBkZSBlc3RlIGNlcnRpZmljYWRvIGVzdMOhIHN1amV0YSBhIGxhIFBDIGRlIEZhY3R1cmFjacOzbiBFbGVjdHLDs25pY2EgeSBEUEMgZXN0YWJsZWNpZGFzIHBvciBBbmRlcyBTQ0QuIEPDs2RpZ28gZGUgQWNyZWRpdGFjacOzbjogMTYtRUNELTAwNDBLBgwrBgEEAYH0SAEBAQ0wOzA5BggrBgEFBQcCARYtaHR0cHM6Ly9hbmRlc3NjZC5jb20uY28vZG9jcy9EUENfQW5kZXNTQ0QucGRmMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDA5BgNVHR8EMjAwMC6gLKAqhihodHRwOi8vY3JsLmFuZGVzc2NkLmNvbS5jby9DbGFzZUlJdjMuY3JsMB0GA1UdDgQWBBSU38DcTZy2lzEpQF7HJxczPsO/mzAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggIBAKjKBZXKQr4Xlt1tvUwohE0LEHDqT9ZxTEmqoCO6tJHSt7kiLasopMe2hvXiKjSvfyNDir7STAg+FjIMZklASMzENrJNoJXI4gqwAQKOVGEkAlE3ur5QhUfXnZwCNZvQbkUvowRXckJJ2M0qtp9w38Lgpa16CujXcimX6kor3CvuolX+Wj8Tq+pqdatCGDov4EQAHV1HerztFw1iqzYR1pBPNeZ2+N7xxWIhgG0N0ESbxrowb2qM9UF43CIU2R2wwLme/vQY4ZDx8UITqeXeWEj9Zm02D3jWRmEYFegK09FEqPhnQJMgj2xNvXa/NFgRD7wGpcWTBxA+uiCE1eDZCcsQgA+oY8nadTw9lxOY2Yam7/GyxvYAkUfThc1+Rv94HRSPms/wDKwu/i9K/3BFWnw9V4gSP9JI8cpsf/MrlLAvuOv8s9a5qfjo3lU4rAdD/4jXRCCEy991jPUUQnNmgWGH3AYezwQR5z5z24rYTPRyM1dA0wRzMUsUif8Bx0GOQ5q61lj6cH9uiuhmQ8J7ROtPsCsu1TO9uYleEh0gTw3iUNLjouZOT1k4cBsm2BVI0AW59Y42Jg1NKFeH998mIM13mN8zU5yXy1vkZl91HZSGOoNtW8A6NVTxAeOxsC8aKi5CbuBJqevZfflpn9sq/dfc2qetMDVxEHJS5Mmv8YY2</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-48ca408a-20b1-486c-b463-232777413bba" Id="id-c48f3169-59bd-4d5e-84ff-0d98d0c08725" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-48ca408a-20b1-486c-b463-232777413bba-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-02T16:16:21-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID><cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT147751</cbc:ID><cbc:IssueDate>2026-06-02</cbc:IssueDate><cbc:IssueTime>16:16:20-05:00</cbc:IssueTime><cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType><cbc:ParentDocumentID>FEVT147751</cbc:ParentDocumentID><cac:SenderParty><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:SenderParty><cac:ReceiverParty><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode listName="No aplica">R-99-PN</cbc:TaxLevelCode><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme></cac:ReceiverParty><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd"><ext:UBLExtensions><ext:UBLExtension><ext:ExtensionContent><sts:DianExtensions><sts:InvoiceControl><sts:InvoiceAuthorization>18764092754559</sts:InvoiceAuthorization><sts:AuthorizationPeriod><cbc:StartDate>2025-05-05</cbc:StartDate><cbc:EndDate>2027-05-05</cbc:EndDate></sts:AuthorizationPeriod><sts:AuthorizedInvoices><sts:Prefix>FEVT</sts:Prefix><sts:From>100001</sts:From><sts:To>1000000</sts:To></sts:AuthorizedInvoices></sts:InvoiceControl><sts:InvoiceSource><cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode></sts:InvoiceSource><sts:SoftwareProvider><sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="9" schemeName="31">810000630</sts:ProviderID><sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">06dbab9e-997b-4e16-a234-e48e27328c95</sts:SoftwareID></sts:SoftwareProvider><sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">cc6e937e7e9cd10cf4f8d45551d90d2093da745cfb5c8227e039b05186ab2a906b5e5ad6f46b7d72357c534bd240ebdf</sts:SoftwareSecurityCode><sts:AuthorizationProvider><sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID></sts:AuthorizationProvider><sts:QRCode>NroFactura=FEVT147751 NitFacturador=901217437 NitAdquiriente=71271339 FechaFactura=2026-06-02 HoraFactura=16:16:20-05:00 ValorFactura=33613.45 ValorIVA=6386.55 ValorOtrosImpuestos=0.00 ValorTotalFactura=40000.00 CUFE=https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=4491ba86b72b4bc9686077aa5a6171d782761f50820cc8b17c5e582008f84c4488ff24792c52f658df30c5219d84a079</sts:QRCode></sts:DianExtensions></ext:ExtensionContent></ext:UBLExtension><ext:UBLExtension><ext:ExtensionContent><ds:Signature Id="id-64fdaf12-b00b-42a3-9846-9fdb05371662" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="id-64fdaf12-b00b-42a3-9846-9fdb05371662-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>gprqXJnLi8sXcCKZ5G0zu3xPxo64dehhWuoSkVhvrmk=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-64fdaf12-b00b-42a3-9846-9fdb05371662-keyinfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>Xf1hBOTYqO36bZgRC25eAP0k4NYAI05YSUT5jOzWpsI=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-64fdaf12-b00b-42a3-9846-9fdb05371662-signedprops" Type="http://uri.etsi.org/01903#SignedProperties"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>gnCV0S7W0NomwkYpiM+xCIYSsIOibZAK0ZeOaKyulZw=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>jJngk0o7nqqlOH6426rvI2bHg526d/Ga4/8YBt8vxN9XdXa6acRQOscKfkYEsunva41aI7B6yy5T280VIfdNHkPIWlt5+jyUNYTEPsEg5DK4I/fZW0VgEw4lK+4nmiusZqJC1I5qXWpaLDtRZgLp3wDBNaD4QJ3gDlLedECCLKu7m2xRTZboudGgqASCKCJ3YbYSF2MwOygNnhR3kuUfkucPEvultJNbyCmJ3unmmgclx+XFhJfX83e50YoLgOvfjJekTiZM0tRYZ2u2zbwOspuNDziMJOo9NK91sRfxgymu0ud0CPIhx2g2mXGe2mUHpK+SJGYwX3xH92HOlwiB8A==</ds:SignatureValue><ds:KeyInfo Id="id-64fdaf12-b00b-42a3-9846-9fdb05371662-keyinfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>0FCxEqtY/wSAYswOk08QVsdmYDQzpaM7sXYJLjRtgYcYewRlhAyHLVzXmP9yrv5uC9Qlfqr/mPnXw1lQvYCf+XawuO1CyS4OZdoweMiyeHO+X4H37aQyqnLpikYfsHoWaz7i3y3bZ+FIA+5EStsOvT/k02HC+c/d9t8WgNr7iNiBuu4q2SQsRDRYJUka3FRk2j09rfRlff53N+qouDf32vXZOnI8OBtrQ0D4d/M0xbYLAAr8h2Wz2tXhBb6c5R+r9VgVBm+KC7jtHimM8w9PqQqVnu1a4n3wievNux/8BOoubNSPulZlXt7Mlzbp3u3v3Pd/sL1wKXIVMDjEalO+9Q==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object><xades:QualifyingProperties Target="#id-64fdaf12-b00b-42a3-9846-9fdb05371662" Id="id-f1ba0390-0f19-4313-a9cf-b30f4cef3a1c" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"><xades:SignedProperties Id="id-64fdaf12-b00b-42a3-9846-9fdb05371662-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-02T16:16:20-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>WMbKKnb326bEFMxoQxvQAy2HtYzs+7eH++lAeFcOO4Y=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>E=info@andesscd.com.co, CN=CA ANDES SCD S.A. Clase II v3, OU=Division de certificacion entidad final, O=Andes SCD, L=Bogota D.C., C=CO</ds:X509IssuerName><ds:X509SerialNumber>6708993020974926789</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://s3.amazonaws.com/efactura.resources/politicadefirmav2.pdf</xades:Identifier><xades:Description>Política de firma para facturas electrónicas de la República de Colombia</xades:Description></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>third party</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent></ext:UBLExtension></ext:UBLExtensions><cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID><cbc:CustomizationID>10</cbc:CustomizationID><cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID><cbc:ProfileExecutionID>1</cbc:ProfileExecutionID><cbc:ID>FEVT147751</cbc:ID><cbc:UUID schemeID="1" schemeName="CUFE-SHA384">4491ba86b72b4bc9686077aa5a6171d782761f50820cc8b17c5e582008f84c4488ff24792c52f658df30c5219d84a079</cbc:UUID><cbc:IssueDate>2026-06-02</cbc:IssueDate><cbc:IssueTime>16:16:20-05:00</cbc:IssueTime><cbc:DueDate>2026-06-02</cbc:DueDate><cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode><cbc:Note>Persona jurídica y asimiladas, Régimen ordinario de tributación, Responsable impuesto a las ventas, Agente retenedor (puede practicar retención) y Autorretención de renta (autorretención 0.55%\rFactura de CONTADO: Efectivo.\r</cbc:Note><cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>1</cbc:LineCountNumeric><cac:AccountingSupplierParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cbc:IndustryClassificationCode>4741</cbc:IndustryClassificationCode><cac:PartyName><cbc:Name>VIRTUAL TRONIC SAS</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05001</cbc:ID><cbc:CityName>MEDELLÍN</cbc:CityName><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>Calle 48 D # 65a - 20</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="6" schemeName="31">901217437</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>FEVT</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:Telephone>604 431 0339</cbc:Telephone><cbc:ElectronicMail>info@virtualtronic.com.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cbc:AdditionalAccountID>2</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID schemeName="13">71271339</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID><cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>055410</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>ZZ</cbc:ID><cbc:Name>No aplica</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ANDRES BENTHAN MUNERA</cbc:RegistrationName><cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeName="13">71271339</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:Name>ANDRES BENTHAN MUNERA</cbc:Name><cbc:Telephone>3134850115</cbc:Telephone><cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cac:DeliveryAddress><cbc:ID>05360</cbc:ID><cbc:CityName>ITAGÜÍ</cbc:CityName><cbc:PostalZone>05360</cbc:PostalZone><cbc:CountrySubentity>Antioquia</cbc:CountrySubentity><cbc:CountrySubentityCode>05</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CL 42 A 55 A 28\n</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name languageID="es">Colombia</cbc:Name></cac:Country></cac:DeliveryAddress></cac:Delivery><cac:PaymentMeans><cbc:ID>1</cbc:ID><cbc:PaymentMeansCode>10</cbc:PaymentMeansCode><cbc:PaymentID>1</cbc:PaymentID></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="COP">6386.55</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">33613.45</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">6386.55</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">33613.45</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="COP">33613.45</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="COP">40000.00</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount><cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount><cbc:PrepaidAmount currencyID="COP">0.00</cbc:PrepaidAmount><cbc:PayableAmount currencyID="COP">40000.00</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="WSD">1.0000</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="COP">33613.45</cbc:LineExtensionAmount><cac:PricingReference><cac:AlternativeConditionPrice><cbc:PriceAmount currencyID="COP">40000.00</cbc:PriceAmount><cbc:PriceTypeCode/></cac:AlternativeConditionPrice></cac:PricingReference><cac:TaxTotal><cbc:TaxAmount currencyID="COP">6386.55</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="COP">33613.45</cbc:TaxableAmount><cbc:TaxAmount currencyID="COP">6386.55</cbc:TaxAmount><cac:TaxCategory><cbc:Percent>19.00</cbc:Percent><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Cargador Asus 19V 2.37A 45W VT-CHARGER 4.0*1.35</cbc:Description><cbc:PackSizeNumeric>0.00</cbc:PackSizeNumeric><cbc:BrandName>Asus</cbc:BrandName><cac:StandardItemIdentification><cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">AS06</cbc:ID></cac:StandardItemIdentification></cac:Item><cac:Price><cbc:PriceAmount currencyID="COP">33613.45</cbc:PriceAmount><cbc:BaseQuantity unitCode="WSD">1.00</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ParentDocumentLineReference><cbc:LineID>1</cbc:LineID><cac:DocumentReference><cbc:ID>FEVT147751</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">4491ba86b72b4bc9686077aa5a6171d782761f50820cc8b17c5e582008f84c4488ff24792c52f658df30c5219d84a079</cbc:UUID><cbc:IssueDate>2026-06-02</cbc:IssueDate><cbc:DocumentType>ApplicationResponse</cbc:DocumentType><cac:Attachment><cac:ExternalReference><cbc:MimeCode>text/xml</cbc:MimeCode><cbc:EncodingCode>UTF-8</cbc:EncodingCode><cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\n  <ext:UBLExtensions>\n    <ext:UBLExtension>\n      <ext:ExtensionContent>\n        <sts:DianExtensions>\n          <sts:InvoiceSource>\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\n          </sts:InvoiceSource>\n          <sts:SoftwareProvider>\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\n          </sts:SoftwareProvider>\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\n          <sts:AuthorizationProvider>\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\n          </sts:AuthorizationProvider>\n        </sts:DianExtensions>\n      </ext:ExtensionContent>\n    </ext:UBLExtension>\n    <ext:UBLExtension>\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-89b74a4c-e006-44ae-b4c0-3286cea87336"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference Id="Reference-fd8df064-b74f-43a5-9bad-619a622d5296" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>NWhHlSkBY8mmFDg6fdtz187dxZ0PVn5wf1QNMtIX01s=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-89b74a4c-e006-44ae-b4c0-3286cea87336-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>8UQsQmfEZPKDpn36L8fl37XFOGj1Q1hI4ArBFBUsQSU=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-89b74a4c-e006-44ae-b4c0-3286cea87336-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>yE8j7jotVUE9EMH/SlCL1pKgV7wQcAtzkTitc/v2IgQ=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-89b74a4c-e006-44ae-b4c0-3286cea87336">blu55gRmlg1p3XOjQ8zOWWWRCSvi/1bTrIzVpfdWm9UME261gvLskGxJBaB2KheXWbOh5oMnJfe34T4ReeNwF6dSTtGws4LqOJy1NwdjXpS9ACx45nnwNOAY0pE1wYbO9mzI5Q4xCayR+Z9nWHkzmqlK+jvkFKj4aXvWorL5ROQvj1zEInpJ668tS2d+pyvaBfVaOr/ON1ccKYjKqxgdYEjViKZOUNEIej5VMYeFlUB5q5xvWEnp2lc5OSCKFIhg9auO+oyirKisvL/B+Ais4d6A4FUbS7cxE6oOfdRwgAdEgzMhO04Hb4qZa7AkLK2xGaOs2ixgOfYcR0n94lygyw==</ds:SignatureValue><ds:KeyInfo Id="Signature-89b74a4c-e006-44ae-b4c0-3286cea87336-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-879f73a2-12a2-4305-a751-0d5d44ef0dde"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-b603d98d-980d-4a72-8319-f9b73e314411" Target="#Signature-89b74a4c-e006-44ae-b4c0-3286cea87336"><xades:SignedProperties Id="xmldsig-Signature-89b74a4c-e006-44ae-b4c0-3286cea87336-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-06-02T16:16:21+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description/></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-fd8df064-b74f-43a5-9bad-619a622d5296"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\n    </ext:UBLExtension>\n  </ext:UBLExtensions>\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\n  <cbc:CustomizationID>1</cbc:CustomizationID>\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\n  <cbc:ID>56228461</cbc:ID>\n  <cbc:UUID schemeName="CUDE-SHA384">6c4cb4d4e0079d0f2bea366a51cb6cee7838cf0bf5fba13a301196f5c76500357d8266ad4e51ffb5abfc4e1491c9d1a7</cbc:UUID>\n  <cbc:IssueDate>2026-06-02</cbc:IssueDate>\n  <cbc:IssueTime>16:16:21-05:00</cbc:IssueTime>\n  <cac:SenderParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:SenderParty>\n  <cac:ReceiverParty>\n    <cac:PartyTaxScheme>\n      <cbc:RegistrationName>VIRTUAL TRONIC SAS</cbc:RegistrationName>\n      <cbc:CompanyID schemeID="6" schemeName="31">901217437</cbc:CompanyID>\n      <cac:TaxScheme>\n        <cbc:ID>01</cbc:ID>\n        <cbc:Name>IVA</cbc:Name>\n      </cac:TaxScheme>\n    </cac:PartyTaxScheme>\n  </cac:ReceiverParty>\n  <cac:DocumentResponse>\n    <cac:Response>\n      <cbc:ResponseCode>02</cbc:ResponseCode>\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\n    </cac:Response>\n    <cac:DocumentReference>\n      <cbc:ID>FEVT147751</cbc:ID>\n      <cbc:UUID schemeName="CUFE-SHA384">4491ba86b72b4bc9686077aa5a6171d782761f50820cc8b17c5e582008f84c4488ff24792c52f658df30c5219d84a079</cbc:UUID>\n    </cac:DocumentReference>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>1</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\n        <cbc:Description>0</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>2</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAW05</cbc:ResponseCode>\n        <cbc:Description>El valor de campo PriceTypeCode no se encuentra en la lista</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>3</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>4</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n    <cac:LineResponse>\n      <cac:LineReference>\n        <cbc:LineID>5</cbc:LineID>\n      </cac:LineReference>\n      <cac:Response>\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\n      </cac:Response>\n    </cac:LineResponse>\n  </cac:DocumentResponse>\n</ApplicationResponse>]]></cbc:Description></cac:ExternalReference></cac:Attachment><cac:ResultOfVerification><cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID><cbc:ValidationResultCode>02</cbc:ValidationResultCode><cbc:ValidationDate>2026-06-02</cbc:ValidationDate><cbc:ValidationTime>16:16:21-05:00</cbc:ValidationTime></cac:ResultOfVerification></cac:DocumentReference></cac:ParentDocumentLineReference></AttachedDocument>	\N	2026-07-05 11:25:45.156031
16	20	xml_invoice	APC, POB42273.xml	\N	<?xml version="1.0" encoding="utf-8"?>\r\n<AttachedDocument xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2">\r\n\t<ext:UBLExtensions>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>4X8kJHw2gQZk+JCVuHEomLdd4/rURJyOwrkbfYWDbmA=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref1" URI="#KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>4o0yJ7pOlsMplx0WLgN59x7COSgZv4hJ8pSog1fcyOw=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>odZcIh0i+7vIzIkM+kiFvgzGr5fE/F+aRYmgDL60BnE=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-sigvalue">T3HymrJwIOfh2xyabe6iXsgGW0B3ySUY85Y5vJYV/Q841t2sbBU6n+7V0AeLnnCHZOox7azEtBHKvD5jotBuvLwsAzWXP6Rfh46atTSGjkq/ZA/7g+nvC6ndLFEs8/TFJA8Nt5Y2KtCSp6TeQBx8I1Uiv3qtyL80y93xzQew8HN2hZSYz1W9XrYamku8IXMLwa5poz3aDYMjzTEMZG4vKWjnVq5F1g+uSXkRi/LF0r/+LtQqWaGEN0keZkNQUHVe7EQ/Gh5kIu7SZBfVO6XXur6AwP0FiQg+vPn/IvpLfrNbjlr9OLosQdz4hlbdE3p9czcI2aUyT+QMGL4Sps054g==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></ds:X509IssuerSerial><ds:X509SubjectName>C=CO, S=ANTIOQUIA, L=MEDELLÍN, O=PRINCIPAL, OU=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701, T=Emisor Factura Electronica - Persona Juridica, SERIALNUMBER=9007460544, CN=@PC MAYORISTA S.A.S., E=SERVICIOALCLIENTE@HGI.COM.CO, STREET=CL 16 CR 45 85</ds:X509SubjectName><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" Target="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><xades:SignedProperties Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-07-10T12:14:44.234-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>no+kgqKFeGb4NWUIHHK8cEsKyBfzedZeQUBYVKyEqL4=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD.,OU=Division de certificacion entidad final,CN=CA ANDES SCD S.A. Clase II,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>Cs7emRwtXWVYHJrqS9eXEXfUcFyJJBqFhDFOetHu8ts=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>3184328748892787122</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>RLYziy/D+T4pgDLc65EboYLzIoC/iYCwrOCGzGo/MO0=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>6218172215901586992</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t</ext:UBLExtensions>\r\n\t<cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n\t<cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID>\r\n\t<cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID>\r\n\t<cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n\t<cbc:ID>POB422730</cbc:ID>\r\n\t<cbc:IssueDate>2026-07-10</cbc:IssueDate>\r\n\t<cbc:IssueTime>17:17:43-05:00</cbc:IssueTime>\r\n\t<cbc:DocumentTypeCode>Contenedor de Factura Electrónica</cbc:DocumentTypeCode>\r\n\t<cbc:ParentDocumentID>POB42273</cbc:ParentDocumentID>\r\n\t<cac:SenderParty>\r\n\t\t<cac:PartyTaxScheme>\r\n\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t<cbc:TaxLevelCode listName="2">R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t<cac:TaxScheme>\r\n\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t</cac:TaxScheme>\r\n\t\t</cac:PartyTaxScheme>\r\n\t</cac:SenderParty>\r\n\t<cac:ReceiverParty>\r\n\t\t<cac:PartyTaxScheme>\r\n\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t<cbc:TaxLevelCode listName="1">R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t<cac:TaxScheme>\r\n\t\t\t\t<cbc:ID>ZZ</cbc:ID>\r\n\t\t\t\t<cbc:Name>No aplica</cbc:Name>\r\n\t\t\t</cac:TaxScheme>\r\n\t\t</cac:PartyTaxScheme>\r\n\t</cac:ReceiverParty>\r\n\t<cac:Attachment>\r\n\t\t<cac:ExternalReference>\r\n\t\t\t<cbc:MimeCode>text/xml</cbc:MimeCode>\r\n\t\t\t<cbc:EncodingCode>UTF-8</cbc:EncodingCode>\r\n\t\t\t<cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8"?>\r\n<Invoice xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">\r\n\t<ext:UBLExtensions>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent>\r\n\t\t\t\t<sts:DianExtensions xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1">\r\n\t\t\t\t\t<sts:InvoiceControl>\r\n\t\t\t\t\t\t<sts:InvoiceAuthorization>18764098255081</sts:InvoiceAuthorization>\r\n\t\t\t\t\t\t<sts:AuthorizationPeriod>\r\n\t\t\t\t\t\t\t<cbc:StartDate>2025-09-05</cbc:StartDate>\r\n\t\t\t\t\t\t\t<cbc:EndDate>2027-09-05</cbc:EndDate>\r\n\t\t\t\t\t\t</sts:AuthorizationPeriod>\r\n\t\t\t\t\t\t<sts:AuthorizedInvoices>\r\n\t\t\t\t\t\t\t<sts:Prefix>POB</sts:Prefix>\r\n\t\t\t\t\t\t\t<sts:From>37973</sts:From>\r\n\t\t\t\t\t\t\t<sts:To>100000</sts:To>\r\n\t\t\t\t\t\t</sts:AuthorizedInvoices>\r\n\t\t\t\t\t</sts:InvoiceControl>\r\n\t\t\t\t\t<sts:InvoiceSource>\r\n\t\t\t\t\t\t<cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n\t\t\t\t\t</sts:InvoiceSource>\r\n\t\t\t\t\t<sts:SoftwareProvider>\r\n\t\t\t\t\t\t<sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">811021438</sts:ProviderID>\r\n\t\t\t\t\t\t<sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">def923e2-8326-42e2-a022-d0fa4a2f8188</sts:SoftwareID>\r\n\t\t\t\t\t</sts:SoftwareProvider>\r\n\t\t\t\t\t<sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">ba18c9a8de5abbb418c088c4a15edc58f12af56bd6ce2614da7d24732f84cc8429b88ff5f0ff443b4145f4a4b0a61cf6</sts:SoftwareSecurityCode>\r\n\t\t\t\t\t<sts:AuthorizationProvider>\r\n\t\t\t\t\t\t<sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID>\r\n\t\t\t\t\t</sts:AuthorizationProvider>\r\n\t\t\t\t\t<sts:QRCode>https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=1000c48b5f14f5a604970b17fd1717ad04e5438218362423cd3a3a3ea31151f4b0aa769496d22b7235541b7fac224c7f</sts:QRCode>\r\n\t\t\t\t</sts:DianExtensions>\r\n\t\t\t</ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t\t<ext:UBLExtension>\r\n\t\t\t<ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref0" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>OfPHp5v1iNJ5xB1fwB8xPrrJkuB62YN5prLcIMvhXsA=</ds:DigestValue></ds:Reference><ds:Reference Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-ref1" URI="#KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>myqPbIAsspfTO7SjX/SJ291aSjYwWZSaX0GLcbwDoAA=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>ZN5Y1lrt/2y4hkaUItKKc7kukJGa38e8b3P9Qdr9SdM=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-sigvalue">f93gCeVCGs4c0whC+tznzZO6F5C7Gau/gRgsoGESDwqfX5UZrJBeK5hKMkrzqwco7JM2uVXMYazu1HdwTToXXNKzea4WIhjJGKMy3cSyscfQs5pNluPygNpoif2DhO/yv1xvfnWusKw6C8aQy8iGyUgJa86QQM38PkOz+LqIkD9/Xm0Ppa3wR/46USssZZ9/JAb6X9oRLDJ2rlnyeeQNs+B/9sbttdEPfHfnuNCTW9pTU8Y97YKMg6r2ALHhyRjcR2cWAf4FgNZY8GFhDu5Kfgmsw2DBUCMexhS+EeMx8EQd6xV1Fy1R/eXM1JERP9hTGlVviaOSd/xWtbo3jAr5dg==</ds:SignatureValue><ds:KeyInfo Id="KeyInfo"><ds:X509Data><ds:X509IssuerSerial><ds:X509IssuerName>C=CO, L=Bogota D.C., O=Andes SCD, OU=Division de certificacion entidad final, CN=CA ANDES SCD S.A. Clase II v3, E=info@andesscd.com.co</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></ds:X509IssuerSerial><ds:X509SubjectName>C=CO, S=ANTIOQUIA, L=MEDELLÍN, O=PRINCIPAL, OU=Emitido por Andes SCD Ac 26 69 C 03 Torre B Of 701, T=Emisor Factura Electronica - Persona Juridica, SERIALNUMBER=9007460544, CN=@PC MAYORISTA S.A.S., E=SERVICIOALCLIENTE@HGI.COM.CO, STREET=CL 16 CR 45 85</ds:X509SubjectName><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo><ds:Object><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" Target="#xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a"><xades:SignedProperties Id="xmldsig-ab2df1fb-1819-413d-8b8c-79e9ed75638a-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-07-10T12:14:43.358-05:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>no+kgqKFeGb4NWUIHHK8cEsKyBfzedZeQUBYVKyEqL4=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD.,OU=Division de certificacion entidad final,CN=CA ANDES SCD S.A. Clase II,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>242107049050726278</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>Cs7emRwtXWVYHJrqS9eXEXfUcFyJJBqFhDFOetHu8ts=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>3184328748892787122</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>RLYziy/D+T4pgDLc65EboYLzIoC/iYCwrOCGzGo/MO0=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=CO,L=Bogota D.C.,O=Andes SCD,OU=Division de certificacion,CN=ROOT CA ANDES SCD S.A.,1.2.840.113549.1.9.1=#1614696e666f40616e6465737363642e636f6d2e636f</ds:X509IssuerName><ds:X509SerialNumber>6218172215901586992</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n\t\t</ext:UBLExtension>\r\n\t</ext:UBLExtensions>\r\n\t<cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n\t<cbc:CustomizationID>10</cbc:CustomizationID>\r\n\t<cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID>\r\n\t<cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n\t<cbc:ID>POB42273</cbc:ID>\r\n\t<cbc:UUID schemeID="1" schemeName="CUFE-SHA384">1000c48b5f14f5a604970b17fd1717ad04e5438218362423cd3a3a3ea31151f4b0aa769496d22b7235541b7fac224c7f</cbc:UUID>\r\n\t<cbc:IssueDate>2026-07-10</cbc:IssueDate>\r\n\t<cbc:IssueTime>10:39:29-05:00</cbc:IssueTime>\r\n\t<cbc:DueDate>2026-07-11</cbc:DueDate>\r\n\t<cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>\r\n\t<cbc:Note> 18764098255081 de 2025-09-05 del POB-37973 al POB-100000</cbc:Note>\r\n\t<cbc:Note>Transferencia</cbc:Note>\r\n\t<cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>\r\n\t<cbc:LineCountNumeric>1</cbc:LineCountNumeric>\r\n\t<cac:InvoicePeriod>\r\n\t\t<cbc:StartDate>2026-07-01</cbc:StartDate>\r\n\t\t<cbc:EndDate>2026-07-31</cbc:EndDate>\r\n\t</cac:InvoicePeriod>\r\n\t<cac:OrderReference>\r\n\t\t<cbc:ID>0</cbc:ID>\r\n\t</cac:OrderReference>\r\n\t<cac:DespatchDocumentReference>\r\n\t\t<cbc:ID>0</cbc:ID>\r\n\t</cac:DespatchDocumentReference>\r\n\t<cac:AccountingSupplierParty>\r\n\t\t<cbc:AdditionalAccountID schemeAgencyID="195">1</cbc:AdditionalAccountID>\r\n\t\t<cac:Party>\r\n\t\t\t<cbc:IndustryClassificationCode>4652</cbc:IndustryClassificationCode>\r\n\t\t\t<cac:PartyName>\r\n\t\t\t\t<cbc:Name>@PC MAYORISTA S.A.S</cbc:Name>\r\n\t\t\t</cac:PartyName>\r\n\t\t\t<cac:PhysicalLocation>\r\n\t\t\t\t<cac:Address>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>050001</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CRA 51 51 17 ED HENRY LOCAL 210</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:Address>\r\n\t\t\t</cac:PhysicalLocation>\r\n\t\t\t<cac:PartyTaxScheme>\r\n\t\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t\t<cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t\t<cac:RegistrationAddress>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>050001</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CRA 51 51 17 ED HENRY LOCAL 210</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:RegistrationAddress>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:PartyTaxScheme>\r\n\t\t\t<cac:PartyLegalEntity>\r\n\t\t\t\t<cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">900746054</cbc:CompanyID>\r\n\t\t\t\t<cac:CorporateRegistrationScheme>\r\n\t\t\t\t\t<cbc:ID>POB</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>0</cbc:Name>\r\n\t\t\t\t</cac:CorporateRegistrationScheme>\r\n\t\t\t</cac:PartyLegalEntity>\r\n\t\t\t<cac:Contact>\r\n\t\t\t\t<cbc:Telephone>5116179</cbc:Telephone>\r\n\t\t\t\t<cbc:ElectronicMail>facturacion.electronica@apcmayorista.com</cbc:ElectronicMail>\r\n\t\t\t</cac:Contact>\r\n\t\t</cac:Party>\r\n\t</cac:AccountingSupplierParty>\r\n\t<cac:AccountingCustomerParty>\r\n\t\t<cbc:AdditionalAccountID>2</cbc:AdditionalAccountID>\r\n\t\t<cac:Party>\r\n\t\t\t<cac:PartyIdentification>\r\n\t\t\t\t<cbc:ID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)">71271339</cbc:ID>\r\n\t\t\t</cac:PartyIdentification>\r\n\t\t\t<cac:PartyName>\r\n\t\t\t\t<cbc:Name>BENTHAN MUNERA ANDRES</cbc:Name>\r\n\t\t\t</cac:PartyName>\r\n\t\t\t<cac:PhysicalLocation>\r\n\t\t\t\t<cac:Address>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>055410</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CL 42 A 55 A 15</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:Address>\r\n\t\t\t</cac:PhysicalLocation>\r\n\t\t\t<cac:PartyTaxScheme>\r\n\t\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t\t<cbc:TaxLevelCode>R-99-PN</cbc:TaxLevelCode>\r\n\t\t\t\t<cac:RegistrationAddress>\r\n\t\t\t\t\t<cbc:ID>05001</cbc:ID>\r\n\t\t\t\t\t<cbc:CityName>Medellín</cbc:CityName>\r\n\t\t\t\t\t<cbc:PostalZone>055410</cbc:PostalZone>\r\n\t\t\t\t\t<cbc:CountrySubentity>Antioquia</cbc:CountrySubentity>\r\n\t\t\t\t\t<cbc:CountrySubentityCode>05</cbc:CountrySubentityCode>\r\n\t\t\t\t\t<cac:AddressLine>\r\n\t\t\t\t\t\t<cbc:Line>CL 42 A 55 A 15</cbc:Line>\r\n\t\t\t\t\t</cac:AddressLine>\r\n\t\t\t\t\t<cac:Country>\r\n\t\t\t\t\t\t<cbc:IdentificationCode>CO</cbc:IdentificationCode>\r\n\t\t\t\t\t\t<cbc:Name languageID="es">Colombia</cbc:Name>\r\n\t\t\t\t\t</cac:Country>\r\n\t\t\t\t</cac:RegistrationAddress>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>ZZ</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>No aplica</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:PartyTaxScheme>\r\n\t\t\t<cac:PartyLegalEntity>\r\n\t\t\t\t<cbc:RegistrationName>BENTHAN MUNERA ANDRES</cbc:RegistrationName>\r\n\t\t\t\t<cbc:CompanyID schemeID="1" schemeName="13" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">71271339</cbc:CompanyID>\r\n\t\t\t\t<cac:CorporateRegistrationScheme>\r\n\t\t\t\t\t<cbc:Name>0</cbc:Name>\r\n\t\t\t\t</cac:CorporateRegistrationScheme>\r\n\t\t\t</cac:PartyLegalEntity>\r\n\t\t\t<cac:Contact>\r\n\t\t\t\t<cbc:Telephone>3715726</cbc:Telephone>\r\n\t\t\t\t<cbc:ElectronicMail>andresbenthan@gmail.com</cbc:ElectronicMail>\r\n\t\t\t</cac:Contact>\r\n\t\t\t<cac:Person>\r\n\t\t\t\t<cbc:FirstName>ANDRES</cbc:FirstName>\r\n\t\t\t\t<cbc:FamilyName>BENTHAN MUNERA</cbc:FamilyName>\r\n\t\t\t\t<cbc:MiddleName />\r\n\t\t\t</cac:Person>\r\n\t\t</cac:Party>\r\n\t</cac:AccountingCustomerParty>\r\n\t<cac:TaxRepresentativeParty>\r\n\t\t<cac:PartyIdentification>\r\n\t\t\t<cbc:ID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">811021438</cbc:ID>\r\n\t\t</cac:PartyIdentification>\r\n\t</cac:TaxRepresentativeParty>\r\n\t<cac:PaymentMeans>\r\n\t\t<cbc:ID>2</cbc:ID>\r\n\t\t<cbc:PaymentMeansCode>1</cbc:PaymentMeansCode>\r\n\t\t<cbc:PaymentDueDate>2026-07-11</cbc:PaymentDueDate>\r\n\t\t<cbc:PaymentID>12345</cbc:PaymentID>\r\n\t</cac:PaymentMeans>\r\n\t<cac:PaymentTerms>\r\n\t\t<cbc:ID>1</cbc:ID>\r\n\t\t<cbc:PaymentMeansID>1</cbc:PaymentMeansID>\r\n\t\t<cbc:Note>Cuota 1 de 1</cbc:Note>\r\n\t\t<cbc:Amount currencyID="COP">164000.00000</cbc:Amount>\r\n\t\t<cbc:PaymentDueDate>2026-07-11</cbc:PaymentDueDate>\r\n\t</cac:PaymentTerms>\r\n\t<cac:TaxTotal>\r\n\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t<cbc:RoundingAmount currencyID="COP">0.00</cbc:RoundingAmount>\r\n\t\t<cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator>\r\n\t\t<cac:TaxSubtotal>\r\n\t\t\t<cbc:TaxableAmount currencyID="COP">164000.00</cbc:TaxableAmount>\r\n\t\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t\t<cac:TaxCategory>\r\n\t\t\t\t<cbc:Percent>0.00</cbc:Percent>\r\n\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t</cac:TaxScheme>\r\n\t\t\t</cac:TaxCategory>\r\n\t\t</cac:TaxSubtotal>\r\n\t</cac:TaxTotal>\r\n\t<cac:LegalMonetaryTotal>\r\n\t\t<cbc:LineExtensionAmount currencyID="COP">164000.00</cbc:LineExtensionAmount>\r\n\t\t<cbc:TaxExclusiveAmount currencyID="COP">164000.00</cbc:TaxExclusiveAmount>\r\n\t\t<cbc:TaxInclusiveAmount currencyID="COP">164000.00</cbc:TaxInclusiveAmount>\r\n\t\t<cbc:AllowanceTotalAmount currencyID="COP">0.00</cbc:AllowanceTotalAmount>\r\n\t\t<cbc:ChargeTotalAmount currencyID="COP">0.00</cbc:ChargeTotalAmount>\r\n\t\t<cbc:PrepaidAmount currencyID="COP">0.00</cbc:PrepaidAmount>\r\n\t\t<cbc:PayableAmount currencyID="COP">164000.00</cbc:PayableAmount>\r\n\t</cac:LegalMonetaryTotal>\r\n\t<cac:InvoiceLine>\r\n\t\t<cbc:ID>1</cbc:ID>\r\n\t\t<cbc:InvoicedQuantity unitCode="94">1</cbc:InvoicedQuantity>\r\n\t\t<cbc:LineExtensionAmount currencyID="COP">164000.00</cbc:LineExtensionAmount>\r\n\t\t<cbc:FreeOfChargeIndicator>false</cbc:FreeOfChargeIndicator>\r\n\t\t<cac:TaxTotal>\r\n\t\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t\t<cbc:RoundingAmount currencyID="COP">0.00</cbc:RoundingAmount>\r\n\t\t\t<cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator>\r\n\t\t\t<cac:TaxSubtotal>\r\n\t\t\t\t<cbc:TaxableAmount currencyID="COP">164000.00</cbc:TaxableAmount>\r\n\t\t\t\t<cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>\r\n\t\t\t\t<cac:TaxCategory>\r\n\t\t\t\t\t<cbc:Percent>0.00</cbc:Percent>\r\n\t\t\t\t\t<cac:TaxScheme>\r\n\t\t\t\t\t\t<cbc:ID>01</cbc:ID>\r\n\t\t\t\t\t\t<cbc:Name>IVA</cbc:Name>\r\n\t\t\t\t\t</cac:TaxScheme>\r\n\t\t\t\t</cac:TaxCategory>\r\n\t\t\t</cac:TaxSubtotal>\r\n\t\t</cac:TaxTotal>\r\n\t\t<cac:Item>\r\n\t\t\t<cbc:Description>LICENCIA KASPERSKY PLUS / 5 DISPOSITIVOS / 1 AÑO / BASE (KL1042DDEFS)</cbc:Description>\r\n\t\t\t<cbc:AdditionalInformation></cbc:AdditionalInformation>\r\n\t\t\t<cac:SellersItemIdentification>\r\n\t\t\t\t<cbc:ID>6175493</cbc:ID>\r\n\t\t\t</cac:SellersItemIdentification>\r\n\t\t\t<cac:StandardItemIdentification>\r\n\t\t\t\t<cbc:ID schemeID="999" schemeName="Estándar de adopción del contribuyente">6175493</cbc:ID>\r\n\t\t\t</cac:StandardItemIdentification>\r\n\t\t\t<cac:OriginAddress>\r\n\t\t\t\t<cbc:ID></cbc:ID>\r\n\t\t\t</cac:OriginAddress>\r\n\t\t</cac:Item>\r\n\t\t<cac:Price>\r\n\t\t\t<cbc:PriceAmount currencyID="COP">164000.00</cbc:PriceAmount>\r\n\t\t\t<cbc:BaseQuantity unitCode="94">1</cbc:BaseQuantity>\r\n\t\t</cac:Price>\r\n\t</cac:InvoiceLine>\r\n</Invoice>]]></cbc:Description>\r\n\t\t</cac:ExternalReference>\r\n\t</cac:Attachment>\r\n\t<cac:ParentDocumentLineReference>\r\n\t\t<cbc:LineID>1</cbc:LineID>\r\n\t\t<cac:DocumentReference>\r\n\t\t\t<cbc:ID>POB42273</cbc:ID>\r\n\t\t\t<cbc:UUID schemeName="CUFE-SHA384">1000c48b5f14f5a604970b17fd1717ad04e5438218362423cd3a3a3ea31151f4b0aa769496d22b7235541b7fac224c7f</cbc:UUID>\r\n\t\t\t<cbc:IssueDate>2026-07-10</cbc:IssueDate>\r\n\t\t\t<cbc:DocumentType>ApplicationResponse</cbc:DocumentType>\r\n\t\t\t<cac:Attachment>\r\n\t\t\t\t<cac:ExternalReference>\r\n\t\t\t\t\t<cbc:MimeCode>text/xml</cbc:MimeCode>\r\n\t\t\t\t\t<cbc:EncodingCode>UTF-8</cbc:EncodingCode>\r\n\t\t\t\t\t<cbc:Description><![CDATA[<?xml version="1.0" encoding="utf-8" standalone="no"?><ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">\r\n  <ext:UBLExtensions>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent>\r\n        <sts:DianExtensions>\r\n          <sts:InvoiceSource>\r\n            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>\r\n          </sts:InvoiceSource>\r\n          <sts:SoftwareProvider>\r\n            <sts:ProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:ProviderID>\r\n            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareID>\r\n          </sts:SoftwareProvider>\r\n          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">...</sts:SoftwareSecurityCode>\r\n          <sts:AuthorizationProvider>\r\n            <sts:AuthorizationProviderID schemeID="4" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">800197268</sts:AuthorizationProviderID>\r\n          </sts:AuthorizationProvider>\r\n        </sts:DianExtensions>\r\n      </ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n    <ext:UBLExtension>\r\n      <ext:ExtensionContent><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-e7b0e4c9-ad7f-40e5-b04f-bd4e49aa71e1"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-bc460b93-63f3-42e8-8ba3-d18c55823798" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>AUeTLSp/52DA8vubJ2Kv6UHenoP8r8nWAuMmEZ4lxAk=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#Signature-e7b0e4c9-ad7f-40e5-b04f-bd4e49aa71e1-KeyInfo"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>FXWlektC3hCEWstBiTEdBY7ddfCzVb6sSqz/8h3RAmA=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-Signature-e7b0e4c9-ad7f-40e5-b04f-bd4e49aa71e1-signedprops"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>QuQpUfyXosheMBZAgvch+MG7z/AOq0I++stBnss5HgI=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-e7b0e4c9-ad7f-40e5-b04f-bd4e49aa71e1">VfSDWpf6YWXqEA3D7Nl/0ppgraArBhJCFtQxtNmPj+5ItHNB8k573Mhk5F7zBEDHmF5nvDIxb0N7NQKEvVI9q0EyYzPhE05lA2KjoQuT72Wg9l5uQiuUKxEYuTB7NFSQYrsg/6C6PoRqEhuJkzPgUGQ8tyhPCsVE9uKsD/bGFD3q3hdy3Cx5C+/zPNsabnLzCG5EW47qM6dcRsJywk+i5Oni7wuj0keB3rnqQ8DtSN+tZTOEYhyT2XwOYDcR+R0BCYb2NNX+rZERazqR3DDmp4RZeVh6Sf/Go+6xQSN7tkT2SSP8X9yVORQ+bq65pcq6A4N3k4eALeeurhjVV1vbrA==</ds:SignatureValue><ds:KeyInfo Id="Signature-e7b0e4c9-ad7f-40e5-b04f-bd4e49aa71e1-KeyInfo"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>mHDB0j0kiTFPi1kD6jcJ/Ypwcl4m3Qg0i+s1IB9atBk89Dj0o0QHMhTNqBpVLIjp+5Szvs6glnVDAXQzeajaLKgyb1KnAaz7DvF6coN4i1VvBRSFnoI2cs8BgOdxcU/aOLQTrDUgML405AXIMLuTIqSStq5OVD/BvPZU/5sD1co4s5evZShNRv0xVLkKpR7+ACqpdbfvrIVdq8ljY7Do/OmWDSz2duJ3JXeXrSMpPJ2ITI/acOGsjs+MV5Po0p71OsQCB/b4Mpkt7d5CX8XKeyZywRkk/93hWDcBaGkn0X8dqrgYJTBdfsBHXjC+ZjOmD5w+sRzsq+6eRVAKNcpBJQ==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-5b42e0e6-42c4-4c7f-b640-5d4fdd0dc399"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-2fed0854-552d-4f36-a9bf-b08b42c3a419" Target="#Signature-e7b0e4c9-ad7f-40e5-b04f-bd4e49aa71e1"><xades:SignedProperties Id="xmldsig-Signature-e7b0e4c9-ad7f-40e5-b04f-bd4e49aa71e1-signedprops"><xades:SignedSignatureProperties><xades:SigningTime>2026-07-10T12:15:43+00:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>/Kv9kFH+mV9JU3HrYscYDkvN9Ovhdd47L3sm5RsgcUk=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=OlimpiaIT ECD Sub, O=OlimpiaIT, OU=OlimpiaIT ECD, E=servicioalcliente@olimpiait.com, C=CO, S=Bogotá D.C., L=Bogotá D.C., STREET=See current address at https://micertificado.olimpiait.com, OID.2.5.4.45=900032774-4, SERIALNUMBER=900032774-4</ds:X509IssuerName><ds:X509SerialNumber>89407279672106850539243115121212403761</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate><xades:SignaturePolicyIdentifier><xades:SignaturePolicyId><xades:SigPolicyId><xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier><xades:Description /></xades:SigPolicyId><xades:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>dMoMvtcG5aIzgYo0tIsSQeVJBDnUnfSOfBpxXrmor0Y=</ds:DigestValue></xades:SigPolicyHash></xades:SignaturePolicyId></xades:SignaturePolicyIdentifier><xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>supplier</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-bc460b93-63f3-42e8-8ba3-d18c55823798"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></ext:ExtensionContent>\r\n    </ext:UBLExtension>\r\n  </ext:UBLExtensions>\r\n  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>\r\n  <cbc:CustomizationID>1</cbc:CustomizationID>\r\n  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>\r\n  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>\r\n  <cbc:ID>12117372</cbc:ID>\r\n  <cbc:UUID schemeName="CUDE-SHA384">287a0a8979898251f3620fc18821c4dfefc847fd3991e97349e8aebf35e48051cd8f1a0871967c8eb692aec4bfbf2fe6</cbc:UUID>\r\n  <cbc:IssueDate>2026-07-10</cbc:IssueDate>\r\n  <cbc:IssueTime>12:15:43-05:00</cbc:IssueTime>\r\n  <cac:SenderParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:SenderParty>\r\n  <cac:ReceiverParty>\r\n    <cac:PartyTaxScheme>\r\n      <cbc:RegistrationName>@PC MAYORISTA S.A.S</cbc:RegistrationName>\r\n      <cbc:CompanyID schemeID="4" schemeName="31">900746054</cbc:CompanyID>\r\n      <cac:TaxScheme>\r\n        <cbc:ID>01</cbc:ID>\r\n        <cbc:Name>IVA</cbc:Name>\r\n      </cac:TaxScheme>\r\n    </cac:PartyTaxScheme>\r\n  </cac:ReceiverParty>\r\n  <cac:DocumentResponse>\r\n    <cac:Response>\r\n      <cbc:ResponseCode>02</cbc:ResponseCode>\r\n      <cbc:Description>Documento validado por la DIAN</cbc:Description>\r\n    </cac:Response>\r\n    <cac:DocumentReference>\r\n      <cbc:ID>POB42273</cbc:ID>\r\n      <cbc:UUID schemeName="CUFE-SHA384">1000c48b5f14f5a604970b17fd1717ad04e5438218362423cd3a3a3ea31151f4b0aa769496d22b7235541b7fac224c7f</cbc:UUID>\r\n    </cac:DocumentReference>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>1</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>0000</cbc:ResponseCode>\r\n        <cbc:Description>0</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>2</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>FAJ43b</cbc:ResponseCode>\r\n        <cbc:Description>Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>3</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n    <cac:LineResponse>\r\n      <cac:LineReference>\r\n        <cbc:LineID>4</cbc:LineID>\r\n      </cac:LineReference>\r\n      <cac:Response>\r\n        <cbc:ResponseCode>RUT01</cbc:ResponseCode>\r\n        <cbc:Description>La validación del estado del RUT próximamente estará disponible.</cbc:Description>\r\n      </cac:Response>\r\n    </cac:LineResponse>\r\n  </cac:DocumentResponse>\r\n</ApplicationResponse>]]></cbc:Description>\r\n\t\t\t\t</cac:ExternalReference>\r\n\t\t\t</cac:Attachment>\r\n\t\t\t<cac:ResultOfVerification>\r\n\t\t\t\t<cbc:ValidatorID>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:ValidatorID>\r\n\t\t\t\t<cbc:ValidationResultCode>02</cbc:ValidationResultCode>\r\n\t\t\t\t<cbc:ValidationDate>2026-07-10</cbc:ValidationDate>\r\n\t\t\t\t<cbc:ValidationTime>17:16:43-05:00</cbc:ValidationTime>\r\n\t\t\t</cac:ResultOfVerification>\r\n\t\t</cac:DocumentReference>\r\n\t</cac:ParentDocumentLineReference>\r\n</AttachedDocument>	\N	2026-07-11 12:20:00.111132
\.


--
-- Data for Name: factura_archivos; Type: TABLE DATA; Schema: facturacion; Owner: -
--

COPY facturacion.factura_archivos (id, factura_id, tipo_archivo, nombre_archivo, ruta_archivo, contenido_xml, hash_sha256, created_at) FROM stdin;
\.


--
-- Data for Name: factura_impuestos; Type: TABLE DATA; Schema: facturacion; Owner: -
--

COPY facturacion.factura_impuestos (id, factura_id, factura_item_id, tipo_impuesto, nombre_impuesto, porcentaje, base_gravable, valor) FROM stdin;
\.


--
-- Data for Name: factura_respuestas_dian; Type: TABLE DATA; Schema: facturacion; Owner: -
--

COPY facturacion.factura_respuestas_dian (id, factura_id, linea_id, codigo_respuesta, descripcion) FROM stdin;
\.


--
-- Data for Name: terceros; Type: TABLE DATA; Schema: facturacion; Owner: -
--

COPY facturacion.terceros (id, tipo_documento, numero_documento, digito_verificacion, tipo_persona, razon_social, direccion, codigo_ciudad, ciudad, codigo_departamento, departamento, codigo_postal, pais, telefono, email, es_propio, created_at, updated_at, es_cliente, es_proveedor) FROM stdin;
83	8	804016305	\N	\N	ALHUM LIMITADA	CRA 27 10 26 P1	68001	Bucaramanga	\N	Santander	\N	CO	607|3168345112|	carteraricopiaslpms@hotmail.com	f	2026-07-03 02:10:09.989427	2026-07-14 11:16:57.58248	f	t
87	8	901476410	\N	\N	GRUPO LEDACOM SAS	CR 52 A 10 70	05001	Medellín	\N	Antioquia	\N	CO	4442406	grupoledacomsas@gmail.com	f	2026-07-03 02:10:48.11119	2026-07-14 11:16:57.58248	f	t
159	NI	900000001	\N	\N	Gestión Calidad	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
93	4	900746054	\N	\N	@PC MAYORISTA S.A.S	CRA 51 51 17 ED HENRY LOCAL 210	05001	Medellín	\N	Antioquia	\N	CO	5116179	facturacion.electronica@apcmayorista.com	f	2026-07-03 10:16:34.493766	2026-07-14 11:16:57.58248	f	t
160	NI	900000002	\N	\N	Transglobal de Carga	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
85	7	800153993	\N	\N	COMUNICACION CELULAR S A  COMCEL S A	CR 68 A 24 B 10 Sede Administrativa Bogotá	11001	BOGOTÁ	\N	Bogotá, D.C.	\N	CO	\N	comcel_fe@claro.com.co	f	2026-07-03 02:10:36.103673	2026-07-14 11:16:57.58248	f	t
161	NI	900000003	\N	\N	Montacargas y Transportes	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
162	NI	900000004	\N	\N	Promatel	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
89	6	901217437	\N	\N	VIRTUAL TRONIC SAS	Calle 48 D # 65a - 20	05001	MEDELLÍN	\N	Antioquia	\N	CO	604 431 0339	info@virtualtronic.com.co	f	2026-07-03 02:10:56.358422	2026-07-14 11:16:57.58248	f	t
39	1	71271339	\N	\N	BENTHAN MUNERA ANDRES	CL 42 A   55 A  28	05360	Itagüí	\N	Antioquia	\N	CO	3134850115	andresbenthan@gmail.com	t	2026-07-02 11:22:40.630166	2026-07-14 11:34:37.188457	t	t
86	13	71271339	\N	\N	ANDRES BENTHAN MUNERA	CL 42 A 55 A 28	05360	ITAGÜÍ	\N	Antioquia	\N	CO	3134850115	andresbenthan@gmail.com	t	2026-07-03 02:10:36.103673	2026-07-14 11:35:01.299834	t	t
163	NI	900000005	\N	\N	Grupo Carpini	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
164	NI	900000006	\N	\N	Símbolo	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
165	NI	900000007	\N	\N	Bekko	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
166	NI	900000008	\N	\N	M2 Contable	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
167	NI	900000009	\N	\N	Ankaras	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
169	NI	900000011	\N	\N	Tysi	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
170	NI	900000012	\N	\N	Serfletar	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
171	NI	900000013	\N	\N	Express Labels	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-12 10:24:56.841657	2026-07-12 10:24:56.841657	f	f
42	6	901840128	\N	\N	EXPRESS LABELS SAS	GT AER 200 METROS VIA GUARNE	05615	Rionegro	\N	Antioquia	\N	CO	3147449749	santiera8@gmail.com	f	2026-07-02 11:24:13.031577	2026-07-14 11:16:57.551692	t	f
44	7	830508693	\N	\N	MONTACARGAS Y TRANSPORTES S.A.S	CR 46 32 98	05001	Medellín	\N	Antioquia	\N	CO	4486264	facturaelectronica@mytltda.com	f	2026-07-02 11:24:52.379679	2026-07-14 11:16:57.551692	t	f
52	1	900728970	\N	\N	BEKKO S.A.S.	CR 43 A 1 SUR 220 ED PORVENIR OF 705	05001	Medellín	\N	Antioquia	\N	CO	3206887742	recepcionfacturacion@bekko.co	f	2026-07-02 11:28:25.58516	2026-07-14 11:16:57.551692	t	f
54	9	900177063	\N	\N	TRANSGLOBAL DE CARGA S.A.S	CL 5B 36 B 36 AP 106	05001	Medellín	\N	Antioquia	\N	CO	3148622308	coordinacion.administrativa@transglobaldecarga.com	f	2026-07-02 11:29:01.933526	2026-07-14 11:16:57.551692	t	f
56	9	901505037	\N	\N	LA CREME BM S.A.S.	Calle 000	11001	Bogotá, D.c.	\N	Bogotá	\N	CO	0000000	sebastian.calvo@lacremegroup.com	f	2026-07-02 11:29:32.689217	2026-07-14 11:16:57.551692	t	f
143	13	123456789	\N	\N	Ventas sin factura	\N	\N	\N	\N	\N	\N	CO	\N	\N	f	2026-07-07 10:25:27.849959	2026-07-14 11:16:57.551692	t	f
58	6	901304721	\N	\N	B2LEY ABOGADOS S.A.S.	CR 43 A 16 SUR 47  ED PANALPINA OF 1005	05001	Medellín	\N	Antioquia	\N	CO	3053564934	info@b2ley.com	f	2026-07-02 11:30:08.481608	2026-07-14 11:16:57.551692	t	f
60	1	901426228	\N	\N	ANKARA S.A.S	CR 90 65C 10 AP 1110	05001	Medellín	\N	Antioquia	\N	CO	3107676358	silicatosgerencia@gmail.com	f	2026-07-02 11:30:38.181588	2026-07-14 11:16:57.551692	t	f
40	5	901432312	\N	\N	CEA AUTONORTE ESCUELA DE CONDUCCION S.A.S.	DG 57 AV 33-94	05088	Bello	\N	Antioquia	\N	CO	3216530562	autonortecea@gmail.com	f	2026-07-02 11:22:40.630166	2026-07-14 11:16:57.551692	t	f
92	2	900567220	\N	\N	TRANSPORTES NUS S.A.S.	CR 10 8 68 SAN JOSE DEL NUS	05670	San Roque	\N	Antioquia	\N	CO	3165234752	gerencia.transnus@gmail.com	f	2026-07-03 10:00:21.488	2026-07-14 11:16:57.551692	t	f
70	1	901606527	\N	\N	ADECUACIONES, MONTAJES Y SERVICIOS S.A.S.	CL21 59 85	05001	Medellín	\N	Antioquia	\N	CO	3127350656	AMYSERVICIOS.SAS@GMAIL.COM	f	2026-07-02 11:33:45.641292	2026-07-14 11:16:57.551692	t	f
46	8	901998318	\N	\N	M2 ASESORES S.A.S.	Calle 000	11001	Envigado	\N	\N	\N	CO	0000000	info@m2contable.com	f	2026-07-02 11:25:25.920909	2026-07-14 11:16:57.551692	t	f
72	2	811010539	\N	\N	ASOCIACIÓN MUNICIPAL DE USUARIOS CAMPESINOS DE DABEIBA	Cr 11 # 10-19  Cr Murillo Toro	05234	Dabeiba	\N	Antioquia	\N	CO	3127762052	amucampesinos47@gmail.com	f	2026-07-02 11:34:20.617365	2026-07-14 11:16:57.551692	t	f
48	8	811021891	\N	\N	PRODUCTORA DE MANTOS Y TELAS S.A.S	CR 50 79C SUR 250	05001	Medellín	\N	Antioquia	\N	CO	4039000	promatel@promatel.com.co	f	2026-07-02 11:25:50.554288	2026-07-14 11:16:57.551692	t	f
50	3	900382679	\N	\N	GRUPO CARPINI S.A.S	CARR 25 A   36 D SUR 138	05266	Envigado	\N	Antioquia	\N	CO	6044483251	contador.carpini@gmail.com	f	2026-07-02 11:27:53.610255	2026-07-14 11:16:57.551692	t	f
150	0	900546480	\N	\N	GESTION CALIDAD S.A.S.	Calle 49B 64C 35 OF 212 ED. BRASILIA III	05001	Medellín	\N	\N	\N	CO	6044488877	analista1.gestioncalidad@gmail.com	f	2026-07-11 12:22:25.941879	2026-07-14 11:16:57.551692	t	f
\.


--
-- Data for Name: ventas; Type: TABLE DATA; Schema: facturacion; Owner: -
--

COPY facturacion.ventas (id, cufe, prefijo, numero, numero_completo, tipo_documento_code, customization_id, fecha_emision, hora_emision, fecha_vencimiento, moneda, valor_subtotal, valor_descuento, valor_recargo, valor_total_bruto, valor_total_impuestos, valor_iva, valor_inc, valor_ica, valor_total_neto, valor_retencion_fuente, valor_retencion_iva, valor_retencion_ica, valor_anticipos, valor_a_pagar, emisor_id, receptor_id, resolucion_numero, resolucion_fecha_desde, resolucion_fecha_hasta, resolucion_prefijo, resolucion_rango_desde, resolucion_rango_hasta, medio_pago_code, fecha_vencimiento_pago, periodo_facturacion, qr_code, codigo_respuesta_dian, descripcion_respuesta_dian, estado_validacion_dian, fecha_validacion_dian, hora_validacion_dian, estado, created_at, updated_at, saldo_pendiente, observaciones) FROM stdin;
18	a22e0acbe3a3a3bd2924a7561dec029917ef0ecb78d805672d2332705778a39bb9cb9b2307f5cd0b13b28f3df0abe30b	AB	738	AB738	01	10	2026-05-13	15:37:48	2026-05-13	COP	2230000.00	0.00	0.00	2230000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	2230000.00	39	46	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-13	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:25:25.920909	2026-07-05 16:32:48.958715	0.00	\N
19	df248fc22d6220ced7d3e4f6cf251cb708e6bbf120bf23d4a85e61aea10387e059acc80ecf1094f020ee90f036a3ebe9	AB	739	AB739	01	10	2026-05-14	09:50:14	2026-05-14	COP	1849000.00	0.00	0.00	1849000.00	0.00	0.00	0.00	0.00	0.00	46225.00	0.00	0.00	0.00	1849000.00	39	48	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-14	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:25:50.554288	2026-07-06 11:26:12.68621	0.00	\N
17	d65838624c3388eee47be678a6e9c4850cbf1946e15005553d71b92a5e3bc86cd14aebaab2cfa23665a1fcee04599759	AB	737	AB737	01	10	2026-05-08	06:07:41	2026-05-08	COP	145000.00	0.00	0.00	145000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	145000.00	39	44	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-08	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:24:52.379679	2026-07-02 12:45:03.193256	145000.00	\N
20	3faae0b09474924da81037d657051336cea70b17f484380c6867a89ad9bbca28e773d975f71d9b8149e93b04527bf501	AB	740	AB740	01	10	2026-05-19	06:33:05	2026-06-18	COP	998000.00	0.00	0.00	998000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	998000.00	39	50	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-06-18	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:27:53.610255	2026-07-02 12:45:03.193256	998000.00	\N
21	873d08a8ae7aa1883cb506c0ae1c33d2818b4072dcab00c3ede6d408dc8386fd5d2c573d6e5a493df89d9c410066a65f	AB	741	AB741	01	10	2026-05-23	05:52:09	2026-05-23	COP	290000.00	0.00	0.00	290000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	290000.00	39	52	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-23	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:28:25.58516	2026-07-02 12:45:03.193256	290000.00	\N
15	9442033bf6245ac9691040275106636db51ed8229f72fc4c1218411b155af2d26c304bf3be2264818f6c2bc5dba6add3	AB	735	AB735	01	10	2026-05-07	08:20:41	2026-05-07	COP	290000.00	0.00	0.00	290000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	290000.00	39	40	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-07	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:22:40.630166	2026-07-05 14:55:46.384343	0.00	\N
16	7a2e8ecc5306cb0ee8288d6292139ada3eb647306aea2ad9e4d4a71b6614ef67d8ab7ff4f1e2b18626e1064fe9778b56	AB	736	AB736	01	10	2026-05-07	19:44:33	2026-05-07	COP	290000.00	0.00	0.00	290000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	290000.00	39	42	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-07	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:24:13.031577	2026-07-05 16:30:40.567646	0.00	\N
22	f422acf3c553c7251d87a4bba0237546e908e86b038a8bd3d7311cb6faba62abf5936f1a73aa8f12baebb1ef5e4944f7	AB	742	AB742	01	10	2026-05-23	06:31:56	2026-05-23	COP	145000.00	0.00	0.00	145000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	145000.00	39	54	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-23	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:29:01.933526	2026-07-02 12:45:03.193256	145000.00	\N
28	189ea8108be019bcc0f84b54bb07882617579b054c98ec9bf0e9444f65e893eb99df1ed15e24028997cf742e4d9eb323	AB	748	AB748	01	10	2026-06-05	09:46:31	2026-06-05	COP	830000.00	0.00	0.00	830000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	830000.00	39	48	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-06-05	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:32:32.037082	2026-07-02 12:45:03.193256	830000.00	\N
29	963cff4c6a9bc5fdb701a51f5eb8b23b51429218ad6122f4d40b4bc644a237a9b73e72bc88dc1fe04ef00123053a8e72	AB	749	AB749	01	10	2026-06-05	10:09:06	2026-06-05	COP	320000.00	0.00	0.00	320000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	320000.00	39	48	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-06-05	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:33:06.010892	2026-07-02 12:45:03.193256	320000.00	\N
30	f957665d99f8c3b2b2a42ca48e9894e98b60c0f5ec3b6ab63b6e8166f3931bf4dc44c9c07ae1e4cd0d2acf20a496df79	AB	750	AB750	01	10	2026-06-10	16:14:36	2026-06-10	COP	150000.00	0.00	0.00	150000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	150000.00	39	70	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-06-10	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:33:45.641292	2026-07-02 12:45:03.193256	150000.00	\N
31	2c9ee82ade5b4173f67cf82d174cbc5140c71d7487a0e2312d84910b28ce97de4511e9b510e7d483c8f9eaac60c574cd	AB	752	AB752	01	10	2026-06-19	16:21:55	2026-06-19	COP	614500.00	0.00	0.00	614500.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	614500.00	39	72	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-06-19	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:34:20.617365	2026-07-02 12:45:03.193256	614500.00	\N
32	ae4842acf3be81947272abbe2c04e4da85930dfe29ac62e900b8553f3bdaafded87768eaa2cc8c0a21c5830440560532	AB	751	AB751	01	10	2026-06-16	14:35:53	2026-06-16	COP	809000.00	0.00	0.00	809000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	809000.00	39	48	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-06-16	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:36:25.075652	2026-07-02 12:45:03.193256	809000.00	\N
33	7e1743e60820cc9735a75b18fb6a43f860d8a59a8d873746629dd99df83c2e491b917291fcbb24a172d321e3ed1d40fe	AB	753	AB753	01	10	2026-06-19	16:32:47	2026-07-19	COP	998000.00	0.00	0.00	998000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	998000.00	39	50	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-07-19	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:36:53.340182	2026-07-02 12:45:03.193256	998000.00	\N
76	\N	\N	\N	VEN2	\N	\N	2026-05-22	\N	\N	COP	375000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	375000.00	86	150	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-11 12:30:19.349767	2026-07-11 12:33:10.700471	0.00	Disco duro para PC de Sindy
27	15a217b7ced010a22978054cf56afc72f6907506d39aae708ceceded061bf29f8af25f9f5639e65dd086e23554aadcd2	AB	747	AB747	01	10	2026-06-03	10:19:26	2026-06-03	COP	160000.00	0.00	0.00	160000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	160000.00	39	40	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-06-03	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-02 11:31:44.380567	2026-07-02 12:47:30.524721	160000.00	\N
34	2797f360d2b2ddd02a10305017544ddab6d6ee7be43a46e0050145a33ec8c2aaf1ab749f3c0b53fdbbbd4d333b3a54ef	AB	754	AB754	01	10	2026-07-02	12:36:49	2026-07-02	COP	50000.00	0.00	0.00	50000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	50000.00	39	92	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-07-02	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-03 10:00:21.488	2026-07-03 10:00:21.488	50000.00	\N
70	\N	\N	\N	VENTA-1783332166285	\N	\N	2026-05-13	\N	\N	COP	97300.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	97300.00	86	46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-06 10:02:46.276243	2026-07-07 11:32:22.096755	97300.00	\N
73	360cbad0f276dd8831e9d06e932567024d77b76fe0cca0531eccbfb07d9ca3318a5e04f73da7b59d949541651b6150ed	AB	755	AB755	01	10	2026-07-11	06:49:37	2026-07-11	COP	145000.00	0.00	0.00	145000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	145000.00	39	150	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-07-11	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-11 12:22:25.941879	2026-07-11 12:22:25.941879	145000.00	\N
74	db152f3be52f521b37630c5e2b8d238bd623bcfa83ce53934e5331101d914a841f0e2d74a364748ffc00d2bd321ad418	AB	756	AB756	01	10	2026-07-11	06:51:41	2026-07-11	COP	145000.00	0.00	0.00	145000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	145000.00	39	150	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-07-11	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-11 12:22:45.038298	2026-07-11 12:22:45.038298	145000.00	\N
75	094ea73af7cd82153f37c07f466f0255119706bbed6597fd3ea2650e43ee4cf7cee60142422b5b4ecf5be608cd3d66fe	AB	757	AB757	01	10	2026-07-11	07:04:12	2026-07-11	COP	439000.00	0.00	0.00	439000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	439000.00	39	150	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-07-11	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-11 12:23:02.671124	2026-07-11 12:23:02.671124	439000.00	\N
77	\N	\N	\N	VEN3	\N	\N	2026-05-24	\N	\N	COP	120000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	120000.00	86	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-11 12:37:24.886757	2026-07-11 12:38:35.382531	0.00	Lizeth Guiot
71	\N	\N	\N	VENTA-1783421802644	\N	\N	2026-05-16	\N	\N	COP	25000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	25000.00	86	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-07 10:56:42.618795	2026-07-11 16:05:30.14865	0.00	Henry
72	\N	\N	\N	VEN1	\N	\N	2026-05-17	\N	\N	COP	40000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	40000.00	86	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-07 11:34:31.244904	2026-07-11 16:05:52.247909	0.00	Mileidy
23	9c94786bc0aa80215758235c42472ed366c814fdf340992cd67ee83c84dc5c66c0d45f8b0266c9666e12a494a5e04bad	AB	743	AB743	01	10	2026-05-26	08:45:29	2026-05-26	COP	145000.00	0.00	0.00	145000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	145000.00	39	56	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-26	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:29:32.689217	2026-07-11 16:10:58.108765	0.00	\N
24	c2e6d910886f09bd9a0ac0eaa2f968aceecfef141eaac7a3ad37f3a5d743723f781f905cf3c7da06b49d680bb2794e53	AB	744	AB744	01	10	2026-05-29	06:00:53	2026-05-29	COP	545000.00	0.00	0.00	545000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	545000.00	39	58	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-29	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:30:08.481608	2026-07-11 16:20:09.232672	0.00	\N
78	\N	\N	\N	VEN4	\N	\N	2026-06-01	\N	\N	COP	235000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	235000.00	86	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-11 16:44:30.002342	2026-07-11 16:45:51.35248	0.00	Marcela Autonorte
25	080f0ba9d0d476dc2084e911f3323e45937722ae42a463cd66341f4bcef594d2f51d8af78523d56a677991af6c084183	AB	745	AB745	01	10	2026-05-29	06:17:23	2026-05-29	COP	110000.00	0.00	0.00	110000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	110000.00	39	60	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-29	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:30:38.181588	2026-07-11 16:48:44.747422	0.00	\N
26	35dd73235e3988bb524493cd2a81655a206158b67c5053ac5714650f2c32c2c9277529b2c7472753eb32ba9f07b8e13d	AB	746	AB746	01	10	2026-05-29	06:41:04	2026-05-29	COP	95000.00	0.00	0.00	95000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	95000.00	39	60	18764084896869	2024-12-06	2026-12-06	AB	501	1500	1	2026-05-29	\N	\N	\N	\N	\N	\N	\N	pagada	2026-07-02 11:31:12.814991	2026-07-11 16:48:44.747422	0.00	\N
79	\N	\N	\N	VEN5	\N	\N	2026-06-03	\N	\N	COP	295000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	295000.00	86	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pendiente_pago	2026-07-11 17:36:22.640119	2026-07-11 17:36:22.640119	295000.00	Manuela Cano, configuración MAC
\.


--
-- Data for Name: ventas_items; Type: TABLE DATA; Schema: facturacion; Owner: -
--

COPY facturacion.ventas_items (id, venta_id, numero_linea, descripcion, codigo_producto, cantidad, unidad_medida, valor_unitario, porcentaje_descuento, valor_descuento, valor_linea, producto_id, valor_retencion_fuente) FROM stdin;
21	15	1	Mantenimiento Correctivo Computador	\N	1.000000	NIU	290000.00	0.00	0.00	290000.00	\N	0.00
22	16	1	Licencia de Adobe Creative Cloud por un año	\N	1.000000	NIU	190000.00	0.00	0.00	190000.00	\N	0.00
23	16	2	Servicio técnico remoto x 1 hora	\N	2.000000	NIU	50000.00	0.00	0.00	100000.00	\N	0.00
24	17	1	Mantenimiento computador	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
28	20	1	Servicios informaticos por contrato mensual	\N	1.000000	NIU	998000.00	0.00	0.00	998000.00	\N	0.00
29	21	1	Servicio técnico presencial x 2 horas	\N	2.000000	NIU	145000.00	0.00	0.00	290000.00	\N	0.00
30	22	1	Mantenimiento Correctivo Computador	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
31	23	1	Servicio técnico presencial x 2 horas	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
32	24	1	Servicio tecnico presencial x 5 horas	\N	1.000000	NIU	245000.00	0.00	0.00	245000.00	\N	0.00
33	24	2	Licencia  Windows 11 Pro  ESD Perpetua una activación en linea	\N	2.000000	NIU	150000.00	0.00	0.00	300000.00	\N	0.00
34	25	1	Renovacion dominio ankarasas por un añor	\N	1.000000	NIU	110000.00	0.00	0.00	110000.00	\N	0.00
35	26	1	Servicio Técnico mensual remoto	\N	1.000000	NIU	95000.00	0.00	0.00	95000.00	\N	0.00
36	27	1	Servicio Técnico Presencial  x 1 hora	\N	1.000000	NIU	95000.00	0.00	0.00	95000.00	\N	0.00
37	27	2	Cargador Asus 19v 45w vt charger	\N	1.000000	NIU	65000.00	0.00	0.00	65000.00	\N	0.00
38	28	1	Servicio técnico remoto x 1 hora	\N	1.000000	NIU	50000.00	0.00	0.00	50000.00	\N	0.00
39	28	2	Servicio técnico remoto x 1 hora	\N	2.000000	NIU	50000.00	0.00	0.00	100000.00	\N	0.00
40	28	3	Servicio técnico presencial x 2 horas	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
41	28	4	Servicio técnico remoto x 1 hora	\N	1.000000	NIU	50000.00	0.00	0.00	50000.00	\N	0.00
42	28	5	Mantenimiento computador	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
43	28	6	Mantenimiento computador	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
44	28	7	Servicio técnico presencial x 4 horas	\N	1.000000	NIU	195000.00	0.00	0.00	195000.00	\N	0.00
45	29	1	Camara tipo bala metalica 720p Hikvision	\N	1.000000	NIU	120000.00	0.00	0.00	120000.00	\N	0.00
46	29	2	Servicio tecnico instalacion y configuracion camaras	\N	1.000000	NIU	200000.00	0.00	0.00	200000.00	\N	0.00
47	30	1	Mantenimiento computador	\N	1.000000	NIU	150000.00	0.00	0.00	150000.00	\N	0.00
48	31	1	Servicio de hosting y alojamiento del software de facturación anual	\N	1.000000	NIU	614500.00	0.00	0.00	614500.00	\N	0.00
50	33	1	Servicios informaticos por contrato mensual	\N	1.000000	NIU	998000.00	0.00	0.00	998000.00	\N	0.00
26	18	2	Toner Ricoh M320F	\N	2.000000	NIU	120000.00	0.00	0.00	240000.00	6	0.00
25	18	1	Impresora Multifuncional Laser Ricoh M320F	\N	1.000000	NIU	1990000.00	0.00	0.00	1990000.00	5	0.00
51	34	1	Servicio técnico remoto x 1 hora	\N	1.000000	NIU	50000.00	0.00	0.00	50000.00	\N	0.00
49	32	1	Antivirus Kaspersky Small Office Security para 1 Servidor y 10 Equipos x 1 año	\N	1.000000	NIU	809000.00	0.00	0.00	809000.00	11	0.00
27	19	1	Portatil Lenovo V14 AMN R5 RAM16GB SSD512GB	\N	1.000000	NIU	1849000.00	0.00	0.00	1849000.00	7	46225.00
53	71	1	Servicio Tecnico Remoto por una hora	STRX1H	1.000000	UND	25000.00	0.00	0.00	25000.00	12	0.00
54	70	1	Materiales sin Inventario	MSIN	1.000000	UND	97300.00	0.00	0.00	97300.00	13	0.00
55	72	1	Mantenimiento Computador	MTTOPC	1.000000	UND	40000.00	0.00	0.00	40000.00	14	0.00
56	73	1	Mantenimiento Correctivo Computador	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
57	74	1	Mantenimiento Correctivo Computador	\N	1.000000	NIU	145000.00	0.00	0.00	145000.00	\N	0.00
58	75	1	kaspersky PLUS 5 dispositivos 1 AÑO	\N	1.000000	NIU	289000.00	0.00	0.00	289000.00	\N	0.00
59	75	2	Servicio técnico remoto x 1 hora	\N	3.000000	NIU	50000.00	0.00	0.00	150000.00	\N	0.00
60	76	1	DISCO SOLIDO KINGSTON NV3 500GB	SNV3S500G	1.000000	UND	375000.00	0.00	0.00	375000.00	8	0.00
61	77	1	Mantenimiento Computador	MTTOPC	1.000000	UND	120000.00	0.00	0.00	120000.00	14	0.00
62	78	1	Disco Duro Mecanico 1TB	HDD1TB	1.000000	UND	100000.00	0.00	0.00	100000.00	15	0.00
63	78	2	Bateria Hp HT03 11.4V 3600mAh 41Wh	HPP HT03-3S1P	1.000000	UND	135000.00	0.00	0.00	135000.00	9	0.00
64	79	1	Microsoft Office 365, Una cuenta, 5 dispositivos, 1 año	OFF3651C5D1A	1.000000	UND	200000.00	0.00	0.00	200000.00	16	0.00
65	79	2	Servicio Técnico Presencial x 1 hora	STPX1H	1.000000	UND	95000.00	0.00	0.00	95000.00	17	0.00
\.


--
-- Data for Name: clasificaciones; Type: TABLE DATA; Schema: gastos; Owner: -
--

COPY gastos.clasificaciones (id, nombre, created_at) FROM stdin;
1	Suministros	2026-07-05 11:50:47.642459
2	Operacional	2026-07-05 11:50:47.642459
3	Administrativo	2026-07-05 11:50:47.642459
4	Impuestos	2026-07-05 11:54:30.838833
\.


--
-- Data for Name: gastos; Type: TABLE DATA; Schema: gastos; Owner: -
--

COPY gastos.gastos (id, factura_compra_id, proveedor_id, producto_id, venta_item_id, descripcion, clasificacion, cantidad, valor_unitario, valor_total, fecha, created_at, updated_at, codigo_producto) FROM stdin;
22	12	89	4	\N	Bateria Lenovo L16L2PB2 7.6V 4100mAh 31Wh	Suministros	1.000000	88235.29	88235.29	2026-05-06	2026-07-03 02:10:56.358422	2026-07-03 02:14:26.409039	BLE-025
14	9	83	5	\N	Maquina RICOH M320F MULTIFUNCIONAL A4 ARDF 34 ppm Blanco y Negro.Incluye Toner de Inicio	Suministros	1.000000	1502521.01	1502521.01	2026-05-11	2026-07-03 02:10:09.989427	2026-07-03 02:15:42.599583	\N
16	9	83	6	\N	Toner Ricoh SP 3710DN/SP3710SF  TYPE SP 3710X KATUN	Suministros	2.000000	63025.21	126050.42	2026-05-11	2026-07-03 02:10:09.989427	2026-07-03 02:17:57.708562	\N
18	10	85	\N	\N	Plan Celular Claro	Administrativo	1.000000	50448.33	50448.33	2026-05-14	2026-07-03 02:10:36.103673	2026-07-03 02:19:19.935723	\N
20	10	85	\N	\N	ica 1 compra E6059562405 (4%)	Administrativo	1.000000	100.90	100.90	2026-05-14	2026-07-03 02:10:36.103673	2026-07-03 02:19:50.414327	\N
21	11	87	7	\N	PORTATIL LENOVO V14 GEN4	Suministros	1.000000	1619000.00	1619000.00	2026-05-14	2026-07-03 02:10:48.11119	2026-07-03 02:20:31.950522	82YT00TKLM
24	13	93	8	\N	DISCO SOLIDO KINGSTON M.2 PCI  EXPRESS NV3 500GB SNV3S/500G	Suministros	1.000000	273109.24	273109.24	2026-05-22	2026-07-03 10:16:34.493766	2026-07-03 10:43:04.368538	2410020
26	14	89	9	\N	Bateria Hp HT03 11.4V 3600mAh 41Wh	Suministros	1.000000	71428.57	71428.57	2026-06-01	2026-07-03 10:19:19.089725	2026-07-03 10:58:11.990702	HPP HT03-3S1P
28	15	89	10	\N	Hub Tipo C con adaptador USB, 8 en 1 ORICO-YSA8-U3-GY-BP	Suministros	1.000000	29411.76	29411.76	2026-06-02	2026-07-03 10:23:59.279011	2026-07-03 10:59:57.638156	ORICO-YSA8-U3-GY-BP
30	16	85	\N	\N	Plan Celular Claro	Administrativo	1.000000	50448.33	50448.33	2026-06-14	2026-07-03 10:25:25.187827	2026-07-03 11:02:25.706375	\N
32	16	85	\N	\N	ica 1 compra E6070413164 (4%)	Administrativo	1.000000	100.90	100.90	2026-06-14	2026-07-03 10:25:25.187827	2026-07-03 11:02:50.680986	\N
33	17	93	11	\N	LICENCIA  KASPERSKY SMALL OFFICE SECURITY 8 / 10 DISPOSITIVOS / 1 SERVER / 1 AÑO / RENOVACIÓN (KL4541DDKFR)	Suministros	1.000000	396000.00	396000.00	2026-06-17	2026-07-03 10:28:03.881451	2026-07-03 11:04:14.318618	6175400
34	18	89	4	\N	Bateria Lenovo L16L2PB2 7.6V 4100mAh 2 Celdas	Suministros	1.000000	81512.61	81512.61	2026-06-17	2026-07-03 10:29:32.232503	2026-07-03 11:06:06.905317	LE L16L2PB2-2S1P
36	\N	\N	\N	\N	Parqueaderos Gestion Calidad	Operacional	1.000000	4500.00	4500.00	2026-05-06	2026-07-03 11:28:13.761545	2026-07-03 11:28:13.761545	\N
37	\N	\N	\N	\N	Papel Chicle	Operacional	1.000000	11500.00	11500.00	2026-05-06	2026-07-03 11:28:13.821729	2026-07-03 11:28:13.821729	\N
38	\N	\N	\N	\N	Parqueadero Gestion Calidad	Operacional	1.000000	3000.00	3000.00	2026-05-11	2026-07-03 11:28:13.833103	2026-07-03 11:28:13.833103	\N
39	\N	\N	\N	\N	Parqueadero M2	Operacional	1.000000	1000.00	1000.00	2026-05-12	2026-07-03 11:28:13.843707	2026-07-03 11:28:13.843707	\N
40	\N	\N	\N	\N	Compra de cable para M2	Operacional	1.000000	19000.00	19000.00	2026-05-12	2026-07-03 11:28:13.854434	2026-07-03 11:28:13.854434	\N
41	\N	\N	\N	\N	Pasajes MYT	Operacional	1.000000	3800.00	3800.00	2026-05-15	2026-07-03 11:28:13.865056	2026-07-03 11:28:13.865056	\N
42	\N	\N	\N	\N	recarga civica	Operacional	1.000000	10000.00	10000.00	2026-05-15	2026-07-03 11:28:13.881482	2026-07-03 11:28:13.881482	\N
35	18	89	\N	\N	iva 1 compra FEVT149159 (19%)	Impuestos	1.000000	15487.39	15487.39	2026-06-17	2026-07-03 10:29:32.232503	2026-07-05 12:16:30.133344	\N
31	16	85	\N	\N	iva 1 compra E6070413164 (19%)	Impuestos	1.000000	9585.18	9585.18	2026-06-14	2026-07-03 10:25:25.187827	2026-07-05 12:16:39.485083	\N
29	15	89	\N	\N	iva 1 compra FEVT147752 (19%)	Impuestos	1.000000	5588.24	5588.24	2026-06-02	2026-07-03 10:23:59.279011	2026-07-05 12:16:46.98445	\N
27	14	89	\N	\N	iva 1 compra FEVT147561 (19%)	Impuestos	1.000000	13571.43	13571.43	2026-06-01	2026-07-03 10:19:19.089725	2026-07-05 12:16:55.319874	\N
25	13	93	\N	\N	iva 1 compra POB41584 (19%)	Impuestos	1.000000	51890.76	51890.76	2026-05-22	2026-07-03 10:16:34.493766	2026-07-05 12:17:03.436693	\N
19	10	85	\N	\N	iva 1 compra E6059562405 (19%)	Impuestos	1.000000	9585.18	9585.18	2026-05-14	2026-07-03 02:10:36.103673	2026-07-05 12:17:11.489441	\N
17	9	83	\N	\N	iva 2 compra FEME38737 (19%)	Impuestos	2.000000	11974.79	23949.58	2026-05-11	2026-07-03 02:10:09.989427	2026-07-05 12:17:18.189517	\N
15	9	83	\N	\N	iva 1 compra FEME38737 (19%)	Impuestos	1.000000	285478.99	285478.99	2026-05-11	2026-07-03 02:10:09.989427	2026-07-05 12:17:22.62019	\N
23	12	89	\N	\N	iva 1 compra FEVT144434 (19%)	Impuestos	1.000000	16764.71	16764.71	2026-05-06	2026-07-03 02:10:56.358422	2026-07-05 12:17:29.620988	\N
43	\N	\N	\N	\N	tester multimetro	Operacional	1.000000	18000.00	18000.00	2026-05-27	2026-07-03 11:28:13.892677	2026-07-03 11:28:13.892677	\N
44	\N	\N	\N	\N	Parqueaderos - B2ley	Operacional	1.000000	11600.00	11600.00	2026-05-28	2026-07-03 11:28:13.907651	2026-07-03 11:28:13.907651	\N
45	\N	\N	\N	\N	Pasajes Bekko	Operacional	1.000000	7600.00	7600.00	2026-05-29	2026-07-03 11:28:13.932838	2026-07-03 11:28:13.932838	\N
46	\N	\N	\N	\N	pega loca	Operacional	1.000000	1000.00	1000.00	2026-05-31	2026-07-03 11:28:13.943185	2026-07-03 11:28:13.943185	\N
48	\N	\N	\N	\N	Parqueadero Gestion Calidad	Operacional	1.000000	1500.00	1500.00	2026-06-02	2026-07-03 11:28:13.96177	2026-07-03 11:28:13.96177	\N
51	\N	\N	\N	\N	Pasajes transglobal	Operacional	1.000000	3800.00	3800.00	2026-06-05	2026-07-03 11:28:14.002031	2026-07-03 11:28:14.002031	\N
52	\N	\N	\N	\N	recarga civica	Operacional	1.000000	10000.00	10000.00	2026-06-05	2026-07-03 11:28:14.012969	2026-07-03 11:28:14.012969	\N
58	\N	\N	\N	\N	Reparacion PC Autonorte, Fabio Portatiles	Administrativo	1.000000	160000.00	160000.00	2026-05-06	2026-07-04 11:50:12.069292	2026-07-04 11:50:12.069292	\N
59	\N	\N	\N	\N	Licencia Adobe Express Label	Administrativo	1.000000	90000.00	90000.00	2026-05-07	2026-07-04 11:50:12.208985	2026-07-04 11:50:12.208985	\N
60	\N	\N	\N	\N	COMPRA EN  ELECTRICOS para M2	Administrativo	1.000000	78300.00	78300.00	2026-05-12	2026-07-04 11:50:12.215328	2026-07-04 11:50:12.215328	\N
61	\N	\N	\N	\N	Pilas Teclado	Administrativo	1.000000	10000.00	10000.00	2026-05-16	2026-07-04 11:50:12.22011	2026-07-04 11:50:12.22011	\N
62	\N	\N	\N	\N	compra Camara promatel	Administrativo	1.000000	60140.00	60140.00	2026-05-21	2026-07-04 11:50:12.224156	2026-07-04 11:50:12.224156	\N
63	\N	\N	\N	\N	Compras de Licencias de windows 11 - B2LEY	Administrativo	1.000000	60000.00	60000.00	2026-05-28	2026-07-04 11:50:12.228213	2026-07-04 11:50:12.228213	\N
65	\N	\N	\N	\N	Compra Licencia Office Manuela Cano	Administrativo	1.000000	100000.00	100000.00	2026-06-03	2026-07-04 11:50:12.237592	2026-07-04 11:50:12.237592	\N
66	\N	\N	\N	\N	Pago a Santiago AAPZ	Administrativo	1.000000	50000.00	50000.00	2026-06-03	2026-07-04 11:50:12.242602	2026-07-04 11:50:12.242602	\N
67	\N	\N	\N	\N	Recarga Celular	Administrativo	1.000000	8900.00	8900.00	2026-06-05	2026-07-04 11:50:12.247687	2026-07-04 11:50:12.247687	\N
68	\N	\N	\N	\N	Renovacion Dominio Ankaras	Administrativo	1.000000	66740.00	66740.00	2026-06-05	2026-07-04 11:50:12.252316	2026-07-04 11:50:12.252316	\N
70	\N	\N	\N	\N	Compra Open ai	Administrativo	1.000000	17378.00	17378.00	2026-06-17	2026-07-04 11:50:12.261061	2026-07-04 11:50:12.261061	\N
57	\N	\N	\N	48	Railway	Operacional	1.000000	18182.00	18182.00	2026-05-02	2026-07-03 11:50:01.273455	2026-07-04 13:04:16.471816	\N
69	\N	\N	\N	50	Fabio Portatiles - Asus Ricardo Carpini	Administrativo	1.000000	90000.00	90000.00	2026-06-11	2026-07-04 11:50:12.256959	2026-07-04 14:18:54.151534	\N
64	\N	\N	\N	48	compra railway	Operacional	1.000000	18390.00	18390.00	2026-06-02	2026-07-04 11:50:12.232875	2026-07-04 17:01:41.947577	\N
56	\N	\N	\N	30	Pasajes transglobal	Operacional	1.000000	7600.00	7600.00	2026-06-26	2026-07-03 11:28:14.051672	2026-07-04 17:16:15.260029	\N
55	\N	\N	\N	30	pega loca transglobal	Operacional	1.000000	1300.00	1300.00	2026-06-26	2026-07-03 11:28:14.042687	2026-07-04 17:16:19.09993	\N
54	\N	\N	\N	30	limpiado electronico y trapos	Operacional	1.000000	19000.00	19000.00	2026-06-24	2026-07-03 11:28:14.032329	2026-07-04 17:16:26.519889	\N
53	\N	\N	\N	47	Parqueadero Premium Plaza	Operacional	1.000000	2000.00	2000.00	2026-06-10	2026-07-03 11:28:14.022658	2026-07-04 17:17:17.219318	\N
72	19	89	\N	37	Cargador Asus 19V 2.37A 45W VT-CHARGER 4.0*1.35	Operacional	1.000000	33613.45	33613.45	2026-06-02	2026-07-05 11:25:45.156031	2026-07-05 11:27:29.316166	\N
73	19	89	\N	37	iva 1 compra FEVT147751 (19%)	Impuestos	1.000000	6386.55	6386.55	2026-06-02	2026-07-05 11:25:45.156031	2026-07-05 11:54:42.456336	\N
76	20	93	\N	58	LICENCIA KASPERSKY PLUS / 5 DISPOSITIVOS / 1 AÑO / BASE (KL1042DDEFS)	Operacional	1.000000	164000.00	164000.00	2026-07-10	2026-07-11 12:20:00.111132	2026-07-11 17:39:26.760831	6175493
\.


--
-- Data for Name: caso_detalles; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.caso_detalles (id, caso_id, creado_por, contenido, tipo, created_at) FROM stdin;
1	1	1	Se revisa la fuente de poder, parece dañada	Diagnóstico	2026-07-13 22:57:52.897533+00
2	2	2	Se realiza copia de seguridad en el disco duro externo en la carpeta "backup asus"	Comentario	2026-07-15 08:31:03.694243+00
\.


--
-- Data for Name: casos; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.casos (id, numero, titulo, descripcion, categoria_id, recurso_id, cliente_id, contacto_id, tecnico_id, estado, telegram_chat_id, telegram_topic_id, whatsapp_chat_id, fuente, ai_report, solucion, venta_item_id, resumen, created_at, updated_at) FROM stdin;
1	CASO-0001	PC no enciende	El equipo no responde al presionar el botón de encendido	2	\N	\N	\N	\N	Completado	\N	\N	\N	Manual	\N	Se reemplazó la fuente de poder por una nueva. El equipo enciende correctamente.	\N	\N	2026-07-13 22:57:52.634378+00	2026-07-13 22:57:53.194646+00
3	CASO-0003	Activacion Office Paola		\N	\N	58	\N	\N	Pendiente	\N	\N	\N	Manual	\N	\N	\N	\N	2026-07-14 21:24:12.681952+00	2026-07-14 21:24:12.681952+00
2	CASO-0002	Mantenimiento Preventivo	Formateo de disco duro e instalación del sistema operativo windows 11 y los programas.	\N	\N	58	\N	\N	En Progreso	\N	\N	\N	Manual	\N	\N	\N	\N	2026-07-14 21:19:48.915662+00	2026-07-15 08:30:07.24185+00
\.


--
-- Data for Name: casos_contactos; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.casos_contactos (caso_id, contacto_id) FROM stdin;
\.


--
-- Data for Name: casos_recursos; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.casos_recursos (caso_id, recurso_id, created_at) FROM stdin;
2	37	2026-07-15 08:25:23.944926+00
\.


--
-- Data for Name: categorias_caso; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.categorias_caso (id, nombre, color, activo, created_at) FROM stdin;
1	Soporte Técnico	#3B82F6	t	2026-07-13 22:54:01.621482+00
2	Falla / Error	#EF4444	t	2026-07-13 22:54:01.621482+00
3	Instalación	#10B981	t	2026-07-13 22:54:01.621482+00
4	Consulta	#F59E0B	t	2026-07-13 22:54:01.621482+00
5	Mantenimiento	#8B5CF6	t	2026-07-13 22:54:01.621482+00
6	Configuración	#14B8A6	t	2026-07-13 22:54:01.621482+00
7	Otro	#6B7280	t	2026-07-13 22:54:01.621482+00
\.


--
-- Data for Name: categorias_mantenimiento; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.categorias_mantenimiento (id, nombre, color) FROM stdin;
1	Mantenimiento Preventivo	#10B981
2	Mantenimiento Correctivo	#EF4444
3	Instalación / Configuración	#3B82F6
4	Diagnóstico	#F59E0B
5	Soporte Remoto	#8B5CF6
6	Formateo / Backup	#EC4899
7	Redes / Cableado	#14B8A6
\.


--
-- Data for Name: contactos; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.contactos (id, cliente_id, nombre, telefono, email, whatsapp, cargo, activo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mantenimiento_detalles; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.mantenimiento_detalles (id, mantenimiento_id, creado_por, contenido, tipo, created_at) FROM stdin;
\.


--
-- Data for Name: mantenimientos; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.mantenimientos (id, recurso_id, categoria_id, tecnico_id, titulo, descripcion, prioridad, estado, fecha_solicitud, fecha_ejecucion, hora_inicio, hora_fin, costo_mano_obra, costo_repuestos, venta_item_id, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: recursos; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.recursos (id, cliente_id, nombre, tipo, marca, modelo, referencia, serial, procesador, memoria_gb, almacenamiento_gb, sistema_operativo, ubicacion, descripcion, activo, created_at, updated_at, atributos) FROM stdin;
1	159	Lenovo Andres Cortez	Computador	Lenovo	IdeaPad 3 15IRH10	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
2	159	Lenovo Subey Tatiana	Computador	Lenovo	IdeaPad Slim 3 15IRH10	\N	PF68N6RS	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
3	159	Lenovo Shirley	Computador	Lenovo	IdeaPad 3 15IIL05	\N	PF28BJH4	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
4	159	HP 14 - Leidy Rodriguez	Computador	HP	HP 14	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
5	159	Lenovo Thinkbook Sergio	Computador	Lenovo	Thinkbook	\N	LR0EYTBH	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
6	159	Lenovo ideapad 3 - Cindy Betancur	Computador	Lenovo	IdeaPad 3	\N	PF3TE30J	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
7	159	Lenovo S145 - Yazmin	Computador	Lenovo	S145	\N	PF32XNZ3	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
8	159	Lenovo IdeaPad 3 - Subey	Computador	Lenovo	IdeaPad 3	\N	PF369BYV	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
9	160	Veronica Gestion Calidad	Computador	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
10	160	PC08 - Seguridad	Computador	DELL	Vostro 3458	\N	20Z8VF2	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
11	161	PC15 - Logistica2	Computador	DELL	Vostro 14 3000	\N	3WC9RM3	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
12	161	PC18 - Logistica1	Computador	ASUS	VivoBook X409DA_M409DA	\N	L9N0CV059128376	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
13	161	PC04 - Gerencia Administrativa	Computador	HP	\N	\N	CND31328D8	\N	\N	\N	\N	\N	PC02 - Portatil HP - Johan	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
14	161	HP Logistica4	Computador	HP	245 G9	\N	5CG4074Y5F	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
15	161	PC Logistica3	Computador	HP	245G10	\N	5CG438064	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
16	161	PC17 - Coordinador Mantenimiento	Computador	HP	\N	\N	5CD2403831	\N	\N	\N	\N	\N	PC17 - Portatil HP - Julian Vergara	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
17	161	PC016 - Compras	Computador	\N	\N	\N	5CG21721CN	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
18	162	PC Sodimac	Computador	\N	\N	\N	\N	\N	\N	\N	\N	\N	CPU Facturación Home Center	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
19	162	Portátil HP (Cartera)	Computador	HP	245 G8	\N	5CG1320LKW	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
20	162	HP AIO Cartera	Computador	HP	AIO 22-DF0007LA	\N	8CC1190PNZ	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
21	162	Tesorería PC	Computador	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
22	162	Hosting Promatel	Hosting	\N	\N	\N	\N	\N	\N	\N	\N	\N	Hosting página web	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
23	163	HP AIO AuxContable	Computador	HP	AIO 24-F013LA	\N	8CC92326S8	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
24	163	Construcción 4	Computador	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
25	163	Comercial 2	Computador	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
26	163	Construcción 2	Computador	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
27	164	Access Point TP Link	Red	TP-Link	\N	\N	\N	\N	\N	\N	\N	\N	SSID: Simbolo 5G	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
28	164	HP Juan Diego	Computador	HP	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
29	164	ASUS X543UA - Yuliana Rua	Computador	ASUS	X543UA	\N	MAN0CX23J75443D	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
30	164	Computador 1	Computador	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
31	164	Asus JuanFdo	Computador	ASUS	\N	\N	L8N0LP01F492334	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
32	164	Acer A514	Computador	Acer	A514	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
33	165	ASUS Vivobook 14	Computador	ASUS	Vivobook 14	\N	M1N0CX023456012	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
34	166	Office 365 personal	Office 365	\N	\N	\N	\N	\N	\N	\N	\N	\N	Suscripción anual	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
35	167	ASUS X415	Computador	ASUS	X415	\N	R2N0CV09X683088	\N	\N	\N	\N	\N	\N	t	2026-07-12 10:24:56.847891+00	2026-07-12 10:24:56.847891+00	{}
36	86	Portatil DELL Andres	Computador	Dell Inc.	Inspiron 15 3515	\N	17PFJQ3	AMD Ryzen 5 3450U with Radeon Vega Mobile Gfx  	12.0	1170.0	Microsoft Windows 11 Pro			t	2026-07-12 10:47:37.485377+00	2026-07-12 10:52:36.764813+00	{"chip_video": "AMD Radeon(TM) Graphics", "memoria_video_mb": 2048, "tipo_almacenamiento": "HDD"}
37	58	Asus Vivobook  16	Computador	Asus	X1605VA-MB575	\N	RBN0CV12C862487	Intel Core i9-13900H	16.0	1000.0	Windows 11	\N	\N	t	2026-07-14 21:14:35.158511+00	2026-07-14 21:14:35.158511+00	{"chip_video": null, "memoria_video_mb": null, "tipo_almacenamiento": "SSD"}
\.


--
-- Data for Name: tipos_recurso; Type: TABLE DATA; Schema: helpdesk; Owner: -
--

COPY helpdesk.tipos_recurso (id, nombre, created_at) FROM stdin;
1	Computador	2026-07-14 13:34:18.108664
2	Hosting	2026-07-14 13:34:18.108664
3	Office 365	2026-07-14 13:34:18.108664
4	Red	2026-07-14 13:34:18.108664
6	Impresora	2026-07-14 13:34:18.108664
10	Otro	2026-07-14 13:34:18.108664
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY inventario.categorias (id, nombre, created_at) FROM stdin;
3	Repuestos Computadores	2026-07-03 10:44:26.140289
4	Accesorios Computadores	2026-07-03 11:00:45.883896
5	Licencias	2026-07-03 11:10:45.042601
6	Impresoras	2026-07-03 11:11:10.195201
7	Computadores	2026-07-03 11:11:39.676896
8	Repuestos de impresoras	2026-07-03 11:12:39.292481
9	Servicios	2026-07-07 10:15:04.054892
10	Suministros	2026-07-07 11:31:21.914399
\.


--
-- Data for Name: entradas; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY inventario.entradas (id, gasto_id, producto_id, cantidad, cantidad_disponible, costo_unitario, fecha, created_at) FROM stdin;
4	22	4	1.000000	1.000000	88235.29	2026-05-06	2026-07-03 02:14:26.409039
10	21	7	1.000000	0.000000	1619000.00	2026-05-14	2026-07-03 02:20:31.950522
8	16	6	2.000000	0.000000	63025.21	2026-05-11	2026-07-03 02:17:57.708562
6	14	5	1.000000	0.000000	1502521.01	2026-05-11	2026-07-03 02:15:42.599583
15	28	10	1.000000	1.000000	29411.76	2026-06-02	2026-07-03 10:59:57.638156
18	34	4	1.000000	1.000000	81512.61	2026-06-17	2026-07-03 11:06:06.905317
17	33	11	1.000000	0.000000	396000.00	2026-06-17	2026-07-03 11:04:14.318618
11	24	8	1.000000	0.000000	273109.24	2026-05-22	2026-07-03 10:43:04.368538
13	26	9	1.000000	0.000000	71428.57	2026-06-01	2026-07-03 10:58:11.990702
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY inventario.productos (id, nombre, categoria, inventariable, unidad_medida, created_at, updated_at, codigo) FROM stdin;
8	DISCO SOLIDO KINGSTON NV3 500GB	Repuestos Computadores	t	UND	2026-07-03 10:42:43.846683	2026-07-03 10:44:39.341969	SNV3S500G
9	Bateria Hp HT03 11.4V 3600mAh 41Wh	Repuestos Computadores	t	UND	2026-07-03 10:58:07.417539	2026-07-03 10:58:07.417539	HPP HT03-3S1P
10	Hub Tipo C con adaptador USB, 8 en 1 ORICO	Accesorios Computadores	t	UND	2026-07-03 10:59:33.81273	2026-07-03 11:00:55.464086	ORICO-YSA8-U3-GY-BP
4	Bateria Lenovo L16L2PB2 7.6V 4100mAh 31Wh	Repuestos Computadores	t	UND	2026-07-03 02:14:18.189444	2026-07-03 11:10:16.334733	BLE-025
11	LICENCIA  KASPERSKY SMALL OFFICE SECURITY 8, 10 DISPOSITIVOS,  1 SERVER,  1 AÑO	Licencias	t	UND	2026-07-03 11:04:11.228632	2026-07-03 11:10:54.492975	KL4541DDKFR
5	Maquina RICOH M320F MULTIFUNCIONAL A4 ARDF 34 ppm Blanco y Negro.Incluye Toner de Inicio	Impresoras	t	UND	2026-07-03 02:15:30.379393	2026-07-03 11:11:22.597978	RICOHM320F
7	PORTATIL LENOVO V14 GEN4	Computadores	t	UND	2026-07-03 02:20:29.546833	2026-07-03 11:11:47.872995	82YT00TKLM
6	Toner Ricoh SP 3710X KATUN	Repuestos de impresoras	t	UND	2026-07-03 02:17:36.563022	2026-07-03 11:12:54.44964	TonerRicohSP3710X
12	Servicio Tecnico Remoto por una hora	Servicios	f	UND	2026-07-07 10:15:16.334461	2026-07-07 10:15:16.334461	STRX1H
13	Materiales sin Inventario	Suministros	f	UND	2026-07-07 11:31:31.246701	2026-07-07 11:31:31.246701	MSIN
14	Mantenimiento Computador	Servicios	f	UND	2026-07-07 11:33:41.890287	2026-07-11 12:35:31.823665	MTTOPC
15	Disco Duro Mecanico 1TB	Repuestos Computadores	t	UND	2026-07-11 16:41:40.828676	2026-07-11 16:41:40.828676	HDD1TB
16	Microsoft Office 365, Una cuenta, 5 dispositivos, 1 año	Licencias	f	UND	2026-07-11 17:29:40.546376	2026-07-11 17:29:40.546376	OFF3651C5D1A
17	Servicio Técnico Presencial x 1 hora	Servicios	f	UND	2026-07-11 17:33:34.838968	2026-07-11 17:33:34.838968	STPX1H
\.


--
-- Data for Name: salida_detalle; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY inventario.salida_detalle (id, salida_id, entrada_id, cantidad_consumida, costo_unitario) FROM stdin;
3	3	10	1.000000	1619000.00
4	4	8	2.000000	63025.21
5	5	6	1.000000	1502521.01
6	6	17	1.000000	396000.00
7	7	11	1.000000	273109.24
8	8	13	1.000000	71428.57
\.


--
-- Data for Name: salidas; Type: TABLE DATA; Schema: inventario; Owner: -
--

COPY inventario.salidas (id, factura_item_id, producto_id, cantidad, costo_total, created_at) FROM stdin;
3	27	7	1.000000	1619000.00	2026-07-03 02:31:47.518233
4	26	6	2.000000	126050.42	2026-07-03 02:32:55.141623
5	25	5	1.000000	1502521.01	2026-07-03 02:33:14.536378
6	49	11	1.000000	396000.00	2026-07-04 14:19:40.46599
7	60	8	1.000000	273109.24	2026-07-11 12:30:19.378504
8	63	9	1.000000	71428.57	2026-07-11 16:44:30.049428
\.


--
-- Data for Name: empresas; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY usuarios.empresas (id, nombre, nit, activa, created_at, updated_at) FROM stdin;
1	Mi Empresa	123456789	t	2026-07-11 13:22:25.916505+00	2026-07-11 13:22:25.916505+00
\.


--
-- Data for Name: permisos; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY usuarios.permisos (id, codigo, nombre, descripcion, modulo, created_at) FROM stdin;
16	terceros.ver	Ver terceros	\N	Terceros	2026-07-11 13:20:59.023162+00
17	terceros.gestionar	Crear/editar/eliminar terceros	\N	Terceros	2026-07-11 13:20:59.0258+00
18	utilidad.ver	Ver reporte de utilidad	\N	Utilidad	2026-07-11 13:20:59.029421+00
19	usuarios.gestionar	Gestionar usuarios, roles y permisos	\N	Administración	2026-07-11 13:20:59.032742+00
115	helpdesk.ver	Ver recursos y mantenimientos	\N	Helpdesk	2026-07-12 08:58:23.598279+00
116	helpdesk.gestionar	Crear/editar recursos y mantenimientos	\N	Helpdesk	2026-07-12 08:58:23.603904+00
516	helpdesk.casos.ver	Ver casos de soporte	\N	Helpdesk	2026-07-13 22:50:10.27099+00
517	helpdesk.casos.gestionar	Crear/editar/cerrar casos de soporte	\N	Helpdesk	2026-07-13 22:50:10.279748+00
1	dashboard.ver	Ver Dashboard	\N	Dashboard	2026-07-11 13:20:58.961456+00
2	facturas.ver	Ver facturas	\N	Facturación	2026-07-11 13:20:58.973857+00
3	facturas.crear	Crear facturas (subir XML)	\N	Facturación	2026-07-11 13:20:58.9777+00
4	ventas.ver	Ver items de venta	\N	Ventas	2026-07-11 13:20:58.981485+00
5	ventas.crear	Crear/editar ventas manuales	\N	Ventas	2026-07-11 13:20:58.9855+00
6	productos.ver	Ver catálogo de productos	\N	Productos	2026-07-11 13:20:58.98967+00
7	productos.gestionar	Crear/editar productos	\N	Productos	2026-07-11 13:20:58.993016+00
8	gastos.ver	Ver gastos	\N	Gastos	2026-07-11 13:20:58.996705+00
9	gastos.gestionar	Crear/editar/eliminar gastos	\N	Gastos	2026-07-11 13:20:59.000689+00
10	compras.ver	Ver compras	\N	Compras	2026-07-11 13:20:59.004226+00
11	compras.crear	Subir XML de compra	\N	Compras	2026-07-11 13:20:59.0073+00
12	inventario.ver	Ver stock y movimientos	\N	Inventario	2026-07-11 13:20:59.010313+00
13	inventario.gestionar	Consumir inventario	\N	Inventario	2026-07-11 13:20:59.014746+00
14	cartera.ver	Ver cartera y pagos	\N	Cartera	2026-07-11 13:20:59.017668+00
15	cartera.gestionar	Registrar/anular pagos	\N	Cartera	2026-07-11 13:20:59.020397+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY usuarios.roles (id, nombre, descripcion, created_at) FROM stdin;
1	Administrador	Acceso total al sistema	2026-07-11 13:20:59.041131+00
2	Operador	Puede consultar, crear y editar registros de negocio	2026-07-11 13:20:59.106188+00
3	Consultor	Solo consulta de datos	2026-07-11 13:20:59.206605+00
4	Tecnico	Soporte tecnico	2026-07-13 06:44:21.958454+00
\.


--
-- Data for Name: roles_permisos; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY usuarios.roles_permisos (rol_id, permiso_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
1	10
1	11
1	12
1	13
1	14
1	15
1	16
1	17
1	18
1	19
2	1
2	2
2	3
2	4
2	5
2	6
2	7
2	8
2	9
2	10
2	11
2	12
2	13
2	14
2	15
2	16
2	17
2	18
3	1
3	2
3	4
3	6
3	8
3	10
3	12
3	14
3	16
3	18
1	115
1	116
2	115
2	116
3	115
4	116
4	115
1	516
1	517
2	516
2	517
3	516
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY usuarios.usuarios (id, empresa_id, username, email, password_hash, nombres, apellidos, activo, created_at, updated_at) FROM stdin;
1	1	admin	admin@example.com	$2b$10$gG3d8V/7nRfbpYONywxk9ORGMWoLj8ZAis2PQUNVkb1KN4bSLIXcq	Admin	Sistema	t	2026-07-11 13:22:25.916505+00	2026-07-11 13:22:25.916505+00
2	1	Abenthan	maxansistemas@gmail.com	$2b$10$KSDlOwV.daJ07YaGLnOGVuhL4jLJmXzlrn4pw41TLU5BU9BoacEiC	Andres	Benthan	t	2026-07-11 15:26:55.12104+00	2026-07-11 15:26:55.12104+00
\.


--
-- Data for Name: usuarios_roles; Type: TABLE DATA; Schema: usuarios; Owner: -
--

COPY usuarios.usuarios_roles (usuario_id, rol_id) FROM stdin;
1	1
2	1
2	3
2	2
\.


--
-- Name: medios_pago_id_seq; Type: SEQUENCE SET; Schema: cartera; Owner: -
--

SELECT pg_catalog.setval('cartera.medios_pago_id_seq', 7, true);


--
-- Name: pago_aplicaciones_id_seq; Type: SEQUENCE SET; Schema: cartera; Owner: -
--

SELECT pg_catalog.setval('cartera.pago_aplicaciones_id_seq', 15, true);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: cartera; Owner: -
--

SELECT pg_catalog.setval('cartera.pagos_id_seq', 13, true);


--
-- Name: facturas_compra_archivos_id_seq; Type: SEQUENCE SET; Schema: compras; Owner: -
--

SELECT pg_catalog.setval('compras.facturas_compra_archivos_id_seq', 16, true);


--
-- Name: facturas_compra_id_seq; Type: SEQUENCE SET; Schema: compras; Owner: -
--

SELECT pg_catalog.setval('compras.facturas_compra_id_seq', 20, true);


--
-- Name: factura_archivos_id_seq; Type: SEQUENCE SET; Schema: facturacion; Owner: -
--

SELECT pg_catalog.setval('facturacion.factura_archivos_id_seq', 1, false);


--
-- Name: factura_impuestos_id_seq; Type: SEQUENCE SET; Schema: facturacion; Owner: -
--

SELECT pg_catalog.setval('facturacion.factura_impuestos_id_seq', 1, false);


--
-- Name: factura_respuestas_dian_id_seq; Type: SEQUENCE SET; Schema: facturacion; Owner: -
--

SELECT pg_catalog.setval('facturacion.factura_respuestas_dian_id_seq', 1, false);


--
-- Name: terceros_id_seq; Type: SEQUENCE SET; Schema: facturacion; Owner: -
--

SELECT pg_catalog.setval('facturacion.terceros_id_seq', 172, true);


--
-- Name: ventas_id_seq; Type: SEQUENCE SET; Schema: facturacion; Owner: -
--

SELECT pg_catalog.setval('facturacion.ventas_id_seq', 79, true);


--
-- Name: ventas_items_id_seq; Type: SEQUENCE SET; Schema: facturacion; Owner: -
--

SELECT pg_catalog.setval('facturacion.ventas_items_id_seq', 65, true);


--
-- Name: ventas_manual_seq; Type: SEQUENCE SET; Schema: facturacion; Owner: -
--

SELECT pg_catalog.setval('facturacion.ventas_manual_seq', 5, true);


--
-- Name: clasificaciones_id_seq; Type: SEQUENCE SET; Schema: gastos; Owner: -
--

SELECT pg_catalog.setval('gastos.clasificaciones_id_seq', 4, true);


--
-- Name: gastos_id_seq; Type: SEQUENCE SET; Schema: gastos; Owner: -
--

SELECT pg_catalog.setval('gastos.gastos_id_seq', 76, true);


--
-- Name: caso_detalles_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.caso_detalles_id_seq', 2, true);


--
-- Name: caso_numero_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.caso_numero_seq', 3, true);


--
-- Name: casos_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.casos_id_seq', 3, true);


--
-- Name: categorias_caso_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.categorias_caso_id_seq', 14, true);


--
-- Name: categorias_mantenimiento_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.categorias_mantenimiento_id_seq', 7, true);


--
-- Name: contactos_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.contactos_id_seq', 1, false);


--
-- Name: mantenimiento_detalles_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.mantenimiento_detalles_id_seq', 1, false);


--
-- Name: mantenimientos_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.mantenimientos_id_seq', 1, true);


--
-- Name: recursos_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.recursos_id_seq', 37, true);


--
-- Name: tipos_recurso_id_seq; Type: SEQUENCE SET; Schema: helpdesk; Owner: -
--

SELECT pg_catalog.setval('helpdesk.tipos_recurso_id_seq', 10, true);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.categorias_id_seq', 10, true);


--
-- Name: entradas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.entradas_id_seq', 19, true);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.productos_id_seq', 17, true);


--
-- Name: salida_detalle_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.salida_detalle_id_seq', 8, true);


--
-- Name: salidas_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: -
--

SELECT pg_catalog.setval('inventario.salidas_id_seq', 8, true);


--
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: usuarios; Owner: -
--

SELECT pg_catalog.setval('usuarios.empresas_id_seq', 1, true);


--
-- Name: permisos_id_seq; Type: SEQUENCE SET; Schema: usuarios; Owner: -
--

SELECT pg_catalog.setval('usuarios.permisos_id_seq', 1269, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: usuarios; Owner: -
--

SELECT pg_catalog.setval('usuarios.roles_id_seq', 4, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: usuarios; Owner: -
--

SELECT pg_catalog.setval('usuarios.usuarios_id_seq', 2, true);


--
-- Name: medios_pago medios_pago_nombre_key; Type: CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.medios_pago
    ADD CONSTRAINT medios_pago_nombre_key UNIQUE (nombre);


--
-- Name: medios_pago medios_pago_pkey; Type: CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.medios_pago
    ADD CONSTRAINT medios_pago_pkey PRIMARY KEY (id);


--
-- Name: pago_aplicaciones pago_aplicaciones_pago_id_venta_id_key; Type: CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pago_aplicaciones
    ADD CONSTRAINT pago_aplicaciones_pago_id_venta_id_key UNIQUE (pago_id, venta_id);


--
-- Name: pago_aplicaciones pago_aplicaciones_pkey; Type: CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pago_aplicaciones
    ADD CONSTRAINT pago_aplicaciones_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: facturas_compra_archivos facturas_compra_archivos_pkey; Type: CONSTRAINT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra_archivos
    ADD CONSTRAINT facturas_compra_archivos_pkey PRIMARY KEY (id);


--
-- Name: facturas_compra facturas_compra_codigo_unico_documento_key; Type: CONSTRAINT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra
    ADD CONSTRAINT facturas_compra_codigo_unico_documento_key UNIQUE (codigo_unico_documento);


--
-- Name: facturas_compra facturas_compra_pkey; Type: CONSTRAINT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra
    ADD CONSTRAINT facturas_compra_pkey PRIMARY KEY (id);


--
-- Name: factura_archivos factura_archivos_pkey; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_archivos
    ADD CONSTRAINT factura_archivos_pkey PRIMARY KEY (id);


--
-- Name: factura_impuestos factura_impuestos_pkey; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_impuestos
    ADD CONSTRAINT factura_impuestos_pkey PRIMARY KEY (id);


--
-- Name: ventas_items factura_items_factura_id_numero_linea_key; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas_items
    ADD CONSTRAINT factura_items_factura_id_numero_linea_key UNIQUE (venta_id, numero_linea);


--
-- Name: ventas_items factura_items_pkey; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas_items
    ADD CONSTRAINT factura_items_pkey PRIMARY KEY (id);


--
-- Name: factura_respuestas_dian factura_respuestas_dian_pkey; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_respuestas_dian
    ADD CONSTRAINT factura_respuestas_dian_pkey PRIMARY KEY (id);


--
-- Name: ventas facturas_cufe_key; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas
    ADD CONSTRAINT facturas_cufe_key UNIQUE (cufe);


--
-- Name: ventas facturas_pkey; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id);


--
-- Name: terceros terceros_pkey; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.terceros
    ADD CONSTRAINT terceros_pkey PRIMARY KEY (id);


--
-- Name: terceros terceros_tipo_documento_numero_documento_key; Type: CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.terceros
    ADD CONSTRAINT terceros_tipo_documento_numero_documento_key UNIQUE (tipo_documento, numero_documento);


--
-- Name: clasificaciones clasificaciones_nombre_key; Type: CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.clasificaciones
    ADD CONSTRAINT clasificaciones_nombre_key UNIQUE (nombre);


--
-- Name: clasificaciones clasificaciones_pkey; Type: CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.clasificaciones
    ADD CONSTRAINT clasificaciones_pkey PRIMARY KEY (id);


--
-- Name: gastos gastos_pkey; Type: CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.gastos
    ADD CONSTRAINT gastos_pkey PRIMARY KEY (id);


--
-- Name: caso_detalles caso_detalles_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.caso_detalles
    ADD CONSTRAINT caso_detalles_pkey PRIMARY KEY (id);


--
-- Name: casos_contactos casos_contactos_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos_contactos
    ADD CONSTRAINT casos_contactos_pkey PRIMARY KEY (caso_id, contacto_id);


--
-- Name: casos casos_numero_key; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_numero_key UNIQUE (numero);


--
-- Name: casos casos_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_pkey PRIMARY KEY (id);


--
-- Name: casos_recursos casos_recursos_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos_recursos
    ADD CONSTRAINT casos_recursos_pkey PRIMARY KEY (caso_id, recurso_id);


--
-- Name: categorias_caso categorias_caso_nombre_key; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.categorias_caso
    ADD CONSTRAINT categorias_caso_nombre_key UNIQUE (nombre);


--
-- Name: categorias_caso categorias_caso_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.categorias_caso
    ADD CONSTRAINT categorias_caso_pkey PRIMARY KEY (id);


--
-- Name: categorias_mantenimiento categorias_mantenimiento_nombre_key; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.categorias_mantenimiento
    ADD CONSTRAINT categorias_mantenimiento_nombre_key UNIQUE (nombre);


--
-- Name: categorias_mantenimiento categorias_mantenimiento_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.categorias_mantenimiento
    ADD CONSTRAINT categorias_mantenimiento_pkey PRIMARY KEY (id);


--
-- Name: contactos contactos_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.contactos
    ADD CONSTRAINT contactos_pkey PRIMARY KEY (id);


--
-- Name: mantenimiento_detalles mantenimiento_detalles_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimiento_detalles
    ADD CONSTRAINT mantenimiento_detalles_pkey PRIMARY KEY (id);


--
-- Name: mantenimientos mantenimientos_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimientos
    ADD CONSTRAINT mantenimientos_pkey PRIMARY KEY (id);


--
-- Name: recursos recursos_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.recursos
    ADD CONSTRAINT recursos_pkey PRIMARY KEY (id);


--
-- Name: recursos recursos_serial_key; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.recursos
    ADD CONSTRAINT recursos_serial_key UNIQUE (serial);


--
-- Name: tipos_recurso tipos_recurso_nombre_key; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.tipos_recurso
    ADD CONSTRAINT tipos_recurso_nombre_key UNIQUE (nombre);


--
-- Name: tipos_recurso tipos_recurso_pkey; Type: CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.tipos_recurso
    ADD CONSTRAINT tipos_recurso_pkey PRIMARY KEY (id);


--
-- Name: categorias categorias_nombre_key; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.categorias
    ADD CONSTRAINT categorias_nombre_key UNIQUE (nombre);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: entradas entradas_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.entradas
    ADD CONSTRAINT entradas_pkey PRIMARY KEY (id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: salida_detalle salida_detalle_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salida_detalle
    ADD CONSTRAINT salida_detalle_pkey PRIMARY KEY (id);


--
-- Name: salidas salidas_pkey; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salidas
    ADD CONSTRAINT salidas_pkey PRIMARY KEY (id);


--
-- Name: productos uq_productos_codigo; Type: CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.productos
    ADD CONSTRAINT uq_productos_codigo UNIQUE (codigo);


--
-- Name: empresas empresas_nit_key; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.empresas
    ADD CONSTRAINT empresas_nit_key UNIQUE (nit);


--
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- Name: permisos permisos_codigo_key; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.permisos
    ADD CONSTRAINT permisos_codigo_key UNIQUE (codigo);


--
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id);


--
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- Name: roles_permisos roles_permisos_pkey; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.roles_permisos
    ADD CONSTRAINT roles_permisos_pkey PRIMARY KEY (rol_id, permiso_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios_roles usuarios_roles_pkey; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios_roles
    ADD CONSTRAINT usuarios_roles_pkey PRIMARY KEY (usuario_id, rol_id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: idx_pago_aplicaciones_pago; Type: INDEX; Schema: cartera; Owner: -
--

CREATE INDEX idx_pago_aplicaciones_pago ON cartera.pago_aplicaciones USING btree (pago_id);


--
-- Name: idx_pago_aplicaciones_venta; Type: INDEX; Schema: cartera; Owner: -
--

CREATE INDEX idx_pago_aplicaciones_venta ON cartera.pago_aplicaciones USING btree (venta_id);


--
-- Name: idx_pagos_cliente; Type: INDEX; Schema: cartera; Owner: -
--

CREATE INDEX idx_pagos_cliente ON cartera.pagos USING btree (cliente_id);


--
-- Name: idx_pagos_fecha; Type: INDEX; Schema: cartera; Owner: -
--

CREATE INDEX idx_pagos_fecha ON cartera.pagos USING btree (fecha_pago);


--
-- Name: idx_facturas_emisor; Type: INDEX; Schema: facturacion; Owner: -
--

CREATE INDEX idx_facturas_emisor ON facturacion.ventas USING btree (emisor_id);


--
-- Name: idx_facturas_estado; Type: INDEX; Schema: facturacion; Owner: -
--

CREATE INDEX idx_facturas_estado ON facturacion.ventas USING btree (estado);


--
-- Name: idx_facturas_fecha; Type: INDEX; Schema: facturacion; Owner: -
--

CREATE INDEX idx_facturas_fecha ON facturacion.ventas USING btree (fecha_emision);


--
-- Name: idx_facturas_receptor; Type: INDEX; Schema: facturacion; Owner: -
--

CREATE INDEX idx_facturas_receptor ON facturacion.ventas USING btree (receptor_id);


--
-- Name: idx_gastos_factura_compra; Type: INDEX; Schema: gastos; Owner: -
--

CREATE INDEX idx_gastos_factura_compra ON gastos.gastos USING btree (factura_compra_id);


--
-- Name: idx_gastos_producto; Type: INDEX; Schema: gastos; Owner: -
--

CREATE INDEX idx_gastos_producto ON gastos.gastos USING btree (producto_id);


--
-- Name: idx_gastos_venta_item; Type: INDEX; Schema: gastos; Owner: -
--

CREATE INDEX idx_gastos_venta_item ON gastos.gastos USING btree (venta_item_id);


--
-- Name: idx_entradas_producto_fecha; Type: INDEX; Schema: inventario; Owner: -
--

CREATE INDEX idx_entradas_producto_fecha ON inventario.entradas USING btree (producto_id, fecha, id);


--
-- Name: pago_aplicaciones trg_pago_aplicaciones_actualizar_saldo; Type: TRIGGER; Schema: cartera; Owner: -
--

CREATE TRIGGER trg_pago_aplicaciones_actualizar_saldo AFTER INSERT OR DELETE ON cartera.pago_aplicaciones FOR EACH ROW EXECUTE FUNCTION cartera.fn_actualizar_saldo();


--
-- Name: pagos trg_pagos_updated_at; Type: TRIGGER; Schema: cartera; Owner: -
--

CREATE TRIGGER trg_pagos_updated_at BEFORE UPDATE ON cartera.pagos FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: facturas_compra trg_facturas_compra_updated_at; Type: TRIGGER; Schema: compras; Owner: -
--

CREATE TRIGGER trg_facturas_compra_updated_at BEFORE UPDATE ON compras.facturas_compra FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: ventas trg_facturas_updated_at; Type: TRIGGER; Schema: facturacion; Owner: -
--

CREATE TRIGGER trg_facturas_updated_at BEFORE UPDATE ON facturacion.ventas FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: terceros trg_terceros_updated_at; Type: TRIGGER; Schema: facturacion; Owner: -
--

CREATE TRIGGER trg_terceros_updated_at BEFORE UPDATE ON facturacion.terceros FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: gastos trg_gastos_crear_entrada; Type: TRIGGER; Schema: gastos; Owner: -
--

CREATE TRIGGER trg_gastos_crear_entrada AFTER INSERT OR UPDATE OF producto_id ON gastos.gastos FOR EACH ROW EXECUTE FUNCTION inventario.fn_crear_entrada();


--
-- Name: gastos trg_gastos_set_clasificacion; Type: TRIGGER; Schema: gastos; Owner: -
--

CREATE TRIGGER trg_gastos_set_clasificacion BEFORE INSERT OR UPDATE ON gastos.gastos FOR EACH ROW EXECUTE FUNCTION gastos.fn_set_clasificacion();


--
-- Name: gastos trg_gastos_updated_at; Type: TRIGGER; Schema: gastos; Owner: -
--

CREATE TRIGGER trg_gastos_updated_at BEFORE UPDATE ON gastos.gastos FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: casos trg_casos_updated_at; Type: TRIGGER; Schema: helpdesk; Owner: -
--

CREATE TRIGGER trg_casos_updated_at BEFORE UPDATE ON helpdesk.casos FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: contactos trg_contactos_updated_at; Type: TRIGGER; Schema: helpdesk; Owner: -
--

CREATE TRIGGER trg_contactos_updated_at BEFORE UPDATE ON helpdesk.contactos FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: mantenimientos trg_mantenimientos_updated_at; Type: TRIGGER; Schema: helpdesk; Owner: -
--

CREATE TRIGGER trg_mantenimientos_updated_at BEFORE UPDATE ON helpdesk.mantenimientos FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: recursos trg_recursos_updated_at; Type: TRIGGER; Schema: helpdesk; Owner: -
--

CREATE TRIGGER trg_recursos_updated_at BEFORE UPDATE ON helpdesk.recursos FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: productos trg_productos_updated_at; Type: TRIGGER; Schema: inventario; Owner: -
--

CREATE TRIGGER trg_productos_updated_at BEFORE UPDATE ON inventario.productos FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: empresas trg_empresas_updated_at; Type: TRIGGER; Schema: usuarios; Owner: -
--

CREATE TRIGGER trg_empresas_updated_at BEFORE UPDATE ON usuarios.empresas FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: usuarios trg_usuarios_updated_at; Type: TRIGGER; Schema: usuarios; Owner: -
--

CREATE TRIGGER trg_usuarios_updated_at BEFORE UPDATE ON usuarios.usuarios FOR EACH ROW EXECUTE FUNCTION facturacion.fn_set_updated_at();


--
-- Name: pago_aplicaciones pago_aplicaciones_pago_id_fkey; Type: FK CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pago_aplicaciones
    ADD CONSTRAINT pago_aplicaciones_pago_id_fkey FOREIGN KEY (pago_id) REFERENCES cartera.pagos(id) ON DELETE CASCADE;


--
-- Name: pago_aplicaciones pago_aplicaciones_venta_id_fkey; Type: FK CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pago_aplicaciones
    ADD CONSTRAINT pago_aplicaciones_venta_id_fkey FOREIGN KEY (venta_id) REFERENCES facturacion.ventas(id) ON DELETE CASCADE;


--
-- Name: pagos pagos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pagos
    ADD CONSTRAINT pagos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES facturacion.terceros(id);


--
-- Name: pagos pagos_medio_pago_id_fkey; Type: FK CONSTRAINT; Schema: cartera; Owner: -
--

ALTER TABLE ONLY cartera.pagos
    ADD CONSTRAINT pagos_medio_pago_id_fkey FOREIGN KEY (medio_pago_id) REFERENCES cartera.medios_pago(id);


--
-- Name: facturas_compra_archivos facturas_compra_archivos_factura_compra_id_fkey; Type: FK CONSTRAINT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra_archivos
    ADD CONSTRAINT facturas_compra_archivos_factura_compra_id_fkey FOREIGN KEY (factura_compra_id) REFERENCES compras.facturas_compra(id) ON DELETE CASCADE;


--
-- Name: facturas_compra facturas_compra_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra
    ADD CONSTRAINT facturas_compra_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES facturacion.terceros(id);


--
-- Name: facturas_compra facturas_compra_receptor_id_fkey; Type: FK CONSTRAINT; Schema: compras; Owner: -
--

ALTER TABLE ONLY compras.facturas_compra
    ADD CONSTRAINT facturas_compra_receptor_id_fkey FOREIGN KEY (receptor_id) REFERENCES facturacion.terceros(id);


--
-- Name: factura_archivos factura_archivos_factura_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_archivos
    ADD CONSTRAINT factura_archivos_factura_id_fkey FOREIGN KEY (factura_id) REFERENCES facturacion.ventas(id) ON DELETE CASCADE;


--
-- Name: factura_impuestos factura_impuestos_factura_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_impuestos
    ADD CONSTRAINT factura_impuestos_factura_id_fkey FOREIGN KEY (factura_id) REFERENCES facturacion.ventas(id) ON DELETE CASCADE;


--
-- Name: factura_impuestos factura_impuestos_factura_item_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_impuestos
    ADD CONSTRAINT factura_impuestos_factura_item_id_fkey FOREIGN KEY (factura_item_id) REFERENCES facturacion.ventas_items(id) ON DELETE CASCADE;


--
-- Name: ventas_items factura_items_factura_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas_items
    ADD CONSTRAINT factura_items_factura_id_fkey FOREIGN KEY (venta_id) REFERENCES facturacion.ventas(id) ON DELETE CASCADE;


--
-- Name: factura_respuestas_dian factura_respuestas_dian_factura_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.factura_respuestas_dian
    ADD CONSTRAINT factura_respuestas_dian_factura_id_fkey FOREIGN KEY (factura_id) REFERENCES facturacion.ventas(id) ON DELETE CASCADE;


--
-- Name: ventas facturas_emisor_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas
    ADD CONSTRAINT facturas_emisor_id_fkey FOREIGN KEY (emisor_id) REFERENCES facturacion.terceros(id);


--
-- Name: ventas facturas_receptor_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas
    ADD CONSTRAINT facturas_receptor_id_fkey FOREIGN KEY (receptor_id) REFERENCES facturacion.terceros(id);


--
-- Name: ventas_items ventas_items_producto_id_fkey; Type: FK CONSTRAINT; Schema: facturacion; Owner: -
--

ALTER TABLE ONLY facturacion.ventas_items
    ADD CONSTRAINT ventas_items_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES inventario.productos(id);


--
-- Name: gastos fk_gasto_clasificacion; Type: FK CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.gastos
    ADD CONSTRAINT fk_gasto_clasificacion FOREIGN KEY (clasificacion) REFERENCES gastos.clasificaciones(nombre);


--
-- Name: gastos gastos_factura_compra_id_fkey; Type: FK CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.gastos
    ADD CONSTRAINT gastos_factura_compra_id_fkey FOREIGN KEY (factura_compra_id) REFERENCES compras.facturas_compra(id) ON DELETE CASCADE;


--
-- Name: gastos gastos_producto_id_fkey; Type: FK CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.gastos
    ADD CONSTRAINT gastos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES inventario.productos(id);


--
-- Name: gastos gastos_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.gastos
    ADD CONSTRAINT gastos_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES facturacion.terceros(id);


--
-- Name: gastos gastos_venta_item_id_fkey; Type: FK CONSTRAINT; Schema: gastos; Owner: -
--

ALTER TABLE ONLY gastos.gastos
    ADD CONSTRAINT gastos_venta_item_id_fkey FOREIGN KEY (venta_item_id) REFERENCES facturacion.ventas_items(id);


--
-- Name: caso_detalles caso_detalles_caso_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.caso_detalles
    ADD CONSTRAINT caso_detalles_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES helpdesk.casos(id) ON DELETE CASCADE;


--
-- Name: caso_detalles caso_detalles_creado_por_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.caso_detalles
    ADD CONSTRAINT caso_detalles_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES usuarios.usuarios(id);


--
-- Name: casos casos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES helpdesk.categorias_caso(id);


--
-- Name: casos casos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES facturacion.terceros(id);


--
-- Name: casos casos_contacto_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_contacto_id_fkey FOREIGN KEY (contacto_id) REFERENCES helpdesk.contactos(id);


--
-- Name: casos_contactos casos_contactos_caso_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos_contactos
    ADD CONSTRAINT casos_contactos_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES helpdesk.casos(id) ON DELETE CASCADE;


--
-- Name: casos_contactos casos_contactos_contacto_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos_contactos
    ADD CONSTRAINT casos_contactos_contacto_id_fkey FOREIGN KEY (contacto_id) REFERENCES helpdesk.contactos(id) ON DELETE CASCADE;


--
-- Name: casos casos_recurso_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_recurso_id_fkey FOREIGN KEY (recurso_id) REFERENCES helpdesk.recursos(id);


--
-- Name: casos_recursos casos_recursos_caso_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos_recursos
    ADD CONSTRAINT casos_recursos_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES helpdesk.casos(id) ON DELETE CASCADE;


--
-- Name: casos_recursos casos_recursos_recurso_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos_recursos
    ADD CONSTRAINT casos_recursos_recurso_id_fkey FOREIGN KEY (recurso_id) REFERENCES helpdesk.recursos(id) ON DELETE CASCADE;


--
-- Name: casos casos_tecnico_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_tecnico_id_fkey FOREIGN KEY (tecnico_id) REFERENCES usuarios.usuarios(id);


--
-- Name: casos casos_venta_item_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.casos
    ADD CONSTRAINT casos_venta_item_id_fkey FOREIGN KEY (venta_item_id) REFERENCES facturacion.ventas_items(id);


--
-- Name: contactos contactos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.contactos
    ADD CONSTRAINT contactos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES facturacion.terceros(id) ON DELETE CASCADE;


--
-- Name: recursos fk_recurso_tipo; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.recursos
    ADD CONSTRAINT fk_recurso_tipo FOREIGN KEY (tipo) REFERENCES helpdesk.tipos_recurso(nombre) ON DELETE RESTRICT;


--
-- Name: mantenimiento_detalles mantenimiento_detalles_creado_por_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimiento_detalles
    ADD CONSTRAINT mantenimiento_detalles_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES usuarios.usuarios(id);


--
-- Name: mantenimiento_detalles mantenimiento_detalles_mantenimiento_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimiento_detalles
    ADD CONSTRAINT mantenimiento_detalles_mantenimiento_id_fkey FOREIGN KEY (mantenimiento_id) REFERENCES helpdesk.mantenimientos(id) ON DELETE CASCADE;


--
-- Name: mantenimientos mantenimientos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimientos
    ADD CONSTRAINT mantenimientos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES helpdesk.categorias_mantenimiento(id);


--
-- Name: mantenimientos mantenimientos_recurso_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimientos
    ADD CONSTRAINT mantenimientos_recurso_id_fkey FOREIGN KEY (recurso_id) REFERENCES helpdesk.recursos(id);


--
-- Name: mantenimientos mantenimientos_tecnico_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimientos
    ADD CONSTRAINT mantenimientos_tecnico_id_fkey FOREIGN KEY (tecnico_id) REFERENCES usuarios.usuarios(id);


--
-- Name: mantenimientos mantenimientos_venta_item_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.mantenimientos
    ADD CONSTRAINT mantenimientos_venta_item_id_fkey FOREIGN KEY (venta_item_id) REFERENCES facturacion.ventas_items(id);


--
-- Name: recursos recursos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: helpdesk; Owner: -
--

ALTER TABLE ONLY helpdesk.recursos
    ADD CONSTRAINT recursos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES facturacion.terceros(id);


--
-- Name: entradas entradas_gasto_id_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.entradas
    ADD CONSTRAINT entradas_gasto_id_fkey FOREIGN KEY (gasto_id) REFERENCES gastos.gastos(id) ON DELETE CASCADE;


--
-- Name: entradas entradas_producto_id_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.entradas
    ADD CONSTRAINT entradas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES inventario.productos(id);


--
-- Name: salida_detalle salida_detalle_entrada_id_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salida_detalle
    ADD CONSTRAINT salida_detalle_entrada_id_fkey FOREIGN KEY (entrada_id) REFERENCES inventario.entradas(id);


--
-- Name: salida_detalle salida_detalle_salida_id_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salida_detalle
    ADD CONSTRAINT salida_detalle_salida_id_fkey FOREIGN KEY (salida_id) REFERENCES inventario.salidas(id) ON DELETE CASCADE;


--
-- Name: salidas salidas_factura_item_id_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salidas
    ADD CONSTRAINT salidas_factura_item_id_fkey FOREIGN KEY (factura_item_id) REFERENCES facturacion.ventas_items(id) ON DELETE CASCADE;


--
-- Name: salidas salidas_producto_id_fkey; Type: FK CONSTRAINT; Schema: inventario; Owner: -
--

ALTER TABLE ONLY inventario.salidas
    ADD CONSTRAINT salidas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES inventario.productos(id);


--
-- Name: roles_permisos roles_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.roles_permisos
    ADD CONSTRAINT roles_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES usuarios.permisos(id) ON DELETE CASCADE;


--
-- Name: roles_permisos roles_permisos_rol_id_fkey; Type: FK CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.roles_permisos
    ADD CONSTRAINT roles_permisos_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES usuarios.roles(id) ON DELETE CASCADE;


--
-- Name: usuarios usuarios_empresa_id_fkey; Type: FK CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios
    ADD CONSTRAINT usuarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES usuarios.empresas(id);


--
-- Name: usuarios_roles usuarios_roles_rol_id_fkey; Type: FK CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios_roles
    ADD CONSTRAINT usuarios_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES usuarios.roles(id) ON DELETE CASCADE;


--
-- Name: usuarios_roles usuarios_roles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: usuarios; Owner: -
--

ALTER TABLE ONLY usuarios.usuarios_roles
    ADD CONSTRAINT usuarios_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios.usuarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 0PyyGC5fcqp0TyBDFndW0J0HjBzj0TxEn0FsIJmfO3j06ZHLcpA650OgQesswsC

