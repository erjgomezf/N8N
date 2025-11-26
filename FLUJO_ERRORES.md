# 🚨 Flujo de Manejo de Errores - N8N

Este documento contiene las configuraciones para manejar solicitudes con datos inválidos.

---

## 📊 1. Google Sheets - Hoja "Errores"

### Estructura de Columnas

| Columna | Nombre | Tipo | Descripción |
|---------|--------|------|-------------|
| A | Timestamp | Fecha/Hora | Cuándo ocurrió el error |
| B | Nombre Cliente | Texto | Nombre del cliente (si existe) |
| C | Email Cliente | Texto | Email del cliente (si existe) |
| D | Teléfono Cliente | Texto | Teléfono del cliente (si existe) |
| E | Tipo Evento | Texto | Tipo de evento solicitado |
| F | Errores Detectados | Texto | Lista de errores (separados por coma) |
| G | Datos Completos (JSON) | Texto | Todo el payload recibido |
| H | Estado | Texto | "Pendiente" / "Resuelto" |

### Configuración del Nodo Google Sheets

**Operación:** Append Row

**Mapeo de Campos:**
```javascript
Timestamp: {{ $json.timestamp_solicitud }}
Nombre Cliente: {{ $json.nombre_cliente || "N/A" }}
Email Cliente: {{ $json.email_cliente || "N/A" }}
Teléfono Cliente: {{ $json.telefono_cliente || "N/A" }}
Tipo Evento: {{ $json.tipo_evento || "N/A" }}
Errores Detectados: {{ $json.lista_errores.join(", ") }}
Datos Completos: {{ JSON.stringify($json) }}
Estado: Pendiente
```

---

## 📧 2. Email de Error al Cliente

### Configuración del Nodo Gmail/Email

**Para:** `{{ $json.email_cliente }}`  
**Asunto:** `⚠️ Información Incompleta - Solicitud de Streaming`  
**Tipo:** HTML

### Template HTML del Email

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .error-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .error-list {
            background: white;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .error-list li {
            color: #d32f2f;
            margin: 8px 0;
        }
        .cta-button {
            display: inline-block;
            background: #D4AF37;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ Información Incompleta</h1>
    </div>
    
    <div class="content">
        <p>Hola <strong>{{ $json.nombre_cliente || "Cliente" }}</strong>,</p>
        
        <p>Hemos recibido tu solicitud de servicio de streaming, pero notamos que <strong>falta información importante</strong> para poder procesar tu cotización.</p>
        
        <div class="error-box">
            <h3>❌ Datos Faltantes o Inválidos:</h3>
            <ul class="error-list">
                {{#each $json.lista_errores}}
                <li>{{ this }}</li>
                {{/each}}
            </ul>
        </div>
        
        <h3>📝 ¿Qué Hacer Ahora?</h3>
        <p>Por favor, completa la información faltante de una de estas formas:</p>
        
        <ol>
            <li><strong>Llena nuevamente el formulario</strong> en nuestro sitio web con los datos correctos</li>
            <li><strong>Responde a este email</strong> con la información faltante</li>
            <li><strong>Contáctanos directamente:</strong>
                <ul>
                    <li>📞 Teléfono: +58 XXX XXXXXXX</li>
                    <li>📧 Email: info@livemoments.com</li>
                    <li>💬 WhatsApp: +58 XXX XXXXXXX</li>
                </ul>
            </li>
        </ol>
        
        <center>
            <a href="TU_URL_DEL_FORMULARIO" class="cta-button">Volver al Formulario</a>
        </center>
        
        <p style="margin-top: 30px;">Estamos aquí para ayudarte a hacer realidad tu evento. No dudes en contactarnos si tienes alguna pregunta.</p>
        
        <p>Saludos cordiales,<br>
        <strong>Equipo de Live Moments</strong><br>
        Streaming Profesional para Eventos</p>
    </div>
    
    <div class="footer">
        <p>Este es un mensaje automático. Por favor no respondas directamente a este correo.</p>
        <p>© 2025 Live Moments Production. Todos los derechos reservados.</p>
    </div>
</body>
</html>
```

---

## 💬 3. Notificación de Telegram (Error)

### Configuración del Nodo Telegram

**Chat ID:** Tu ID de grupo de errores  
**Formato:** Markdown

### Template del Mensaje

```markdown
🚨 **ERROR EN SOLICITUD**

⚠️ Se recibió una solicitud con datos inválidos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 **DATOS DEL CLIENTE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📛 Nombre: {{ $json.nombre_cliente || "N/A" }}
📧 Email: {{ $json.email_cliente || "N/A" }}
📞 Teléfono: {{ $json.telefono_cliente || "N/A" }}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ **ERRORES DETECTADOS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each $json.lista_errores}}
• {{ this }}
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 **INFORMACIÓN ADICIONAL**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 Tipo de Evento: {{ $json.tipo_evento || "N/A" }}
📅 Fecha Solicitada: {{ $json.fecha_evento || "N/A" }}
⏰ Timestamp: {{ $json.timestamp_solicitud }}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **ACCIÓN TOMADA:**
• Email de error enviado al cliente
• Registro guardado en hoja "Errores"
• Estado: Pendiente de seguimiento

⚠️ **REQUIERE ATENCIÓN MANUAL**
```

---

## 🔧 Configuración Alternativa para Telegram (Sin Handlebars)

Si N8N no soporta `{{#each}}` en Telegram, usa este script en un nodo Code previo:

```javascript
const input = $input.item.json;

// Formatear errores como lista
const erroresTexto = input.lista_errores.length > 0 
    ? input.lista_errores.map(e => `• ${e}`).join('\n')
    : '• Sin errores específicos';

// Crear mensaje formateado
const mensaje = `🚨 **ERROR EN SOLICITUD**

⚠️ Se recibió una solicitud con datos inválidos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 **DATOS DEL CLIENTE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📛 Nombre: ${input.nombre_cliente || "N/A"}
📧 Email: ${input.email_cliente || "N/A"}
📞 Teléfono: ${input.telefono_cliente || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ **ERRORES DETECTADOS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${erroresTexto}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 **INFORMACIÓN ADICIONAL**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 Tipo de Evento: ${input.tipo_evento || "N/A"}
📅 Fecha Solicitada: ${input.fecha_evento || "N/A"}
⏰ Timestamp: ${input.timestamp_solicitud}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **ACCIÓN TOMADA:**
• Email de error enviado al cliente
• Registro guardado en hoja "Errores"
• Estado: Pendiente de seguimiento

⚠️ **REQUIERE ATENCIÓN MANUAL**`;

return {
    ...input,
    mensaje_telegram: mensaje
};
```

Luego en el nodo Telegram, usa: `{{ $json.mensaje_telegram }}`

---

## 📝 Notas Importantes

1. **Email Condicional:** Si `email_cliente` es inválido, el nodo de email fallará. Considera agregar un nodo IF antes para verificar que el email sea válido.

2. **Google Sheets:** Asegúrate de que la hoja "Errores" ya exista con los encabezados correctos.

3. **Telegram:** Reemplaza el Chat ID con el de tu grupo de notificaciones de errores.

4. **Orden de Ejecución:** 
   - Primero: Google Sheets (para guardar el registro)
   - Segundo: Email (puede fallar si el email es inválido)
   - Tercero: Telegram (siempre debe ejecutarse)

---

## 🧪 Prueba con el Payload de Error

Usa el último ejemplo de `PAYLOADS_PRUEBA.md` (datos incompletos) para probar este flujo.
