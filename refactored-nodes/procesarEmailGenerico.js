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