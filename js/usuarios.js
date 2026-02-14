/**
 * ========================================
 * GESTIÓN DE USUARIOS - SOLO ADMIN
 * ========================================
 * 
 * Este módulo permite al administrador:
 * - Ver todos los usuarios del sistema
 * - Crear nuevos usuarios
 * - Editar usuarios existentes
 * - Eliminar usuarios
 * - Cambiar roles de usuarios
 */

/**
 * ========================================
 * CRUD DE USUARIOS
 * ========================================
 */

/**
 * Función para crear un nuevo usuario
 * Solo el admin puede crear usuarios
 * 
 * @param {string} nombre - Nombre completo del usuario
 * @param {string} correo - Email único
 * @param {string} password - Contraseña
 * @param {string} rol - Rol del usuario (admin, operador, cliente)
 * @returns {Object} Resultado de la operación
 */
function crearUsuario(nombre, correo, password, rol) {
    console.log(`📝 Creando nuevo usuario: ${nombre} (${rol})`);
    
    // Obtenemos todos los usuarios
    const usuarios = obtenerUsuarios();
    
    // Verificamos que el correo no exista
    const correoExiste = usuarios.some(u => u.correo === correo);
    
    if (correoExiste) {
        console.error(`❌ El correo ${correo} ya está registrado`);
        return {
            exito: false,
            mensaje: 'El correo electrónico ya está registrado'
        };
    }
    
    // Generamos nuevo ID
    const nuevoId = generarNuevoId(usuarios);
    
    // Creamos el objeto usuario
    const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre,
        correo: correo,
        password: password,
        rol: rol
    };
    
    // Agregamos al array
    usuarios.push(nuevoUsuario);
    
    // Guardamos en localStorage
    guardarUsuarios(usuarios);
    
    console.log(`✅ Usuario creado exitosamente - ID: ${nuevoId}`);
    
    return {
        exito: true,
        mensaje: 'Usuario creado exitosamente',
        usuario: nuevoUsuario
    };
}

/**
 * Función para actualizar un usuario existente
 * 
 * @param {number} usuarioId - ID del usuario a actualizar
 * @param {Object} datosNuevos - Objeto con los datos a actualizar
 * @returns {Object} Resultado de la operación
 */
function actualizarUsuario(usuarioId, datosNuevos) {
    console.log(`🔄 Actualizando usuario ${usuarioId}...`);
    
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(u => u.id === usuarioId);
    
    if (indice === -1) {
        console.error(`❌ Usuario ${usuarioId} no encontrado`);
        return {
            exito: false,
            mensaje: 'Usuario no encontrado'
        };
    }
    
    // Si se está cambiando el correo, verificar que no exista
    if (datosNuevos.correo && datosNuevos.correo !== usuarios[indice].correo) {
        const correoExiste = usuarios.some(u => u.correo === datosNuevos.correo);
        if (correoExiste) {
            return {
                exito: false,
                mensaje: 'El correo ya está en uso por otro usuario'
            };
        }
    }
    
    // Actualizamos solo los campos proporcionados
    if (datosNuevos.nombre) usuarios[indice].nombre = datosNuevos.nombre;
    if (datosNuevos.correo) usuarios[indice].correo = datosNuevos.correo;
    if (datosNuevos.password) usuarios[indice].password = datosNuevos.password;
    if (datosNuevos.rol) usuarios[indice].rol = datosNuevos.rol;
    
    // Guardamos
    guardarUsuarios(usuarios);
    
    console.log(`✅ Usuario actualizado exitosamente`);
    
    return {
        exito: true,
        mensaje: 'Usuario actualizado exitosamente',
        usuario: usuarios[indice]
    };
}

/**
 * Función para eliminar un usuario
 * IMPORTANTE: También elimina todas sus reservas
 * 
 * @param {number} usuarioId - ID del usuario a eliminar
 * @returns {Object} Resultado de la operación
 */
function eliminarUsuario(usuarioId) {
    console.log(`🗑️ Eliminando usuario ${usuarioId}...`);
    
    // No permitir eliminar al admin principal
    if (usuarioId === 1) {
        return {
            exito: false,
            mensaje: 'No se puede eliminar al administrador principal'
        };
    }
    
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(u => u.id === usuarioId);
    
    if (indice === -1) {
        return {
            exito: false,
            mensaje: 'Usuario no encontrado'
        };
    }
    
    const usuarioEliminado = usuarios[indice];
    
    // Eliminar el usuario
    usuarios.splice(indice, 1);
    guardarUsuarios(usuarios);
    
    // Eliminar todas sus reservas
    const reservas = obtenerReservas();
    const reservasActualizadas = reservas.filter(r => r.clienteId !== usuarioId);
    guardarReservas(reservasActualizadas);
    
    const reservasEliminadas = reservas.length - reservasActualizadas.length;
    
    console.log(`✅ Usuario eliminado. También se eliminaron ${reservasEliminadas} reservas`);
    
    return {
        exito: true,
        mensaje: `Usuario eliminado. Se eliminaron ${reservasEliminadas} reservas asociadas`,
        usuario: usuarioEliminado
    };
}

/**
 * Función para obtener un usuario por ID
 * 
 * @param {number} usuarioId - ID del usuario
 * @returns {Object|null} Usuario encontrado o null
 */
function obtenerUsuarioPorId(usuarioId) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.id === usuarioId) || null;
}

/**
 * Función para validar datos de usuario
 * 
 * @param {string} nombre - Nombre del usuario
 * @param {string} correo - Email
 * @param {string} password - Contraseña
 * @param {string} rol - Rol
 * @returns {Object} Objeto con validación
 */
function validarDatosUsuario(nombre, correo, password, rol) {
    const errores = [];
    
    // Validar nombre
    if (!nombre || nombre.trim().length < 3) {
        errores.push('El nombre debe tener al menos 3 caracteres');
    }
    
    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || !emailRegex.test(correo)) {
        errores.push('El correo electrónico no es válido');
    }
    
    // Validar password
    if (!password || password.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    // Validar rol
    const rolesValidos = ['admin', 'operador', 'cliente'];
    if (!rol || !rolesValidos.includes(rol)) {
        errores.push('El rol debe ser: admin, operador o cliente');
    }
    
    return {
        valido: errores.length === 0,
        errores: errores
    };
}

console.log('👥 Módulo de gestión de usuarios cargado');
