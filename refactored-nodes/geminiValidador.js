/**
 * ============================================
 * NODO: geminiValidador
 * ============================================
 * 
 * PROPÓSITO:
 * Valida los datos recolectados usando Gemini AI.
 * Si falta algún dato, genera una pregunta directa para el usuario.
 * 
 * INPUT:
 * - update_data: Datos del usuario desde la sesión de Telegram
 * 
 * OUTPUT:
 * - valido: boolean
 * - campo_faltante: string | null
 * - pregunta_usuario: string | null
 * - action: 'send_to_central' | 'ask_field' | 'send_to_error_support'
 * 
 * CONFIGURACIÓN EN N8N:
 * 1. Agregar nodo "Google Gemini Chat Model"
 * 2. Usar este prompt en el nodo "Basic LLM Chain" o "AI Agent"
 */

// ============================================
// PROMPT PARA GEMINI
// ============================================

const PROMPT_VALIDACION = `
Eres un validador de datos para "Live Moments", un servicio de streaming profesional para eventos.

Tu tarea es validar que los datos de la solicitud estén completos y correctos.

DATOS RECIBIDOS:
\`\`\`json
{{JSON_DATOS}}
\`\`\`

REGLAS DE VALIDACIÓN:
1. tipo_evento: No debe estar vacío. Valores válidos: "Eventos sociales", "Conferencias y eventos corporativos", "E-Sport y Gaming", "Conciertos y Eventos Artísticos", "Eventos Religiosos", "Eventos Deportivos"
2. fecha_evento: Formato DD/MM/YYYY o YYYY-MM-DD, debe ser fecha futura
3. ubicacion_evento: Mínimo 3 caracteres, debe ser una ciudad o dirección real
4. paquete_interes: Valores válidos: "Básico", "Estándar", "Premium", "Enterprise"
5. nombre_cliente: Mínimo 3 caracteres, debe parecer un nombre real
6. email_cliente: Debe ser un email válido (contener @ y dominio)
7. telefono_cliente: Debe contener números (al menos 7 dígitos)

INSTRUCCIONES:
- Si TODOS los campos están presentes y válidos, responde con valido: true
- Si FALTA algún campo o es inválido, identifica EL PRIMER campo con problema
- Genera una pregunta AMIGABLE y DIRECTA para solicitar ese dato
- Sé conversacional pero profesional

RESPONDE ÚNICAMENTE EN ESTE FORMATO JSON (sin markdown, sin explicación):
{
  "valido": true/false,
  "campo_faltante": "nombre_del_campo" o null si todo está bien,
  "pregunta_usuario": "Pregunta amigable para pedir el dato faltante" o null,
  "errores": ["lista de problemas encontrados"] o []
}
`;

// ============================================
// CÓDIGO PARA EL NODO CODE (post-Gemini)
// ============================================

// Este código procesa la respuesta de Gemini y decide la acción

const input = $input.item.json;
const respuestaGemini = input.output || input.response || input.text || input;
const datosUsuario = $('logicaBot').first().json.update_data || {};
const origen = datosUsuario.origen || 'telegram';

// Parsear respuesta de Gemini si es string
let validacion;
try {
  validacion = typeof respuestaGemini === 'string' 
    ? JSON.parse(respuestaGemini.replace(/```json|```/g, '').trim())
    : respuestaGemini;
} catch (e) {
  console.error('Error parseando respuesta de Gemini:', e);
  // Fallback: asumir que hay error y escalar
  validacion = {
    valido: false,
    campo_faltante: null,
    pregunta_usuario: null,
    errores: ['Error procesando validación de IA']
  };
}

// Determinar acción
let action = 'send_to_central';
let next_step = 'completado';
let text = '🎉 ¡Excelente! Tu solicitud ha sido enviada.\n\nTe hemos enviado un correo de confirmación.';

if (!validacion.valido) {
  if (validacion.campo_faltante && validacion.pregunta_usuario) {
    // Hay un campo faltante, preguntar al usuario
    action = 'ask_field';
    next_step = 'validacion_ia';
    text = validacion.pregunta_usuario;
    datosUsuario._campo_pendiente = validacion.campo_faltante;
  } else {
    // Error sin campo específico, escalar
    action = 'send_to_error_support';
    next_step = 'start';
    text = '⚠️ Hubo un problema validando tus datos. Un representante te contactará pronto.';
  }
}

return {
  // Datos para el siguiente nodo
  validacion_result: validacion,
  action: action,
  next_step: next_step,
  text: text,
  update_data: datosUsuario,
  origen: origen,
  
  // Metadata
  _debug: {
    respuesta_gemini_raw: respuestaGemini,
    timestamp: new Date().toISOString()
  }
};
