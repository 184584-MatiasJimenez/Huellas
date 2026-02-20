/**
 * Lógica de la página de reserva: formulario, validación, populado de selects,
 * mensaje de éxito. Al confirmar, construye el objeto y lo guarda vía HuellasTurnos.
 */
(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const services = () => window.Huellas?.services || [];
  const professionals = () => window.Huellas?.professionals || [];

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toLocalISODate(d) {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return `${y}-${m}-${day}`;
  }

  function addMonthsClampDay(date, monthsToAdd) {
    const d = new Date(date.getTime());
    const targetMonth = d.getMonth() + monthsToAdd;
    const target = new Date(d.getFullYear(), targetMonth, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(d.getDate(), lastDay));
    return target;
  }

  function isWeekday(dateObj) {
    const day = dateObj.getDay();
    return day >= 1 && day <= 5;
  }

  function generateTimeSlots() {
    const slots = [];
    for (let h = 9; h <= 17; h += 1) {
      slots.push(`${pad2(h)}:00`);
      slots.push(`${pad2(h)}:30`);
    }
    return slots;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function isValidEmail(email) {
    const value = String(email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function mapFormToReserva(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const svc = services().find((s) => s.id === values.serviceId);
    const prof = professionals().find((p) => p.id === values.professionalId);
    const serviceName = svc ? svc.name : values.serviceId;
    const professionalName = prof ? prof.name : null;

    return {
      document: (values.document || "").trim(),
      ownerName: (values.ownerName || "").trim(),
      phone: ('+598' + values.phone || "").trim(),
      email: (values.email || "").trim(),
      petName: (values.petName || "").trim(),
      petType: values.petType || "",
      serviceId: values.serviceId || "",
      serviceName: serviceName || "",
      professionalType: values.professionalType || "",
      professionalId: values.professionalId || "",
      professionalName: professionalName,
      date: values.date || "",
      time: values.time || "",
    };
  }

  function populateServices() {
    const select = $("#serviceId");
    if (!select) return;
    const list = services();
    const options = ['<option value="" selected>Seleccionar</option>']
      .concat(list.map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`))
      .join("");
    select.innerHTML = options;
  }

  function populateProfessionalsByType(type) {
    const select = $("#professionalId");
    if (!select) return;
    const filtered = professionals().filter((p) => p.type === type);
    const options = ['<option value="" selected>Sin preferencia</option>']
      .concat(
        filtered.map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} — ${escapeHtml(p.role)}</option>`)
      )
      .join("");
    select.innerHTML = options;
  }

  function populateTimeSlots() {
    const select = $("#time");
    if (!select) return;
    const slots = generateTimeSlots();
    select.innerHTML = ['<option value="" selected>Seleccionar</option>']
      .concat(slots.map((t) => `<option value="${t}">${t}</option>`))
      .join("");
  }

  function setDateBounds() {
    const dateInput = $("#date");
    if (!dateInput) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const max = addMonthsClampDay(today, 2);
    dateInput.min = toLocalISODate(today);
    dateInput.max = toLocalISODate(max);
  }

  function markInvalid(el, invalid) {
    if (!el) return;
    el.classList.toggle("is-invalid", invalid);
    el.classList.toggle("is-valid", !invalid);
  }

  function validateDate(dateStr) {
    if (!dateStr) return false;
    const [y, m, d] = dateStr.split("-").map((x) => Number(x));
    const chosen = new Date(y, m - 1, d);
    chosen.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const max = addMonthsClampDay(today, 2);
    max.setHours(0, 0, 0, 0);
    if (chosen < today) return false;
    if (chosen > max) return false;
    if (!isWeekday(chosen)) return false;
    return true;
  }

  function validateForm() {
    const document = $("#document");
    const ownerName = $("#ownerName");
    const phone = $("#phone");
    const email = $("#email");
    const petName = $("#petName");
    const petType = $("#petType");
    const serviceId = $("#serviceId");
    const professionalType = $("#professionalType");
    const date = $("#date");
    const time = $("#time");

    const ownerOk = Boolean(ownerName?.value.trim());
    const documentOk = Boolean(document?.value.trim());
    const petNameOk = Boolean(petName?.value.trim());
    const petTypeOk = ["Perro", "Gato"].includes(petType?.value);
    const phoneOk = Boolean(phone?.value.trim());
    const emailOk = isValidEmail(email?.value);
    const serviceOk = Boolean(serviceId?.value);
    const profTypeOk = ["veterinario", "estetica"].includes(professionalType?.value);
    const dateOk = validateDate(date?.value);
    const timeOk = Boolean(time?.value) && generateTimeSlots().includes(time?.value);

    markInvalid(document, !documentOk);
    markInvalid(ownerName, !ownerOk);
    markInvalid(petName, !petNameOk);
    markInvalid(petType, !petTypeOk);
    markInvalid(phone, !phoneOk);
    markInvalid(email, !emailOk);
    markInvalid(serviceId, !serviceOk);
    markInvalid(professionalType, !profTypeOk);
    markInvalid(date, !dateOk);
    markInvalid(time, !timeOk);

    return (
      documentOk &&
      ownerOk &&
      petNameOk &&
      petTypeOk &&
      phoneOk &&
      emailOk &&
      serviceOk &&
      profTypeOk &&
      dateOk &&
      timeOk
    );
  }

  function summarizeBooking(values) {
    const svc = services().find((s) => s.id === values.serviceId);
    const prof = professionals().find((p) => p.id === values.professionalId);
    const serviceLabel = svc ? svc.name : values.serviceId;
    const profLabel = prof ? prof.name : "Sin preferencia";
    const areaLabel = values.professionalType === "estetica" ? "Estética / Baño" : "Veterinaria";
    return `${escapeHtml(values.ownerName)} con documento ${escapeHtml(values.document)} reservó para ${escapeHtml(values.petName)} (${escapeHtml(values.petType)}). Servicio: ${escapeHtml(serviceLabel)}. Área: ${escapeHtml(areaLabel)}. Profesional: ${escapeHtml(profLabel)}. Fecha y hora: ${escapeHtml(values.date)} ${escapeHtml(values.time)}.`;
  }

  function init() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    populateServices();
    populateTimeSlots();
    setDateBounds();

    const serviceId = $("#serviceId");
    const professionalType = $("#professionalType");
    const date = $("#date");
    const form = $("#bookingForm");
    const successBox = $("#successBox");
    const successText = $("#successText");

    if (serviceId) {
      serviceId.addEventListener("change", () => {
        const svc = services().find((s) => s.id === serviceId.value);
        if (svc && svc.professionalType) {
          if (professionalType) {
            professionalType.value = svc.professionalType;
            professionalType.disabled = true
            populateProfessionalsByType(svc.professionalType);
          }
        } else if (professionalType) {
          professionalType.value = "";
          populateProfessionalsByType("__none__");
        }
      });
    }

    if (professionalType) {
      professionalType.addEventListener("change", () => {
        if (["veterinario", "estetica"].includes(professionalType.value)) {
          populateProfessionalsByType(professionalType.value);
        } else {
          populateProfessionalsByType("__none__");
        }
      });
    }

    if (date) {
      date.addEventListener("change", () => {
        if (date.value) markInvalid(date, !validateDate(date.value));
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (successBox) successBox.classList.add("d-none");
        if (!validateForm()) return;

        const reserva = mapFormToReserva(form);
        if (window.HuellasTurnos) window.HuellasTurnos.saveBookingToStorage(reserva);

        if (successText) successText.textContent = summarizeBooking(reserva);
        if (successBox) successBox.classList.remove("d-none");
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      form.addEventListener("reset", () => {
        form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => el.classList.remove("is-valid", "is-invalid"));
        if (successBox) successBox.classList.add("d-none");
        populateServices();
        populateTimeSlots();
        setDateBounds();
        const profType = $("#professionalType");
        if (profType) {
          profType.value = "";
          profType.disabled = false;
        }
        populateProfessionalsByType("__none__");
      });
    }

    populateProfessionalsByType("__none__");

    const params = new URLSearchParams(window.location.search);
    const servicioId = params.get("servicio");
    const profesionalId = params.get("profesional");

    if (servicioId && serviceId) {
      const svc = services().find((s) => s.id === servicioId);
      if (svc) {
        serviceId.value = svc.id;
        if (svc.professionalType && professionalType) {
          professionalType.value = svc.professionalType;
          professionalType.disabled = true;
          populateProfessionalsByType(svc.professionalType);
        }
      }
    }

    if (profesionalId) {
      const prof = professionals().find((p) => p.id === profesionalId);
      if (prof && professionalType) {
        professionalType.value = prof.type;
        professionalType.disabled = true;
        populateProfessionalsByType(prof.type);
        const proSelect = $("#professionalId");
        if (proSelect) proSelect.value = prof.id;
      }
    }
  }

  init();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {init, validateDate, generateTimeSlots};
  }
  
  if (typeof window !== 'undefined') {
    window.initReserva = init;
    window.validateDate = validateDate;
  }
})();