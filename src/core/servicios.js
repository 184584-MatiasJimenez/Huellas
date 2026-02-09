/**
 * Página Servicios: lee window.Huellas.services (data.js) y muestra nombre, descripción y precio.
 * Cada servicio tiene un enlace a reserva con el id preseleccionado.
 */
(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  function formatUYU(value) {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderServices() {
    const services = window.Huellas?.services || [];
    const grid = $("#servicesGrid");
    const empty = $("#emptyState");

    if (!grid || !empty) return;

    if (services.length === 0) {
      empty.classList.remove("d-none");
      grid.innerHTML = "";
      return;
    }

    empty.classList.add("d-none");
    grid.innerHTML = services
      .map((s) => {
        const name = escapeHtml(s.name);
        const description = escapeHtml(s.description || "");
        const price = formatUYU(s.priceUYU);
        const reservaUrl = "./reserva.html?servicio=" + encodeURIComponent(s.id);
        return `
          <div class="col-12 col-sm-6 col-lg-4">
            <article class="card service-card h-100 rounded-4">
              <div class="card-body d-flex flex-column gap-2">
                <div class="d-flex align-items-start justify-content-between gap-2">
                  <h2 class="h5 mb-0">${name}</h2>
                  <span class="badge rounded-pill price-pill">${price}</span>
                </div>
                <p class="text-secondary mb-0">${description}</p>
                <div class="mt-auto pt-2">
                  <a href="${reservaUrl}" class="btn btn-sm btn-outline-primary w-100">Reservar turno</a>
                </div>
              </div>
            </article>
          </div>
        `;
      })
      .join("");
  }

  function init() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    renderServices();
  }

  init();
})();
