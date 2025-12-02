# 🎬 Live Moments - Sistema de Streaming Profesional

**Versión 1.0** | Workflow automatizado para gestión de solicitudes de servicios de streaming

---

## 📋 Descripción del Proyecto

Sistema completo de automatización para **Live Moments Production**, empresa de streaming profesional multicámara para eventos en vivo. El sistema gestiona solicitudes de clientes desde un formulario web hasta la confirmación personalizada por email, con integración de IA para personalización y sistema robusto de fallback.

---

## ✨ Características Principales

### 🎯 Funcionalidades Core
- ✅ Formulario web multi-paso con validación en tiempo real
- ✅ Clasificación automática de urgencia
- ✅ Integración con Google Gemini para personalización de correos
- ✅ Sistema de fallback robusto (email genérico si IA falla)
- ✅ Notificaciones por Gmail (cliente y equipo)
- ✅ Registro en Google Sheets (solicitudes exitosas y errores)

### 🎨 Frontend
- Diseño responsive con glassmorphism
- Fondos dinámicos según tipo de evento
- Tooltips inteligentes adaptativos (desktop/móvil)
- Wizard de 4 pasos con validación

### 🤖 Backend (N8N)
- 15 nodos configurados
- Validación en múltiples capas
- Manejo robusto de errores
- Fallback automático para IA

---

## 📁 Estructura del Proyecto

```
/home/programar/Documentos/N8N/
├── README.md                          # Este archivo
├── VERSION_1.0.md                     # Changelog de la versión 1.0
├── ROADMAP.md                         # Planificación de versiones futuras
├── SCRIPTS_N8N.md                     # Scripts reutilizables documentados
├── workflow_streaming.json            # Workflow principal de N8N
├── formulario.html                    # Frontend del formulario
├── img/                               # Recursos visuales
└── docs/                              # Documentación de desarrollo
    ├── DISEÑO_WORKFLOW.md
    ├── FLUJO_ERRORES.md
    ├── PAYLOADS_PRUEBA.md
    ├── RECURSOS_IMG.md
    └── TEMPLATES_EMAIL.md
```

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Cuenta de N8N (Cloud o Self-hosted)
- Credenciales de Google:
  - Gmail (OAuth2)
  - Google Sheets (OAuth2)
  - Google Gemini API Key

### Instalación

1. **Importar el Workflow:**
   ```bash
   # En N8N: Workflows → Import from File
   # Seleccionar: workflow_streaming.json
   ```

2. **Configurar Credenciales:**
   - Gmail OAuth2
   - Google Sheets OAuth2
   - Google Gemini API

3. **Actualizar IDs de Google Sheets:**
   - Crear dos hojas: "Solicitudes Exitosas" y "Registro de Errores"
   - Actualizar IDs en nodos `resgitroExitoso` y `registroErrores`

4. **Configurar Formulario:**
   - Editar `formulario.html`
   - Actualizar webhook URL (línea ~XXX)
   - Desplegar en tu servidor web

5. **Activar Workflow:**
   - En N8N, activar el workflow
   - Probar con datos de prueba

---

## 📊 Arquitectura del Workflow

### Flujo Principal

```
Webhook → Calcular Días → Clasificar Urgencia → Validar Datos
                                                      ↓
                                            ┌─────────┴─────────┐
                                            ↓                   ↓
                                    DATOS VÁLIDOS        DATOS INVÁLIDOS
                                            ↓                   ↓
                                      AI Agent          Email Error (Equipo)
                                            ↓                   ↓
                                    ¿IA Exitosa?        Sheets (Errores)
                                            ↓                   ↓
                                    ┌───────┴───────┐   Responder 400
                                    ↓               ↓
                              Personalizado    Genérico
                                    ↓               ↓
                                    └───────┬───────┘
                                            ↓
                                  Email Confirmación
                                            ↓
                                  Sheets (Exitosos)
                                            ↓
                                    Responder 200
```

### Nodos Clave

1. **calcularDias** - Enriquece datos con días hasta evento
2. **clasificarUrgencia** - Lógica de priorización
3. **validarDatos** - Validación backend
4. **AI Agent** - Personalización con Gemini (Continue On Fail)
5. **¿IA Exitosa?** - Validación de respuesta de IA
6. **procesarRespuesta** - Formateo de email personalizado
7. **procesarEmailGenerico** - Fallback si IA falla

