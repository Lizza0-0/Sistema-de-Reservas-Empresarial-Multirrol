/**
 * ========================================
 * MOTOR CRUD - GESTIÓN DE RESERVAS
 * ========================================
 * 
 * CRUD significa: Create, Read, Update, Delete
 * Son las 4 operaciones básicas que se pueden hacer con datos
 * 
 * Este módulo contiene todas las funciones para manipular las reservas:
 * - CREATE: Crear nuevas reservas
 * - READ: Leer/obtener reservas existentes
 * - UPDATE: Actualizar el estado de reservas
 * - DELETE: Eliminar reservas
 * 
 * IMPORTANTE: Cada vez que modificamos datos, debemos guardarlos
 * de nuevo en localStorage para que los cambios persistan.
 */

/**
 * ========================================
 * CREATE - CREAR NUEVA RESERVA
 * ========================================
 */

/**
 * Función para crear una nueva reserva
 * Esta función agrega una reserva al sistema y la guarda en localStorage
 * 
 * @param {number} clienteId - ID del usuario que hace la reserva
 * @param {string} fecha - Fecha de la reserva (formato: YYYY-MM-DD)
 * @param {string} hora - Hora de la reserva (formato: HH:MM)
 * @returns {Object} Objeto con el resultado de la operación
 */
function crearReserva(clienteId, fecha, hora) {
    /**
     * PASO 1: Obtenemos todas las reservas actuales
     * Necesitamos el array completo para agregar la nueva reserva
     * JSON.parse convierte el texto JSON a objetos JavaScript
     */
    const reservas = obtenerReservas();
    
    /**
     * PASO 2: Generamos un ID único para la nueva reserva
     * Buscamos el ID más alto y le sumamos 1
     */
    const nuevoId = generarNuevoId(reservas);
    
    /**
     * PASO 3: Creamos el objeto de la nueva reserva
     * Todas las reservas nuevas comienzan con estado 'pendiente'
     * porque deben ser confirmadas por un operador
     */
    const nuevaReserva = {
        id: nuevoId,
        clienteId: clienteId,
        fecha: fecha,
        hora: hora,
        estado: 'pendiente' // Estado inicial
    };
    
    /**
     * PASO 4: Agregamos la nueva reserva al array
     * .push() añade un elemento al final del array
     */
    reservas.push(nuevaReserva);
    
    /**
     * PASO 5: Guardamos el array actualizado en localStorage
     * ¡CRÍTICO! Si no hacemos esto, los cambios se pierden
     * JSON.stringify convierte el array de objetos a texto JSON
     */
    guardarReservas(reservas);
    
    console.log(`✅ Reserva creada exitosamente - ID: ${nuevoId}`);
    console.log('Detalles:', nuevaReserva);
    
    // Retornamos un objeto con el resultado
    return {
        exito: true,
        mensaje: 'Reserva creada exitosamente',
        reserva: nuevaReserva
    };
}

/**
 * ========================================
 * READ - LEER/OBTENER RESERVAS
 * ========================================
 */

/**
 * Función para obtener todas las reservas
 * Esta es la función READ básica
 * 
 * @returns {Array} Array con todas las reservas del sistema
 */
function leerTodasLasReservas() {
    /**
     * Obtenemos las reservas de localStorage
     * JSON.parse convierte el texto JSON de vuelta a objetos JavaScript
     * que podemos usar en nuestro código
     */
    const reservas = obtenerReservas();
    
    console.log(`📋 Total de reservas en el sistema: ${reservas.length}`);
    
    return reservas;
}

/**
 * Función para obtener las reservas de un cliente específico
 * Útil para que cada cliente vea solo sus propias reservas
 * 
 * @param {number} clienteId - ID del cliente
 * @returns {Array} Array con las reservas del cliente
 */
function leerReservasPorCliente(clienteId) {
    // Obtenemos todas las reservas
    const todasLasReservas = obtenerReservas();
    
    /**
     * Filtramos solo las reservas del cliente especificado
     * .filter() crea un nuevo array con los elementos que cumplen la condición
     * En este caso, solo las reservas donde clienteId coincide
     */
    const reservasCliente = todasLasReservas.filter(reserva => 
        reserva.clienteId === clienteId
    );
    
    console.log(`📋 Reservas del cliente ${clienteId}: ${reservasCliente.length}`);
    
    return reservasCliente;
}

/**
 * Función para obtener una reserva específica por su ID
 * Útil cuando necesitamos los detalles de una sola reserva
 * 
 * @param {number} reservaId - ID de la reserva a buscar
 * @returns {Object|null} Objeto reserva o null si no existe
 */
function leerReservaPorId(reservaId) {
    const reservas = obtenerReservas();
    
    /**
     * .find() busca el primer elemento que cumple la condición
     * Si no encuentra ninguno, retorna undefined
     */
    const reserva = reservas.find(r => r.id === reservaId);
    
    if (reserva) {
        console.log(`✅ Reserva encontrada - ID: ${reservaId}`);
        return reserva;
    } else {
        console.log(`❌ Reserva no encontrada - ID: ${reservaId}`);
        return null;
    }
}

/**
 * ========================================
 * UPDATE - ACTUALIZAR ESTADO DE RESERVA
 * ========================================
 */

/**
 * Función para actualizar el estado de una reserva
 * Los estados posibles son: 'pendiente', 'confirmada', 'cancelada'
 * 
 * ¿Por qué actualizamos solo el estado y no otros datos?
 * En un sistema de reservas, normalmente no se permite modificar
 * la fecha/hora después de crear la reserva. Solo se puede:
 * - Confirmar (operador aprueba la reserva)
 * - Cancelar (operador o cliente cancela)
 * 
 * @param {number} reservaId - ID de la reserva a actualizar
 * @param {string} nuevoEstado - Nuevo estado ('pendiente', 'confirmada', 'cancelada')
 * @returns {Object} Objeto con el resultado de la operación
 */
