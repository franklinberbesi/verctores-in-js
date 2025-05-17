// Clase Cl_mArticulo
class Cl_mArticulo {
  #codigo;
  #nombre;
  #costo;

  constructor({ codigo, nombre, costo }) {
    this.#codigo = codigo;
    this.#nombre = nombre;
    this.#costo = costo;
  }

  precio() {
    return this.#costo * 1.25;
  }

  get codigo() {
    return this.#codigo;
  }

  get nombre() {
    return this.#nombre;
  }

  get costo() {
    return this.#costo;
  }
}

// Clase Cl_mFactura
class Cl_mFactura {
  #codigo;
  #fecha;
  #articulos;

  constructor({ codigo, fecha }) {
    this.#codigo = codigo;
    this.#fecha = fecha;
    this.#articulos = [];
  }

  info(articulos) {
    return this.#articulos.map((item) => {
      const articulo = articulos.articulos.find((a) => a.codigo === item.codigo);
      return {
        codigo: item.codigo,
        nombre: articulo.nombre,
        cantidad: item.cantidad,
        precio: articulo.precio(),
        subtotal: item.cantidad * articulo.precio(),
      };
    });
  }

  agregarArticulo(codigo, cantidad) {
    this.#articulos.push({ codigo, cantidad });
  }

  get codigo() {
    return this.#codigo;
  }

  get fecha() {
    return this.#fecha;
  }
}

// Clase Cl_mArticulos
class Cl_mArticulos {
  #articulos;

  constructor() {
    this.#articulos = [];
  }

  agregarArticulo(articulo) {
    this.#articulos.push(articulo);
  }

  listado() {
    return this.#articulos.map((articulo) => ({
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      costo: articulo.costo,
      precio: articulo.precio(),
    }));
  }

  get articulos() {
    return this.#articulos;
  }
}

// Clase Cl_mFacturas
class Cl_mFacturas {
  #facturas;

  constructor() {
    this.#facturas = [];
  }

  agregarFactura(factura) {
    this.#facturas.push(factura);
  }

  listado(articulos) {
    return this.#facturas.map((factura) => {
      const info = factura.info(articulos);
      const totalPagado = info.reduce((sum, item) => sum + item.subtotal, 0);
      return {
        fecha: factura.fecha,
        codigo: factura.codigo,
        cantArticulos: factura.info(articulos).length,
        totalPagado: totalPagado,
      };
    });
  }

  totalVendido(articulos) {
    return this.#facturas.reduce((total, factura) => {
      const subtotal = factura
        .info(articulos)
        .reduce((sum, item) => sum + item.subtotal, 0);
      return total + subtotal;
    }, 0);
  }

  get facturas() {
    return this.#facturas;
  }
}

// 1. Crear artículos
const articulo1 = new Cl_mArticulo({ codigo: "A1", nombre: "Capa de Héroe", costo: 100 });
const articulo2 = new Cl_mArticulo({ codigo: "A2", nombre: "Guantes de Poder", costo: 50 });
const articulo3 = new Cl_mArticulo({ codigo: "A3", nombre: "Botas Veloces", costo: 80 });

// 2. Agregar artículos al sistema
const articulos = new Cl_mArticulos();
articulos.agregarArticulo(articulo1);
articulos.agregarArticulo(articulo2);
articulos.agregarArticulo(articulo3);

// 3. Crear facturas
const factura1 = new Cl_mFactura({ codigo: "F1", fecha: "2023-10-10" });
factura1.agregarArticulo("A1", 2);  // 2 Capas de Héroe
factura1.agregarArticulo("A2", 3);  // 3 Guantes de Poder

const factura2 = new Cl_mFactura({ codigo: "F2", fecha: "2023-10-11" });
factura2.agregarArticulo("A3", 1);  // 1 Botas Veloces
factura2.agregarArticulo("A1", 1);  // 1 Capa de Héroe

// 4. Agregar facturas al sistema
const facturas = new Cl_mFacturas();
facturas.agregarFactura(factura1);
facturas.agregarFactura(factura2);

// 5. Ejecutar métodos
console.log("----- Listado de Artículos -----");
console.log(articulos.listado());

console.log("\n----- Detalle de Factura F1 -----");
console.log(factura1.info(articulos));

console.log("\n----- Listado General de Facturas -----");
console.log(facturas.listado(articulos));

console.log("\n----- Total Vendido en la Tienda -----");
console.log(facturas.totalVendido(articulos));