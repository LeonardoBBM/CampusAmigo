ensureSeed();
updateCartBadge();

const id = getParam("id");
const p = getProducts().find(x => x.id === id);

const $ = (s) => document.querySelector(s);

if (!p) {
  document.querySelector("main").innerHTML =
    `<div class="container">
      <p class="notice danger">Producto no encontrado.</p>
      <a class="btn" href="catalogo.html">Volver</a>
    </div>`;
} else {
  $("#name").textContent = p.name;
  $("#price").textContent = money(p.price);
  $("#cat").textContent = p.category;
  $("#desc").textContent = p.desc || "";

  if (p.tag) {
    const tagClass = p.tag === "Nuevo" ? "new" : (p.tag === "Oferta" ? "sale" : "");
    $("#tag").innerHTML = `<span class="tag ${tagClass}">${p.tag}</span>`;
  }

  // Agregar al carrito
  $("#add").addEventListener("click", () => {
    const qty = Number($("#qty").value || 1);
    addToCart(p.id, qty);

    $("#msg").hidden = false;
    $("#msg").textContent = `Agregado al carrito: ${qty} x ${p.name}`;
    updateCartBadge();

    setTimeout(() => $("#msg").hidden = true, 1200);
  });

  // relacionados
  const rel = getProducts()
    .filter(x => x.category === p.category && x.id !== p.id)
    .slice(0, 3);

  document.querySelector("#rel").innerHTML = rel.map(x => `
    <article class="card product">
      <div class="prod-img">Relacionado</div>

      <div class="p-body" style="margin-top:10px">
        <div class="p-tag">
          ${x.tag ? `<span class="tag ${x.tag === "Nuevo" ? "new" : (x.tag === "Oferta" ? "sale" : "")}">${x.tag}</span>` : ``}
        </div>

        <h3 class="p-title">${x.name}</h3>

        <div class="p-meta">
          <span class="small">${x.category}</span>
          <span class="price">${money(x.price)}</span>
        </div>

        <hr/>

        <div class="p-actions">
          <a class="btn" href="producto.html?id=${encodeURIComponent(x.id)}">Ver detalle</a>
        </div>
      </div>
    </article>
  `).join("") || `<p class="small">No hay relacionados aún.</p>`;
}