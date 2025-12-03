# 📧 Template de Email - Flujo de Errores

Este documento contiene el template HTML para el email que se envía cuando hay datos inválidos en el formulario.

---

## 🚨 Email de Error (Datos Inválidos)

### Configuración del Nodo Gmail

**Para:** `{{ $json.email_cliente }}`  
**Asunto:** `⚠️ Información Incompleta - Solicitud de Streaming`  
**Tipo:** HTML

### Template HTML

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
            background-color: #f4f4f4;
        }
        .email-container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .error-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
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
            color: white !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .contact-info {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            padding: 20px;
            background: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>⚠️ Información Incompleta</h1>
        </div>
        
        <div class="content">
            <p>Hola <strong>{{ $json.nombre_cliente || "Cliente" }}</strong>,</p>
            
            <p>Hemos recibido tu solicitud de servicio de streaming, pero notamos que <strong>falta información importante</strong> para poder procesar tu cotización.</p>
            
            <div class="error-box">
                <h3 style="margin-top: 0;">❌ Datos Faltantes o Inválidos:</h3>
                <ul class="error-list">
                    <li>{{ $json.lista_errores.join('</li><li>') }}</li>
                </ul>
            </div>
            
            <h3>📝 ¿Qué Hacer Ahora?</h3>
            <p>Por favor, completa la información faltante de una de estas formas:</p>
            
            <ol>
                <li><strong>Llena nuevamente el formulario</strong> en nuestro sitio web con los datos correctos</li>
                <li><strong>Responde a este email</strong> con la información faltante</li>
            </ol>
            
            <div class="contact-info">
                <h4 style="margin-top: 0;">📞 Contáctanos Directamente:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li>📞 Teléfono: +58 XXX XXXXXXX</li>
                    <li>📧 Email: info@livemoments.com</li>
                    <li>💬 WhatsApp: +58 XXX XXXXXXX</li>
                </ul>
            </div>
            
            <center>
                <a href="TU_URL_DEL_FORMULARIO" class="cta-button">Volver al Formulario</a>
            </center>
            
            <p style="margin-top: 30px;">Estamos aquí para ayudarte a hacer realidad tu evento. No dudes en contactarnos si tienes alguna pregunta.</p>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo de Live Moments</strong><br>
            <em>Streaming Profesional para Eventos</em></p>
        </div>
        
        <div class="footer">
            <p>Este es un mensaje automático generado por nuestro sistema.</p>
            <p>© 2025 Live Moments Production. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
```

---

## 📝 Notas de Implementación

1. **Lista de Errores:** El template usa `{{ $json.lista_errores.join('</li><li>') }}` para mostrar dinámicamente los errores detectados.

2. **Información de Contacto:** Actualiza los números de teléfono y emails con los datos reales de tu empresa.

3. **URL del Formulario:** Reemplaza `TU_URL_DEL_FORMULARIO` con la URL real donde está alojado tu formulario.

4. **Personalización:** El nombre del cliente se muestra dinámicamente, con un fallback a "Cliente" si no está disponible.
