/* ==========================================================================
   1. ESTADO DEL CARRITO (MEMORIA DE LA PÁGINA)
   ========================================================================== */
let carrito = [];
const COSTO_DELIVERY = 5.00;

/* ==========================================================================
    FUNCIONES PRINCIPALES DEL CARRITO
   ========================================================================== */
function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
} 
/* ==========================================================================
   2. FUNCIONES PRINCIPALES DEL CARRITO
   ========================================================================== */

function agregarAlCarrito(nombreProducto, precioBase, idCantidadInput) {
    const cantidadInput = document.getElementById(idCantidadInput);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida mayor a 0.");
        return;
    }

    const productoExistente = carrito.find(item => item.nombre === nombreProducto);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            nombre: nombreProducto,
            precio: precioBase,
            cantidad: cantidad
        });
    }

    // 🔔 AQUÍ VA EL MENSAJE (ESTA ES LA CLAVE)
    mostrarToast(`🛒 ${nombreProducto} agregado al carrito`);

    cantidadInput.value = 1;
    actualizarCarrito();
    controlarPagoYape(); // siempre Yape
}

function eliminarDelCarrito(nombreProducto) {
    carrito = carrito.filter(item => item.nombre !== nombreProducto);
    actualizarCarrito();
    controlarPagoYape();
}

function actualizarCarrito() {
    const contenidoCarrito = document.getElementById("contenido-carrito");
    const totalPrecioSpan = document.getElementById("total-precio");
    const contadorCarritoSpan = document.getElementById("contador-carrito");

    contenidoCarrito.innerHTML = "";

    let totalProductos = 0;
    let totalItems = 0;

    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        totalPrecioSpan.innerText = "0.00";
        contadorCarritoSpan.innerText = "🛒 Carrito (0)";
        document.getElementById("campo-yape").style.display = "none";
        return;
    }

    const lista = document.createElement("ul");
    lista.className = "lista-carrito";

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalProductos += subtotal;
        totalItems += item.cantidad;

        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                ${item.cantidad} x S/. ${item.precio.toFixed(2)} =
                <strong>S/. ${subtotal.toFixed(2)}</strong>
            </div>
            <button class="btn-eliminar"
                onclick="eliminarDelCarrito('${item.nombre}')">❌</button>
        `;
        lista.appendChild(li);
    });

    const opcionEntrega = document.querySelector('input[name="entrega"]:checked');
    let totalFinal = totalProductos;

    if (opcionEntrega && opcionEntrega.value === "Delivery") {
        totalFinal += COSTO_DELIVERY;

        const liDelivery = document.createElement("li");
        liDelivery.style.color = "#e76f51";
        liDelivery.innerHTML = `
            <div>🛵 <strong>Costo de Envío</strong></div>
            <strong>S/. ${COSTO_DELIVERY.toFixed(2)}</strong>
        `;
        lista.appendChild(liDelivery);
    }

    contenidoCarrito.appendChild(lista);
    totalPrecioSpan.innerText = totalFinal.toFixed(2);
    contadorCarritoSpan.innerText = `🛒 Carrito (${totalItems})`;

    controlarPagoYape();
}

/* ==========================================================================
   3. DELIVERY
   ========================================================================== */

function controlarDeliveryMobile(valor) {
    const campoDireccion = document.getElementById("campo-direccion");
    const inputDireccion = document.getElementById("direccion");

    if (valor === "Delivery") {
        campoDireccion.style.display = "block";
        inputDireccion.required = true;
    } else {
        campoDireccion.style.display = "none";
        inputDireccion.required = false;
        inputDireccion.value = "";
    }

    actualizarCarrito();
}

/* ==========================================================================
   4. PAGO YAPE (ÚNICO MÉTODO)
   ========================================================================== */

function controlarPagoYape() {
    const campoYape = document.getElementById("campo-yape");

    if (carrito.length === 0) {
        campoYape.style.display = "none";
        return;
    }

    let totalProductos = 0;
    carrito.forEach(item => {
        totalProductos += item.precio * item.cantidad;
    });

    const opcionEntrega = document.querySelector('input[name="entrega"]:checked');
    let totalYape = totalProductos;

    if (opcionEntrega && opcionEntrega.value === "Delivery") {
        totalYape += COSTO_DELIVERY;
    }

    campoYape.style.display = "block";
    campoYape.innerHTML = `
        <p style="font-weight:bold;color:#6f42c1;margin-bottom:12px;">
            📱 Escanea o toma captura para yapear:
        </p>

        <div style="background:#f3e8ff;border:2px solid #6f42c1;
            padding:12px;border-radius:8px;max-width:320px;margin:auto;">
            <span>Monto exacto a Yapear:</span><br>
            <strong style="font-size:1.8rem;color:#6f42c1;">
                S/. ${totalYape.toFixed(2)}
            </strong>
        </div>

        <img src="img/qr-yape.jpg" alt="QR Yape"
            style="width:100%;max-width:320px;margin:15px auto;
            display:block;border-radius:12px;">

        <p style="font-weight:bold;">Carlos Denis Flores Zúñiga</p>
        <p style="font-size:0.85rem;color:#e76f51;font-weight:bold;">
            ⚠️ Adjunta la captura del Yape al enviar WhatsApp
        </p>
    `;
}

/* ==========================================================================
   5. ENVÍO A WHATSAPP
   ========================================================================== */

function enviarFormulario(event) {
    event.preventDefault();

    if (carrito.length === 0) {
        alert("Agrega productos al carrito.");
        return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const fecha = document.getElementById("fecha").value.replace("T", " a las ");
    const entrega = document.querySelector('input[name="entrega"]:checked').value;
    const direccion = document.getElementById("direccion").value.trim();

    let mensaje = `🧁 *PEDIDO - DULCE DETALLE* 🧁\n\n`;
    mensaje += `👤 ${nombre}\n📱 ${celular}\n📅 ${fecha}\n`;
    mensaje += `🚚 Entrega: ${entrega}\n`;

    if (entrega === "Delivery") {
        mensaje += `📍 Dirección: ${direccion}\n`;
    }

    mensaje += `\n🛒 *DETALLE:*\n`;

    let total = 0;
    carrito.forEach(item => {
        const sub = item.precio * item.cantidad;
        total += sub;
        mensaje += `• ${item.cantidad}x ${item.nombre} (S/. ${sub.toFixed(2)})\n`;
    });

    if (entrega === "Delivery") total += COSTO_DELIVERY;

    mensaje += `\n💰 *TOTAL: S/. ${total.toFixed(2)}*`;
    mensaje += `\n💳 Pago: *YAPE*`;

    const url = `https://wa.me/51932720240?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    vaciarTodoElSistema();
}

