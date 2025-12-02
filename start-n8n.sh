#!/bin/bash
# Script para iniciar N8N local con Docker

echo "🚀 Iniciando N8N local..."
docker run -it --rm \
  --name n8n-local \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
