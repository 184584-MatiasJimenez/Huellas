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
    { id: "vet-1", name: "Dra. Ana Silva", type: "veterinario", role: "Clínica", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop" },
    { id: "vet-2", name: "Dr. Martín Rojas", type: "veterinario", role: "Clínica", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" },
    { id: "vet-3", name: "Dra. Carla Méndez", type: "veterinario", role: "Clínica", photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop" },
    { id: "est-1", name: "Sofía Pereyra", type: "estetica", role: "Estilista", photo: "https://www.cimformacion.com/blog/wp-content/uploads/2020/09/peluquera-seca-perro.jpg" },
    { id: "est-2", name: "Lucas Ferrer", type: "estetica", role: "Estilista", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" },
  ];

  window.Huellas = {
    services,
    professionals,
  };
})();
