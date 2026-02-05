(function () {
  "use strict";

  const BOOKINGS_STORAGE_KEY = "huellas_turnos";

  const $ = (id) => document.getElementById(id);

  function getExampleBookings() {
    return [
      { ownerName: "María García", petName: "Luna", phone: "+598 99 111 111", date: "2025-02-20", time: "10:00", serviceName: "Consulta clínica", professionalName: "Dra. Ana Silva", id: 1 },
      { ownerName: "Juan Pérez", petName: "Max", phone: "+598 99 222 222", date: "2025-02-20", time: "09:00", serviceName: "Vacunación", professionalName: "Dr. Martín Rojas", id: 2 },
      { ownerName: "Ana López", petName: "Coco", phone: "+598 99 333 333", date: "2025-02-19", time: "11:30", serviceName: "Baño y corte higiénico", professionalName: "Sofía Pereyra", id: 3 },
      { ownerName: "Carlos Rodríguez", petName: "Nala", phone: "+598 99 444 444", date: "2025-02-19", time: "15:00", serviceName: "Desparasitación", professionalName: null, id: 4 },
      { ownerName: "Laura Martínez", petName: "Thor", phone: "+598 99 555 555", date: "2025-02-18", time: "17:30", serviceName: "Consulta clínica", professionalName: "Dra. Carla Méndez", id: 5 },
      { ownerName: "Diego Fernández", petName: "Mía", phone: "+598 99 666 666", date: "2025-02-18", time: "14:00", serviceName: "Analítica básica", professionalName: "Dr. Martín Rojas", id: 6 },
      { ownerName: "Valentina Silva", petName: "Rocky", phone: "+598 99 777 777", date: "2025-02-17", time: "10:30", serviceName: "Baño y corte higiénico", professionalName: "Lucas Ferrer", id: 7 },
      { ownerName: "Andrés Gómez", petName: "Lola", phone: "+598 99 888 888", date: "2025-02-17", time: "09:30", serviceName: "Vacunación", professionalName: "Dra. Ana Silva", id: 8 },
      { ownerName: "Florencia Díaz", petName: "Simba", phone: "+598 99 999 999", date: "2025-02-14", time: "16:00", serviceName: "Consulta clínica", professionalName: null, id: 9 },
      { ownerName: "Ricardo Castro", petName: "Bella", phone: "+598 99 000 000", date: "2025-02-14", time: "12:00", serviceName: "Desparasitación", professionalName: "Dra. Carla Méndez", id: 10 },
    ];
  }

  function seedExampleBookingsIfEmpty() {
    const list = getBookings();
    if (list.length > 0) return;
    try {
      const examples = getExampleBookings();
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(examples));
    } catch (_) {}
  }

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
    seedExampleBookingsIfEmpty();
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
