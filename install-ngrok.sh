#!/bin/bash
# Script para instalar y configurar ngrok

echo "📦 Instalando ngrok..."

# Descargar ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list

# Actualizar e instalar
sudo apt update
sudo apt install -y ngrok

echo "✅ ngrok instalado correctamente"
echo ""
echo "🔑 Ahora necesitas autenticarte:"
echo "1. Ve a https://dashboard.ngrok.com/get-started/your-authtoken"
echo "2. Copia tu authtoken"
echo "3. Ejecuta: ngrok config add-authtoken TU_TOKEN"
echo ""
echo "Luego ejecuta: ngrok http 5678"
