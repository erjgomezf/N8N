/**
 * ============================================
 * NODO: detectarComando
 * ============================================
 * 
 * PROPÓSITO:
 * Interceptar comandos globales (/start, /reservar, /cancelar) 
 * y decidir la acción ANTES de que pase a logicaBot o AI Validator.
 * 
 * UBICACIÓN EN WORKFLOW:
 * telegramTrigger → buscarSesion → [detectarComando] → switchAccion → ...
 * 
 * INPUT:
 * - Datos del trigger de Telegram
 * - Datos de sesión de Google Sheets
 * 
 * OUTPUT:
 * - accion: 'continuar_flujo' | 'notificar_reservacion' | 'cancelar_sesion' | 'retomar_sesion'
 * - mensaje: Texto a enviar al usuario (si aplica)
 * - buttons: Botones inline (si aplica)
 */

// Leer datos del trigger y sesión
const telegramData = $('telegramTrigger').first().json;
const sesionData = $('buscarSesion').first().json || {};

const incomingText = telegramData.message?.text || '';
const chatId = telegramData.message?.chat?.id || telegramData.callback_query?.message?.chat?.id;

const tipoValidacion = sesionData.tipoValidacion || 'BOT';
const pasoActual = sesionData.paso_actual || 'start';
const datosJson = sesionData.datos_json ? JSON.parse(sesionData.datos_json) : {};

// Detectar comandos
const esComando = incomingText.startsWith('/');
const comando = incomingText.toLowerCase().trim();

let resultado = {
  accion: 'continuar_flujo',  // Por defecto, continuar al flujo normal
  mensaje: null,
  buttons: null,
  datos_reservacion: null,
  chat_id: chatId
};

// Solo procesamos comandos específicos
if (esComando) {

  if (comando === '/start' || comando === '/reservar') {

    if (tipoValidacion === 'IA' && pasoActual === 'completado') {
      // CASO A: Reservación COMPLETADA (validada por IA)
      // El usuario ya tiene una reservación, notificar
      resultado.accion = 'notificar_reservacion';
      resultado.mensaje = `📋 Ya tienes una reservación activa:\n\n🎉 Evento: ${datosJson.tipo_evento}\n📅 Fecha: ${datosJson.fecha_evento}\n📍 Lugar: ${datosJson.ubicacion_evento}\n📦 Paquete: ${datosJson.paquete_interes}\n\n¿Qué deseas hacer?`;
      resultado.buttons = [
        [{ text: '📄 Ver detalles completos', callback_data: 'ver_detalles' }],
        [{ text: '🗑️ Cancelar reservación', callback_data: 'confirmar_cancelar' }]
      ];
      resultado.datos_reservacion = datosJson;

    } else if (tipoValidacion === 'BOT' && pasoActual !== 'start' && Object.keys(datosJson).length > 0) {
      // CASO B: Reservación EN PROGRESO (manejada por BOT)
      // Retomar donde quedó - esto lo maneja logicaBot, solo pasar
      resultado.accion = 'continuar_flujo';
      // logicaBot ya tiene lógica para esto, solo marcamos la intención

    } else {
      // CASO C: No hay reservación o está en start
      // Continuar flujo normal (crear nueva)
      resultado.accion = 'continuar_flujo';
    }

  } else if (comando === '/cancelar') {

    if (tipoValidacion === 'IA' || pasoActual !== 'start') {
      // Hay algo que cancelar
      resultado.accion = 'confirmar_cancelacion';
      resultado.mensaje = '⚠️ ¿Estás seguro de que deseas cancelar tu reservación?\n\nEsta acción no se puede deshacer.';
      resultado.buttons = [
        [{ text: '✅ Sí, cancelar', callback_data: 'ejecutar_cancelar' }],
        [{ text: '❌ No, mantener', callback_data: 'mantener_reservacion' }]
      ];
    } else {
      // No hay nada que cancelar
      resultado.accion = 'continuar_flujo';
      resultado.mensaje = 'ℹ️ No tienes ninguna reservación activa para cancelar.';
    }

  } else if (comando === '/ayuda') {
    resultado.accion = 'mostrar_ayuda';
    resultado.mensaje = `🆘 **Ayuda - Live Moments Bot**\n\nComandos disponibles:\n• /start - Iniciar o ver reservación\n• /reservar - Nueva reservación\n• /cancelar - Cancelar reservación\n• /ayuda - Este mensaje`;
  }
}

// También manejar callbacks de confirmación
const callback = telegramData.callback_query?.data;

if (callback === 'confirmar_cancelar') {
  // Mostrar confirmación antes de cancelar
  resultado.accion = 'confirmar_cancelacion';
  resultado.mensaje = '⚠️ ¿Estás seguro de que deseas cancelar tu reservación?\n\nEsta acción no se puede deshacer.';
  resultado.buttons = [
    [{ text: '✅ Sí, cancelar', callback_data: 'ejecutar_cancelar' }],
    [{ text: '❌ No, mantener', callback_data: 'mantener_reservacion' }]
  ];

} else if (callback === 'ejecutar_cancelar') {
  resultado.accion = 'cancelar_sesion';
  resultado.mensaje = '🗑️ Tu reservación ha sido cancelada.\n\nEscribe /reservar para comenzar una nueva.';

} else if (callback === 'mantener_reservacion') {
  resultado.accion = 'continuar_flujo';
  resultado.mensaje = '✅ Perfecto, tu reservación sigue activa.';

} else if (callback === 'ver_detalles') {
  resultado.accion = 'mostrar_detalles';
  const d = datosJson;
  resultado.mensaje = `📋 **DETALLES DE TU RESERVACIÓN**\n\n👤 Cliente: ${d.nombre_cliente}\n📧 Email: ${d.email_cliente}\n📞 Tel: ${d.telefono_cliente}\n\n🎉 Evento: ${d.tipo_evento}\n📅 Fecha: ${d.fecha_evento}\n📍 Lugar: ${d.ubicacion_evento}\n⏱️ Duración: ${d.duracion_estimada || 'No especificada'}\n📡 Internet: ${d.tiene_internet_venue || 'No especificado'}\n📦 Paquete: ${d.paquete_interes}\n✨ Addons: ${Array.isArray(d.add_ons_solicitados) ? d.add_ons_solicitados.join(', ') || 'Ninguno' : 'Ninguno'}\n📝 Comentarios: ${d.comentarios_adicionales || 'Ninguno'}`;
}

// Agregar flags útiles para el Switch y nodos posteriores
resultado.esNuevoUsuario = !sesionData.chat_id || Object.keys(sesionData).length === 0;
resultado.tipoValidacion = tipoValidacion;
resultado.paso_actual = pasoActual;

return resultado;
