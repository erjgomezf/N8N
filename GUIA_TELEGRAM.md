# 🤖 Guía de Configuración: Telegram Bot para N8N

Esta guía detalla el proceso completo para crear un bot de Telegram y conectarlo con N8N para enviar notificaciones.

---

## 📋 Requisitos Previos

- Cuenta de Telegram (en tu teléfono o aplicación de escritorio)
- N8N corriendo localmente o en la nube

---

## 🤖 Paso 1: Crear el Bot con BotFather

1. **Abre Telegram** y busca el usuario **@BotFather** (es el bot oficial de Telegram para crear bots).
   - Puedes buscarlo en la barra de búsqueda o usar este enlace: https://t.me/botfather

2. **Inicia una conversación** con BotFather:
   - Haz clic en **Start** o envía `/start`

3. **Crea un nuevo bot:**
   - Envía el comando: `/newbot`
   
4. **Elige un nombre para tu bot:**
   - BotFather te preguntará: *"Alright, a new bot. How are we going to call it?"*
   - Escribe el nombre que quieras (ej: "Live Moments Notifications")
   - Este es el nombre que verán los usuarios

5. **Elige un username para tu bot:**
   - BotFather te preguntará: *"Now, let's choose a username for your bot."*
   - Debe terminar en "bot" (ej: `livemoments_notif_bot`)
   - Debe ser único en todo Telegram
   - **IMPORTANTE:** Guarda este username, lo necesitarás después

6. **Obtén el Token:**
   - BotFather te responderá con un mensaje que incluye tu **HTTP API Token**
   - Se verá algo así: `7123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`
   - **CRÍTICO:** Copia y guarda este token de forma segura. Es como una contraseña.

---

## 💬 Paso 2: Crear un Grupo/Canal para Notificaciones

Tienes dos opciones según tus necesidades:

### Opción A: Grupo Privado (Recomendado para equipos)

1. **Crea un nuevo grupo** en Telegram:
   - Abre Telegram > Menú > "Nuevo Grupo"
   - Nombre: "Notificaciones Live Moments" (o el que prefieras)
   
2. **Añade a tu bot al grupo:**
   - En el grupo, ve a los miembros
   - Haz clic en "Añadir miembro"
   - Busca tu bot por su username (ej: `@livemoments_notif_bot`)
   - Añádelo al grupo

3. **Dale permisos de administrador al bot:**
   - Ve a la configuración del grupo
   - Selecciona "Administradores"
   - Añade tu bot como administrador
   - **IMPORTANTE:** Activa el permiso "Publicar mensajes" (si es un canal) o asegúrate de que pueda enviar mensajes

### Opción B: Canal Privado (Para notificaciones unidireccionales)

1. **Crea un nuevo canal:**
   - Telegram > Menú > "Nuevo Canal"
   - Nombre: "Notificaciones Live Moments"
   - Tipo: Privado

2. **Añade tu bot como administrador:**
   - En el canal, ve a "Administradores"
   - Añade tu bot
   - Dale permisos para "Publicar mensajes"

---

## 🔑 Paso 3: Obtener el Chat ID

El **Chat ID** es el identificador único del grupo/canal donde el bot enviará mensajes.

### Método 1: Usando un Bot Helper (Más Fácil)

1. **Busca el bot** `@userinfobot` en Telegram
2. **Añádelo a tu grupo/canal** (temporalmente)
3. El bot te enviará automáticamente el **Chat ID** del grupo
4. **Copia el Chat ID** (será un número como `-1001234567890`)
5. **Remueve el bot** del grupo si quieres

### Método 2: Usando la API de Telegram

1. **Envía un mensaje** en el grupo/canal donde está tu bot
2. **Abre tu navegador** y ve a esta URL (reemplaza `TU_TOKEN` con el token de tu bot):
   ```
   https://api.telegram.org/botTU_TOKEN/getUpdates
   ```
   Ejemplo:
   ```
   https://api.telegram.org/bot7123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw/getUpdates
   ```

