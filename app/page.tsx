import React from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  // Mock data for the dashboard
  const stats = [
    { label: 'Estudiantes', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Asignaturas', value: '4', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Documentos', value: '12', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Juntas Pendientes', value: '2', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const alerts = [
    { id: 1, student: 'Juan Pérez', subject: 'ECA', issue: 'Bajo rendimiento (4.5)', severity: 'critical' },
    { id: 2, student: 'María García', subject: 'TIC', issue: 'Actividades pendientes', severity: 'warning' },
    { id: 3, student: 'Carlos Ruiz', subject: 'Sistemas', issue: 'Faltan calificaciones I Per.', severity: 'warning' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Buenos días, Profe. Byron 👋</h1>
          <p className="text-slate-500">Unidad Educativa &quot;Técnica Nacional&quot; | Año Lectivo 2026-2027</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar size={18} />
            <span>Agenda</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FileText size={18} />
            <span>Generar Reporte</span>
          </button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Section - The Academic Semaphore */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} />
                <h2 className="font-bold text-slate-800">Alertas Académicas (Semáforo)</h2>
              </div>
              <button className="text-sm text-primary-600 font-medium hover:underline">Ver todas</button>
            </div>
            <div className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{alert.student}</p>
                      <p className="text-xs text-slate-500">{alert.subject} • {alert.issue}</p>
                    </div>
                  </div>
                  <button className="text-xs btn-secondary py-1 px-3">Gestionar</button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-primary-500" size={20} />
              <h2 className="font-bold text-slate-800">Actividad Reciente</h2>
            </div>
            <div className="space-y-4">
              {[
                { action: 'Subió notas de ECA', time: 'Hace 2 horas', icon: CheckCircle2, color: 'text-emerald-500' },
                { action: 'Programó Junta de Curso 2BGU-A', time: 'Ayer', icon: Calendar, color: 'text-blue-500' },
                { action: 'Actualizó observaciones cualitativas', time: 'Hace 3 días', icon: FileText, color: 'text-indigo-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`p-2 rounded-lg bg-slate-100 ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{item.action}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 bg-primary-900 text-white border-none shadow-xl shadow-primary-900/20">
            <h3 className="font-bold text-lg mb-4">Acceso Rápido</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium">Registrar Insumo</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium">Generar Acta</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium">Ver Consolidado</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 mb-4">Mis Cursos Actuales</h3>
            <div className="space-y-2">
              {['2do BGU - A', '2do BGU - B', '3ro BGU - A'].map((course) => (
                <div key={course} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:border-primary-200 transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-slate-600">{course}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
