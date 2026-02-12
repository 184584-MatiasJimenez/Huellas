/**
 * Tests básicos para el módulo de reserva
 */

const initReserva = require("../core/reserva");

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
    document.body.innerHTML = `
      <span id="year"></span>
      <form id="bookingForm">
        <input name="document" id="document" />
        <input name="ownerName" id="ownerName" />
        <input name="phone" id="phone" />
        <input name="email" id="email" />
        <input name="petName" id="petName" />
        <select name="petType" id="petType">
          <option value="">Seleccionar</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
        <select name="serviceId" id="serviceId"></select>
        <select name="professionalType" id="professionalType">
          <option value="">Seleccionar</option>
          <option value="veterinario">Veterinaria</option>
          <option value="estetica">Estética / Baño</option>
        </select>
        <select name="professionalId" id="professionalId"></select>
        <input type="date" name="date" id="date" />
        <select name="time" id="time"></select>
      </form>
      <div id="successBox" class="d-none"></div>
      <p id="successText"></p>
    `;
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

  test("debería exportar init como función", () => {
    expect(typeof initReserva).toBe("function");
  });

  test("debería ejecutarse init sin errores", () => {
    expect(() => initReserva()).not.toThrow();
  });

  test("debería popular el año actual en #year", () => {
    initReserva();
    const yearEl = document.getElementById("year");
    expect(yearEl.textContent).toBe(String(new Date().getFullYear()));
  });

  test("debería popular los slots de horario (9:00 a 17:30)", () => {
    initReserva();
    const timeSelect = document.getElementById("time");
    const options = timeSelect.querySelectorAll("option");
    expect(options.length).toBeGreaterThan(1);
    expect(timeSelect.innerHTML).toContain("09:00");
    expect(timeSelect.innerHTML).toContain("17:30");
  });

  test("debería establecer min y max en el input de fecha", () => {
    initReserva();
    const dateInput = document.getElementById("date");
    expect(dateInput.min).toBeDefined();
    expect(dateInput.max).toBeDefined();
  });

  test("debería popular los servicios en el select #serviceId", () => {
    initReserva();
    const serviceSelect = document.getElementById("serviceId");
    expect(serviceSelect.innerHTML).toContain("Consulta veterinaria");
    expect(serviceSelect.innerHTML).toContain("Baño");
  });

  test("debería incluir opción 'Seleccionar' en el select de servicios", () => {
    initReserva();
    const serviceSelect = document.getElementById("serviceId");
    expect(serviceSelect.innerHTML).toContain("Seleccionar");
  });

  test("debería funcionar cuando Huellas no tiene servicios (array vacío)", () => {
    window.Huellas.services = [];
    initReserva();
    const serviceSelect = document.getElementById("serviceId");
    expect(serviceSelect.innerHTML).toContain("Seleccionar");
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
    expect(savedBookings[0]).toMatchObject({
      document: "12345678",
      ownerName: "María García",
      petName: "Lola",
      petType: "Perro",
      serviceId: "consulta",
      date: validDate,
      time: "10:00",
    });
    expect(savedBookings[0].email).toBe("maria@ejemplo.com");
  });
});