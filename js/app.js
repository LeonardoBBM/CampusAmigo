const LS = {
  get(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
};

const KEYS = {
  products: "campusamigo_products",
  cart: "campusamigo_cart",
  users: "campusamigo_users",
  session: "campusamigo_session"
};

function money(n){ return "$" + Number(n).toFixed(2); }

function ensureSeed(){
  const existing = LS.get(KEYS.products, null);
  if(!existing || !Array.isArray(existing) || existing.length === 0){
    LS.set(KEYS.products, window.SEED_PRODUCTS ?? []);
  }
  if(!LS.get(KEYS.cart, null)) LS.set(KEYS.cart, []);
  if(!LS.get(KEYS.users, null)) LS.set(KEYS.users, []);
  if(!LS.get(KEYS.session, null)) LS.set(KEYS.session, null);
}

function getProducts(){ return LS.get(KEYS.products, []); }
function saveProducts(p){ LS.set(KEYS.products, p); }

function getCart(){ return LS.get(KEYS.cart, []); }
function saveCart(c){ LS.set(KEYS.cart, c); }

function cartCount(){
  return getCart().reduce((acc,it)=>acc+it.qty,0);
}

function updateCartBadge(){
  const el = document.querySelector("[data-cart-count]");
  if(el) el.textContent = cartCount();
}

function addToCart(productId, qty){
  qty = Math.max(1, Number(qty||1));
  const cart = getCart();
  const found = cart.find(i=>i.id===productId);
  if(found) found.qty += qty;
  else cart.push({id:productId, qty});
  saveCart(cart);
  updateCartBadge();
}

function removeFromCart(productId){
  const cart = getCart().filter(i=>i.id!==productId);
  saveCart(cart);
  updateCartBadge();
}

function setCartQty(productId, qty){
  qty = Number(qty);
  const cart = getCart();
  const it = cart.find(i=>i.id===productId);
  if(!it) return;
  if(qty <= 0) return removeFromCart(productId);
  it.qty = qty;
  saveCart(cart);
  updateCartBadge();
}

function getParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}
