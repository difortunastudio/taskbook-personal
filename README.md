# TaskBook - Tu Cuaderno Virtual Personalizado

Una aplicación web personal tipo cuaderno digital para organizar tus tareas y proyectos de manera simple y eficiente.

## Características

- **📝 Gestión diaria de tareas**: Organización por proyectos con checkboxes
- **📂 Páginas de resumen por proyecto**: Emails, cuentas, links, documentos
- **📎 Sistema de archivos**: Subida y almacenamiento seguro de documentos
- **🔐 Autenticación de usuario**: Login/contraseña para acceso multi-dispositivo
- **📱 Diseño responsive**: Funciona igual en desktop, móvil y cualquier dispositivo

## Stack Tecnológico

- **Frontend**: Next.js 15 con TypeScript
- **Styling**: Tailwind CSS
- **Base de datos**: SQLite con Prisma ORM
- **Autenticación**: NextAuth.js
- **Iconos**: Lucide React

## Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone <tu-repo>
   cd taskbookv1
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar base de datos**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Configurar variables de entorno**:
   Edita el archivo `.env` y cambia `NEXTAUTH_SECRET` por una clave secreta única.

5. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar versión de producción
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar esquema con la base de datos
- `npm run db:studio` - Abrir Prisma Studio

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   └── auth/          # Autenticación
│   ├── auth/              # Páginas de autenticación
│   ├── home/              # Dashboard principal
│   └── projects/          # Gestión de proyectos
├── lib/                   # Utilidades y configuraciones
│   ├── auth.ts           # Configuración NextAuth
│   └── prisma.ts         # Cliente Prisma
└── types/                 # Definiciones de tipos TypeScript
```

## Uso

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Crear proyecto**: Organiza tus tareas por proyectos
3. **Gestionar tareas**: Agrega tareas diarias con checkboxes
4. **Adjuntar archivos**: Sube documentos importantes
5. **Enlaces y notas**: Guarda emails, cuentas y links importantes

## Funcionalidades Pendientes

- [ ] API para gestión de proyectos
- [ ] API para gestión de tareas
- [ ] Sistema de upload de archivos
- [ ] Filtros y búsqueda
- [ ] Dashboard con estadísticas
- [ ] Exportación de datos

## Contribución

Este es un proyecto personal, pero las sugerencias son bienvenidas a través de issues.

## Licencia

Proyecto personal para uso privado.
