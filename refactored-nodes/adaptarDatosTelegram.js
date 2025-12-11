/**
 * ============================================
 * NODO: adaptarDatosTelegram
 * ============================================
 * 
 * PROPÓSITO:
 * Convierte los datos del flujo de Telegram al formato esperado
 * por el flujo web (calcularDias, clasificarUrgencia, etc.)
 * 
 * INPUT (desde switchValidacionIA -> Merge):
 * - update_data: Objeto con datos del usuario en formato Telegram
 *   - fecha_evento: "DD/MM/YYYY"
 * 
 * OUTPUT:
 * - body: Objeto con datos en formato web
 *   - fecha_evento: "YYYY-MM-DD"
 * 
 * UBICACIÓN EN FLUJO:
 * switchValidacionIA (send_to_central) → adaptarDatosTelegram → Merge → calcularDias
 * 
 * AUTOR: Live Moments Team
 * ÚLTIMA ACTUALIZACIÓN: 2025-12-09
 */

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Convierte fecha de DD/MM/YYYY a YYYY-MM-DD
 * @param {string} fechaDDMMYYYY - Fecha en formato "DD/MM/YYYY"
 * @returns {string} Fecha en formato "YYYY-MM-DD" o null si inválida
 */
function convertirFechaAISO(fechaDDMMYYYY) {
  if (!fechaDDMMYYYY || typeof fechaDDMMYYYY !== 'string') {
    console.warn('⚠️ Fecha vacía o no es string:', fechaDDMMYYYY);
    return null;
  }
  
  // Si ya está en formato ISO (YYYY-MM-DD), retornar tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaDDMMYYYY)) {
    console.log('📅 Fecha ya está en formato ISO:', fechaDDMMYYYY);
    return fechaDDMMYYYY;
  }
  
  // Convertir DD/MM/YYYY a YYYY-MM-DD
  const partes = fechaDDMMYYYY.split('/');
  if (partes.length !== 3) {
    console.warn('⚠️ Formato de fecha no reconocido:', fechaDDMMYYYY);
    return fechaDDMMYYYY; // Retornar original si no se puede parsear
  }
  
  const [dia, mes, anio] = partes;
  const fechaISO = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  
  console.log(`📅 Fecha convertida: ${fechaDDMMYYYY} → ${fechaISO}`);
  return fechaISO;
}

/**
 * Limpia el número de teléfono a solo dígitos con código de país
 * @param {string} telefono - Teléfono en cualquier formato
 * @returns {string} Teléfono limpio
 */
function limpiarTelefono(telefono) {
  if (!telefono) return '';
  // Mantener el + si existe, eliminar todo lo demás que no sea dígito
  const limpio = telefono.replace(/[^\d+]/g, '');
  return limpio;
}

// ============================================
// LÓGICA PRINCIPAL
// ============================================

const input = $input.item.json;

// Los datos vienen en update_data desde el flujo de Telegram
const datos = input.update_data || input;

// Validar que tenemos datos
if (!datos || Object.keys(datos).length === 0) {
  throw new Error('No se recibieron datos para adaptar');
}

console.log('🔄 Adaptando datos de Telegram a formato web...');
console.log('📊 Datos originales:', JSON.stringify(datos, null, 2));

// Crear objeto en formato compatible con el flujo web
// El flujo web espera los datos dentro de un objeto "body"
const datosAdaptados = {
  body: {
    // Datos del evento
    tipo_evento: datos.tipo_evento || null,
    fecha_evento: convertirFechaAISO(datos.fecha_evento),
    ubicacion_evento: datos.ubicacion_evento || null,
    duracion_estimada: datos.duracion_estimada || 'No especificada',
    tiene_internet_venue: datos.tiene_internet_venue || 'No especificado',
    
    // Datos del paquete
    paquete_interes: datos.paquete_interes || null,
    add_ons_solicitados: datos.add_ons_solicitados || [],
    
    // Datos del cliente
    nombre_cliente: datos.nombre_cliente || null,
    email_cliente: datos.email_cliente || null,
    telefono_cliente: limpiarTelefono(datos.telefono_cliente),
    
    // Comentarios
    comentarios_adicionales: datos.comentarios_adicionales || '',
    
    // Metadata de origen (para tracking)
    origen: datos.origen || 'telegram',
    tipoValidacion: datos.tipoValidacion || 'IA',
    
    // Campos adicionales que podrían venir del bot
    revision_manual: datos.revision_manual || false
  }
};

// Validar campos críticos
const camposCriticos = ['tipo_evento', 'fecha_evento', 'nombre_cliente', 'email_cliente'];
const camposFaltantes = camposCriticos.filter(campo => !datosAdaptados.body[campo]);

if (camposFaltantes.length > 0) {
  console.warn(`⚠️ Campos críticos faltantes: ${camposFaltantes.join(', ')}`);
}

console.log('✅ Datos adaptados:', JSON.stringify(datosAdaptados, null, 2));

return datosAdaptados;
