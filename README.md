# 🎥 Live Moments - Bot de Reservaciones Telegram

## Estado del Proyecto: ✅ FUNCIONAL (v2.1 - Diciembre 2024)

Bot de Telegram para gestionar reservaciones de servicios de streaming en vivo, con catálogo dinámico desde Google Sheets, lógica de recuperación y código optimizado.

---

## 🚀 Características Principales

### ✅ Implementado y Funcionando

- **Catálogo Dinámico**: Paquetes y addons cargados desde Google Sheets
- **Recuperación de Sesión**: El usuario puede interrumpir y retomar en cualquier paso
- **Validación Inteligente**: Validación de datos con Gemini AI
- **Flujo de Corrección**: El usuario puede corregir cualquier dato antes de confirmar
- **Cálculo Automático de Precios**: Suma de paquete base + addons seleccionados
- **Multi-canal**: Soporta Telegram (Webhook en desarrollo)

### 🏗️ Arquitectura

```
telegramTrigger
  ↓
obtenerPaquetes (Google Sheets)
  ↓
obtenerAddons (Google Sheets)
  ↓
buscarSesion (Google Sheets)
  ↓
detectarComando (detecta /start, /cancelar, etc.)
  ↓
switchAccion
  ├─ cancelar_sesion → Update Sheets → enviarMensaje
  ├─ mostrar_ayuda → enviarMensaje
  └─ continuar_flujo → prepararContexto → logicaBot → Update Sheets → enviarMensaje
```

---

## 📁 Estructura del Proyecto

```
/home/programar/Documentos/N8N/
├── refactored-nodes/           # Nodos de código refactorizados
│   ├── detectarComando.js      # Detecta comandos globales
│   ├── prepararContexto.js     # Consolida catálogo y contexto
│   ├── logicaBot.js            # Máquina de estados principal
│   ├── validadorIA.js          # Validación con Gemini
│   └── ...
├── workflow_streaming.json     # Workflow completo de N8N
└── buenas-practicas/           # Documentación de buenas prácticas
    ├── buenas-practicas.md
    ├── buenas-practicas-n8n.md
    ├── buenas-practicas-python.md
    └── buenas-practicas-javascript.md
```

---

## 🔧 Configuración Inicial

### 1. Google Sheets

Crear libro `Catalogo_Servicios` con 2 hojas:

**Hoja "Paquetes":**
| Nombre | Descripcion | Detalle | Precio | Icono |
|--------|-------------|---------|--------|-------|
| Básico | 🥉 Básico - 1 cámara HD | ["1 cámara HD", "..."] | 150 | 🥉 |

**Hoja "Addons":**
| Nombre | Icono | precio |
|--------|-------|--------|
| 📹 Cámaras + Micrófonos adicionales | 📹 | 30 |

**Hoja "Sesiones_Telegram":**
- Estructura definida en `canonical_data_schema.js`

### 2. Credenciales Google

Ver guía completa en: `GUIA_CONFIGURACION_GOOGLE_SQLITE.md`

**Importante**: 
- Agregar email como "Usuario de prueba" en Google Cloud Console
- Renovar credenciales cada 7 días (modo desarrollo)

### 3. N8N

1. Importar `workflow_streaming.json`
2. Configurar credenciales de Google Sheets
3. Configurar token de Telegram Bot
4. Activar workflow

---

## 📊 Flujo de Conversación

```
1. Usuario: /start
2. Bot: ¿Qué tipo de evento? [Botones]
3. Usuario: Selecciona tipo
4. Bot: ¿Fecha del evento? (DD/MM/YYYY)
5. Usuario: Escribe fecha
6. Bot: ¿En qué ciudad?
7. Usuario: Escribe ciudad
8. Bot: ¿Duración? [Botones]
9. Usuario: Selecciona duración
10. Bot: ¿Tiene internet? [Botones]
11. Usuario: Selecciona Sí/No
12. Bot: Selecciona paquete [Botones dinámicos]
13. Usuario: Selecciona paquete
14. Bot: ¿Addons? [Botones dinámicos]
15. Usuario: Selecciona addons (múltiple)
16. Bot: ¿Tu nombre?
17. Usuario: Escribe nombre
18. Bot: ¿Tu email?
19. Usuario: Escribe email
20. Bot: ¿Tu teléfono?
21. Usuario: Escribe teléfono
22. Bot: ¿Comentarios?
23. Usuario: Escribe comentarios
24. Bot: Resumen + [Confirmar/Corregir/Cancelar]
25. Usuario: Confirma
26. Bot: ✅ Reservación enviada
```

---

## 🎯 Nodos Principales

### `detectarComando.js`
**Responsabilidad**: Detectar comandos globales
- `/start`, `/reservar` → continuar_flujo
- `/cancelar` → cancelar_sesion
- `/ayuda` → mostrar_ayuda