function actualizarEstadoReserva(reservaId, nuevoEstado) {
    /**
     * PASO 1: Obtenemos todas las reservas
     * Necesitamos el array completo para poder modificar y guardar
     */
    const reservas = obtenerReservas();
    
    /**
     * PASO 2: Buscamos el índice de la reserva a actualizar
     * .findIndex() retorna la posición (índice) del elemento en el array
     * Si no lo encuentra, retorna -1
     */
    const indice = reservas.findIndex(r => r.id === reservaId);
    
    // Verificamos si encontramos la reserva
    if (indice === -1) {
        console.error(`❌ No se puede actualizar: reserva ${reservaId} no encontrada`);
        return {
            exito: false,
            mensaje: 'Reserva no encontrada'
        };
    }
    
    /**
     * PASO 3: Actualizamos el estado de la reserva
     * Accedemos al elemento usando su índice: reservas[indice]
     * y modificamos solo la propiedad 'estado'
     */
    const estadoAnterior = reservas[indice].estado;
    reservas[indice].estado = nuevoEstado;
    
    /**
     * PASO 4: Guardamos los cambios en localStorage
     * ¡MUY IMPORTANTE! Sin esto, los cambios se pierden
     * El array 'reservas' solo existe en memoria RAM,
     * debemos guardarlo en localStorage para que persista
     */
    guardarReservas(reservas);
    
    console.log(`✅ Estado actualizado - Reserva ${reservaId}: ${estadoAnterior} → ${nuevoEstado}`);
    
    return {
        exito: true,
        mensaje: 'Estado actualizado exitosamente',
        reserva: reservas[indice]
    };
}

/**
 * ========================================
 * DELETE - ELIMINAR RESERVA
 * ========================================
 */

/**
 * Función para eliminar una reserva del sistema
 * Esta operación es permanente e irreversible
 * 
 * Generalmente solo los administradores pueden eliminar reservas.
 * Los operadores y clientes normalmente solo pueden cancelar (cambiar estado).
 * 
 * @param {number} reservaId - ID de la reserva a eliminar
 * @returns {Object} Objeto con el resultado de la operación
 */
function eliminarReserva(reservaId) {
    /**
     * PASO 1: Obtenemos todas las reservas
     */
    const reservas = obtenerReservas();
    
    /**
     * PASO 2: Buscamos el índice de la reserva a eliminar
     */
    const indice = reservas.findIndex(r => r.id === reservaId);
    
    // Verificamos si existe la reserva
    if (indice === -1) {
        console.error(`❌ No se puede eliminar: reserva ${reservaId} no encontrada`);
        return {
            exito: false,
            mensaje: 'Reserva no encontrada'
        };
    }
    
    /**
     * PASO 3: Guardamos los datos de la reserva antes de eliminarla
     * Esto es útil para mostrar un mensaje al usuario con los detalles
     */
    const reservaEliminada = reservas[indice];
    
    /**
     * PASO 4: Eliminamos la reserva del array
     * .splice(indice, cantidad) elimina elementos del array
     * - indice: posición donde empezar a eliminar
     * - cantidad: cuántos elementos eliminar (1 en este caso)
     */
    reservas.splice(indice, 1);
    
    /**
     * PASO 5: Guardamos el array actualizado en localStorage
     * Este paso hace permanente la eliminación
     */
    guardarReservas(reservas);
    
    console.log(`🗑️ Reserva eliminada exitosamente - ID: ${reservaId}`);
    console.log('Detalles de la reserva eliminada:', reservaEliminada);
    
    return {
        exito: true,
        mensaje: 'Reserva eliminada exitosamente',
        reservaEliminada: reservaEliminada
    };
}

/**
 * ========================================
 * FUNCIONES AUXILIARES
 * ========================================
 */

/**
 * Función para contar reservas por estado
 * Útil para mostrar estadísticas en el dashboard
 * 
 * @returns {Object} Objeto con el conteo de cada estado
 */
function contarReservasPorEstado() {
    const reservas = obtenerReservas();
    
    /**
     * Usamos .filter() para contar cada tipo de estado
     * .length nos da la cantidad de elementos en el array filtrado
     */
    const conteos = {
        total: reservas.length,
        pendientes: reservas.filter(r => r.estado === 'pendiente').length,
        confirmadas: reservas.filter(r => r.estado === 'confirmada').length,
        canceladas: reservas.filter(r => r.estado === 'cancelada').length
    };
    
    console.log('📊 Estadísticas de reservas:', conteos);
    
    return conteos;
}

/**
 * Función para obtener el historial completo de un cliente
 * Incluye todas las reservas (pendientes, confirmadas y canceladas)
 * Ordenadas por fecha descendente
 * 
 * @param {number} clienteId - ID del cliente
 * @returns {Array} Array de reservas ordenadas por fecha
 */
function obtenerHistorialCliente(clienteId) {
    const reservas = leerReservasPorCliente(clienteId);
    
    // Ordenar por fecha y hora (más reciente primero)
    reservas.sort((a, b) => {
        const fechaA = new Date(a.fecha + ' ' + a.hora);
        const fechaB = new Date(b.fecha + ' ' + b.hora);
        return fechaB - fechaA;
    });
    
    console.log(`📜 Historial del cliente ${clienteId}: ${reservas.length} reservas`);
    
    return reservas;
}

console.log('⚙️ Motor CRUD de reservas cargado correctamente');
