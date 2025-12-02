#!/bin/bash
# Script para detener N8N local

echo "🛑 Deteniendo N8N local..."
docker stop n8n-local 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ N8N detenido exitosamente"
else
    echo "ℹ️  N8N no estaba corriendo"
fi
