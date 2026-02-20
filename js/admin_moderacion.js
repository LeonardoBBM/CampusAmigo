// js/admin_moderacion.js
ensureSeed();

const rows = document.querySelector("#rows");
const q = document.querySelector("#q");
const type = document.querySelector("#type");
const cat = document.querySelector("#cat");
const sort = document.querySelector("#sort");
const count = document.querySelector("#count");

// form
const formCard = document.querySelector("#formCard");
const formTitle = document.querySelector("#formTitle");
const fname = document.querySelector("#fname");
const fprice = document.querySelector("#fprice");
const fcat = document.querySelector("#fcat");
const ftag = document.querySelector("#ftag");
const fdesc = document.querySelector("#fdesc");
const ok = document.querySelector("#ok");
const btnCancel = document.querySelector("#cancel");
const btnSave = document.querySelector("#save");

let editingId = null;

function isUserItem(p) { return !!p.sellerId; }
function itemType(p) { return isUserItem(p) ? "Usuario" : "Seed"; }
function itemSeller(p) { return isUserItem(p) ? (p.sellerName || p.sellerId || "—") : "—"; }

function tagHtml(tag) {
    if (!tag) return `<span class="small">(ninguna)</span>`;
    const cls = tag === "Nuevo" ? "new" : (tag === "Oferta" ? "sale" : "");
    return `<span class="tag ${cls}">${tag}</span>`;
}

function normalize(s) { return (s || "").toString().trim().toLowerCase(); }

function openEdit(p) {
    editingId = p.id;
    formCard.hidden = false;
    ok.hidden = true;
    formTitle.textContent = `Editar: ${p.name}`;

    fname.value = p.name || "";
    fprice.value = p.price ?? "";
    fcat.value = p.category || "electronica";
    ftag.value = p.tag || "";
    fdesc.value = p.desc || "";

    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeEdit() {
    editingId = null;
    formCard.hidden = true;
    ok.hidden = true;
}

btnCancel.addEventListener("click", closeEdit);

btnSave.addEventListener("click", () => {
    const name = fname.value.trim();
    const price = Number(fprice.value);

    if (!name || !Number.isFinite(price) || price <= 0) {
        alert("Nombre y precio válidos, por favor.");
        return;
    }

    const products = getProducts();
    const idx = products.findIndex(p => p.id === editingId);
    if (idx < 0) {
        alert("No se encontró el item (¿ya fue eliminado?).");
        closeEdit();
        render();
        return;
    }

    products[idx] = {
        ...products[idx],
        name,
        price,
        category: fcat.value,
        tag: ftag.value,
        desc: fdesc.value.trim()
    };

    saveProducts(products);
    ok.hidden = false;
    ok.textContent = "Guardado.";
    render();
});

function render() {
    const all = getProducts();
    let items = [...all];

    // filtro texto
    const term = normalize(q.value);
    if (term) {
        items = items.filter(p => {
            const blob = [
                p.name, p.desc, p.category, p.tag,
                p.sellerName, p.sellerId
            ].map(normalize).join(" ");
            return blob.includes(term);
        });
    }

    // filtro tipo
    if (type.value === "seed") items = items.filter(p => !p.sellerId);
    if (type.value === "user") items = items.filter(p => !!p.sellerId);

    // filtro categoría
    if (cat.value !== "all") items = items.filter(p => p.category === cat.value);

    // sort
    if (sort.value === "price_asc") items.sort((a, b) => a.price - b.price);
    if (sort.value === "price_desc") items.sort((a, b) => b.price - a.price);
    if (sort.value === "name_asc") items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sort.value === "recent") items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    count.textContent = `${items.length} items`;

    if (!items.length) {
        rows.innerHTML = `<tr><td colspan="6" class="small">Sin resultados.</td></tr>`;
        return;
    }

    rows.innerHTML = items.map(p => `
    <tr>
      <td>
        <b>${p.name}</b>
        <div class="small">${(p.desc || "").slice(0, 70)}</div>
        <div class="small">ID: <span class="pill">${p.id}</span></div>
      </td>
      <td>${itemType(p)}</td>
      <td>${p.category}</td>
      <td class="right">${money(p.price)}</td>
      <td>${itemSeller(p)}</td>
      <td class="right" style="white-space:nowrap">
        <button class="btn" data-edit="${p.id}">Editar</button>
        <button class="btn danger outline" data-del="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");

    document.querySelectorAll("[data-edit]").forEach(b => {
        b.addEventListener("click", () => {
            const prod = getProducts().find(x => x.id === b.dataset.edit);
            if (prod) openEdit(prod);
        });
    });

    document.querySelectorAll("[data-del]").forEach(b => {
        b.addEventListener("click", () => {
            const id = b.dataset.del;
            const prod = getProducts().find(x => x.id === id);
            if (!prod) return;

            const label = prod.sellerId ? `publicación de ${prod.sellerName || prod.sellerId}` : "producto seed";
            if (confirm(`¿Eliminar este item? (${label})`)) {
                const updated = getProducts().filter(x => x.id !== id);
                saveProducts(updated);

                // si estabas editando el mismo, cierra
                if (editingId === id) closeEdit();

                render();
            }
        });
    });
}

[q, type, cat, sort].forEach(el => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
});

render();