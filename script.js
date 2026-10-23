const productos = [
  {
    id: 1, nombre: "Straps de algodón", categoria: "accesorios",
    precio: 189, descripcion: "Mejor agarre para tus ejercicios de espalda y pierna.",
    emoji: "🎀", imagen: "imagenes/straps.svg", etiqueta: "FAVORITO", agotado: false
  },
  {
    id: 2, nombre: "Shaker rosa", categoria: "accesorios",
    precio: 149, descripcion: "Mezcla tus bebidas fácilmente y llévala al gym.",
    emoji: "🥤", imagen: "imagenes/shaker.svg", etiqueta: "ESENCIAL", agotado: false
  },
  {
    id: 3, nombre: "Proteína sabor vainilla", categoria: "suplementos",
    precio: 699, descripcion: "Presentación de muestra para complementar tu rutina.",
    emoji: "🥛", imagen: "imagenes/proteina.svg", etiqueta: "NUEVO", agotado: false
  },
  {
    id: 4, nombre: "Leggings seamless", categoria: "ropa",
    precio: 459, descripcion: "Tela elástica y cómoda para entrenar con confianza.",
    emoji: "🩱", imagen: "imagenes/leggings.svg", etiqueta: "MÁS VENDIDO", agotado: false
  },
  {
    id: 5, nombre: "Top deportivo", categoria: "ropa",
    precio: 329, descripcion: "Soporte cómodo y diseño sencillo para tus entrenamientos.",
    emoji: "👚", imagen: "imagenes/top.svg", etiqueta: "AGOTADO", agotado: true
  },
  {
    id: 6, nombre: "Bandas de resistencia", categoria: "accesorios",
    precio: 219, descripcion: "Tres niveles de resistencia para activar glúteos y piernas.",
    emoji: "🩷", imagen: "imagenes/bandas.svg", etiqueta: "3 PIEZAS", agotado: false
  }
];

let carrito = [];
let categoriaActual = "todos";

const listaProductos = document.getElementById("lista-productos");
const contadorCarrito = document.getElementById("contador-carrito");
const aviso = document.getElementById("aviso");
const panelCarrito = document.getElementById("panel-carrito");
const contenidoCarrito = document.getElementById("contenido-carrito");
const totalCarrito = document.getElementById("total-carrito");

function dinero(cantidad) {
  return cantidad.toLocaleString("es-MX", {
    style: "currency", currency: "MXN", maximumFractionDigits: 0
  });
}

function mostrarProductos() {
  const productosFiltrados = categoriaActual === "todos"
    ? productos
    : productos.filter(producto => producto.categoria === categoriaActual);

  listaProductos.innerHTML = "";

  productosFiltrados.forEach(producto => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";

    tarjeta.innerHTML = `
      <div class="producto-imagen">
        <span class="etiqueta-producto ${producto.agotado ? "agotado" : ""}">
          ${producto.agotado ? "AGOTADO" : producto.etiqueta}
        </span>
        <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="producto-info">
        <span class="categoria">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion}</p>
        <div class="producto-pie">
          <span class="precio">${dinero(producto.precio)}</span>
          <button class="boton-agregar" type="button"
            data-id="${producto.id}" ${producto.agotado ? "disabled" : ""}>
            ${producto.agotado ? "No disponible" : "＋ Agregar"}
          </button>
        </div>
      </div>
    `;
    listaProductos.appendChild(tarjeta);
  });

  document.getElementById("mensaje-filtro").textContent =
    categoriaActual === "todos"
      ? `Mostrando los ${productosFiltrados.length} productos`
      : `Mostrando ${productosFiltrados.length} productos de ${categoriaActual}`;
}

function mostrarAviso(mensaje) {
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  window.setTimeout(() => aviso.classList.remove("visible"), 2300);
}

function agregarAlCarrito(id) {
  const producto = productos.find(item => item.id === id);

  // Restricción: no se permite agregar productos agotados
  if (!producto || producto.agotado) {
    mostrarAviso("Este producto no está disponible");
    return;
  }

  carrito.push(producto);
  contadorCarrito.textContent = carrito.length;
  mostrarAviso(`${producto.nombre} se agregó al carrito`);
  mostrarCarrito();
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    contenidoCarrito.innerHTML = '<p class="vacio">Tu carrito está vacío por ahora</p>';
  } else {
    contenidoCarrito.innerHTML = carrito.map((producto, indice) => `
      <div class="linea-carrito">
        <span>${producto.emoji} ${producto.nombre}</span>
        <span>${dinero(producto.precio)}
          <button type="button" class="quitar-producto" data-indice="${indice}" aria-label="Quitar ${producto.nombre}"> × </button>
        </span>
      </div>
    `).join("");
  }

  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
  totalCarrito.textContent = `Total: ${dinero(total)} MXN`;
}

document.querySelectorAll(".filtro").forEach(boton => {
  boton.addEventListener("click", () => {
    categoriaActual = boton.dataset.categoria;
    document.querySelectorAll(".filtro").forEach(item => item.classList.remove("activo"));
    boton.classList.add("activo");
    mostrarProductos();
  });
});

listaProductos.addEventListener("click", evento => {
  const boton = evento.target.closest(".boton-agregar");
  if (boton && !boton.disabled) agregarAlCarrito(Number(boton.dataset.id));
});

document.getElementById("ver-carrito").addEventListener("click", () => {
  panelCarrito.hidden = false;
  mostrarCarrito();
  panelCarrito.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("cerrar-carrito").addEventListener("click", () => {
  panelCarrito.hidden = true;
});

contenidoCarrito.addEventListener("click", evento => {
  const boton = evento.target.closest(".quitar-producto");
  if (boton) {
    carrito.splice(Number(boton.dataset.indice), 1);
    contadorCarrito.textContent = carrito.length;
    mostrarCarrito();
  }
});

mostrarProductos();
mostrarCarrito();
