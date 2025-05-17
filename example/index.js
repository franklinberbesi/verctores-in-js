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
        if(!this.#articulos || this.#articulos.length <= 0){
            return;
        }
        return this.#articulos.map((item) => {
            const articulo = articulos.articulos.find((a) => a.codigo === item.codigo);

            // Manejo de artículos eliminados
            if (!articulo) {
                return {
                    codigo: item.codigo,
                    nombre: "ARTÍCULO ELIMINADO",
                    cantidad: item.cantidad,
                    precio: 0,
                    subtotal: 0
                };
            }

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

    // Agrega este nuevo método
    setArticulos(articulosFactura) {
        this.#articulos = articulosFactura;
    }


    get codigo() {
        return this.#codigo;
    }

    get fecha() {
        return this.#fecha;
    }

    get articulos() {
        return this.#articulos;
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

    eliminarArticulo(codigo) {
        this.#articulos = this.#articulos.filter(a => a.codigo !== codigo);
    }

    listado() {
         if(!this.#articulos || this.#articulos.length <= 0){
            return;
        }
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
         if(!this.#facturas || this.#facturas.length <= 0){
            return;
        }
        return this.#facturas.map((factura) => {
            const info = factura.info(articulos);
            return {
                codigo: factura.codigo,
                fecha: factura.fecha,
                cantArticulos: (info) ? info.length : 0,
                totalPagado: (info) ? info.reduce((sum, item) => sum + item.subtotal, 0) : 0
            };
        });
    }
    totalVendido(articulos) {
          if(!this.#facturas || this.#facturas.length <= 0){
            return;
        }
        return this.#facturas.reduce((total, factura) => {
            if(factura.info(articulos)){
                const subtotal = factura.info(articulos).reduce((sum, item) => sum + item.subtotal, 0);
                return total + subtotal;
            }
        }, 0);
    }

    get facturas() {
        return this.#facturas;
    }
}

// Instancias globales
let articulos = new Cl_mArticulos();
let facturas = new Cl_mFacturas();
let currentFacturaItems = [];


// Actualizar toda la UI
function updateUI() {
    updateArticulosList();
    updateFacturasList();
    updateReportes();
    updateSelectArticulos();
    saveToLocalStorage();
}

// Cargar datos del localStorage
function loadFromLocalStorage() {
    const savedArticulos = JSON.parse(localStorage.getItem('articulos')) || [];
    savedArticulos.forEach(a => {
        const articulo = new Cl_mArticulo(a);
        articulos.agregarArticulo(articulo);
    });

    const savedFacturas = JSON.parse(localStorage.getItem('facturas')) || [];
    savedFacturas.forEach(f => {
        const factura = new Cl_mFactura(f);
        factura.setArticulos(f.articulos); // Usamos el nuevo método
        facturas.agregarFactura(factura);
    });

    updateUI();
}

// Guardar datos en localStorage
function saveToLocalStorage() {
    localStorage.setItem('articulos', JSON.stringify(articulos.listado()));

    localStorage.setItem('facturas', JSON.stringify(
        facturas.facturas.map(f => ({
            codigo: f.codigo,
            fecha: f.fecha,
            articulos: f.articulos
        }))
    ));
}

// Actualizar listado de artículos en la tabla
function updateArticulosList() {
    const tbody = document.getElementById('articulosList');
    tbody.innerHTML = '';
    if(!articulos.listado() || articulos.listado().length <= 0) return false;
    articulos.listado().forEach(articulo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="px-4 py-2">${articulo.codigo}</td>
        <td class="px-4 py-2">${articulo.nombre}</td>
        <td class="px-4 py-2">$${articulo.costo.toFixed(2)}</td>
        <td class="px-4 py-2">$${articulo.precio.toFixed(2)}</td> <!-- Corregido -->
        <td class="px-4 py-2">
         <button onclick="deleteArticulo('${articulo.codigo}')" class="text-red-600 hover:text-red-800">🗑️</button>
        </td>
    `;
        tbody.appendChild(tr);
    });
}

// Actualizar listado de facturas en la tabla
function updateFacturasList() {
    const tbody = document.getElementById('facturasList');
    tbody.innerHTML = '';
   if(!facturas.listado(articulos) || facturas.listado(articulos).length <= 0) return false;
    facturas.listado(articulos).forEach(factura => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td class="px-4 py-2">${factura.codigo}</td>
      <td class="px-4 py-2">${factura.fecha}</td>
      <td class="px-4 py-2">${factura.cantArticulos}</td>
      <td class="px-4 py-2">$${factura.totalPagado.toFixed(2)}</td>
    `;
        tbody.appendChild(tr);
    });
}

