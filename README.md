# 🎓 Plantilla N8N - Webhook con IA y Automatización

> **Proyecto Demo Educativo** - Plantilla de workflow N8N que demuestra integración con IA, validación de datos, análisis de sentimiento y automatización de respuestas.

---

## 📋 Sobre Este Proyecto

Este es un **proyecto de demostración educativo** creado como parte de mi portafolio de estudiante de programación. No representa una empresa real, sino una plantilla funcional que muestra mis conocimientos en:

- ✅ Automatización de workflows con **N8N**
- ✅ Integración con **IA (Google Gemini)** para clasificación y análisis
- ✅ Diseño de **formularios web** con validación
- ✅ Manejo de errores y flujos alternativos
- ✅ Integración con **Google Workspace** (Sheets, Gmail)

---

## 🎯 Propósito

Esta plantilla sirve como:

1. **Ejemplo de Buenas Prácticas:** Implementa patrones profesionales de desarrollo de workflows
2. **Base Reutilizable:** Puede adaptarse para diferentes casos de uso (contacto, soporte, ventas, etc.)
3. **Aprendizaje:** Documenta decisiones técnicas y patrones comunes en N8N

---

## 📁 Estructura del Proyecto

```
/
├── webcam.json                  # Workflow de N8N (plantilla exportable)
├── webhoot.html                 # Frontend de ejemplo con formulario
├── GEMINI.md                    # Instrucciones de colaboración con IA
├── buenas-practicas.md          # Principios generales de ingeniería de software
├── buenas-practicas-python.md   # Guía de desarrollo backend en Python
├── buenas-practicas-n8n.md      # Buenas prácticas para workflows N8N
└── README.md                    # Este archivo
```

---

## 🔄 Funcionalidades del Workflow

### 1. Recepción de Datos (Webhook)
- Endpoint configurable para recibir datos de formularios
- Captura: nombre, email, teléfono, mensaje

### 2. Validación de Datos
- Filtrado de mensajes muy cortos (< 4 caracteres)
- Validación de números de teléfono (> 9999999)
- Separación de datos válidos e inválidos

### 3. Clasificación Inteligente con IA
- Usa **Google Gemini** para categorizar mensajes:
  - `sales`: Consultas comerciales
  - `support`: Solicitudes de soporte técnico
  - `error`: Mensajes fuera de contexto o inválidos

### 4. Análisis de Sentimiento
- Detecta tono positivo/negativo en mensajes de soporte
- Permite personalizar respuestas según el sentimiento

### 5. Respuestas Automáticas
- Genera emails HTML personalizados según:
  - Categoría del mensaje
  - Sentimiento detectado
  - Contexto del usuario
- Envío automático vía Gmail

### 6. Almacenamiento
- **Google Sheets** como base de datos simple
- Hojas separadas para mensajes válidos y erróneos
- Registro completo de todas las interacciones

### 7. Manejo de Errores
- Flujos alternativos para cada punto de fallo
- Notificaciones automáticas en caso de error
- Logging estructurado para debugging

---

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5** - Estructura semántica
- **Tailwind CSS** - Estilos modernos (vía CDN)
- **JavaScript Vanilla** - Validación y envío de formularios

### Backend/Automatización
- **N8N** - Plataforma de automatización de workflows
- **Google Gemini (PaLM)** - IA para clasificación y generación de texto
- **Google Sheets** - Almacenamiento de datos
- **Gmail** - Envío de correos electrónicos

---

## 🚀 Cómo Usar Esta Plantilla

### Requisitos Previos
1. Cuenta de N8N (Cloud o Self-hosted)
2. Credenciales de Google:
   - Gmail (OAuth2)
   - Google Sheets (OAuth2)
   - Google Gemini API Key

### Pasos de Instalación

1. **Importar el Workflow:**
   - Abre N8N
   - Ve a "Workflows" → "Import from File"
   - Selecciona `webcam.json`

