// Configuración del webhook para desarrollo
// Actualiza solo esta línea cada vez que cambies el tunnel de Cloudflare

const WEBHOOK_CONFIG = {
  // Para desarrollo local con Cloudflare Tunnel
  // Actualiza esta URL cada vez que reinicies cloudflared
  CLOUDFLARE_URL: 'https://urls-chronicle-from-dana.trycloudflare.com',
  
  // Para desarrollo local directo (sin tunnel)
  LOCAL_URL: 'http://localhost:5678',
  
  // Para producción (N8N Cloud)
  PRODUCTION_URL: 'https://erjgomezf.app.n8n.cloud',
  
  // Ruta del webhook (igual para todos)
  WEBHOOK_PATH: '/webhook-test/streaming-service',
  
  // Modo actual: 'cloudflare', 'local', o 'production'
  MODE: 'cloudflare'
};

// Función para obtener la URL completa del webhook
function getWebhookUrl() {
  let baseUrl;
  
  switch(WEBHOOK_CONFIG.MODE) {
    case 'cloudflare':
      baseUrl = WEBHOOK_CONFIG.CLOUDFLARE_URL;
      break;
    case 'local':
      baseUrl = WEBHOOK_CONFIG.LOCAL_URL;
      break;
    case 'production':
      baseUrl = WEBHOOK_CONFIG.PRODUCTION_URL;
      break;
    default:
      baseUrl = WEBHOOK_CONFIG.PRODUCTION_URL;
  }
  
  return baseUrl + WEBHOOK_CONFIG.WEBHOOK_PATH;
}

// Exportar para uso en el formulario
window.WEBHOOK_URL = getWebhookUrl();

// Log para debugging (puedes comentar en producción)
console.log('🔗 Webhook URL configurada:', window.WEBHOOK_URL);
console.log('📍 Modo actual:', WEBHOOK_CONFIG.MODE);
