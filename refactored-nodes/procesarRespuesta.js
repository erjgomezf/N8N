/**
 * ============================================
 * NODO: procesarRespuesta
 * ============================================
 * 
 * PROPÓSITO:
 * Procesa la respuesta del AI Agent y genera el HTML necesario
 * para el correo de confirmación personalizado.
 * 
 * INPUT (desde AI Agent):
 * - output: Objeto JSON con la respuesta estructurada de la IA
 *   - asunto, saludo, parrafo_confirmacion, despedida
 *   - recomendaciones: { paquete, addons, consideraciones }
 *   - proximos_pasos: Array de strings
 * 
 * INPUT (desde formularioValido):
 * - Datos originales del cliente y evento
 * 
 * OUTPUT:
 * - asunto, saludo, despedida (texto plano)
 * - paquete_html, addons_html, consideraciones_html, proximos_pasos_html
 * - Datos del cliente para el resumen
 * 
 * UBICACIÓN EN FLUJO:
 * AI Agent → procesarRespuesta → correoConfirmacionCliente
 * 
 * AUTOR: Live Moments Team
 * ÚLTIMA ACTUALIZACIÓN: 2025-12-11
 */

// Obtener la respuesta del AI Agent
const aiOutput = $input.item.json.output;

// Obtener datos originales del formulario
const formData = $('formularioValido').item.json;
// ============================================
// 1. CONVERTIR ADD-ONS A HTML
// ============================================
let addonsHTML = '';
if (aiOutput.recomendaciones.addons && aiOutput.recomendaciones.addons.length > 0) {
  addonsHTML = aiOutput.recomendaciones.addons
    .map(addon => `<li>${addon}</li>`)
    .join('');
} else {
  // Si no hay add-ons, mostrar mensaje
  addonsHTML = '<li>No hay recomendaciones adicionales en este momento.</li>';
}
// ============================================
// 2. CONVERTIR PRÓXIMOS PASOS A HTML
// ============================================
const proximosPasosHTML = aiOutput.proximos_pasos
  .map((paso, index) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
        <table width="100%">
          <tr>
            <td width="40" style="vertical-align: top;">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); border-radius: 50%; color: white; font-weight: 700; font-size: 14px; text-align: center; line-height: 32px;">
                ${index + 1}
              </div>
            </td>
            <td style="color: #555555; font-size: 14px; line-height: 1.6; padding-left: 10px;">
              ${paso}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `)
  .join('');
// ============================================
// 3. GENERAR HTML PARA RECOMENDACIÓN DE PAQUETE
// ============================================
let paqueteHTML = '';
if (aiOutput.recomendaciones.paquete) {
  paqueteHTML = `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; border-radius: 4px; margin-bottom: 15px;">
      <tr>
        <td style="padding: 15px 20px;">
          <p style="margin: 0; color: #2E7D32; font-size: 14px; line-height: 1.6;">
            <strong>📦 Sobre tu paquete:</strong><br>
            ${aiOutput.recomendaciones.paquete}
          </p>
        </td>
      </tr>
    </table>
  `;
}
// ============================================
// 4. GENERAR HTML PARA CONSIDERACIONES
// ============================================
let consideracionesHTML = '';
if (aiOutput.recomendaciones.consideraciones) {
  consideracionesHTML = `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #E3F2FD; border-left: 4px solid #2196F3; border-radius: 4px; margin-bottom: 25px;">
      <tr>
        <td style="padding: 15px 20px;">
          <p style="margin: 0; color: #1565C0; font-size: 14px; line-height: 1.6;">
            <strong>ℹ️ Importante:</strong><br>
            ${aiOutput.recomendaciones.consideraciones}
          </p>
        </td>
      </tr>
    </table>
  `;
}
// ============================================
// 5. RETORNAR DATOS PROCESADOS
// ============================================
return {
  // Datos del AI procesados
  asunto: aiOutput.asunto,
  saludo: aiOutput.saludo,
  parrafo_confirmacion: aiOutput.parrafo_confirmacion,
  despedida: aiOutput.despedida,
  tono_detectado: aiOutput.tono_detectado,
  
  // HTML generado
  paquete_html: paqueteHTML,
  addons_html: addonsHTML,
  consideraciones_html: consideracionesHTML,
  proximos_pasos_html: proximosPasosHTML,
  
  // Datos originales del formulario (para el resumen)
  nombre_cliente: formData.nombre_cliente,
  email_cliente: formData.email_cliente,
  tipo_evento: formData.tipo_evento,
  fecha_evento: formData.fecha_evento,
  ubicacion_evento: formData.ubicacion_evento,
  paquete_interes: formData.paquete_interes,
  
  // Datos completos del AI (por si los necesitas)
  ai_response_completo: aiOutput
};