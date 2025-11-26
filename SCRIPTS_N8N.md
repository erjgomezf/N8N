# ⚡ Scripts para Nodos de Código N8N

Copia y pega estos scripts en los nodos de tipo **"Code"** (JavaScript) dentro de tu workflow de N8N.

---

## 1. Nodo: Calcular Días y Preparar Datos
**Objetivo:** Calcular cuántos días faltan para el evento y agregar un timestamp.

```javascript
// Obtener datos del input (Webhook)
const input = $input.item.json.body;  // ← Agregamos .body aquí

// Calcular días restantes
const fechaEvento = new Date(input.fecha_evento);
const hoy = new Date();
const diferencia = fechaEvento - hoy;
const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

// Retornar datos enriquecidos
return {
  ...input,
  dias_del_evento: dias,
  timestamp_solicitud: new Date().toISOString(),
  fecha_procesamiento: new Date().toLocaleString('es-ES', { timeZone: 'America/Caracas' })
};
```

---

## 2. Nodo: Clasificar Urgencia
**Objetivo:** Determinar la prioridad del lead basándose en la fecha y el paquete.

```javascript
const input = $input.item.json;
const dias = input.dias_del_evento;
const paquete = input.paquete_interes;
const tipo = input.tipo_evento;

let urgencia = "🟢 Normal";
let emoji = "🟢";

// Lógica de Urgencia
if (dias < 7) {
    urgencia = "🔴 ALTA (Menos de 1 semana)";
    emoji = "🔴";
} else if (paquete === "Enterprise") {
    urgencia = "🔴 ALTA (Cliente Enterprise)";
    emoji = "💎";
} else if (tipo === "Conferencias y eventos corporativos" && dias < 14) {
    urgencia = "🔴 ALTA (Corporativo próximo)";
    emoji = "🏢";
} else if (dias < 30) {
    urgencia = "🟡 MEDIA (Menos de 1 mes)";
    emoji = "🟡";
} else if (paquete === "Premium") {
    urgencia = "🟡 MEDIA (Paquete Premium)";
    emoji = "⭐";
}

return {
  ...input,
  nivel_urgencia: urgencia,
  emoji_urgencia: emoji
};
```

---

## 3. Nodo: Validar Datos (Opcional)
**Objetivo:** Asegurar que los datos críticos no vengan vacíos antes de procesar.
*Nota: Úsalo en un nodo "If" o "Switch", o como un nodo Code que lance error.*

```javascript
const input = $input.item.json;
const errores = [];

if (!input.nombre_cliente || input.nombre_cliente.length < 3) {
    errores.push("Nombre inválido");
}
if (!input.email_cliente || !input.email_cliente.includes('@')) {
    errores.push("Email inválido");
}
if (!input.telefono_cliente || input.telefono_cliente.length < 10) {
    errores.push("Teléfono inválido");
}

return {
    ...input,
    datos_validos: errores.length === 0,
    lista_errores: errores
};
```


