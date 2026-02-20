/**
 * Tests básicos para el módulo de reserva
 */

const fs = require("fs");
const path = require("path");
const { init, validateDate, generateTimeSlots } = require("../core/reserva");
const {
  isStringNotEmpty,
  isEmail,
  isProfessionalType,
  isProfessionalId,
  isValidTime,
  isValidPetType,
  isPhoneOk,
  isDocumentValid,
  isValidService,
} = require("../core/validations");

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
  let form, documentInput, ownerName, phone, email, petName, petType, serviceId, date, time, professionalType, professionalId;

  beforeEach(() => {
    loadHtmlFromFile("reserva.html");
    window.Huellas = {
      services: [
        { id: "corte-pelo", name: "Corte de pelo", description: "Corte y estilizado según raza o preferencia.", priceUYU: 800, professionalType: "estetica" },
        { id: "bano", name: "Baño", description: "Baño completo con productos adecuados para tu mascota.", priceUYU: 600, professionalType: "estetica" },
        { id: "consulta-veterinaria", name: "Consulta veterinaria", description: "Revisión clínica y diagnóstico por profesional.", priceUYU: 1200, professionalType: "veterinario" },
        { id: "control-general", name: "Control general", description: "Control de peso, vacunas y desparasitación.", priceUYU: 900, professionalType: "veterinario" },
      ],
      professionals: [
        { id: "vet-1", name: "Dra. Ana Silva", type: "veterinario", role: "Clínica", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop" },
        { id: "vet-2", name: "Dr. Martín Rojas", type: "veterinario", role: "Clínica", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" },
        { id: "vet-3", name: "Dra. Carla Méndez", type: "veterinario", role: "Clínica", photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop" },
        { id: "est-1", name: "Sofía Pereyra", type: "estetica", role: "Estilista", photo: "https://www.cimformacion.com/blog/wp-content/uploads/2020/09/peluquera-seca-perro.jpg" },
        { id: "est-2", name: "Lucas Ferrer", type: "estetica", role: "Estilista", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" },
      ],
    };

    init();

    form = document.getElementById("bookingForm");
    form.scrollIntoView = () => {};

    documentInput = form.querySelector('input[name="document"]');
    ownerName = form.querySelector('input[name="ownerName"]');
    phone = form.querySelector('input[name="phone"]');
    email = form.querySelector('input[name="email"]');
    petName = form.querySelector('input[name="petName"]');
    petType = form.querySelector('select[name="petType"]');
    serviceId = form.querySelector('select[name="serviceId"]');
    date = form.querySelector('input[name="date"]');
    time = form.querySelector('select[name="time"]');
    professionalType = form.querySelector('select[name="professionalType"]');
    professionalId = form.querySelector('select[name="professionalId"]');
  });

  afterEach(() => {
    delete window.Huellas;
    delete window.HuellasTurnos;
  });

  test("Debería agregar la reserva correctamente al confirmar el formulario", () => {
    const savedBookings = [];
    window.HuellasTurnos = {
      saveBookingToStorage: (booking) => savedBookings.push(booking),
    };

    const validDate = getValidWeekdayDate();

    documentInput.value = "12345678";
    ownerName.value = "María García";
    phone.value = "099123456";
    email.value = "maria@ejemplo.com";
    petName.value = "Lola";
    petType.value = "Perro";
    serviceId.value = "bano";
    serviceId.dispatchEvent(new Event("change", { bubbles: true }));
    date.value = validDate;
    time.value = "10:00";

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(savedBookings).toHaveLength(1);
  });

  //DOCUMENTO
  test("El documento tiene menos de 8 caracteres", () => {
    documentInput.value = "1234";
    expect(isDocumentValid(documentInput.value)).toBe(false);
  });

  test("El documento tiene mas de 8 caracteres", () => {
    documentInput.value = "123456789";
    expect(isDocumentValid(documentInput.value)).toBe(false);
  });

  test("El documento tiene caracteres numericos", () => {
    documentInput.value = 1234567;
    expect(isDocumentValid(documentInput.value)).toBe(false);
  });
  
  test("El documento es valido", () => {
    documentInput.value = "12345678";
    expect(isDocumentValid(documentInput.value)).toBe(true);
  });


  //NOMBRE DUEÑO
  test("El input del nombre del dueño es valido", () => {
    ownerName.value = "María García";
    expect(isStringNotEmpty(ownerName.value)).toBe(true);
  });

  test("El input del nombre del dueño no es valido", () => {
    ownerName.value = "";
    expect(isStringNotEmpty(ownerName.value)).toBe(false);
  });

  //NOMBRE MASCOTA
  test("El input del nombre de la mascota es valido", () => {
    petName.value = "Lola";
    expect(isStringNotEmpty(petName.value)).toBe(true);
  });

  test("El input del nombre de la mascota no es valido", () => {
    petName.value = "";
    expect(isStringNotEmpty(petName.value)).toBe(false);
  });

  //TIPO DE MASCOTA
  test("El input del tipo de mascota es perro", () => {
    petType.value = "Perro";
    expect(isValidPetType(petType.value)).toBe(true);
  });

   test("El input del tipo de mascota es gato", () => {
    petType.value = "Gato";
    expect(isValidPetType(petType.value)).toBe(true);
  });

  test("El input del tipo de mascota no es caballo", () => {
    petType.value = "Caballo";
    expect(isValidPetType(petType.value)).toBe(false);
  });

  //NUMERO TELEFONO
  test("El input del numero de telefono es valido", () => {
    phone.value = '099123456';
    expect(isPhoneOk(phone.value)).toBe(true);
  });

  test("El input del numero de telefono no es valido", () => {
    phone.value = "126789";
    expect(isPhoneOk(phone.value)).toBe(false);
  });

  //EMAIL
  test("El input del email es valido", () => {
    email.value = "maria@gmail.com";
    expect(isEmail(email.value)).toBe(true);
  });

  test("El input del email no es valido", () => {
    email.value = "maria@";
    expect(isEmail(email.value)).toBe(false);
  });

  //SERVICE
  test("El input del service es corte de pelo", () => {
    serviceId.value = "corte-pelo";
    serviceId.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isValidService(serviceId.value)).toBe(true);
  });

  test("El input del service no es valido", () => {
    serviceId.value = "cirugia";
    serviceId.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isValidService(serviceId.value)).toBe(false);
  });

  //TIPO PROFESIONAL
  test("El input del tipo de profesional es veterinario", () => {
    professionalType.disabled = false;
    professionalType.value = "veterinario";
    professionalType.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isProfessionalType(professionalType.value)).toBe(true);
  });

  test("El input del tipo de profesional es estetica", () => {
    professionalType.disabled = false;
    professionalType.value = "estetica";
    professionalType.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isProfessionalType(professionalType.value)).toBe(true);
  });

  test("El input del tipo de profesional no es psicologo", () => {
    professionalType.disabled = false;
    professionalType.value = "psicologo";
    professionalType.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isProfessionalType(professionalType.value)).toBe(false);
  });

   // PROFESIONAL ID
  test("El input del profesional id es vet-1", () => {
    serviceId.value = "consulta-veterinaria";
    serviceId.dispatchEvent(new Event("change", { bubbles: true }));
    
    professionalId.value = "vet-1";
    professionalId.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isProfessionalId(professionalId.value)).toBe(true);
  });

  test("El input del profesional id es est-1", () => {
    serviceId.value = "corte-pelo";
    serviceId.dispatchEvent(new Event("change", { bubbles: true }));
    
    professionalId.value = "est-1";
    professionalId.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isProfessionalId(professionalId.value)).toBe(true);
  });

  test("El input del profesional id no es psicologo", () => {
    professionalId.value = "psy-1";
    professionalId.dispatchEvent(new Event("change", { bubbles: true }));
    expect(isProfessionalId(professionalId.value)).toBe(false);
  });


  //FECHA
  test("El input de la fecha es valida", () => {
     const validDate = getValidWeekdayDate();
    date.value = validDate;
    expect(validateDate(date.value)).toBe(true);
  });

  test("El input de la fecha no es valida", () => {
    date.value = "2026-10-20";
    expect(validateDate(date.value)).toBe(false);
  });

  //HORA
  test("El input de la hora es valida", () => {
    time.value = "10:00";
    expect(isValidTime(time.value)).toBe(true);
  });

  test("El input de la hora no es valida", () => {
    time.value = "25:00";
    expect(isValidTime(time.value)).toBe(false);
  });
});