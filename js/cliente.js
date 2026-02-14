/**
 * ========================================
 * INTERFAZ DE CLIENTE - CREAR Y VER RESERVAS
 * ========================================
 * 
 * Este script maneja toda la lógica de la página del cliente:
 * - Validación de fecha (que no sea pasada)
 * - Creación de nuevas reservas
 * - Visualización solo de las reservas del cliente logueado
 * - Actualización automática de la tabla
 */

// Variables globales
let usuarioActivo = null;

/**
 * Función que se ejecuta al cargar la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Página de cliente cargada');
    
    /**
     * PASO 1: PROTECCIÓN DE LA PÁGINA
     * Verificamos que haya un usuario logueado y que sea un cliente
     * Si no hay sesión o no es cliente, lo redirige automáticamente
     */
    protegerPagina(['cliente']);
    
    /**
     * PASO 2: OBTENER DATOS DEL USUARIO ACTIVO
     * Una vez verificado que hay sesión, obtenemos los datos del usuario
     */
    usuarioActivo = obtenerUsuarioActivo();
    
    // Mostramos el nombre del usuario en la navbar
    document.getElementById('nombreUsuario').textContent = usuarioActivo.nombre;
    
    console.log(`👤 Bienvenido ${usuarioActivo.nombre} (ID: ${usuarioActivo.id})`);
    
    /**
     * PASO 3: CONFIGURAR VALIDACIÓN DE FECHA
     * Establecemos la fecha mínima del input como hoy
     * para que no se puedan seleccionar fechas pasadas
     */
    configurarValidacionFecha();
    
    /**
     * PASO 4: CARGAR RESERVAS DEL CLIENTE
     * Mostramos las reservas existentes del usuario
     */
    cargarReservasCliente();
    
    /**
     * PASO 5: CARGAR HISTORIAL COMPLETO
     */
    cargarHistorialCliente();
    
    /**
     * PASO 6: CONFIGURAR FORMULARIO
     * Agregamos el evento para crear nuevas reservas
     */
    configurarFormularioReserva();
});

/**
 * Configura la validación de fechas del formulario
 * Establece la fecha mínima como hoy para evitar reservas en el pasado
 */
function configurarValidacionFecha() {
    const inputFecha = document.getElementById('fecha');
    
    /**
     * Obtenemos la fecha actual en formato YYYY-MM-DD
     * Este es el formato que usa el input type="date"
     */
    const hoy = new Date();
    const fechaMinima = hoy.toISOString().split('T')[0];
    
    /**
     * Establecemos el atributo 'min' del input
     * Esto hace que el navegador NO permita seleccionar fechas anteriores
     */
    inputFecha.setAttribute('min', fechaMinima);
    
    /**
     * También establecemos la fecha de hoy como valor por defecto
     * para mejor experiencia de usuario
     */
    inputFecha.value = fechaMinima;
    
    console.log(`📅 Validación de fecha configurada. Fecha mínima: ${fechaMinima}`);
}

/**
 * Configura el formulario de nueva reserva
 * Maneja el evento submit para crear reservas
 */
function configurarFormularioReserva() {
    const form = document.getElementById('formNuevaReserva');
    
    form.addEventListener('submit', function(event) {
        // Prevenimos el comportamiento por defecto del formulario
        event.preventDefault();
        
        // Obtenemos los valores del formulario
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        
        console.log(`📝 Intentando crear reserva: ${fecha} ${hora}`);
        
        /**
         * VALIDACIÓN ADICIONAL DE FECHA
         * Aunque el input tiene min="fecha-actual", validamos por JavaScript
         * por si el usuario manipula el HTML desde las herramientas de desarrollo
         */
        if (!validarFechaFutura(fecha)) {
            alert('❌ Error: No puedes hacer reservas en fechas pasadas.');
            return;
        }
        
        /**
         * VALIDACIÓN DE HORA
         * Verificamos que la hora esté dentro del horario permitido (08:00 - 20:00)
         */
        if (!validarHorario(hora)) {
            alert('❌ Error: El horario debe estar entre 08:00 y 20:00.');
            return;
        }
        
        /**
         * CREAR LA RESERVA
         * Usamos el clienteId del usuario activo
         */
        const resultado = crearReserva(usuarioActivo.id, fecha, hora);
        
        if (resultado.exito) {
            // Reserva creada exitosamente
            alert(`✅ ${resultado.mensaje}\n\nTu reserva ha sido registrada para el ${fecha} a las ${hora}.\nEstado: ${resultado.reserva.estado}`);
            
            // Limpiamos el formulario
            form.reset();
            
            // Restauramos la fecha mínima después de limpiar
            configurarValidacionFecha();
            
            // Recargamos la tabla de reservas
            cargarReservasCliente();
            
            // Recargamos el historial
            cargarHistorialCliente();
        } else {
            alert(`❌ Error al crear la reserva: ${resultado.mensaje}`);
        }
    });
}

