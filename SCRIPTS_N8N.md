# ⚡ Scripts para Nodos de Código N8N

Copia y pega estos scripts en los nodos de tipo **"Code"** (JavaScript) dentro de tu workflow de N8N.

---

## 1. Nodo: Calcular Días y Preparar Datos
**Objetivo:** Calcular cuántos días faltan para el evento y agregar un timestamp.

```javascript
// Obtener datos del input (Webhook)
const input = $input.item.json.body;  // ← Agregamos .body aquí

// Calcular días restantes
const fechaEvento = new Date(input.fecha_evento);
const hoy = new Date();
const diferencia = fechaEvento - hoy;
const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

// Retornar datos enriquecidos
return {
  ...input,
  dias_del_evento: dias,
  timestamp_solicitud: new Date().toISOString(),
  fecha_procesamiento: new Date().toLocaleString('es-ES', { timeZone: 'America/Caracas' })
};
```

---

## 2. Nodo: Clasificar Urgencia
**Objetivo:** Determinar la prioridad del lead basándose en la fecha y el paquete.

```javascript
const input = $input.item.json;
const dias = input.dias_del_evento;
const paquete = input.paquete_interes;
const tipo = input.tipo_evento;

let urgencia = "🟢 Normal";
let emoji = "🟢";

// Lógica de Urgencia
if (dias < 7) {
    urgencia = "🔴 ALTA (Menos de 1 semana)";
    emoji = "🔴";
} else if (paquete === "Enterprise") {
    urgencia = "🔴 ALTA (Cliente Enterprise)";
    emoji = "💎";
} else if (tipo === "Conferencias y eventos corporativos" && dias < 14) {
    urgencia = "🔴 ALTA (Corporativo próximo)";
    emoji = "🏢";
} else if (dias < 30) {
    urgencia = "🟡 MEDIA (Menos de 1 mes)";
    emoji = "🟡";
} else if (paquete === "Premium") {
    urgencia = "🟡 MEDIA (Paquete Premium)";
    emoji = "⭐";
}

return {
  ...input,
  nivel_urgencia: urgencia,
  emoji_urgencia: emoji
};
```

---

## 3. Nodo: Validar Datos (Opcional)
**Objetivo:** Asegurar que los datos críticos no vengan vacíos antes de procesar.
*Nota: Úsalo en un nodo "If" o "Switch", o como un nodo Code que lance error.*

```javascript
const input = $input.item.json;
const errores = [];

if (!input.nombre_cliente || input.nombre_cliente.length < 3) {
    errores.push("Nombre inválido");
}
if (!input.email_cliente || !input.email_cliente.includes('@')) {
    errores.push("Email inválido");
}
if (!input.telefono_cliente || input.telefono_cliente.length < 10) {
    errores.push("Teléfono inválido");
}

return {
    ...input,
    datos_validos: errores.length === 0,
    lista_errores: errores
};
```

---

## 4. Nodo: Validar Respuesta IA (Fallback)
**Objetivo:** Verificar si el nodo de IA (Gemini) generó una respuesta exitosa o falló.
*Nota: Úsalo después del nodo de IA para decidir si usar la respuesta personalizada o un email genérico.*

```javascript
const input = $input.item.json;

// Verificar si la IA generó una respuesta válida
const iaExitosa = input.output && input.output.length > 10 && !input.error;

return {
    ...input,
    ia_exitosa: iaExitosa,
    usar_fallback: !iaExitosa
};
```

---

## 5. Nodo: Preparar Email Genérico (Fallback)
**Objetivo:** Crear un correo de confirmación estándar cuando la IA falla.
*Nota: Úsalo en el camino "False" del nodo de validación.*

```javascript
const input = $input.item.json;

// Template de email genérico (sin personalización de IA)
const asuntoGenerico = `✅ Confirmación de Solicitud - Live Moments`;

const cuerpoGenerico = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); color: #1a1a1a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
        .highlight { color: #D4AF37; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Solicitud Recibida!</h1>
        </div>
        <div class="content">
            <p>Hola <strong>${input.nombre_cliente}</strong>,</p>
            
            <p>Hemos recibido exitosamente tu solicitud para el evento <span class="highlight">${input.tipo_evento}</span> programado para el <span class="highlight">${new Date(input.fecha_evento).toLocaleDateString('es-ES')}</span>.</p>
            
            <p>Nuestro equipo de <strong>Live Moments Production</strong> revisará los detalles y se pondrá en contacto contigo en las próximas 24 horas para confirmar disponibilidad y coordinar los siguientes pasos.</p>
            
            <p><strong>Resumen de tu solicitud:</strong></p>
            <ul>
                <li>📅 Fecha: ${new Date(input.fecha_evento).toLocaleDateString('es-ES')}</li>
                <li>📍 Ubicación: ${input.ubicacion_evento}</li>
                <li>📦 Paquete: ${input.paquete_interes}</li>
                <li>⏱️ Duración: ${input.duracion_estimada}</li>
            </ul>
            
            <p>Si tienes alguna pregunta urgente, no dudes en contactarnos.</p>
            
            <p>¡Gracias por confiar en nosotros para conservar tus mejores momentos!</p>
        </div>
        <div class="footer">
            <p>Live Moments Production | Streaming Profesional</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
`;

return {
    ...input,
    asunto_correo: asuntoGenerico,
    cuerpo_correo: cuerpoGenerico,
    tipo_email: "generico_fallback"
};
```


