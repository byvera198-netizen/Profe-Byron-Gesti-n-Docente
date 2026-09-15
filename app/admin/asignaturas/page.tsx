'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, BookOpen, X, CheckCircle2 } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { adminService, SubjectAdminItem } from '@/lib/services/adminService';

export default function AdminAsignaturasPage() {
  const [subjects, setSubjects] = useState<SubjectAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    area: 'Ciencias Exactas',
    level: 'BGU',
    weeklyHours: 4,
    teachersCount: 1,
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    const data = await adminService.getSubjects();
    setSubjects(data);
    setLoading(false);
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    await adminService.createSubject(formData);
    setFormData({
      code: '',
      name: '',
      area: 'Ciencias Exactas',
      level: 'BGU',
      weeklyHours: 4,
      teachersCount: 1,
    });
    setShowModal(false);
    showToast('Asignatura creada y añadida a la malla curricular exitosamente');
    await loadSubjects();
  };

  const handleDeleteSubject = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta asignatura de la malla?')) {
      await adminService.deleteSubject(id);
      showToast('Asignatura eliminada del catálogo');
      await loadSubjects();
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'Todas' || s.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Malla Curricular y Asignaturas</h1>
          <p className="text-slate-500">Gestión del catálogo de asignaturas institucionales y carga horaria.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={18} />
          <span>Nueva Asignatura</span>
        </button>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar asignatura por código o nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
            />
          </div>
          <select 
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer text-sm"
          >
            <option value="Todas">Todas las áreas</option>
            <option value="Ciencias Exactas">Ciencias Exactas</option>
            <option value="Lenguaje y Comunicación">Lenguaje y Comunicación</option>
            <option value="Artes y Humanidades">Artes y Humanidades</option>
            <option value="Ciencias Naturales">Ciencias Naturales</option>
            <option value="Lenguas Extranjeras">Lenguas Extranjeras</option>
            <option value="Técnica Informática">Técnica Informática</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total: {filtered.length} asignaturas
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Cargando malla curricular...</div>
      ) : (
        <DataTable 
          headers={['Código', 'Asignatura', 'Área de Conocimiento', 'Nivel', 'Horas/Sem', 'Docentes', 'Acciones']}
          data={filtered}
          renderRow={(subject) => (
            <React.Fragment>
              <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{subject.code}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary-500" />
                  <span className="font-bold text-sm text-slate-800">{subject.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{subject.area}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded border border-slate-200">
                  {subject.level}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-700">{subject.weeklyHours}h</td>
              <td className="px-6 py-4 text-sm text-slate-600">{subject.teachersCount} asignados</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-1 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Eliminar asignatura"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </React.Fragment>
          )}
        />
      )}

      {/* Modal Nueva Asignatura */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Agregar Nueva Asignatura</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Código</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. MAT-02"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Horas Semanales</label>
                  <input 
                    type="number"
                    min="1"
                    max="15"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Nombre de la Asignatura</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Programación Orientada a Objetos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Área de Conocimiento</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Ciencias Exactas">Ciencias Exactas</option>
                  <option value="Lenguaje y Comunicación">Lenguaje y Comunicación</option>
                  <option value="Artes y Humanidades">Artes y Humanidades</option>
                  <option value="Ciencias Naturales">Ciencias Naturales</option>
                  <option value="Lenguas Extranjeras">Lenguas Extranjeras</option>
                  <option value="Técnica Informática">Técnica Informática</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Nivel Educativo</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Básica Superior">Básica Superior</option>
                  <option value="BGU">BGU (Bachillerato General)</option>
                  <option value="BT Informática">BT Informática</option>
                  <option value="BT Contabilidad">BT Contabilidad</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/20"
                >
                  Crear Asignatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
