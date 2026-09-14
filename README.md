# 🎓 Profe. Byron Gestión Docente
**Plataforma inteligente para la gestión académica, documental y Juntas de Curso.**

## 🏗️ Arquitectura Técnica
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage).
- **Despliegue:** Vercel.
- **Diseño:** UI Premium con Shadcn UI.

## 🚀 Guía de Instalación y Configuración (MVP)

### 1. Configuración de Supabase
1. Crea una cuenta gratuita en [supabase.com](https://supabase.com).
2. Crea un nuevo proyecto llamado `profe-byron-gestion-docente`.
3. Ve al **SQL Editor** en el panel de Supabase.
4. Copia el contenido del archivo `schema.sql` de este repositorio y ejecútalo para crear todas las tablas, relaciones y políticas de seguridad (RLS).
5. En **Authentication** $\rightarrow$ **Providers**, habilita el proveedor de **Google** (requiere Client ID y Secret de Google Cloud, o puedes usar Email/Password para pruebas iniciales).

### 2. Configuración del Proyecto Local
1. Clona este repositorio o abre la carpeta en VS Code.
2. Crea un archivo `.env.local` en la raíz con las siguientes variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### 3. Despliegue en Vercel
1. Conecta tu repositorio de GitHub a [vercel.com](https://vercel.com).
2. Agrega las mismas variables de entorno del `.env.local` en el panel de Vercel.
3. Haz el deploy.

## 🗺️ Mapa de Módulos
- **Admin:** Gestión de Instituciones $\rightarrow$ Usuarios $\rightarrow$ Cursos $\rightarrow$ Asignaturas.
- **Docente:** Gestión de Estudiantes $\rightarrow$ Insumos $\rightarrow$ Calificaciones $\rightarrow$ Consolidado.
- **Tutor:** Dashboard de Curso $\rightarrow$ Rendimiento $\rightarrow$ Juntas de Curso $\rightarrow$ Actas.
- **Soporte:** Auditoría de cambios y almacenamiento en Supabase Storage.

---
**Desarrollado por Hermes Agent bajo la dirección del Profe. Byron.**
