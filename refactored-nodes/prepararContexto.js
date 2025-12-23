/**
 * ============================================
 * NODO: prepararContexto
 * ============================================
 * 
 * PROPÓSITO:
 * Consolidar catálogo y preparar contexto completo para logicaBot.
 * Maneja la recuperación de sesión de forma transparente.
 * 
 * UBICACIÓN EN WORKFLOW:
 * ... → switchAccion → [prepararContexto] → logicaBot
 * 
 * INPUT:
 * - obtenerPaquetes (todos los items)
 * - obtenerAddons (todos los items)
 * - buscarSesion (datos de sesión)
 * - telegramTrigger (mensaje del usuario)
 * 
 * OUTPUT:
 * - Contexto completo consolidado para logicaBot
 */

// 1. Leer datos de entrada
const telegramData = $('telegramTrigger').first().json;
const sesionData = $('buscarSesion').first().json || {};

// 2. CONSOLIDAR CATÁLOGO
// IMPORTANTE: Leer directamente de los nodos de Sheets porque están antes del switch
let catalog = { paquetes: [], addons: [] };

try {
  // Leer paquetes
  const paquetesRaw = $('obtenerPaquetes').all();
  console.log('📊 Paquetes raw recibidos:', paquetesRaw.length);
  
  catalog.paquetes = paquetesRaw.map(p => {
    let detalle = [];
    try {
      const detalleStr = (p.json.Detalle || "[]").trim();
      detalle = JSON.parse(detalleStr);
    } catch (parseError) {
      console.error(`Error parseando Detalle para ${p.json.Nombre}:`, parseError.message);
      detalle = [];
    }
    
    return {
      Nombre: p.json.Nombre,
      Descripcion: p.json.Descripcion,
      Detalle: detalle,
      Precio: parseFloat(p.json.Precio) || 0,
      Icono: p.json.Icono
    };
  });

  // Leer addons
  const addonsRaw = $('obtenerAddons').all();
  console.log('📊 Addons raw recibidos:', addonsRaw.length);
  
  catalog.addons = addonsRaw.map(a => ({
    Nombre: a.json.Nombre,
    Precio: parseFloat(a.json.precio || a.json.Precio) || 0,
    Icono: a.json.Icono
  }));
  
  console.log('✅ Catálogo consolidado:', catalog.paquetes.length, 'paquetes,', catalog.addons.length, 'addons');
} catch (e) {
  console.error('❌ Error consolidando catálogo:', e.message);
  console.error('Stack:', e.stack);
}

// 3. Extraer datos de sesión
const pasoActual = sesionData.paso_actual || 'start';
const datosJson = sesionData.datos_json ? JSON.parse(sesionData.datos_json) : {};
const intentosFallidos = parseInt(sesionData.intentos_fallidos || 0);
const tipoValidacion = sesionData.tipoValidacion || 'BOT';

// 4. Detectar si es recuperación de sesión
const esRecuperacion = pasoActual !== 'start' && Object.keys(datosJson).length > 0;

// 5. Preparar contexto de recuperación si aplica
let mensajeRecuperacion = null;
let botonesRecuperacion = null;

if (esRecuperacion) {
  console.log('🔄 Recuperación de sesión detectada. Paso actual:', pasoActual);
  
  // Generar mensaje de recuperación
  const resumenDatos = [];
  if (datosJson.tipo_evento) resumenDatos.push(`🎊 Evento: ${datosJson.tipo_evento}`);
  if (datosJson.fecha_evento) resumenDatos.push(`📅 Fecha: ${datosJson.fecha_evento}`);
  if (datosJson.ubicacion_evento) resumenDatos.push(`📍 Ciudad: ${datosJson.ubicacion_evento}`);
  if (datosJson.paquete_interes) resumenDatos.push(`📦 Paquete: ${datosJson.paquete_interes}`);
  
  const datosStr = resumenDatos.length > 0 ? `**Datos guardados:**\n${resumenDatos.join('\n')}\n\n` : '';
  
  // Mensajes por paso
  const mensajesPorPaso = {
    'start': '¿Qué tipo de evento deseas transmitir?',
    'fecha': '¿Qué tipo de evento deseas transmitir?',
    'ciudad': '📅 ¿Cuál es la fecha del evento? (DD/MM/YYYY)',
    'ubicacion': '📍 ¿En qué ciudad será el evento?',
    'duracion': '⏱️ ¿Cuál es la duración estimada del evento?',
    'internet': '📡 ¿El lugar cuenta con conexión a Internet estable?',
    'paquete': '📦 Selecciona el paquete de tu interés:',
    'addons': '✨ ¿Deseas agregar algún servicio adicional?',
    'nombre': '👤 ¿Cuál es tu nombre completo?',
    'email': '📧 ¿Cuál es tu correo electrónico?',
    'telefono': '📞 ¿Cuál es tu número de teléfono?',
    'comentarios': '📝 ¿Tienes algún comentario adicional?',
    'completado': '¿Confirmas los datos?'
  };
  
  mensajeRecuperacion = `👋 ¡Hola de nuevo! Veo que ya tenías una reservación en progreso.\n\n${datosStr}${mensajesPorPaso[pasoActual] || 'Continuemos donde quedamos...'}`;
  
  // Generar botones dinámicos si el paso los requiere
  botonesRecuperacion = generarBotonesParaPaso(pasoActual, catalog, datosJson);
}

