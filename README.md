# 📅 Sistema de Reservas - Documentación Completa

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Funcionalidades Completas](#funcionalidades-completas)
5. [Instalación y Uso](#instalación-y-uso)
6. [Roles y Permisos](#roles-y-permisos)
7. [Usuarios de Prueba](#usuarios-de-prueba)
8. [Arquitectura y Conceptos](#arquitectura-y-conceptos)
9. [Reflexión del Desarrollo](#reflexión-del-desarrollo)

---

## 📖 Descripción General

Sistema completo de gestión de reservas desarrollado con **JavaScript Vanilla**, **HTML5**, **CSS3** y **Bootstrap 5**. Utiliza **localStorage** como base de datos persistente y **sessionStorage** para la gestión de sesiones.

### ✨ Características Principales

- ✅ **CRUD Completo** de reservas y usuarios
- ✅ **Tres roles** con permisos diferenciados
- ✅ **Autenticación** y gestión de sesiones
- ✅ **Sistema de JOIN** (relación entre tablas)
- ✅ **Validaciones** robustas de fecha y datos
- ✅ **Persistencia total** en localStorage
- ✅ **Diseño responsivo** con Bootstrap 5
- ✅ **Panel estadístico** en tiempo real
- ✅ **Protección de rutas** según rol

---

## 📁 Estructura del Proyecto

```
sistema-reservas/
│
├── 📄 login.html                 # Página de inicio de sesión
├── 📄 registro.html              # Registro de nuevos clientes
├── 📄 README.md                  # Esta documentación
├── 📄 INSTRUCCIONES.html         # Guía de inicio rápido
│
├── 📂 css/
│   └── styles.css                # Estilos personalizados del sistema
│
├── 📂 js/
│   ├── data.js                   # Arquitectura de datos y localStorage
│   ├── auth.js                   # Sistema de autenticación y sesiones
│   ├── crud.js                   # Operaciones CRUD para reservas
│   ├── join.js                   # Sistema de relaciones (JOIN)
│   ├── usuarios.js               # CRUD de usuarios (admin)
│   ├── registro.js               # Registro de clientes
│   ├── reprogramar.js            # Reprogramación de reservas
│   ├── login.js                  # Lógica de página de login
│   ├── cliente.js                # Interfaz del cliente
│   ├── dashboard.js              # Interfaz de admin/operador
│   └── gestion-usuarios.js       # Gestión de usuarios (admin)
│
└── 📂 pages/
    ├── cliente.html              # Vista del cliente
    ├── dashboard.html            # Vista de admin/operador
    └── gestion-usuarios.html     # Gestión de usuarios (admin)
```

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Versión | Uso |
|-----------|------------|---------|-----|
| **Frontend** | HTML5 | - | Estructura semántica |
| **Estilo** | Bootstrap | 5.3.2 | Framework CSS responsivo |
| **Estilo** | CSS3 | - | Personalización visual |
| **Lógica** | JavaScript | ES6+ | Funcionalidad completa |
| **Persistencia** | localStorage | API Web | Base de datos cliente |
| **Sesiones** | sessionStorage | API Web | Gestión de sesiones |
| **Tipografía** | Google Fonts | - | Poppins |
| **Iconos** | Font Awesome | 6.5.1 | Interfaz visual |

### Características Técnicas
- ✅ 100% JavaScript Vanilla (sin frameworks)
- ✅ Sin dependencias externas de NPM
- ✅ Funciona sin servidor (file://)
- ✅ Código modular y escalable
- ✅ Comentarios educativos extensos

---

## 🎯 Funcionalidades Completas

### 👑 Administrador

#### Gestión de Reservas
- ✅ Ver todas las reservas del sistema
- ✅ Ver datos completos de clientes (JOIN)
- ✅ **Eliminar** cualquier reserva
- ✅ Filtrar reservas por fecha
- ✅ Panel estadístico en tiempo real

#### Gestión de Usuarios
- ✅ **Crear** nuevos usuarios (cualquier rol)
- ✅ **Editar** usuarios existentes
- ✅ **Cambiar roles** de usuarios
- ✅ **Eliminar** usuarios y sus reservas
- ✅ Protección del admin principal

**Página:** `pages/dashboard.html` y `pages/gestion-usuarios.html`

---

### ⚙️ Operador

#### Gestión de Reservas
- ✅ Ver todas las reservas del sistema
- ✅ Ver datos completos de clientes (JOIN)
- ✅ **Confirmar** reservas pendientes
- ✅ **Cancelar** reservas
- ✅ **Reprogramar** fecha y hora de reservas
- ✅ Filtrar reservas de **HOY** (agenda diaria)
- ✅ Ver estadísticas del sistema

**Página:** `pages/dashboard.html`

---

### 👤 Cliente

#### Gestión Personal
- ✅ **Registrarse** en el sistema (sin admin)
- ✅ **Autenticarse** con correo y contraseña
- ✅ **Crear** nuevas reservas
- ✅ Validación de fecha futura
- ✅ **Cancelar** reservas propias (solo pendientes)
- ✅ Ver **historial completo** de reservas
- ✅ Ver solo sus propias reservas

**Páginas:** `pages/cliente.html` y `registro.html`

---

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- **NO** requiere servidor web
- **NO** requiere instalación de dependencias

### Pasos de Instalación

1. **Descargar el proyecto**
   ```bash
   Descomprimir el archivo sistema-reservas-completo.zip
   ```

2. **Abrir en el navegador**
   ```
   Doble clic en: login.html
   O: registro.html (para nuevos clientes)
   ```

3. **Usar credenciales de prueba** (ver sección siguiente)

### Importante
- Los datos se almacenan en **localStorage** del navegador
- Si limpias la caché, los datos se resetean
- Para resetear: DevTools → Application → Local Storage → Clear

---

## 🔑 Roles y Permisos

### Tabla de Permisos

| Funcionalidad | Admin | Operador | Cliente |
|---------------|:-----:|:--------:|:-------:|
| Ver todas las reservas | ✅ | ✅ | ❌ |
| Ver solo mis reservas | ✅ | ✅ | ✅ |
| Crear reserva | ✅ | ✅ | ✅ |
| Confirmar reserva | ✅ | ✅ | ❌ |
| Cancelar reserva | ✅ | ✅ | ✅* |
| Reprogramar reserva | ✅ | ✅ | ❌ |
| Eliminar reserva | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Crear usuarios | ✅ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ❌ |
| Eliminar usuarios | ✅ | ❌ | ❌ |
| Ver estadísticas | ✅ | ✅ | ❌ |
| Filtro agenda diaria | ✅ | ✅ | ❌ |
| Registrarse | ❌ | ❌ | ✅ |

*Cliente solo puede cancelar sus propias reservas pendientes

---

## 👥 Usuarios de Prueba

### Administrador
```
Correo: admin@reservas.com
Contraseña: admin123
Permisos: Acceso total al sistema
```

### Operador
```
Correo: operador@reservas.com
Contraseña: operador123
Permisos: Gestión de reservas
```

### Clientes

**Cliente 1:**
```
Correo: juan@cliente.com
Contraseña: juan123
```

**Cliente 2:**
```
Correo: maria@cliente.com
Contraseña: maria123
```

**Cliente 3:**
```
Correo: carlos@cliente.com
Contraseña: carlos123
```

### Crear Nuevos Usuarios

- **Clientes:** Usar página `registro.html`
- **Admin/Operador:** Solo el admin puede crearlos desde `gestion-usuarios.html`

---

## 🏗️ Arquitectura y Conceptos

### 1. Arquitectura de Datos (data.js)

```javascript
// Estructura de Usuarios
{
    id: 1,
    nombre: "Juan Pérez",
    correo: "juan@cliente.com",
    password: "juan123",
    rol: "cliente"
}

// Estructura de Reservas
{
    id: 1,
    clienteId: 3,
    fecha: "2025-02-20",
    hora: "10:00",
    estado: "pendiente"
}
```

**Conceptos Clave:**
- JSON.stringify() → Guardar en localStorage
- JSON.parse() → Recuperar de localStorage
- Generación automática de IDs

### 2. Sistema de Autenticación (auth.js)

**Flujo:**
1. Usuario ingresa credenciales
2. Búsqueda en localStorage
3. Si válido: crear sesión en sessionStorage
4. Redirigir según rol

**Protección de Rutas:**
```javascript
protegerPagina(['admin', 'operador']);
// Solo estos roles pueden acceder
```

### 3. Operaciones CRUD (crud.js)

- **CREATE:** Agregar nueva reserva
- **READ:** Leer reservas (todas, por cliente, por ID)
- **UPDATE:** Cambiar estado de reserva
- **DELETE:** Eliminar reserva permanentemente

### 4. Sistema de JOIN (join.js)

**Concepto:** Combinar datos de dos tablas

```javascript
// SIN JOIN
{ id: 1, clienteId: 3 }  ❌

// CON JOIN
{ 
    id: 1, 
    clienteId: 3,
    clienteNombre: "Juan Pérez",  ✅
    clienteCorreo: "juan@cliente.com"  ✅
}
```

### 5. Gestión de Usuarios (usuarios.js)

**Funcionalidades:**
- Crear usuarios con cualquier rol
- Editar información de usuarios
- Cambiar roles dinámicamente
- Eliminar usuarios (con sus reservas)
- Validación de correo único

### 6. Reprogramación (reprogramar.js)

**Validaciones:**
- Nueva fecha debe ser futura
- Nueva hora entre 08:00 - 20:00
- Si estaba cancelada → cambia a pendiente

---

## 💭 Reflexión del Desarrollo

### Aprendizajes Clave

#### 1. Persistencia sin Base de Datos
- localStorage como alternativa viable para prototipos
- Importancia de JSON.stringify/parse
- Limitaciones de almacenamiento (5-10MB)

#### 2. Arquitectura Modular
- Separación de responsabilidades
- Código más mantenible
- Facilita pruebas y depuración

#### 3. Sistema de Roles
- Implementación de permisos
- Protección de rutas
- Experiencia diferenciada por usuario

#### 4. Validaciones Múltiples
- HTML5 + JavaScript = doble seguridad
- Validación de fecha futura
- Formato de correo y contraseña

### Desafíos Superados

1. **JOIN sin SQL:** Simular relaciones con .map() y .find()
2. **Fechas en JavaScript:** Formato y comparación exacta
3. **Persistencia sincronizada:** Siempre guardar después de modificar
4. **UX consistente:** Feedback inmediato al usuario

### Limitaciones del Sistema

⚠️ **Seguridad:**
- Contraseñas sin encriptar
- Datos accesibles en DevTools
- Sin validación backend

⚠️ **Escalabilidad:**
- Límite de localStorage (5-10MB)
- Sin sincronización entre usuarios
- Sin respaldo automático

⚠️ **Funcionalidad:**
- Sin notificaciones en tiempo real
- Sin exportación de reportes
- Sin búsqueda avanzada

**Nota:** Estas limitaciones son aceptables para un proyecto educativo.

### Mejoras Futuras

#### Backend Real
- Node.js + Express
- MongoDB o PostgreSQL
- APIs RESTful

#### Seguridad
- Encriptación bcrypt
- JSON Web Tokens (JWT)
- Validación backend

#### Features
- Sistema de notificaciones
- Exportar a PDF/Excel
- Calendario visual
- Búsqueda avanzada
- Múltiples ubicaciones

---

## 📚 Documentación Adicional

### Archivos Incluidos

- **INSTRUCCIONES.html:** Guía visual de inicio rápido
- **DOCUMENTACION_PROMPTS_REFLEXION.pdf:** Documento completo con los 10 prompts de IA utilizados y reflexión profunda del desarrollo

### Código Comentado

Todos los archivos JavaScript tienen comentarios educativos extensos que explican:
- Por qué se usa cada función
- Cómo funcionan los algoritmos
- Conceptos técnicos importantes
- Mejores prácticas aplicadas

---

## 🎓 Uso Educativo

Este proyecto es ideal para:
- ✅ Aprender JavaScript Vanilla
- ✅ Entender localStorage/sessionStorage
- ✅ Practicar CRUD operations
- ✅ Implementar autenticación básica
- ✅ Diseñar sistemas con roles
- ✅ Estudiar arquitectura modular

---

## 📝 Créditos

- **Tecnologías:** HTML5, CSS3, JavaScript ES6+, Bootstrap 5
- **Desarrollo:** Proyecto educativo con asistencia de IA (Claude)
- **Licencia:** Uso educativo libre

---

## 🆘 Soporte

### Resetear el Sistema
```javascript
// En consola del navegador (DevTools)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Ver Datos Almacenados
```javascript
// En consola del navegador
console.log(JSON.parse(localStorage.getItem('usuarios')));
console.log(JSON.parse(localStorage.getItem('reservas')));
```

---

**Desarrollado con 💜 para aprendizaje**

*Sistema completo y funcional de gestión de reservas con arquitectura modular, código limpio y documentación extensiva.*