function vaciarTodoElSistema() {
    carrito = [];
    actualizarCarrito();
    document.querySelector("form").reset();
    document.getElementById("campo-direccion").style.display = "none";
    document.getElementById("campo-yape").style.display = "none";
    cerrarModal("modal-carrito");
}

/* ==========================================================================
   6. MODALES
   ========================================================================== */

function abrirModal(id) {
    document.getElementById(id).style.display = "block";
}

function cerrarModal(id) {
    document.getElementById(id).style.display = "none";
}

window.onclick = function (e) {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
};

/* ==========================================================================
   7. CARRUSEL
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carrusel-item");
    let index = 0;

    if (items.length === 0) return;

    setInterval(() => {
        items[index].classList.remove("active");
        index = (index + 1) % items.length;
        items[index].classList.add("active");
    }, 3000);
});
function cambiarPrecio(radio, idPrecio) {
    const precioDiv = document.getElementById(idPrecio);
    precioDiv.textContent = `S/. ${parseFloat(radio.value).toFixed(2)}`;
}

function agregarAlCarritoConPeso(nombreProducto, namePeso, idPrecio, idCantidad) {
    const cantidadInput = document.getElementById(idCantidad);

    if (!cantidadInput) {
        alert("Error: no se encontró el campo de cantidad.");
        return;
    }

    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida mayor a 0.");
        return;
    }

    const radios = document.querySelectorAll(`input[name="${namePeso}"]`);
    let precioSeleccionado = 0;
    let pesoTexto = "";

    radios.forEach(radio => {
        if (radio.checked) {
            precioSeleccionado = parseFloat(radio.value);
            pesoTexto = radio.parentElement.textContent.trim();
        }
    });

    const nombreFinal = `${nombreProducto} (${pesoTexto.split("–")[0].trim()})`;

    // 👉 usamos la función original SIN tocarla
    agregarAlCarrito(nombreFinal, precioSeleccionado, idCantidad);
}
function agregarAlCarritoConcto(nombreProducto, namecto, idPrecio, idCantidad) {
    const cantidadInput = document.getElementById(idCantidad);

    if (!cantidadInput) {
        alert("Error: no se encontró el campo de cantidad.");
        return;
    }

    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida mayor a 0.");
        return;
    }

    const radios = document.querySelectorAll(`input[name="${namecto}"]`);
    let precioSeleccionado = 0;
    let ctoTexto = "";

    radios.forEach(radio => {
        if (radio.checked) {
            precioSeleccionado = parseFloat(radio.value);
            ctoTexto = radio.parentElement.textContent.trim();
        }
    });

    const nombreFinal = `${nombreProducto} (${ctoTexto.split("–")[0].trim()})`;

    // 👉 usamos la función original SIN tocarla
    agregarAlCarrito(nombreFinal, precioSeleccionado, idCantidad);
}
