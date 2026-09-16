import Link from "next/link";

export const metadata = { title: "Términos de servicio | Profe. Byron Gestión Docente" };

export default function TermsPage() {
  return <main className="legal-page">
    <article className="legal-card">
      <Link className="legal-back" href="/acceso">← Volver al acceso</Link>
      <p className="legal-kicker">Profe. Byron Gestión Docente</p>
      <h1>Términos de servicio</h1>
      <p className="legal-date">Última actualización: 15 de septiembre de 2026</p>
      <h2>Finalidad del servicio</h2>
      <p>Profe. Byron Gestión Docente es una herramienta para organizar la planificación, evaluación, consolidados y juntas de curso de Bachillerato en Ciencias y Bachillerato Técnico.</p>
      <h2>Uso de las cuentas</h2>
      <p>Las cuentas pertenecen a docentes y administradores de una unidad educativa. El administrador institucional aprueba la incorporación de docentes y puede gestionar los registros de su institución.</p>
      <h2>Responsabilidad de los usuarios</h2>
      <p>Cada usuario debe mantener la confidencialidad de sus credenciales y registrar información veraz. Los datos académicos ingresados deben respetar las políticas internas de la unidad educativa y la normativa aplicable.</p>
      <h2>Integraciones de terceros</h2>
      <p>El acceso con Google y la exportación opcional a Google Drive se rigen también por las condiciones de Google. La autorización de Drive se limita a los archivos creados por esta aplicación.</p>
      <h2>Disponibilidad y cambios</h2>
      <p>La aplicación puede actualizarse para mejorar la gestión docente, seguridad y compatibilidad. Cualquier cambio relevante a estos términos se reflejará en esta página.</p>
      <h2>Contacto</h2>
      <p>Para consultas sobre el servicio, escribe a <a href="mailto:byvera198@gmail.com">byvera198@gmail.com</a>.</p>
    </article>
  </main>;
}
