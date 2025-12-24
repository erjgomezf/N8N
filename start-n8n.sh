#!/bin/bash
# Script para iniciar N8N local con Docker

echo "🚀 Iniciando N8N local..."
echo "ℹ️  Para que Telegram funcione, necesitas la URL de Cloudflare (https://...trycloudflare.com)"
read -p "Introduce la URL del Webhook (Enter para omitir): " WEBHOOK_URL

if [ -z "$WEBHOOK_URL" ]; then
  echo "⚠️  Iniciando sin WEBHOOK_URL (Telegram no funcionará)"
  docker run -it --rm \
    --name n8n-local \
    -p 5678:5678 \
    -v n8n_data:/home/node/.n8n \
    n8nio/n8n
else
  echo "✅ Iniciando con WEBHOOK_URL=$WEBHOOK_URL"
  docker run -it --rm \
    --name n8n-local \
    -p 5678:5678 \
    -e WEBHOOK_URL="$WEBHOOK_URL" \
    -v n8n_data:/home/node/.n8n \
    n8nio/n8n
fi