2. **Configurar Credenciales:**
   - Configura las credenciales de Google en N8N
   - Actualiza los IDs de Google Sheets con tus propias hojas

3. **Personalizar el Frontend:**
   - Edita `webhoot.html` según tus necesidades
   - Actualiza la URL del webhook con tu endpoint de N8N
   - Modifica estilos y textos

4. **Activar el Workflow:**
   - En N8N, activa el workflow
   - Prueba enviando datos desde el formulario

### Personalización

#### Cambiar Categorías de Clasificación
Edita el prompt del nodo de IA para ajustar las categorías a tu caso de uso.

#### Modificar Respuestas Automáticas
Actualiza los templates de email en los nodos correspondientes.

#### Cambiar Almacenamiento
Reemplaza los nodos de Google Sheets con tu base de datos preferida (PostgreSQL, MongoDB, etc.).

---

## 📊 Diagrama de Flujo Simplificado

```
Webhook → Validar Datos → Clasificar con IA → Switch
                              ↓
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
                  Sales   Support    Error
                    ↓         ↓         ↓
              Respuesta  Análisis  Notificar
                          Sentim.      ↓
                            ↓      Guardar
                        Respuesta   Error
                            ↓
                      Guardar Sheets
```

---

## 📚 Documentación de Buenas Prácticas

Este proyecto incluye documentación detallada de buenas prácticas:

- **[buenas-practicas.md](buenas-practicas.md)** - Principios SOLID, patrones de diseño, arquitectura de software
- **[buenas-practicas-python.md](buenas-practicas-python.md)** - Desarrollo backend con Python, Django, FastAPI
- **[buenas-practicas-n8n.md](buenas-practicas-n8n.md)** - Diseño de workflows, seguridad, patrones comunes en N8N

Estos documentos son **vivos** y se actualizan conforme aprendo nuevos conceptos y patrones.

---

## 🎨 Características del Frontend

### Diseño Visual
- Paleta de colores premium (Gold `#D4AF37`, Dark `#1a1a1a`)
- Efectos de glassmorphism
- Animaciones suaves (fade-in, slide-up)
- Inputs con etiquetas flotantes
- Diseño responsive

### Validación
- Validación en tiempo real
- Mensajes de error claros
- Feedback visual inmediato
- Prevención de envíos duplicados

---

## 🔐 Consideraciones de Seguridad

- ✅ Credenciales almacenadas en el sistema de N8N (no hardcodeadas)
- ✅ Validación de datos en múltiples capas
- ✅ Sanitización de inputs antes de procesamiento
- ✅ Manejo seguro de errores (sin exponer información sensible)
- ⚠️ **Nota:** Para producción, considera agregar autenticación al webhook

---

## 📈 Posibles Mejoras Futuras

- [ ] Agregar autenticación al webhook (HMAC, JWT)
- [ ] Implementar rate limiting para prevenir abuso
- [ ] Migrar de Google Sheets a base de datos real (PostgreSQL)
- [ ] Agregar dashboard de analytics
- [ ] Implementar tests automatizados
- [ ] Agregar más canales de notificación (Slack, Discord, SMS)
- [ ] Crear versión multi-idioma

---

## 🤝 Sobre el Autor

Soy un **estudiante de programación** enfocado en desarrollo backend con Python (Django, FastAPI) y automatización con N8N. Este proyecto forma parte de mi portafolio educativo.

### Contacto
- **Email:** erjgomezf@gmail.com
- **GitHub:** [Tu GitHub aquí]

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos. Siéntete libre de usarlo, modificarlo y aprender de él.

---

## 🙏 Agradecimientos

- **N8N Community** - Por la excelente documentación y ejemplos
- **Google Gemini** - Por la API de IA accesible
- **Tailwind CSS** - Por el framework de estilos

---

**Última Actualización:** 2025-11-26

---

> 💡 **Tip:** Si encuentras útil esta plantilla, considera darle una estrella ⭐ en GitHub y compartirla con otros estudiantes.
