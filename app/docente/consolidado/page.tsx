import React from 'react';
import { Save, ArrowLeft, FileText, Download, AlertTriangle } from 'lucide-react';

export default function ConsolidadoPage() {
  const students = [
    { id: '1', name: 'Juan Pérez', listNum: 1, p1: 7.5, p2: 8.0, p3: 7.0 },
    { id: '2', name: 'María García', listNum: 2, p1: 9.5, p2: 9.0, p3: 9.8 },
    { id: '3', name: 'Carlos Ruiz', listNum: 3, p1: 4.0, p2: 5.0, p3: 4.5 },
    { id: '4', name: 'Ana López', listNum: 4, p1: 6.5, p2: 7.0, p3: 6.0 },
    { id: '5', name: 'Luis Torres', listNum: 5, p1: 8.0, p2: 8.5, p3: 8.0 },
  ];

  const calculateAnnual = (p1: number, p2: number, p3: number) => {
    return ((p1 + p2 + p3) / 3).toFixed(2);
  };

  const getStatus = (avg: string) => {
    const val = parseFloat(avg);
    if (val >= 7) return { label: 'Promovido', color: 'bg-emerald-100 text-emerald-700' };
    if (val >= 4) return { label: 'Supletorio', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Reprobado', color: 'bg-red-100 text-red-700' };
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1 cursor-pointer hover:text-primary-600 transition-colors w-fit">
            <ArrowLeft size={14} />
            <span>Volver al Panel Docente</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Consolidado de Calificaciones</h1>
          <p className="text-slate-500">Integración final de periodos y cálculo de promedio anual.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>Exportar Excel</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FileText size={18} />
            <span>Generar PDF Final</span>
          </button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 text-center w-16">#</th>
              <th className="px-6 py-4 min-w-[200px]">Estudiante</th>
              <th className="px-6 py-4 text-center">I Período</th>
              <th className="px-6 py-4 text-center">II Período</th>
              <th className="px-6 py-4 text-center">III Período</th>
              <th className="px-6 py-4 text-center bg-primary-50 text-primary-700">Promedio Anual</th>
              <th className="px-6 py-4 text-center">Estado Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const annual = calculateAnnual(student.p1, student.p2, student.p3);
              const status = getStatus(annual);
              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-center text-sm text-slate-400 font-medium">{student.listNum}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{student.name}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{student.p1.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{student.p2.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{student.p3.toFixed(2)}</td>
                  <td className={`px-6 py-4 text-center font-bold text-sm bg-primary-50 ${parseFloat(annual) >= 7 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {annual}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${status.color}`}>
                      {status.label}
                    </span>
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
