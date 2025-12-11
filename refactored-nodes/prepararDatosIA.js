/**
 * ============================================
 * NODO: prepararDatosIA
 * ============================================
 * 
 * PROPÓSITO:
 * Preparar los datos cuando el usuario responde a una pregunta de la IA.
 * Este nodo se usa cuando tipoValidacion = 'IA' para bypass de logicaBot.
 * 
 * INPUT:
 * - Session data desde buscarSesion (incluye datos_json con _campo_pendiente)
 * - Telegram message desde telegramTrigger
 * 
 * OUTPUT:
 * - update_data: Datos completos con el campo corregido
 * - campo_pendiente: El campo que se está corrigiendo
 * - respuesta_usuario: El valor nuevo que el usuario proporcionó
 * - Para AI Agent: contexto completo para re-validar
 */

const session = $input.item.json;
const telegramData = $('telegramTrigger').first().json;

// Obtener el texto o callback del usuario
const incomingText = telegramData.message?.text || '';
const incomingCallback = telegramData.callback_query?.data || '';
const userInput = incomingText || incomingCallback;

// Obtener chat_id
const chatId = telegramData.message?.chat?.id || telegramData.callback_query?.message?.chat?.id;

// Parsear datos existentes de la sesión
let datosUsuario = {};
try {
  datosUsuario = JSON.parse(session.datos_json || '{}');
  console.log('✅ datos_json parseado correctamente:', JSON.stringify(datosUsuario));
} catch (e) {
  console.error('❌ Error parseando datos_json:', e);
  console.log('Raw datos_json:', session.datos_json);
  datosUsuario = {};
}

// Obtener el campo pendiente y los errores anteriores
const campoPendiente = datosUsuario._campo_pendiente || null;
const erroresAnteriores = datosUsuario._errores_ia || [];
const intentosActuales = parseInt(datosUsuario.intentos_validacion || 0);

console.log(`🔍 Campo pendiente: ${campoPendiente}`);
console.log(`📝 Respuesta del usuario: ${userInput}`);

// Si hay un campo pendiente y el usuario envió algo, actualizar
if (campoPendiente && userInput) {
  console.log(`✏️ Actualizando campo ${campoPendiente} con valor: ${userInput}`);
  datosUsuario[campoPendiente] = userInput;
}

// Incrementar contador de intentos
datosUsuario.intentos_validacion = intentosActuales + 1;

// Preparar contexto para el AI Agent
// El AI Agent necesita saber: datos actuales, qué campo se corrigió, y el valor nuevo
const contextoIA = {
  datos_actuales: datosUsuario,
  campo_corregido: campoPendiente,
  valor_nuevo: userInput,
  intentos: datosUsuario.intentos_validacion,
  errores_anteriores: erroresAnteriores
};

return {
  // Datos principales para el AI Agent
  update_data: datosUsuario,
  
  // Contexto adicional para el AI Agent's User Message
  campo_pendiente: campoPendiente,
  respuesta_usuario: userInput,
  contexto_validacion: JSON.stringify(contextoIA),
  
  // Metadata
  chat_id: chatId,
  origen: datosUsuario.origen || 'telegram',
  intentos_validacion: datosUsuario.intentos_validacion,
  tipoValidacion: 'IA',
  
  // Debug
  _debug: {
    session_raw: session,
    campo_pendiente: campoPendiente,
    user_input: userInput,
    datos_parseados: datosUsuario,
    timestamp: new Date().toISOString()
  }
};