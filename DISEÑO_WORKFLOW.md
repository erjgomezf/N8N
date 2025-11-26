# 🎬 Diseño del Workflow - Servicio de Streaming para Eventos

> **Documento de Planificación** - Define la estructura completa del workflow de N8N antes de la implementación.

---

## 📋 Índice

1. [Estructura de Paquetes](#estructura-de-paquetes)
2. [Formulario Dinámico](#formulario-dinámico)
3. [Flujo del Workflow](#flujo-del-workflow)
4. [Nodos de N8N](#nodos-de-n8n)
5. [Templates de Email](#templates-de-email)
6. [Notificaciones de Telegram](#notificaciones-de-telegram)
7. [Estructura de Google Sheets](#estructura-de-google-sheets)
8. [Validaciones y Manejo de Errores](#validaciones-y-manejo-de-errores)

---

## 1. Estructura de Paquetes

### **Paquetes Base:**

#### 🥉 BÁSICO
- 1 cámara HD
- 1 micrófono inalámbrico
- Streaming a 1 plataforma
- Sin overlays
- Operador técnico básico

#### 🥈 ESTÁNDAR
- 2 cámaras HD
- 2 micrófonos inalámbricos
- Streaming a 1 plataforma
- Overlays básicos (templates predefinidos)
- Operador técnico básico

#### 🥇 PREMIUM
- 3 cámaras HD
- 3 micrófonos profesionales + mezclador
- Streaming a 1 plataforma
- Overlays avanzados (animaciones, lower thirds)
- Director técnico

#### 💎 ENTERPRISE
- 4 cámaras 4K
- 4 micrófonos profesionales + mezclador
- Streaming simultáneo a hasta 3 plataformas
- Overlays avanzados + branding
- Director técnico + asistente

### **Add-ons Disponibles:**

- 📹 **Cámara + Micrófono Adicional** - Expande la cobertura del evento
- 🛰️ **Internet Starlink** - Garantía de conectividad estable, ideal para eventos críticos
- 🎨 **Overlays Personalizados** - Diseño único según branding del cliente (hasta 3 revisiones)
- 📺 **Plataforma Adicional** (Solo Enterprise) - Streaming a 1 plataforma extra

---

## 2. Formulario Dinámico

### **Campos Universales (Todos los eventos):**

```javascript
{
  // Clasificación
  tipo_evento: "Eventos sociales" | 
               "Conferencias y eventos corporativos" | 
               "E-Sport y Gaming" | 
               "Conciertos y Eventos Artísticos" | 
               "Eventos Religiosos" | 
               "Eventos Deportivos",
  
  // Información del evento
  fecha_evento: "2025-12-15",
  ubicacion_evento: "Ciudad, Estado o dirección específica",
  duracion_estimada: "2 horas" | "4 horas" | "6 horas" | "8 horas" | 
                     "Todo el día" | "Varios días",
  tiene_internet_venue: "Sí" | "No" | "No estoy seguro",
  
  // Paquete de interés
  paquete_interes: "Básico" | "Estándar" | "Premium" | "Enterprise" | 
                   "No estoy seguro",
  
  // Add-ons (checkboxes múltiples)
  add_ons_solicitados: [
    "Cámara + Micrófono Adicional",
    "Internet Starlink",
    "Overlays Personalizados",
    "Plataforma Adicional"
  ],
  
  // Datos de contacto
  nombre_cliente: "Juan Pérez",
  email_cliente: "juan@email.com",
  telefono_cliente: "+58 412 1234567", // OBLIGATORIO
  
  // Comentarios
  comentarios_adicionales: "Texto libre...",
  
  // Calculado automáticamente en el backend
  dias_del_evento: 45 // días desde hoy hasta fecha_evento
}
```

### **Campos Específicos por Tipo de Evento:**

#### **🎊 Eventos Sociales**
```javascript
{
  tipo_celebracion: "Boda" | "Quinceañera" | "Aniversario" | "Baby Shower" | "Otro",
  numero_invitados: 150,
  momentos_clave: ["Ceremonia", "Entrada de novios", "Baile", "Brindis"]
}
```

#### **🏢 Conferencias y Eventos Corporativos**
```javascript
{
  nombre_empresa: "Empresa XYZ C.A.",
  tipo_conferencia: "Seminario" | "Capacitación" | "Lanzamiento de producto" | 
                    "Asamblea" | "Evento corporativo",
  numero_speakers: 3,
  numero_asistentes: 200,
  necesita_grabacion: "Sí" | "No",
  plataformas_destino: ["YouTube", "Facebook", "LinkedIn", "Plataforma privada"]
}
```

#### **🎮 E-Sports y Gaming**
```javascript
{
  juego_plataforma: "League of Legends" | "Fortnite" | "FIFA" | "Valorant" | "Otro",
  tipo_torneo: "Local" | "Nacional" | "Internacional" | "Amistoso",
  numero_equipos: 8,
  numero_jugadores: 40,
  necesita_scoreboards: "Sí" | "No",
  necesita_comentaristas: "Sí" | "No",
  plataformas_destino: ["Twitch", "YouTube", "Facebook Gaming", "Kick"]
}
```

#### **🎵 Conciertos y Eventos Artísticos**
```javascript
{
  tipo_evento_artistico: "Concierto" | "Teatro" | "Stand-up comedy" | 
                         "Performance" | "Festival",
  nombre_artista: "Banda XYZ",
  numero_artistas: 5,
  tipo_venue: "Cerrado" | "Abierto" | "Teatro" | "Club",
  necesita_audio_profesional: "Sí" | "No"
}
```

#### **⛪ Eventos Religiosos**
```javascript
{
  tipo_ceremonia: "Misa" | "Culto" | "Bautizo" | "Primera Comunión" | 
                  "Boda religiosa" | "Otro",
  numero_asistentes: 100,
  necesita_audio_claro: "Sí" | "No"
}
```

#### **⚽ Eventos Deportivos**
```javascript
{
  tipo_deporte: "Fútbol" | "Baloncesto" | "Béisbol" | "Voleibol" | "Otro",
  tipo_evento_deportivo: "Partido único" | "Torneo" | "Liga" | "Amistoso",
  numero_equipos: 2,
  necesita_scoreboards: "Sí" | "No",
  necesita_replays: "Sí" | "No",
  tipo_venue_deportivo: "Estadio" | "Cancha abierta" | "Gimnasio" | "Otro"
}
```

---

## 3. Flujo del Workflow

### **Diagrama de Flujo Completo:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Cliente llena formulario dinámico en el sitio web           │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Validación en Frontend                                       │
│    - Campos obligatorios                                        │
│    - Formato email/teléfono                                     │
│    - Fecha futura                                               │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Envío a Webhook de N8N                                       │
│    POST /webhook/streaming-eventos                              │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. N8N: Validación de Datos Críticos                            │
│    ¿Todos los campos obligatorios presentes?                    │
└────────┬───────────────────────────────────────┬────────────────┘
         │ NO                                    │ SÍ
         ↓                                       ↓
┌────────────────────────┐      ┌───────────────────────────────┐
│ 5a. Flujo de Error     │      │ 5b. Procesamiento de Datos   │
│ - Email de error       │      │ - Calcular días_del_evento    │
│ - Registro en Sheets   │      │ - Determinar urgencia         │
│ - Notificar a Telegram │      │ - Preparar datos              │
└────────────────────────┘      └───────────┬───────────────────┘
                                            ↓
                         ┌──────────────────────────────────────┐
                         │ 6. Análisis con IA (Opcional)        │
                         │ - Analizar comentarios_adicionales   │
                         │ - Extraer insights                   │
                         │ - Validar completitud de datos       │
                         └───────────┬──────────────────────────┘
                                     ↓
                         ┌──────────────────────────────────────┐
                         │ 7. Email Automático al Cliente       │
                         │ - Template personalizado por tipo    │
                         │ - Confirmación de solicitud          │
                         │ - Próximos pasos                     │
                         └───────────┬──────────────────────────┘
                                     ↓
                         ┌──────────────────────────────────────┐
                         │ 8. Registro en Google Sheets         │
                         │ - Hoja: "Leads Activos"              │
                         │ - Estado: "Nuevo"                    │
                         └───────────┬──────────────────────────┘
                                     ↓
                         ┌──────────────────────────────────────┐
                         │ 9. Notificación a Telegram           │
                         │ - Grupo según urgencia               │
                         │ - Resumen completo del lead          │
                         └───────────┬──────────────────────────┘
                                     ↓
                         ┌──────────────────────────────────────┐
                         │ 10. Vendedor Revisa Google Sheets    │
                         │ - Actualiza estado manualmente       │
                         │ - Contacta al cliente                │
                         └──────────────────────────────────────┘
```

---

## 4. Nodos de N8N

### **Estructura de Nodos:**

#### **Nodo 1: Webhook**
- **Tipo:** Webhook
- **Nombre:** `Recibir Solicitud de Cliente`
- **Path:** `/webhook/streaming-eventos`
- **Método:** POST
- **Autenticación:** Header Auth (opcional para demo)

#### **Nodo 2: Calcular Días del Evento**
- **Tipo:** Code (JavaScript)
- **Nombre:** `Calcular Días y Preparar Datos`
- **Función:**
  ```javascript
  const fechaEvento = new Date($json.fecha_evento);
  const hoy = new Date();
  const diferencia = fechaEvento - hoy;
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  
  return {
    ...($json),
    dias_del_evento: dias,
    timestamp_solicitud: new Date().toISOString()
  };
  ```

#### **Nodo 3: Determinar Urgencia**
- **Tipo:** Code (JavaScript)
- **Nombre:** `Clasificar Urgencia`
- **Función:**
  ```javascript
  const dias = $json.dias_del_evento;
  const paquete = $json.paquete_interes;
  const tipo = $json.tipo_evento;
  
  let urgencia = "🟢 Normal";
  
  if (dias < 7) urgencia = "🔴 Alta";
  else if (paquete === "Enterprise") urgencia = "🔴 Alta";
  else if (tipo === "Conferencias y eventos corporativos" && dias < 14) urgencia = "🔴 Alta";
  else if (dias < 30) urgencia = "🟡 Media";
  else if (paquete === "Premium") urgencia = "🟡 Media";
  
  return {
    ...($json),
    urgencia: urgencia
  };
  ```

#### **Nodo 4: Validar Datos Críticos**
- **Tipo:** IF
- **Nombre:** `¿Datos Completos?`
- **Condiciones:**
  - `nombre_cliente` existe y no está vacío
  - `email_cliente` existe y formato válido
  - `telefono_cliente` existe y no está vacío
  - `fecha_evento` existe y es fecha futura
  - `tipo_evento` existe

#### **Nodo 5a: Email de Error**
- **Tipo:** Gmail
- **Nombre:** `Notificar Error al Cliente`
- **Template:** Ver sección de Templates

#### **Nodo 5b: Análisis con IA (Opcional)**
- **Tipo:** Google Gemini
- **Nombre:** `Analizar Comentarios del Cliente`
- **Prompt:**
  ```
  Analiza el siguiente comentario de un cliente que solicita servicio 
  de streaming para eventos y extrae insights útiles para el vendedor.
  
  Tipo de evento: {{$json.tipo_evento}}
  Paquete de interés: {{$json.paquete_interes}}
  Comentarios del cliente: '{{$json.comentarios_adicionales}}'
  
  Proporciona en formato JSON:
  {
    "datos_completos": true/false,
    "campos_faltantes": ["campo1", "campo2"],
    "sugerencias_vendedor": "Texto breve con recomendaciones para la llamada"
  }
  
  Si no hay comentarios, devuelve datos_completos: true y sugerencias genéricas.
  ```

#### **Nodo 6: Email al Cliente**
- **Tipo:** Gmail
- **Nombre:** `Enviar Confirmación al Cliente`
- **Template:** Ver sección de Templates (personalizado por tipo_evento)

#### **Nodo 7: Registro en Google Sheets**
- **Tipo:** Google Sheets
- **Nombre:** `Registrar Lead en Sheets`
- **Operación:** Append Row
- **Hoja:** `Leads Activos`
- **Columnas:** Ver sección de Google Sheets

#### **Nodo 8: Notificación a Telegram**
- **Tipo:** Telegram
- **Nombre:** `Notificar a Equipo de Ventas`
- **Chat ID:** Según urgencia (grupos diferentes)
- **Template:** Ver sección de Telegram

#### **Nodo 9: Manejo de Errores**
- **Tipo:** Error Trigger
- **Nombre:** `Capturar Errores del Workflow`
- **Acciones:**
  - Registrar en hoja de errores
  - Notificar a Telegram de errores críticos

---

## 5. Templates de Email

### **Template Base (Todos los eventos):**

```html
Asunto: ✅ Solicitud Recibida - {{tipo_evento}} el {{fecha_evento}}

Hola {{nombre_cliente}},

¡Gracias por tu interés en nuestros servicios de streaming profesional!

Hemos recibido exitosamente tu solicitud con los siguientes detalles:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RESUMEN DE TU SOLICITUD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 Tipo de Evento: {{tipo_evento}} - {{subtipo}}
📅 Fecha: {{fecha_evento}}
📍 Ubicación: {{ubicacion_evento}}
⏱️ Duración Estimada: {{duracion_estimada}}

📦 Paquete de Interés: {{paquete_interes}}
➕ Servicios Adicionales: {{add_ons_solicitados}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if tiene_internet_venue_no}}
💡 RECOMENDACIÓN:
Notamos que no cuentas con internet en el venue. Te recomendamos 
considerar nuestro servicio Starlink para garantizar una transmisión 
estable y sin interrupciones.
{{/if}}

{{#if urgencia_alta}}
⚠️ EVENTO PRÓXIMO:
Tu evento está a solo {{dias_del_evento}} días. Nos pondremos en 
contacto contigo de manera prioritaria en las próximas 24 horas 
para asegurar disponibilidad.
{{/if}}

📞 PRÓXIMOS PASOS:

1️⃣ Nuestro equipo de ventas revisará tu solicitud
2️⃣ Te contactaremos vía teléfono/WhatsApp al {{telefono_cliente}} 
   en un máximo de {{tiempo_respuesta}}
3️⃣ Prepararemos una cotización personalizada según tus necesidades
4️⃣ Verificaremos disponibilidad de fecha y equipos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Tienes alguna pregunta urgente? 
Responde a este email o llámanos al: [Tu Teléfono]

{{mensaje_personalizado_por_tipo}}

Saludos,
[Nombre de la Empresa]
Streaming Profesional para Eventos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **Mensajes Personalizados por Tipo:**

#### **Eventos Sociales:**
```
¡Estamos emocionados de ser parte de tu {{tipo_celebracion}}! 
Sabemos lo importante que es este momento y nos aseguraremos de 
que tus seres queridos puedan vivirlo contigo, sin importar la distancia.
```

#### **Conferencias Corporativas:**
```
Agradecemos la confianza de {{nombre_empresa}} en nuestros servicios. 
Nos especializamos en streaming profesional para eventos corporativos 
y garantizamos una transmisión de calidad que refleje el profesionalismo 
de su organización.
```

#### **E-Sports:**
```
¡Listos para llevar tu torneo de {{juego_plataforma}} al siguiente nivel! 
Nuestro equipo tiene experiencia en streaming de e-sports con overlays 
personalizados y baja latencia para la mejor experiencia de tus espectadores.
```

#### **Conciertos:**
```
¡Preparados para capturar la energía de tu {{tipo_evento_artistico}}! 
Con múltiples cámaras y audio profesional, llevaremos la experiencia 
en vivo a tu audiencia online.
```

#### **Eventos Religiosos:**
```
Entendemos la importancia de tu {{tipo_ceremonia}} y nos comprometemos 
a transmitir este momento especial con el respeto y la calidad que merece.
```

#### **Eventos Deportivos:**
```
¡Vamos a transmitir tu {{tipo_evento_deportivo}} de {{tipo_deporte}} 
como los profesionales! Con múltiples ángulos y scoreboards en tiempo real.
```

### **Template de Email de Error:**

```html
Asunto: ⚠️ Información Incompleta - Solicitud de Streaming

Hola {{nombre_cliente}},

Hemos recibido tu solicitud de servicio de streaming, pero notamos 
que falta información importante para poder procesar tu cotización.

❌ DATOS FALTANTES:
{{#each campos_faltantes}}
- {{this}}
{{/each}}

📝 ¿QUÉ HACER?

Por favor, responde a este email con la información faltante o 
llena nuevamente el formulario en nuestro sitio web:
[Link al formulario]

Alternativamente, puedes contactarnos directamente:
📞 Teléfono: [Tu Teléfono]
📧 Email: [Tu Email]

Estamos aquí para ayudarte.

Saludos,
[Nombre de la Empresa]
```

---

## 6. Notificaciones de Telegram

### **Formato del Mensaje:**

```
{{emoji_urgencia}} NUEVO LEAD - {{urgencia}}

👤 Cliente: {{nombre_cliente}}
📞 Teléfono: {{telefono_cliente}}
📧 Email: {{email_cliente}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DETALLES DEL EVENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 Tipo: {{tipo_evento}} - {{subtipo}}
🗓️ Fecha: {{fecha_evento}}
⏰ Días restantes: {{dias_del_evento}} días
📍 Ubicación: {{ubicacion_evento}}
⏱️ Duración: {{duracion_estimada}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 PAQUETE Y SERVICIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Paquete: {{paquete_interes}}
➕ Add-ons: {{add_ons_solicitados}}
🌐 Internet en venue: {{tiene_internet_venue}}

{{#if campos_especificos}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INFORMACIÓN ADICIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{campos_especificos_formateados}}
{{/if}}

{{#if comentarios_adicionales}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 COMENTARIOS DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"{{comentarios_adicionales}}"
{{/if}}

{{#if notas_ia}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 ANÁLISIS IA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{notas_ia.sugerencias_vendedor}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Ver en Sheets: [Link directo]
⏱️ Tiempo de respuesta sugerido: {{tiempo_respuesta}}
```

### **Grupos de Telegram por Urgencia:**

- **🔴 Urgencia Alta:** Grupo "Leads Urgentes"
- **🟡 Urgencia Media:** Grupo "Leads Normales"
- **🟢 Urgencia Normal:** Grupo "Leads Normales"

---

## 7. Estructura de Google Sheets

### **Hoja 1: "Leads Activos"**

| Columna | Tipo | Descripción |
|---------|------|-------------|
| A - ID | Auto | ID único (timestamp o autoincremental) |
| B - Timestamp | Fecha/Hora | Fecha y hora de la solicitud |
| C - Estado | Texto | `Nuevo` \| `Contactado` \| `En Negociación` \| `Cerrado` \| `Perdido` |
| D - Urgencia | Texto | `🔴 Alta` \| `🟡 Media` \| `🟢 Normal` |
| E - Nombre Cliente | Texto | Nombre completo |
| F - Teléfono | Texto | Número de teléfono/WhatsApp |
| G - Email | Texto | Email del cliente |
| H - Tipo Evento | Texto | Categoría principal del evento |
| I - Subtipo | Texto | Subcategoría específica |
| J - Fecha Evento | Fecha | Fecha del evento |
| K - Días Restantes | Número | Calculado automáticamente |
| L - Ubicación | Texto | Ubicación del evento |
| M - Duración | Texto | Duración estimada |
| N - Internet Venue | Texto | Sí/No/No estoy seguro |
| O - Paquete Interés | Texto | Básico/Estándar/Premium/Enterprise |
| P - Add-ons | Texto | Lista de add-ons solicitados |
| Q - Campos Específicos | JSON/Texto | Campos dinámicos según tipo de evento |
| R - Comentarios | Texto | Comentarios adicionales del cliente |
| S - Notas IA | Texto | Insights de la IA (si aplica) |
| T - Vendedor Asignado | Texto | Nombre del vendedor |
| U - Fecha Contacto | Fecha/Hora | Cuándo se contactó al cliente |
| V - Notas Vendedor | Texto | Notas del vendedor |

### **Hoja 2: "Leads Cerrados"**

| Columna | Descripción |
|---------|-------------|
| A - ID | ID del lead |
| B - Fecha Solicitud | Fecha original de solicitud |
| C - Nombre Cliente | Nombre del cliente |
| D - Tipo Evento | Tipo de evento |
| E - Fecha Evento | Fecha del evento |
| F - Paquete Vendido | Paquete final vendido |
| G - Valor Venta | Monto de la venta |
| H - Fecha Cierre | Cuándo se cerró la venta |
| I - Vendedor | Quién cerró la venta |
| J - Notas | Observaciones |

### **Hoja 3: "Leads Perdidos"**

| Columna | Descripción |
|---------|-------------|
| A - ID | ID del lead |
| B - Fecha Solicitud | Fecha original de solicitud |
| C - Nombre Cliente | Nombre del cliente |
| D - Tipo Evento | Tipo de evento |
| E - Motivo Perdida | Razón por la que se perdió |
| F - Fecha Perdida | Cuándo se marcó como perdido |
| G - Notas | Observaciones |

### **Hoja 4: "Errores"**

| Columna | Descripción |
|---------|-------------|
| A - Timestamp | Fecha y hora del error |
| B - Tipo Error | Validación/Sistema/Otro |
| C - Datos Recibidos | JSON con los datos recibidos |
| D - Mensaje Error | Descripción del error |
| E - Estado | Resuelto/Pendiente |

---

## 8. Validaciones y Manejo de Errores

### **Validaciones en Frontend:**

```javascript
// Campos obligatorios
- nombre_cliente (min 3 caracteres)
- email_cliente (formato email válido)
- telefono_cliente (min 10 dígitos)
- tipo_evento (selección obligatoria)
- fecha_evento (fecha futura)
- ubicacion_evento (min 5 caracteres)
- paquete_interes (selección obligatoria)

// Validaciones específicas
- fecha_evento debe ser al menos mañana
- telefono_cliente solo números y caracteres permitidos (+, -, espacios)
- email_cliente formato válido
```

### **Validaciones en N8N:**

```javascript
// Nodo IF: Validar Datos Críticos
if (!$json.nombre_cliente || $json.nombre_cliente.length < 3) {
  return false; // Ir a flujo de error
}

if (!$json.email_cliente || !validateEmail($json.email_cliente)) {
  return false;
}

if (!$json.telefono_cliente || $json.telefono_cliente.length < 10) {
  return false;
}

const fechaEvento = new Date($json.fecha_evento);
const hoy = new Date();
if (fechaEvento <= hoy) {
  return false; // Fecha en el pasado
}

return true; // Datos válidos, continuar flujo normal
```

### **Manejo de Errores:**

#### **Error 1: Datos Incompletos**
- Email al cliente solicitando información faltante
- Registro en hoja "Errores"
- NO notificar a Telegram (no es un lead válido)

#### **Error 2: Fallo en Envío de Email**
- Registrar en hoja "Errores"
- Notificar a Telegram de error crítico
- Intentar reenvío (1 retry)

#### **Error 3: Fallo en Google Sheets**
- Notificar a Telegram con datos del lead
- Guardar en variable temporal
- Intentar reenvío (2 retries)

#### **Error 4: Fallo en Telegram**
- No bloquear el flujo
- Registrar error pero continuar
- Lead ya está en Sheets

---

## 📊 Métricas a Trackear (Futuro)

- Tasa de conversión por tipo de evento
- Tiempo promedio de respuesta del vendedor
- Paquetes más solicitados
- Add-ons más populares
- Tasa de cierre por urgencia
- Eventos por mes/temporada

---

## 🔄 Próximos Pasos de Implementación

1. ✅ Diseño consolidado (este documento)
2. ⏳ Crear formulario HTML dinámico
3. ⏳ Configurar workflow en N8N
4. ⏳ Crear templates de email
5. ⏳ Configurar bot de Telegram
6. ⏳ Estructurar Google Sheets
7. ⏳ Testing completo del flujo
8. ⏳ Documentación de uso

---

**Última Actualización:** 2025-11-26
**Estado:** Diseño Consolidado - Listo para Implementación
