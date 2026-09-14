import './globals.css';
import AppShell from '@/components/AppShell';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Profe. Byron Gestión Docente',
  description: 'Plataforma inteligente para la gestión académica, documental y Juntas de Curso',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
