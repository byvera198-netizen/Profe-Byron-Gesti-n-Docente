import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, Save, ArrowRight } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function AdminCourses() {
  const [courses, setCourses] = useState([
    { id: '1', name: '1.º BGU', level: 'BGU', parallels: ['A', 'B'] },
    { id: '2', name: '2.º BGU', level: 'BGU', parallels: ['A', 'B', 'C'] },
    { id: '3', name: '3.º BGU', level: 'BGU', parallels: ['A'] },
  ]);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Estructura Académica</h1>
          <p className="text-slate-500">Configura los cursos y paralelos de la institución.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Nuevo Curso</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 rounded-2xl flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar curso..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none"
              />
            </div>
          </div>

          <DataTable 
            headers={['Curso', 'Nivel', 'Paralelos', 'Acciones']}
            data={courses}
            renderRow={(course) => (
              <React.Fragment>
                <td className="px-6 py-4 font-bold text-slate-800">{course.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{course.level}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {course.parallels.map(p => (
                      <span key={p} className="px-2 py-1 rounded bg-primary-100 text-primary-700 text-[10px] font-bold border border-primary-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 transition-colors"><Edit3 size={16} /></button>
                    <button className="p-1 rounded-md text-red-400 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </React.Fragment>
            )}
          />
        </div>

        {/* Quick Edit Panel */}
        <div className="glass-card p-6 rounded-2xl h-fit space-y-6 sticky top-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Edit3 size={18} className="text-primary-500" />
            Gestionar Paralelos
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Curso Seleccionado</p>
              <p className="text-sm font-bold text-slate-700">2.º BGU</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">Agregar Paralelo</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ej: D" 
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                />
                <button className="btn-primary px-3 py-2"><Plus size={18} /></button>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <Save size={18} />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