// Actualizar los reportes
function updateReportes() {
    if(!facturas.totalVendido(articulos)) return false;
    document.getElementById('totalVendido').textContent =
        `$${facturas.totalVendido(articulos).toFixed(2)}`;

    document.getElementById('totalFacturas').textContent =
        facturas.facturas.length;

    document.getElementById('totalArticulos').textContent =
        articulos.articulos.length;
}

// Actualizar el select de artículos para facturas
function updateSelectArticulos() {
    const select = document.getElementById('articuloSelect');
    select.innerHTML = '<option value="">Seleccione artículo</option>';

    articulos.articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.value = articulo.codigo;
        option.textContent = `${articulo.codigo} - ${articulo.nombre}`;
        select.appendChild(option);
    });
}

// Función para eliminar artículos
function deleteArticulo(codigo) {
    Swal.fire({
        title: '¿Eliminar artículo?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {

        if (facturas.facturas.length > 0) {
            // Verificar si el artículo está en uso
            const enFacturas = facturas.facturas.some(factura =>
                factura.articulos.some(item => item.codigo === codigo)
            );

            if (enFacturas) {
                Swal.fire('Error', 'El artículo existe en facturas, no se puede eliminar', 'error');
                return;
            }
        }

        if (result.isConfirmed) {
            articulos.eliminarArticulo(codigo);
            updateUI();
            Swal.fire('Eliminado!', 'El artículo ha sido eliminado.', 'success');
        }
    });
}

// Función para agregar items a la factura actual
function addItemToFactura() {
    const codigo = document.getElementById('articuloSelect').value;
    const cantidad = parseInt(document.getElementById('articuloCantidad').value);

    if (!codigo || !cantidad) {
        Swal.fire('Error', 'Seleccione artículo y cantidad', 'error');
        return;
    }

    currentFacturaItems.push({ codigo, cantidad });
    updateFacturaItemsUI();
}

// Actualizar items de factura en UI
function updateFacturaItemsUI() {
    const container = document.getElementById('facturaItems');
    container.innerHTML = '';

    currentFacturaItems.forEach(item => {
        const articulo = articulos.articulos.find(a => a.codigo === item.codigo);
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-gray-50 p-2 rounded';
        div.innerHTML = `
      <span>${articulo.nombre} (x${item.cantidad})</span>
      <span>$${(articulo.precio() * item.cantidad).toFixed(2)}</span>
    `;
        container.appendChild(div);
    });
}

// Event listener para el formulario de facturas
document.getElementById('formFactura').addEventListener('submit', e => {
    e.preventDefault();

    const factura = new Cl_mFactura({
        codigo: document.getElementById('facturaCodigo').value,
        fecha: document.getElementById('facturaFecha').value
    });

    currentFacturaItems.forEach(item => {
        factura.agregarArticulo(item.codigo, item.cantidad);
    });

    facturas.agregarFactura(factura);
    currentFacturaItems = [];
    updateUI();
    e.target.reset();
});



// [Aquí irían todas las funciones de actualización de UI...]

// Event Listeners
document.getElementById('formArticulo').addEventListener('submit', e => {
    e.preventDefault();
    const codigo = document.getElementById('articuloCodigo').value;
    const nombre = document.getElementById('articuloNombre').value;
    const costo = parseFloat(document.getElementById('articuloCosto').value);

    if (articulos.articulos.some(a => a.codigo === codigo)) {
        Swal.fire('Error', 'El código ya existe', 'error');
        return;
    }

    const nuevoArticulo = new Cl_mArticulo({ codigo, nombre, costo });
    articulos.agregarArticulo(nuevoArticulo);
    updateUI();
    e.target.reset();
});


// Inicialización
loadFromLocalStorage();