/**
 * ============================================
 * NODO: logicaBot (State Machine)
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
  MENU_CORRECCION: 'menu_correccion',      // Nuevo: menú para elegir qué corregir
  CORRIGIENDO_CAMPO: 'corrigiendo_campo',  // Nuevo: capturando nuevo valor
  
  // Nuevos pasos Canónicos (UDO)
  DURACION: 'duracion',
  INTERNET: 'internet',
  ADDONS: 'addons',
  COMENTARIOS: 'comentarios',
  VALIDACION_IA: 'validacion_ia',
  COMPLETADO: 'completado'
};

// Configuración del AI Validator
const AI_CONFIG = {
  MAX_INTENTOS: 4,
  ORIGEN: 'telegram',  // Identificador del canal
  CAMPOS_REQUERIDOS: [
    'tipo_evento',
    'fecha_evento',
    'ubicacion_evento',
    'paquete_interes',
    'nombre_cliente',
    'email_cliente',
    'telefono_cliente'
  ]
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
    [{ text: '✏️ Corregir un dato', callback_data: 'corregir' }],
    [{ text: '❌ Cancelar', callback_data: 'cancelar' }]
  ],
  MENU_CORRECCION: [
    [{ text: '🎊 Tipo de Evento', callback_data: 'edit_tipo_evento' }],
    [{ text: '📅 Fecha', callback_data: 'edit_fecha_evento' }],
    [{ text: '📍 Ciudad', callback_data: 'edit_ubicacion_evento' }],
    [{ text: '📦 Paquete', callback_data: 'edit_paquete_interes' }],
    [{ text: '👤 Nombre', callback_data: 'edit_nombre_cliente' }],
    [{ text: '📧 Email', callback_data: 'edit_email_cliente' }],
    [{ text: '📞 Teléfono', callback_data: 'edit_telefono_cliente' }],
    [{ text: '⬅️ Volver al Resumen', callback_data: 'volver_resumen' }]
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
    
    // Detectar caracteres sospechosos (posible inyección de comandos)
    // Permitir: letras, números, espacios, comas, acentos, ñ, guiones simples entre palabras
    const caracteresInvalidos = /[\.\/\+\&\%\@\#\$\!\?\*\<\>\|\\\^\[\]\{\}\(\)\`\~\_\=]/;
    if (caracteresInvalidos.test(text)) {
      return { valid: false, error: 'La ciudad contiene caracteres no válidos. Solo letras, espacios y comas.' };
    }
    
    // Rechazar si empieza con / (comando de bot)
    if (text.startsWith('/')) {
      return { valid: false, error: 'Eso parece un comando, no una ciudad. Por favor escribe el nombre de la ciudad.' };
    }
    
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
  new_intentos: 0, // Por defecto reseteamos intentos si hay éxito
  tipoValidacion: 'BOT' // Por defecto, el bot controla la validación
};

// Función helper para generar mensaje de resumen según el paso actual
function generarMensajeResumen(paso, datos) {
  const resumenDatos = [];
  if (datos.tipo_evento) resumenDatos.push(`🎊 Evento: ${datos.tipo_evento}`);
  if (datos.fecha_evento) resumenDatos.push(`📅 Fecha: ${datos.fecha_evento}`);
  if (datos.ubicacion_evento) resumenDatos.push(`📍 Ciudad: ${datos.ubicacion_evento}`);
  if (datos.paquete_interes) resumenDatos.push(`📦 Paquete: ${datos.paquete_interes}`);
  if (datos.nombre_cliente) resumenDatos.push(`👤 Nombre: ${datos.nombre_cliente}`);
  if (datos.email_cliente) resumenDatos.push(`📧 Email: ${datos.email_cliente}`);
  
  const datosStr = resumenDatos.length > 0 ? `**Datos guardados:**\n${resumenDatos.join('\n')}\n\n` : '';
  
  const mensajesPorPaso = {
    [STEPS.FECHA]: '¿Qué tipo de evento deseas transmitir?',
    [STEPS.CIUDAD]: '📅 ¿Cuál es la fecha del evento? (DD/MM/YYYY)',
    [STEPS.PAQUETE]: '📍 ¿En qué ciudad será el evento?',
    [STEPS.NOMBRE]: '📦 Selecciona un paquete:',
    [STEPS.EMAIL]: '👤 ¿Cuál es tu nombre completo?',
    [STEPS.TELEFONO]: '📧 ¿Cuál es tu correo electrónico?',
    [STEPS.CONFIRMACION]: '📞 ¿Cuál es tu número de teléfono?',
    [STEPS.COMPLETADO]: '¿Confirmas los datos?'
  };
  
  return datosStr + (mensajesPorPaso[paso] || 'Continuemos donde quedamos...');
}

// Función helper para obtener botones según el paso
function obtenerBotonesParaPaso(paso) {
  const botonesPorPaso = {
    [STEPS.FECHA]: OPTIONS.TIPO_EVENTO,
    [STEPS.NOMBRE]: OPTIONS.PAQUETE,
    [STEPS.COMPLETADO]: OPTIONS.CONFIRMACION
  };
  return botonesPorPaso[paso] || null;
}

// Función helper para generar el resumen completo de confirmación
function generarResumenConfirmacion(datos) {
  const advertencia = datos.revision_manual ? '\n⚠️ **Nota:** Algunos datos requieren revisión manual.\n' : '';
  
  return `
📋 **RESUMEN DE SOLICITUD**
${advertencia}
👤 **Cliente:** ${datos.nombre_cliente || 'No especificado'}
📧 **Email:** ${datos.email_cliente || 'No especificado'}
📞 **Tel:** ${datos.telefono_cliente || 'No especificado'}

🎊 **Evento:** ${datos.tipo_evento || 'No especificado'}
📅 **Fecha:** ${datos.fecha_evento || 'No especificado'}
📍 **Lugar:** ${datos.ubicacion_evento || 'No especificado'}
📦 **Paquete:** ${datos.paquete_interes || 'No especificado'}

¿Todo correcto?
  `.trim();
}

// Función helper para manejar validación con fallback
// fieldName: nombre del campo donde guardar el dato (ej: 'fecha_evento', 'nombre_cliente')
function handleValidation(validatorResult, rawText, successNextStep, successMessage, fieldName) {
  if (validatorResult.valid) {
    // Éxito: Guardamos dato limpio y avanzamos
    response.update_data[fieldName] = validatorResult.value;
    
    response.text = successMessage;
    response.next_step = successNextStep;
    response.new_intentos = 0;
    return true;
  } else {
    // Error
    if (intentos >= 1) {
      // FALLBACK: Segundo error, aceptamos el dato tal cual
      response.update_data[fieldName] = rawText;
      response.update_data.revision_manual = true; // Flag para ventas
      response.update_data[`error_${fieldName}`] = validatorResult.error;
      
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
  // Verificar si ya existe una sesión activa con datos
  const tieneSessionActiva = currentStep !== STEPS.START && Object.keys(currentData).length > 0;
  
  if (tieneSessionActiva) {
    // Ya tiene sesión: NO reiniciar, continuar donde quedó
    // Incrementar intentos fallidos (el usuario escribió /start en lugar del dato esperado)
    const mensajeResumen = generarMensajeResumen(currentStep, currentData);
    
    return {
      text: `👋 ¡Hola de nuevo! Veo que ya tenías una reservación en progreso.\n\n${mensajeResumen}`,
      buttons: obtenerBotonesParaPaso(currentStep),
      next_step: currentStep,  // Mantener el paso actual
      update_data: currentData,  // Preservar datos existentes
      action: 'reply',
      new_intentos: intentos + 1  // Incrementar intentos
    };
  }
  
  // No tiene sesión activa: comenzar nuevo flujo
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
      STEPS.UBICACION, 
      '📍 ¿En qué ciudad será el evento?',
      'fecha_evento'  // <-- Campo donde guardar
    );
    break;

  case STEPS.PAQUETE:
    // Input anterior: CIUDAD
    handleValidation(
      Validators.ciudad(incomingText),
      incomingText,
      STEPS.NOMBRE,
      '📦 Selecciona un paquete:',
      'ubicacion_evento'  // <-- Campo donde guardar
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
      '📧 ¿Cuál es tu correo electrónico?',
      'nombre_cliente'  // <-- Campo donde guardar
    );
    break;

  case STEPS.TELEFONO:
    // Input anterior: EMAIL
    handleValidation(
      Validators.email(incomingText),
      incomingText,
      STEPS.CONFIRMACION,
      '📞 ¿Cuál es tu número de teléfono?',
      'email_cliente'  // <-- Campo donde guardar
    );
    break;

  case STEPS.CONFIRMACION:
    // Input anterior: TELEFONO
    const validado = handleValidation(
      Validators.telefono(incomingText),
      incomingText,
      STEPS.COMPLETADO,
      '', // El mensaje se genera abajo
      'telefono_cliente'  // <-- Campo donde guardar
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
      // En lugar de enviar directo, pasamos a validación IA
      response.text = '🔍 Validando tus datos...';
      response.action = 'validate_with_ai';  // Nueva acción
      response.next_step = STEPS.VALIDACION_IA;
      response.update_data.origen = AI_CONFIG.ORIGEN;  // Marcar origen
      response.update_data.intentos_validacion = 0;     // Iniciar contador
      response.update_data.tipoValidacion = 'IA';       // Marcar que la IA controla
    } else if (incomingCallback === 'corregir') {
      // Mostrar menú de campos a corregir
      response.text = '✏️ ¿Qué dato deseas corregir?';
      response.buttons = OPTIONS.MENU_CORRECCION;
      response.next_step = STEPS.MENU_CORRECCION;
    } else if (incomingCallback === 'cancelar') {
      response.text = '🚫 Solicitud cancelada.';
      response.action = 'cancel_session';
    } else {
      response.text = 'Por favor elige una opción usando los botones.';
      response.buttons = OPTIONS.CONFIRMACION;
    }
    break;

  case STEPS.MENU_CORRECCION:
    // El usuario eligió qué campo corregir
    if (incomingCallback === 'volver_resumen') {
      // Volver al resumen sin cambios
      const d = response.update_data;
      const resumen = generarResumenConfirmacion(d);
      response.text = resumen;
      response.buttons = OPTIONS.CONFIRMACION;
      response.next_step = STEPS.COMPLETADO;
    } else if (incomingCallback && incomingCallback.startsWith('edit_')) {
      // Extraer el nombre del campo a editar
      const campoEditar = incomingCallback.replace('edit_', '');
      response.update_data._campo_editando = campoEditar;
      
      // Mostrar mensaje según el campo
      const mensajesEdicion = {
        'tipo_evento': '🎊 Selecciona el nuevo tipo de evento:',
        'fecha_evento': '📅 Escribe la nueva fecha (DD/MM/YYYY):',
        'ubicacion_evento': '📍 Escribe la nueva ciudad:',
        'paquete_interes': '📦 Selecciona el nuevo paquete:',
        'nombre_cliente': '👤 Escribe tu nombre completo:',
        'email_cliente': '📧 Escribe tu correo electrónico:',
        'telefono_cliente': '📞 Escribe tu número de teléfono:'
      };
      
      response.text = mensajesEdicion[campoEditar] || 'Escribe el nuevo valor:';
      response.next_step = STEPS.CORRIGIENDO_CAMPO;
      
      // Si es tipo_evento o paquete, mostrar botones
      if (campoEditar === 'tipo_evento') {
        response.buttons = OPTIONS.TIPO_EVENTO;
      } else if (campoEditar === 'paquete_interes') {
        response.buttons = OPTIONS.PAQUETE;
      }
    } else {
      response.text = '⚠️ Por favor selecciona una opción del menú.';
      response.buttons = OPTIONS.MENU_CORRECCION;
    }
    break;

  case STEPS.CORRIGIENDO_CAMPO:
    // El usuario está ingresando el nuevo valor del campo
    const campoEditando = currentData._campo_editando;
    const nuevoValor = incomingCallback || incomingText;
    
    if (campoEditando && nuevoValor) {
      // Validar el nuevo valor según el campo
      let valorValidado = nuevoValor;
      let esValido = true;
      
      // Aplicar validador correspondiente
      if (campoEditando === 'fecha_evento') {
        const resultado = Validators.fecha(nuevoValor);
        esValido = resultado.valid;
        if (!esValido) {
          response.text = `❌ ${resultado.error}\n\nIntenta de nuevo:`;
          response.next_step = STEPS.CORRIGIENDO_CAMPO;
          break;
        }
        valorValidado = resultado.value;
      } else if (campoEditando === 'ubicacion_evento') {
        const resultado = Validators.ciudad(nuevoValor);
        esValido = resultado.valid;
        if (!esValido) {
          response.text = `❌ ${resultado.error}\n\nIntenta de nuevo:`;
          response.next_step = STEPS.CORRIGIENDO_CAMPO;
          break;
        }
        valorValidado = resultado.value;
      } else if (campoEditando === 'nombre_cliente') {
        const resultado = Validators.nombre(nuevoValor);
        esValido = resultado.valid;
        if (!esValido) {
          response.text = `❌ ${resultado.error}\n\nIntenta de nuevo:`;
          response.next_step = STEPS.CORRIGIENDO_CAMPO;
          break;
        }
        valorValidado = resultado.value;
      } else if (campoEditando === 'email_cliente') {
        const resultado = Validators.email(nuevoValor);
        esValido = resultado.valid;
        if (!esValido) {
          response.text = `❌ ${resultado.error}\n\nIntenta de nuevo:`;
          response.next_step = STEPS.CORRIGIENDO_CAMPO;
          break;
        }
        valorValidado = resultado.value;
      } else if (campoEditando === 'telefono_cliente') {
        const resultado = Validators.telefono(nuevoValor);
        esValido = resultado.valid;
        if (!esValido) {
          response.text = `❌ ${resultado.error}\n\nIntenta de nuevo:`;
          response.next_step = STEPS.CORRIGIENDO_CAMPO;
          break;
        }
        valorValidado = resultado.value;
      }
      
      // Guardar el nuevo valor
      response.update_data[campoEditando] = valorValidado;
      delete response.update_data._campo_editando;
      
      // Volver al resumen
      const d = response.update_data;
      const resumen = `✅ **Dato actualizado**\n\n${generarResumenConfirmacion(d)}`;
      response.text = resumen;
      response.buttons = OPTIONS.CONFIRMACION;
      response.next_step = STEPS.COMPLETADO;
    } else {
      response.text = '⚠️ No recibí un valor válido. Por favor intenta de nuevo.';
      response.next_step = STEPS.CORRIGIENDO_CAMPO;
    }
    break;

  case STEPS.VALIDACION_IA:
    // Este paso maneja respuestas a preguntas de la IA sobre campos faltantes
    const campoFaltante = currentData._campo_pendiente;
    const intentosIA = parseInt(currentData.intentos_validacion || 0);
    
    if (campoFaltante && incomingText) {
      // Guardamos la respuesta en el campo correspondiente
      response.update_data[campoFaltante] = incomingText;
      delete response.update_data._campo_pendiente;
      
      // Incrementar contador de intentos
      response.update_data.intentos_validacion = intentosIA + 1;
      
      // Verificar límite de intentos
      if (intentosIA + 1 >= AI_CONFIG.MAX_INTENTOS) {
        response.text = '⚠️ Se alcanzó el límite de validaciones. Tu solicitud será revisada manualmente.';
        response.action = 'send_to_error_support';  // Escalar a soporte
        response.update_data.requiere_revision = true;
        response.next_step = STEPS.START;
      } else {
        // Volver a validar con IA
        response.text = '🔍 Verificando...';
        response.action = 'validate_with_ai';
        response.next_step = STEPS.VALIDACION_IA;
      }
    } else {
      // No hay campo pendiente o no hay texto, continuar validación
      response.action = 'validate_with_ai';
      response.next_step = STEPS.VALIDACION_IA;
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
