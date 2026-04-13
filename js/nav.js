// js/nav.js
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return;

  const isAdminArea = location.pathname.includes("/admin/");

  if (isAdminArea) {
    header.innerHTML = `
      <div class="nav">
        <div class="brand">
          <span style="width:12px;height:12px;border-radius:4px;background:var(--accent);display:inline-block"></span>
          <a href="../index.html">CampusAmigo</a>
          <span class="badge">admin</span>
        </div>

        <nav class="links">
          <a href="index.html">Inicio</a>
          <a href="publicaciones.html">Productos</a>
          <a href="../catalogo.html">Ver sitio</a>
        </nav>
      </div>
    `;
    return;
  }

  header.innerHTML = `
    <div class="nav">
      <div class="brand">
        <a href="index.html">CampusAmigo</a>
      </div>

      <button class="btn nav-toggle" id="nav-toggle" aria-label="Abrir menú">☰</button>

      <div class="nav-panel" id="nav-panel">
        <nav class="links">
          <a href="index.html">Inicio</a>
          <a href="catalogo.html">Catálogo</a>
          <a href="subasta.html">Subasta</a>
          <a href="promociones.html">Promociones</a>
          <a href="escaparate.html">Escaparate</a>
          <a href="comunidad.html">Comunidad</a>
          <a href="nosotros.html">Nosotros</a>
          <a href="contacto.html">Contacto</a>
        </nav>

        <div class="actions">
          <a class="pill" href="carrito.html">Carrito: <b data-cart-count>0</b></a>
          <a class="btn" href="login.html">Login</a>
          <a class="btn" href="registro.html">Registro</a>
          <a class="pill" href="admin/index.html">Admin</a>
        </div>
      </div>
    </div>
  `;

  if (typeof updateCartBadge === "function") updateCartBadge();

  const toggle = document.querySelector("#nav-toggle");
  const nav = document.querySelector(".nav");

  toggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
});