class Carrito {

    constructor(nombre) {
        this.nombre = nombre
        this.lista = []
    }

    agregar(element) {
        this.lista.push(element)
    }

    eliminar(indice, count) {
        this.lista.splice(indice, count)
    }
}

class Productos {
    constructor(id, nombre, marca, precio, stock) {
        this.id = id
        this.nombre = nombre 
        this.marca = marca
        this.precio = precio
        this.stock = stock
    }
}

const objeto1 = new Productos(0, "iphone 11 64gb", "apple", 8500, 0)
const objeto2 = new Productos(1, "moto e20", "motorola", 2500, 2)
const objeto3 = new Productos(2, "ssd 240gb", "wd green", 800, 6)
const objeto4 = new Productos(3, "galaxy a12", "samsung", 2999, 3)
const objeto5 = new Productos(4, "laptop lenovo thinkpad", "lenovo", 9500, 1)
const objeto6 = new Productos(5, "galaxy a13", "samsung", 3699, 3)
const objeto7 = new Productos(6, "bateria portatil", "1hora", 1500, 4)
const objeto8 = new Productos(7, "grafica rtx 2060", "msi", 8000, 1)
const objeto9 = new Productos(8, "ssd 512gb", "xpg", 1200, 3)
const objeto10 = new Productos(9, "procesador ryzen 5 3600", "ryzen", 8500, 2)

const deptoElectronica= [objeto1, objeto2, objeto3, objeto4, objeto5, objeto6, objeto7,objeto8, objeto9, objeto10]

//Los siguientes arrays contienen los productos que NO pertenecen a la categoria

const celulares= [objeto3, objeto5, objeto7, objeto8, objeto9, objeto10]

const laptops = [objeto1, objeto2, objeto3, objeto4, objeto6, objeto7, objeto8, objeto9, objeto10]

const procesadores = [objeto1, objeto2, objeto3, objeto4, objeto5, objeto6, objeto7, objeto8, objeto9]

const graficas = [objeto1, objeto2, objeto3, objeto4, objeto5, objeto6, objeto7, objeto9, objeto10]

const almacenamiento = [objeto1, objeto2, objeto4, objeto5, objeto6, objeto7, objeto8, objeto10]

const carrito = new Carrito("default")

let productosArray = []

if(localStorage.getItem('carrito')) { //Si no existe esto da null
    //Conversion de JSON a Objeto
    carrito.lista = JSON.parse(localStorage.getItem('carrito'))
} else{
    //Conversión Objeto a JSON
    localStorage.setItem('carrito', JSON.stringify(carrito.lista))
}


//Aquí cargamos los objetos del JSON y los metemos a un array sin identidad
fetch('productos.json')
.then(response => response.json())
.then(productos => {

    productosArray = productos

    mostrarProductos(productosArray)

    inicializar()

}).catch(error => console.log("Hubo un problema con la petición Fetch: " + error))

//Funciones
function inicializar() {
    selecProducto()
    seleCategorias()
    selecRango()
    consultarCarrito()
    eliminarProducto()
}

function mostrarProductos(productosArray) {
    let divProductos = document.querySelector('#divProductos')

    productosArray.forEach((producto, indice) => {
        divProductos.innerHTML += `
        <div id="producto${indice}" class="card text-center mb-5 shadow-sm" style="width: 18rem;">
            <img src="img/${producto.id}.png" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">$ ${producto.precio}</p>
                <button id="boton${indice}" class="btn btn-primary btn-sm">Añadir Al Carrito</button>
            </div>
        </div>
        `
    })
}

function selecRango() {
    
    let inputRango = document.querySelector("#inputRango")
    let textoRango = document.querySelector("#textoRango")

    inputRango.oninput = () => {

        textoRango.innerHTML = `$0 - $${inputRango.value}`
    }

    document.querySelector("#btnRango").addEventListener('click', () => {

        event.preventDefault();

        const productos = productosArray.filter((product) => product.precio > inputRango.value)

        console.log(productos)

        mostrarFiltro(productos)

    })

}

function seleCategorias() {

    for (let i = 1; i < 6; i++) {

        document.querySelector(`#btnC${i}`).addEventListener('click', () => {

            i === 1 && mostrarFiltro(celulares)
            i === 2 && mostrarFiltro(laptops)
            i === 3 && mostrarFiltro(procesadores)
            i === 4 && mostrarFiltro(graficas)
            i === 5 && mostrarFiltro(almacenamiento)
    
        })
        
    }
}

function mostrarFiltro(array) {

    let divProductos = document.querySelector('#divProductos')

    divProductos.innerHTML = ""

    mostrarProductos(productosArray)
    selecProducto()

    array.forEach(producto => {
        
        let eliminaProducto = divProductos.querySelector(`#producto${producto.id}`)
        divProductos.removeChild(eliminaProducto)
    })
    
    
}

