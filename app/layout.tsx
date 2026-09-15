import type { Metadata } from "next";
import "./globals.css";
import "./workspace.css";
import "./acceso/acceso.css";

export const metadata: Metadata = {
  title: "Profe. Byron · Gestión Docente",
  description: "Calificaciones, consolidados y juntas de curso para Bachillerato en Ciencias y Técnico.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
