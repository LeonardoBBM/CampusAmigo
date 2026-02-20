const LS = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

const KEYS = {
  products: "campusamigo_products",
  cart: "campusamigo_cart",
  users: "campusamigo_users",
  session: "campusamigo_session",
  orders: "campusamigo_orders"
};

function money(n) { return "$" + Number(n).toFixed(2); }

function ensureSeed() {
  const existing = LS.get(KEYS.products, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    LS.set(KEYS.products, window.SEED_PRODUCTS ?? []);
  }
  if (!LS.get(KEYS.cart, null)) LS.set(KEYS.cart, []);
  if (!LS.get(KEYS.users, null)) LS.set(KEYS.users, []);
  if (!LS.get(KEYS.session, null)) LS.set(KEYS.session, null);
  if (!LS.get(KEYS.orders, null)) LS.set(KEYS.orders, []);
}

function getProducts() { return LS.get(KEYS.products, []); }
function saveProducts(p) { LS.set(KEYS.products, p); }

function getCart() {
  const cart = LS.get(KEYS.cart, []);
  return Array.isArray(cart) ? cart : [];
}
function saveCart(c) { LS.set(KEYS.cart, c); }

function cartCount() {
  return getCart().reduce((acc, it) => acc + it.qty, 0);
}

function updateCartBadge() {
  const cart = LS.get(KEYS.cart, []);
  const safeCart = Array.isArray(cart) ? cart : [];
  const total = safeCart.reduce((sum, item) => {
    const q = Number(item?.qty);
    return sum + (Number.isFinite(q) && q > 0 ? q : 0);
  }, 0);

  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = total;
  });
}

function addToCart(productId, qty) {
  qty = Math.max(1, Number(qty || 1));
  const cart = getCart();
  const found = cart.find(i => i.id === productId);
  if (found) found.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart(cart);
  updateCartBadge();
}

function removeFromCart(id){
  const cart = getCart().filter(it => it.id !== id);
  LS.set(KEYS.cart, cart);
}

function setCartQty(id, qty) {
  const cart = getCart();
  const q = Number(qty);

  // si qty <= 0 => eliminar del carrito
  const cleaned = cart
    .map(it => it.id === id ? { ...it, qty: q } : it)
    .filter(it => Number(it.qty) > 0);

  LS.set(KEYS.cart, cleaned);
}

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function getOrders() {
  return LS.get(KEYS.orders, []);
}

function saveOrders(o) {
  LS.set(KEYS.orders, o);
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("#nav-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }
});