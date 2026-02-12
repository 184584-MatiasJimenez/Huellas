/**
 * Tests básicos para el módulo de reserva
 */

const fs = require("fs");
const path = require("path");
const initReserva = require("../core/reserva");

function loadHtmlFromFile(fileName) {
  const filePath = path.resolve(__dirname, "..", "..", fileName);
  const html = fs.readFileSync(filePath, "utf8");
  document.documentElement.innerHTML = html;
}

/** Retorna una fecha válida: próximo día hábil (Lun-Vie) dentro de 2 meses */
function getValidWeekdayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 60; i++) {
    const day = d.getDay();
    if (day >= 1 && day <= 5) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dayNum = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dayNum}`;
    }
    d.setDate(d.getDate() + 1);
  }
  return "";
}

describe("Reserva", () => {
  beforeEach(() => {
    loadHtmlFromFile("reserva.html");
    window.Huellas = {
      services: [
        { id: "consulta", name: "Consulta veterinaria", professionalType: "veterinario" },
        { id: "banio", name: "Baño", professionalType: "estetica" },
      ],
      professionals: [
        { id: "prof1", name: "Dr. Pérez", type: "veterinario", role: "Veterinario" },
        { id: "prof2", name: "María López", type: "estetica", role: "Esteticista" },
      ],
    };
  });

  afterEach(() => {
    delete window.Huellas;
    delete window.HuellasTurnos;
  });

  test("debería agregar la reserva correctamente al confirmar el formulario", () => {
    const savedBookings = [];
    window.HuellasTurnos = {
      saveBookingToStorage: (booking) => savedBookings.push(booking),
    };

    initReserva();

    const validDate = getValidWeekdayDate();
    const form = document.getElementById("bookingForm");
    form.scrollIntoView = () => {};

    const documentInput = form.querySelector('input[name="document"]');
    const ownerName = form.querySelector('input[name="ownerName"]');
    const phone = form.querySelector('input[name="phone"]');
    const email = form.querySelector('input[name="email"]');
    const petName = form.querySelector('input[name="petName"]');
    const petType = form.querySelector('select[name="petType"]');
    const serviceId = form.querySelector('select[name="serviceId"]');
    const date = form.querySelector('input[name="date"]');
    const time = form.querySelector('select[name="time"]');

    documentInput.value = "12345678";
    ownerName.value = "María García";
    phone.value = "099123456";
    email.value = "maria@ejemplo.com";
    petName.value = "Lola";
    petType.value = "Perro";
    serviceId.value = "consulta";
    serviceId.dispatchEvent(new Event("change", { bubbles: true }));
    date.value = validDate;
    time.value = "10:00";

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(savedBookings).toHaveLength(1);
  });
});