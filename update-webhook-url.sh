#!/bin/bash
# Script para actualizar la URL del Cloudflare Tunnel en webhook-config.js

echo "🔄 Actualizador de URL de Cloudflare Tunnel"
echo ""

# Verificar si webhook-config.js existe
if [ ! -f "webhook-config.js" ]; then
    echo "❌ Error: webhook-config.js no encontrado"
    exit 1
fi

# Solicitar la nueva URL
echo "📝 Ingresa la nueva URL del Cloudflare Tunnel:"
echo "   (ejemplo: https://abc-def-ghi.trycloudflare.com)"
read -p "URL: " new_url

# Validar que la URL no esté vacía
if [ -z "$new_url" ]; then
    echo "❌ Error: URL vacía"
    exit 1
fi

# Remover trailing slash si existe
new_url="${new_url%/}"

# Actualizar el archivo webhook-config.js
sed -i "s|CLOUDFLARE_URL: '.*'|CLOUDFLARE_URL: '$new_url'|g" webhook-config.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ URL actualizada exitosamente"
    echo "🔗 Nueva URL: $new_url"
    echo ""
    echo "📋 Configuración actual:"
    grep "CLOUDFLARE_URL:" webhook-config.js
    echo ""
    echo "💡 Tip: Asegúrate de que el MODE esté en 'cloudflare' en webhook-config.js"
else
    echo "❌ Error al actualizar el archivo"
    exit 1
fi
