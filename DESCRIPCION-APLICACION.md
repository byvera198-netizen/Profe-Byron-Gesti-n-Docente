# Profe. Byron Gestión Docente

## Descripción general

**Profe. Byron Gestión Docente** es una aplicación web para la gestión académica de instituciones que imparten Bachillerato en Ciencias y Bachillerato Técnico. Centraliza la organización de cursos y paralelos, distribución de docentes, nóminas, calificaciones, consolidados, juntas de curso, informes y respaldos institucionales.

La plataforma está pensada para que cada institución gestione sus datos de forma independiente. Sus usuarios trabajan con permisos según su rol y cada docente solo accede a las asignaturas y cursos que le corresponden, salvo las autoridades autorizadas.

- Aplicación publicada: <https://gestiondocente.profebyron.workers.dev/>
- Repositorio: <https://github.com/byvera198-netizen/Profe-Byron-Gesti-n-Docente>
- Infraestructura: Cloudflare Workers y base de datos Cloudflare D1.

## Usuarios y permisos

| Rol | Accesos principales |
| --- | --- |
| **Administrador institucional** | Crea y configura la unidad educativa, aprueba miembros, gestiona todos los cursos, asignaturas, estudiantes, docentes, matrices, informes y reglas de evaluación. Puede editar registros institucionales y eliminar cursos completos con sus dependencias. |
| **Directivo** | Gestiona juntas de curso, consulta información institucional, configura la identidad visual e interviene en procesos académicos permitidos por la institución. |
| **Docente** | Registra y actualiza calificaciones de sus asignaturas asignadas, consulta su nómina, genera reportes y participa en las juntas correspondientes. |
| **Docente tutor** | Además de sus funciones docentes, administra estudiantes y juntas de los cursos y paralelos que le hayan sido asignados como tutor. Puede consultar el concentrado académico del curso. |

Los usuarios pueden crear una cuenta con correo y contraseña o iniciar sesión mediante Google cuando la integración OAuth institucional esté configurada. Para ingresar a una unidad educativa, el administrador debe aprobar la membresía del usuario.

## Organización académica

La sección **Asignaturas** permite construir la estructura académica de la institución:

- Creación y edición de cursos y paralelos.
- Clasificación de cursos como Bachillerato en Ciencias o Bachillerato Técnico.
- Registro de especialidades técnicas.
- Creación, edición y eliminación controlada de asignaturas y módulos.
- Registro de áreas académicas.
- Catálogo inicial de asignaturas para Ciencias y Técnico.
- Asignación individual de docente, asignatura, curso y paralelo.
- Distribución masiva desde Excel mediante pegado de datos.

### Distribución masiva de docentes

El administrador puede abrir **Asignaturas → Pegar distribución** y copiar una tabla desde Excel. La estructura esperada es:

```text
Curso y paralelo | Bachillerato | Especialidad | Asignatura | Área | Docente (correo)
1BT-Informática  | Técnico      | Informática  | Módulo Práctico Experimental | Formación técnica | docente@institucion.edu.ec
```

La aplicación reconoce datos separados por tabulaciones o punto y coma. Crea automáticamente cursos, paralelos y asignaturas inexistentes, y evita duplicar una asignación ya registrada. El docente se identifica por correo o nombre y debe estar aprobado dentro de la institución.

## Estudiantes y nóminas

La plataforma administra estudiantes por curso y paralelo. Cada registro puede incluir nombre completo e identificación.

Funciones disponibles:

- Registro individual de estudiantes.
- Edición y eliminación individual.
- Eliminación de un curso completo, con confirmación por nombre; elimina también los registros académicos vinculados.
- Importación individual o masiva de nóminas.
- Lectura de archivos Excel (`.xlsx`, `.xls`, `.csv`), Word (`.docx`), PDF y texto (`.txt`, `.tsv`).
- Vista previa antes de confirmar una importación.
- Detección básica de encabezados, nombres, apellidos e identificaciones.
- Importación de una matriz Excel de calificaciones junto con su nómina, si se selecciona expresamente esa opción y una asignación de destino.

