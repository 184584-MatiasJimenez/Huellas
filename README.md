# Huellas - Sistema de Reservas Veterinarias

Proyecto de desarrollo de software para la gestión de reservas veterinarias, construido con tecnologías web modernas y enfocado en la usabilidad y experiencia del usuario.

## 🐾 Descripción del Proyecto

Huellas es una aplicación web que permite a los dueños de mascotas reservar turnos veterinarios y servicios de estética. El sistema incluye autenticación de usuarios, gestión de servicios, profesionales disponibles y un flujo completo de reserva con validaciones.

## 🏗️ Arquitectura del Proyecto

```
Huellas/
├── src/
│   ├── core/                    # Lógica de negocio principal
│   │   ├── login.js            # Autenticación y gestión de sesiones
│   │   ├── reserva.js          # Sistema de reservas y validaciones
│   │   └── validations.js      # Funciones de validación reutilizables
│   ├── test/                    # Suite de tests automatizados
│   │   ├── login.test.js       # Tests del módulo de login
│   │   └── reserva.test.js     # Tests del sistema de reservas
│   └── styles/                  # Estilos CSS
├── assets/                      # Recursos estáticos
├── pages/                       # Páginas HTML
│   ├── login.html              # Página de autenticación
│   ├── register.html           # Registro de usuarios
│   ├── reserva.html            # Formulario de reservas
│   └── index.html              # Página principal
└── data/                       # Datos de prueba y configuración
```

## 🚀 Funcionalidades Principales

### 🔐 Sistema de Autenticación
- Login de usuarios con validación de credenciales
- Registro de nuevos usuarios
- Gestión de sesiones
- Redirección inteligente según el estado del usuario

### 📅 Sistema de Reservas
- Selección de servicios veterinarios y de estética
- Elección de profesionales por especialidad
- Validación de fechas (solo días hábiles)
- Gestión de horarios disponibles
- Confirmación y resumen de reservas

### ✅ Validaciones Implementadas

#### Validaciones de Usuario
- **Documento**: 8 caracteres numéricos obligatorios
- **Nombre**: No puede estar vacío
- **Email**: Formato de email válido
- **Teléfono**: 9-15 caracteres

#### Validaciones de Mascota
- **Nombre**: No puede estar vacío
- **Tipo**: Solo "Perro" o "Gato"

#### Validaciones de Servicio
- **Servicio**: Debe ser uno de los servicios disponibles
- **Tipo de Profesional**: "veterinario" o "estetica"
- **ID de Profesional**: IDs válidos según el tipo
- **Fecha**: Solo días hábiles dentro de los próximos 2 meses
- **Hora**: Dentro del horario laboral (9:00 - 17:00)

## 🧪 Testing

El proyecto incluye una suite completa de tests automatizados utilizando Jest.

### Ejecutar Tests
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
npm run test reserva.test
npm run test login.test

# Modo watch para desarrollo
npm run test:watch
```

### Coverage de Tests
- **29 tests** en total
- Tests de validaciones de todos los campos del formulario
- Tests de integración del flujo completo de reserva
- Tests de autenticación

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** semántico y accesible
- **CSS3** con diseño responsivo
- **JavaScript ES6+** con buenas prácticas
- **Bootstrap** para componentes UI

### Testing
- **Jest** como framework de testing
- **JSDOM** para simulación de DOM en tests
- **Testing de validaciones y flujo de usuario**

### Desarrollo
- **Node.js** y **npm** para gestión de dependencias
- **Git** para control de versiones

## 📋 Estructura de Datos

### Servicios Disponibles
```javascript
services = [
  { id: "corte-pelo", name: "Corte de pelo", professionalType: "estetica" },
  { id: "bano", name: "Baño", professionalType: "estetica" },
  { id: "consulta-veterinaria", name: "Consulta veterinaria", professionalType: "veterinario" },
  { id: "control-general", name: "Control general", professionalType: "veterinario" }
]
```

### Profesionales
```javascript
professionals = [
  { id: "vet-1", name: "Dra. Ana Silva", type: "veterinario" },
  { id: "vet-2", name: "Dr. Martín Rojas", type: "veterinario" },
  { id: "est-1", name: "Sofía Pereyra", type: "estetica" },
  { id: "est-2", name: "Lucas Ferrer", type: "estetica" }
]
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (generalmente incluido con Node.js)

### Instalación
```bash
# Clonar el repositorio
git clone <URL-del-repositorio>
cd Huellas

# Instalar dependencias
npm install

# Ejecutar tests para verificar instalación
npm test
```

### Desarrollo
```bash
# Iniciar modo watch para desarrollo
npm run test:watch

# Ejecutar tests específicos durante desarrollo
npm run test reserva.test
```

## 📱 Flujo de Usuario

### 1. Autenticación
- Usuario ingresa credenciales en `login.html`
- Sistema valida y redirige a página principal

### 2. Reserva
- Usuario completa formulario en `reserva.html`
- Validaciones en tiempo real de todos los campos
- Selección de servicio y profesional
- Confirmación de fecha y hora
- Resumen y confirmación final

### 3. Gestión
- Reservas guardadas en localStorage
- Posibilidad de ver y gestionar turnos

## 🎯 Características Destacadas

### Validaciones Robustas
- Validación en tiempo real de todos los campos
- Mensajes de error claros y específicos
- Prevención de envíos de formulario inválidos

### Experiencia de Usuario
- Interfaz intuitiva y responsiva
- Feedback visual inmediato
- Flujo lógico y sin fricciones

### Calidad del Código
- Tests automatizados con 100% de coverage de validaciones
- Código modular y reutilizable
- Buenas prácticas de JavaScript

## 🔄 Flujo de Trabajo de Desarrollo

1. **Desarrollo de funcionalidad**: Implementar nueva característica
2. **Testing**: Escribir tests para validar la funcionalidad
3. **Validación**: Ejecutar `npm test` para asegurar calidad
4. **Integración**: Verificar que no se rompan funcionalidades existentes

## 📊 Estado del Proyecto

- ✅ Sistema de autenticación completo
- ✅ Sistema de reservas funcional
- ✅ Validaciones implementadas y testeadas
- ✅ Suite de tests completa (29 tests pasando)
- ✅ Documentación técnica

## 🤝 Contribuciones

El proyecto sigue buenas prácticas de desarrollo de software:

- Código limpio y mantenible
- Tests automatizados
- Documentación completa
- Flujo de trabajo profesional

## 📝 Notas Técnicas

### Modularidad
- Separación clara de responsabilidades
- Funciones reutilizables en `validations.js`
- Lógica de negocio aislada del DOM

### Testing
- Tests unitarios para validaciones
- Tests de integración para flujo completo
- Mocking de DOM para aislamiento

### Performance
- Carga eficiente de recursos
- Validaciones optimizadas
- Sin dependencias externas críticas
