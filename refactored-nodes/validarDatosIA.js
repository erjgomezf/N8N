/**
 * ============================================
 * NODO: validarDatosIA
 * ============================================ 
 * 
 * PROPÓSITO:
 * Validación básica de datos DESPUÉS de la validación de IA.
 * Verifica formato de nombre, email y teléfono.
 * 
 * INPUT: Viene de ValidadorIA, datos están en update_data
 * OUTPUT: Agrega datos_validos y lista_errores
 */

const input = $input.item.json;
const errores = [];

// Los datos vienen en update_data desde ValidadorIA
const datos = input.update_data || {};

if (!datos.nombre_cliente || datos.nombre_cliente.length < 3) {
    errores.push("Nombre inválido");
}
if (!datos.email_cliente || !datos.email_cliente.includes('@')) {
    errores.push("Email inválido");
}
if (!datos.telefono_cliente || datos.telefono_cliente.replace(/\D/g, '').length < 10) {
    errores.push("Teléfono inválido");
}

return {
    ...input,
    datos_validos: errores.length === 0,
    lista_errores: errores
};