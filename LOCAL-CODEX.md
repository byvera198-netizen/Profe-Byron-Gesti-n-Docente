# Trabajo local con Codex

El proyecto puede abrirse desde cualquier cuenta de Codex en este equipo porque el código está en GitHub y no depende de una sesión de Codex para ejecutarse.

1. Clona la rama de trabajo:

   ```powershell
   git clone --branch codex/verified-release https://github.com/byvera198-netizen/Profe-Byron-Gesti-n-Docente.git
   cd Profe-Byron-Gesti-n-Docente
   ```

2. Abre esa carpeta en Codex y pide continuar sobre el proyecto existente.
3. Instala las dependencias con `npm ci` y ejecuta `npm run dev`.
4. Abre `http://localhost:5173/acceso` para crear una cuenta de prueba con correo y contraseña.

Las claves de Google y los valores de producción no se guardan en Git. Copia `.env.example` a `.env.local` para una prueba local y completa los valores de Google OAuth cuando estén disponibles.

## Roles institucionales

- La persona que crea una unidad educativa queda como **administrador**.
- El administrador registra o aprueba miembros, asigna docentes a cursos y puede editar cualquier registro de su institución.
- Los docentes solicitan acceso con el código institucional y quedan en estado pendiente hasta la aprobación del administrador.
- Google y correo/contraseña crean sesiones independientes; cada docente debe usar el método con el que fue dado de alta o pedir al administrador que actualice su acceso.
