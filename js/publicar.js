ensureSeed();
updateCartBadge();

const $ = (s) => document.querySelector(s);
const msg = $("#msg");

function setMsg(text, danger = false) {
    msg.hidden = false;
    msg.textContent = text;
    msg.classList.toggle("danger", danger);
}

$("#save")?.addEventListener("click", () => {
    const sellerName = $("#seller").value.trim();
    const name = $("#name").value.trim();
    const price = Number($("#price").value);

    if (!sellerName || !name || !Number.isFinite(price) || price <= 0) {
        setMsg("Completa nombre del vendedor, nombre del producto y precio válido.", true);
        return;
    }

    setMsg("Publicado. La publicación fue enviada correctamente.");

    setTimeout(() => {
        location.href = "catalogo.html";
    }, 900);
});