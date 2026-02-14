/**
 * ========================================
 * SISTEMA DE RELACIONES - JOIN DE DATOS
 * ========================================
 * 
 * En bases de datos SQL, un JOIN es una operación que combina datos
 * de dos tablas diferentes basándose en una relación entre ellas.
 * 
 * En nuestro caso:
 * - Tabla "Reservas": tiene un clienteId (solo un número)
 * - Tabla "Usuarios": tiene todos los datos del cliente (nombre, correo, etc.)
 * 
 * El JOIN nos permite mostrar el NOMBRE del cliente en lugar de solo su ID.
 * 
 * EJEMPLO:
 * Sin JOIN: "Reserva #1 - Cliente ID: 3"  ❌ No es amigable
 * Con JOIN: "Reserva #1 - Cliente: Juan Pérez"  ✅ Mucho mejor
 * 
 * ¿Por qué es importante esto?
 * 1. USABILIDAD: Es más fácil para los usuarios ver nombres que números
 * 2. COMPRENSIÓN: Los operadores pueden identificar rápidamente a los clientes
 * 3. PROFESIONALISMO: Un sistema que muestra nombres se ve más pulido
 */

/**
 * Función principal que realiza el "JOIN"
 * Combina los datos de reservas con los datos de usuarios
 * 
 * Esta función recorre cada reserva y busca el usuario correspondiente
 * para agregar su información completa al objeto de la reserva.
 * 
 * PROCESO:
 * 1. Obtiene todas las reservas (solo tienen clienteId)
 * 2. Obtiene todos los usuarios (tienen nombre, correo, etc.)
 * 3. Por cada reserva, busca al usuario con ese clienteId
 * 4. Crea un nuevo objeto que combina ambos datos
 * 
 * @returns {Array} Array de objetos con reservas + datos de usuario
 */
function obtenerReservasCompletas() {
    /**
     * PASO 1: Obtenemos ambos arrays desde localStorage
     * - reservas: contiene las reservas con clienteId
     * - usuarios: contiene los datos completos de cada usuario
     */
    const reservas = obtenerReservas();
    const usuarios = obtenerUsuarios();
    
    console.log('🔄 Iniciando proceso de JOIN...');
    console.log(`   Reservas a procesar: ${reservas.length}`);
    console.log(`   Usuarios disponibles: ${usuarios.length}`);
    
    /**
     * PASO 2: Transformamos cada reserva usando .map()
     * 
     * ¿Qué hace .map()?
     * .map() recorre cada elemento del array y lo transforma.
     * Retorna un NUEVO array con los elementos transformados.
     * No modifica el array original.
     * 
     * Es perfecto para nuestro caso porque queremos crear un nuevo array
     * con reservas "enriquecidas" con datos de usuario.
     */
    const reservasCompletas = reservas.map(reserva => {
        /**
         * PASO 2.1: Buscamos al usuario de esta reserva
         * 
         * .find() busca el primer usuario cuyo id coincida con el clienteId
         * de la reserva actual.
         * 
         * Esto es equivalente a un JOIN en SQL:
         * SELECT * FROM reservas 
         * LEFT JOIN usuarios ON reservas.clienteId = usuarios.id
         */
        const usuario = usuarios.find(u => u.id === reserva.clienteId);
        
        /**
         * PASO 2.2: Creamos un nuevo objeto combinado
         * 
         * Usamos el operador spread (...) para copiar todas las propiedades
         * de la reserva original, y luego agregamos las nuevas propiedades
         * con los datos del usuario.
         * 
         * ESTRUCTURA DEL OBJETO RESULTANTE:
         * {
         *   id: 1,                    // De la reserva
         *   clienteId: 3,             // De la reserva
         *   fecha: '2025-02-20',      // De la reserva
         *   hora: '10:00',            // De la reserva
         *   estado: 'pendiente',      // De la reserva
         *   clienteNombre: 'Juan Pérez',      // DEL USUARIO (JOIN)
         *   clienteCorreo: 'juan@cliente.com', // DEL USUARIO (JOIN)
         *   clienteRol: 'cliente'             // DEL USUARIO (JOIN)
         * }
         */
        return {
            ...reserva, // Copiamos todas las propiedades de la reserva original
            
            // Agregamos los datos del usuario (si existe)
            // Si no existe el usuario, ponemos valores por defecto
            clienteNombre: usuario ? usuario.nombre : 'Usuario no encontrado',
            clienteCorreo: usuario ? usuario.correo : 'N/A',
            clienteRol: usuario ? usuario.rol : 'N/A'
        };
    });
    
    console.log(`✅ JOIN completado: ${reservasCompletas.length} reservas enriquecidas con datos de usuario`);
    
    /**
     * RESULTADO:
     * Ahora tenemos un array donde cada reserva incluye:
     * - Todos sus datos originales (id, fecha, hora, estado, clienteId)
     * - Datos adicionales del usuario (nombre, correo, rol)
     * 
     * Esto nos permite mostrar en la tabla:
     * "Reserva de Juan Pérez para el 2025-02-20 a las 10:00"
     * en lugar de:
     * "Reserva del cliente 3 para el 2025-02-20 a las 10:00"
     */
    return reservasCompletas;
}

