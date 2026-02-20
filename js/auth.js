// ===== Helpers LocalStorage (dependen de app.js) =====
function getUsers() { return LS.get(KEYS.users, []); }
function saveUsers(u) { LS.set(KEYS.users, u); }

function getSession() { return LS.get(KEYS.session, null); }
function setSession(s) { LS.set(KEYS.session, s); }

// ===== Redirección post-login (candado) =====
function setRedirectAfterLogin(url) {
  LS.set("campusamigo_redirect", { url });
}

function consumeRedirectAfterLogin() {
  const r = LS.get("campusamigo_redirect", null);
  localStorage.removeItem("campusamigo_redirect");
  return r?.url || null;
}

// ===== Auth core =====
function findUserByEmail(email) {
  email = (email || "").trim().toLowerCase();
  return getUsers().find(u => u.email === email) || null;
}

function registerUser(name, email, pass) {
  name = (name || "").trim();
  email = (email || "").trim().toLowerCase();
  pass = (pass || "").trim();

  if (!name || !email || !pass) return { ok: false, msg: "Completa todos los campos." };
  if (!email.includes("@")) return { ok: false, msg: "Correo inválido." };

  if (findUserByEmail(email)) return { ok: false, msg: "Ese correo ya está registrado." };

  const users = getUsers();
  const user = { id: "u" + Date.now(), name, email, pass };
  users.push(user);
  saveUsers(users);

  return { ok: true, msg: "Registro exitoso." };
}

function loginUser(email, pass) {
  email = (email || "").trim().toLowerCase();
  pass = (pass || "").trim();

  const user = findUserByEmail(email);
  if (!user) return { ok: false, msg: "Usuario no encontrado. Regístrate primero." };
  if (user.pass !== pass) return { ok: false, msg: "Contraseña incorrecta." };

  setSession({ userId: user.id });
  return { ok: true, msg: "Login exitoso." };
}

function logoutUser() {
  setSession(null);
}

function currentUser() {
  const s = getSession();
  if (!s) return null;
  return getUsers().find(u => u.id === s.userId) || null;
}

// ===== Navbar dynamic =====
function renderNavAuth() {
  const container = document.querySelector("#nav-auth");
  if (!container) return;

  const user = currentUser();

  if (!user) {
    container.innerHTML = `
      <a class="btn" href="login.html">Login</a>
      <a class="btn" href="registro.html">Registro</a>
    `;
    return;
  }

  const hidePublish =
    location.pathname.endsWith("login.html") ||
    location.pathname.endsWith("registro.html");

  container.innerHTML = `
    ${(!hidePublish && user.role !== 'admin')
      ? `<a class="btn primary" href="publicar.html">Publicar</a>`
      : ``}
    <a class="pill" href="${user.role === 'admin' ? 'admin/index.html' : 'perfil.html'}">👤 ${user.name}</a>
    <a class="btn" href="#" id="nav-logout">Salir</a>
  `;

  const logoutBtn = document.querySelector("#nav-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
      location.href = "index.html";
    });
  }
}

// ===== Perfil =====
function renderProfile() {
  const u = currentUser();
  const out = document.querySelector("#loggedOut");
  const inn = document.querySelector("#loggedIn");

  if (!out || !inn) return;

  if (!u) {
    out.hidden = false;
    inn.hidden = true;
    return;
  }

  out.hidden = true;
  inn.hidden = false;

  const pName = document.querySelector("#pName");
  const pEmail = document.querySelector("#pEmail");
  if (pName) pName.textContent = u.name;
  if (pEmail) pEmail.textContent = u.email;

  const logout = document.querySelector("#logout");
  if (logout) {
    logout.addEventListener("click", () => {
      logoutUser();
      location.href = "login.html";
    });
  }
}

function ensureAdminUser() {
  const users = getUsers();
  const exists = users.some(u => u.role === "admin");
  if (exists) return;

  users.push({
    id: "u_admin",
    name: "Administrador",
    email: "admin@admin.com",
    pass: "123",
    role: "admin"
  });
  saveUsers(users);
}

// ===== Auto wiring =====
document.addEventListener("DOMContentLoaded", () => {
  //Revisamos si es admin
  ensureAdminUser();

  // Siempre renderiza el nav
  renderNavAuth();

  // Registro
  if (location.pathname.endsWith("registro.html")) {
    const btn = document.querySelector("#btn");
    const name = document.querySelector("#name");
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");
    const msg = document.querySelector("#msg");

    if (btn) {
      btn.addEventListener("click", () => {
        const r = registerUser(name.value, email.value, pass.value);
        msg.hidden = false;
        msg.classList.toggle("danger", !r.ok);
        msg.textContent = r.msg;
        if (r.ok) setTimeout(() => location.href = "login.html", 700);
      });
    }
  }

  // Login
  if (location.pathname.endsWith("login.html")) {
    const btn = document.querySelector("#btn");
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");
    const msg = document.querySelector("#msg");

    if (btn) {
      btn.addEventListener("click", () => {
        const r = loginUser(email.value, pass.value);
        if (!r.ok) {
          msg.hidden = false;
          msg.textContent = r.msg;
        } else {
          const next = consumeRedirectAfterLogin();
          location.href = next || "perfil.html";
        }
      });
    }
  }
});