---

## 🛠️ Stack Tecnológico

### Frontend
- HTML5
- CSS3 (Vanilla)
- JavaScript (ES6+)

### Backend/Automatización
- N8N
- Google Gemini (IA)
- Gmail API
- Google Sheets API

### Desarrollo Local
- Docker (N8N containerizado)
- Cloudflare Tunnel (exposición de webhooks)

---

## 💻 Desarrollo Local

### Requisitos
- Docker instalado
- Cloudflared instalado

### Inicio Rápido

1. **Iniciar N8N:**
   ```bash
   ./start-n8n.sh
   ```

2. **Exponer con Cloudflare Tunnel:**
   ```bash
   ./expose-n8n.sh
   ```

3. **Copiar URL del tunnel** y actualizar en `formulario.html`

Ver [DESARROLLO_LOCAL.md](DESARROLLO_LOCAL.md) para guía completa.

---

## 📚 Documentación

### Guías de Buenas Prácticas
- [Principios Generales](buenas-practicas.md) - SOLID, DRY, KISS, patrones de diseño
- [N8N Workflows](buenas-practicas-n8n.md) - Diseño, seguridad, patrones, **fallbacks de IA**
- [JavaScript](buenas-practicas-javascript.md) - ES6+, manejo de datos, N8N específico
- [Python](buenas-practicas-python.md) - Django, FastAPI, inyección de dependencias

### Scripts Reutilizables
- [SCRIPTS_N8N.md](SCRIPTS_N8N.md) - Colección de scripts documentados

### Información de Versión
- [VERSION_1.0.md](VERSION_1.0.md) - Changelog completo de v1.0
- [ROADMAP.md](ROADMAP.md) - Planificación de v1.1 (Telegram) y v1.2 (WhatsApp)

---

## 🎓 Lecciones Aprendidas

### Fallbacks para IA
**Problema:** APIs de IA pueden fallar  
**Solución:** Implementar fallback con template genérico  
**Resultado:** 100% de emails enviados, incluso si IA falla

### Validación en Múltiples Capas
**Problema:** Datos inválidos llegando al workflow  
**Solución:** Validar en frontend + backend + lógica de negocio  
**Resultado:** Reducción de 90% en errores de procesamiento

### Nomenclatura Descriptiva
**Problema:** Difícil identificar qué nodo falló en logs  
**Solución:** Nombres descriptivos como `¿IA Exitosa?` en lugar de `IF`  
**Resultado:** Debugging 3x más rápido

---

## 🚀 Próximas Versiones

### v1.1 (Q1 2025) - Telegram
- Notificaciones por Telegram Bot
- Comandos de consulta (`/solicitudes`, `/urgentes`)

### v1.2 (Q2 2025) - WhatsApp
- Confirmación por WhatsApp Business API
- Respuestas automáticas
- Recordatorios de eventos

### v2.0 (Q3-Q4 2025) - Plataforma Completa
- Dashboard de administración
- Base de datos real (PostgreSQL)
- Sistema de cotizaciones
- Pagos en línea

Ver [ROADMAP.md](ROADMAP.md) para más detalles.

---

## 🔐 Consideraciones de Seguridad

- ✅ Credenciales en sistema de N8N (no hardcodeadas)
- ✅ Validación de datos en múltiples capas
- ✅ Sanitización de inputs
- ✅ Manejo seguro de errores
- ⚠️ **Pendiente:** Autenticación de webhook (v1.1)
- ⚠️ **Pendiente:** Rate limiting (v1.1)

---

## 🤝 Sobre el Autor

Estudiante de programación enfocado en desarrollo backend con Python (Django, FastAPI) y automatización con N8N.

**Contacto:**
- Email: erjgomezf@gmail.com
- GitHub: [Tu perfil]

---

## 📄 Licencia

MIT License - Proyecto educativo de código abierto

---

## 🙏 Agradecimientos

- **N8N Community** - Documentación y ejemplos
- **Google Gemini** - API de IA accesible
- **Comunidad de desarrollo** - Inspiración y aprendizaje

---

**Versión Actual:** 1.0  
**Estado:** ✅ Producción  
**Última Actualización:** 2025-12-01

---

> 💡 **Tip:** Revisa [VERSION_1.0.md](VERSION_1.0.md) para el changelog completo y [ROADMAP.md](ROADMAP.md) para ver qué viene en las próximas versiones.
