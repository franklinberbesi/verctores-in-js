// Clase Cl_mArticulo
class Cl_mArticulo {
  // Campos privados (solo accesibles dentro de la clase)
  #codigo;
  #nombre;
  #costo;

  // Constructor que recibe un objeto con propiedades desestructuradas
  constructor({ codigo, nombre, costo }) {
    this.#codigo = codigo;  // Asigna código
    this.#nombre = nombre;  // Asigna nombre
    this.#costo = costo;    // Asigna costo base
  }

  // Método para calcular precio con 25% de ganancia
  precio() {
    return this.#costo * 1.25;
  }

  // Getters para acceder a propiedades privadas
  get codigo() { return this.#codigo; }
  get nombre() { return this.#nombre; }
  get costo() { return this.#costo; }
}

//clase Cl_mFactura
class Cl_mFactura {
  // Campos privados
  #codigo;
  #fecha;
  #articulos; // Array de objetos {codigo, cantidad}

  constructor({ codigo, fecha }) {
    this.#codigo = codigo;  // Código único de factura
    this.#fecha = fecha;    // Fecha de emisión
    this.#articulos = [];   // Inicializa array vacío
  }

  // Método para obtener información detallada de la factura
  info(articulos) {
    return this.#articulos.map((item) => {
      // Busca el artículo correspondiente en el listado general
      const articulo = articulos.articulos.find((a) => a.codigo === item.codigo);
      
      // Retorna objeto con datos formateados
      return {
        codigo: item.codigo,       // Código del artículo
        nombre: articulo.nombre,   // Nombre del artículo
        cantidad: item.cantidad,   // Cantidad comprada
        precio: articulo.precio(), // Precio con 25% de ganancia
        subtotal: item.cantidad * articulo.precio() // Total por artículo
      };
    });
  }

  // Método para agregar artículos a la factura
  agregarArticulo(codigo, cantidad) {
    this.#articulos.push({ codigo, cantidad }); // Añade al array
  }

  // Getters
  get codigo() { return this.#codigo; }
  get fecha() { return this.#fecha; }
}

//Clase Cl_mArticulo
class Cl_mArticulos {
  #articulos; // Array de objetos Cl_mArticulo

  constructor() {
    this.#articulos = []; // Inicializa array vacío
  }

  // Agrega un artículo al listado
  agregarArticulo(articulo) {
    this.#articulos.push(articulo);
  }

  // Genera listado público de artículos
  listado() {
    return this.#articulos.map((articulo) => ({
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      costo: articulo.costo,
      precio: articulo.precio() // Usa el método precio()
    }));
  }

  // Getter para acceder al array interno
  get articulos() {
    return this.#articulos;
  }
}

// Clase Cl_mFacturas
class Cl_mFacturas {
  #facturas; // Array de objetos Cl_mFactura

  constructor() {
    this.#facturas = []; // Inicializa array vacío
  }

  // Agrega factura al listado
  agregarFactura(factura) {
    this.#facturas.push(factura);
  }

  // Genera reporte de todas las facturas
  listado(articulos) {
    return this.#facturas.map((factura) => {
      const info = factura.info(articulos); // Obtiene detalle de artículos
      const totalPagado = info.reduce((sum, item) => sum + item.subtotal, 0); // Suma subtotales
      
      return {
        fecha: factura.fecha,
        codigo: factura.codigo,
        cantArticulos: factura.info(articulos).length, // Cantidad de items
        totalPagado: totalPagado // Total de la factura
      };
    });
  }

  // Calcula el total de todas las ventas
  totalVendido(articulos) {
    return this.#facturas.reduce((total, factura) => {
      const subtotal = factura.info(articulos)
        .reduce((sum, item) => sum + item.subtotal, 0); // Suma por factura
      return total + subtotal; // Acumula total general
    }, 0);
  }

  // Getter para acceder al array interno
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

console.log("\n----- Detalle de Factura F2 -----");
console.log(factura2.info(articulos));

console.log("\n----- Listado General de Facturas -----");
console.log(facturas.listado(articulos));

console.log("\n----- Total Vendido en la Tienda -----");
console.log(facturas.totalVendido(articulos));