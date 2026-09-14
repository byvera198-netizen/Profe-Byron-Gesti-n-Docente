import React from 'react';
import { Search, Filter, ShieldAlert, Clock, User, Database, FileText } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function AuditLog() {
  const logs = [
    { id: '1', user: 'Byron Vera', action: 'MODIFICACIÓN', table: 'grades', record: 'S-102', oldVal: '7.5', newVal: '8.0', date: '2026-06-12 14:30', ip: '192.168.1.45' },
    { id: '2', user: 'Byron Vera', action: 'GENERACIÓN', table: 'annual_grades', record: 'Consolidado_2BGU_A', oldVal: '-', newVal: 'PDF Generated', date: '2026-06-12 15:10', ip: '192.168.1.45' },
    { id: '3', user: 'Admin Inst', action: 'APROBACIÓN', table: 'institution_members', record: 'User-45', oldVal: 'pending', newVal: 'approved', date: '2026-06-11 09:00', ip: '10.0.0.12' },
    { id: '4', user: 'Byron Vera', action: 'LOGIN', table: 'auth', record: 'Session-X', oldVal: '-', newVal: 'Success', date: '2026-06-12 08:00', ip: '192.168.1.45' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Historial de Auditoría</h1>
          <p className="text-slate-500">Registro detallado de todas las acciones realizadas en la plataforma.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={16} />
            <span>Exportar Log</span>
          </button>
        </div>
      </header>

      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por usuario, acción o registro..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <select className="px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm cursor-pointer">
            <option>Todas las acciones</option>
            <option>MODIFICACIÓN</option>
            <option>APROBACIÓN</option>
            <option>LOGIN</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldAlert size={16} className="text-amber-500" />
          <span>Solo lectura para Administradores</span>
        </div>
      </div>

      <DataTable 
        headers={['Usuario', 'Acción', 'Tabla/Módulo', 'Registro', 'Valor Anterior', 'Valor Nuevo', 'Fecha', 'IP']}
        data={logs}
        renderRow={(log) => (
          <React.Fragment>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{log.user}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                log.action === 'MODIFICACIÓN' ? 'bg-amber-100 text-amber-700' : 
                log.action === 'APROBACIÓN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {log.action}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Database size={12} /> {log.table}
              </div>
            </td>
            <td className="px-6 py-4 text-sm font-mono text-slate-500">{log.record}</td>
            <td className="px-6 py-4 text-sm text-red-500 line-through">{log.oldVal}</td>
            <td className="px-6 py-4 text-sm text-emerald-600 font-bold">{log.newVal}</td>
            <td className="px-6 py-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Clock size={12} /> {log.date}
              </div>
            </td>
            <td className="px-6 py-4 text-xs font-mono text-slate-400">{log.ip}</td>
          </React.Fragment>
        )}
      />
    </div>
  );
}

function Download(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
}
