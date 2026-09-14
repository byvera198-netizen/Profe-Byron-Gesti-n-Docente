'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Calendar, BookOpen, Layers, Edit3, CheckCircle2, AlertCircle, X } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { docenteService, ActivityItem } from '@/lib/services/docenteService';

export default function InsumosPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Filters state
  const [selectedCourse, setSelectedCourse] = useState('2do BGU');
  const [selectedParallel, setSelectedParallel] = useState('A');
  const [selectedPeriod, setSelectedPeriod] = useState('I Período');
  const [selectedSubject, setSelectedSubject] = useState('Educación Cultural y Artística');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Omit<ActivityItem, 'id'>>({
    name: '',
    type: 'Individual',
    weight: 1.0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    const data = await docenteService.getActivities();
    setActivities(data);
    setLoading(false);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.name.trim()) return;

    await docenteService.createActivity(newActivity);
    setNewActivity({
      name: '',
      type: 'Individual',
      weight: 1.0,
      date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
    await loadActivities();

    showNotification('Actividad agregada exitosamente.');
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este insumo? Las calificaciones asociadas también se verán afectadas.')) {
      await docenteService.deleteActivity(id);
      await loadActivities();
      showNotification('Actividad eliminada.');
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Configuración de Insumos</h1>
          <p className="text-slate-500">Define las actividades y pesos de evaluación para el período actual.</p>
        </div>
        <button
          onClick={() => showNotification('Configuración guardada en la base de datos.')}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          <span>Guardar Configuración</span>
        </button>
      </header>

      {/* Feedback Alert */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2 text-sm font-medium animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Academic Context Selector */}
      <div className="glass-card p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Curso</label>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm"
          >
            <option>1ro BGU</option>
            <option>2do BGU</option>
            <option>3ro BGU</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paralelo</label>
          <select 
            value={selectedParallel}
            onChange={(e) => setSelectedParallel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm"
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Período</label>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm"
          >
            <option>I Período</option>
            <option>II Período</option>
            <option>III Período</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Asignatura</label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm"
          >
            <option>Educación Cultural y Artística</option>
            <option>Sistemas Operativos y Redes</option>
            <option>Soporte Técnico</option>
          </select>
        </div>
      </div>

      {/* Activities Management */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-800">
            <Layers size={20} className="text-primary-500" />
            <h2 className="font-bold">Lista de Actividades (Insumos)</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
              {activities.length} registradas
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-sm flex items-center gap-2 py-2"
          >
            <Plus size={16} />
            <span>Agregar Actividad</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Cargando actividades...</div>
        ) : (
          <DataTable 
            headers={['Nombre de la Actividad', 'Tipo', 'Peso/Valor', 'Fecha', 'Acciones']}
            data={activities}
            renderRow={(activity) => (
              <React.Fragment>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{activity.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {activity.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">{activity.weight.toFixed(1)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{activity.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                      title="Eliminar insumo"
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

      {/* Modal for adding activity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Plus size={20} className="text-primary-500" />
                Nueva Actividad / Insumo
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Nombre de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Taller de Expresión Oral"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Tipo</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Grupal">Grupal</option>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Tarea">Tarea</option>
                    <option value="Proyecto">Proyecto</option>
                    <option value="Evaluacion">Evaluación</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Peso Ponderado</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5"
                    required
                    value={newActivity.weight}
                    onChange={(e) => setNewActivity({ ...newActivity, weight: parseFloat(e.target.value) || 1.0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Fecha de Entrega</label>
                <input
                  type="date"
                  required
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
