'use client';

import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Clock, User, Database, FileText, Download } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('Todas las acciones');

  const logs = [
    { id: '1', user: 'Byron Vera', action: 'MODIFICACIÓN', table: 'grades', record: 'S-102', oldVal: '7.5', newVal: '8.0', date: '2026-06-12 14:30', ip: '192.168.1.45' },
    { id: '2', user: 'Byron Vera', action: 'GENERACIÓN', table: 'annual_grades', record: 'Consolidado_2BGU_A', oldVal: '-', newVal: 'PDF Generated', date: '2026-06-12 15:10', ip: '192.168.1.45' },
    { id: '3', user: 'Admin Inst', action: 'APROBACIÓN', table: 'institution_members', record: 'User-45', oldVal: 'pending', newVal: 'approved', date: '2026-06-11 09:00', ip: '10.0.0.12' },
    { id: '4', user: 'Byron Vera', action: 'LOGIN', table: 'auth', record: 'Session-X', oldVal: '-', newVal: 'Success', date: '2026-06-12 08:00', ip: '192.168.1.45' },
    { id: '5', user: 'Byron Vera', action: 'MODIFICACIÓN', table: 'activities', record: 'ACT-04', oldVal: 'Ponderación 10%', newVal: 'Ponderación 15%', date: '2026-06-13 11:20', ip: '192.168.1.45' },
    { id: '6', user: 'Admin Inst', action: 'IMPORTACIÓN', table: 'students', record: 'Nomina_CSV', oldVal: '0', newVal: '35 registros', date: '2026-06-10 16:45', ip: '10.0.0.12' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.record.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'Todas las acciones' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = 'Usuario,Accion,Tabla,Registro,Valor_Anterior,Valor_Nuevo,Fecha,IP\n';
    const rows = filteredLogs.map(l => 
      `"${l.user}","${l.action}","${l.table}","${l.record}","${l.oldVal}","${l.newVal}","${l.date}","${l.ip}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Auditoria_Sistema_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Historial de Auditoría</h1>
          <p className="text-slate-500">Registro detallado de todas las acciones realizadas en la plataforma.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-2 text-sm shadow-sm"
          >
            <Download size={16} />
            <span>Exportar Log CSV</span>
          </button>
        </div>
      </header>

      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por usuario, tabla o registro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            />
          </div>
          <select 
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm cursor-pointer"
          >
            <option>Todas las acciones</option>
            <option>MODIFICACIÓN</option>
            <option>GENERACIÓN</option>
            <option>APROBACIÓN</option>
            <option>LOGIN</option>
            <option>IMPORTACIÓN</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldAlert size={16} className="text-amber-500" />
          <span>Solo lectura para Administradores</span>
        </div>
      </div>

      <DataTable 
        headers={['Usuario', 'Acción', 'Tabla/Módulo', 'Registro', 'Valor Anterior', 'Valor Nuevo', 'Fecha', 'IP']}
        data={filteredLogs}
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
                log.action === 'APROBACIÓN' ? 'bg-emerald-100 text-emerald-700' : 
                log.action === 'IMPORTACIÓN' ? 'bg-purple-100 text-purple-700' :
                log.action === 'GENERACIÓN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
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

