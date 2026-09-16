import Link from "next/link";

export const metadata = { title: "Política de privacidad | Profe. Byron Gestión Docente" };

export default function PrivacyPage() {
  return <main className="legal-page">
    <article className="legal-card">
      <Link className="legal-back" href="/acceso">← Volver al acceso</Link>
      <p className="legal-kicker">Profe. Byron Gestión Docente</p>
      <h1>Política de privacidad</h1>
      <p className="legal-date">Última actualización: 15 de septiembre de 2026</p>
      <h2>Datos que tratamos</h2>
      <p>La aplicación registra el nombre, correo electrónico, rol institucional y la información académica que cada usuario ingresa para gestionar asignaturas, calificaciones, consolidados y juntas de curso.</p>
      <h2>Acceso con Google</h2>
      <p>Cuando eliges acceder con Google, usamos tu nombre, correo electrónico verificado e identificador de cuenta únicamente para crear o iniciar tu sesión. No solicitamos acceso a tu contraseña de Google.</p>
      <h2>Google Drive</h2>
      <p>La conexión a Google Drive es opcional y se activa por decisión del administrador institucional. Cuando se autorice, la aplicación crea o actualiza exclusivamente los archivos que genera para respaldos y exportaciones. Puedes revocar ese acceso desde la configuración de tu cuenta de Google.</p>
      <h2>Uso y conservación</h2>
      <p>Los datos se usan exclusivamente para la gestión docente de la unidad educativa. El administrador institucional puede revisar y administrar los registros de su institución. Cada docente conserva el control de los contenidos que registra.</p>
      <h2>Seguridad y contacto</h2>
      <p>Las credenciales de integración se almacenan como secretos cifrados de la plataforma. Para solicitar corrección o eliminación de datos, escribe a <a href="mailto:byvera198@gmail.com">byvera198@gmail.com</a>.</p>
    </article>
  </main>;
}
