/**
 * ========================================
 * DASHBOARD - INTERFAZ DE ADMIN Y OPERADOR
 * ========================================
 * 
 * Este script maneja la interfaz de gestión para administradores y operadores:
 * - Visualización de todas las reservas del sistema (con JOIN)
 * - Botones específicos según el rol
 * - Filtro de reservas por fecha (hoy)
 * - Estadísticas del sistema
 * - Protección de acciones según rol
 */

// Variables globales
let usuarioActivo = null;
let reservasActuales = []; // Almacena las reservas que se están mostrando

/**
 * Función que se ejecuta al cargar la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Página de dashboard cargada');
    
    /**
     * PASO 1: PROTECCIÓN DE LA PÁGINA
     * Solo admin y operador pueden acceder a esta página
     * Si es cliente, lo redirige a su página
     */
    protegerPagina(['admin', 'operador']);
    
    /**
     * PASO 2: OBTENER DATOS DEL USUARIO ACTIVO
     */
    usuarioActivo = obtenerUsuarioActivo();
    
    // Mostramos el nombre y rol del usuario en la navbar
    document.getElementById('nombreUsuario').textContent = usuarioActivo.nombre;
    document.getElementById('rolUsuario').textContent = usuarioActivo.rol.toUpperCase();
    
    // Mostrar botón de gestión de usuarios solo para admin
    if (usuarioActivo.rol === 'admin') {
        document.getElementById('btnGestionUsuarios').style.display = 'inline-block';
    }
    
    console.log(`👤 Bienvenido ${usuarioActivo.nombre} (${usuarioActivo.rol})`);
    
    /**
     * PASO 3: CARGAR ESTADÍSTICAS
     */
    cargarEstadisticas();
    
    /**
     * PASO 4: CARGAR TODAS LAS RESERVAS
     */
    mostrarTodasLasReservas();
});

/**
 * Carga y muestra las estadísticas del sistema
 * Muestra el total de reservas y el desglose por estado
 */
