# 🎬 Live Moments - Sistema de Captura de Leads

Sistema automatizado de captura y procesamiento de solicitudes de servicios de streaming para eventos, implementado con N8N y formulario web interactivo.

---

## 📋 Descripción

Este proyecto es un sistema completo de captura de leads que incluye:
- Formulario web multi-paso con validación en tiempo real
- Workflow automatizado en N8N para procesamiento de datos
- Integración con Gmail, Google Sheets y Telegram
- Clasificación automática de urgencia según criterios de negocio

---

## ✨ Características Principales

### 🎯 Formulario Web
- **Wizard de 4 pasos** con indicador de progreso
- **Campos dinámicos** según tipo de evento
- **Validación en tiempo real** con feedback visual
- **Diseño responsive** con glassmorphism
- **Fondos dinámicos** que cambian según el evento

### 🤖 Workflow N8N
- **Cálculo automático** de días hasta el evento
- **Clasificación de urgencia** (Alta 🔴, Media 🟡, Normal 🟢)
- **Validación de datos** en backend
- **Bifurcación inteligente** (datos válidos vs inválidos)
- **Registro en Google Sheets** (solicitudes y errores)
- **Notificaciones por Gmail y Telegram**

---

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** N8N (Workflow Automation)
- **Integraciones:**
  - Gmail API (Envío de correos)
  - Google Sheets API (Almacenamiento)
  - Telegram Bot API (Notificaciones)
- **Infraestructura:** Docker, Cloudflare Tunnel

---

## 📁 Estructura del Proyecto

```
N8N/
├── formulario.html              # Formulario web principal
├── workflow_streaming.json      # Workflow de N8N (exportado)
├── SCRIPTS_N8N.md              # Scripts JavaScript para nodos
├── GUIA_SCRIPTS.md             # Guía de uso de scripts
├── GUIA_GMAIL_OAUTH.md         # Configuración de Gmail
├── GUIA_TELEGRAM.md            # Configuración de Telegram
├── README.md                   # Este archivo
├── ROADMAP.md                  # Planificación futura
├── docs/
│   ├── DISEÑO_WORKFLOW.md      # Diseño completo del workflow
│   ├── PAYLOADS_PRUEBA.md      # Ejemplos para testing
│   ├── RECURSOS_IMG.md         # URLs de imágenes
│   └── TEMPLATE_EMAIL_ERROR.md # Template de email de error
├── buenas-practicas/
│   ├── buenas-practicas.md
│   ├── buenas-practicas-n8n.md
│   ├── buenas-practicas-javascript.md
│   └── buenas-practicas-python.md
├── img/                        # Imágenes del formulario
├── start-n8n.sh               # Script para iniciar N8N
├── stop-n8n.sh                # Script para detener N8N
└── expose-n8n.sh              # Script para exponer con Cloudflare
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker instalado
- Cloudflared instalado (para desarrollo local)
- Cuenta de Google (para Gmail y Sheets)
- Bot de Telegram creado

### 1. Iniciar N8N Local

```bash
# Terminal 1: Iniciar N8N
./start-n8n.sh

# Terminal 2: Exponer con Cloudflare Tunnel
./expose-n8n.sh
```

### 2. Configurar Credenciales

Sigue las guías de configuración:
- [Gmail OAuth](GUIA_GMAIL_OAUTH.md)
- [Telegram Bot](GUIA_TELEGRAM.md)

### 3. Importar Workflow

1. Abre N8N en `http://localhost:5678`
2. Importa `workflow_streaming.json`
3. Configura las credenciales en cada nodo

### 4. Actualizar URL del Webhook

Copia la URL del Cloudflare Tunnel y actualízala en `formulario.html`:

```javascript
const webhookUrl = 'https://tu-url.trycloudflare.com/webhook-test/streaming-service';
```

### 5. Probar el Formulario

Abre `formulario.html` en tu navegador y envía una solicitud de prueba.

---

## 📊 Flujo del Workflow

```
Webhook
  ↓
Calcular Días Restantes
  ↓
Clasificar Urgencia
  ↓
Validar Datos
  ↓
IF (¿Datos Válidos?)
  ├─ TRUE → Gmail (Confirmación) + Sheets (Registro) + Telegram (Notificación)
  └─ FALSE → Gmail (Error) + Sheets (Errores)
```

---

## 🧪 Testing

Usa los payloads de prueba en `docs/PAYLOADS_PRUEBA.md` con Postman para probar el workflow:

```bash
# Ejemplo de payload
POST https://tu-url.trycloudflare.com/webhook-test/streaming-service
Content-Type: application/json

{
  "tipo_evento": "Eventos sociales",
  "fecha_evento": "2025-12-01",
  "nombre_cliente": "María González",
  ...
}
```

---

## 📚 Documentación Adicional

- **[DISEÑO_WORKFLOW.md](docs/DISEÑO_WORKFLOW.md)** - Diseño detallado del workflow
- **[SCRIPTS_N8N.md](SCRIPTS_N8N.md)** - Scripts JavaScript para nodos Code
- **[PAYLOADS_PRUEBA.md](docs/PAYLOADS_PRUEBA.md)** - Ejemplos de datos para testing
- **[GUIA_SCRIPTS.md](GUIA_SCRIPTS.md)** - Cómo ejecutar los scripts de Docker
- **[ROADMAP.md](ROADMAP.md)** - Planificación de futuras versiones

---

## 🔧 Mantenimiento

### Reconectar Gmail (Cada 7 días)
Como la app de Google está en modo "Testing", debes reconectar Gmail semanalmente:
1. Abre las credenciales en N8N
2. Haz clic en "Reconnect"
3. Autoriza nuevamente

### Actualizar URL de Cloudflare
Cada vez que reinicies el tunnel, actualiza la URL en `formulario.html`.

### Backup del Workflow
Exporta regularmente el workflow desde N8N:
```
Settings → Export → workflow_streaming.json
```

---

## 🎯 Tipos de Eventos Soportados

1. **Eventos Sociales** (Bodas, cumpleaños, reuniones)
2. **Conferencias y Eventos Corporativos**
3. **E-Sport y Gaming**
4. **Conciertos y Eventos Artísticos**
5. **Eventos Religiosos**
6. **Eventos Deportivos**

---

## 📦 Paquetes Disponibles

- **Básico** - 1 cámara HD, streaming a 1 plataforma
- **Estándar** - 2 cámaras HD, streaming a 2 plataformas
- **Premium** - 3 cámaras HD, overlays avanzados
- **Enterprise** - Solución personalizada

---

## 🤝 Contribuciones

Este es un proyecto educativo. Si deseas contribuir:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Abre un Pull Request

---

## 📝 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

## 👤 Autor

Desarrollado como proyecto de aprendizaje en automatización de workflows y desarrollo web.

---

## 🔗 Enlaces Útiles

- [Documentación de N8N](https://docs.n8n.io/)
- [Gmail API](https://developers.google.com/gmail/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

---

**Última Actualización:** 2025-12-03
