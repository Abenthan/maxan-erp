# Manual de Usuario — Maxan ERP

Sistema de facturación electrónica DIAN UBL 2.1 + gestión de compras, gastos, inventario y ventas.

---

## Índice

1. [Inicio / Dashboard](#1-inicio--dashboard)
2. [Facturación Electrónica (DIAN)](#2-facturación-electrónica-dian)
3. [Productos](#3-productos)
4. [Compras](#4-compras)
5. [Gastos](#5-gastos)
6. [Ventas sin factura](#6-ventas-sin-factura)
7. [Inventario](#7-inventario)
8. [Movimientos de Inventario](#8-movimientos-de-inventario)

---

## 1. Inicio / Dashboard

Al iniciar sesión aparece el panel principal con tarjetas que muestran:

- **Facturación** — facturas electrónicas registradas
- **Productos** — productos en el catálogo
- **Gastos** — gastos registrados
- **Compras** — facturas de compra recibidas

Cada tarjeta tiene un botón **"Ver detalle"** que lleva al listado correspondiente.

En la parte inferior se muestra el **estado de la base de datos** (conectada/desconectada).

---

## 2. Facturación Electrónica (DIAN)

### 2.1 Subir una factura XML

1. Ir a **Facturación** en el menú lateral y hacer clic en **"+ Subir XML"**.
2. Seleccionar un archivo XML UBL 2.1 (válido de DIAN).
3. El sistema parsea el XML y muestra una vista previa con:
   - Receptor, NIT, dirección
   - Líneas de productos/servicios
   - Impuestos (IVA, INC, ICA)
   - Totales
   - CUFE/CUDE
4. Si el CUFE ya existe en la base de datos, el botón **"Guardar"** se deshabilita y se muestra un mensaje de advertencia (factura duplicada).
5. Hacer clic en **"Guardar"** para almacenar la factura.

### 2.2 Listado de facturas

En **Facturación** se muestra una tabla con:

- N° de factura (prefijo + número)
- Fecha de emisión
- Receptor
- Valor total
- Estado (recibida, pendiente_pago, pagada, anulada, rechazada)
- Estado de validación DIAN
- Respuesta DIAN

**Funcionalidades:**
- **Ordenar columnas**: hacer clic en el encabezado de cualquier columna (↑↓).
- **Filtrar por rango de fechas**: usar los campos "Desde" y "Hasta".
- **Buscar**: filtro por texto en número de factura o nombre del receptor.
- **Exportar a Excel**: botón "Exportar Excel" descarga un archivo `.xlsx` con los datos visibles.

### 2.3 Detalle de factura

Al hacer clic en una fila del listado se abre el detalle con:

- Encabezado (emisor, receptor, CUFE, resolución DIAN, fechas)
- Líneas de la factura (descripción, cantidad, valor unitario, descuento, total)
- Impuestos desglosados por línea
- Totales (subtotal, descuentos, impuestos, valor a pagar)
- Utilidad estimada por cada línea (si hay costo de inventario o gasto asignado)

---

## 3. Productos

Catálogo de productos/servicios.

- Lista todos los productos registrados con: nombre, categoría, unidad de medida, si es inventariable (afecta stock).
- Los productos marcados como **inventariable = Sí** generan automáticamente entradas de inventario cuando se registra un gasto de compra asociado.

---

## 4. Compras

### 4.1 Subir XML de compra

1. Ir a **Compras** → **"+ Subir XML"**.
2. Seleccionar un archivo XML de factura de proveedor.
3. **Paso 1**: El sistema parsea el XML y muestra una vista previa con:
   - Proveedor, NIT
   - Líneas de la factura
   - Impuestos aplicados
   - Totales
4. **Paso 2**: Revisar la información y hacer clic en **"Guardar"**.

**¿Qué pasa al guardar una compra?**
- Se registra la factura de compra en el sistema.
- Por **cada línea** de la factura se crea un **gasto** automático.
- Si la línea tiene asociado un producto del catálogo inventariable, se crea automáticamente una **entrada de inventario** (stock).
- Los **impuestos (IVA)** se distribuyen proporcionalmente entre las líneas y se registran como gastos adicionales. Por ejemplo, si la línea 1 representa el 60% del subtotal y el IVA total es $100, se crea un gasto de $60 para esa línea.

### 4.2 Listado de compras

Tabla con: N° factura, fecha, proveedor, valor, estado.
Las filas son clickeables — llevan al detalle de la compra.

### 4.3 Detalle de compra

Muestra:
- Encabezado (proveedor, NIT, fecha, CUFE/CUD, moneda)
- Líneas/gastos generados (cada línea de la factura original + impuestos distribuidos)
- Resumen financiero (subtotal, IVA, otros impuestos, total a pagar)

---

## 5. Gastos

### 5.1 Listado y filtros

- Tabla con todos los gastos: descripción, clasificación (Suministros / Operacional / Administrativo), cantidad, valor unitario, valor total, fecha.
- **Filtros**: por descripción (texto libre) y por rango de fechas (Desde / Hasta).
- La tabla tiene scroll vertical para manejar muchos registros.

### 5.2 Crear / Editar gasto

El formulario integrado en la parte inferior permite:

- **Crear**: llenar los campos (descripción, clasificación, cantidad, valor unitario, fecha) y hacer clic en **"Guardar"**.
- **Editar**: hacer clic en cualquier fila de la tabla — los datos se cargan en el formulario. Modificar y hacer clic en **"Actualizar"**.
- Para cancelar la edición, hacer clic en **"Cancelar"**.

### 5.3 Clasificaciones

- **Suministros**: insumos, materiales, productos para la venta
- **Operacional**: gastos operativos (servicios, mantenimiento, etc.)
- **Administrativo**: gastos administrativos

---

## 6. Ventas sin factura

Para registrar ventas que no pasan por facturación electrónica DIAN (ventas de mostrador, servicios menores, etc.).

### 6.1 Nueva Venta

1. Ir a **Nueva Venta** en el menú lateral.
2. Completar los datos del cliente:
   - Tipo de documento (CC / NIT)
   - Número de documento
   - Nombre o razón social
   - Dirección (opcional)
   - Ciudad (opcional)
3. Seleccionar la fecha de la venta.
4. Agregar líneas de productos/servicios:
   - Descripción del item
   - Cantidad
   - Valor unitario
   - El total por línea y el gran total se calculan automáticamente.
5. Hacer clic en **"+ Agregar línea"** para añadir más items.
6. Hacer clic en **"Guardar Venta"**.

### 6.2 Ventas Items (listado global)

Muestra **todos los items de todas las ventas** (tanto de facturas electrónicas como de ventas manuales) en una sola tabla con:

- N° de factura / venta
- Fecha de emisión
- Cliente y NIT
- Descripción del item
- Valor línea

**Filtros**: por descripción del item y por rango de fechas.

---

## 7. Inventario

Lista todos los productos inventariables con su **stock actual** disponible.

- Cada fila muestra: nombre del producto, categoría, cantidad disponible.
- Los valores en verde tienen stock positivo; en rojo, stock agotado.
- Las filas son **clickeables** — llevan a los movimientos de ese producto.

---

## 8. Movimientos de Inventario

Muestra todas las **entradas** y **salidas** de un producto seleccionado.

1. Seleccionar un producto del menú desplegable.
2. Se muestran dos tablas:

### Entradas (compras que aumentan el stock)
- Descripción del gasto que originó la entrada
- Cantidad original recibida
- Cantidad disponible actual (puede ser menor si ya se vendió parte)
- Costo unitario
- Fecha

### Salidas (ventas que disminuyen el stock)
- Descripción del item vendido
- Cantidad vendida
- Costo unitario (cálculo FIFO)
- Fecha

---

## Apéndice: Estados de facturas

| Estado | Significado |
|--------|-------------|
| `recibida` | Registrada en el sistema |
| `pendiente_pago` | Pendiente de pago |
| `pagada_parcial` | Pagada parcialmente |
| `pagada` | Pagada totalmente |
| `anulada` | Anulada |
| `rechazada` | Rechazada por DIAN o internamente |

---

## Apéndice: Preguntas frecuentes

**¿Puedo subir el mismo XML dos veces?**
No. El sistema detecta CUFE/CUDE duplicados y bloquea la operación mostrando un mensaje: "Esta factura ya está registrada".

**¿Cómo se calcula la utilidad de una factura?**
`Utilidad = valor_línea - costo_inventario - costo_directo`. El costo de inventario usa FIFO. El costo directo son gastos asignados manualmente a items de venta.

**¿Qué pasa si Docker Desktop no está iniciado?**
Las páginas mostrarán "Internal Server Error" porque la base de datos PostgreSQL no está disponible. Solución: iniciar Docker Desktop y esperar a que el contenedor `maxan_db_dev` esté listo.

**¿Los gastos de compra se crean automáticamente?**
Sí. Al guardar una factura de compra, cada línea genera un gasto y los impuestos (IVA) se distribuyen proporcionalmente entre las líneas.

**¿Cómo se maneja el inventario FIFO?**
Cuando se vende un producto, el sistema consume primero el lote más antiguo (por fecha de entrada). Si se requieren más unidades de las disponibles en el lote más antiguo, continúa con el siguiente lote más antiguo, y así sucesivamente.
