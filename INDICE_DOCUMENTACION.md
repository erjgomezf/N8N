# 📚 Índice de Documentación - Live Moments Bot

## 🚀 EMPEZAR AQUÍ

### Para Nuevos Desarrolladores
1. **[README.md](file:///home/programar/Documentos/N8N/README.md)** - ⭐ Documentación principal del proyecto
2. **[ESTADO_PROYECTO.md](file:///home/programar/Documentos/N8N/ESTADO_PROYECTO.md)** - ⭐ Estado actual y próximos pasos
3. **[walkthrough.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/walkthrough.md)** - Logros y lecciones aprendidas

### Para Continuar Desarrollo
1. **[task.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/task.md)** - Tareas pendientes y en progreso
2. **[ESTADO_PROYECTO.md](file:///home/programar/Documentos/N8N/ESTADO_PROYECTO.md)** - Qué funciona, qué falta

---

## 📋 PLANES DE IMPLEMENTACIÓN

### Arquitectura
- **[gateway_architecture_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/gateway_architecture_plan.md)** - Diseño del gateway con switch
- **[telegram_session_flow_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/telegram_session_flow_plan.md)** - Flujo de sesiones
- **[modularization_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/modularization_plan.md)** - Modularización del workflow

### Funcionalidades
- **[catalogo_dinamico_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/catalogo_dinamico_plan.md)** - Diseño del catálogo dinámico
- **[preparar_contexto_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/preparar_contexto_plan.md)** - Refactorización v2.0
- **[ai_validator_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/ai_validator_plan.md)** - Validación con Gemini
- **[correction_flow_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/correction_flow_plan.md)** - Flujo de corrección
- **[ia_bypass_plan.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/ia_bypass_plan.md)** - Bypass de validación IA

---

## 🔧 CORRECCIONES Y FIXES

- **[catalogo_fixes_23dic.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/catalogo_fixes_23dic.md)** - Fixes del catálogo dinámico
- **[resumen_final_refactoring.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/resumen_final_refactoring.md)** - Resumen de refactorización
- **[limpieza_codigo_logicaBot.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/limpieza_codigo_logicaBot.md)** - Limpieza de código
- **[n8n_fix_instructions.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/n8n_fix_instructions.md)** - Instrucciones de fixes

---

## 📊 AUDITORÍAS Y ANÁLISIS

- **[auditoria_logicaBot.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/auditoria_logicaBot.md)** - Auditoría de código obsoleto
- **[refactoring_preparar_contexto.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/refactoring_preparar_contexto.md)** - Walkthrough de refactorización

---

## 📖 GUÍAS Y CONFIGURACIÓN

- **[GUIA_CONFIGURACION_GOOGLE_SQLITE.md](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/GUIA_CONFIGURACION_GOOGLE_SQLITE.md)** - Configuración de Google OAuth
- **[canonical_data_schema.js](file:///home/programar/.gemini/antigravity/brain/9222347c-ef7b-4215-96e9-28e3ffa7519a/canonical_data_schema.js)** - Esquema de datos canónico

---

## 📚 BUENAS PRÁCTICAS

### Generales
- **[buenas-practicas.md](file:///home/programar/buenas-practicas/buenas-practicas.md)** - SOLID, DRY, KISS, patrones de diseño

### Específicas por Tecnología
- **[buenas-practicas-n8n.md](file:///home/programar/buenas-practicas/buenas-practicas-n8n.md)** - N8N workflows, seguridad, patrones
- **[buenas-practicas-javascript.md](file:///home/programar/buenas-practicas/buenas-practicas-javascript.md)** - ES6+, manejo de datos
- **[buenas-practicas-python.md](file:///home/programar/buenas-practicas/buenas-practicas-python.md)** - Django, FastAPI

### Colaboración
- **[GEMINI.md](file:///home/programar/buenas-practicas/GEMINI.md)** - ⭐ Cómo trabajar con Gemini (tu asistente)

---

## 💻 CÓDIGO FUENTE

### Nodos Principales
```
/home/programar/Documentos/N8N/refactored-nodes/
├── detectarComando.js      # Comandos globales
├── prepararContexto.js     # Catálogo + contexto (NUEVO v2.0)
├── logicaBot.js            # Máquina de estados
├── validadorIA.js          # Validación Gemini
└── ...
```

### Workflow
- **[workflow_streaming.json](file:///home/programar/Documentos/N8N/workflow_streaming.json)** - Workflow completo de N8N

---

## 🗂️ ORGANIZACIÓN POR CATEGORÍA

### 📖 Lectura Obligatoria (Antes de Empezar)
1. README.md
2. ESTADO_PROYECTO.md
3. GEMINI.md
4. buenas-practicas-n8n.md

### 🎯 Para Implementar Nueva Funcionalidad
1. task.md (ver pendientes)
2. Crear nuevo plan en `.gemini/antigravity/brain/`
3. Implementar
4. Actualizar walkthrough.md

### 🐛 Para Debugging
1. README.md (sección Debugging)
2. ESTADO_PROYECTO.md (Problemas Conocidos)
3. Logs de N8N

### 📚 Para Aprender
1. walkthrough.md (Lecciones Aprendidas)
2. buenas-practicas-*.md
3. Planes de implementación

---

## 🔍 BÚSQUEDA RÁPIDA

### "¿Cómo funciona el catálogo dinámico?"
→ `catalogo_dinamico_plan.md`

### "¿Cómo se recupera una sesión?"
→ `preparar_contexto_plan.md`

### "¿Qué hace cada nodo?"
→ `README.md` (sección Nodos Principales)

### "¿Qué falta por hacer?"
→ `task.md` o `ESTADO_PROYECTO.md`

### "¿Cómo configurar Google Sheets?"
→ `GUIA_CONFIGURACION_GOOGLE_SQLITE.md`

### "¿Cuáles son las buenas prácticas de N8N?"
→ `buenas-practicas-n8n.md`

---

## 📅 DOCUMENTOS POR FECHA

### 23 Diciembre 2024 (Última Sesión)
- README.md
- ESTADO_PROYECTO.md
- walkthrough.md (actualizado)
- limpieza_codigo_logicaBot.md
- auditoria_logicaBot.md
- resumen_final_refactoring.md

### 18 Diciembre 2024
- catalogo_dinamico_plan.md
- catalogo_fixes_23dic.md
- preparar_contexto_plan.md
- refactoring_preparar_contexto.md

### Diciembre 2024 (Anteriores)
- gateway_architecture_plan.md
- ai_validator_plan.md
- correction_flow_plan.md
- ia_bypass_plan.md
- modularization_plan.md

---

## ✅ CHECKLIST DE DOCUMENTACIÓN

Antes de continuar desarrollo, asegúrate de haber leído:

- [ ] README.md
- [ ] ESTADO_PROYECTO.md
- [ ] GEMINI.md
- [ ] buenas-practicas-n8n.md
- [ ] walkthrough.md
- [ ] task.md

---

**Última Actualización**: 23 Diciembre 2024, 15:30  
**Total de Documentos**: 25+  
**Estado**: ✅ Documentación completa y actualizada
