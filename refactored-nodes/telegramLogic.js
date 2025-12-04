/**
 * ============================================
 * NODO: Lógica del Bot de Telegram (State Machine)
 * ============================================
 * 
 * PROPÓSITO:
 * Gestionar el flujo de la conversación del bot de reservaciones.
 * Determina el siguiente paso basado en el estado actual y la entrada del usuario.
 * 
 * INPUT (desde nodos anteriores):
 * - message: Objeto del mensaje de Telegram (texto, callback_query, etc.)
 * - session: Estado actual del usuario desde Google Sheets (paso_actual, datos_json)
 * 
 * OUTPUT:
 * - response_text: Texto a enviar al usuario
 * - response_buttons: Botones inline (si aplica)
 * - next_step: Nuevo paso a guardar en Sheets
 * - update_data: Nuevos datos a guardar en Sheets
 * - action: Acción a ejecutar (ej: 'reply', 'send_to_central', 'cancel')
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const STEPS = {
  START: 'start',
  TIPO_EVENTO: 'tipo_evento',
  FECHA: 'fecha',
  CIUDAD: 'ciudad',
  PAQUETE: 'paquete',
  NOMBRE: 'nombre',
  EMAIL: 'email',
  TELEFONO: 'telefono',
  CONFIRMACION: 'confirmacion',
  COMPLETADO: 'completado'
};

const OPTIONS = {
  TIPO_EVENTO: [
    [{ text: '🎊 Eventos Sociales', callback_data: 'Eventos sociales' }],
    [{ text: '🏢 Corporativo', callback_data: 'Conferencias y eventos corporativos' }],
    [{ text: '🎮 E-Sports', callback_data: 'E-Sport y Gaming' }],
    [{ text: '🎵 Conciertos', callback_data: 'Conciertos y Eventos Artísticos' }],
    [{ text: '⛪ Religiosos', callback_data: 'Eventos Religiosos' }],
    [{ text: '⚽ Deportivos', callback_data: 'Eventos Deportivos' }]
  ],
  PAQUETE: [
    [{ text: '🥉 Básico (1 Cam)', callback_data: 'Básico' }],
    [{ text: '🥈 Estándar (2 Cam)', callback_data: 'Estándar' }],
    [{ text: '🥇 Premium (3 Cam)', callback_data: 'Premium' }],
    [{ text: '💎 Enterprise (4K)', callback_data: 'Enterprise' }]
  ],
  CONFIRMACION: [
    [{ text: '✅ Confirmar y Enviar', callback_data: 'confirmar' }],
    [{ text: '❌ Cancelar', callback_data: 'cancelar' }]
  ]
};

// ============================================
// VALIDADORES
// ============================================

const Validators = {
  fecha: (text) => {
    // Regex DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = text.match(regex);
    if (!match) return { valid: false, error: 'Formato incorrecto. Usa DD/MM/YYYY (ej: 25/12/2025)' };
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1; // Meses 0-11
    const year = parseInt(match[3]);
    
    const date = new Date(year, month, day);
    const now = new Date();
    now.setHours(0,0,0,0);
    
    if (date < now) return { valid: false, error: 'La fecha debe ser futura.' };
    
    return { valid: true, value: text };
  },
  
  ciudad: (text) => {
    if (!text || text.length < 3) return { valid: false, error: 'Por favor escribe una ciudad válida (mínimo 3 letras).' };
    return { valid: true, value: text };
  },
  
  nombre: (text) => {
    if (!text || text.length < 3) return { valid: false, error: 'Por favor escribe tu nombre completo.' };
    return { valid: true, value: text };
  },
  
  email: (text) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(text)) return { valid: false, error: 'Correo inválido. Ejemplo: nombre@correo.com' };
    return { valid: true, value: text };
  },
  
  telefono: (text) => {
    // Acepta +, espacios, guiones y números. Mínimo 10 dígitos.
    const clean = text.replace(/\D/g, '');
    if (clean.length < 10) return { valid: false, error: 'Número inválido. Incluye código de área (ej: +58 412...)' };
    return { valid: true, value: text };
  }
};

// ============================================
// LÓGICA PRINCIPAL
// ============================================

// ... (Configuración y Validadores igual que antes) ...

// ============================================
// LÓGICA PRINCIPAL
// ============================================

// ============================================
// MAPEO DE INPUTS (N8N)
// ============================================

// 1. Obtener el update de Telegram (siempre del nodo Trigger)
let telegramUpdate = {};
try {
    telegramUpdate = $('telegramTrigger').first().json;
} catch (e) {
    console.log('⚠️ No se pudo leer telegramTrigger, usando input directo');
    telegramUpdate = $input.item.json;
}

// 2. Obtener la sesión (del nodo buscarSesion)
let sessionData = {};
try {
    // Intentamos leer del nodo buscarSesion si existe
    sessionData = $('buscarSesion').first().json;
} catch (e) {
    console.log('⚠️ No se pudo leer buscarSesion, asumiendo sesión nueva');
    sessionData = {};
}

// 3. Combinar todo en un objeto de trabajo
const update = {
    ...telegramUpdate,
    ...sessionData
};

// 4. Extraer datos específicos
const session = {
    paso_actual: sessionData.paso_actual || null,
    datos_json: sessionData.datos_json || null,
    intentos_fallidos: sessionData.intentos_fallidos || 0
};

const incomingText = telegramUpdate.message?.text || '';
const incomingCallback = telegramUpdate.callback_query?.data || null;

// Debugging
console.log('--- DEBUG INFO ---');
console.log('Telegram Update:', telegramUpdate);
console.log('Session Data:', sessionData);
console.log('Incoming Callback:', incomingCallback);
console.log('Current Step:', session.paso_actual);
console.log('------------------');

let currentStep = session.paso_actual || STEPS.START;
const currentData = session.datos_json ? JSON.parse(session.datos_json) : {};
const intentos = parseInt(session.intentos_fallidos || 0);

// FALLBACK: Si estamos en START pero recibimos un callback, asumimos que es respuesta al menú
// Esto corrige el problema si la sesión no se guardó/recuperó correctamente
if (currentStep === STEPS.START && incomingCallback) {
    console.log('⚠️ Detectado callback en paso START. Forzando paso FECHA (Recovery Mode).');
    currentStep = STEPS.FECHA;
}

let response = {
  text: '',
  buttons: null, // Array de botones para N8N
  next_step: currentStep,
  update_data: currentData,
  action: 'reply',
  new_intentos: 0 // Por defecto reseteamos intentos si hay éxito
};

// Función helper para manejar validación con fallback
function handleValidation(validatorResult, rawText, successNextStep, successMessage) {
  if (validatorResult.valid) {
    // Éxito: Guardamos dato limpio y avanzamos
    response.update_data[currentStep] = validatorResult.value; // Usamos el nombre del paso como key (ej: 'fecha')
    if (currentStep === STEPS.FECHA) response.update_data.fecha_evento = validatorResult.value;
    if (currentStep === STEPS.CIUDAD) response.update_data.ubicacion_evento = validatorResult.value;
    if (currentStep === STEPS.NOMBRE) response.update_data.nombre_cliente = validatorResult.value;
    if (currentStep === STEPS.EMAIL) response.update_data.email_cliente = validatorResult.value;
    if (currentStep === STEPS.TELEFONO) response.update_data.telefono_cliente = validatorResult.value;
    
    response.text = successMessage;
    response.next_step = successNextStep;
    response.new_intentos = 0;
    return true;
  } else {
    // Error
    if (intentos >= 1) {
      // FALLBACK: Segundo error, aceptamos el dato tal cual
      response.update_data[currentStep] = rawText; // Guardamos lo que escribió
      
      // Mapeo manual de campos específicos
      if (currentStep === STEPS.FECHA) response.update_data.fecha_evento = rawText;
      if (currentStep === STEPS.CIUDAD) response.update_data.ubicacion_evento = rawText;
      if (currentStep === STEPS.NOMBRE) response.update_data.nombre_cliente = rawText;
      if (currentStep === STEPS.EMAIL) response.update_data.email_cliente = rawText;
      if (currentStep === STEPS.TELEFONO) response.update_data.telefono_cliente = rawText;

      response.update_data.revision_manual = true; // Flag para ventas
      response.update_data[`error_${currentStep}`] = validatorResult.error; // Guardamos qué falló
      
      response.text = `⚠️ No pude validar este dato, pero lo anoté tal cual para que un humano lo revise.\n\nContinuemos... ${successMessage}`;
      response.next_step = successNextStep;
      response.new_intentos = 0;
      return true;
    } else {
      // Primer error: Pedimos intentar de nuevo
      response.text = `❌ ${validatorResult.error}\n\nPor favor intenta de nuevo.`;
      response.new_intentos = intentos + 1;
      return false;
    }
  }
}

// Manejo de Comandos Globales
if (incomingText === '/cancelar') {
  return {
    text: '🚫 Reservación cancelada. Escribe /reservar para comenzar de nuevo.',
    action: 'cancel_session'
  };
}

if (incomingText === '/start' || incomingText === '/reservar') {
  return {
    text: '👋 ¡Hola! Soy el asistente de Live Moments.\n\n¿Qué tipo de evento deseas transmitir?',
    buttons: OPTIONS.TIPO_EVENTO,
    next_step: STEPS.FECHA,
    action: 'reply',
    new_intentos: 0
  };
}

// Máquina de Estados
switch (currentStep) {
  
  case STEPS.START:
    response.text = '👋 ¡Hola! Para comenzar una reservación, elige una opción:';
    response.buttons = OPTIONS.TIPO_EVENTO;
    response.next_step = STEPS.FECHA;
    break;

  case STEPS.FECHA:
    // Input anterior: TIPO_EVENTO
    if (incomingCallback) {
      response.update_data.tipo_evento = incomingCallback;
      response.text = `✅ Evento: ${incomingCallback}\n\n📅 ¿Cuál es la fecha del evento? (DD/MM/YYYY)`;
      response.next_step = STEPS.CIUDAD;
    } else {
      // Si escribió texto, asumimos que es el tipo (fallback simple)
      response.update_data.tipo_evento = incomingText;
      response.text = `📅 ¿Cuál es la fecha del evento? (DD/MM/YYYY)`;
      response.next_step = STEPS.CIUDAD;
    }
    break;

  case STEPS.CIUDAD:
    // Input anterior: FECHA
    handleValidation(
      Validators.fecha(incomingText), 
      incomingText, 
      STEPS.PAQUETE, 
      '📍 ¿En qué ciudad será el evento?'
    );
    break;

  case STEPS.PAQUETE:
    // Input anterior: CIUDAD
    handleValidation(
      Validators.ciudad(incomingText),
      incomingText,
      STEPS.NOMBRE,
      '📦 Selecciona un paquete:'
    );
    if (response.next_step === STEPS.NOMBRE) {
        response.buttons = OPTIONS.PAQUETE;
    }
    break;

  case STEPS.NOMBRE:
    // Input anterior: PAQUETE (Callback)
    if (incomingCallback) {
      response.update_data.paquete_interes = incomingCallback;
      response.text = `✅ Paquete: ${incomingCallback}\n\n👤 ¿Cuál es tu nombre completo?`;
      response.next_step = STEPS.EMAIL;
    } else {
      response.text = '⚠️ Por favor selecciona un paquete usando los botones.';
      response.buttons = OPTIONS.PAQUETE;
    }
    break;

  case STEPS.EMAIL:
    // Input anterior: NOMBRE
    handleValidation(
      Validators.nombre(incomingText),
      incomingText,
      STEPS.TELEFONO,
      '📧 ¿Cuál es tu correo electrónico?'
    );
    break;

  case STEPS.TELEFONO:
    // Input anterior: EMAIL
    handleValidation(
      Validators.email(incomingText),
      incomingText,
      STEPS.CONFIRMACION,
      '📞 ¿Cuál es tu número de teléfono?'
    );
    break;

  case STEPS.CONFIRMACION:
    // Input anterior: TELEFONO
    const validado = handleValidation(
      Validators.telefono(incomingText),
      incomingText,
      STEPS.COMPLETADO,
      '' // El mensaje se genera abajo
    );
    
    if (validado) {
      const d = response.update_data;
      const advertencia = d.revision_manual ? '\n⚠️ **Nota:** Algunos datos requieren revisión manual.\n' : '';
      
      const resumen = `
📋 **RESUMEN DE SOLICITUD**
${advertencia}
👤 **Cliente:** ${d.nombre_cliente}
📧 **Email:** ${d.email_cliente}
📞 **Tel:** ${d.telefono_cliente}

🎊 **Evento:** ${d.tipo_evento}
📅 **Fecha:** ${d.fecha_evento}
📍 **Lugar:** ${d.ubicacion_evento}
📦 **Paquete:** ${d.paquete_interes}

¿Todo correcto?
      `;
      response.text = resumen;
      response.buttons = OPTIONS.CONFIRMACION;
    }
    break;

  case STEPS.COMPLETADO:
    if (incomingCallback === 'confirmar') {
      response.text = '🎉 ¡Excelente! Tu solicitud ha sido enviada.\n\nTe hemos enviado un correo de confirmación.';
      response.action = 'send_to_central';
      response.next_step = STEPS.START;
    } else if (incomingCallback === 'cancelar') {
      response.text = '🚫 Solicitud cancelada.';
      response.action = 'cancel_session';
    } else {
      response.text = 'Por favor confirma o cancela usando los botones.';
      response.buttons = OPTIONS.CONFIRMACION;
    }
    break;

  default:
    response.text = '⚠️ Error de estado. Escribe /start para reiniciar.';
    response.next_step = STEPS.START;
}

// Validación de seguridad: nunca enviar texto vacío
if (!response.text || response.text.trim() === '') {
  response.text = '⚠️ Ocurrió un error. Por favor escribe /start para comenzar de nuevo.';
}

return response;
