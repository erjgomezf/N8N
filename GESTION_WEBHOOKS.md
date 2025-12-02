# 🔗 Gestión de URLs de Webhook

## Problema Resuelto

Cada vez que reinicias Cloudflare Tunnel, la URL cambia. Esta solución te permite actualizar la URL del webhook en un solo lugar sin modificar el código del formulario.

---

## 📁 Archivos Involucrados

1. **`webhook-config.js`** - Archivo de configuración central
2. **`formulario.html`** - Carga la configuración automáticamente
3. **`update-webhook-url.sh`** - Script para actualizar la URL fácilmente

---

## 🚀 Uso Rápido

### Método 1: Script Automático (Recomendado)

```bash
./update-webhook-url.sh
```

El script te pedirá la nueva URL y la actualizará automáticamente.

### Método 2: Edición Manual

Abre `webhook-config.js` y actualiza solo estas líneas:

```javascript
// Actualiza esta URL cada vez que reinicies cloudflared
CLOUDFLARE_URL: 'https://tu-nueva-url.trycloudflare.com',

// Cambia el modo si es necesario
MODE: 'cloudflare'  // 'cloudflare', 'local', o 'production'
```

---

## 🎯 Modos Disponibles

### Modo: `cloudflare` (Desarrollo con Tunnel)
```javascript
MODE: 'cloudflare'
```
- Usa la URL de Cloudflare Tunnel
- **Cuándo usar:** Desarrollo local con exposición pública
- **URL ejemplo:** `https://abc-def.trycloudflare.com/webhook-test/streaming-service`

### Modo: `local` (Desarrollo Local Directo)
```javascript
MODE: 'local'
```
- Usa `http://localhost:5678`
- **Cuándo usar:** Pruebas locales sin necesidad de webhook público
- **URL:** `http://localhost:5678/webhook-test/streaming-service`

### Modo: `production` (Producción)
```javascript
MODE: 'production'
```
- Usa N8N Cloud
- **Cuándo usar:** Formulario en producción
- **URL:** `https://erjgomezf.app.n8n.cloud/webhook-test/streaming-service`

---

## 📝 Workflow Completo

### 1. Iniciar Entorno de Desarrollo

```bash
# Terminal 1: Iniciar N8N
./start-n8n.sh

# Terminal 2: Iniciar Cloudflare Tunnel
./expose-n8n.sh
```

### 2. Copiar URL del Tunnel

Cloudflare mostrará algo como:
```
Your quick Tunnel has been created! Visit it at:
https://adam-chemical-mba-sword.trycloudflare.com
```

### 3. Actualizar Configuración

**Opción A: Con script**
```bash
./update-webhook-url.sh
# Pega: https://adam-chemical-mba-sword.trycloudflare.com
```

**Opción B: Manual**
```javascript
// En webhook-config.js
CLOUDFLARE_URL: 'https://adam-chemical-mba-sword.trycloudflare.com',
MODE: 'cloudflare'
```

### 4. Abrir Formulario

```bash
# Abre formulario.html en tu navegador
# La URL del webhook se cargará automáticamente
```

### 5. Verificar en Consola del Navegador

Al enviar el formulario, verás:
```
🔗 Webhook URL configurada: https://adam-chemical-mba-sword.trycloudflare.com/webhook-test/streaming-service
📍 Modo actual: cloudflare
🔗 Usando webhook: https://adam-chemical-mba-sword.trycloudflare.com/webhook-test/streaming-service
```

---

## 🔄 Cambiar Entre Modos

### Para Desarrollo Local (sin tunnel)

```javascript
// webhook-config.js
MODE: 'local'
```

### Para Desarrollo con Tunnel

```javascript
// webhook-config.js
MODE: 'cloudflare'
```

### Para Producción

```javascript
// webhook-config.js
MODE: 'production'
```

---

## 🛠️ Troubleshooting

### El formulario no encuentra webhook-config.js

**Problema:** Error en consola: `Failed to load resource: webhook-config.js`

**Solución:** Asegúrate de que `webhook-config.js` esté en el mismo directorio que `formulario.html`

### La URL no se actualiza

**Problema:** Sigue usando la URL antigua

**Soluciones:**
1. Limpia la caché del navegador (Ctrl + Shift + R)
2. Verifica que `MODE` esté configurado correctamente
3. Revisa la consola del navegador para ver qué URL está usando

### Error de CORS

**Problema:** `Access-Control-Allow-Origin` error

**Solución:** 
- Si usas `MODE: 'local'`, asegúrate de que N8N esté corriendo
- Si usas `MODE: 'cloudflare'`, verifica que la URL del tunnel sea correcta

---

## 📊 Comparación de Métodos

| Método | Ventajas | Desventajas |
|--------|----------|-------------|
| **Archivo Externo** | ✅ Un solo lugar para actualizar<br>✅ Fácil cambiar entre modos<br>✅ No modifica el HTML | ⚠️ Requiere archivo adicional |
| **Hardcoded** | ✅ Simple<br>✅ Sin dependencias | ❌ Hay que editar HTML cada vez<br>❌ Propenso a errores |
| **Variable de Entorno** | ✅ Muy profesional | ❌ Complejo para HTML estático |

---

## 💡 Tips Adicionales

### 1. Crear Alias para Actualización Rápida

```bash
# En ~/.bashrc o ~/.zshrc
alias update-webhook='cd /home/programar/Documentos/N8N && ./update-webhook-url.sh'
```

Luego solo ejecuta:
```bash
update-webhook
```

### 2. Guardar URLs Frecuentes

Crea un archivo `urls.txt` con tus URLs más usadas:
```
# URLs de Cloudflare Tunnel recientes
https://adam-chemical-mba-sword.trycloudflare.com
https://xyz-abc-def.trycloudflare.com
```

### 3. Automatizar con Script

```bash
#!/bin/bash
# auto-update-webhook.sh
# Extrae la URL del output de cloudflared y actualiza automáticamente

cloudflared tunnel --url http://localhost:5678 --no-autoupdate 2>&1 | \
  grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' | \
  head -1 | \
  xargs -I {} sed -i "s|CLOUDFLARE_URL: '.*'|CLOUDFLARE_URL: '{}'|g" webhook-config.js
```

---

## ✅ Checklist de Configuración

- [ ] `webhook-config.js` creado
- [ ] `formulario.html` actualizado con `<script src="webhook-config.js"></script>`
- [ ] `update-webhook-url.sh` tiene permisos de ejecución
- [ ] Modo configurado correctamente (`cloudflare`, `local`, o `production`)
- [ ] URL de Cloudflare actualizada
- [ ] Formulario probado en navegador
- [ ] Consola del navegador muestra la URL correcta

---

**Última Actualización:** 2025-12-02
