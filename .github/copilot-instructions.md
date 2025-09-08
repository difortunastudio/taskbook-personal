# TaskBook - Cuaderno Virtual Personalizado

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Descripción del Proyecto
TaskBook es una aplicación web personal tipo cuaderno digital con las siguientes características:

### Funcionalidades Principales
- **Gestión diaria de tareas**: Organización por proyectos con checkboxes
- **Páginas de resumen por proyecto**: Emails, cuentas, links, documentos
- **Sistema de archivos**: Subida y almacenamiento seguro de documentos
- **Autenticación de usuario**: Login/contraseña para acceso multi-dispositivo
- **Diseño responsive**: Funciona igual en desktop, móvil y cualquier dispositivo

### Stack Tecnológico
- **Frontend**: Next.js 15 con TypeScript
- **Styling**: Tailwind CSS
- **Base de datos**: SQLite con Prisma ORM (para empezar, escalable a PostgreSQL)
- **Autenticación**: NextAuth.js
- **Almacenamiento de archivos**: Sistema local con posibilidad de migrar a cloud

### Estructura de Datos
- **Usuarios**: Autenticación y perfiles
- **Proyectos**: Contenedores principales de organización
- **Tareas**: Items diarios con estado completado/pendiente
- **Archivos**: Documentos adjuntos por proyecto
- **Enlaces**: Links y referencias importantes por proyecto

### Principios de Diseño
- Interfaz limpia y minimalista tipo cuaderno
- Navegación intuitiva y rápida
- Experiencia consistente en todos los dispositivos
- Enfoque en la productividad personal

### Consideraciones de Desarrollo
- Usar App Router de Next.js 15
- Implementar Server Components cuando sea posible
- Mantener tipos TypeScript estrictos
- Seguir principios de seguridad para autenticación y archivos
- Optimizar para rendimiento en móviles
