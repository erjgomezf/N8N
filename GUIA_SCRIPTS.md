# 🚀 Guía de Uso de Scripts N8N

Esta guía explica cómo ejecutar los scripts para trabajar con N8N local.

---

## 📂 Scripts Disponibles

Tienes 3 scripts principales:
- `start-n8n.sh` - Inicia N8N en Docker
- `stop-n8n.sh` - Detiene N8N
- `expose-n8n.sh` - Expone N8N con Cloudflare Tunnel

---

## 🔄 Orden de Ejecución

### Paso 1: Iniciar N8N

```bash
cd /home/programar/Documentos/N8N
./start-n8n.sh
```

**¿Qué hace?**
- Inicia un contenedor Docker llamado `n8n-local`
- Expone N8N en `http://localhost:5678`
- Monta un volumen persistente para guardar tus workflows

**Resultado esperado:**
```
🚀 Iniciando N8N local...
[N8N] Editor is now accessible via:
[N8N] http://localhost:5678/
```

**⚠️ IMPORTANTE:** Esta terminal quedará ocupada mostrando los logs de N8N. **No la cierres**.

---

### Paso 2: Exponer N8N (En otra terminal)

Abre **una nueva terminal** y ejecuta:

```bash
cd /home/programar/Documentos/N8N
./expose-n8n.sh
```

**¿Qué hace?**
- Crea un túnel de Cloudflare que conecta internet con tu N8N local
- Genera una URL pública temporal (ej: `https://algo-random.trycloudflare.com`)

**Resultado esperado:**
```
🌐 Exponiendo N8N con Cloudflare Tunnel...
⚠️  Copia la URL que aparecerá abajo y actualízala en formulario.html

Your quick Tunnel has been created! Visit it at:
https://ejemplo-url.trycloudflare.com
```

**⚠️ IMPORTANTE:** 
- Esta terminal también quedará ocupada. **No la cierres**.
- Copia la URL generada y actualízala en tu `formulario.html`

---

### Paso 3: Detener N8N (Cuando termines)

Cuando termines de trabajar, ejecuta en **una tercera terminal**:

```bash
cd /home/programar/Documentos/N8N
./stop-n8n.sh
```

**¿Qué hace?**
- Detiene el contenedor Docker de N8N
- Libera el puerto 5678

**Resultado esperado:**
```
🛑 Deteniendo N8N local...
✅ N8N detenido exitosamente
```

Luego puedes cerrar las otras dos terminales (Ctrl+C).

---

## 📝 Resumen Visual

```
Terminal 1:                Terminal 2:                Terminal 3:
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│ ./start-n8n │           │ ./expose-n8n│           │ ./stop-n8n  │
│             │           │             │           │             │
│ (Logs N8N)  │           │ (Tunnel URL)│           │ (Al final)  │
│             │           │             │           │             │
│ NO CERRAR   │           │ NO CERRAR   │           │ Ejecutar 1x │
└─────────────┘           └─────────────┘           └─────────────┘
```

---

## 🔧 Comandos Alternativos (Sin scripts)

Si prefieres ejecutar los comandos directamente:

### Iniciar N8N:
```bash
docker run -it --rm --name n8n-local -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

### Exponer con Cloudflare:
```bash
cloudflared tunnel --url http://localhost:5678 --no-autoupdate
```

### Detener N8N:
```bash
docker stop n8n-local
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo ejecutar todo en una sola terminal?
No. Necesitas al menos 2 terminales:
- Terminal 1: N8N corriendo
- Terminal 2: Cloudflare Tunnel corriendo

### ¿Qué pasa si cierro las terminales?
- Si cierras Terminal 1 → N8N se detiene
- Si cierras Terminal 2 → El túnel se cierra y el formulario no puede enviar datos

### ¿Los datos se guardan al detener N8N?
Sí, gracias al volumen Docker `n8n_data`, tus workflows se guardan automáticamente.

### ¿La URL de Cloudflare es siempre la misma?
No, cada vez que ejecutas `expose-n8n.sh` se genera una URL diferente. Por eso debes actualizarla en `formulario.html`.

---

## 🎯 Flujo de Trabajo Típico

1. **Iniciar sesión de desarrollo:**
   ```bash
   # Terminal 1
   ./start-n8n.sh
   
   # Terminal 2
   ./expose-n8n.sh
   ```

2. **Trabajar en N8N:**
   - Abre `http://localhost:5678` en tu navegador
   - Edita tu workflow
   - Prueba con Postman usando la URL de Cloudflare

3. **Terminar sesión:**
   ```bash
   # Terminal 3
   ./stop-n8n.sh
   
   # Luego Ctrl+C en Terminal 1 y 2
   ```

---

## 💡 Tips

- **Guarda la URL de Cloudflare** en un archivo temporal mientras trabajas
- **Usa tmux o screen** si quieres mantener las sesiones abiertas sin tener múltiples ventanas
- **Exporta tu workflow** desde N8N regularmente para tener backups
