import React, { useState } from 'react';
import { Plus, Trash2, Save, Calendar, BookOpen, Layers } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function InsumosPage() {
  const [activities, setActivities] = useState([
    { id: '1', name: 'Taller de Composición', type: 'Individual', weight: 1.0, date: '2026-10-12' },
    { id: '2', name: 'Proyecto Artístico Grupal', type: 'Grupal', weight: 1.5, date: '2026-10-25' },
    { id: '3', name: 'Examen Trimestral', type: 'Evaluacion', weight: 2.0, date: '2026-11-05' },
  ]);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Configuración de Insumos</h1>
          <p className="text-slate-500">Define las actividades y pesos para el periodo actual.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save size={18} />
          <span>Guardar Configuración</span>
        </button>
      </header>

      {/* Academic Context Selector */}
      <div className="glass-card p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Curso</label>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm">
            <option>2do BGU</option>
            <option>3ro BGU</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paralelo</label>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Período</label>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm">
            <option>I Período</option>
            <option>II Período</option>
            <option>III Período</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Asignatura</label>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm">
            <option>Educación Cultural y Artística</option>
            <option>Sistemas Operativos</option>
          </select>
        </div>
      </div>

      {/* Activities Management */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-800">
            <Layers size={20} className="text-primary-500" />
            <h2 className="font-bold">Lista de Actividades (Insumos)</h2>
          </div>
          <button className="btn-secondary text-sm flex items-center gap-2 py-1.5">
            <Plus size={16} />
            <span>Agregar Actividad</span>
          </button>
        </div>

        <DataTable 
          headers={['Nombre de la Actividad', 'Tipo', 'Peso/Valor', 'Fecha', 'Acciones']}
          data={activities}
          renderRow={(activity) => (
            <React.Fragment>
              <td className="px-6 py-4 text-sm font-medium text-slate-800">{activity.name}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {activity.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{activity.weight}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{activity.date}</td>
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
    </div>
  );
}

function Edit3(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
}
