# Huellas - Visualización de servicios (HTML/CSS/JS)

## Cómo ver la web

1. Abrí `index.html` en el navegador.
2. Se renderizan los servicios desde un **array en memoria** en `app.js`.

## Criterios de aceptación

- Mínimo 4 servicios: ✅ (hay 5)
- Cada servicio tiene nombre, descripción y precio: ✅
- Los datos provienen de un array en memoria: ✅ (`services` en `app.js`)

## Equipo profesional

- Página: `equipo.html`
- Datos en memoria: ✅ (`professionals` en `team.js`)
- Se listan todos los profesionales: ✅
- Cada uno muestra foto, nombre y rol/especialidad: ✅
- Existen profesionales de tipo veterinario y estética/baño: ✅

## Reserva de turno

- Página: `reserva.html`
- Validaciones/horarios: `src/core/turnos.js`
- Datos (servicios/profesionales) en memoria: `src/core/data.js`

## Información de contacto

- Página: `contacto.html`
- Se muestra dirección, teléfono, mail y horarios: ✅
- Se incluye un mapa con la ubicación embebido: ✅ (OpenStreetMap)

## Backoffice (listado de turnos)

- Página: `listaTurnos.html`
- **Listado de turnos:** Dueño, Mascota, Teléfono, Fecha, Hora, Servicio, Profesional asignado.
- Los turnos se ordenan por fecha más reciente.
- Las reservas hechas en `reserva.html` se guardan en `localStorage` y se listan aquí.