3. **Busca el Chat ID** en la respuesta JSON:
   - Busca la sección `"chat":{"id":-1001234567890}`
   - El número después de `"id":` es tu **Chat ID**
   - **Nota:** Para grupos/canales, el Chat ID siempre empieza con `-100`

---

## 🔧 Paso 4: Configurar Credenciales en N8N

1. **Abre N8N** y ve a **Credentials** (Credenciales)

2. **Crea una nueva credencial:**
   - Haz clic en **+ New**
   - Busca y selecciona **Telegram API**

3. **Completa los campos:**
   - **Credential Name:** "Telegram Live Moments" (o el nombre que prefieras)
   - **Access Token:** Pega el token que te dio BotFather
   - Haz clic en **Save**

---

## 📤 Paso 5: Configurar el Nodo Telegram en tu Workflow

1. **Añade un nodo Telegram** a tu workflow:
   - Arrastra el nodo **Telegram** al canvas
   - Selecciona la operación **Send Message**

2. **Configura el nodo:**
   - **Credential:** Selecciona la credencial que creaste
   - **Chat ID:** Pega el Chat ID de tu grupo/canal (ej: `-1001234567890`)
   - **Text:** Escribe el mensaje o usa expresiones de N8N

3. **Formato del mensaje:**
   - **Parse Mode:** Selecciona **Markdown** para usar formato
   - Puedes usar:
     - `**Negrita**` para texto en negrita
     - `*Cursiva*` para cursiva
     - `` `Código` `` para código inline
     - Emojis directamente (ej: 🔴, ✅, 📧)

---

## 🧪 Paso 6: Probar la Integración

1. **Ejecuta el workflow** en modo de prueba
2. **Verifica** que el mensaje llegue a tu grupo/canal de Telegram
3. Si no funciona, revisa:
   - ✅ El bot está en el grupo/canal
   - ✅ El bot tiene permisos de administrador
   - ✅ El Chat ID es correcto (empieza con `-100` para grupos)
   - ✅ El token es correcto

---

## 📝 Ejemplo de Mensaje Formateado

```markdown
🚨 **NUEVA SOLICITUD**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 **DATOS DEL CLIENTE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📛 Nombre: {{ $json.nombre_cliente }}
📧 Email: {{ $json.email_cliente }}
📞 Teléfono: {{ $json.telefono_cliente }}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 **DETALLES DEL EVENTO**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tipo: {{ $json.tipo_evento }}
📅 Fecha: {{ $json.fecha_evento }}
📍 Ubicación: {{ $json.ubicacion_evento }}
⏱️ Duración: {{ $json.duracion_estimada }}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 **PAQUETE Y URGENCIA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Paquete: {{ $json.paquete_interes }}
{{ $json.emoji_urgencia }} Urgencia: {{ $json.nivel_urgencia }}
📆 Días restantes: {{ $json.dias_del_evento }}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **ACCIÓN REQUERIDA:**
Contactar al cliente en las próximas 24 horas
```

---

## 🔒 Seguridad y Buenas Prácticas

1. **Nunca compartas el token del bot** públicamente
2. **Usa grupos privados** para notificaciones sensibles
3. **Revoca el token** si crees que fue comprometido:
   - Habla con @BotFather
   - Envía `/revoke`
   - Selecciona tu bot
   - Genera un nuevo token

4. **Limita los administradores** del grupo/canal

---

## ❓ Solución de Problemas

### El bot no envía mensajes

- ✅ Verifica que el bot esté en el grupo/canal
- ✅ Verifica que tenga permisos de administrador
- ✅ Revisa que el Chat ID sea correcto
- ✅ Asegúrate de que el token sea válido

### Error "Chat not found"

- El Chat ID es incorrecto
- El bot no está en ese grupo/canal
- El grupo/canal fue eliminado

### Error "Bot was kicked from the group"

- Vuelve a añadir el bot al grupo
- Dale permisos de administrador

---

## 📚 Recursos Adicionales

- [Documentación oficial de Telegram Bots](https://core.telegram.org/bots)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [Telegram Bot API](https://core.telegram.org/bots/api)
