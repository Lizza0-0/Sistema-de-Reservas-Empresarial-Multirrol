/**
 * ========================================
 * SISTEMA DE REGISTRO - CLIENTES
 * ========================================
 * 
 * Permite a nuevos clientes registrarse en el sistema
 */

/**
 * Función para registrar un nuevo cliente
 * Los clientes se registran automáticamente con rol 'cliente'
 * 
 * @param {string} nombre - Nombre completo
 * @param {string} correo - Email único
 * @param {string} password - Contraseña
 * @returns {Object} Resultado del registro
 */
function registrarCliente(nombre, correo, password) {
    console.log(`📝 Registrando nuevo cliente: ${nombre}`);
    
    // Validar datos
    const validacion = validarDatosUsuario(nombre, correo, password, 'cliente');
    
    if (!validacion.valido) {
        console.error('❌ Datos inválidos:', validacion.errores);
        return {
            exito: false,
            mensaje: validacion.errores.join('. ')
        };
    }
    
    // Verificar que el correo no exista
    const usuarios = obtenerUsuarios();
    const correoExiste = usuarios.some(u => u.correo === correo);
    
    if (correoExiste) {
        return {
            exito: false,
            mensaje: 'El correo electrónico ya está registrado'
        };
    }
    
    // Crear el usuario con rol cliente
    const resultado = crearUsuario(nombre, correo, password, 'cliente');
    
    if (resultado.exito) {
        console.log(`✅ Cliente registrado exitosamente`);
    }
    
    return resultado;
}

console.log('📋 Sistema de registro cargado');
