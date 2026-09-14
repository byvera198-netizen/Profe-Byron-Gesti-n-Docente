import React, { useState } from 'react';
import { UserPlus, Shield, Search, Filter, MoreVertical, Check, X } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Byron Vera', email: 'byron@example.com', role: 'ADMIN_INST', status: 'approved', institution: 'Técnica Nacional' },
    { id: '2', name: 'Ana Martínez', email: 'ana@example.com', role: 'DOCENTE', status: 'pending', institution: 'Técnica Nacional' },
    { id: '3', name: 'Carlos Ruiz', email: 'carlos@example.com', role: 'TUTOR', status: 'approved', institution: 'Técnica Nacional' },
    { id: '4', name: 'Elena Gómez', email: 'elena@example.com', role: 'DOCENTE', status: 'suspended', institution: 'Técnica Nacional' },
  ]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-500">Administra el acceso y los roles de la institución.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={18} />
          <span>Invitar Docente</span>
        </button>
      </header>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white cursor-pointer">
              <option>Todos los roles</option>
              <option>DOCENTE</option>
              <option>TUTOR</option>
              <option>ADMIN_INST</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Total: {users.length} usuarios</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="space-y-4">
        <DataTable 
          headers={['Usuario', 'Rol', 'Estado', 'Institución', 'Acciones']}
          data={users}
          renderRow={(user) => (
            <React.Fragment>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'approved' ? 'bg-emerald-500' : 
                    user.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-slate-600 capitalize">{user.status === 'approved' ? 'Aprobado' : user.status === 'pending' ? 'Pendiente' : 'Suspendido'}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {user.institution}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {user.status === 'pending' && (
                    <button className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors" title="Aprobar">
                      <Check size={18} />
                    </button>
                  )}
                  {user.status === 'approved' && (
                    <button className="p-1 rounded-md text-red-600 hover:bg-red-50 transition-colors" title="Suspender">
                      <X size={18} />
                    </button>
                  )}
                  <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </td>
            </React.Fragment>
          )}
        />
      </div>
    </div>
  );
}
