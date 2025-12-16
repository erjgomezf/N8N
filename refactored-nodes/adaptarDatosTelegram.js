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

console.log('🔄 Adaptando datos de Telegram a Modelo Canónico (UDO)...');

// Mapeo seguro de campos con valores por defecto
const datosCanonicos = {
  // 1. DATOS DEL CLIENTE
  cliente: {
    nombre: datos.nombre_cliente || "Cliente Desconocido",
    email: datos.email_cliente || "no-email@registrado.com",
    telefono: limpiarTelefono(datos.telefono_cliente) || null,
    idioma: "es"
  },

  // 2. DATOS DEL EVENTO
  evento: {
    tipo: datos.tipo_evento || "No especificado",
    fecha: convertirFechaAISO(datos.fecha_evento), // YYYY-MM-DD
    ubicacion: datos.ubicacion_evento || "No especificada",
    venue_tiene_internet: datos.tiene_internet_venue === 'si' || datos.tiene_internet_venue === true, // Normalizar a booleano
    duracion_horas: parseInt(datos.duracion_estimada) || 4,
    comentarios: datos.comentarios_adicionales || "Ninguno"
  },

  // 3. DATOS COMERCIALES
  venta: {
    paquete: datos.paquete_interes || "Básico",
    addons: datos.add_ons_solicitados || [],
    presupuesto_estimado: null,
    moneda: "USD"
  },

  // 4. METADATOS
  metadata: {
    origen: datos.origen || 'telegram',
    canal_id: input.chat_id || datos.chat_id || 'unknown',
    timestamp_ingreso: new Date().toISOString(),
    version_schema: "2.0", // Versión Canónica
    validacion_ia_usada: datos.tipoValidacion === 'IA',
    intentos_validacion: parseInt(datos.intentos_validacion || 0)
  },

  // 5. FLAGS
  flags: {
    es_prueba: false,
    requiere_revision_humana: datos.revision_manual || false
  }
};

// Validación final de campos críticos para el Core
if (!datosCanonicos.evento.fecha) {
  console.warn('⚠️ Fecha de evento inválida o faltante adaptando Telegram');
}

console.log('✅ Transformación Canónica Exitosa');
return datosCanonicos;
