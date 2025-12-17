/**
 * ============================================
 * NODO: ValidadorIA
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
// CÓDIGO PARA EL NODO CODE (post-ValidadorIA)
// ============================================

// Este código procesa la respuesta de Gemini y decide la acción

const input = $input.item.json;
const respuestaGemini = input.output || input.response || input.text || input;

// Intentar leer datos de prepararDatosIA primero (bypass IA), luego de logicaBot (flujo normal)
let datosUsuario;
let fuenteDatos = 'unknown';
try {
  datosUsuario = $('prepararDatosIA').first().json.update_data;
  fuenteDatos = 'prepararDatosIA';
} catch (e) {
  try {
    datosUsuario = $('logicaBot').first().json.update_data || {};
    fuenteDatos = 'logicaBot';
  } catch (e2) {
    datosUsuario = {};
    fuenteDatos = 'fallback';
  }
}
console.log(`📊 Fuente de datos: ${fuenteDatos}`);

const origen = datosUsuario.origen || 'telegram';

// ============================================
// SANITIZACIÓN PRE-VALIDACIÓN
// ============================================
// Limpiar campos que contienen caracteres sospechosos (inyección de comandos)
// Si un campo tiene caracteres inválidos, lo ponemos en null para que la IA lo detecte

const caracteresInvalidos = /[\.\/\+\&\%\@\#\$\!\?\*\<\>\|\\\^\[\]\{\}\(\)\`\~\_\=]/;

// Campos de texto que deben sanitizarse
const camposTexto = ['ubicacion_evento', 'nombre_cliente'];

for (const campo of camposTexto) {
  if (datosUsuario[campo] && caracteresInvalidos.test(datosUsuario[campo])) {
    console.log(`⚠️ Campo ${campo} contiene caracteres inválidos: "${datosUsuario[campo]}". Marcando como null.`);
    datosUsuario[`_original_${campo}`] = datosUsuario[campo]; // Guardar original para debug
    datosUsuario[campo] = null; // La IA detectará que falta
  }
  
  // También detectar si empieza con / (comando)
  if (datosUsuario[campo] && datosUsuario[campo].startsWith('/')) {
    console.log(`⚠️ Campo ${campo} parece un comando: "${datosUsuario[campo]}". Marcando como null.`);
    datosUsuario[`_original_${campo}`] = datosUsuario[campo];
    datosUsuario[campo] = null;
  }
}


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
  // Guardar errores encontrados por la IA para tracking
  datosUsuario._errores_ia = validacion.errores || [];
  
  if (validacion.campo_faltante && validacion.pregunta_usuario) {
    // Hay un campo faltante, preguntar al usuario
    action = 'ask_field';
    next_step = 'validacion_ia';
    text = validacion.pregunta_usuario;
    datosUsuario._campo_pendiente = validacion.campo_faltante;
    console.log(`❌ Campo faltante: ${validacion.campo_faltante}`);
  } else {
    // Error sin campo específico, escalar
    action = 'send_to_error_support';
    next_step = 'start';
    text = '⚠️ Hubo un problema validando tus datos. Un representante te contactará pronto.';
    console.log('⚠️ Error sin campo específico, escalando a soporte');
  }
} else {
  // Validación exitosa - limpiar campos temporales
  delete datosUsuario._campo_pendiente;
  delete datosUsuario._errores_ia;
  
  // Limpiar campos de debug de sanitización
  for (const campo of camposTexto) {
    delete datosUsuario[`_original_${campo}`];
  }
  
  datosUsuario.tipoValidacion = 'IA'; // Marcar que pasó por validación IA
  console.log('✅ Validación exitosa, limpiando campos temporales');
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
