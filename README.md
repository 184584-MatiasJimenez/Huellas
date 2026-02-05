# Huellas - Visualización de servicios (HTML/CSS/JS)

## Cómo ver la web

1. Abrí `index.html` en el navegador.
2. Se renderizan los servicios desde un **array en memoria** en `app.js`.

## Reserva de turno
- Página: `reserva.html`
- Validaciones/horarios: `src/core/reservas.js`
- manejo de la storage: `src/core/turnos.js`
- Datos (servicios/profesionales) en memoria: `src/core/data.js`

## Listado de turnos
- Página: `listaTurnos.html`
- Datos: Los obtiene de la localStorage.

## Backoffice (listado de turnos)

- Página: `listaTurnos.html`
- **Listado de turnos:** Dueño, Mascota, Teléfono, Fecha, Hora, Servicio, Profesional asignado.
- Los turnos se ordenan por fecha más reciente.
- Las reservas hechas en `reserva.html` se guardan en `localStorage` y se listan aquí.

