import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle2, TrendingUp, ArrowLeft } from 'lucide-react';

export default function GradesPage() {
  const [students] = useState([
    { id: '1', name: 'Juan Pérez', listNum: 1 },
    { id: '2', name: 'María García', listNum: 2 },
    { id: '3', name: 'Carlos Ruiz', listNum: 3 },
    { id: '4', name: 'Ana López', listNum: 4 },
    { id: '5', name: 'Luis Torres', listNum: 5 },
  ]);

  const [activities] = useState([
    { id: 'a1', name: 'Taller 1', weight: 1.0 },
    { id: 'a2', name: 'Proyecto', weight: 1.5 },
    { id: 'a3', name: 'Evaluación', weight: 2.0 },
  ]);

  // Grade state: { studentId_activityId: value }
  const [grades, setGrades] = useState({
    '1_a1': 8.5, '1_a2': 9.0, '1_a3': 7.0,
    '2_a1': 10.0, '2_a2': 9.5, '2_a3': 9.0,
    '3_a1': 6.0, '3_a2': 5.5, '3_a3': 4.0,
    '4_a1': 7.0, '4_a2': 8.0, '4_a3': 6.5,
    '5_a1': 9.0, '5_a2': 7.0, '5_a3': 8.0,
  });

  const calculateAverage = (studentId: string) => {
    let totalPoints = 0;
    let totalWeight = 0;
    activities.forEach(act => {
      const val = grades[`${studentId}_${act.id}`] || 0;
      totalPoints += val * act.weight;
      totalWeight += act.weight;
    });
    return totalWeight === 0 ? 0 : (totalPoints / totalWeight).toFixed(2);
  };

  const getStatusColor = (avg: string) => {
    const val = parseFloat(avg);
    if (val >= 7) return 'text-emerald-600';
    if (val >= 4) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1 cursor-pointer hover:text-primary-600 transition-colors w-fit">
            <ArrowLeft size={14} />
            <span>Volver a Insumos</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Registro de Calificaciones</h1>
          <p className="text-slate-500">Ingrese las notas de los insumos formativos y sumativos.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save size={18} />
          <span>Guardar Calificaciones</span>
        </button>
      </header>

      {/* Academic context bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-6 items-center justify-between">
        <div className="flex gap-6 items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Curso:</span>
            <span className="font-bold text-slate-700">2do BGU - A</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Asignatura:</span>
            <span className="font-bold text-slate-700">ECA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Período:</span>
            <span className="font-bold text-slate-700">I Período</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Aprobado (&ge;7)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-500">Atención (4-6.9)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-500">Crítico (&lt;4)</span>
          </div>
        </div>
      </div>

      {/* Grades Grid */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">#</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Estudiante</th>
              {activities.map(act => (
                <th key={act.id} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  <div className="flex flex-col">
                    <span>{act.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">Peso: {act.weight}</span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center bg-primary-50 text-primary-700">
                Promedio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const avg = calculateAverage(student.id);
              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-center text-slate-400 font-medium">{student.listNum}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700">{student.name}</span>
                  </td>
                  {activities.map(act => (
                    <td key={act.id} className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        step="0.1"
                        min="0" 
                        max="10"
                        value={grades[`${student.id}_${act.id}`] || ''}
                        onChange={(e) => setGrades({
                          ...grades,
                          [`${student.id}_${act.id}`]: parseFloat(e.target.value)
                        })}
                        className="w-16 px-2 py-1 text-center rounded border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
                      />
                    </td>
                  ))}
                  <td className={`px-6 py-4 text-center font-bold text-sm bg-primary-50 ${getStatusColor(avg)}`}>
                    {avg}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
