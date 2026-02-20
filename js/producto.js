ensureSeed();
updateCartBadge();

const id = getParam("id");
const p = getProducts().find(x => x.id === id);

const $ = (s)=>document.querySelector(s);

if(!p){
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
  $("#seller").textContent = p.sellerName || "CampusAmigo";

  if(p.tag){
    const tagClass = p.tag === "Nuevo" ? "new" : (p.tag === "Oferta" ? "sale" : "");
    $("#tag").innerHTML = `<span class="tag ${tagClass}">${p.tag}</span>`;
  }

  // Agregar al carrito
  $("#add").addEventListener("click", ()=>{
    const qty = Number($("#qty").value || 1);
    addToCart(p.id, qty);

    $("#msg").hidden = false;
    $("#msg").textContent = `Agregado al carrito: ${qty} x ${p.name}`;
    setTimeout(()=>$("#msg").hidden=true, 1200);
  });

  // Marketplace: solicitar y acordar entrega (sin chat)
  const reqBtn = document.querySelector("#request");
  if(reqBtn){
    reqBtn.addEventListener("click", ()=>{
      const u = requireLoginOrRedirect(`producto.html?id=${encodeURIComponent(p.id)}`);
      if(!u) return;

      const qty = Number($("#qty").value || 1);
      const r = createOrder({ productId: p.id, qty });

      if(!r.ok){
        alert(r.msg);
        return;
      }
      location.href = `acuerdo.html?orderId=${encodeURIComponent(r.orderId)}`;
    });
  }

  // relacionados
  const rel = getProducts()
    .filter(x => x.category === p.category && x.id !== p.id)
    .slice(0,3);

  document.querySelector("#rel").innerHTML = rel.map(x=>`
    <article class="card product">
      <div class="prod-img">Relacionado</div>
      <h3 style="margin:10px 0 6px">${x.name}</h3>
      <div class="row">
        <span class="small">${x.category}</span>
        <span class="price">${money(x.price)}</span>
      </div>
      <hr/>
      <a class="btn" href="producto.html?id=${encodeURIComponent(x.id)}">Ver detalle</a>
    </article>
  `).join("") || `<p class="small">No hay relacionados aún (simulado).</p>`;
}