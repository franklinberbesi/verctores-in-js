# Mini Documentación: Sistema de Gestión de Tienda

## Flujo Principal de Datos

### 1. Crear Artículos  

- **Proceso**: Instanciar objetos `Cl_mArticulo` con propiedades básicas:  
  `código`, `nombre` y `costo base`.  
- **Ejemplo**:  
  ```javascript
  const articulo = new Cl_mArticulo({ codigo: "A1", nombre: "Capa de Héroe", costo: 100 });
  ```

### 2. Registrar Artículos
- **Proceso**: Almacenar artículos en Cl_mArticulos, que actúa como repositorio central.

#### Método utilizado:

```javascript
articulos.agregarArticulo(articulo); // Agregar al registro
```

### 3. Crear Facturas
**Proceso:** Crear instancias de Cl_mFactura que vinculan artículos con cantidades.

#### Acciones clave:

```javascript
const factura = new Cl_mFactura({ codigo: "F1", fecha: "2023-10-10" });
factura.agregarArticulo("A1", 2); // Agregar 2 unidades del artículo A1
```

### 4. Generar Reportes
- listado() en Cl_mArticulos:
Devuelve datos públicos de los artículos (código, nombre, costo, precio).

```javascript
articulos.listado(); // [{ codigo: "A1", nombre: "Capa de Héroe", ... }]
```
info() en Cl_mFactura:
Proporciona detalles de la factura (nombre del artículo, cantidad, subtotal).

```javascript
factura.info(articulos); // [{ codigo: "A1", cantidad: 2, subtotal: 250 }]
```
totalVendido() en Cl_mFacturas:
Calcula el total de ventas de todas las facturas.

```javascript
facturas.totalVendido(articulos); // 675.00
```

### Métodos Clave de Array
#### 1. map()
**Propósito**: Transformar arrays en nuevos formatos.

**Caso de uso**: Convertir objetos Cl_mArticulo en entradas simplificadas.

```javascript
articulos.map(articulo => ({ codigo: articulo.codigo, nombre: articulo.nombre }));
```

### 2. reduce()
**Propósito**: Acumular valores (ej. totales).

**Caso de uso**: Calcular totales de facturas.

```javascript
items.reduce((suma, item) => suma + item.subtotal, 0);
```

### 3. push()
**Propósito**: Agregar elementos a arrays.

**Caso de uso**: Registrar artículos/facturas en sus gestores correspondientes.

```javascript
this.#articulos.push(nuevoArticulo);
```
4. find()
   
**Propósito**: Buscar elementos específicos.

**Caso de uso**: Localizar artículos por código en facturas.

```javascript
articulos.find(a => a.codigo === codigoBuscado);
```