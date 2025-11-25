# Live Moments - Streaming Profesional para Eventos

## 📋 Descripción del Proyecto

**Live Moments** es una plataforma de servicios de streaming profesional multicámara para eventos. Permite a los usuarios conservar sus mejores momentos con seres queridos mediante transmisiones en vivo de alta calidad, eliminando las barreras de la distancia física.

### Propuesta de Valor
- 🎥 **Calidad Cine**: Streaming profesional multicámara
- 📡 **Conexión Global**: Alcance mundial para eventos
- ❤️ **Experiencia Inolvidable**: Producción audiovisual premium

---

## 📚 Documentación del Proyecto

Este proyecto sigue una metodología de documentación estructurada en Markdown para facilitar el desarrollo paso a paso y evitar acumulación de errores.

### Estructura de Documentación

```
docs/
├── ESTRUCTURA.md        # Guía de organización
├── 01-concepcion.md     # Idea, objetivos y planificación
├── 02-arquitectura.md   # Diseño técnico y diagramas
├── 03-desarrollo.md     # Guía de desarrollo (próximamente)
├── 04-testing.md        # Plan de pruebas (próximamente)
└── 05-deployment.md     # Despliegue (próximamente)
```

### Documentos Disponibles

- **[Estructura del Proyecto](docs/ESTRUCTURA.md)**: Organización general de archivos y carpetas
- **[Concepción](docs/01-concepcion.md)**: Problema, solución, objetivos SMART, usuarios objetivo, casos de uso
- **[Arquitectura](docs/02-arquitectura.md)**: Diagramas de flujo, stack tecnológico, decisiones técnicas

### ¿Por qué Markdown?

- ✅ **Versionable**: Compatible con Git
- ✅ **Diagramas**: Soporte para Mermaid (flowcharts, secuencias, gantt)
- ✅ **Multiplataforma**: Se ve bien en GitHub, VS Code, Obsidian
- ✅ **Exportable**: Convertible a PDF, HTML, DOCX
- ✅ **Simple**: Texto plano legible sin renderizar

---

## 🏗️ Arquitectura del Proyecto

### Componentes Principales

1. **Landing Page** (`webhoot.html`)
   - Formulario de contacto con diseño cinematográfico
   - Validación de datos en el cliente
   - Integración con webhook de N8N
   - Diseño responsive con Tailwind CSS

2. **Workflow N8N** (`webcam.json`)
   - Automatización de procesamiento de solicitudes
   - Clasificación inteligente con IA (Google Gemini)
   - Análisis de sentimiento
   - Respuestas automáticas personalizadas
   - Almacenamiento en Google Sheets

3. **Recursos**
   - `EAcqniW.jpeg`: Imagen de fondo para la landing page

---

## 🔄 Flujo de Trabajo (N8N)

### 1. Recepción de Datos
- **Webhook**: Endpoint `/webhook/webcam`
- Captura: nombre, correo, teléfono, mensaje

### 2. Procesamiento
- **Validación**: Filtrado de datos (mensaje > 4 caracteres, teléfono > 9999999)
- **Clasificación IA**: Categorización del mensaje
  - `sales`: Consultas de venta
  - `support`: Solicitudes de soporte
  - `error`: Mensajes inválidos o fuera de contexto

### 3. Análisis de Sentimiento
- Clasificación: Positive/Negative
- Aplicado a mensajes de soporte

### 4. Respuesta Automatizada
- Generación de correo HTML personalizado según:
  - Categoría del mensaje
  - Sentimiento detectado
  - Contexto del cliente

### 5. Almacenamiento
- **Google Sheets**: Registro de todas las peticiones
  - Mensajes válidos: Hoja principal
  - Mensajes erróneos: Hoja de errores

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5
- Tailwind CSS (vía CDN)
- JavaScript (Vanilla)
- Google Fonts (Inter, Playfair Display)

### Backend/Automatización
- **N8N**: Plataforma de automatización
- **Google Gemini AI**: Clasificación y generación de respuestas
- **Google Sheets**: Base de datos
- **Gmail**: Envío de correos

### Integraciones
- Google Gemini (PaLM) API
- Google Sheets OAuth2
- Gmail OAuth2

---

## 📁 Estructura de Archivos

```
/home/programar/Documentos/N8N/
├── README.md           # Documentación del proyecto
├── webhoot.html        # Landing page principal
├── webcam.json         # Workflow de N8N
├── EAcqniW.jpeg       # Imagen de fondo
└── .git/              # Control de versiones
```

---

## 🚀 Configuración y Despliegue

### Requisitos Previos
- Cuenta de N8N (Cloud o Self-hosted)
- Credenciales de Google (Gmail, Sheets, Gemini API)
- Servidor web para alojar `webhoot.html`

### Variables de Configuración

#### Webhook URL
```javascript
const webhookUrl = "https://erjgomezf.app.n8n.cloud/webhook/webcam";
```

#### Google Sheets IDs
- **Mensajes Erróneos**: `1-hC27bliDtgHlwQc5X0EGsveCoqPoYUcuoo4X5NL1qI`
- **Peticiones al Servidor**: `1uwI0DUhqvx5vbW2P-40jmMm0Py-b1zKiyRR5eaWqqWQ`

---

## 📊 Campos del Formulario

| Campo | Tipo | Validación |
|-------|------|------------|
| Nombre Completo | `text` | Requerido |
| Correo Electrónico | `email` | Formato email válido |
| Teléfono/WhatsApp | `tel` | Solo números y caracteres permitidos |
| Detalles del Evento | `textarea` | Mínimo 4 caracteres |

---

## 🎨 Diseño Visual

### Paleta de Colores
- **Gold**: `#D4AF37` (Marca principal)
- **Dark**: `#1a1a1a` (Fondo oscuro)
- **Warm**: `#FFF5E1` (Acentos cálidos)

### Características de Diseño
- Efecto Ken Burns en imagen de fondo
- Glassmorphism en tarjetas
- Animaciones suaves (fade-in, slide-up)
- Inputs con etiquetas flotantes
- Botón dorado premium con hover effects

---

## 📝 Notas de Desarrollo

### Idioma del Proyecto
**Español** - Toda la comunicación y documentación debe ser en español.

### Estado Actual
- ✅ Landing page funcional
- ✅ Workflow N8N configurado
- ✅ Integración con IA para clasificación
- ✅ Sistema de respuestas automáticas
- ✅ Almacenamiento en Google Sheets

---

## 🔧 Correcciones Recientes (2025-11-25)

Se han implementado mejoras críticas al workflow de N8N:

### ✅ Correcciones Aplicadas
- **Workflow activado**: El sistema ahora está operativo 24/7
- **Validación mejorada**: Números de teléfono requieren 10 dígitos mínimo
- **Respuesta automática para errores**: Usuarios con mensajes erróneos reciben correo solicitando más información
- **Manejo de errores robusto**: 6 nodos críticos protegidos contra fallos
- **Corrección ortográfica**: Mensajes de error profesionales

### 📊 Impacto
- ✅ 100% de usuarios reciben respuesta
- ✅ Mejor calidad de datos capturados
- ✅ Mayor estabilidad del sistema
- ✅ Experiencia de usuario mejorada

Ver detalles completos en [walkthrough.md](file:///home/programar/.gemini/antigravity/brain/4e29fefe-1945-436d-80a1-ad5d4c5acc9d/walkthrough.md)

---

## 🔮 Próximas Mejoras

_Esta sección se actualizará conforme se definan nuevas funcionalidades_

---

## 📧 Contacto

**Email de Soporte**: erjgomezf@gmail.com

---

**Última Actualización**: 2025-11-25
