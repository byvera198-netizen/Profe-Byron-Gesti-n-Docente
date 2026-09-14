import './globals.css';
import Sidebar from '@/components/Sidebar';
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
        <div className="flex min-h-screen bg-slate-50">
          {/* We only show the sidebar if we are not on the login page */}
          {/* For this MVP phase, we'll include it globally, but we can wrap it in a conditional later */}
          <Sidebar />
          <main className="flex-1 overflow-y-auto h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
