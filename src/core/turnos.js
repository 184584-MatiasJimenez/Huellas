/**
 * Única responsabilidad: obtener el array de turnos y pushear nuevas reservas.
 * listaTurnos.html consume este mismo array desde localStorage.
 */
(function () {
  "use strict";

  const BOOKINGS_STORAGE_KEY = "huellas_turnos";

  function getBookingsList() {
    try {
      const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveBookingToStorage(record) {
    try {
      const list = getBookingsList();
      list.push({ ...record, id: Date.now() });
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  window.HuellasTurnos = {
    getBookingsList,
    saveBookingToStorage,
  };
})();
