/**
 * ========================================
 * ARQUITECTURA Y DATOS - SISTEMA DE RESERVAS
 * ========================================
 * 
 * Este módulo gestiona la estructura de datos del sistema usando localStorage.
 * localStorage es una API del navegador que permite almacenar datos de forma persistente
 * (los datos permanecen aunque se cierre el navegador).
 * 
 * ESTRUCTURA DE DATOS:
 * 1. Usuarios: Array de objetos con información de cada usuario del sistema
 * 2. Reservas: Array de objetos con información de cada reserva realizada
 */

/**
 * Función para inicializar los datos en localStorage
 * Esta función se ejecuta al cargar la aplicación y verifica si ya existen datos.
 * Si no existen, crea datos de ejemplo para poder probar el sistema.
 * 
 * ¿Por qué usamos JSON.stringify?
 * localStorage solo puede almacenar texto (strings), por lo que necesitamos
 * convertir nuestros objetos JavaScript a formato JSON (texto) antes de guardarlos.
 */
function inicializarDatos() {
    // Verificamos si ya existen usuarios en el localStorage
    // Si no existen (null), creamos los datos iniciales
    if (!localStorage.getItem('usuarios')) {
        /**
         * ARRAY DE USUARIOS
         * Cada usuario tiene:
         * - id: Identificador único (número)
         * - nombre: Nombre completo del usuario
         * - correo: Email único para login
         * - password: Contraseña (en un sistema real debería estar encriptada)
         * - rol: Define los permisos del usuario
         *   · 'admin': Acceso total, puede eliminar reservas
         *   · 'operador': Puede gestionar reservas (confirmar/cancelar)
         *   · 'cliente': Solo puede crear y ver sus propias reservas
         */
        const usuariosIniciales = [
            {
                id: 1,
                nombre: 'Admin Principal',
                correo: 'admin@reservas.com',
                password: 'admin123',
                rol: 'admin'
            },
            {
                id: 2,
                nombre: 'Operador Sistema',
                correo: 'operador@reservas.com',
                password: 'operador123',
                rol: 'operador'
            },
            {
                id: 3,
                nombre: 'Juan Pérez',
                correo: 'juan@cliente.com',
                password: 'juan123',
                rol: 'cliente'
            },
            {
                id: 4,
                nombre: 'María García',
                correo: 'maria@cliente.com',
                password: 'maria123',
                rol: 'cliente'
            },
            {
                id: 5,
                nombre: 'Carlos Rodríguez',
                correo: 'carlos@cliente.com',
                password: 'carlos123',
                rol: 'cliente'
            }
        ];

        // Convertimos el array a JSON y lo guardamos en localStorage
        // JSON.stringify convierte objetos JavaScript a texto JSON
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
        console.log('✅ Usuarios inicializados en localStorage');
    }

    // Verificamos si ya existen reservas en el localStorage
    if (!localStorage.getItem('reservas')) {
        /**
         * ARRAY DE RESERVAS
         * Cada reserva tiene:
         * - id: Identificador único de la reserva
         * - clienteId: ID del usuario que hizo la reserva (relación con tabla usuarios)
         * - fecha: Fecha de la reserva en formato YYYY-MM-DD
         * - hora: Hora de la reserva en formato HH:MM
         * - estado: Estado actual de la reserva
         *   · 'pendiente': Recién creada, esperando confirmación
         *   · 'confirmada': Aprobada por operador
         *   · 'cancelada': Rechazada o anulada
         */
        const reservasIniciales = [
            {
                id: 1,
                clienteId: 3, // Juan Pérez
                fecha: '2025-02-20',
                hora: '10:00',
                estado: 'pendiente'
            },
            {
                id: 2,
                clienteId: 4, // María García
                fecha: '2025-02-21',
                hora: '14:30',
                estado: 'confirmada'
            },
            {
                id: 3,
                clienteId: 3, // Juan Pérez
                fecha: '2025-02-22',
                hora: '09:00',
                estado: 'confirmada'
            },
            {
                id: 4,
                clienteId: 5, // Carlos Rodríguez
                fecha: '2025-02-23',
                hora: '16:00',
                estado: 'pendiente'
            }
        ];

        // Guardamos las reservas iniciales en localStorage
        localStorage.setItem('reservas', JSON.stringify(reservasIniciales));
        console.log('✅ Reservas inicializadas en localStorage');
    }
}

/**
 * Función para obtener todos los usuarios del sistema
 * 
 * ¿Por qué usamos JSON.parse?
 * Cuando recuperamos datos de localStorage, vienen como texto (JSON).
 * JSON.parse convierte ese texto de vuelta a objetos JavaScript
 * que podemos usar en nuestro código.
 * 
 * @returns {Array} Array de objetos usuario
 */
function obtenerUsuarios() {
    // Obtenemos el texto JSON del localStorage
    const usuariosJSON = localStorage.getItem('usuarios');
    
    // Lo convertimos de JSON a objetos JavaScript
    // Si no existe (null), retornamos array vacío
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}

/**
 * Función para obtener todas las reservas del sistema
 * 
 * @returns {Array} Array de objetos reserva
 */
function obtenerReservas() {
    const reservasJSON = localStorage.getItem('reservas');
    return reservasJSON ? JSON.parse(reservasJSON) : [];
}

/**
 * Función para guardar usuarios en localStorage
 * Útil cuando se agregan o modifican usuarios
 * 
 * @param {Array} usuarios - Array de objetos usuario a guardar
 */
function guardarUsuarios(usuarios) {
    // Convertimos el array de usuarios a JSON y lo guardamos
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log('💾 Usuarios guardados en localStorage');
}

/**
 * Función para guardar reservas en localStorage
 * Esta función se usa cada vez que se crea, modifica o elimina una reserva
 * 
 * @param {Array} reservas - Array de objetos reserva a guardar
 */
function guardarReservas(reservas) {
    // Convertimos el array de reservas a JSON y lo guardamos
    localStorage.setItem('reservas', JSON.stringify(reservas));
    console.log('💾 Reservas guardadas en localStorage');
}

/**
 * Función para generar el siguiente ID disponible
 * Busca el ID más alto en el array y le suma 1
 * 
 * @param {Array} items - Array de objetos con propiedad 'id'
 * @returns {number} Siguiente ID disponible
 */
function generarNuevoId(items) {
    if (items.length === 0) return 1;
    
    // Math.max encuentra el número más grande
    // ...items.map(item => item.id) crea un array solo con los IDs
    const maxId = Math.max(...items.map(item => item.id));
    return maxId + 1;
}

// Ejecutamos la inicialización cuando se carga el script
// Esto asegura que siempre haya datos disponibles
inicializarDatos();

console.log('🚀 Sistema de datos inicializado correctamente');
