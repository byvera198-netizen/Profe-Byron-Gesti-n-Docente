'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, FileText, Download, CheckCircle2, Award } from 'lucide-react';
import Link from 'next/link';
import { docenteService, AnnualRecord } from '@/lib/services/docenteService';

export default function ConsolidadoPage() {
  const [students, setStudents] = useState<AnnualRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await docenteService.getConsolidado();
    setStudents(data);
    setLoading(false);
  };

  const calculateAnnual = (p1: number, p2: number, p3: number): number => {
    return Number(((p1 + p2 + p3) / 3).toFixed(2));
  };

  const getStatus = (avg: number) => {
    if (avg >= 7.0) return { label: 'Promovido' as const, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (avg >= 4.0) return { label: 'Supletorio' as const, color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Reprobado' as const, color: 'bg-red-100 text-red-700 border-red-200' };
  };

  const handleGradeChange = (id: string, period: 'p1' | 'p2' | 'p3', value: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, [period]: value };
      const avg = calculateAnnual(updated.p1, updated.p2, updated.p3);
      const statusInfo = getStatus(avg);
      return {
        ...updated,
        annualAverage: avg,
        status: statusInfo.label,
      };
    }));
  };

  const handleSaveConsolidado = async () => {
    setSaving(true);
    await docenteService.saveConsolidado(students);
    setSaving(false);
    setNotification('¡Consolidado anual guardado y sincronizado exitosamente!');
    setTimeout(() => setNotification(null), 3500);
  };

  const countPromoted = students.filter(s => s.status === 'Promovido').length;
  const countSupletorio = students.filter(s => s.status === 'Supletorio').length;
  const countFailed = students.filter(s => s.status === 'Reprobado').length;

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 text-sm mb-1 hover:text-primary-600 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            <span>Volver al Panel</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Consolidado de Calificaciones</h1>
          <p className="text-slate-500">Integración final de periodos y cálculo oficial del promedio anual.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert('Exportando nómina a formato Excel...')}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            <span>Exportar Excel</span>
          </button>
          <button
            onClick={handleSaveConsolidado}
            disabled={saving || loading}
            className="btn-primary flex items-center gap-2 font-semibold shadow-md shadow-primary-600/20"
          >
            <Save size={18} />
            <span>{saving ? 'Guardando...' : 'Sincronizar Consolidado'}</span>
          </button>
        </div>
      </header>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Summary KPI banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl font-bold text-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Promovidos Directos</p>
            <p className="text-2xl font-bold text-slate-900">{countPromoted} estudiantes</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl font-bold text-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">A Supletorio</p>
            <p className="text-2xl font-bold text-slate-900">{countSupletorio} estudiantes</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl font-bold text-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Reprobados</p>
            <p className="text-2xl font-bold text-slate-900">{countFailed} estudiantes</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Cargando consolidado anual...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 text-center w-16">#</th>
                <th className="px-6 py-4 min-w-[200px]">Estudiante</th>
                <th className="px-6 py-4 text-center">I Período (33%)</th>
                <th className="px-6 py-4 text-center">II Período (33%)</th>
                <th className="px-6 py-4 text-center">III Período (34%)</th>
                <th className="px-6 py-4 text-center bg-primary-50 text-primary-700">Promedio Anual</th>
                <th className="px-6 py-4 text-center">Estado Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const statusInfo = getStatus(student.annualAverage);

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-center text-sm text-slate-400 font-medium">{student.listNum}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{student.studentName}</td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={student.p1}
                        onChange={(e) => handleGradeChange(student.id, 'p1', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 text-sm font-semibold"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={student.p2}
                        onChange={(e) => handleGradeChange(student.id, 'p2', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 text-sm font-semibold"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={student.p3}
                        onChange={(e) => handleGradeChange(student.id, 'p3', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 text-sm font-semibold"
                      />
                    </td>
                    <td className={`px-6 py-4 text-center font-black text-sm bg-primary-50/50 ${student.annualAverage >= 7.0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {student.annualAverage.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
