ensureSeed();
updateCartBadge();

const list = document.querySelector("#list");
const q = document.querySelector("#q");
const cat = document.querySelector("#cat");
const sort = document.querySelector("#sort");
const count = document.querySelector("#count");

function render(){
  let items = getProducts();

  const term = (q.value||"").trim().toLowerCase();
  if(term){
    items = items.filter(p =>
      p.name.toLowerCase().includes(term) || (p.desc||"").toLowerCase().includes(term)
    );
  }

  const c = cat.value;
  if(c !== "all") items = items.filter(p => p.category === c);

  if(sort.value === "price_asc") items = [...items].sort((a,b)=>a.price-b.price);
  if(sort.value === "price_desc") items = [...items].sort((a,b)=>b.price-a.price);

  count.textContent = `${items.length} items`;

  list.innerHTML = items.map(p => {
    const tagClass = p.tag === "Nuevo" ? "new" : (p.tag === "Oferta" ? "sale" : "");
    const tagHtml = p.tag ? `<span class="tag ${tagClass}">${p.tag}</span>` : "";
    return `
      <article class="card product">
        <div class="prod-img">CampusAmigo</div>
        <div style="margin-top:10px">
          ${tagHtml}
          <div class="row">
            <h3 style="margin:6px 0 0">${p.name}</h3>
          </div>
          <div class="row" style="margin-top:8px">
            <span class="small">${p.category}</span>
            <span class="price">${money(p.price)}</span>
          </div>
          <hr/>
          <div class="row">
            <a class="btn" href="producto.html?id=${encodeURIComponent(p.id)}">Ver detalle</a>
            <button class="btn primary" data-add="${p.id}">Agregar</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // handlers Agregar
  document.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      addToCart(btn.dataset.add, 1);
      btn.textContent = "Agregado ✓";
      setTimeout(()=>btn.textContent="Agregar", 700);
    });
  });
}

[q, cat, sort].forEach(el => el.addEventListener("input", render));
render();
