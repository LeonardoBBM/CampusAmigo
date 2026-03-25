ensureSeed();
updateCartBadge();

const rows = document.querySelector("#rows");
const empty = document.querySelector("#empty");
const sub = document.querySelector("#sub");
const tot = document.querySelector("#tot");

function render() {
  const cart = getCart();
  const products = getProducts();

  if (cart.length === 0) {
    empty.hidden = false;
    rows.innerHTML = "";
    sub.textContent = money(0);
    tot.textContent = money(0);
    updateCartBadge();
    return;
  }

  empty.hidden = true;

  let subtotal = 0;

  rows.innerHTML = cart.map(it => {
    const p = products.find(x => x.id === it.id);
    if (!p) return "";
    const line = p.price * it.qty;
    subtotal += line;

    return `
      <tr>
        <td><b>${p.name}</b><div class="small">${p.category}</div></td>
        <td class="right">${money(p.price)}</td>
        <td class="right">
          <button class="btn" data-dec="${p.id}">-</button>
          <span style="display:inline-block;width:34px;text-align:center">${it.qty}</span>
          <button class="btn" data-inc="${p.id}">+</button>
        </td>
        <td class="right"><b>${money(line)}</b></td>
        <td class="right"><button class="btn" data-del="${p.id}">Eliminar</button></td>
      </tr>
    `;
  }).join("");

  sub.textContent = money(subtotal);
  tot.textContent = money(subtotal); // simple

  document.querySelectorAll("[data-inc]").forEach(b => {
    b.addEventListener("click", () => {
      const item = getCart().find(i => i.id === b.dataset.inc);
      const next = (item ? item.qty : 0) + 1;
      setCartQty(b.dataset.inc, next);
      render();
    });
  });
  document.querySelectorAll("[data-dec]").forEach(b => {
    b.addEventListener("click", () => {
      const item = getCart().find(i => i.id === b.dataset.dec);
      const next = (item ? item.qty : 0) - 1;
      setCartQty(b.dataset.dec, next);
      render();
    });
  });
  document.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => {
      if (confirm("¿Eliminar este producto del carrito?")) { removeFromCart(b.dataset.del); render(); }
    });
  });

  updateCartBadge();
}

document.querySelector("#checkout")?.addEventListener("click", () => {
  const u = (typeof currentUser === "function") ? currentUser() : null;

  if (!u) {
    alert("Necesitas iniciar sesión para continuar.");
    setRedirectAfterLogin("carrito.html");
    location.href = "login.html";
    return;
  }

  const cart = getCart();
  if (!cart || cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // Guardamos un borrador para usarlo en entrega
  LS.set("campusamigo_checkout_draft", {
    userId: u.id,
    createdAt: new Date().toISOString()
  });

  location.href = "entrega.html";
});

document.querySelector("#clear")?.addEventListener("click", () => {
  if (confirm("¿Vaciar carrito?")) {
    LS.set(KEYS.cart, []);
    updateCartBadge();
    render();
  }
});


render();
