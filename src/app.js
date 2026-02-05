/**
 * Página principal (index): listado de servicios y filtro.
 * Datos desde window.Huellas (data.js).
 */
(function () {
  "use strict";

  // const services = window.Huellas?.services || [];
  // const $ = (selector) => document.querySelector(selector);

  // function formatUYU(value) {
  //   return new Intl.NumberFormat("es-UY", {
  //     style: "currency",
  //     currency: "UYU",
  //     maximumFractionDigits: 0,
  //   }).format(value);
  // }

  // function escapeHtml(str) {
  //   return String(str)
  //     .replaceAll("&", "&amp;")
  //     .replaceAll("<", "&lt;")
  //     .replaceAll(">", "&gt;")
  //     .replaceAll('"', "&quot;")
  //     .replaceAll("'", "&#039;");
  // }

  // function normalize(text) {
  //   return String(text || "")
  //     .toLowerCase()
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "");
  // }

  // function renderServices(items) {
  //   const grid = $("#servicesGrid");
  //   const empty = $("#emptyState");
  //   if (!grid || !empty) return;

  //   grid.innerHTML = items
  //     .map((s) => {
  //       const name = escapeHtml(s.name);
  //       const description = escapeHtml(s.description);
  //       const price = formatUYU(s.priceUYU);
  //       return `
  //       <div class="col-12 col-sm-6 col-lg-4">
  //         <article class="card service-card h-100 rounded-4">
  //           <div class="card-body d-flex flex-column gap-2">
  //             <div class="d-flex align-items-start justify-content-between gap-2">
  //               <h3 class="h5 mb-0">${name}</h3>
  //               <span class="badge rounded-pill price-pill">${price}</span>
  //             </div>
  //             <p class="text-secondary mb-0">${description}</p>
  //             <div class="mt-auto pt-2">
  //               <a href="./reserva.html" class="btn btn-sm btn-outline-primary w-100">Solicitar turno</a>
  //             </div>
  //           </div>
  //         </article>
  //       </div>
  //     `;
  //     })
  //     .join("");

  //   const isEmpty = items.length === 0;
  //   empty.classList.toggle("d-none", !isEmpty);
  // }

  // function setupFilter() {
  //   const input = $("#filtroServicios");
  //   if (!input) return;
  //   input.addEventListener("input", () => {
  //     const q = normalize(input.value);
  //     const filtered = services.filter((s) => {
  //       const haystack = normalize(`${s.name} ${s.description}`);
  //       return haystack.includes(q);
  //     });
  //     renderServices(filtered);
  //   });
  // }

  function init() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    // renderServices(services);
    // setupFilter();
  }

  init();
})();
