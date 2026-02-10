/**
 * Página Equipo: lee window.Huellas.professionals (data.js).
 * Muestra foto, nombre, rol y chip por tipo (veterinario / estética). Enlace a reservar turno con ese profesional.
 */
(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getTypeLabel(type) {
    if (type === "estetica") return "Estética / Baño";
    if (type === "veterinario") return "Veterinaria";
    return type || "";
  }

  function getTypeChipClass(type) {
    if (type === "estetica") return "badge-equipo-estetica";
    if (type === "veterinario") return "badge-equipo-vet";
    return "";
  }

  function renderEquipo() {
    const professionals = window.Huellas?.professionals || [];
    const grid = $("#equipoGrid");
    const empty = $("#emptyState");

    if (!grid || !empty) return;

    if (professionals.length === 0) {
      empty.classList.remove("d-none");
      grid.innerHTML = "";
      return;
    }

    empty.classList.add("d-none");
    const isAdmin = window.HuellasRole === "admin";

    grid.innerHTML = professionals
      .map((p) => {
        const name = escapeHtml(p.name);
        const role = escapeHtml(p.role || "");
        const photo = p.photo ? escapeHtml(p.photo) : "";
        const typeLabel = getTypeLabel(p.type);
        const chipClass = getTypeChipClass(p.type);
        const reservaUrl = "./reserva.html?profesional=" + encodeURIComponent(p.id);
        const imgAlt = "Foto de " + name;
        const reservarBtn = isAdmin
          ? ""
          : `<div class="mt-auto pt-2"><a href="${reservaUrl}" class="btn btn-sm btn-outline-primary w-100">Reservar turno</a></div>`;
        return `
          <div class="col-12 col-sm-6 col-lg-4">
            <article class="card equipo-card h-100 rounded-4 overflow-hidden">
              <div class="equipo-card-img-wrap">
                <img src="${photo}" alt="${imgAlt}" class="equipo-card-img" loading="lazy" />
                <span class="badge rounded-pill ${chipClass} equipo-card-chip">${escapeHtml(typeLabel)}</span>
              </div>
              <div class="card-body d-flex flex-column gap-2">
                <h2 class="h5 mb-0">${name}</h2>
                <p class="text-secondary mb-0">${role}</p>
                ${reservarBtn}
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
    renderEquipo();
  }

  init();
})();
