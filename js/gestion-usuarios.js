/**
 * ========================================
 * INTERFAZ DE GESTIÓN DE USUARIOS - ADMIN
 * ========================================
 */

let usuarioActivo = null;
let modoEdicion = false;
let usuarioEditandoId = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('👥 Página de gestión de usuarios cargada');
    
    // Proteger página (solo admin)
    protegerPagina(['admin']);
    
    // Obtener usuario activo
    usuarioActivo = obtenerUsuarioActivo();
    document.getElementById('nombreUsuario').textContent = usuarioActivo.nombre;
    
    // Cargar usuarios
    cargarTablaUsuarios();
});

/**
 * Carga y muestra todos los usuarios en la tabla
 */
function cargarTablaUsuarios() {
    const usuarios = obtenerUsuarios();
    const tbody = document.getElementById('tablaUsuarios');
    
    tbody.innerHTML = usuarios.map(usuario => {
        const badgeRol = obtenerBadgeRol(usuario.rol);
        const esAdminPrincipal = usuario.id === 1;
        
        return `
            <tr>
                <td class="fw-bold">#${usuario.id}</td>
                <td>
                    <i class="fas fa-user me-2 text-primary"></i>
                    ${usuario.nombre}
                    ${esAdminPrincipal ? '<span class="badge bg-warning text-dark ms-2">Principal</span>' : ''}
                </td>
                <td>${usuario.correo}</td>
                <td>${badgeRol}</td>
                <td>
                    ${!esAdminPrincipal ? `
                        <button class="btn btn-sm btn-warning me-1" onclick="prepararEditarUsuario(${usuario.id})" data-bs-toggle="modal" data-bs-target="#modalUsuario">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarUsuarioConfirmacion(${usuario.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : '<span class="text-muted">Protegido</span>'}
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Prepara el modal para crear un nuevo usuario
 */
function prepararNuevoUsuario() {
    modoEdicion = false;
    usuarioEditandoId = null;
    
    document.getElementById('modalTitulo').innerHTML = '<i class="fas fa-user-plus me-2"></i>Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('passwordModal').required = true;
}

/**
 * Prepara el modal para editar un usuario existente
 */
function prepararEditarUsuario(usuarioId) {
    modoEdicion = true;
    usuarioEditandoId = usuarioId;
    
    const usuario = obtenerUsuarioPorId(usuarioId);
    
    if (!usuario) {
        alert('❌ Usuario no encontrado');
        return;
    }
    
    document.getElementById('modalTitulo').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Usuario';
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('nombreModal').value = usuario.nombre;
    document.getElementById('correoModal').value = usuario.correo;
    document.getElementById('passwordModal').value = '';
    document.getElementById('passwordModal').required = false;
    document.getElementById('rolModal').value = usuario.rol;
}

/**
 * Guarda el usuario (crear o actualizar)
 */
function guardarUsuario() {
    const nombre = document.getElementById('nombreModal').value.trim();
    const correo = document.getElementById('correoModal').value.trim();
    const password = document.getElementById('passwordModal').value;
    const rol = document.getElementById('rolModal').value;
    
    if (modoEdicion) {
        // Actualizar usuario existente
        const datosActualizar = {
            nombre: nombre,
            correo: correo,
            rol: rol
        };
        
        // Solo actualizar password si se ingresó uno nuevo
        if (password) {
            datosActualizar.password = password;
        }
        
        const resultado = actualizarUsuario(usuarioEditandoId, datosActualizar);
        
        if (resultado.exito) {
            alert('✅ Usuario actualizado exitosamente');
            bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
            cargarTablaUsuarios();
        } else {
            alert(`❌ Error: ${resultado.mensaje}`);
        }
    } else {
        // Crear nuevo usuario
        if (!password) {
            alert('❌ Debes ingresar una contraseña');
            return;
        }
        
        const resultado = crearUsuario(nombre, correo, password, rol);
        
        if (resultado.exito) {
            alert('✅ Usuario creado exitosamente');
            bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
            cargarTablaUsuarios();
        } else {
            alert(`❌ Error: ${resultado.mensaje}`);
        }
    }
}

/**
 * Elimina un usuario con confirmación
 */
function eliminarUsuarioConfirmacion(usuarioId) {
    const usuario = obtenerUsuarioPorId(usuarioId);
    
    if (!usuario) {
        alert('❌ Usuario no encontrado');
        return;
    }
    
    const confirmar = confirm(
        `⚠️ ADVERTENCIA\n\n` +
        `¿Estás seguro de eliminar al usuario "${usuario.nombre}"?\n\n` +
        `Esta acción también eliminará todas sus reservas y NO se puede deshacer.`
    );
    
    if (confirmar) {
        const resultado = eliminarUsuario(usuarioId);
        
        if (resultado.exito) {
            alert(`✅ ${resultado.mensaje}`);
            cargarTablaUsuarios();
        } else {
            alert(`❌ Error: ${resultado.mensaje}`);
        }
    }
}

/**
 * Genera badge de color según el rol
 */
function obtenerBadgeRol(rol) {
    const badges = {
        'admin': '<span class="badge bg-danger"><i class="fas fa-crown me-1"></i>Administrador</span>',
        'operador': '<span class="badge bg-info"><i class="fas fa-user-cog me-1"></i>Operador</span>',
        'cliente': '<span class="badge bg-success"><i class="fas fa-user me-1"></i>Cliente</span>'
    };
    
    return badges[rol] || `<span class="badge bg-secondary">${rol}</span>`;
}

console.log('✅ Script de gestión de usuarios cargado');