## Registro de calificaciones

Cada asignación dispone de una matriz de calificaciones por período: I, II y III período. La matriz combina evaluación formativa, evaluación sumativa y procesos de mejora.

### Evaluación formativa

- Actividades individuales y grupales configurables.
- Entre 1 y 30 actividades por tipo.
- Nombres personalizables de cada actividad.
- Promedios individuales, grupales y formativos calculados automáticamente.
- Celdas vacías conservadas como pendientes.

### Evaluación sumativa y mejoras

- Examen.
- Proyecto.
- Promedio inicial.
- Mejora directa.
- Refuerzo.
- Taller.
- Nota mejorada y promedio sumativo calculados automáticamente.
- Validación de calificaciones entre 0 y 10.
- La nota de mejora conserva la nota inicial cuando un nuevo resultado es inferior.

### Pegado y edición masiva desde hojas de cálculo

La matriz permite trabajar directamente con datos copiados de Excel u otra hoja de cálculo.

1. Copie un bloque de notas, con una o varias filas y columnas.
2. Haga clic en la primera celda de destino de la matriz.
3. Pegue con `Ctrl + V`.

La aplicación distribuye los valores por filas y columnas. Esto funciona para aportes individuales, aportes grupales y para las columnas editables de la evaluación sumativa: Examen, Proyecto, Mejora directa, Refuerzo y Taller. Las celdas vacías se mantienen pendientes. Luego use **Guardar cambios** para registrar el bloque completo.

### Control de períodos

- Indicador de cambios pendientes y hora de guardado.
- Cierre de período cuando las notas requeridas están completas.
- Reapertura por administrador.
- Protección contra edición de períodos cerrados para docentes no administradores.
- Validación de reglas institucionales antes del cierre.
- Truncamiento visible a dos decimales.

## Visualización y exportación en Excel

Desde **Calificaciones** se puede descargar la **Matriz Excel · 7 hojas**. Esta entrega una hoja de cálculo estructurada para revisión, archivo o trabajo externo, con información del estudiante, docente, asignatura, curso e institución.

La matriz incluye hojas organizadas para:

1. Insumos del I período.
2. Insumos del II período.
3. Insumos del III período.
4. Nota de evaluación sumativa.
5. Consolidado de calificaciones.
6. Consolidado cualitativo.
7. Supletorio.

El registro activo también puede descargarse en PDF, Word, Excel o CSV. La vista de **Consolidados** permite generar informes por asignatura, por curso y la matriz completa.

## Consolidados y rendimiento

Los consolidados muestran el avance de cada estudiante a partir de todas las calificaciones registradas.

- Nota disponible por período, incluso si aún es provisional.
- Promedio anual cuando los tres períodos están completos.
- Equivalencia cualitativa anual.
- Estado académico: aprobado, supletorio o pendiente.
- Registro de nota de supletorio cuando corresponde.
- Consolidado por asignatura en PDF, Word, Excel y CSV.
- Consolidado de curso en Excel.

## Informes individuales de estudiantes

Desde la ficha de cada estudiante se puede abrir un informe académico integral con vista previa antes de descargarlo.

El informe incluye:

- Identificación del estudiante y curso.
- Asignaturas que cursa.
- Calificaciones de los tres períodos.
- Promedio anual por asignatura.
- Docente responsable.
- Estado o avance académico.

Se puede emitir como informe integral en PDF, Excel o Word. También es posible generar un boletín PDF por asignatura para el estudiante seleccionado.

## Juntas de curso

La sección **Juntas de curso** permite al docente tutor, directivo o administrador organizar el seguimiento académico de un curso y paralelo.

Cada junta puede registrar:

