'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, Save, X, CheckCircle2, Layers } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { adminService, CourseAdminItem } from '@/lib/services/adminService';

export default function AdminCourses() {
  const [courses, setCourses] = useState<CourseAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseAdminItem | null>(null);
  const [newParallelName, setNewParallelName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState('BGU');
  const [newCourseParallels, setNewCourseParallels] = useState('A, B');

  const loadCourses = async () => {
    setLoading(true);
    const data = await adminService.getCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    adminService.getCourses().then((data) => {
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0]);
      }
      setLoading(false);
    });
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const parallelsArray = newCourseParallels
      .split(',')
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0);

    const created = await adminService.createCourse(newCourseName, newCourseLevel, parallelsArray);
    await loadCourses();
    setSelectedCourse(created);
    setIsModalOpen(false);
    setNewCourseName('');
    setNotification('¡Nuevo curso agregado a la estructura institucional!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddParallel = async () => {
    if (!selectedCourse || !newParallelName.trim()) return;

    const letter = newParallelName.trim().toUpperCase();
    const updated = await adminService.addParallel(selectedCourse.id, letter);
    setCourses(updated);
    const refreshedSelected = updated.find(c => c.id === selectedCourse.id);
    if (refreshedSelected) {
      setSelectedCourse(refreshedSelected);
    }
    setNewParallelName('');
    setNotification(`¡Paralelo ${letter} añadido a ${selectedCourse.name}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este curso y todos sus paralelos asociados?')) {
      const updated = await adminService.deleteCourse(id);
      setCourses(updated);
      if (selectedCourse?.id === id) {
        setSelectedCourse(updated[0] || null);
      }
      setNotification('Curso eliminado de la estructura.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Estructura Académica</h1>
          <p className="text-slate-500">Configura los cursos, niveles y paralelos de la institución.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-md shadow-primary-600/20 font-semibold"
        >
          <Plus size={18} />
          <span>Nuevo Curso</span>
        </button>
      </header>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 rounded-2xl flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar curso o nivel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {filtered.length} cursos
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Cargando cursos...</div>
          ) : (
            <DataTable 
              headers={['Curso', 'Nivel', 'Paralelos Activos', 'Acciones']}
              data={filtered}
              renderRow={(course) => (
                <React.Fragment>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="hover:text-primary-600 transition-colors text-left"
                    >
                      {course.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{course.level}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {course.parallels.map(p => (
                        <span key={p} className="px-2 py-0.5 rounded bg-primary-100 text-primary-800 text-xs font-bold border border-primary-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="p-1.5 rounded-md text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Gestionar paralelos"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        title="Eliminar curso"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </React.Fragment>
              )}
            />
          )}
        </div>

        {/* Quick Edit Panel */}
        <div className="glass-card p-6 rounded-2xl h-fit space-y-6 sticky top-8 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Edit3 size={18} className="text-primary-500" />
            Gestionar Paralelos
          </h3>
          {selectedCourse ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase">Curso Seleccionado</p>
                <p className="text-base font-extrabold text-slate-800">{selectedCourse.name}</p>
                <p className="text-xs text-slate-500">{selectedCourse.level}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase">Paralelos Actuales:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.parallels.map(p => (
                    <span key={p} className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                      Paralelo {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-medium text-slate-600">Agregar Nuevo Paralelo</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ej: D" 
                    maxLength={2}
                    value={newParallelName}
                    onChange={(e) => setNewParallelName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm uppercase font-bold"
                  />
                  <button
                    onClick={handleAddParallel}
                    disabled={!newParallelName.trim()}
                    className="btn-primary px-4 py-2"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Selecciona un curso para gestionar sus paralelos.</p>
          )}
        </div>
      </div>

      {/* Modal Nuevo Curso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Plus size={20} className="text-primary-500" />
                Registrar Nuevo Curso
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Nombre del Curso</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1.º Bachillerato Técnico"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Nivel Educativo</label>
                <select
                  value={newCourseLevel}
                  onChange={(e) => setNewCourseLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                >
                  <option value="BGU">Bachillerato General Unificado (BGU)</option>
                  <option value="BT">Bachillerato Técnico (BT)</option>
                  <option value="EGB Superior">EGB Superior (8vo - 10mo)</option>
                  <option value="EGB Media">EGB Media (5to - 7mo)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Paralelos Iniciales (separados por coma)</label>
                <input
                  type="text"
                  required
                  placeholder="A, B, C"
                  value={newCourseParallels}
                  onChange={(e) => setNewCourseParallels(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm font-mono uppercase"
                />
              </div>

              <div className="flex gap-3 pt-3">
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
                  Guardar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
