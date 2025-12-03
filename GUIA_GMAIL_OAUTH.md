# 🔐 Guía de Configuración: Credenciales Gmail (OAuth2)

Esta guía detalla el proceso para conectar N8N con Gmail utilizando OAuth2. Dado que la aplicación en Google Cloud estará en modo "Testing", **es necesario reconectar las credenciales cada 7 días**.

---

## 🛠️ Paso 1: Crear Proyecto en Google Cloud

1. Accede a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Nuevo Proyecto** (ej: "N8N Automation").
3. Asegúrate de tener el proyecto seleccionado en el menú superior.

---

## 🔌 Paso 2: Habilitar Gmail API

1. Ve a **APIs y servicios** > **Biblioteca**.
2. Busca **"Gmail API"**.
3. Haz clic en el resultado y presiona el botón **Habilitar**.

---

## 🔐 Paso 3: Configurar Pantalla de Consentimiento

1. Ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**.
2. Selecciona **Externo** y haz clic en **Crear**.
3. Completa la información básica:
   - **Nombre de la aplicación:** "N8N Local"
   - **Correo de asistencia:** Tu email
   - **Datos de contacto:** Tu email
4. Presiona **Guardar y continuar** en las secciones de "Alcances" (Scopes) sin cambiar nada.
5. **CRÍTICO - Usuarios de prueba:**
   - En la sección "Test users", haz clic en **Add Users**.
   - **Añade tu dirección de correo Gmail** (la misma que usarás en N8N).
   - *Nota: Sin esto, la conexión fallará con un error de "Acceso denegado".*

---

## 🔑 Paso 4: Crear Credenciales OAuth

1. Ve a **APIs y servicios** > **Credenciales**.
2. Haz clic en **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**.
3. **Tipo de aplicación:** Selecciona **Aplicación web**.
4. **Nombre:** "N8N Credential".
5. **URIs de redireccionamiento autorizados:**
   - Copia la URL que te muestra N8N (usualmente `http://localhost:5678/rest/oauth2-credential/callback`).
   - Pégala en el campo correspondiente en Google Cloud.
6. Haz clic en **Crear**.
7. Se generarán tu **Client ID** y **Client Secret**. No cierres esta ventana aún.

---

## 🚀 Paso 5: Conectar en N8N

1. En N8N, abre la configuración de credenciales de Gmail.
2. Selecciona **OAuth2 (recommended)**.
3. Copia y pega el **Client ID** y **Client Secret** desde Google Cloud.
4. Haz clic en el botón **Sign in with Google**.
5. **Advertencia de Seguridad:**
   - Verás un mensaje: *"Google hasn't verified this app"*.
   - Haz clic en **Advanced** (Configuración avanzada).
   - Selecciona **Go to N8N Local (unsafe)**.
6. Concede los permisos solicitados.

---

## ⚠️ Mantenimiento Recurrente (Cada 7 Días)

Como la aplicación está en modo "Testing", el token de actualización (refresh token) expira automáticamente a los 7 días.

**Cuando el nodo de Gmail falle:**
1. Abre la credencial en N8N.
2. Haz clic en el botón **Reconnect** (o "Sign in with Google" nuevamente).
3. Vuelve a autorizar la aplicación.
4. Guarda los cambios.

*No es necesario crear nuevas credenciales en Google Cloud, solo re-autenticar en N8N.*
