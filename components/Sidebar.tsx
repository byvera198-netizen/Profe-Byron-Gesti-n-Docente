import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  ShieldCheck, 
  GraduationCap, 
  Calendar,
  ChevronRight,
  LogOut,
  UserCircle
} from 'lucide-react';

const menuItems = [
  {
    group: 'Principal',
    items: [
      { name: 'Inicio', icon: LayoutDashboard, path: '/dashboard' },
    ]
  },
  {
    group: 'Mi Espacio Docente',
    items: [
      { name: 'Mis Asignaturas', icon: BookOpen, path: '/docente/asignaturas' },
      { name: 'Mis Cursos', icon: Users, path: '/docente/cursos' },
      { name: 'Mis Estudiantes', icon: UserCircle, path: '/docente/estudiantes' },
      { name: 'Insumos', icon: FileText, path: '/docente/insumos' },
      { name: 'Calificaciones', icon: GraduationCap, path: '/docente/calificaciones' },
      { name: 'Consolidado', icon: FileText, path: '/docente/consolidado' },
      { name: 'Documentos', icon: FileText, path: '/docente/documentos' },
    ]
  },
  {
    group: 'Tutoría',
    items: [
      { name: 'Mi Curso', icon: Users, path: '/tutor/mi-curso' },
      { name: 'Docentes', icon: UserCircle, path: '/tutor/docentes' },
      { name: 'Rendimiento', icon: LayoutDashboard, path: '/tutor/rendimiento' },
      { name: 'Junta de Curso', icon: Calendar, path: '/tutor/junta' },
      { name: 'Actas', icon: FileText, path: '/tutor/actas' },
    ]
  },
  {
    group: 'Administración',
    items: [
      { name: 'Usuarios', icon: Users, path: '/admin/usuarios' },
      { name: 'Cursos y Paralelos', icon: BookOpen, path: '/admin/cursos' },
      { name: 'Asignaturas', icon: BookOpen, path: '/admin/asignaturas' },
      { name: 'Configuración', icon: Settings, path: '/admin/config' },
    ]
  },
  {
    group: 'Sistema',
    items: [
      { name: 'Auditoría', icon: ShieldCheck, path: '/sistema/auditoria' },
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-secondary-900 text-slate-300 flex flex-col sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-secondary-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
            PB
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">PROFE. BYRON</h1>
            <p className="text-[10px] text-secondary-400 uppercase tracking-wider">Gestión Docente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {menuItems.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-2 text-xs font-semibold text-secondary-500 uppercase tracking-widest mb-3">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <a 
                  key={item.name} 
                  href={item.path} 
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary-800 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-secondary-400 group-hover:text-primary-400 transition-colors" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-secondary-800 bg-secondary-950">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-800 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
            BV
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Byron Vera</p>
            <p className="text-[10px] text-secondary-400 truncate">Docente & Tutor</p>
          </div>
          <button className="text-secondary-500 hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
