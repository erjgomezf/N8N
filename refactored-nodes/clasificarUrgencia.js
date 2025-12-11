/**
 * ============================================
 * NODO: clasificarUrgencia
 * ============================================
 * 
 * PROPÓSITO:
 * Clasifica la urgencia de una solicitud de evento según múltiples criterios
 * de negocio para priorizar el seguimiento comercial.
 * 
 * INPUT (desde nodo anterior):
 * - dias_del_evento: number - Días restantes hasta el evento
 * - paquete_interes: string - Paquete seleccionado por el cliente
 * - tipo_evento: string - Categoría del evento
 * 
 * OUTPUT:
 * - nivel_urgencia: string - Descripción del nivel (ej: "🔴 ALTA (Menos de 1 semana)")
 * - emoji_urgencia: string - Emoji visual para identificación rápida
 * 
 * LÓGICA DE CLASIFICACIÓN:
 * 1. ALTA (🔴): Eventos próximos (<7 días), clientes Enterprise, corporativos urgentes
 * 2. MEDIA (🟡): Eventos cercanos (<30 días), paquetes Premium
 * 3. NORMAL (🟢): Resto de casos
 * 
 * AUTOR: Live Moments Team
 * ÚLTIMA ACTUALIZACIÓN: 2025-12-03
 */

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const CONFIG = {
  // Umbrales de días para clasificación
  UMBRALES_DIAS: {
    ALTA_URGENCIA: 7,
    MEDIA_URGENCIA: 30,
    CORPORATIVO_URGENTE: 14
  },
  
  // Tipos de paquetes
  PAQUETES: {
    BASICO: 'Básico',
    ESTANDAR: 'Estándar',
    PREMIUM: 'Premium',
    ENTERPRISE: 'Enterprise'
  },
  
  // Tipos de eventos especiales
  EVENTOS_ESPECIALES: {
    CORPORATIVO: 'Conferencias y eventos corporativos'
  },
  
  // Niveles de urgencia
  NIVELES: {
    ALTA: {
      emoji: '🔴',
      prefijo: '🔴 ALTA'
    },
    MEDIA: {
      emoji: '🟡',
      prefijo: '🟡 MEDIA'
    },
    NORMAL: {
      emoji: '🟢',
      prefijo: '🟢 Normal'
    }
  }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Determina si el evento es de tipo corporativo
 * @param {string} tipoEvento - Tipo de evento
 * @returns {boolean}
 */
function esCorporativo(tipoEvento) {
  return tipoEvento === CONFIG.EVENTOS_ESPECIALES.CORPORATIVO;
}

/**
 * Determina si el paquete es Enterprise
 * @param {string} paquete - Paquete seleccionado
 * @returns {boolean}
 */
function esEnterprise(paquete) {
  return paquete === CONFIG.PAQUETES.ENTERPRISE;
}

/**
 * Determina si el paquete es Premium
 * @param {string} paquete - Paquete seleccionado
 * @returns {boolean}
 */
function esPremium(paquete) {
  return paquete === CONFIG.PAQUETES.PREMIUM;
}

/**
 * Clasifica la urgencia según días restantes
 * @param {number} dias - Días hasta el evento
 * @param {string} paquete - Paquete seleccionado
 * @param {string} tipoEvento - Tipo de evento
 * @returns {Object} {nivel, emoji, razon}
 */
function clasificarPorCriterios(dias, paquete, tipoEvento) {
  // CRITERIO 1: Menos de 7 días (ALTA URGENCIA)
  if (dias < CONFIG.UMBRALES_DIAS.ALTA_URGENCIA) {
    return {
      nivel: CONFIG.NIVELES.ALTA.prefijo,
      emoji: CONFIG.NIVELES.ALTA.emoji,
      razon: 'Menos de 1 semana'
    };
  }
  
  // CRITERIO 2: Cliente Enterprise (ALTA URGENCIA)
  if (esEnterprise(paquete)) {
    return {
      nivel: CONFIG.NIVELES.ALTA.prefijo,
      emoji: '💎', // Emoji especial para Enterprise
      razon: 'Cliente Enterprise'
    };
  }
  
  // CRITERIO 3: Evento corporativo próximo (ALTA URGENCIA)
  if (esCorporativo(tipoEvento) && dias < CONFIG.UMBRALES_DIAS.CORPORATIVO_URGENTE) {
    return {
      nivel: CONFIG.NIVELES.ALTA.prefijo,
      emoji: '🏢', // Emoji especial para corporativo
      razon: 'Corporativo próximo'
    };
  }
  
  // CRITERIO 4: Menos de 30 días (MEDIA URGENCIA)
  if (dias < CONFIG.UMBRALES_DIAS.MEDIA_URGENCIA) {
    return {
      nivel: CONFIG.NIVELES.MEDIA.prefijo,
      emoji: CONFIG.NIVELES.MEDIA.emoji,
      razon: 'Menos de 1 mes'
    };
  }
  
  // CRITERIO 5: Paquete Premium (MEDIA URGENCIA)
  if (esPremium(paquete)) {
    return {
      nivel: CONFIG.NIVELES.MEDIA.prefijo,
      emoji: '⭐', // Emoji especial para Premium
      razon: 'Paquete Premium'
    };
  }
  
  // CRITERIO 6: Resto de casos (NORMAL)
  return {
    nivel: CONFIG.NIVELES.NORMAL.prefijo,
    emoji: CONFIG.NIVELES.NORMAL.emoji,
    razon: 'Tiempo suficiente'
  };
}

// ============================================
// LÓGICA PRINCIPAL
// ============================================

// Obtener datos del input
const input = $input.item.json;

// Extraer variables necesarias
// Extraer variables necesarias con soporte para Modelo Canónico y Legacy
const dias = input.dias_del_evento; // Este campo lo agrega calcularDias, sigue igual

let paquete, tipoEvento;

if (input.venta && input.evento) {
  // Modelo Canónico
  paquete = input.venta.paquete;
  tipoEvento = input.evento.tipo;
} else if (input.body) {
  // Modelo Webhook Legacy
  paquete = input.body.paquete_interes;
  tipoEvento = input.body.tipo_evento;
} else {
  // Fallback plano
  paquete = input.paquete_interes;
  tipoEvento = input.tipo_evento;
}

// Validar que tenemos los datos necesarios
if (typeof dias !== 'number' || !paquete || !tipoEvento) {
  throw new Error('Faltan datos requeridos para clasificar urgencia');
}

// Clasificar urgencia
const clasificacion = clasificarPorCriterios(dias, paquete, tipoEvento);

// Construir descripción completa
const urgenciaCompleta = `${clasificacion.nivel} (${clasificacion.razon})`;

// Retornar datos enriquecidos
return {
  ...input,
  nivel_urgencia: urgenciaCompleta,
  emoji_urgencia: clasificacion.emoji,
  // Campos adicionales para debugging/analytics
  _metadata: {
    dias_clasificacion: dias,
    criterio_aplicado: clasificacion.razon,
    timestamp_clasificacion: new Date().toISOString()
  }
};
