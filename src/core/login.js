/**
 * Pantalla principal: login. Admin (usuario/contraseña) o Acceder como cliente (sin credenciales).
 */
(function () {
  "use strict";

  const ROLE_KEY = "huellas_role";
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "veterinaria";

  const $ = (selector) => document.querySelector(selector);

  function getRole() {
    return sessionStorage.getItem(ROLE_KEY);
  }

  function setRole(role) {
    sessionStorage.setItem(ROLE_KEY, role);
  }

  function redirectByRole() {
    const role = getRole();
    if (role === "admin") {
      window.location.replace("./listaTurnos.html");
      return true;
    }
    if (role === "client") {
      window.location.replace("./servicios.html");
      return true;
    }
    return false;
  }

  function init() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    if (redirectByRole()) return;

    const form = $("#loginForm");
    const btnCliente = $("#btnCliente");
    const loginError = $("#loginError");

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (loginError) loginError.classList.add("d-none");

        const user = (form.usuario && form.usuario.value || "").trim();
        const pass = (form.password && form.password.value || "").trim();

        if (user === ADMIN_USER && pass === ADMIN_PASS) {
          setRole("admin");
          window.location.replace("./listaTurnos.html");
          return;
        }

        if (loginError) loginError.classList.remove("d-none");
      });
    }

    if (btnCliente) {
      btnCliente.addEventListener("click", function (e) {
        e.preventDefault();
        setRole("client");
        window.location.replace("./servicios.html");
      });
    }
  }

  init();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = init;
  }
  
  if (typeof window !== 'undefined') {
    window.initLogin = init;
  }
})();

