const $ = (selector) => document.querySelector(selector);

const BOOKINGS_STORAGE_KEY = "huellas_turnos";

function saveBookingToStorage(record) {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...record, id: Date.now() });
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toLocalISODate(d) {
  // YYYY-MM-DD en zona local
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function addMonthsClampDay(date, monthsToAdd) {
  // Mantiene el día lo mejor posible (si no existe en el mes destino, clampa)
  const d = new Date(date.getTime());
  const targetMonth = d.getMonth() + monthsToAdd;
  const target = new Date(d.getFullYear(), targetMonth, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d.getDate(), lastDay));
  return target;
}

function isWeekday(dateObj) {
  const day = dateObj.getDay(); // 0 dom ... 6 sáb
  return day >= 1 && day <= 5;
}

function generateTimeSlots() {
  // Turnos de 30 minutos, de 09:00 a 18:00
  // Último inicio: 17:30 (para terminar a 18:00)
  const slots = [];
  for (let h = 9; h <= 17; h += 1) {
    slots.push(`${pad2(h)}:00`);
    slots.push(`${pad2(h)}:30`);
  }
  return slots;
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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
  // Simple y suficiente para el criterio: formato válido
  const value = String(email || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isValidUyPrefixPhone(phone) {
  const value = String(phone || "").trim();
  return value.startsWith("+598");
}

function populateServices() {
  const services = window.Huellas?.services || [];
  const select = $("#serviceId");
  if (!select) return;

  const options = ['<option value="" selected>Seleccionar</option>']
    .concat(
      services.map((s) => {
        return `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`;
      }),
    )
    .join("");

  select.innerHTML = options;
}

function populateProfessionalsByType(type) {
  const select = $("#professionalId");
  if (!select) return;

  const professionals = window.Huellas?.professionals || [];
  const filtered = professionals.filter((p) => p.type === type);

  const options = ['<option value="" selected>Sin preferencia</option>']
    .concat(
      filtered.map((p) => {
        return `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} — ${escapeHtml(p.role)}</option>`;
      }),
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
  const petNameOk = Boolean(petName?.value.trim());
  const petTypeOk = ["Perro", "Gato"].includes(petType?.value);
  const phoneOk = isValidUyPrefixPhone(phone?.value);
  const emailOk = isValidEmail(email?.value);
  const serviceOk = Boolean(serviceId?.value);
  const profTypeOk = ["veterinario", "estetica"].includes(professionalType?.value);
  const dateOk = validateDate(date?.value);
  const timeOk = Boolean(time?.value) && generateTimeSlots().includes(time?.value);

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
  const services = window.Huellas?.services || [];
  const professionals = window.Huellas?.professionals || [];

  const service = services.find((s) => s.id === values.serviceId);
  const professional = professionals.find((p) => p.id === values.professionalId);

  const serviceLabel = service ? service.name : values.serviceId;
  const profLabel = professional ? professional.name : "Sin preferencia";
  const areaLabel = values.professionalType === "estetica" ? "Estética / Baño" : "Veterinaria";

  return `${escapeHtml(values.ownerName)} reservó para ${escapeHtml(values.petName)} (${escapeHtml(values.petType)}). Servicio: ${escapeHtml(
    serviceLabel,
  )}. Área: ${escapeHtml(areaLabel)}. Profesional: ${escapeHtml(profLabel)}. Fecha y hora: ${escapeHtml(
    values.date,
  )} ${escapeHtml(values.time)}.`;
}

function init() {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  populateServices();
  populateTimeSlots();
  setDateBounds();

  const professionalType = $("#professionalType");
  const date = $("#date");
  const form = $("#bookingForm");
  const successBox = $("#successBox");
  const successText = $("#successText");

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
      // feedback inmediato si eligen fin de semana o fuera de rango
      if (date.value) {
        markInvalid(date, !validateDate(date.value));
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (successBox) successBox.classList.add("d-none");

      const ok = validateForm();
      if (!ok) return;

      const values = Object.fromEntries(new FormData(form).entries());

      const services = window.Huellas?.services || [];
      const professionals = window.Huellas?.professionals || [];
      const service = services.find((s) => s.id === values.serviceId);
      const professional = professionals.find((p) => p.id === values.professionalId);
      const serviceName = service ? service.name : values.serviceId;
      const professionalName = professional ? professional.name : "";

      saveBookingToStorage({
        ownerName: values.ownerName.trim(),
        petName: values.petName.trim(),
        phone: values.phone.trim(),
        date: values.date,
        time: values.time,
        serviceName,
        professionalName: professionalName || null,
      });

      if (successText) successText.textContent = summarizeBooking(values);
      if (successBox) successBox.classList.remove("d-none");

      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    form.addEventListener("reset", () => {
      // Limpiar estados visuales
      const fields = form.querySelectorAll(".is-valid, .is-invalid");
      fields.forEach((el) => el.classList.remove("is-valid", "is-invalid"));
      if (successBox) successBox.classList.add("d-none");
      populateServices();
      populateTimeSlots();
      setDateBounds();
      const profType = $("#professionalType");
      if (profType) profType.value = "";
      populateProfessionalsByType("__none__");
    });
  }

  // Estado inicial
  populateProfessionalsByType("__none__");
}

init();

