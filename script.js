// Productos de ejemplo (puedes editar o reemplazar)
const PRODUCTS = [
  {
    id: "palma-marble-grande",
    name: "Palma Marble Grande",
    tag: "Marble Collection",
    tagKey: "marble",
    height: "120 cm",
    pot: "Base mármol blanco",
    price: 189,
    note: "Perfecta para halls de entrada y recepciones.",
    image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tall: true
  },
  {
    id: "olivo-gold-slim",
    name: "Olivo Slim Gold",
    tag: "Gold Collection",
    tagKey: "gold",
    height: "150 cm",
    pot: "Macetero cilíndrico dorado",
    price: 210,
    note: "Efecto minimalista, ideal para esquinas y pasillos.",
    image: "https://images.pexels.com/photos/4492046/pexels-photo-4492046.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tall: true
  },
  {
    id: "monstera-desk-marmo",
    name: "Monstera Desk Mármol",
    tag: "Escritorio",
    tagKey: "desk",
    height: "45 cm",
    pot: "Bloque mármol blanco",
    price: 89,
    note: "Tamaño perfecto para escritorio o mesa auxiliar.",
    image: "https://images.pexels.com/photos/305821/pexels-photo-305821.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tall: false
  },
  {
    id: "mix-verde-duo",
    name: "Duo Verde Texturas",
    tag: "Marble Collection",
    tagKey: "marble",
    height: "70 cm",
    pot: "Set 2 unidades · mármol & dorado",
    price: 165,
    note: "Para flanquear muebles bajos o vanities.",
    image: "https://images.pexels.com/photos/3952020/pexels-photo-3952020.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tall: false
  },
  {
    id: "mini-gold-desk",
    name: "Mini Gold Desk",
    tag: "Gold Collection",
    tagKey: "desk",
    height: "35 cm",
    pot: "Copa dorada pulida",
    price: 72,
    note: "Accento pequeño para mesas de apoyo.",
    image: "https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tall: false
  },
  {
    id: "fig-tree-deluxe",
    name: "Fig Tree Deluxe",
    tag: "Altas",
    tagKey: "tall",
    height: "170 cm",
    pot: "Base cilíndrica mármol + aro dorado",
    price: 260,
    note: "Proporción alta para living o clínica estética.",
    image: "https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tall: true
  }
];

const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const yearEl = document.getElementById("year");
const filterButtons = document.querySelectorAll(".filter-button");

let cart = [];

// Helpers
const formatPrice = (value) => `£${value.toFixed(0)}`;

// Render productos
function renderProducts(filterKey = "all") {
  productsGrid.innerHTML = "";
  const filtered = PRODUCTS.filter((p) => {
    if (filterKey === "all") return true;
    if (filterKey === "tall") return p.tall;
    return p.tagKey === filterKey;
  });

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "product-image";

    const imgInner = document.createElement("div");
    imgInner.className = "product-image-inner";
    imgInner.style.backgroundImage = `url('${product.image}')`;

    const tag = document.createElement("div");
    tag.className = "product-tag";
    tag.textContent = product.tag;

    imageWrapper.appendChild(imgInner);
    imageWrapper.appendChild(tag);

    const body = document.createElement("div");
    body.className = "product-body";

    const title = document.createElement("div");
    title.className = "product-title";
    title.textContent = product.name;

    const meta = document.createElement("div");
    meta.className = "product-meta";
    meta.textContent = `${product.height} · ${product.pot}`;

    const footer = document.createElement("div");
    footer.className = "product-footer";

    const priceWrap = document.createElement("div");
    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);
    const note = document.createElement("div");
    note.className = "product-note";
    note.textContent = product.note;
    priceWrap.appendChild(price);
    priceWrap.appendChild(note);

    const button = document.createElement("button");
    button.className = "btn primary";
    button.textContent = "Agregar";
    button.style.fontSize = "12px";
    button.addEventListener("click", () => addToCart(product));

    footer.appendChild(priceWrap);
    footer.appendChild(button);

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(footer);

    card.appendChild(imageWrapper);
    card.appendChild(body);
    productsGrid.appendChild(card);
  });
}

// Cart logic
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      height: product.height,
      pot: product.pot,
      qty: 1
    });
  }
  updateCartUI();
  openCart();
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "Tu carrito está vacío.";
    cartItemsEl.appendChild(empty);
    cartTotalEl.textContent = "£0";
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    meta.textContent = `${item.height} · ${item.pot}`;

    const price = document.createElement("div");
    price.className = "cart-item-price";
    price.textContent = formatPrice(item.price * item.qty);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const qtyControl = document.createElement("div");
    qtyControl.className = "qty-control";

    const minusBtn = document.createElement("button");
    minusBtn.className = "qty-button";
    minusBtn.textContent = "−";
    minusBtn.addEventListener("click", () => changeQty(item.id, -1));

    const qtyText = document.createElement("span");
    qtyText.textContent = item.qty;

    const plusBtn = document.createElement("button");
    plusBtn.className = "qty-button";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => changeQty(item.id, 1));

    qtyControl.appendChild(minusBtn);
    qtyControl.appendChild(qtyText);
    qtyControl.appendChild(plusBtn);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-button";
    removeBtn.textContent = "Eliminar";
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    actions.appendChild(qtyControl);
    actions.appendChild(removeBtn);

    row.appendChild(title);
    row.appendChild(price);
    row.appendChild(meta);
    row.appendChild(actions);

    cartItemsEl.appendChild(row);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalEl.textContent = formatPrice(total);
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCartUI();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

// Filters
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const key = btn.dataset.filter;
    renderProducts(key);
  });
});

// Contact form demo
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Demo: aquí podrías enviar este formulario a tu email o backend. 🙂");
  contactForm.reset();
});

// Cart events
cartButton.addEventListener("click", openCart);
cartOverlay.addEventListener("click", closeCartDrawer);
closeCart.addEventListener("click", closeCartDrawer);

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  alert("Demo de checkout. Más adelante conectamos pagos reales. 🛒");
});

// Year
yearEl.textContent = new Date().getFullYear();

// Inicializar
renderProducts("all");
