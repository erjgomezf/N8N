/**
 * ============================================
 * NODO: calcularDias
 * ============================================
 * 
 * PROPÓSITO:
 * Calcula los días restantes hasta el evento y enriquece los datos
 * con información temporal para clasificación posterior.
 * 
 * INPUT (desde Webhook):
 * - body.fecha_evento: string (formato ISO: "YYYY-MM-DD")
 * 
 * OUTPUT:
 * - Todos los campos del input original
 * - dias_del_evento: number - Días restantes (puede ser negativo si ya pasó)
 * - timestamp_solicitud: string - ISO timestamp de cuando se procesó
 * - fecha_procesamiento: string - Fecha legible en español (zona horaria Venezuela)
 * 
 * MANEJO DE ERRORES:
 * - Valida que fecha_evento exista y sea válida
 * - Maneja fechas pasadas (días negativos)
 * 
 * AUTOR: Live Moments Team
 * ÚLTIMA ACTUALIZACIÓN: 2025-12-03
 */

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const CONFIG = {
  // Zona horaria de Venezuela (UTC-4)
  TIMEZONE: 'America/Caracas',
  
  // Locale para formateo de fechas en español
  LOCALE: 'es-ES',
  
  // Opciones de formateo de fecha
  FORMATO_FECHA: {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  },
  
  // Milisegundos en un día (para cálculos)
  MS_POR_DIA: 1000 * 60 * 60 * 24
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Valida que una fecha sea válida
 * @param {Date} fecha - Objeto Date a validar
 * @returns {boolean} true si la fecha es válida
 */
function esFechaValida(fecha) {
  return fecha instanceof Date && !isNaN(fecha.getTime());
}

/**
 * Parsea una fecha en formato string a objeto Date
 * @param {string} fechaString - Fecha en formato "YYYY-MM-DD"
 * @returns {Date} Objeto Date
 * @throws {Error} Si la fecha no es válida
 */
function parsearFecha(fechaString) {
  if (!fechaString || typeof fechaString !== 'string') {
    throw new Error(`Fecha inválida: se esperaba un string, se recibió ${typeof fechaString}`);
  }
  
  const fecha = new Date(fechaString);
  
  if (!esFechaValida(fecha)) {
    throw new Error(`Fecha inválida: "${fechaString}" no es una fecha válida`);
  }
  
  return fecha;
}

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {Date} fechaFutura - Fecha del evento
 * @param {Date} fechaActual - Fecha actual
 * @returns {number} Días de diferencia (puede ser negativo si el evento ya pasó)
 */
function calcularDiferenciaDias(fechaFutura, fechaActual) {
  // Normalizar ambas fechas a medianoche para comparación precisa
  const fechaFuturaNormalizada = new Date(fechaFutura);
  fechaFuturaNormalizada.setHours(0, 0, 0, 0);
  
  const fechaActualNormalizada = new Date(fechaActual);
  fechaActualNormalizada.setHours(0, 0, 0, 0);
  
  // Calcular diferencia en milisegundos
  const diferenciaMilisegundos = fechaFuturaNormalizada - fechaActualNormalizada;
  
  // Convertir a días (redondear hacia arriba para ser conservadores)
  const dias = Math.ceil(diferenciaMilisegundos / CONFIG.MS_POR_DIA);
  
  return dias;
}

/**
 * Formatea una fecha a string legible en español
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada (ej: "03/12/2025 13:45:30")
 */
function formatearFechaLegible(fecha) {
  return fecha.toLocaleString(CONFIG.LOCALE, CONFIG.FORMATO_FECHA);
}

/**
 * Genera metadata adicional sobre el cálculo
 * @param {number} dias - Días calculados
 * @param {Date} fechaEvento - Fecha del evento
 * @param {Date} fechaActual - Fecha actual
 * @returns {Object} Metadata con información adicional
 */
function generarMetadata(dias, fechaEvento, fechaActual) {
  return {
    dias_calculados: dias,
    fecha_evento_iso: fechaEvento.toISOString(),
    fecha_calculo_iso: fechaActual.toISOString(),
    evento_en_pasado: dias < 0,
    semanas_restantes: Math.floor(dias / 7),
    meses_restantes: Math.floor(dias / 30)
  };
}

// ============================================
// LÓGICA PRINCIPAL
// ============================================

try {
  // Obtener datos del input
  const input = $input.item.json;
  
  // ESTRATEGIA DE MIGRACIÓN:
  // Intentar leer del Modelo Canónico (UDO) primero
  // Si no, fallback al modelo antiguo (Webhook plano)
  
  let fechaEventoString;
  
  if (input.evento && input.evento.fecha) {
    // Caso 1: Nuevo Modelo Canónico
    fechaEventoString = input.evento.fecha;
    console.log('✅ Usando Modelo Canónico (UDO)');
  } else if (input.body && input.body.fecha_evento) {
    // Caso 2: Modelo Antiguo (Webhook)
    fechaEventoString = input.body.fecha_evento;
    console.log('⚠️ Usando Modelo Legacy (Webhook)');
  } else if (input.fecha_evento) {
    // Caso 3: Plano directo (Legacy)
    fechaEventoString = input.fecha_evento;
  }
  
  // Validar fecha
  if (!fechaEventoString) {
    throw new Error('El campo "evento.fecha" (o fecha_evento) es requerido');
  }
  
  // Parsear fecha del evento
  const fechaEvento = parsearFecha(input.fecha_evento);
  
  // Obtener fecha actual
  const fechaActual = new Date();
  
  // Calcular días restantes
  const diasRestantes = calcularDiferenciaDias(fechaEvento, fechaActual);
  
  // Generar timestamps
  const timestampSolicitud = fechaActual.toISOString();
  const fechaProcesamiento = formatearFechaLegible(fechaActual);
  
  // Generar metadata (opcional, útil para debugging)
  const metadata = generarMetadata(diasRestantes, fechaEvento, fechaActual);
  
  // Logging para debugging (visible en ejecución de N8N)
  console.log(`📅 Evento: ${input.fecha_evento}`);
  console.log(`⏰ Días restantes: ${diasRestantes}`);
  console.log(`🕐 Procesado: ${fechaProcesamiento}`);
  
  // Advertencia si el evento ya pasó
  if (diasRestantes < 0) {
    console.warn(`⚠️ ADVERTENCIA: El evento ya pasó (hace ${Math.abs(diasRestantes)} días)`);
  }
  
  // Retornar datos enriquecidos
  return {
    ...input,
    dias_del_evento: diasRestantes,
    timestamp_solicitud: timestampSolicitud,
    fecha_procesamiento: fechaProcesamiento,
    // Metadata adicional (comentar si no se necesita)
    _metadata_calculo: metadata
  };
  
} catch (error) {
  // Manejo de errores robusto
  console.error('❌ Error en calcularDias:', error.message);
  
  // Re-lanzar el error para que N8N lo maneje
  // (esto hará que el workflow tome la rama de error si está configurada)
  throw new Error(`Error calculando días del evento: ${error.message}`);
}
