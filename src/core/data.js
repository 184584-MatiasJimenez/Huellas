/**
 * Toda la información precargada de Huellas.
 * Servicios, profesionales y datos compartidos entre index, reserva y listaTurnos.
 */
(function () {
  "use strict";

  const services = [
    { id: "corte-pelo", name: "Corte de pelo", description: "Corte y estilizado según raza o preferencia.", priceUYU: 800, professionalType: "estetica" },
    { id: "bano", name: "Baño", description: "Baño completo con productos adecuados para tu mascota.", priceUYU: 600, professionalType: "estetica" },
    { id: "consulta-veterinaria", name: "Consulta veterinaria", description: "Revisión clínica y diagnóstico por profesional.", priceUYU: 1200, professionalType: "veterinario" },
    { id: "control-general", name: "Control general", description: "Control de peso, vacunas y desparasitación.", priceUYU: 900, professionalType: "veterinario" },
  ];

  const professionals = [
    { id: "vet-1", name: "Dra. Ana Silva", type: "veterinario", role: "Clínica" },
    { id: "vet-2", name: "Dr. Martín Rojas", type: "veterinario", role: "Clínica" },
    { id: "vet-3", name: "Dra. Carla Méndez", type: "veterinario", role: "Clínica" },
    { id: "est-1", name: "Sofía Pereyra", type: "estetica", role: "Estilista" },
    { id: "est-2", name: "Lucas Ferrer", type: "estetica", role: "Estilista" },
  ];

  window.Huellas = {
    services,
    professionals,
  };
})();
