/**
 * ========================================
 * LÓGICA DE LA PÁGINA DE LOGIN
 * ========================================
 * 
 * Este script maneja el comportamiento del formulario de login
 */

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Página de login cargada');
    
    // Obtenemos el formulario
    const loginForm = document.getElementById('loginForm');
    
    // Escuchamos el evento submit del formulario
    loginForm.addEventListener('submit', function(event) {
        // Prevenimos el comportamiento por defecto (recargar la página)
        event.preventDefault();
        
        // Obtenemos los valores de los inputs
        const correo = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;
        
        console.log(`🔍 Intentando login con: ${correo}`);
        
        // Llamamos a la función de autenticación
        const resultado = autenticarUsuario(correo, password);
        
        // Verificamos el resultado
        if (resultado.exito) {
            // Login exitoso
            alert(`✅ ${resultado.mensaje}\n\nBienvenido ${resultado.usuario.nombre}!`);
            
            // Redirigimos según el rol del usuario
            redirigirSegunRol(resultado.usuario);
        } else {
            // Login fallido
            alert(`❌ ${resultado.mensaje}\n\nPor favor verifica tus credenciales.`);
            
            // Limpiamos el campo de password
            document.getElementById('password').value = '';
        }
    });
});
