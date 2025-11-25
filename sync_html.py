#!/usr/bin/env python3
import json
import sys

# Leer el HTML actualizado
with open('/home/programar/Documentos/N8N/webhoot.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Leer el JSON del workflow
with open('/home/programar/Documentos/N8N/webcam.json', 'r', encoding='utf-8') as f:
    workflow = json.load(f)

# Encontrar el nodo 'fomularioWeb' y actualizar su responseBody
for node in workflow['nodes']:
    if node.get('name') == 'fomularioWeb':
        node['parameters']['responseBody'] = html_content
        print(f"✅ Nodo '{node['name']}' actualizado con el HTML corregido")
        break
else:
    print("❌ No se encontró el nodo 'fomularioWeb'")
    sys.exit(1)

# Guardar el JSON actualizado
with open('/home/programar/Documentos/N8N/webcam.json', 'w', encoding='utf-8') as f:
    json.dump(workflow, f, ensure_ascii=False, indent=2)

print("✅ Workflow actualizado exitosamente")
