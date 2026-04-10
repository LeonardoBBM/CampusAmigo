ensureSeed();
updateCartBadge();

const confirmSummary = document.querySelector("#confirmSummary");
const order = LS.get("campusamigo_last_order", null);

if (!order) {
    confirmSummary.innerHTML = `
    <div class="notice danger" style="margin-top:12px">
      No se encontró una compra reciente.
    </div>
  `;
} else {
    confirmSummary.innerHTML = `
    <div class="card" style="padding:14px">
      <div class="row"><span class="small">Pedido</span><b>${order.id}</b></div>
      <div class="row" style="margin-top:8px"><span class="small">Folio</span><b>${order.folio}</b></div>
      <div class="row" style="margin-top:8px"><span class="small">Fecha</span><b>${order.date}</b></div>
      <div class="row" style="margin-top:8px"><span class="small">Método</span><b>${order.paymentMethod}</b></div>
      <div class="row" style="margin-top:8px"><span class="small">Total</span><b>${money(order.total)}</b></div>
    </div>

    <div style="margin-top:16px">
      <h3>Resumen</h3>
      ${order.items.map(item => `
        <div class="row" style="margin-top:8px">
          <span class="small">${item.name} x ${item.qty}</span>
          <b>${money(item.subtotal)}</b>
        </div>
      `).join("")}
    </div>
  `;
}