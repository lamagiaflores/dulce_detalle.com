let carrito = [];
const COSTO_DELIVERY = 5;

function agregarProductoDesdeUI(nombre, precio, idCantidad) {
  const cantidad = parseInt(document.getElementById(idCantidad).value);

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Ingresa una cantidad válida");
    return;
  }

  const producto = { nombre, precio, cantidad };
  carrito.push(producto);
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";

  carrito.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.cantidad} x ${p.nombre} - S/. ${(p.precio * p.cantidad).toFixed(2)}`;
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = calcularTotal().toFixed(2);
}

function calcularTotal() {
  let total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  return total + COSTO_DELIVERY;
}

function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "🧁 *Pedido Dulce Detalle*%0A%0A";

  carrito.forEach(p => {
    mensaje += `• ${p.cantidad} x ${p.nombre}%0A`;
  });

  mensaje += `%0A💵 Total: S/. ${calcularTotal().toFixed(2)}`;

  window.open(`https://wa.me/51999999999?text=${mensaje}`, "_blank");
}

function toggleCarrito() {
  const carritoDiv = document.getElementById("carrito");
  carritoDiv.style.display = carritoDiv.style.display === "block" ? "none" : "block";
}
