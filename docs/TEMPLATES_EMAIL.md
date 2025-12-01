# 📧 Templates de Email - N8N Workflow

Este documento contiene los templates para ambos flujos: Error (False) y Éxito con IA (True).

---

## 🚨 FLUJO FALSE: Email de Error (Predeterminado)

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

## ✅ FLUJO TRUE: Email Personalizado con IA

### Paso 1: Nodo AI Agent (Google Gemini / OpenAI)

**Nombre del Nodo:** "Generar Email Personalizado"

#### Prompt para el Agente IA:

```
Eres un asistente de ventas profesional de "Live Moments Production", una empresa de streaming profesional para eventos.

Tu tarea es redactar un email de confirmación personalizado y cálido para un cliente que acaba de solicitar nuestros servicios.

DATOS DEL CLIENTE:
- Nombre: {{ $json.nombre_cliente }}
- Tipo de Evento: {{ $json.tipo_evento }}
- Fecha del Evento: {{ $json.fecha_evento }}
- Días restantes: {{ $json.dias_del_evento }} días
- Ubicación: {{ $json.ubicacion_evento }}
- Paquete de Interés: {{ $json.paquete_interes }}
- Add-ons Solicitados: {{ $json.add_ons_solicitados.join(', ') }}
- Urgencia: {{ $json.nivel_urgencia }}
- Comentarios del Cliente: {{ $json.comentarios_adicionales }}

INSTRUCCIONES:
1. Saluda al cliente por su nombre de forma cálida
2. Confirma que recibiste su solicitud
3. Menciona específicamente el tipo de evento y la fecha
4. Si la urgencia es ALTA (🔴), enfatiza que lo contactaremos de manera prioritaria en las próximas 24 horas
5. Si la urgencia es MEDIA (🟡), menciona que lo contactaremos en 48 horas
6. Si la urgencia es NORMAL (🟢), menciona que lo contactaremos en 72 horas
7. Destaca brevemente por qué el paquete seleccionado es ideal para su tipo de evento
8. Si solicitó add-ons, menciónalos como una excelente elección
9. Si NO tiene internet en el venue y NO solicitó Starlink, sugiere considerarlo sutilmente
10. Termina con próximos pasos claros y datos de contacto

TONO:
- Profesional pero cercano
- Entusiasta sobre el evento del cliente
- Confiable y experto
- Personalizado (evita sonar genérico)

FORMATO:
Genera SOLO el contenido del email en HTML, sin etiquetas <html>, <head> o <body>. 
Usa estilos inline para que funcione en cualquier cliente de email.
Incluye emojis sutiles donde sea apropiado.

LONGITUD: Máximo 300 palabras.
```

#### Configuración del Nodo:

- **Model:** `gemini-1.5-pro` o `gpt-4`
- **Temperature:** `0.7` (balance entre creatividad y coherencia)
- **Max Tokens:** `800`

---

### Paso 2: Nodo Gmail (Después del AI Agent)

**Para:** `{{ $json.email_cliente }}`  
**Asunto:** `✅ Solicitud Recibida - {{ $json.tipo_evento }} el {{ $json.fecha_evento }}`  
**Tipo:** HTML

#### Template HTML (Wrapper para el contenido de IA):

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
            background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%);
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
            <h1>🎬 Live Moments Production</h1>
            <p style="margin: 10px 0 0 0;">Streaming Profesional para Eventos</p>
        </div>
        
        <div class="content">
            {{ $json.output }}
        </div>
        
        <div class="footer">
            <p><strong>Live Moments Production</strong></p>
            <p>📞 +58 XXX XXXXXXX | 📧 info@livemoments.com</p>
            <p>© 2025 Live Moments Production. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
```

**Nota:** `{{ $json.output }}` es donde se insertará el contenido generado por el AI Agent.

---

## 🔧 Configuración Alternativa (Si el AI Agent devuelve en otro campo)

Si el AI Agent devuelve el contenido en un campo diferente (ej: `response`, `text`, `content`), ajusta la variable:

```html
{{ $json.response }}
<!-- o -->
{{ $json.text }}
<!-- o -->
{{ $json.content }}
```

---

## 🧪 Ejemplo de Output Esperado del AI Agent

```html
<p>Hola <strong>María</strong>,</p>

<p>¡Gracias por confiar en Live Moments Production para tu <strong>boda</strong> el <strong>1 de diciembre de 2025</strong>! 🎉</p>

<p>Hemos recibido tu solicitud y estamos emocionados de ser parte de este momento tan especial en <strong>Hacienda El Paraíso, Caracas</strong>.</p>

<div style="background: #fff3cd; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <p style="margin: 0;"><strong>⚡ Solicitud Prioritaria</strong></p>
    <p style="margin: 5px 0 0 0;">Como tu evento está a solo <strong>5 días</strong>, nuestro equipo te contactará en las <strong>próximas 24 horas</strong> para asegurar disponibilidad.</p>
</div>

<p>Has seleccionado nuestro <strong>Paquete Premium</strong>, una excelente elección para una boda. Con 3 cámaras HD y overlays avanzados, capturaremos cada momento especial desde múltiples ángulos.</p>

<p>Notamos que solicitaste <strong>Internet Starlink</strong> y <strong>Overlays Personalizados</strong>. ¡Perfecta decisión! Esto garantizará una transmisión estable y un toque único con tu branding.</p>

<h3 style="color: #D4AF37;">📋 Próximos Pasos:</h3>
<ol>
    <li>Nuestro equipo revisará tu solicitud</li>
    <li>Te contactaremos vía WhatsApp al <strong>+58 412 9876543</strong></li>
    <li>Prepararemos una cotización personalizada</li>
    <li>Verificaremos disponibilidad de equipos y personal</li>
</ol>

<p>¿Tienes alguna pregunta urgente? Responde a este email o llámanos directamente.</p>

<p>Saludos cordiales,<br>
<strong>Equipo de Live Moments</strong></p>
```

---

## 💡 Tips Importantes

1. **Prueba el Prompt:** Antes de conectarlo al email, prueba el AI Agent solo para ver qué genera.

2. **Manejo de Errores:** Agrega un nodo IF después del AI Agent para verificar que generó contenido válido.

3. **Fallback:** Si el AI falla, ten un email genérico de respaldo.

4. **Costos:** Ten en cuenta que cada email generado con IA tiene un costo (tokens). Para producción, considera cachear respuestas similares.

¿Quieres que te ayude a configurar el prompt del AI Agent o prefieres continuar con otro nodo del workflow?
