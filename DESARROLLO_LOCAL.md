# 🐳 Configuración de N8N Local con Docker

## Descripción

Configuración de N8N en modo local usando Docker para desarrollo y pruebas, con exposición mediante Cloudflare Tunnel.

---

## 🚀 Comandos Rápidos

### Iniciar N8N Local
```bash
docker run -it --rm \
  --name n8n-local \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

### Exponer con Cloudflare Tunnel
```bash
cloudflared tunnel --url http://localhost:5678 --no-autoupdate
```

---

## 📋 Explicación de los Comandos

### Docker Run

```bash
docker run -it --rm --name n8n-local -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

**Flags explicadas:**
- `-it` - Modo interactivo con terminal
- `--rm` - Elimina el contenedor al detenerlo (datos persisten en volumen)
- `--name n8n-local` - Nombre del contenedor
- `-p 5678:5678` - Mapea puerto 5678 del contenedor al host
- `-v n8n_data:/home/node/.n8n` - Volumen persistente para datos
- `n8nio/n8n` - Imagen oficial de N8N

### Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:5678 --no-autoupdate
```

**Flags explicadas:**
- `--url http://localhost:5678` - URL local a exponer
- `--no-autoupdate` - Desactiva actualizaciones automáticas

---

## 🛠️ Scripts de Utilidad

### 1. Iniciar N8N (`start-n8n.sh`)

```bash
#!/bin/bash
echo "🚀 Iniciando N8N local..."
docker run -it --rm \
  --name n8n-local \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

### 2. Exponer con Cloudflare (`expose-n8n.sh`)

```bash
#!/bin/bash
echo "🌐 Exponiendo N8N con Cloudflare Tunnel..."
cloudflared tunnel --url http://localhost:5678 --no-autoupdate
```

### 3. Iniciar Todo (`dev-n8n.sh`)

```bash
#!/bin/bash
# Inicia N8N y Cloudflare Tunnel en paralelo

echo "🚀 Iniciando entorno de desarrollo N8N..."

# Iniciar N8N en background
docker run -d \
  --name n8n-local \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

echo "⏳ Esperando a que N8N esté listo..."
sleep 5

# Iniciar Cloudflare Tunnel
echo "🌐 Iniciando Cloudflare Tunnel..."
cloudflared tunnel --url http://localhost:5678 --no-autoupdate
```

### 4. Detener N8N (`stop-n8n.sh`)

```bash
#!/bin/bash
echo "🛑 Deteniendo N8N local..."
docker stop n8n-local
echo "✅ N8N detenido"
```

### 5. Ver Logs (`logs-n8n.sh`)

```bash
#!/bin/bash
echo "📋 Logs de N8N:"
docker logs -f n8n-local
```

---

## 📁 Gestión de Datos

### Ubicación del Volumen

Los datos de N8N se almacenan en el volumen Docker `n8n_data`.

### Backup de Workflows

```bash
# Exportar workflows
docker exec n8n-local n8n export:workflow --all --output=/home/node/.n8n/backups/

# Copiar backup al host
docker cp n8n-local:/home/node/.n8n/backups/ ./backups/
```

### Restaurar Workflows

```bash
# Copiar workflows al contenedor
docker cp ./workflow_streaming.json n8n-local:/home/node/.n8n/

# Importar workflow
docker exec n8n-local n8n import:workflow --input=/home/node/.n8n/workflow_streaming.json
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
docker run -it --rm \
  --name n8n-local \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=tu_password \
  -e WEBHOOK_URL=https://tu-tunnel.trycloudflare.com \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

### Configurar Webhook URL

Cuando uses Cloudflare Tunnel, la URL cambia cada vez. Para workflows:

1. Copia la URL del tunnel (ej: `https://abc-def-ghi.trycloudflare.com`)
2. En N8N, actualiza la variable de entorno `WEBHOOK_URL`
3. O configura manualmente en cada webhook

---

## 🐛 Troubleshooting

### Puerto 5678 ya en uso

```bash
# Ver qué está usando el puerto
sudo lsof -i :5678

# Detener el proceso
docker stop n8n-local
```

### Volumen lleno o corrupto

```bash
# Listar volúmenes
docker volume ls

# Eliminar volumen (⚠️ BORRA TODOS LOS DATOS)
docker volume rm n8n_data

# Crear volumen limpio
docker volume create n8n_data
```

### Cloudflare Tunnel no conecta

```bash
# Verificar que N8N esté corriendo
curl http://localhost:5678

# Reinstalar cloudflared
# Ubuntu/Debian
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

---

## 📊 Comparación: Local vs Cloud

| Característica | N8N Local (Docker) | N8N Cloud |
|----------------|-------------------|-----------|
| **Costo** | Gratis | Pago mensual |
| **Configuración** | Manual | Automática |
| **Actualizaciones** | Manual | Automáticas |
| **Webhooks** | Requiere tunnel | URL permanente |
| **Datos** | En tu máquina | En la nube |
| **Rendimiento** | Depende de tu PC | Optimizado |
| **Ideal para** | Desarrollo/Pruebas | Producción |

---

## ✅ Checklist de Configuración

- [ ] Docker instalado y funcionando
- [ ] Cloudflared instalado
- [ ] N8N corriendo en `http://localhost:5678`
- [ ] Cloudflare Tunnel exponiendo N8N
- [ ] Workflows importados
- [ ] Credenciales configuradas (Gmail, Sheets, Gemini)
- [ ] Webhook URL actualizada en formulario
- [ ] Pruebas realizadas

---

## 🚀 Workflow de Desarrollo Recomendado

1. **Iniciar entorno:**
   ```bash
   ./dev-n8n.sh
   ```

2. **Copiar URL del tunnel:**
   - Buscar en la salida: `https://xxx.trycloudflare.com`

3. **Actualizar webhook en formulario:**
   ```javascript
   const webhookUrl = 'https://xxx.trycloudflare.com/webhook-test/streaming-service';
   ```

4. **Desarrollar y probar:**
   - Editar workflows en N8N
   - Probar con formulario
   - Ver logs en tiempo real

5. **Exportar cambios:**
   ```bash
   # Desde N8N UI: Settings → Export
   # Guardar como workflow_streaming.json
   ```

6. **Detener entorno:**
   ```bash
   ./stop-n8n.sh
   ```

---

## 📝 Notas Importantes

- ⚠️ **URL del tunnel cambia** cada vez que reinicias cloudflared
- ⚠️ **Datos persisten** en el volumen Docker incluso si eliminas el contenedor
- ⚠️ **No usar en producción** sin configurar autenticación y HTTPS permanente
- ✅ **Ideal para desarrollo** y pruebas locales

---

**Última Actualización:** 2025-12-02
