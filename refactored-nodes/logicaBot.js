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
  UBICACION: 'ubicacion',  // Fix: Paso faltante que causaba el reset
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
  // FALLBACK ESTÁTICO - Solo se usa si el catálogo dinámico falla al cargar
  PAQUETE: [
    [{ text: '🥉 Básico - 1 cámara HD', callback_data: 'Básico' }],
    [{ text: '🥈 Estándar - 2 cámaras HD + overlays básicos', callback_data: 'Estándar' }],
    [{ text: '🥇 Premium - 3 cámaras HD + director técnico', callback_data: 'Premium' }],
    [{ text: '💎 Enterprise - 4 cámaras 4K + multi-plataforma', callback_data: 'Enterprise' }]
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
  ],
  DURACION: [
    [{ text: '⏱️ 2 a 4 horas', callback_data: 'duracion_2_4' }],
    [{ text: '📆 8 horas', callback_data: 'duracion_8' }],
    [{ text: '☀️ Todo el día', callback_data: 'duracion_dia' }],
    [{ text: '📅 Varios días', callback_data: 'duracion_varios' }]
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

// ============================================
// LEER CONTEXTO PREPARADO
// ============================================

// Leer contexto consolidado de prepararContexto
const contexto = $('prepararContexto').first().json;

const catalog = contexto.catalog || { paquetes: [], addons: [] };
const telegramUpdate = {
  message: contexto.message,
  callback_query: contexto.callback_query
};

// Datos de sesión
const session = {
  paso_actual: contexto.paso_actual,
  datos_json: JSON.stringify(contexto.datos_json),
  intentos_fallidos: contexto.intentos_fallidos
};

// Extraer datos del mensaje
const incomingText = telegramUpdate.message?.text || '';
const incomingCallback = telegramUpdate.callback_query?.data || null;

// Si es recuperación de sesión Y NO hay callback activo, usar el mensaje preparado
// Si hay callback, significa que el usuario ya hizo clic en un botón, así que procesamos normalmente
if (contexto.esRecuperacion && !incomingCallback && !incomingText) {
  console.log('🔄 Recuperación de sesión detectada - Mostrando mensaje de recuperación');
  return {
    text: contexto.mensajeRecuperacion,
    buttons: contexto.botonesRecuperacion,
    next_step: contexto.paso_actual,
    update_data: contexto.datos_json,
    action: 'reply',
    new_intentos: 0,
    tipoValidacion: contexto.tipoValidacion
  };
}

// Si llegamos aquí, procesamos normalmente (ya sea nueva conversación o callback durante recuperación)
if (contexto.esRecuperacion && incomingCallback) {
  console.log('🔄 Recuperación con callback activo - Procesando selección:', incomingCallback);
}

// Debugging
console.log('--- DEBUG INFO ---');
console.log('Telegram Update:', telegramUpdate);
console.log('Contexto:', contexto);
console.log('Incoming Callback:', incomingCallback);
console.log('Current Step:', session.paso_actual);
console.log('------------------');

let currentStep = session.paso_actual || STEPS.START;
const currentData = session.datos_json ? JSON.parse(session.datos_json) : {};
const intentos = parseInt(session.intentos_fallidos || 0);


let response = {
  text: '',
  buttons: null, // Array de botones para N8N
  next_step: currentStep,
  update_data: currentData,
  action: 'reply',
  new_intentos: 0, // Por defecto reseteamos intentos si hay éxito
  tipoValidacion: 'BOT' // Por defecto, el bot controla la validación
};


// --- FUNCIONES HELPER PARA CATÁLOGO DINÁMICO ---

/**
 * Genera el teclado inline de addons filtrando los ya seleccionados
 */
function generarBotonesAddons(catalogo, yaSeleccionados) {
  const botones = catalogo.addons
    .filter(a => !yaSeleccionados.includes(a.Nombre))
    .map(a => ([{
      text: `${a.Icono} ${a.Nombre} (+$${a.Precio})`,
      callback_data: `addon_${a.Nombre.toLowerCase().replace(/\s+/g, '_')}`
    }]));
    
  botones.push([{ text: '✅ Listo, continuar', callback_data: 'addon_listo' }]);
  return botones;
}

/**
 * Genera el resumen final con desglose de precios y total
 */
function generarResumenConfirmacion(datos) {
  const advertencia = datos.revision_manual ? '\n⚠️ **Nota:** Algunos datos requieren revisión manual.\n' : '';
  
  // Cálculo de total
  let subtotalAddons = 0;
  let listaAddonsTexto = 'Ninguno';
  
  if (Array.isArray(datos.add_ons_solicitados) && datos.add_ons_solicitados.length > 0) {
    subtotalAddons = datos.add_ons_solicitados.reduce((acc, curr) => acc + (curr.precio || 0), 0);
    listaAddonsTexto = datos.add_ons_solicitados.map(a => `• ${a.nombre} ($${a.precio})`).join('\n');
  }

  const total = (datos.precio_base || 0) + subtotalAddons;
  
  // Formatear detalles del paquete si existen
  let detallesPkg = '';
  if (Array.isArray(datos._detalles_pkg) && datos._detalles_pkg.length > 0) {
    detallesPkg = `\n✨ **Incluye:**\n${datos._detalles_pkg.map(d => `  - ${d}`).join('\n')}`;
  }

  return `
📋 **RESUMEN DE TU RESERVACIÓN**
${advertencia}
👤 **Cliente:** ${datos.nombre_cliente}
📧 **Email:** ${datos.email_cliente}
📞 **Tel:** ${datos.telefono_cliente}

🎉 **Evento:** ${datos.tipo_evento}
📅 **Fecha:** ${datos.fecha_evento}
📍 **Lugar:** ${datos.ubicacion_evento}
⏱️ **Duración:** ${datos.duracion_estimada}

📦 **Paquete:** ${datos.paquete_interes} ($${datos.precio_base})${detallesPkg}

✨ **Servicios Adicionales:**
${listaAddonsTexto}

---
💰 **Presupuesto Estimado Total: $${total}**

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

  case STEPS.UBICACION:
    // Input anterior: CIUDAD (Texto libre)
    handleValidation(
      Validators.ciudad(incomingText),
      incomingText,
      STEPS.DURACION,
      '⏱️ ¿Cuál es la duración estimada del evento?',
      'ubicacion_evento'
    );
    // Agregar botones de duración si la validación fue exitosa
    if (response.next_step === STEPS.DURACION) {
      response.buttons = OPTIONS.DURACION;
    }
    break;

  case STEPS.DURACION:
    // Input anterior: Callback de botones de duración
    if (incomingCallback) {
      const mapaDuracion = {
        'duracion_2_4': '2 a 4 horas',
        'duracion_8': '8 horas',
        'duracion_dia': 'Todo el día',
        'duracion_varios': 'Varios días'
      };
      const duracionSeleccionada = mapaDuracion[incomingCallback];
      
      if (duracionSeleccionada) {
        response.update_data.duracion_estimada = duracionSeleccionada;
        response.text = `✅ Duración: ${duracionSeleccionada}\n\n📡 ¿El lugar cuenta con conexión a Internet estable para streaming?`;
        response.buttons = [
          [{ text: '✅ Sí, tiene internet', callback_data: 'internet_si' }],
          [{ text: '❌ No tiene / No estoy seguro', callback_data: 'internet_no' }]
        ];
        response.next_step = STEPS.INTERNET;
      } else {
        response.text = '⚠️ Por favor selecciona una opción usando los botones.';
        response.buttons = OPTIONS.DURACION;
      }
    } else {
      response.text = '⚠️ Por favor selecciona la duración usando los botones.';
      response.buttons = OPTIONS.DURACION;
    }
    break;

  case STEPS.INTERNET:
    // Input anterior: Callback de botones Sí/No internet
    if (incomingCallback) {
      const tieneInternet = incomingCallback === 'internet_si';
      response.update_data.tiene_internet_venue = tieneInternet ? 'Sí' : 'No';
      
      response.text = `✅ Internet: ${tieneInternet ? 'Sí' : 'No'}\n\n📦 Ahora selecciona el paquete de tu interés:`;
      
      // GENERACIÓN DINÁMICA DE BOTONES DE PAQUETES
      if (catalog.paquetes && catalog.paquetes.length > 0) {
        response.buttons = catalog.paquetes.map(p => ([{ 
          text: `${p.Icono} ${p.Nombre}`, 
          callback_data: `pkg_${p.Nombre.toLowerCase().replace(/\s+/g, '_')}` 
        }]));
      } else {
        // Fallback si el catálogo falla
        response.buttons = OPTIONS.PAQUETE;
      }
      
      response.next_step = STEPS.PAQUETE;
    } else {
      response.text = '⚠️ Por favor selecciona una opción.';
      response.buttons = [
        [{ text: '✅ Sí, tiene internet', callback_data: 'internet_si' }],
        [{ text: '❌ No tiene / No estoy seguro', callback_data: 'internet_no' }]
      ];
    }
    break;

  case STEPS.PAQUETE:
    // Input anterior: Callback de botón de paquete
    if (incomingCallback && incomingCallback.startsWith('pkg_')) {
      const nombrePkgNorm = incomingCallback.replace('pkg_', '');
      const pkg = catalog.paquetes.find(p => p.Nombre.toLowerCase().replace(/\s+/g, '_') === nombrePkgNorm);

      if (pkg) {
        response.update_data.paquete_interes = pkg.Nombre;
        response.update_data.precio_base = pkg.Precio;
        response.update_data._detalles_pkg = pkg.Detalle; // Guardar detalles para el resumen
        
        response.text = `✅ Paquete: ${pkg.Nombre}\n\n✨ ¿Deseas agregar algún servicio adicional?`;
        
        // GENERACIÓN DINÁMICA DE BOTONES DE ADDONS
        response.buttons = generarBotonesAddons(catalog, []);
        response.next_step = STEPS.ADDONS;
        
        // Inicializar array de addons
        response.update_data.add_ons_solicitados = [];
      } else {
        response.text = '⚠️ Error: Paquete no encontrado en el catálogo. Por favor selecciona otro.';
        response.buttons = catalog.paquetes.map(p => ([{ text: `${p.Icono} ${p.Nombre}`, callback_data: `pkg_${p.Nombre.toLowerCase().replace(/\s+/g, '_')}` }]));
      }
    } else {
      response.text = '⚠️ Por favor selecciona un paquete usando los botones.';
      response.buttons = catalog.paquetes.map(p => ([{ text: `${p.Icono} ${p.Nombre}`, callback_data: `pkg_${p.Nombre.toLowerCase().replace(/\s+/g, '_')}` }]));
    }
    break;

  case STEPS.ADDONS:
    // Loop: el usuario puede seleccionar múltiples addons
    let addonsActuales = currentData.add_ons_solicitados || [];
    
    if (incomingCallback === 'addon_listo') {
      // Terminar selección de addons
      const nombresAddons = addonsActuales.map(a => a.nombre);
      const addonsTexto = nombresAddons.length > 0 ? nombresAddons.join(', ') : 'Ninguno';
      response.text = `✅ Servicios adicionales: ${addonsTexto}\n\n👤 ¿Cuál es tu nombre completo?`;
      response.next_step = STEPS.NOMBRE;
    } else if (incomingCallback && incomingCallback.startsWith('addon_')) {
      const nombreAddonNorm = incomingCallback.replace('addon_', '');
      const addonMeta = catalog.addons.find(a => a.Nombre.toLowerCase().replace(/\s+/g, '_') === nombreAddonNorm);
      
      if (addonMeta) {
        // Verificar si ya está seleccionado
        const yaExiste = addonsActuales.some(a => a.nombre === addonMeta.Nombre);
        
        if (!yaExiste) {
          addonsActuales.push({ nombre: addonMeta.Nombre, precio: addonMeta.Precio });
          response.update_data.add_ons_solicitados = addonsActuales;
          response.text = `✅ Agregado: ${addonMeta.Nombre} (+$${addonMeta.Precio})\n\n¿Deseas agregar otro?`;
        } else {
          response.text = `El servicio "${addonMeta.Nombre}" ya estaba seleccionado.\n\n¿Deseas agregar otro?`;
        }
      } else {
        response.text = `⚠️ No se encontró el servicio adicional seleccionado. ¿Deseas agregar otro?`;
      }
      
      // Repetir botones dinámicos
      response.buttons = generarBotonesAddons(catalog, addonsActuales.map(a => a.nombre));
      response.next_step = STEPS.ADDONS;
    } else {
      response.text = '⚠️ Por favor selecciona una opción usando los botones.';
      response.buttons = generarBotonesAddons(catalog, addonsActuales.map(a => a.nombre));
      response.next_step = STEPS.ADDONS;
    }
    break;

  case STEPS.COMENTARIOS:
    // Input anterior: Texto libre de comentarios (después de TELEFONO)
    response.update_data.comentarios_adicionales = incomingText || 'Ninguno';
    
    // Mostrar resumen de confirmación dinámico
    response.text = generarResumenConfirmacion(response.update_data);
    response.buttons = OPTIONS.CONFIRMACION;
    response.next_step = STEPS.COMPLETADO;
    break;


  case STEPS.NOMBRE:
    // PASO NOMBRE: Recibimos el nombre, pedimos email
    // Input: Nombre del usuario (desde ADDONS)
    // Output: Guardar nombre, pedir email
    handleValidation(
      Validators.nombre(incomingText),
      incomingText,
      STEPS.EMAIL,
      '📧 ¿Cuál es tu correo electrónico?',
      'nombre_cliente'
    );
    break;

  case STEPS.EMAIL:
    // PASO EMAIL: Recibimos el email, pedimos teléfono
    // Input: Email del usuario (desde NOMBRE)
    // Output: Guardar email, pedir teléfono
    handleValidation(
      Validators.email(incomingText),
      incomingText,
      STEPS.TELEFONO,
      '📞 ¿Cuál es tu número de teléfono?',
      'email_cliente'
    );
    break;

  case STEPS.TELEFONO:
    // PASO TELEFONO: Recibimos el teléfono, pedimos comentarios
    // Input: Teléfono del usuario (desde EMAIL)
    // Output: Guardar teléfono, pedir comentarios
    handleValidation(
      Validators.telefono(incomingText),
      incomingText,
      STEPS.COMENTARIOS,
      '📝 ¿Tienes algún comentario adicional o requerimiento especial?\n\n(Escribe "Ninguno" si no tienes)',
      'telefono_cliente'
    );
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
      // Mostrar confirmación antes de cancelar (igual que /cancelar)
      response.text = '⚠️ ¿Estás seguro de que deseas cancelar tu reservación?\n\nEsta acción no se puede deshacer.';
      response.buttons = [
        [{ text: '✅ Sí, cancelar', callback_data: 'ejecutar_cancelar' }],
        [{ text: '❌ No, mantener', callback_data: 'mantener_reservacion' }]
      ];
      response.action = 'confirmar_cancelacion';
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
        // MOSTRAR BOTONES DINÁMICOS EN CORRECCIÓN
        response.buttons = catalog.paquetes.map(p => ([{ 
          text: `${p.Icono} ${p.Nombre}`, 
          callback_data: `pkg_${p.Nombre.toLowerCase().replace(/\s+/g, '_')}` 
        }]));
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
      } else if (campoEditando === 'paquete_interes') {
        // VALIDAR PAQUETE EN CORRECCIÓN
        const nombrePkgNorm = nuevoValor.replace('pkg_', '');
        const pkg = catalog.paquetes.find(p => p.Nombre.toLowerCase().replace(/\s+/g, '_') === nombrePkgNorm);
        
        if (pkg) {
          valorValidado = pkg.Nombre;
          response.update_data.precio_base = pkg.Precio;
          response.update_data._detalles_pkg = pkg.Detalle;
        } else {
          response.text = '⚠️ Paquete no válido. Selecciona uno del menú:';
          response.buttons = catalog.paquetes.map(p => ([{ text: `${p.Icono} ${p.Nombre}`, callback_data: `pkg_${p.Nombre.toLowerCase().replace(/\s+/g, '_')}` }]));
          response.next_step = STEPS.CORRIGIENDO_CAMPO;
          break;
        }
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
