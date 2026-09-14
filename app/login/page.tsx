'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap, Mail, Lock, LogIn, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      } else {
        setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error inesperado al conectar con el servicio.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar con Google.');
    } finally {
      setLoading(false);
    }
  };

  // Demo access to explore the platform without pre-seeded Supabase credentials
  const handleDemoLogin = (role: 'docente' | 'admin') => {
    if (role === 'docente') {
      setEmail('byron.vera@colegio.edu.ec');
    } else {
      setEmail('admin@colegio.edu.ec');
    }
    setPassword('Demo2026!');
    setSuccessMessage(`Credenciales de prueba cargadas para rol: ${role.toUpperCase()}`);
  };

  return (
    <div className="w-full max-w-md p-8">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex w-16 h-16 bg-primary-600 rounded-2xl items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-primary-600/30 mb-2">
          PB
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">PROFE. BYRON</h1>
        <p className="text-xs uppercase font-bold text-primary-600 tracking-widest">Gestión Docente &amp; Juntas de Curso</p>
        <p className="text-sm text-slate-500 pt-1">Ingresa con tus credenciales institucionales para acceder a la plataforma.</p>
      </div>

      {/* Card Form */}
      <div className="glass-card p-8 rounded-3xl space-y-6 shadow-xl shadow-slate-200/50">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700">
            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@colegio.edu.ec"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600 uppercase">Contraseña</label>
              <button type="button" className="text-xs text-primary-600 hover:underline">
                ¿Olvidaste tu clave?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-primary-600/20 mt-2"
          >
            <LogIn size={18} />
            <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs text-slate-400 uppercase font-semibold absolute">o</span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 bg-white"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Acceder con Google Institucional</span>
        </button>

        {/* Demo Fast Fill Section */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase text-center mb-2">Accesos Rápidos de Prueba:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('docente')}
              className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Docente / Tutor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Administrador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
