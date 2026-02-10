/**
 * Rutas protegidas: verifica rol (admin/client). Redirige a login si no hay sesión.
 * Construye la navegación según el rol y añade Cerrar sesión.
 */
(function () {
  "use strict";

  const ROLE_KEY = "huellas_role";

  const $ = (selector) => document.querySelector(selector);

  function getRole() {
    return sessionStorage.getItem(ROLE_KEY);
  }

  function clearRole() {
    sessionStorage.removeItem(ROLE_KEY);
  }

  function getCurrentPage() {
    const path = window.location.pathname || "";
    const name = path.split("/").pop() || "";
    if (name === "listaTurnos.html") return "listaTurnos";
    if (name === "equipo.html") return "equipo";
    if (name === "servicios.html") return "servicios";
    if (name === "reserva.html") return "reserva";
    return "";
  }

  function buildNavLinks(role, currentPage) {
    const active = "nav-link active";
    const normal = "nav-link";

    if (role === "admin") {
      return [
        { href: "./listaTurnos.html", label: "Listado de turnos", class: currentPage === "listaTurnos" ? active : normal },
        { href: "./equipo.html", label: "Equipo profesional", class: currentPage === "equipo" ? active : normal },
        { href: "./index.html", label: "Cerrar sesión", class: normal, logout: true },
      ];
    }

    if (role === "client") {
      return [
        { href: "./servicios.html", label: "Servicios", class: currentPage === "servicios" ? active : normal },
        { href: "./equipo.html", label: "Equipo", class: currentPage === "equipo" ? active : normal },
        { href: "./reserva.html", label: "Reservar turno", class: currentPage === "reserva" ? active : normal },
        { href: "./index.html", label: "Cerrar sesión", class: normal, logout: true },
      ];
    }

    return [];
  }

  function renderNav(role, currentPage) {
    const links = buildNavLinks(role, currentPage);
    const navLinks = $("#navLinks");
    if (!navLinks) return;

    navLinks.innerHTML = links
      .map((item) => {
        if (item.logout) {
          return '<a class="' + item.class + '" href="./index.html" id="navLogout">' + escapeHtml(item.label) + "</a>";
        }
        return '<a class="' + item.class + '" href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + "</a>";
      })
      .join("");

    const logoutEl = $("#navLogout");
    if (logoutEl) {
      logoutEl.addEventListener("click", function (e) {
        e.preventDefault();
        clearRole();
        window.location.href = "./index.html";
      });
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function init() {
    const role = getRole();
    const currentPage = getCurrentPage();

    if (!role) {
      window.location.replace("./index.html");
      return;
    }

    if (role === "client" && currentPage === "listaTurnos") {
      window.location.replace("./servicios.html");
      return;
    }

    if (role === "admin" && (currentPage === "reserva" || currentPage === "servicios")) {
      window.location.replace("./listaTurnos.html");
      return;
    }

    window.HuellasRole = role;
    renderNav(role, currentPage);

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const toggler = document.querySelector(".navbar-toggler");
    const collapse = document.querySelector(".navbar-collapse");
    if (toggler && collapse) {
      toggler.addEventListener("click", function () {
        collapse.classList.toggle("show");
        toggler.setAttribute("aria-expanded", collapse.classList.contains("show"));
      });
    }
  }

  init();
})();
