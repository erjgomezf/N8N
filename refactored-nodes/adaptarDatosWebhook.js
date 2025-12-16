/**
 * ============================================
 * NODO: adaptarDatosWebhook
 * ============================================
 * 
 * PROPÓSITO:
 * Convierte los datos del formulario Web (webhook body) al 
 * Modelo de Datos Canónico (UDO) usado por el Core.
 * 
 * INPUT (desde Webhook):
 * - body: Objeto con los datos del form HTML
 *   - fecha_evento
 *   - tipo_evento
 *   - nombre_cliente
 *   - etc.
 * 
 * OUTPUT:
 * - Estructura UDO (cliente, evento, venta, metadata)
 */

const input = $input.item.json.body || $input.item.json;

// Validar que tenemos datos mínimos
if (!input || Object.keys(input).length === 0) {
  throw new Error('No se recibieron datos del formulario web');
}

console.log('🔄 Adaptando datos Web a Modelo Canónico (UDO)...');

// Función auxiliar para fecha (asegurar YYYY-MM-DD)
function normalizarFecha(fecha) {
  if (!fecha) return null;
  // Si viene DD/MM/YYYY, convertir. Si es YYYY-MM-DD, dejar igual.
  if (fecha.includes('/')) {
    const [d, m, y] = fecha.split('/');
    return `${y}-${m}-${d}`;
  }
  return fecha; // Asumimos ISO
}

// Mapeo al Estándar Canónico
const datosCanonicos = {
  // 1. DATOS DEL CLIENTE
  cliente: {
    nombre: input.nombre_cliente || "Cliente Web",
    email: input.email_cliente || "sin-email@web.com",
    telefono: input.telefono_cliente || null,
    idioma: "es"
  },

  // 2. DATOS DEL EVENTO
  evento: {
    tipo: input.tipo_evento || "No especificado",
    fecha: normalizarFecha(input.fecha_evento),
    ubicacion: input.ubicacion_evento || "No especificada",
    venue_tiene_internet: input.tiene_internet_venue === 'si' || input.tiene_internet_venue === true,
    duracion_horas: parseInt(input.duracion_estimada) || 4
  },

  // 3. DATOS COMERCIALES
  venta: {
    paquete: input.paquete_interes || "Básico",
    addons: Array.isArray(input.add_ons_solicitados) ? input.add_ons_solicitados : [],
    presupuesto_estimado: null,
    moneda: "USD"
  },

  // 4. METADATOS
  metadata: {
    origen: 'web', // Identificador fijo para este canal
    canal_id: 'web-form',
    timestamp_ingreso: new Date().toISOString(),
    version_schema: "2.0",
    validacion_ia_usada: false, // El web form no usa IA interactiva por ahora
    intentos_validacion: 0
  },

  // 5. FLAGS
  flags: {
    es_prueba: false,
    requiere_revision_humana: false
  }
};

// Validación básica pre-Core
if (!datosCanonicos.evento.fecha) {
  console.warn('⚠️ Fecha faltante en formulario web');
}

return datosCanonicos;