function selecProducto() {
    
    deptoElectronica.forEach((producto, indice) => {

        document.querySelector(`#boton${indice}`).addEventListener('click', () => {
            //console.log(document.querySelector(`#producto${indice}`))
            //Guardamos el id del producto seleccionado
            let productoCarrito= deptoElectronica[indice]

            if(producto.stock > 0) {
                //Agregamos al array carrito
                carrito.agregar(productoCarrito)
                //Ingresamos el array al localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito.lista))
                //Agregar a carrito
                agregarCarrito()
                //calculamos total del carrito
                calcularCarrito()
                //eliminamos productos del carrito
                eliminarProducto()
                
            } else {
                Toastify({
                    text: "No Tenemos Producto",
                    duration: 2000,
                    newWindow: false,
                    close: true,
                    gravity: "bottom", 
                    position: "right", 
                    stopOnFocus: false, 
                    style: {
                      background: "#DF4747"
                    }
                  }).showToast()
            }
        })
    })
}

function calcularCarrito() {

    let divCompra = document.querySelector('#divCompra ')

    let pedido = carrito.lista.reduce((suma, producto) => suma + producto?.precio || "No existe pedido", 0)

    console.log(pedido)

    divCompra.innerHTML = `
    <h2 class="h5">Total: $${pedido}</h2>
    <a class="btn btn-primary btn-sm " href="compra.html" onclick="comprarCarrito()" style="width: 300px;">Comprar</a>
    `


}

function agregarCarrito() {

    let divCarrito = document.querySelector('#divCarrito')

    Toastify({
        text: "Producto Añadido",
        duration: 2000,
        newWindow: false,
        close: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: false, 
        style: {
          background: "#5AC768"
        }
      }).showToast();

    divCarrito.innerHTML = ""

    carrito.lista.forEach((producto, indice) => {

        divCarrito.innerHTML += `
        <div id="producto${indice}" class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 300px;">
                <div class="row g-0">
                    <div class="col-4">
                        <img src="img/${producto.id}.png" class="img-fluid rounded-start" alt="${producto.nombre}">
                    </div>
                    <div class="col-8">
                        <div class="card-body">
                            <p class="card-text mb-0">${producto.nombre}</p>
                            <p class="card-text text-primary fw-bold">$${producto.precio}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div><button id="btnCar${indice}" class="btn btn-primary btn-sm bg-danger m-1">-</button></div>
        </div>
        `
    })
}

function consultarCarrito() {

    let divCarrito = document.querySelector('#divCarrito')
    let divCompra = document.querySelector('#divCompra ')
    
    let arrayCarrito = JSON.parse(localStorage.getItem('carrito'))

    calcularCarrito()

    arrayCarrito.length === 0 && (divCarrito.innerHTML = `<h2 class="h6 d-flex justify-content-center">Ups! No tienes nada en tu carrito ):</h2>`)
    arrayCarrito.length === 0 && (divCompra.innerHTML = "")
    
    arrayCarrito.forEach((producto, indice) => {
        divCarrito.innerHTML += `
        <div id="producto${indice}" class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 300px;">
                <div class="row g-0">
                    <div class="col-4">
                        <img src="img/${producto.id}.png" class="img-fluid rounded-start" alt="${producto.nombre}">
                    </div>
                    <div class="col-8">
                        <div class="card-body">
                            <p class="card-text mb-0">${producto.nombre}</p>
                            <p class="card-text text-primary fw-bold">$${producto.precio}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div><button id="btnCar${indice}" class="btn btn-primary btn-sm bg-danger m-1">-</button></div>
        </div>
        `
    })
}

function eliminarProducto() {

    let divCarrito = document.querySelector('#divCarrito')
    
    carrito.lista.forEach((producto, indice)=> {

        document.querySelector(`#btnCar${indice}`).addEventListener('click', () => {

            let index = carrito.lista.indexOf(producto)
            
            carrito.eliminar(index, 1)

            calcularCarrito()

            localStorage.setItem('carrito', JSON.stringify(carrito.lista))
            
            let productoCar = divCarrito.querySelector(`#producto${indice}`)
            divCarrito.removeChild(productoCar)

            carrito.lista.length === 0 && (divCarrito.innerHTML = `<h2 class="h6 d-flex justify-content-center">Ups! No tienes nada en tu carrito ):</h2>`)
            carrito.lista.length === 0 && (divCompra.innerHTML = "")
        })
    })
}

function comprarCarrito() {

    carrito.lista = []

    localStorage.setItem('carrito', JSON.stringify(carrito.lista))
    
}