- Nombre, fecha, hora, curso y período.
- Docente tutor y directivo responsable.
- Orden del día.
- Análisis académico.
- Acuerdos.
- Asistencia de docentes.
- Estado: programada, en desarrollo, finalizada o cerrada.
- Compromisos, responsables, fechas límite, estado y evidencias.

### Concentrado académico para juntas

La junta presenta un concentrado por estudiante y asignatura con:

- Notas finales del I, II y III período.
- Promedio anual.
- Observación automática: **Aprueba**, **Reprueba** o **En proceso**.
- Cantidad de registros completos y estudiantes en riesgo por asignatura.

Este concentrado se puede descargar para sustentar la reunión. El acta se puede descargar en PDF o Word y, si Google Drive está conectado, guardarse en la cuenta institucional. Cuando se cierra una junta, el sistema conserva una instantánea de los registros académicos y del encabezado institucional para proteger su historial.

## Identidad institucional e informes profesionales

El administrador o directivo puede configurar el nombre de la institución, año lectivo, reglas de evaluación y logotipo institucional.

El logotipo institucional se muestra en la interfaz y se incorpora en los informes disponibles cuando el formato lo permite, incluidos los documentos PDF, Word y Excel generados por la plataforma. Los informes usan una cabecera institucional con datos coherentes de institución, año lectivo, curso, asignatura, docente y estudiante según corresponda.

## Documentos y Google Drive

La plataforma permite crear documentos académicos vinculados a un curso, con flujo de aprobación para autoridades.

Cuando se configura la integración de Google, la institución puede:

- Iniciar sesión o autorizar servicios de Google.
- Guardar actas y documentos en Google Drive.
- Generar respaldos de registros en Google Sheets y Drive.
- Descargar un respaldo institucional en JSON.
- Restaurar respaldos en una institución vacía.

Google Drive funciona como repositorio de documentos y copias de seguridad. La información operativa de la aplicación se mantiene en la base de datos institucional de Cloudflare D1.

## Seguridad y consistencia de datos

- Separación de datos por institución.
- Autorización del lado del servidor para operaciones sensibles.
- Aprobación de miembros institucionales por administrador.
- Restricción de edición según rol, curso, asignación y tutoría.
- Validaciones de calificaciones, estudiantes, cursos y asignaciones.
- Prevención de asignaciones duplicadas.
- Historial de cambios recientes.
- Control de versiones para evitar sobrescribir cambios de otro usuario.
- Protección de actas cerradas y períodos cerrados.
- Eliminación controlada de cursos completos y sus registros dependientes.

## Guía rápida de puesta en marcha

1. Cree la institución educativa y configure el año lectivo.
2. Cargue el logotipo y revise las reglas de evaluación.
3. Registre o apruebe docentes y directivos.
4. Cree cursos, paralelos, especialidades y asignaturas; o use **Pegar distribución** para importar todo desde Excel.
5. Asigne docentes a sus asignaturas y cursos.
6. Importe la nómina de estudiantes o regístrela manualmente.
7. Registre calificaciones manualmente o pegue bloques desde Excel.
8. Revise consolidados e informes individuales.
9. Programe juntas de curso y genere actas con el concentrado académico.
10. Descargue reportes y realice respaldos institucionales.

## Tecnología y operación local

La aplicación usa React, Vinext/Next, TypeScript, Cloudflare Workers y Cloudflare D1. Para editarla localmente con cualquier cuenta de Codex desde el equipo:

```powershell
cd "C:\Users\bvera\Documents\ChatGPT\Gestión Docente Prof. Byron\profe-byron"
npm install
npm run dev
```

La vista local se inicia normalmente en `http://localhost:5173/`. Para comprobar una compilación de producción:

```powershell
npm run build
```

El despliegue de producción se realiza con:

```powershell
npx wrangler deploy
```

Las variables y el enlace a la base D1 se encuentran en `wrangler.jsonc`. Las credenciales de Google deben mantenerse fuera del repositorio y configurarse como secretos o variables del entorno de Cloudflare.
