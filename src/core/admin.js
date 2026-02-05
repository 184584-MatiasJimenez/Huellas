(function () {
  "use strict";

  const BOOKINGS_STORAGE_KEY = "huellas_turnos";

  const $ = (id) => document.getElementById(id);

  function getBookings() {
    try {
      const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function sortByDateDesc(list) {
    return [...list].sort((a, b) => {
      const dateCompare = (b.date || "").localeCompare(a.date || "");
      if (dateCompare !== 0) return dateCompare;
      return (b.time || "").localeCompare(a.time || "");
    });
  }

  function escapeHtml(str) {
    if (str == null || str === "") return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderTurnos() {
    const list = getBookings();
    const sorted = sortByDateDesc(list);
    const tbody = $("turnosBody");
    const emptyEl = $("emptyTurnos");
    const tableWrap = document.querySelector(".table-responsive");

    if (!tbody) return;

    if (sorted.length === 0) {
      tbody.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("d-none");
      if (tableWrap) tableWrap.classList.add("d-none");
      return;
    }

    if (emptyEl) emptyEl.classList.add("d-none");
    if (tableWrap) tableWrap.classList.remove("d-none");

    tbody.innerHTML = sorted
      .map(
        (t) => `
        <tr>
          <td>${escapeHtml(t.ownerName)}</td>
          <td>${escapeHtml(t.petName)}</td>
          <td>${escapeHtml(t.phone)}</td>
          <td>${escapeHtml(t.date)}</td>
          <td>${escapeHtml(t.time)}</td>
          <td>${escapeHtml(t.serviceName)}</td>
          <td>${escapeHtml(t.professionalName || "—")}</td>
        </tr>
      `,
      )
      .join("");
  }

  function init() {
    renderTurnos();
  }

  init();
})();
