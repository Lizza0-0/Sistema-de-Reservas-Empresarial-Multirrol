/**
 * ========================================
 * SISTEMA DE AUTENTICACIÓN Y SESIÓN
 * ========================================
 * 
 * Este módulo maneja el login de usuarios y la gestión de sesiones.
 * Usa sessionStorage para mantener la sesión activa durante la navegación.
 * 
 * DIFERENCIA entre localStorage y sessionStorage:
 * - localStorage: Los datos persisten aunque se cierre el navegador
 * - sessionStorage: Los datos se borran al cerrar la pestaña/navegador
 * 
 * Para las sesiones usamos sessionStorage porque queremos que el usuario
 * deba hacer login cada vez que abre el navegador (mayor seguridad).
 */

/**
 * Función principal de autenticación
 * Verifica las credenciales del usuario y crea una sesión si son correctas
 * 
 * @param {string} correo - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object|null} Objeto con resultado del login
 */
function autenticarUsuario(correo, password) {
    // 1. Obtenemos todos los usuarios del localStorage
    const usuarios = obtenerUsuarios();
    
    // 2. Buscamos un usuario que coincida con el correo y password
    // .find() busca el primer elemento que cumpla la condición
    const usuarioEncontrado = usuarios.find(usuario => 
        usuario.correo === correo && usuario.password === password
    );
    
    // 3. Verificamos si encontramos al usuario
    if (usuarioEncontrado) {
        /**
         * LOGIN EXITOSO
         * Guardamos los datos del usuario en sessionStorage para mantener la sesión
         * No guardamos el password por seguridad, solo los datos necesarios
         */
        const sesionUsuario = {
            id: usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre,
            correo: usuarioEncontrado.correo,
            rol: usuarioEncontrado.rol
        };
        
        // Guardamos la sesión en sessionStorage
        // JSON.stringify convierte el objeto a texto para poder guardarlo
        sessionStorage.setItem('usuarioActivo', JSON.stringify(sesionUsuario));
        
        console.log(`✅ Login exitoso: ${usuarioEncontrado.nombre} (${usuarioEncontrado.rol})`);
        
        // Retornamos un objeto indicando éxito y los datos del usuario
        return {
            exito: true,
            usuario: sesionUsuario,
            mensaje: 'Login exitoso'
        };
    } else {
        /**
         * LOGIN FALLIDO
         * Las credenciales no coinciden con ningún usuario
         */
        console.log('❌ Login fallido: credenciales incorrectas');
        
        return {
            exito: false,
            usuario: null,
            mensaje: 'Correo o contraseña incorrectos'
        };
    }
}

/**
 * Función para obtener el usuario actual de la sesión
 * Lee los datos del usuario desde sessionStorage
 * 
 * @returns {Object|null} Datos del usuario logueado o null si no hay sesión
 */
function obtenerUsuarioActivo() {
    // Obtenemos el texto JSON del sessionStorage
    const sesionJSON = sessionStorage.getItem('usuarioActivo');
    
    // Si existe, lo convertimos de JSON a objeto JavaScript
    if (sesionJSON) {
        const usuario = JSON.parse(sesionJSON);
        console.log(`👤 Usuario activo: ${usuario.nombre} (${usuario.rol})`);
        return usuario;
    }
    
    // Si no hay sesión, retornamos null
    console.log('❌ No hay usuario activo');
    return null;
}

/**
 * Función para verificar si hay un usuario logueado
 * Esta es la función de PROTECCIÓN de páginas
 * 
 * ¿Cómo funciona la protección?
 * 1. Verifica si existe una sesión activa
 * 2. Si NO existe, redirige al usuario al login
 * 3. Si existe, permite continuar
 * 
 * Esta función debe ejecutarse al inicio de cada página protegida
 * 
 * @param {string} paginaLogin - URL de la página de login (opcional)
 * @returns {boolean} true si hay sesión activa, false si no
 */
function verificarSesion(paginaLogin = 'login.html') {
    const usuario = obtenerUsuarioActivo();
    
    if (!usuario) {
        // No hay sesión activa, redirigimos al login
        console.warn('⚠️ Acceso denegado: no hay sesión activa. Redirigiendo a login...');
        window.location.href = paginaLogin;
        return false;
    }
    
    // Hay sesión activa, permitimos el acceso
    console.log('✅ Sesión verificada correctamente');
    return true;
}

