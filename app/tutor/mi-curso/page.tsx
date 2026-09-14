'use client';

import React, { useState, useEffect } from 'react';
import { Users, TrendingDown, TrendingUp, FileText, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { tutorService, CourseOverview, SubjectPerformance, CriticalStudent } from '@/lib/services/tutorService';

export default function TutorDashboard() {
  const [overview, setOverview] = useState<CourseOverview | null>(null);
  const [subjects, setSubjects] = useState<SubjectPerformance[]>([]);
  const [criticalStudents, setCriticalStudents] = useState<CriticalStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ov, subs, crit] = await Promise.all([
      tutorService.getCourseOverview(),
      tutorService.getSubjectPerformances(),
      tutorService.getCriticalStudents(),
    ]);

    setOverview(ov);
    setSubjects(subs);
    setCriticalStudents(crit);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Panel de Tutoría</h1>
          <p className="text-slate-500">Vista consolidada y monitoreo académico de {overview?.name} - Paralelo {overview?.parallel}.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/tutor/rendimiento" className="btn-secondary flex items-center gap-2">
            <FileText size={18} />
            <span className="text-sm">Rendimiento Detallado</span>
          </Link>
          <Link href="/tutor/junta" className="btn-primary flex items-center gap-2 shadow-md shadow-primary-600/20">
            <Users size={18} />
            <span className="text-sm">Convocar a Junta</span>
          </Link>
        </div>
      </header>

      {/* Course Overview KPIs */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-primary-500">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Estudiantes Matriculados</p>
              <p className="text-2xl font-bold text-slate-900">{overview.studentsCount}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-indigo-500">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Docentes del Curso</p>
              <p className="text-2xl font-bold text-slate-900">{overview.teachersCount}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Promedio del Curso</p>
              <p className="text-2xl font-bold text-slate-900">{overview.avgGrade}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-amber-500">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Alumnos en Riesgo</p>
              <p className="text-2xl font-bold text-slate-900">{overview.studentsAtRiskCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Performance Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-primary-500" size={20} />
                Rendimiento por Asignatura
              </h2>
              <span className="text-xs font-medium text-slate-400">Año Lectivo 2026-2027</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Asignatura</th>
                    <th className="px-6 py-4">Docente</th>
                    <th className="px-6 py-4 text-center">Promedio</th>
                    <th className="px-6 py-4 text-center">Riesgo</th>
                    <th className="px-6 py-4 text-center">Semáforo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((item, i) => (
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
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'success' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                          item.status === 'warning' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {item.status === 'success' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                          <span>{item.status === 'success' ? 'Estable' : item.status === 'warning' ? 'Atención' : 'Crítico'}</span>
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
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingDown className="text-red-500" size={20} />
              <h2 className="font-bold text-slate-800">Casos de Atención Prioritaria</h2>
            </div>
            <div className="space-y-3">
              {criticalStudents.map((student, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between hover:border-red-200 transition-all">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.subjectsFailed} materias deficientes • Prom: {student.avg}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${student.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {student.status === 'critical' ? 'Crítico' : 'Atención'}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/tutor/junta"
              className="w-full mt-4 py-2.5 rounded-xl border-2 border-dashed border-primary-300 text-primary-600 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary-50 transition-all"
            >
              <span>Tratar casos en Junta de Curso</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
