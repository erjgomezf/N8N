/**
 * ============================================
 * NODO: validarDatos
 * ============================================
 * 
 * PROPÓSITO:
 * Transforma los datos recolectados por el bot de Telegram al formato
 * esperado por el flujo central (webhook), asegurando compatibilidad.
 * 
 * INPUT (desde routerAccion):
 * - update_data: Objeto con los datos recolectados por el bot
 *   - tipo_evento: string
 *   - fecha_evento: string (formato DD/MM/YYYY)
 *   - ubicacion_evento: string
 *   - paquete_interes: string
 *   - nombre_cliente: string
 *   - email_cliente: string
 *   - telefono_cliente: string
 * 
 * OUTPUT:
 * - Objeto compatible con el webhook del flujo central
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const CONFIG = {
  TIMEZONE: 'America/Caracas',
  // ORIGEN ahora se determina dinámicamente
  ORIGENES_VALIDOS: ['telegram', 'whatsapp', 'webhook'],
  CAMPOS_REQUERIDOS: [
    'tipo_evento',
    'fecha_evento',
    'ubicacion_evento',
    'paquete_interes',
    'nombre_cliente',
    'email_cliente',
    'telefono_cliente'
  ],
  // Valores por defecto para campos opcionales
  DEFAULTS: {
    duracion_estimada: 'Por confirmar',
    tiene_internet_venue: 'No estoy seguro',
    comentarios_adicionales: 'Solicitud desde Telegram Bot',
    add_ons_solicitados: []
  }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Convierte fecha de DD/MM/YYYY a YYYY-MM-DD
 * @param {string} fechaDDMMYYYY - Fecha en formato DD/MM/YYYY
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
function convertirFecha(fechaDDMMYYYY) {
  if (!fechaDDMMYYYY) return null;
  
  // Si ya está en formato YYYY-MM-DD, retornar tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaDDMMYYYY)) {
    return fechaDDMMYYYY;
  }
  
  // Convertir DD/MM/YYYY a YYYY-MM-DD
  const partes = fechaDDMMYYYY.split('/');
  if (partes.length === 3) {
    const [dia, mes, anio] = partes;
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  
  return fechaDDMMYYYY; // Retornar original si no se puede convertir
}

/**
 * Valida que los campos requeridos existan
 * @param {Object} datos - Datos a validar
 * @returns {Object} {valido: boolean, faltantes: string[]}
 */
function validarCamposRequeridos(datos) {
  const faltantes = CONFIG.CAMPOS_REQUERIDOS.filter(
    campo => !datos[campo] || datos[campo] === 'undefined'
  );
  
  return {
    valido: faltantes.length === 0,
    faltantes
  };
}

/**
 * Limpia valores undefined o null
 * @param {*} valor - Valor a limpiar
 * @param {*} valorDefault - Valor por defecto si es undefined/null
 * @returns {*} Valor limpio
 */
function limpiarValor(valor, valorDefault = '') {
  if (valor === undefined || valor === null || valor === 'undefined') {
    return valorDefault;
  }
  return valor;
}

// ============================================
// LÓGICA PRINCIPAL
// ============================================

// Obtener datos del input
const input = $input.item.json;
const datosBot = input.update_data || input;
const chatId = input.chat_id || $('telegramTrigger').first().json.message?.chat?.id || 
               $('telegramTrigger').first().json.callback_query?.message?.chat?.id;

// Validar campos requeridos
const validacion = validarCamposRequeridos(datosBot);

if (!validacion.valido) {
  console.warn('⚠️ Campos faltantes:', validacion.faltantes.join(', '));
}

// Construir payload compatible con webhook
const payloadWebhook = {
  // Campos principales (del bot)
  tipo_evento: limpiarValor(datosBot.tipo_evento),
  fecha_evento: convertirFecha(datosBot.fecha_evento),
  ubicacion_evento: limpiarValor(datosBot.ubicacion_evento),
  paquete_interes: limpiarValor(datosBot.paquete_interes),
  nombre_cliente: limpiarValor(datosBot.nombre_cliente),
  email_cliente: limpiarValor(datosBot.email_cliente),
  telefono_cliente: limpiarValor(datosBot.telefono_cliente),
  
  // Campos con valores por defecto
  duracion_estimada: limpiarValor(datosBot.duracion_estimada, CONFIG.DEFAULTS.duracion_estimada),
  tiene_internet_venue: limpiarValor(datosBot.tiene_internet_venue, CONFIG.DEFAULTS.tiene_internet_venue),
  comentarios_adicionales: limpiarValor(datosBot.comentarios_adicionales, CONFIG.DEFAULTS.comentarios_adicionales),
  add_ons_solicitados: datosBot.add_ons_solicitados || CONFIG.DEFAULTS.add_ons_solicitados,
  
  // Metadatos de origen (dinámico según el canal)
  origen: datosBot.origen || 'telegram',  // telegram | whatsapp | webhook
  chat_id: chatId,
  timestamp: new Date().toISOString(),
  
  // Flag de validación
  datos_completos: validacion.valido,
  campos_faltantes: validacion.faltantes,
  requiere_revision: datosBot.revision_manual || !validacion.valido
};

// Logging para debugging
console.log('📤 Payload transformado para flujo central:');
console.log(JSON.stringify(payloadWebhook, null, 2));

return payloadWebhook;