/**
 * Función para verificar permisos según el rol
 * Algunos roles tienen más privilegios que otros
 * 
 * JERARQUÍA DE ROLES:
 * - admin: Puede hacer todo (eliminar, confirmar, ver todo)
 * - operador: Puede gestionar reservas (confirmar/cancelar)
 * - cliente: Solo puede ver y crear sus propias reservas
 * 
 * @param {Array} rolesPermitidos - Array con los roles que pueden acceder
 * @returns {boolean} true si el usuario tiene permiso, false si no
 */
function verificarPermiso(rolesPermitidos) {
    const usuario = obtenerUsuarioActivo();
    
    if (!usuario) {
        console.error('❌ No hay usuario activo');
        return false;
    }
    
    // Verificamos si el rol del usuario está en la lista de roles permitidos
    // .includes() verifica si un valor existe en un array
    const tienePermiso = rolesPermitidos.includes(usuario.rol);
    
    if (tienePermiso) {
        console.log(`✅ Permiso concedido para rol: ${usuario.rol}`);
    } else {
        console.warn(`⚠️ Permiso denegado para rol: ${usuario.rol}`);
    }
    
    return tienePermiso;
}

/**
 * Función para redireccionar según el rol del usuario
 * Esta función es útil después del login para enviar a cada usuario
 * a su página correspondiente
 * 
 * RUTAS POR ROL:
 * - admin/operador: pages/dashboard.html (gestión de todas las reservas)
 * - cliente: pages/cliente.html (sus propias reservas)
 * 
 * @param {Object} usuario - Objeto con los datos del usuario
 */
function redirigirSegunRol(usuario) {
    if (!usuario || !usuario.rol) {
        console.error('❌ No se puede redireccionar: usuario inválido');
        return;
    }
    
    // Definimos las rutas según el rol
    const rutas = {
        'admin': 'pages/dashboard.html',
        'operador': 'pages/dashboard.html',
        'cliente': 'pages/cliente.html'
    };
    
    const destino = rutas[usuario.rol];
    
    if (destino) {
        console.log(`🔄 Redirigiendo a: ${destino}`);
        window.location.href = destino;
    } else {
        console.error(`❌ No existe ruta para el rol: ${usuario.rol}`);
    }
}

/**
 * Función para cerrar sesión (logout)
 * Elimina todos los datos de sessionStorage y redirige al login
 * 
 * @param {string} paginaLogin - URL de la página de login
 */
function cerrarSesion(paginaLogin = '../login.html') {
    // Obtenemos el usuario antes de cerrar para el mensaje
    const usuario = obtenerUsuarioActivo();
    
    if (usuario) {
        console.log(`👋 Cerrando sesión de: ${usuario.nombre}`);
    }
    
    // Eliminamos la sesión del sessionStorage
    // Esto borra todos los datos del usuario logueado
    sessionStorage.removeItem('usuarioActivo');
    
    // También podríamos usar sessionStorage.clear() para borrar todo
    // pero removeItem es más específico
    
    console.log('✅ Sesión cerrada correctamente');
    
    // Redirigimos al login
    window.location.href = paginaLogin;
}

/**
 * Función para proteger páginas según roles específicos
 * Combina verificarSesion() y verificarPermiso() en una sola función
 * 
 * Ejemplo de uso:
 * protegerPagina(['admin', 'operador']); // Solo admin y operador pueden entrar
 * protegerPagina(['cliente']); // Solo clientes pueden entrar
 * 
 * @param {Array} rolesPermitidos - Array de roles que pueden acceder
 * @param {string} paginaLogin - URL del login si no hay sesión
 */
function protegerPagina(rolesPermitidos, paginaLogin = '../login.html') {
    // Primero verificamos que haya sesión activa
    if (!verificarSesion(paginaLogin)) {
        return; // Si no hay sesión, verificarSesion ya redirige
    }
    
    // Si hay sesión, verificamos el permiso según rol
    if (!verificarPermiso(rolesPermitidos)) {
        // Si no tiene permiso, redirigimos según su rol
        const usuario = obtenerUsuarioActivo();
        alert('No tienes permiso para acceder a esta página');
        redirigirSegunRol(usuario);
    }
}

console.log('🔐 Sistema de autenticación cargado correctamente');