/**
 * Valida que la fecha seleccionada sea futura (no pasada)
 * 
 * @param {string} fechaString - Fecha en formato YYYY-MM-DD
 * @returns {boolean} true si es futura, false si es pasada
 */
function validarFechaFutura(fechaString) {
    /**
     * Convertimos ambas fechas a objetos Date para compararlas
     * Solo comparamos año, mes y día (ignoramos hora)
     */
    const fechaSeleccionada = new Date(fechaString + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ponemos la hora en 00:00 para comparar solo fechas
    
    /**
     * Comparamos las fechas
     * fechaSeleccionada >= hoy significa que es hoy o futura
     */
    const esFutura = fechaSeleccionada >= hoy;
    
    if (!esFutura) {
        console.warn(`⚠️ Fecha inválida: ${fechaString} es una fecha pasada`);
    }
    
    return esFutura;
}

/**
 * Valida que la hora esté dentro del rango permitido (08:00 - 20:00)
 * 
 * @param {string} horaString - Hora en formato HH:MM
 * @returns {boolean} true si es válida, false si no
 */
function validarHorario(horaString) {
    /**
     * Extraemos solo la hora (sin minutos) para validar
     * horaString viene en formato "HH:MM"
     */
    const hora = parseInt(horaString.split(':')[0]);
    
    /**
     * Validamos que esté entre 08:00 y 20:00
     */
    const esValida = hora >= 8 && hora <= 20;
    
    if (!esValida) {
        console.warn(`⚠️ Hora inválida: ${horaString} está fuera del horario (08:00 - 20:00)`);
    }
    
    return esValida;
}

/**
 * Carga y muestra las reservas del cliente en la tabla
 * 
 * ¿Por qué filtramos las reservas?
 * Cada cliente solo debe ver sus propias reservas, no las de otros clientes.
 * Esto es importante por:
 * 1. PRIVACIDAD: Los clientes no deben ver datos de otros
 * 2. SEGURIDAD: Evita que un cliente modifique reservas ajenas
 * 3. USABILIDAD: Una tabla más limpia y relevante
 */
function cargarReservasCliente() {
    console.log(`📋 Cargando reservas del cliente ${usuarioActivo.id}...`);
    
    /**
     * PASO 1: Obtenemos solo las reservas de este cliente
     * La función leerReservasPorCliente filtra automáticamente
     * por el clienteId que le pasemos
     */
    const reservasCliente = leerReservasPorCliente(usuarioActivo.id);
    
    /**
     * PASO 2: Ordenamos las reservas por fecha (más recientes primero)
     * .sort() ordena el array según la función de comparación
     */
    reservasCliente.sort((a, b) => {
        // Convertimos las fechas a timestamps para compararlas
        const fechaA = new Date(a.fecha + ' ' + a.hora);
        const fechaB = new Date(b.fecha + ' ' + b.hora);
        return fechaB - fechaA; // Orden descendente (más reciente primero)
    });
    
    console.log(`✅ Reservas encontradas: ${reservasCliente.length}`);
    
    /**
     * PASO 3: Generamos el HTML de la tabla
     */
    const tbody = document.getElementById('tablaReservas');
    
    if (reservasCliente.length === 0) {
        // No hay reservas
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    <i class="fas fa-calendar-times fa-3x mb-3 d-block"></i>
                    <p class="mb-0">No tienes reservas registradas</p>
                    <small>Crea tu primera reserva usando el formulario de arriba</small>
                </td>
            </tr>
        `;
    } else {
        // Generamos las filas de la tabla
        tbody.innerHTML = reservasCliente.map(reserva => {
            /**
             * Generamos un badge (etiqueta) de color según el estado
             * - pendiente: amarillo (warning)
             * - confirmada: verde (success)
             * - cancelada: rojo (danger)
             */
            const badgeEstado = obtenerBadgeEstado(reserva.estado);
            
            /**
             * Formateamos la fecha para mostrarla en español
             */
            const fechaFormateada = formatearFecha(reserva.fecha);
            
            return `
                <tr>
                    <td class="fw-bold">#${reserva.id}</td>
                    <td>
                        <i class="fas fa-calendar me-2 text-primary"></i>
                        ${fechaFormateada}
                    </td>
                    <td>
                        <i class="fas fa-clock me-2 text-primary"></i>
                        ${reserva.hora}
                    </td>
                    <td>${badgeEstado}</td>
                    <td class="text-center">
                        ${reserva.estado === 'pendiente' ? 
                            `<button class="btn btn-sm btn-danger" onclick="cancelarReserva(${reserva.id})">
                                <i class="fas fa-times me-1"></i>Cancelar
                            </button>` 
                            : 
                            '<span class="text-muted">-</span>'
                        }
                    </td>
                </tr>
            `;
        }).join('');
    }
}

/**
 * Función para cancelar una reserva (cambiar estado a 'cancelada')
 * Solo se puede cancelar si está en estado 'pendiente'
 * 
 * @param {number} reservaId - ID de la reserva a cancelar
 */
function cancelarReserva(reservaId) {
    // Pedimos confirmación al usuario
    const confirmar = confirm('¿Estás seguro de que deseas cancelar esta reserva?');
    
    if (confirmar) {
        console.log(`🗑️ Cancelando reserva ${reservaId}...`);
        
        // Actualizamos el estado a 'cancelada'
        const resultado = actualizarEstadoReserva(reservaId, 'cancelada');
        
        if (resultado.exito) {
            alert('✅ Reserva cancelada exitosamente');
            
            // Recargamos la tabla
            cargarReservasCliente();
            
            // Recargamos el historial
            cargarHistorialCliente();
        } else {
            alert(`❌ Error al cancelar: ${resultado.mensaje}`);
        }
    }
}

/**
 * Genera un badge HTML con el color apropiado según el estado
 * 
 * @param {string} estado - Estado de la reserva
 * @returns {string} HTML del badge
 */
function obtenerBadgeEstado(estado) {
    const badges = {
        'pendiente': '<span class="badge bg-warning text-dark"><i class="fas fa-clock me-1"></i>Pendiente</span>',
        'confirmada': '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Confirmada</span>',
        'cancelada': '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>Cancelada</span>'
    };
    
    return badges[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

/**
 * Formatea una fecha de YYYY-MM-DD a formato legible en español
 * 
 * @param {string} fechaString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada (ej: "20 de Febrero, 2025")
 */
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString + 'T00:00:00');
    
    const opciones = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
}

/**
 * Carga el historial completo del cliente
 * Muestra todas las reservas (incluyendo pasadas y canceladas)
 */
function cargarHistorialCliente() {
    console.log(`📜 Cargando historial completo del cliente ${usuarioActivo.id}...`);
    
    // Obtener historial completo
    const historial = obtenerHistorialCliente(usuarioActivo.id);
    
    const tbody = document.getElementById('tablaHistorial');
    
    if (historial.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    <i class="fas fa-history fa-2x mb-3 d-block"></i>
                    <p class="mb-0">No tienes historial de reservas</p>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = historial.map(reserva => {
            const badgeEstado = obtenerBadgeEstado(reserva.estado);
            const fechaFormateada = formatearFecha(reserva.fecha);
            
            return `
                <tr>
                    <td class="fw-bold">#${reserva.id}</td>
                    <td>
                        <i class="fas fa-calendar me-2 text-primary"></i>
                        ${fechaFormateada}
                    </td>
                    <td>
                        <i class="fas fa-clock me-2 text-primary"></i>
                        ${reserva.hora}
                    </td>
                    <td>${badgeEstado}</td>
                </tr>
            `;
        }).join('');
    }
}

console.log('✅ Script de cliente cargado correctamente');
