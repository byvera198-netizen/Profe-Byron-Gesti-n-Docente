# 🎓 Profe. Byron Gestión Docente
**Plataforma Integral e Inteligente para la Gestión Académica, Calificaciones, Tutorías y Juntas de Curso.**

---

## 🌟 Características Principales

### 👨‍🏫 Espacio Docente
- **Insumos y Actividades:** Creación y ponderación de insumos (individuales, grupales, evaluaciones, proyectos) con cálculo automático del 100%.
- **Registro de Calificaciones:** Planilla reactiva de notas con cálculo de promedios ponderados en tiempo real y persistencia.
- **Planes de Mejora Académica:** Gestión de refuerzo pedagógico con sustitución automática de la calificación más baja sobre 10.
- **Sábana Consolidada:** Consolidado anual y trimestral (33% Q1, 33% Q2, 34% Q3) con determinación oficial automática (Promovido, Supletorio, Remedial).
- **Gestión Documental:** Archivo institucional con carpetas, visor, filtros y descarga directa de respaldos.

### 👥 Módulo de Tutoría y Juntas
- **Mi Curso:** Vista general de estudiantes a cargo, semáforo académico de riesgo y estadísticas de rendimiento.
- **Asistente de Juntas de Curso:** Asistente interactivo en 3 pasos (Revisión de Agenda, Análisis de Rendimiento, Acuerdos y Compromisos).
- **Actas Oficiales Imprimibles:** Generador de actas de junta con formato oficial del Ministerio de Educación, nómina de docentes asistentes y firmas de rectorado, secretaría y tutoría (optimizada para impresión o PDF).

### ⚙️ Administración Institucional
- **Cursos y Paralelos:** Creación dinámica de niveles educativos y gestión de paralelos (A, B, C...).
- **Malla Curricular:** Catálogo completo de asignaturas con carga horaria y áreas de conocimiento.
- **Importador Masivo de Estudiantes:** Carga de nóminas completas mediante archivos CSV y exportación en 1 clic.
- **Control de Usuarios y Roles:** Aprobación, suspensión e invitación de usuarios (Docentes, Tutores, Directivos, Administradores).
- **Historial de Auditoría:** Registro cronológico de modificaciones y acciones con exportación en CSV.

---

## 🚀 Inicio Rápido (Modo Operativo Inmediato)

La plataforma cuenta con un **modo autónomo con persistencia local** que permite probarla y operarla de inmediato sin dependencias externas:

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
2. Abre tu navegador en [http://localhost:3000](http://localhost:3000).
3. Para ingresar, puedes usar los botones de **Acceso Rápido de Prueba** en la pantalla de login:
   - **Docente / Tutor:** Acceso como `Byron Vera` (`byron.vera@colegio.edu.ec`).
   - **Administrador:** Acceso con privilegios institucionales (`admin@colegio.edu.ec`).

---

## 🗄️ Conexión con Supabase (Producción / Nube)

Si deseas sincronizar los datos en la nube con Supabase:

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve al **SQL Editor** en el panel de Supabase y pega el contenido de `schema.sql` para crear todas las tablas, relaciones y políticas RLS.
3. Configura tus credenciales en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   ```
4. La aplicación detectará automáticamente las credenciales remotas y sincronizará en tiempo real con Supabase.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Base de Datos & Auth:** Supabase (PostgreSQL, Row-Level Security, Auth)
- **Validación:** ESLint + TypeScript strict checks

---

**Desarrollado para la optimización de la gestión docente de la Unidad Educativa Técnica Nacional.**

