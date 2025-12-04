# 📂 Nodos Refactorizados

Este directorio contiene versiones mejoradas de los nodos Code del workflow de N8N, aplicando buenas prácticas de programación.

## 🎯 Objetivo

Mejorar la calidad del código sin cambiar la funcionalidad, aplicando:
- ✅ Documentación clara con JSDoc
- ✅ Separación de responsabilidades (funciones pequeñas)
- ✅ Constantes centralizadas
- ✅ Manejo de errores
- ✅ Código autoexplicativo

## 📋 Nodos Disponibles

### ✅ clasificarUrgencia.js
**Estado**: Refactorizado
**Mejoras aplicadas**:
- Constantes de configuración centralizadas
- Funciones auxiliares para cada criterio
- Documentación completa con JSDoc
- Validación de inputs
- Metadata para debugging

**Cómo usar**:
1. Abre N8N en tu navegador
2. Edita el nodo "clasificarUrgencia"
3. Copia el contenido de `clasificarUrgencia.js`
4. Pega en el editor de código del nodo
5. Guarda y prueba

---

### ✅ calcularDias.js
**Estado**: Refactorizado
**Mejoras aplicadas**:
- Manejo correcto de zonas horarias (Venezuela UTC-4)
- Validación robusta de fechas
- Normalización de fechas a medianoche para comparación precisa
- Documentación completa con JSDoc
- Manejo de errores con try-catch
- Metadata adicional para debugging
- Logging informativo

**Cómo usar**:
1. Abre N8N en tu navegador
2. Edita el nodo "calcularDias"
3. Copia el contenido de `calcularDias.js`
4. Pega en el editor de código del nodo
5. Guarda y prueba

---

### 🔄 validarDatos.js
**Estado**: Pendiente
**Próximas mejoras**:
- Validación con schemas
- Mensajes de error descriptivos
- Separación de validadores

---

### 🔄 procesarRespuesta.js
**Estado**: Pendiente
**Próximas mejoras**:
- Templates HTML separados
- Funciones generadoras de secciones
- Reducir complejidad

---

## 📚 Convenciones de Código

### Estructura de un Nodo Refactorizado

```javascript
/**
 * Documentación del nodo
 */

// 1. CONFIGURACIÓN Y CONSTANTES
const CONFIG = { ... };

// 2. FUNCIONES AUXILIARES
function funcionAuxiliar() { ... }

// 3. LÓGICA PRINCIPAL
const input = $input.item.json;
// ... procesamiento
return { ... };
```

### Nomenclatura

- **Constantes**: `MAYUSCULAS_CON_GUION_BAJO`
- **Funciones**: `camelCase` descriptivo
- **Variables**: `camelCase` descriptivo
- **Objetos de config**: `CONFIG`, `TEMPLATES`, etc.

### Documentación

Cada función debe tener:
```javascript
/**
 * Descripción breve de qué hace
 * @param {tipo} nombre - Descripción del parámetro
 * @returns {tipo} Descripción del retorno
 */
```

---

## 🧪 Testing

Para probar un nodo refactorizado:

1. **Backup**: Exporta el workflow actual
2. **Copia**: Pega el código refactorizado
3. **Prueba**: Ejecuta con datos de prueba
4. **Valida**: Compara output con versión anterior
5. **Confirma**: Si funciona igual, mantén el cambio

---

## 📊 Comparación Antes/Después

### Antes (Original)
```javascript
const input = $input.item.json;
const dias = input.dias_del_evento;
const paquete = input.paquete_interes;
const tipo = input.tipo_evento;

let urgencia = "🟢 Normal";
let emoji = "🟢";

if (dias < 7) {
    urgencia = "🔴 ALTA (Menos de 1 semana)";
    emoji = "🔴";
} else if (paquete === "Enterprise") {
    urgencia = "🔴 ALTA (Cliente Enterprise)";
    emoji = "💎";
}
// ... más condiciones
```

**Problemas**:
- ❌ Números mágicos (7, 30, 14)
- ❌ Strings duplicados
- ❌ Sin documentación
- ❌ Difícil de modificar

### Después (Refactorizado)
```javascript
const CONFIG = {
  UMBRALES_DIAS: {
    ALTA_URGENCIA: 7,
    MEDIA_URGENCIA: 30
  }
};

function clasificarPorCriterios(dias, paquete, tipoEvento) {
  if (dias < CONFIG.UMBRALES_DIAS.ALTA_URGENCIA) {
    return { nivel: '🔴 ALTA', razon: 'Menos de 1 semana' };
  }
  // ...
}
```

**Mejoras**:
- ✅ Constantes centralizadas
- ✅ Funciones reutilizables
- ✅ Documentado
- ✅ Fácil de modificar

---

## 🚀 Próximos Pasos

1. Refactorizar `calcularDias.js`
2. Refactorizar `validarDatos.js`
3. Refactorizar `procesarRespuesta.js`
4. Crear tests unitarios
5. Documentar lecciones aprendidas
