import React, { useState } from 'react';
import { Save, ArrowLeft, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ImprovementsPage() {
  const [students] = useState([
    { id: '1', name: 'Juan Pérez', listNum: 1, initialGrade: 6.5 },
    { id: '2', name: 'María García', listNum: 2, initialGrade: 9.0 },
    { id: '3', name: 'Carlos Ruiz', listNum: 3, initialGrade: 4.0 },
    { id: '4', name: 'Ana López', listNum: 4, initialGrade: 5.5 },
  ]);

  const [improvements, setImprovements] = useState({
    '3': { activity: 'Ensayo de Análisis', improvedGrade: 7.5 },
    '4': { activity: 'Maqueta Correctiva', improvedGrade: 8.0 },
  });

  const calculateFinalGrade = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const imp = improvements[studentId];
    if (!student) return '0.00';
    if (!imp) return student.initialGrade.toFixed(2);
    // Logic: The final grade is the higher of the two or a calculated average based on institutional rules
    // Here we assume the improvement grade replaces the initial if it's higher.
    return Math.max(student.initialGrade, imp.improvedGrade).toFixed(2);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1 cursor-pointer hover:text-primary-600 transition-colors w-fit">
            <ArrowLeft size={14} />
            <span>Volver a Calificaciones</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Evaluación Sumativa y Mejoras</h1>
          <p className="text-slate-500">Gestión de recuperaciones y ajuste de notas sumativas.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save size={18} />
          <span>Guardar Mejoras</span>
        </button>
      </header>

      <div className="glass-card p-6 rounded-2xl bg-amber-50 border-amber-200 flex gap-4 items-start">
        <AlertCircle className="text-amber-600 mt-1" size={20} />
        <div className="text-sm text-amber-800">
          <p className="font-bold">Regla de Mejora Activa:</p>
          <p>Los estudiantes con calificación inferior a 7.0 son elegibles para actividades de mejora. La nota final será la mayor entre la nota inicial y la nota de la actividad de mejora.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">#</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Estudiante</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Nota Inicial</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actividad de Mejora</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Nota Mejora</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center bg-primary-50 text-primary-700">Nota Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const final = calculateFinalGrade(student.id);
              const needsImprovement = student.initialGrade < 7;
              
              return (
                <tr key={student.id} className={`hover:bg-slate-50 transition-colors ${needsImprovement ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm text-center text-slate-400 font-medium">{student.listNum}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700">{student.name}</span>
                  </td>
                  <td className={`px-6 py-4 text-center font-medium ${needsImprovement ? 'text-red-500' : 'text-slate-600'}`}>
                    {student.initialGrade.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder={needsImprovement ? "Asignar actividad..." : "No requiere"}
                      value={improvements[student.id]?.activity || ''}
                      onChange={(e) => setImprovements({
                        ...improvements,
                        [student.id]: { ...improvements[student.id], activity: e.target.value }
                      })}
                      className="w-full px-3 py-1 rounded border border-slate-200 outline-none text-sm"
                      disabled={!needsImprovement}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="number" 
                      step="0.1"
                      value={improvements[student.id]?.improvedGrade || ''}
                      onChange={(e) => setImprovements({
                        ...improvements,
                        [student.id]: { ...improvements[student.id], improvedGrade: parseFloat(e.target.value) }
                      })}
                      className="w-16 px-2 py-1 text-center rounded border border-slate-200 outline-none text-sm"
                      disabled={!needsImprovement}
                    />
                  </td>
                  <td className={`px-6 py-4 text-center font-bold text-sm bg-primary-50 ${parseFloat(final) >= 7 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {final}
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
