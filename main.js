const informacionImportante = document.getElementById("informacionImportante");
const formulario = document.getElementById("form");
let datosUsuario = {};
const carrito = [];
const registroExitoso = JSON.parse(sessionStorage.getItem("datosDeUsuario"));

if (registroExitoso === null){
    // Aquí está todo lo del form y el listener 
    formulario.addEventListener("submit", (e) => {

        const nombre = document.getElementById("nombre").value;
        const direccion = document.getElementById("direccion").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
    
        e.preventDefault();
        
        datosUsuario = {
            nombre,
            direccion,
            correo,
            telefono,
        }

        console.log(datosUsuario)

        const infoUserJson = JSON.stringify(datosUsuario);
        sessionStorage.setItem("datosDeUsuario", infoUserJson);

        alert(`Has ingresado tus datos, vamos a tu proceso de compra ${datosUsuario.nombre}`);
        document.body.removeChild(formulario);
        
        mostrarProductos()
    })
    }else{
        console.log(registroExitoso)
        formulario.style.display = "none";
        alert(`Generemos tu proceso de compra ${registroExitoso.nombre}`);
        mostrarProductos()
    }



// Este es el encargado de renderizar las cards para poder comprar 

function mostrarProductos (){
    
    const contenedor = document.getElementById("producto-contenedor");
    productos.forEach( producto => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `<div class="card-image" id="supTotal">
                            <img class="imgCards" id="suplemento${producto.id}" src=${producto.img}>
                            <br>
                            <span class="cardText" id="card-title" >Producto: ${producto.nombre}</span>
                            <br>
                            <span class="cardText" id="card-precio">Precio: ${producto.precio}</span>
                            <br>
                            <span class="cardText" id="card-marca">Marca de producto: ${producto.marca}</span>
                            <br>
                            <span class="cardText" id="card-descripcion">Descripcion: ${producto.descripcion}</span>
                            <br>
                            <br>
                            <button type="button" class="botonCard" onclick="agregarProductoAlCarrito(${producto.id})" id="botonDeCompra${producto.id}">Comprar ahora</button>
                            <br>
                            <a href="${producto.video}" target="blank" id="esParaTi">¿Este producto es para mi?</a>
                        </div>
                        `
        contenedor.appendChild(div);
        
    });

};

function agregarProductoAlCarrito(id) {
    let producto = productos.find(producto => producto.id === id);
    let productoEnCarrito = carrito.find(productoEnCarrito => productoEnCarrito.id === id);

    productoEnCarrito ? productoEnCarrito.cantidad ++
    : pushearCarrito()

    renderProductos();
    renderTotal();
    calcularTotal();

function pushearCarrito(){
    producto.cantidad = 1;
    productoEnCarrito = 1;
    carrito.push(producto)
}
}

// Aqui ya se renderizan los productos del carrito a la pantalla
function renderProductos(){
    let carritoHTML = document.getElementById("carrito")
    let HTMLcarrito = ""
    carrito.forEach((producto, id) =>{
        HTMLcarrito += `
        <div class="card-carrito" id="supComprado">
                            <span class="cardText" id="card-title" > Compra: ${producto.nombre}</span>
                            <br>
                            <br>
                            <span class="cardText" id="card-precio">Precio: ${producto.precio}</span>
                            <br>
                            <br>
                            <span class="cardText" id="card-precio">Cantidad comprado: ${producto.cantidad}</span>
                            <br>
                            <br>
                            <button type="button" class="botonEliminar" onclick="eliminarProducto(${id})" id="botonEliminar${producto.id}">Eliminar</button>
                        </div>
        `
    })

    carritoHTML.innerHTML = HTMLcarrito

    document.body.appendChild(carritoHTML)

}

// Esto renderiza el carrito de compras
function renderTotal(){
    let totalHTML = document.getElementById("totales")
   totalHTML.innerHTML = `            
   <div>
    <h2 id="totalCompra"></h2>
    </div>
    `
    document.body.appendChild(totalHTML)

}

// Con esto ya se pueden eliminar los productos
function eliminarProducto(id) {
    carrito[id].cantidad--;
    if (carrito[id].cantidad == 0){
        carrito.splice(id, 1);
    }
    renderProductos();
    calcularTotal();
}


let totalCalculado = 0;
// Esta parte ya calcula los totales de mi producto y los imprime
function calcularTotal(){
    let total = 0;
    carrito.forEach((producto) =>{
        total += producto.precio * producto.cantidad
    })
    

    const totalFinal = document.getElementById("totalCompra")
    totalFinal.innerHTML = `<h3> Total de compra: $${total} 
                            <button type="button" class="botonCompraTotal" onclick="comprarProductos()" id="botonDeCompraFinal">Finalizar Compra</button>
                            <h3/>
    `
    totalCalculado = total;
}


// Aqui ya agrego el getItem del sessionStorage, 
// se integra al alert despues de haber llenado el form y comprado algo
// SE INTEGRA DESESTRUCTURACIÓN DEL GETITEM DEL SESSION STORAGE
// SE AGREGA EL USO DE TERNARIOS
// Se borra la sesion storage y se fuerza el cierre, esto es para evitar compras dobles y crear un nuevo ciclo
function comprarProductos(){
    const informacionEntrega = JSON.parse(sessionStorage.getItem("datosDeUsuario"));
    console.log(informacionEntrega)

    let {nombre, direccion, correo,telefono} = informacionEntrega;

    let compra = confirm('¿Quieres concretar tu compra?');

        compra === false ? alert("Agrega/Quita los productos que necesites")
        : compra === true && totalCalculado === 0 ? alert("Necesitas comprar algo para proceder")
        : compraFinalizada();      

        function compraFinalizada (){
            alert(`Gracias por tu compra ${nombre}, enviaremos tu recibo de compra a ${correo}, tu(s) producto(s) se enviarán a la direccion ubicada en ${direccion} y cualquier inconveniente o emergencia nos contactaremos contigo al numero ${telefono}`)
                sessionStorage.clear()
                window.location.reload()
        }   
}