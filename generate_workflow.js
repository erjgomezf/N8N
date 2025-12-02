const fs = require('fs');
const path = require('path');

const WORKFLOW_PATH = '/home/programar/Documentos/N8N/workflow_streaming.json';
const HTML_PATH = '/home/programar/Documentos/N8N/formulario.html';

// 1. Leer archivos
const workflow = JSON.parse(fs.readFileSync(WORKFLOW_PATH, 'utf8'));
let htmlContent = fs.readFileSync(HTML_PATH, 'utf8');

// 2. Preparar HTML
// Remover la referencia al script externo
htmlContent = htmlContent.replace('<script src="webhook-config.js"></script>', '');

// Inyectar la variable de N8N
// Buscamos la línea donde se define webhookUrl
const regexUrl = /const webhookUrl = window\.WEBHOOK_URL \|\| '[^']+';/;
const n8nExpression = "const webhookUrl = '{{ $('Configuracion').item.json.webhook_url }}';";

if (regexUrl.test(htmlContent)) {
    htmlContent = htmlContent.replace(regexUrl, n8nExpression);
} else {
    // Fallback si no encuentra la línea exacta (por si acaso)
    htmlContent = htmlContent.replace(
        /const webhookUrl = '[^']+';/, 
        n8nExpression
    );
}

// 3. Crear nodo de Configuración
const configNode = {
    "parameters": {
        "values": {
            "string": [
                {
                    "name": "webhook_url",
                    "value": "https://erjgomezf.app.n8n.cloud/webhook-test/streaming-service"
                }
            ]
        },
        "options": {}
    },
    "name": "Configuracion",
    "type": "n8n-nodes-base.set",
    "typeVersion": 2,
    "position": [
        120,
        -64
    ],
    "id": "configuracion-node-id"
};

// 4. Modificar el workflow
// Agregar el nuevo nodo
workflow.nodes.push(configNode);

// Actualizar fomularioWeb
const formNode = workflow.nodes.find(n => n.name === 'fomularioWeb');
if (formNode) {
    formNode.parameters.responseBody = htmlContent;
} else {
    console.error("No se encontró el nodo fomularioWeb");
    process.exit(1);
}

// 5. Actualizar conexiones
// Webhook -> Configuracion -> fomularioWeb

// Eliminar conexión existente Webhook -> fomularioWeb
if (workflow.connections["Webhook"] && workflow.connections["Webhook"]["main"]) {
    workflow.connections["Webhook"]["main"] = workflow.connections["Webhook"]["main"].filter(
        conn => conn[0].node !== 'fomularioWeb'
    );
}

// Conectar Webhook -> Configuracion
if (!workflow.connections["Webhook"]) workflow.connections["Webhook"] = { "main": [] };
if (!workflow.connections["Webhook"]["main"]) workflow.connections["Webhook"]["main"] = [];

workflow.connections["Webhook"]["main"].push([
    {
        "node": "Configuracion",
        "type": "main",
        "index": 0
    }
]);

// Conectar Configuracion -> fomularioWeb
workflow.connections["Configuracion"] = {
    "main": [
        [
            {
                "node": "fomularioWeb",
                "type": "main",
                "index": 0
            }
        ]
    ]
};

// 6. Guardar archivo
fs.writeFileSync(WORKFLOW_PATH, JSON.stringify(workflow, null, 2));
console.log("Workflow modificado exitosamente!");