/**
 * Función para obtener reservas completas de un cliente específico
 * Similar a obtenerReservasCompletas pero filtra por un cliente
 * 
 * @param {number} clienteId - ID del cliente
 * @returns {Array} Array de reservas completas del cliente
 */
function obtenerReservasCompletasPorCliente(clienteId) {
    // Primero obtenemos todas las reservas completas
    const todasCompletas = obtenerReservasCompletas();
    
    // Luego filtramos solo las del cliente específico
    const reservasCliente = todasCompletas.filter(r => r.clienteId === clienteId);
    
    console.log(`📋 Reservas completas del cliente ${clienteId}: ${reservasCliente.length}`);
    
    return reservasCliente;
}

/**
 * ========================================
 * VENTAJAS DE USAR ESTE ENFOQUE DE "JOIN"
 * ========================================
 * 
 * 1. SEPARACIÓN DE DATOS:
 *    - Los usuarios están en una "tabla" (array)
 *    - Las reservas están en otra "tabla" (array)
 *    - Esto evita duplicación de datos
 *    - Si cambias el nombre de un usuario, se actualiza automáticamente
 *      en todas sus reservas (porque buscamos el dato fresco cada vez)
 * 
 * 2. EFICIENCIA EN ALMACENAMIENTO:
 *    - Sin JOIN: Cada reserva guardaría nombre, correo, etc. (mucho espacio)
 *    - Con JOIN: Cada reserva solo guarda el clienteId (un número)
 *    - El JOIN se hace "en tiempo real" cuando lo necesitamos
 * 
 * 3. ESCALABILIDAD:
 *    - Si agregas más datos al usuario (teléfono, dirección, etc.),
 *      no necesitas modificar las reservas existentes
 *    - Solo agregas el campo al objeto usuario y listo
 * 
 * 4. EXPERIENCIA DE USUARIO:
 *    - El usuario final ve información clara y legible
 *    - Los operadores pueden identificar rápidamente a los clientes
 *    - Mejora significativamente la usabilidad del sistema
 * 
 * ========================================
 * COMPARACIÓN CON BASE DE DATOS SQL
 * ========================================
 * 
 * Lo que hacemos en JavaScript:
 * ```javascript
 * const usuario = usuarios.find(u => u.id === reserva.clienteId);
 * ```
 * 
 * Es equivalente a esto en SQL:
 * ```sql
 * SELECT reservas.*, usuarios.nombre, usuarios.correo, usuarios.rol
 * FROM reservas
 * LEFT JOIN usuarios ON reservas.clienteId = usuarios.id
 * ```
 * 
 * Aunque usamos localStorage en lugar de una base de datos,
 * los conceptos y la lógica son exactamente los mismos.
 * Esto te prepara para trabajar con bases de datos reales en el futuro.
 */

/**
 * Función auxiliar para obtener el nombre de un cliente por su ID
 * Útil para mostrar el nombre en diferentes partes del sistema
 * 
 * @param {number} clienteId - ID del cliente
 * @returns {string} Nombre del cliente o mensaje si no existe
 */
function obtenerNombreCliente(clienteId) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === clienteId);
    
    return usuario ? usuario.nombre : 'Usuario no encontrado';
}

/**
 * Función para verificar si un usuario existe
 * Útil para validar antes de crear reservas
 * 
 * @param {number} clienteId - ID del cliente a verificar
 * @returns {boolean} true si existe, false si no
 */
function verificarUsuarioExiste(clienteId) {
    const usuarios = obtenerUsuarios();
    const existe = usuarios.some(u => u.id === clienteId);
    
    if (existe) {
        console.log(`✅ Usuario ${clienteId} existe en el sistema`);
    } else {
        console.warn(`⚠️ Usuario ${clienteId} NO existe en el sistema`);
    }
    
    return existe;
}

console.log('🔗 Sistema de relaciones (JOIN) cargado correctamente');