function cargarEstadisticas() {
    console.log('📈 Cargando estadísticas del sistema...');
    
    /**
     * Obtenemos los conteos de reservas por estado
     * Esta función está en crud.js
     */
    const stats = contarReservasPorEstado();
    
    /**
     * Generamos tarjetas con las estadísticas
     */
    const estadisticasHTML = `
        <!-- Total de Reservas -->
        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm bg-primary text-white h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-white-50 mb-1">Total Reservas</h6>
                            <h2 class="mb-0 fw-bold">${stats.total}</h2>
                        </div>
                        <div class="stat-icon">
                            <i class="fas fa-calendar-alt fa-3x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reservas Pendientes -->
        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm bg-warning text-dark h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-dark-50 mb-1">Pendientes</h6>
                            <h2 class="mb-0 fw-bold">${stats.pendientes}</h2>
                        </div>
                        <div class="stat-icon">
                            <i class="fas fa-clock fa-3x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reservas Confirmadas -->
        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm bg-success text-white h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-white-50 mb-1">Confirmadas</h6>
                            <h2 class="mb-0 fw-bold">${stats.confirmadas}</h2>
                        </div>
                        <div class="stat-icon">
                            <i class="fas fa-check-circle fa-3x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reservas Canceladas -->
        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm bg-danger text-white h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-white-50 mb-1">Canceladas</h6>
                            <h2 class="mb-0 fw-bold">${stats.canceladas}</h2>
                        </div>
                        <div class="stat-icon">
                            <i class="fas fa-times-circle fa-3x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('estadisticas').innerHTML = estadisticasHTML;
    
    console.log('✅ Estadísticas cargadas:', stats);
}

/**
 * Muestra todas las reservas del sistema en la tabla
 * Usa la función JOIN para mostrar los datos completos
 */
function mostrarTodasLasReservas() {
    console.log('📋 Cargando todas las reservas...');
    
    /**
     * ★★★ AQUÍ USAMOS EL JOIN ★★★
     * 
     * obtenerReservasCompletas() combina los datos de:
     * - Array de reservas (id, clienteId, fecha, hora, estado)
     * - Array de usuarios (id, nombre, correo, rol)
     * 
     * El resultado es un array donde cada reserva incluye:
     * clienteNombre, clienteCorreo, clienteRol
     * 
     * Esto nos permite mostrar "Juan Pérez" en lugar de solo "ID: 3"
     */
    const reservasCompletas = obtenerReservasCompletas();
    
    // Ordenamos por fecha (más recientes primero)
    reservasCompletas.sort((a, b) => {
        const fechaA = new Date(a.fecha + ' ' + a.hora);
        const fechaB = new Date(b.fecha + ' ' + b.hora);
        return fechaB - fechaA;
    });
    
    // Guardamos las reservas actuales para referencia
    reservasActuales = reservasCompletas;
    
    // Actualizamos el título y contador
    document.getElementById('tituloTabla').textContent = 'Todas las Reservas';
    document.getElementById('contadorReservas').textContent = 
        `Mostrando ${reservasCompletas.length} reservas`;
    
    // Renderizamos la tabla
    renderizarTablaReservas(reservasCompletas);
    
    console.log(`✅ ${reservasCompletas.length} reservas cargadas`);
}

/**
 * PROMPT 7: FILTRO DE AGENDA DIARIA
 * 
 * Filtra y muestra solo las reservas de hoy
 * Esta función es útil para operadores que necesitan ver
 * qué reservas tienen que gestionar en el día actual
 * 
 * ¿Cómo funciona la comparación de fechas?
 * 1. Obtenemos la fecha de hoy en formato YYYY-MM-DD
 * 2. Comparamos con el campo 'fecha' de cada reserva
 * 3. Solo mostramos las que coinciden exactamente
 */
function filtrarReservasHoy() {
    console.log('📅 Filtrando reservas de hoy...');
    
    /**
     * PASO 1: Obtener la fecha de hoy en formato YYYY-MM-DD
     * Este formato es el mismo que usamos en las reservas
     * para que la comparación sea exacta
     */
    const hoy = new Date();
    
    /**
     * Formateamos la fecha manualmente para asegurar el formato correcto
     * getFullYear() → Año completo (ej: 2025)
     * getMonth() + 1 → Mes (0-11, por eso sumamos 1)
     * getDate() → Día del mes
     * 
     * padStart(2, '0') → Agrega un 0 si el número es de un solo dígito
     * Ejemplo: 5 → "05", 12 → "12"
     */
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    
    const fechaHoy = `${año}-${mes}-${dia}`;
    
    console.log(`📆 Fecha de hoy: ${fechaHoy}`);
    
    /**
     * PASO 2: Obtener todas las reservas completas (con JOIN)
     */
    const todasLasReservas = obtenerReservasCompletas();
    
    /**
     * PASO 3: Filtrar solo las reservas de hoy
     * Comparamos el campo 'fecha' de cada reserva con fechaHoy
     * 
     * IMPORTANTE: Usamos === para comparación exacta
     * "2025-02-14" === "2025-02-14" → true
     * "2025-02-15" === "2025-02-14" → false
     */
    const reservasHoy = todasLasReservas.filter(reserva => 
        reserva.fecha === fechaHoy
    );
    
    console.log(`✅ Reservas encontradas para hoy: ${reservasHoy.length}`);
    
    /**
     * PASO 4: Ordenar por hora (más temprano primero)
     * Útil para ver las reservas en orden cronológico
     */
    reservasHoy.sort((a, b) => {
        // Comparamos las horas como strings (funcionan bien en formato HH:MM)
        return a.hora.localeCompare(b.hora);
    });
    
    // Guardamos las reservas actuales
    reservasActuales = reservasHoy;
    
    // Actualizamos el título y contador
    document.getElementById('tituloTabla').textContent = 
        `Reservas de Hoy (${formatearFechaLegible(fechaHoy)})`;
    document.getElementById('contadorReservas').textContent = 
        `Mostrando ${reservasHoy.length} reservas`;
    
    // Renderizamos la tabla
    renderizarTablaReservas(reservasHoy);
    
    /**
     * Mostramos un mensaje si no hay reservas hoy
     */
    if (reservasHoy.length === 0) {
        alert('ℹ️ No hay reservas programadas para hoy.');
    }
}

/**
 * Renderiza la tabla de reservas con los datos proporcionados
 * 
 * ¿Cómo identificamos qué reserva modificar?
 * Cada botón tiene un atributo onclick con el ID de la reserva.
 * Por ejemplo: onclick="confirmarReserva(5)"
 * 
 * Cuando el usuario hace clic, el navegador ejecuta esa función
 * pasándole el ID como parámetro, y así sabemos exactamente
 * qué reserva debe modificarse.
 * 
 * @param {Array} reservas - Array de objetos reserva con datos JOIN
 */
function renderizarTablaReservas(reservas) {
    const tbody = document.getElementById('tablaReservas');
    
    if (reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5 text-muted">
                    <i class="fas fa-inbox fa-4x mb-3 d-block"></i>
                    <h5>No hay reservas para mostrar</h5>
                    <p class="mb-0">Las reservas aparecerán aquí cuando se creen</p>
                </td>
            </tr>
        `;
        return;
    }
    
    /**
     * Generamos el HTML de cada fila
     * Aquí vemos el beneficio del JOIN: podemos mostrar clienteNombre y clienteCorreo
     * directamente desde el objeto reserva
     */
    tbody.innerHTML = reservas.map(reserva => {
        const badgeEstado = obtenerBadgeEstado(reserva.estado);
        const fechaFormateada = formatearFechaLegible(reserva.fecha);
        
        /**
         * BOTONES SEGÚN ROL
         * 
         * ADMIN puede:
         * - Eliminar cualquier reserva (botón rojo)
         * 
         * OPERADOR puede:
         * - Confirmar reservas pendientes (botón verde)
         * - Cancelar reservas pendientes o confirmadas (botón amarillo)
         * 
         * La lógica de permisos está implementada en las funciones
         * correspondientes, pero aquí mostramos/ocultamos botones
         * para mejor UX
         */
        let botonesAccion = '';
        
        if (usuarioActivo.rol === 'admin') {
            // Admin: cambiar estados y eliminar
            if (reserva.estado === 'pendiente') {
                botonesAccion = `
                    <button class="btn btn-sm btn-success me-1" onclick="confirmarReserva(${reserva.id})">
                        <i class="fas fa-check me-1"></i>Confirmar
                    </button>
                    <button class="btn btn-sm btn-warning me-1" onclick="cancelarReservaOp(${reserva.id})">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarReservaConfirmacion(${reserva.id})">
                        <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                `;
            } else if (reserva.estado === 'confirmada') {
                botonesAccion = `
                    <button class="btn btn-sm btn-warning me-1" onclick="cancelarReservaOp(${reserva.id})">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarReservaConfirmacion(${reserva.id})">
                        <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                `;
            } else if (reserva.estado === 'cancelada') {
                botonesAccion = `
                    <button class="btn btn-sm btn-success me-1" onclick="confirmarReserva(${reserva.id})">
                        <i class="fas fa-check me-1"></i>Confirmar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarReservaConfirmacion(${reserva.id})">
                        <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                `;
            }
        } else if (usuarioActivo.rol === 'operador') {
            // Operador: botones según el estado
            if (reserva.estado === 'pendiente') {
                botonesAccion = `
                    <button class="btn btn-sm btn-success me-1" onclick="confirmarReserva(${reserva.id})">
                        <i class="fas fa-check me-1"></i>Confirmar
                    </button>
                    <button class="btn btn-sm btn-warning me-1" onclick="cancelarReservaOp(${reserva.id})">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>
                    <button class="btn btn-sm btn-info" onclick="abrirModalReprogramar(${reserva.id}, '${reserva.fecha}', '${reserva.hora}')">
                        <i class="fas fa-calendar-alt me-1"></i>Reprogramar
                    </button>
                `;
            } else if (reserva.estado === 'confirmada') {
                botonesAccion = `
                    <button class="btn btn-sm btn-warning me-1" onclick="cancelarReservaOp(${reserva.id})">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>
                    <button class="btn btn-sm btn-info" onclick="abrirModalReprogramar(${reserva.id}, '${reserva.fecha}', '${reserva.hora}')">
                        <i class="fas fa-calendar-alt me-1"></i>Reprogramar
                    </button>
                `;
            } else {
                // Estado cancelada: sin acciones
                botonesAccion = '<span class="text-muted">Sin acciones</span>';
            }
        }
        
        return `
            <tr>
                <td class="fw-bold">#${reserva.id}</td>
                <td>
                    <i class="fas fa-user me-2 text-primary"></i>
                    ${reserva.clienteNombre}
                </td>
                <td>
                    <small class="text-muted">
                        <i class="fas fa-envelope me-1"></i>
                        ${reserva.clienteCorreo}
                    </small>
                </td>
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
                    ${botonesAccion}
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * OPERADOR: Confirmar una reserva pendiente
 * Cambia el estado de 'pendiente' a 'confirmada'
 * 
 * @param {number} reservaId - ID de la reserva a confirmar
 */
function confirmarReserva(reservaId) {
    console.log(`✅ Confirmando reserva ${reservaId}...`);
    
    const resultado = actualizarEstadoReserva(reservaId, 'confirmada');
    
    if (resultado.exito) {
        // Mensaje de éxito
        alert('✅ Reserva confirmada exitosamente');
        
        // Recargamos las estadísticas y la tabla
        cargarEstadisticas();
        mostrarTodasLasReservas();
    } else {
        alert(`❌ Error al confirmar: ${resultado.mensaje}`);
    }
}

/**
 * OPERADOR: Cancelar una reserva
 * Cambia el estado a 'cancelada'
 * 
 * @param {number} reservaId - ID de la reserva a cancelar
 */
function cancelarReservaOp(reservaId) {
    const confirmar = confirm('¿Estás seguro de que deseas cancelar esta reserva?');
    
    if (confirmar) {
        console.log(`🚫 Cancelando reserva ${reservaId}...`);
        
        const resultado = actualizarEstadoReserva(reservaId, 'cancelada');
        
        if (resultado.exito) {
            alert('✅ Reserva cancelada exitosamente');
            
            // Recargamos las estadísticas y la tabla
            cargarEstadisticas();
            mostrarTodasLasReservas();
        } else {
            alert(`❌ Error al cancelar: ${resultado.mensaje}`);
        }
    }
}

/**
 * ADMIN: Eliminar una reserva permanentemente
 * Esta acción es irreversible
 * 
 * @param {number} reservaId - ID de la reserva a eliminar
 */
function eliminarReservaConfirmacion(reservaId) {
    const confirmar = confirm(
        '⚠️ ADVERTENCIA\n\n' +
        'Estás a punto de ELIMINAR esta reserva permanentemente.\n' +
        'Esta acción NO se puede deshacer.\n\n' +
        '¿Estás seguro de continuar?'
    );
    
    if (confirmar) {
        console.log(`🗑️ Eliminando reserva ${reservaId}...`);
        
        const resultado = eliminarReserva(reservaId);
        
        if (resultado.exito) {
            alert('✅ Reserva eliminada exitosamente');
            
            // Recargamos las estadísticas y la tabla
            cargarEstadisticas();
            mostrarTodasLasReservas();
        } else {
            alert(`❌ Error al eliminar: ${resultado.mensaje}`);
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
 * @returns {string} Fecha formateada
 */
function formatearFechaLegible(fechaString) {
    const fecha = new Date(fechaString + 'T00:00:00');
    
    const opciones = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
}

/**
 * Abre un modal simple para reprogramar una reserva
 */
function abrirModalReprogramar(reservaId, fechaActual, horaActual) {
    const nuevaFecha = prompt(`Fecha actual: ${fechaActual}\nIngresa la nueva fecha (YYYY-MM-DD):`, fechaActual);
    
    if (nuevaFecha === null) return; // Canceló
    
    const nuevaHora = prompt(`Hora actual: ${horaActual}\nIngresa la nueva hora (HH:MM):`, horaActual);
    
    if (nuevaHora === null) return; // Canceló
    
    // Llamar a la función de reprogramar
    const resultado = reprogramarReserva(reservaId, nuevaFecha, nuevaHora);
    
    if (resultado.exito) {
        alert(`✅ ${resultado.mensaje}\n\nAnterior: ${resultado.fechaAnterior} ${resultado.horaAnterior}\nNuevo: ${nuevaFecha} ${nuevaHora}`);
        cargarEstadisticas();
        mostrarTodasLasReservas();
    } else {
        alert(`❌ Error: ${resultado.mensaje}`);
    }
}

console.log('✅ Script de dashboard cargado correctamente');
