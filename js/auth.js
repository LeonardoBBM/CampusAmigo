// js/auth.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== Registro =====
  if (location.pathname.endsWith("registro.html")) {
    const btn = document.querySelector("#btn");
    const name = document.querySelector("#name");
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");
    const msg = document.querySelector("#msg");

    btn?.addEventListener("click", () => {
      if (!name.value.trim() || !email.value.trim() || !pass.value.trim()) {
        msg.hidden = false;
        msg.classList.add("danger");
        msg.textContent = "Completa todos los campos.";
        return;
      }

      msg.hidden = false;
      msg.classList.remove("danger");
      msg.textContent = "Registro exitoso.";

      setTimeout(() => {
        location.href = "login.html";
      }, 700);
    });
  }

  // ===== Login =====
  if (location.pathname.endsWith("login.html")) {
    const btn = document.querySelector("#btn");
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");
    const msg = document.querySelector("#msg");

    btn?.addEventListener("click", () => {
      if (!email.value.trim() || !pass.value.trim()) {
        msg.hidden = false;
        msg.classList.add("danger");
        msg.textContent = "Ingresa correo y contraseña.";
        return;
      }

      location.href = "perfil.html";
    });
  }
});

// ===== Perfil simulado =====
function renderProfile() {
  const out = document.querySelector("#loggedOut");
  const inn = document.querySelector("#loggedIn");

  if (!out || !inn) return;

  out.hidden = true;
  inn.hidden = false;

  const pName = document.querySelector("#pName");
  const pEmail = document.querySelector("#pEmail");

  if (pName) pName.textContent = "Usuario Demo";
  if (pEmail) pEmail.textContent = "usuario@tec.mx";

  const logout = document.querySelector("#logout");
  logout?.addEventListener("click", () => {
    location.href = "login.html";
  });
}