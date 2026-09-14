import React from 'react';
import { Users, TrendingDown, TrendingUp, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TutorDashboard() {
  const courseInfo = {
    name: '2do BGU',
    parallel: 'A',
    studentsCount: 32,
    teachersCount: 8,
    avgGrade: '7.45'
  };

  const subjectPerformance = [
    { subject: 'Matemáticas', teacher: 'Lic. Ana Pérez', avg: '6.2', status: 'warning', riskStudents: 5 },
    { subject: 'Lengua y Lit.', teacher: 'Lic. Luis Mora', avg: '8.1', status: 'success', riskStudents: 2 },
    { subject: 'ECA', teacher: 'Lic. Byron Vera', avg: '7.8', status: 'success', riskStudents: 3 },
    { subject: 'Física', teacher: 'Lic. Marta Solís', avg: '5.4', status: 'critical', riskStudents: 12 },
    { subject: 'Inglés', teacher: 'Lic. John Doe', avg: '7.1', status: 'success', riskStudents: 4 },
  ];

  const criticalStudents = [
    { name: 'Carlos Ruiz', subjectsFailed: 3, avg: '4.2', status: 'critical' },
    { name: 'Ana López', subjectsFailed: 2, avg: '5.8', status: 'warning' },
    { name: 'Juan Pérez', subjectsFailed: 1, avg: '6.1', status: 'warning' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Panel de Tutoría</h1>
          <p className="text-slate-500">Vista consolidada del rendimiento académico del curso.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FileText size={18} />
            <span className="text-sm">Generar Reporte de Curso</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Users size={18} />
            <span className="text-sm">Convocar a Junta</span>
          </button>
        </div>
      </header>

      {/* Course Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-primary-500">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Estudiantes</p>
            <p className="text-2xl font-bold text-slate-900">{courseInfo.studentsCount}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-indigo-500">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Docentes</p>
            <p className="text-2xl font-bold text-slate-900">{courseInfo.teachersCount}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Promedio General</p>
            <p className="text-2xl font-bold text-slate-900">{courseInfo.avgGrade}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><AlertCircle size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Alumnos en Riesgo</p>
            <p className="text-2xl font-bold text-slate-900">14</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Performance Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-primary-500" size={20} />
                Rendimiento por Asignatura
              </h2>
              <span className="text-xs font-medium text-slate-400">Actualizado hace 2 horas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Asignatura</th>
                    <th className="px-6 py-4">Docente</th>
                    <th className="px-6 py-4 text-center">Promedio</th>
                    <th className="px-6 py-4 text-center">Riesgo</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjectPerformance.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{item.subject}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.teacher}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">{item.avg}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">
                          {item.riskStudents} est.
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'success' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                          {item.status === 'success' ? 'Estable' : item.status === 'warning' ? 'Atención' : 'Crítico'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Critical Students Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="text-red-500" size={20} />
              <h2 className="font-bold text-slate-800">Alumnos Críticos</h2>
            </div>
            <div className="space-y-4">
              {criticalStudents.map((student, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between group hover:border-red-200 transition-all">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.subjectsFailed} materias deficientes • Avg: {student.avg}</p>
                  </div>
                  <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 group-hover:text-primary-600 transition-colors">
                    <FileText size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:border-primary-300 hover:text-primary-600 transition-all">
              Ver listado completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
