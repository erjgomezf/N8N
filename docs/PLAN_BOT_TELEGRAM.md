# 🤖 Plan: Bot de Telegram - Asistente de Reservaciones

## 📋 Documento de Planificación

**Fecha:** 2025-12-03  
**Versión:** 3.0 - Final
**Estado:** Listo para Desarrollo

---

## 🎯 Objetivo General

Crear un bot de Telegram conversacional (@livemoments_bot) que replique el flujo guiado del formulario web, permitiendo a los usuarios retomar conversaciones interrumpidas.

**Decisiones Arquitectónicas Confirmadas:**
1.  **Estrategia Modular:** Workflow exclusivo para el Bot que conecta con el Central.
2.  **Interacción:** Botones Inline siempre que sea posible; Texto libre para datos específicos.
3.  **Validación Inteligente:** 
    - Validación en tiempo real con JavaScript (Regex).
    - **Fallback Humano:** Si el dato sigue siendo inválido o difícil de procesar, se acepta pero se marca para revisión manual por el equipo de ventas.
4.  **Persistencia:** Google Sheets ("Sesiones_Telegram") para guardar estado y permitir retomar.
5.  **Control de Usuario:** Comando `/cancelar` para borrar datos y empezar de cero.

---

## 🗺️ Flujo de Conversación (Definitivo)

### **Paso 0: Inicio / Retomar**
- **Comando:** `/start` o `/reservar`
- **Lógica:** 
  - Buscar `chat_id` en Sheets.
  - Si existe sesión previa: "¿Hola [Nombre], quieres continuar tu reservación pendiente?" [Sí/No]
  - Si no: "¡Hola! Soy el asistente de Live Moments..."
- **Comando:** `/cancelar`
  - **Acción:** Borrar fila en Sheets.
  - **Mensaje:** "Reservación cancelada. Usa /reservar para empezar de nuevo."

### **Paso 1: Tipo de Evento (Botones)**
- **Pregunta:** "¿Qué tipo de evento vas a realizar?"
- **Opciones (Botones):**
  - 🎊 Eventos Sociales
  - 🏢 Corporativo
  - 🎮 E-Sports
  - 🎵 Conciertos
  - ⛪ Religiosos
  - ⚽ Deportivos

### **Paso 2: Fecha (Texto + Validación JS)**
- **Pregunta:** "📅 Por favor escribe la fecha del evento (DD/MM/YYYY)"
- **Validación:** Regex `^\d{2}/\d{2}/\d{4}$` + Fecha Futura.
- **Lógica de Error:** 
  - Intento 1 fallido: "❌ Formato incorrecto. Por favor usa DD/MM/YYYY (ej: 25/12/2025)"
  - Intento 2 fallido: "⚠️ No pude entender la fecha. La anotaré tal cual para que un humano la revise. ¿Continuamos?"

### **Paso 3: Ciudad (Texto)**
- **Pregunta:** "📍 ¿En qué ciudad será el evento?"
- **Validación:** Mínimo 3 caracteres.

### **Paso 4: Paquete (Botones)**
- **Pregunta:** "¿Qué paquete te interesa?"
- **Opciones (Botones):**
  - 🥉 Básico
  - 🥈 Estándar
  - 🥇 Premium
  - 💎 Enterprise

### **Paso 5: Datos de Contacto (Texto + Validación JS)**
- **Nombre:** "¿Cuál es tu nombre completo?"
- **Email:** "¿Cuál es tu correo electrónico?" (Regex Email)
- **Teléfono:** "¿Cuál es tu número de teléfono?" (Regex Numérico)
- **Nota:** Aplicar misma lógica de "Fallback Humano" si falla la validación repetidamente.

### **Paso 6: Confirmación**
- **Acción:** Mostrar resumen de datos.
- **Botones:**
  - ✅ Confirmar y Enviar
  - ✏️ Corregir (Reinicia flujo o permite elegir campo - MVP: Reinicia)
  - ❌ Cancelar

### **Paso 7: Procesamiento**
- **Acción:** Enviar datos al **Workflow Central**.
- **Flag:** Si hubo datos inválidos aceptados, marcar `revision_manual: true`.
- **Mensaje Final:** "🎉 ¡Solicitud recibida! Te hemos enviado un correo..."

---

## 🏗️ Arquitectura Técnica (Modular)

### **Workflow 1: Telegram Bot (El Recepcionista)**
1.  **Trigger:** Telegram (On Message / On Callback)
2.  **Router:** ¿Es comando? ¿Es botón? ¿Es texto?
3.  **State Manager:** Leer/Escribir en Google Sheets (Hoja "Sesiones_Telegram")
4.  **Logic:** Switch case según el "Paso Actual" del usuario.
5.  **Output:** Cuando termina, llama al Workflow Central.