// 6. Preparar output consolidado
const contexto = {
  // Catálogo
  catalog: catalog,
  
  // Sesión
  paso_actual: pasoActual,
  datos_json: datosJson,
  intentos_fallidos: intentosFallidos,
  tipoValidacion: tipoValidacion,
  
  // Mensaje de Telegram
  message: telegramData.message || {},
  callback_query: telegramData.callback_query || null,
  chat_id: telegramData.message?.chat?.id || telegramData.callback_query?.message?.chat?.id,
  
  // Recuperación
  esRecuperacion: esRecuperacion,
  mensajeRecuperacion: mensajeRecuperacion,
  botonesRecuperacion: botonesRecuperacion
};

console.log('📦 Contexto preparado:', {
  paso: pasoActual,
  paquetes: catalog.paquetes.length,
  addons: catalog.addons.length,
  esRecuperacion: esRecuperacion
});

return contexto;

// ============================================
// FUNCIONES HELPER
// ============================================

function generarBotonesParaPaso(paso, catalog, datosActuales) {
  // Botones estáticos
  const botonesEstaticos = {
    'fecha': [
      [{ text: '🎊 Eventos Sociales', callback_data: 'Eventos sociales' }],
      [{ text: '🏢 Corporativo', callback_data: 'Conferencias y eventos corporativos' }],
      [{ text: '🎮 E-Sports', callback_data: 'E-Sport y Gaming' }],
      [{ text: '🎵 Conciertos', callback_data: 'Conciertos y Eventos Artísticos' }],
      [{ text: '⛪ Religiosos', callback_data: 'Eventos Religiosos' }],
      [{ text: '⚽ Deportivos', callback_data: 'Eventos Deportivos' }]
    ],
    'duracion': [
      [{ text: '⏱️ 2 a 4 horas', callback_data: 'duracion_2_4' }],
      [{ text: '📆 8 horas', callback_data: 'duracion_8' }],
      [{ text: '☀️ Todo el día', callback_data: 'duracion_dia' }],
      [{ text: '📅 Varios días', callback_data: 'duracion_varios' }]
    ],
    'internet': [
      [{ text: '✅ Sí, tiene internet', callback_data: 'internet_si' }],
      [{ text: '❌ No tiene / No estoy seguro', callback_data: 'internet_no' }]
    ]
  };
  
  // Botones dinámicos del catálogo
  if (paso === 'paquete' && catalog.paquetes && catalog.paquetes.length > 0) {
    return catalog.paquetes.map(p => ([{ 
      text: `${p.Icono} ${p.Nombre}`, 
      callback_data: `pkg_${p.Nombre.toLowerCase().replace(/\\s+/g, '_')}` 
    }]));
  }
  
  if (paso === 'addons' && catalog.addons && catalog.addons.length > 0) {
    const addonsSeleccionados = datosActuales.add_ons_solicitados || [];
    const nombresSeleccionados = addonsSeleccionados.map(a => a.nombre);
    
    const botones = catalog.addons
      .filter(a => !nombresSeleccionados.includes(a.Nombre))
      .map(a => ([{
        text: `${a.Icono} ${a.Nombre} (+$${a.Precio})`,
        callback_data: `addon_${a.Nombre.toLowerCase().replace(/\\s+/g, '_')}`
      }]));
      
    botones.push([{ text: '✅ Listo, continuar', callback_data: 'addon_listo' }]);
    return botones;
  }
  
  return botonesEstaticos[paso] || null;
}
