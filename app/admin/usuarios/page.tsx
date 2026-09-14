'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Search, Filter, Check, X, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { adminService, UserAdminItem } from '@/lib/services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos los roles');
  const [notification, setNotification] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'DOCENTE' as UserAdminItem['role'],
    institution: 'Técnica Nacional',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await adminService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    await adminService.inviteUser(newUser);
    await loadUsers();
    setIsModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'DOCENTE',
      institution: 'Técnica Nacional',
    });
    setNotification('¡Invitación enviada y usuario registrado!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'suspended') => {
    const updated = await adminService.updateUserStatus(id, status);
    setUsers(updated);
    setNotification(`Estado de usuario actualizado a: ${status === 'approved' ? 'Aprobado' : 'Suspendido'}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('¿Estás seguro de revocar el acceso y eliminar este usuario?')) {
      const updated = await adminService.deleteUser(id);
      setUsers(updated);
      setNotification('Usuario eliminado del sistema.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Todos los roles' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-500">Administra el acceso, roles (RBAC) y estados de los miembros institucionales.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-md shadow-primary-600/20 font-semibold"
        >
          <UserPlus size={18} />
          <span>Invitar Docente / Usuario</span>
        </button>
      </header>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white cursor-pointer text-sm"
            >
              <option>Todos los roles</option>
              <option>DOCENTE</option>
              <option>TUTOR</option>
              <option>DIRECTIVO</option>
              <option>ADMIN_INST</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span>Total: {filtered.length} usuarios</span>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Cargando directorio de usuarios...</div>
      ) : (
        <DataTable 
          headers={['Usuario', 'Rol', 'Estado', 'Institución', 'Acciones']}
          data={filtered}
          renderRow={(user) => (
            <React.Fragment>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'approved' ? 'bg-emerald-500' : 
                    user.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <span className="text-xs font-semibold text-slate-700 capitalize">
                    {user.status === 'approved' ? 'Aprobado' : user.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                {user.institution}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1.5">
                  {user.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(user.id, 'approved')}
                      className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Aprobar Acceso"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {user.status === 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(user.id, 'suspended')}
                      className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Suspender Acceso"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                    title="Eliminar usuario"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </React.Fragment>
          )}
        />
      )}

      {/* Modal Invitar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <UserPlus size={20} className="text-primary-500" />
                Invitar Nuevo Usuario
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lic. Mariana Torres"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Correo Institucional</label>
                <input
                  type="email"
                  required
                  placeholder="mariana.torres@colegio.edu.ec"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Rol Institucional</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm bg-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="DOCENTE">Docente</option>
                  <option value="TUTOR">Docente Tutor</option>
                  <option value="DIRECTIVO">Directivo / Vicerrector</option>
                  <option value="ADMIN_INST">Administrador Institucional</option>
                  <option value="SECRETARIO">Secretaría General</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2 text-sm font-semibold"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