### **Workflow 2: Central (El Procesador - Ya existente)**
- Recibe JSON estandarizado.
- Calcula días.
- Clasifica urgencia.
- Envía correos.
- Notifica al admin.

---

### **Gestión de Estado (Conversación)**

El bot necesita **recordar** en qué paso está cada usuario:

**Opción 1: Google Sheets (Simple)**
```
| Chat ID | Paso Actual | Datos Recopilados | Timestamp |
|---------|-------------|-------------------|-----------|
| 123456  | fecha       | {tipo: "boda"}    | 2025-12-03|
```

**Opción 2: N8N Memory (Limitado)**
- Usar variables de workflow
- Se pierde al reiniciar N8N

**Opción 3: Redis/Database (Profesional)**
- Requiere servicio externo
- Más robusto

---

## 🔄 Flujo de Datos

```
1. Usuario envía mensaje
   ↓
2. N8N recibe via Telegram Trigger
   ↓
3. Buscar estado del usuario (Google Sheets)
   ↓
4. Determinar qué pregunta hacer
   ↓
5. Validar respuesta anterior (si aplica)
   ↓
6. Guardar respuesta
   ↓
7. Actualizar estado
   ↓
8. Generar siguiente pregunta
   ↓
9. Enviar via Telegram
   ↓
10. [Si completó] → Workflow existente
```

---

## 📝 Comandos del Bot

### **Comandos Básicos**
- `/start` - Mensaje de bienvenida
- `/reservar` - Iniciar nueva reservación
- `/ayuda` - Mostrar ayuda
- `/cancelar` - Cancelar reservación actual
- `/estado` - Ver estado de reservación actual

### **Comandos Avanzados (Opcional)**
- `/paquetes` - Ver información de paquetes
- `/contacto` - Información de contacto
- `/faq` - Preguntas frecuentes

---

## 🎨 Diseño de Mensajes

### **Principios**
1. **Concisos**: Mensajes cortos y claros
2. **Visuales**: Usar emojis para claridad
3. **Guiados**: Siempre indicar qué hacer
4. **Amigables**: Tono cercano pero profesional

### **Formato Estándar**
```
[Emoji] [Título]

[Instrucción clara]

[Opciones/Ejemplo si aplica]

[Botones inline si aplica]
```

---

## ⚠️ Manejo de Errores

### **Casos a Manejar**
1. **Fecha inválida**: Repregunta con ejemplo
2. **Email inválido**: Repregunta con formato
3. **Teléfono inválido**: Repregunta con ejemplo
4. **Usuario abandona**: Guardar estado por 24h
5. **Comando desconocido**: Sugerir `/ayuda`

---

## 🔐 Validaciones

Reutilizar las mismas validaciones del formulario:
- Email: regex
- Teléfono: mínimo 10 dígitos
- Fecha: formato válido y futura
- Nombre: mínimo 3 caracteres

---

## 🚀 Estrategia de Implementación

### **Fase 1: MVP (Mínimo Viable)**
- [ ] Comando `/start` y `/ayuda`
- [ ] Flujo lineal simple (sin edición)
- [ ] Solo tipo de evento, fecha, nombre, teléfono
- [ ] Integración básica con workflow existente

### **Fase 2: Mejoras**
- [ ] Botones inline para opciones
- [ ] Validación en tiempo real
- [ ] Resumen antes de enviar
- [ ] Opción de editar

### **Fase 3: Avanzado**
- [ ] Campos dinámicos según tipo de evento
- [ ] Persistencia de estado en Google Sheets
- [ ] Notificaciones de seguimiento
- [ ] Analytics de conversaciones

---

## 🤔 Decisiones Pendientes

Antes de implementar, necesito que decidas:

1. **¿Flujo completo o simplificado?**
   - Completo: Todas las preguntas del formulario
   - Simplificado: Solo lo esencial

2. **¿Botones inline o texto libre?**
   - Botones: Más fácil para el usuario
   - Texto: Más flexible

3. **¿Dónde guardar el estado?**
   - Google Sheets (simple)
   - Otro servicio

4. **¿Debe permitir editar antes de enviar?**
   - Sí: Mejor UX
   - No: Más simple de implementar

5. **¿Qué hacer con conversaciones abandonadas?**
   - Guardar por 24h
   - Eliminar inmediatamente
   - Enviar recordatorio

---

## ✅ Próximos Pasos

1. **Responder preguntas de decisión** (arriba)
2. **Diseñar flujo detallado** según decisiones
3. **Crear estructura de datos** para estado
4. **Implementar MVP** (Fase 1)
5. **Probar y iterar**
