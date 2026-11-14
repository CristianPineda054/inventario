const productos = [
    { nombre: "Arroz", categoria: "Granos", precio: 4500, cantidad: 25, minimo: 10 },
    { nombre: "Aceite", categoria: "Despensa", precio: 12000, cantidad: 3, minimo: 5 },
    { nombre: "Azúcar", categoria: "Despensa", precio: 3800, cantidad: 0, minimo: 8 },
    { nombre: "Café", categoria: "Bebidas", precio: 18500, cantidad: 8, minimo: 4 },
    { nombre: "Leche", categoria: "Lácteos", precio: 4200, cantidad: 2, minimo: 6 },
    { nombre: "Panela", categoria: "Despensa", precio: 3000, cantidad: 15, minimo: 10 },
    { nombre: "Queso", categoria: "Lácteos", precio: 9800, cantidad: 4, minimo: 5 },
    { nombre: "Jugo", categoria: "Bebidas", precio: 5200, cantidad: 4, minimo: 3 },
];

console.log(productos); //Todo el arreglo
console.log(productos.length); //Cuántos productos hay
console.log(productos[0].nombre); //Nombre del primer producto
console.log(productos[3].precio, productos[3].nombre); //Precio y nombre del cuarto producto

const cuerpoTabla = document.getElementById("cuerpo-tabla");
const resumen = document.getElementById("resumen");

function mostrarInventario() {
    //Buscar el <tbody> vacio
    cuerpoTabla.innerHTML = "";
    resumen.innerHTML = "";

    let totalAgotados = 0;
    let totalBajoStock = 0;
    let unidadesAPedir = 0;
    let valorInventario = 0;
    let mayorSubtotal = -1; //Empieza en -1 para que cualquier subtotal sea mayor
    let filaMayor = null; //La fila del producto ganador
    let nombreMayor = ""; //Su nombre

    for (let i = 0; i < productos.length; i++) {

        const producto = productos[i]; //Producto de esta vuelta
        const subtotal = producto.precio * producto.cantidad; //Calculo el subtotal

        const fila = document.createElement("tr"); //Creo una fila

        //Nombre
        const tdNombre = document.createElement("td"); //Creo una celda
        tdNombre.textContent = producto.nombre; //Le pongo texto 

        //Categoría: un <span> dentro de la celda
        const tdCategoria = document.createElement("td");
        const etiqueta = document.createElement("span");
        etiqueta.textContent = producto.categoria; //Le pongo texto al <span>
        etiqueta.classList.add("etiqueta"); //Le agrego la clase "etiqueta"

        if (producto.categoria === "Granos") {
            etiqueta.style.backgroundColor = "#8d6e63"; //Color marrón
        } else if (producto.categoria === "Despensa") {
            etiqueta.style.backgroundColor = "#6f42c1"; //Color morado
        } else if (producto.categoria === "Bebidas") {
            etiqueta.style.backgroundColor = "#0d6efd"; //Color azul
        } else if (producto.categoria === "Lácteos") {
            etiqueta.style.backgroundColor = "#20c997"; //Color verde
        } else {
            etiqueta.style.backgroundColor = "#6c757d"; //Color gris
        }
        tdCategoria.appendChild(etiqueta);

        //Precio con puntos miles
        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = "$" + producto.precio.toLocaleString("es-CO"); //Le pongo texto con formato de miles
        if (producto.precio > 10000) {
            tdPrecio.style.fontWeight = "bold"; //Si el precio es mayor a 10.000, lo pongo en negrita
        }

        const tdCantidad = document.createElement("td");
        //Botón de menos
        const btnMenos = document.createElement("button");
        btnMenos.textContent = "-";
        btnMenos.classList.add("btn" , "btn-menos");

        if (producto.cantidad === 0) {
            btnMenos.disabled = true;  //No se puede bajar de 0
        }

        btnMenos.addEventListener("click", function() {
            if (productos[i].cantidad > 0) {
                productos[i].cantidad--;  //Cambia el dato
                mostrarInventario();  //Redibuja todo
            }
        });

        //Número de la cantidad
        const numero = document.createElement("span");
        numero.textContent = producto.cantidad;
        numero.classList.add("numero");

        //Botón de más
        const btnMas = document.createElement("button");
        btnMas.textContent = "+";
        btnMas.classList.add("btn", "btn-mas");

        btnMas.addEventListener("click", function(){
            productos[i].cantidad++;
            mostrarInventario();
        });

        //Resultado en las celdas
        tdCantidad.appendChild(btnMenos);
        tdCantidad.appendChild(numero);
        tdCantidad.appendChild(btnMas);

        const tdMinimo = document.createElement("td");
        tdMinimo.textContent = producto.minimo;

        //Subtotal
        const tdSubtotal = document.createElement("td");
        tdSubtotal.textContent = "$" + subtotal.toLocaleString("es-CO"); //Le pongo texto con formato de miles

        //Estado
        const tdEstado = document.createElement("td"); //Creo una celda para el estado

        if (producto.cantidad === 0) {
            fila.classList.add("agotado"); //Si la cantidad es 0, agrego la clase "agotado" a la fila
            const faltan = producto.minimo;
            tdEstado.textContent = "AGOTADO - pedir " + faltan;
            tdEstado.style.color = "#dc3545"; //Color rojo
            tdEstado.style.fontWeight = "bold"; //Negrita
            totalAgotados++;
            unidadesAPedir += faltan;
        } else if (producto.cantidad < producto.minimo) {
            fila.classList.add("bajo-stock"); //Si la cantidad es menor al mínimo, agrego la clase "bajo-stock" a la fila
            const faltan = producto.minimo - producto.cantidad;
            tdEstado.textContent = "Bajo stock - pedir " + faltan;
            totalBajoStock++;
            unidadesAPedir += faltan;
        } else {
            fila.classList.add("disponible");
            tdEstado.textContent = "OK";
        }

        valorInventario += subtotal; //Fuera del if: se suma para TODOS

        if (subtotal > mayorSubtotal) {
            mayorSubtotal = subtotal;
            filaMayor = fila;
            nombreMayor = producto.nombre;
        }

        //Armar la fila en el mismo orden de los encabezados
        fila.appendChild(tdNombre);
        fila.appendChild(tdCategoria);
        fila.appendChild(tdPrecio);
        fila.appendChild(tdCantidad);
        fila.appendChild(tdMinimo);
        fila.appendChild(tdSubtotal);
        fila.appendChild(tdEstado);

        cuerpoTabla.appendChild(fila); //Agrego la fila al <tbody>
    }

    filaMayor.classList.add("destacado");

    const pMayor = document.createElement("p");
    pMayor.textContent = "Producto con mayor: " + nombreMayor + " ($" + mayorSubtotal.toLocaleString("es-CO") + ")";

    const pAgotados = document.createElement("p");
    pAgotados.textContent = "Productos agotados: " + totalAgotados;

    const pBajo = document.createElement("p");
    pBajo.textContent = "Productos con bajo stock: " + totalBajoStock;

    const pPedir = document.createElement("p");
    pPedir.textContent = "Unidades a pedir: " + unidadesAPedir;

    const pValor = document.createElement("p");
    pValor.textContent = "Valor total de inventario: $" + valorInventario.toLocaleString("es-CO");
    pValor.style.fontWeight = "blod";


    resumen.appendChild(pAgotados);
    resumen.appendChild(pBajo);
    resumen.appendChild(pPedir);
    resumen.appendChild(pValor);
    resumen.appendChild(pMayor);

}

mostrarInventario();