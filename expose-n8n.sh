#!/bin/bash
# Script para exponer N8N con Cloudflare Tunnel

echo "🌐 Exponiendo N8N con Cloudflare Tunnel..."
echo "⚠️  Copia la URL que aparecerá abajo y actualízala en formulario.html"
echo ""
cloudflared tunnel --url http://localhost:5678 --no-autoupdate
