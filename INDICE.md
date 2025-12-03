# 📋 Índice de Documentación - Proyecto N8N

Guía rápida para navegar por toda la documentación del proyecto.

---

## 🚀 Inicio Rápido

| Documento | Descripción | Cuándo Usarlo |
|-----------|-------------|---------------|
| **[README.md](README.md)** | Documentación principal del proyecto | Primera lectura, overview general |
| **[GUIA_SCRIPTS.md](GUIA_SCRIPTS.md)** | Cómo ejecutar N8N localmente | Cada vez que inicies el entorno |

---

## ⚙️ Configuración (Primera Vez)

| Documento | Descripción | Tiempo Estimado |
|-----------|-------------|-----------------|
| **[GUIA_GMAIL_OAUTH.md](GUIA_GMAIL_OAUTH.md)** | Configurar credenciales de Gmail | 15 min |
| **[GUIA_TELEGRAM.md](GUIA_TELEGRAM.md)** | Crear bot y configurar Telegram | 10 min |

---

## 🛠️ Desarrollo

| Documento | Descripción | Cuándo Usarlo |
|-----------|-------------|---------------|
| **[SCRIPTS_N8N.md](SCRIPTS_N8N.md)** | Scripts JavaScript para nodos Code | Al crear/editar nodos Code |
| **[docs/DISEÑO_WORKFLOW.md](docs/DISEÑO_WORKFLOW.md)** | Diseño completo del workflow | Para entender la arquitectura |
| **[docs/PAYLOADS_PRUEBA.md](docs/PAYLOADS_PRUEBA.md)** | Ejemplos de datos para testing | Al probar con Postman |

---

## 📚 Referencia

| Documento | Descripción | Cuándo Usarlo |
|-----------|-------------|---------------|
| **[docs/RECURSOS_IMG.md](docs/RECURSOS_IMG.md)** | URLs de imágenes del formulario | Al actualizar imágenes |
| **[docs/TEMPLATE_EMAIL_ERROR.md](docs/TEMPLATE_EMAIL_ERROR.md)** | Template HTML de email de error | Al modificar emails |
| **[ROADMAP.md](ROADMAP.md)** | Planificación de futuras versiones | Para ver qué viene |

---

## 📖 Buenas Prácticas

| Documento | Descripción |
|-----------|-------------|
| **[buenas-practicas/buenas-practicas.md](buenas-practicas/buenas-practicas.md)** | Principios generales (SOLID, DRY, KISS) |
| **[buenas-practicas/buenas-practicas-n8n.md](buenas-practicas/buenas-practicas-n8n.md)** | Específicas para N8N |
| **[buenas-practicas/buenas-practicas-javascript.md](buenas-practicas/buenas-practicas-javascript.md)** | Específicas para JavaScript |
| **[buenas-practicas/buenas-practicas-python.md](buenas-practicas/buenas-practicas-python.md)** | Específicas para Python |

---

## 🔧 Scripts

| Script | Descripción | Comando |
|--------|-------------|---------|
| **start-n8n.sh** | Iniciar N8N en Docker | `./start-n8n.sh` |
| **stop-n8n.sh** | Detener N8N | `./stop-n8n.sh` |
| **expose-n8n.sh** | Exponer con Cloudflare Tunnel | `./expose-n8n.sh` |

---

## 🎯 Flujo de Trabajo Típico

### 1. Primera Configuración
```
README.md → GUIA_SCRIPTS.md → GUIA_GMAIL_OAUTH.md → GUIA_TELEGRAM.md
```

### 2. Desarrollo Diario
```
GUIA_SCRIPTS.md → SCRIPTS_N8N.md → PAYLOADS_PRUEBA.md
```

### 3. Modificar Workflow
```
DISEÑO_WORKFLOW.md → SCRIPTS_N8N.md → workflow_streaming.json
```

### 4. Testing
```
PAYLOADS_PRUEBA.md → Postman → N8N
```

---

## 📱 Acceso Rápido por Tarea

### "Quiero iniciar N8N"
→ [GUIA_SCRIPTS.md](GUIA_SCRIPTS.md)

### "Necesito reconectar Gmail"
→ [GUIA_GMAIL_OAUTH.md](GUIA_GMAIL_OAUTH.md) (Sección: Mantenimiento Recurrente)

### "Quiero probar el workflow"
→ [docs/PAYLOADS_PRUEBA.md](docs/PAYLOADS_PRUEBA.md)

### "Necesito modificar el email de error"
→ [docs/TEMPLATE_EMAIL_ERROR.md](docs/TEMPLATE_EMAIL_ERROR.md)

### "Quiero entender cómo funciona todo"
→ [docs/DISEÑO_WORKFLOW.md](docs/DISEÑO_WORKFLOW.md)

### "Quiero agregar un nuevo tipo de evento"
→ [docs/DISEÑO_WORKFLOW.md](docs/DISEÑO_WORKFLOW.md) + [formulario.html](formulario.html)

---

## 🆘 Solución de Problemas

| Problema | Documento |
|----------|-----------|
| N8N no inicia | [GUIA_SCRIPTS.md](GUIA_SCRIPTS.md) |
| Gmail no envía emails | [GUIA_GMAIL_OAUTH.md](GUIA_GMAIL_OAUTH.md) |
| Telegram no envía mensajes | [GUIA_TELEGRAM.md](GUIA_TELEGRAM.md) |
| Workflow no funciona | [docs/DISEÑO_WORKFLOW.md](docs/DISEÑO_WORKFLOW.md) |
| Formulario no envía datos | [docs/PAYLOADS_PRUEBA.md](docs/PAYLOADS_PRUEBA.md) |

---

**Última Actualización:** 2025-12-03