### `prepararContexto.js` (NUEVO - v2.0)
**Responsabilidad**: Consolidar catálogo y preparar contexto
- Carga paquetes y addons de Sheets
- Detecta recuperación de sesión
- Genera mensaje y botones de recuperación
- Pasa contexto completo a logicaBot

### `logicaBot.js`
**Responsabilidad**: Máquina de estados de conversación
- Maneja 13 pasos del flujo
- Valida datos con `Validators`
- Genera botones dinámicos
- Calcula precios totales

### `validadorIA.js`
**Responsabilidad**: Validación con Gemini AI
- Valida datos complejos (ubicación, fecha)
- Máximo 4 intentos
- Escalación a soporte si falla

---

## 📚 Documentación Importante

### Planes de Implementación
- `catalogo_dinamico_plan.md` - Diseño del catálogo dinámico
- `preparar_contexto_plan.md` - Arquitectura de prepararContexto
- `correction_flow_plan.md` - Flujo de corrección de datos

### Walkthroughs
- `walkthrough.md` - Logros principales del proyecto
- `refactoring_preparar_contexto.md` - Refactorización v2.0

### Correcciones y Fixes
- `catalogo_fixes_23dic.md` - Fixes del catálogo dinámico
- `resumen_final_refactoring.md` - Resumen de refactorización
- `limpieza_codigo_logicaBot.md` - Limpieza de código

### Auditorías
- `auditoria_logicaBot.md` - Auditoría de código obsoleto

---

## 🔍 Debugging

### Logs Importantes

**En `prepararContexto`:**
```
📊 Paquetes raw recibidos: 4
📊 Addons raw recibidos: 4
✅ Catálogo consolidado: 4 paquetes, 4 addons
```

**En `logicaBot` (Recuperación):**
```
🔄 Recuperación de sesión detectada - Mostrando mensaje de recuperación
🔄 Recuperación con callback activo - Procesando selección: pkg_premium
```

### Problemas Comunes

**Catálogo vacío:**
- Verificar que nodos `obtenerPaquetes` y `obtenerAddons` estén antes del switch
- Usar `.all()` no `.getAll()`

**Loop infinito en recuperación:**
- Verificar que `logicaBot` solo retorne mensaje de recuperación si `!incomingCallback`

**Botones no aparecen:**
- Verificar que `prepararContexto` esté generando `botonesRecuperacion`
- Verificar logs del catálogo

---

## 🚧 Próximos Pasos

### Prioridad ALTA
- [ ] Probar flujo completo end-to-end
- [ ] Verificar cálculo de precios en todos los escenarios
- [ ] Probar recuperación en todos los pasos

### Prioridad MEDIA
- [ ] Implementar SQLite para sesiones (reemplazar Google Sheets)
- [ ] Agregar comando `/estado` para ver reservación actual
- [ ] Mejorar mensajes de error

### Prioridad BAJA
- [ ] Integración con CRM
- [ ] Recordatorios automáticos
- [ ] Soporte multi-idioma

---

## 🤝 Contribución

### Antes de Modificar Código

1. Leer `buenas-practicas-n8n.md`
2. Leer `buenas-practicas-javascript.md`
3. Revisar `GEMINI.md` para entender el estilo de código

### Al Agregar Nuevas Funcionalidades

1. Crear plan de implementación en `.gemini/antigravity/brain/`
2. Actualizar `task.md`
3. Implementar
4. Crear walkthrough
5. Actualizar este README

---

## 📞 Contacto y Soporte

- **Proyecto**: Live Moments - Streaming Services
- **Bot**: @Streaming_n8n_bot
- **Última Actualización**: 23 Diciembre 2024
- **Versión**: 2.0 - Arquitectura Refactorizada

---

## 📝 Notas de Versión

### v2.1 (24 Dic 2024)
- ✅ Optimización masiva de `logicaBot.js` (eliminación de redundancias)
- ✅ Consistencia en comandos `/start` y `/reservar`
- ✅ Mejora visual: Botones de paquetes ahora muestran descripción
- ✅ Corrección de errores de ruteo post-cancelación

### v2.0 (23 Dic 2024)
- ✅ Catálogo dinámico desde Google Sheets
- ✅ Nuevo nodo `prepararContexto` para centralizar lógica
- ✅ Recuperación de sesión mejorada
- ✅ Limpieza de código obsoleto (-14 líneas)
- ✅ Cálculo automático de precios

### v1.0 (Dic 2024)
- ✅ Flujo básico de conversación
- ✅ Validación con Gemini AI
- ✅ Flujo de corrección de datos
- ✅ Confirmación antes de cancelar
