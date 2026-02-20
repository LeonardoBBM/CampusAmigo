ensureSeed();
updateCartBadge();

// Bloqueo: solo con sesión
const u = requireLoginOrRedirect("publicar.html");
if (!u) { /* redirigido */ }

const $ = (s) => document.querySelector(s);
const msg = $("#msg");

function setMsg(text, danger = false) {
    msg.hidden = false;
    msg.textContent = text;
    msg.classList.toggle("danger", danger);
}

$("#save").addEventListener("click", () => {
    const name = $("#name").value.trim();
    const price = Number($("#price").value);
    const category = $("#cat").value;
    const tag = $("#tag").value;
    const desc = $("#desc").value.trim();

    if (!name || !price || price <= 0) {
        setMsg("Pon un nombre y un precio válido.", true);
        return;
    }

    const products = getProducts();
    const id = "p_" + Date.now().toString(36) + Math.random().toString(16).slice(2, 6);

    products.unshift({
        id,
        name,
        price,
        category,
        tag,
        desc,
        sellerId: u.id,
        sellerName: u.name,
        createdAt: new Date().toISOString()
    });

    saveProducts(products);

    setMsg("Publicado (simulado). Ya aparece en el catálogo.");
    setTimeout(() => location.href = "mis_publicaciones.html", 800);
});