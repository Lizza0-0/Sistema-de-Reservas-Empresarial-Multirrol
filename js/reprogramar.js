/**
 * ========================================
 * REPROGRAMACIÓN DE RESERVAS - OPERADOR
 * ========================================
 * 
 * Permite al operador cambiar la fecha y hora de una reserva
 */

/**
 * Función para reprogramar una reserva
 * Cambia la fecha y/o hora de una reserva existente
 * 
 * @param {number} reservaId - ID de la reserva a reprogramar
 * @param {string} nuevaFecha - Nueva fecha en formato YYYY-MM-DD (opcional)
 * @param {string} nuevaHora - Nueva hora en formato HH:MM (opcional)
 * @returns {Object} Resultado de la operación
 */
function reprogramarReserva(reservaId, nuevaFecha, nuevaHora) {
    console.log(`🔄 Reprogramando reserva ${reservaId}...`);
    
    // Obtener todas las reservas
    const reservas = obtenerReservas();
    const indice = reservas.findIndex(r => r.id === reservaId);
    
    if (indice === -1) {
        return {
            exito: false,
            mensaje: 'Reserva no encontrada'
        };
    }
    
    // Guardar valores anteriores para el mensaje
    const fechaAnterior = reservas[indice].fecha;
    const horaAnterior = reservas[indice].hora;
    
    // Validar nueva fecha si se proporciona
    if (nuevaFecha) {
        const fechaValida = validarFechaFutura(nuevaFecha);
        if (!fechaValida) {
            return {
                exito: false,
                mensaje: 'La nueva fecha no puede ser una fecha pasada'
            };
        }
        reservas[indice].fecha = nuevaFecha;
    }
    
    // Validar nueva hora si se proporciona
    if (nuevaHora) {
        const horaValida = validarHorario(nuevaHora);
        if (!horaValida) {
            return {
                exito: false,
                mensaje: 'La hora debe estar entre 08:00 y 20:00'
            };
        }
        reservas[indice].hora = nuevaHora;
    }
    
    // Si la reserva estaba cancelada, cambiarla a pendiente
    if (reservas[indice].estado === 'cancelada') {
        reservas[indice].estado = 'pendiente';
    }
    
    // Guardar cambios
    guardarReservas(reservas);
    
    console.log(`✅ Reserva reprogramada: ${fechaAnterior} ${horaAnterior} → ${reservas[indice].fecha} ${reservas[indice].hora}`);
    
    return {
        exito: true,
        mensaje: 'Reserva reprogramada exitosamente',
        reserva: reservas[indice],
        fechaAnterior: fechaAnterior,
        horaAnterior: horaAnterior
    };
}

/**
 * Función auxiliar para validar fecha futura
 * (Ya existe en cliente.js, la duplicamos aquí por modularidad)
 */
function validarFechaFutura(fechaString) {
    const fechaSeleccionada = new Date(fechaString + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada >= hoy;
}

/**
 * Función auxiliar para validar horario
 * (Ya existe en cliente.js, la duplicamos aquí por modularidad)
 */
function validarHorario(horaString) {
    const hora = parseInt(horaString.split(':')[0]);
    return hora >= 8 && hora <= 20;
}

console.log('📅 Sistema de reprogramación cargado');
