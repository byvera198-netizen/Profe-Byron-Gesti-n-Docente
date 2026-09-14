'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { docenteService, ActivityItem, StudentItem } from '@/lib/services/docenteService';

export default function GradesPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fetchedStudents, fetchedActivities, fetchedGrades] = await Promise.all([
      docenteService.getStudents(),
      docenteService.getActivities(),
      docenteService.getGrades(),
    ]);

    setStudents(fetchedStudents);
    setActivities(fetchedActivities);
    setGrades(fetchedGrades);
    setLoading(false);
  };

  const calculateAverage = (studentId: string): string => {
    let totalPoints = 0;
    let totalWeight = 0;

    activities.forEach((act) => {
      const val = grades[`${studentId}_${act.id}`];
      if (val !== undefined && !isNaN(val)) {
        totalPoints += val * act.weight;
        totalWeight += act.weight;
      }
    });

    return totalWeight === 0 ? '0.00' : (totalPoints / totalWeight).toFixed(2);
  };

  const getStatusColor = (avg: string) => {
    const val = parseFloat(avg);
    if (val >= 7) return 'text-emerald-600';
    if (val >= 4) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleGradeChange = (studentId: string, activityId: string, rawVal: string) => {
    const val = rawVal === '' ? 0 : parseFloat(rawVal);
    const clampedVal = Math.min(10, Math.max(0, isNaN(val) ? 0 : val));

    setGrades((prev) => ({
      ...prev,
      [`${studentId}_${activityId}`]: clampedVal,
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await docenteService.saveGrades(grades);
    setSaving(false);
    setNotification('¡Calificaciones guardadas exitosamente!');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <Link
            href="/docente/insumos"
            className="flex items-center gap-2 text-slate-400 text-sm mb-1 hover:text-primary-600 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            <span>Volver a Insumos</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Registro de Calificaciones</h1>
          <p className="text-slate-500">Ingrese las notas de los insumos formativos y sumativos.</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving || loading}
          className="btn-primary flex items-center gap-2 font-semibold shadow-md shadow-primary-600/20"
        >
          <Save size={18} />
          <span>{saving ? 'Guardando...' : 'Guardar Calificaciones'}</span>
        </button>
      </header>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Academic context bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-6 items-center justify-between">
        <div className="flex gap-6 items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Curso:</span>
            <span className="font-bold text-slate-700">2do BGU - A</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Asignatura:</span>
            <span className="font-bold text-slate-700">Educación Cultural y Artística</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Período:</span>
            <span className="font-bold text-slate-700">I Período</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Aprobado (&ge; 7)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">Atención (4.00 - 6.99)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-600 font-medium">Crítico (&lt; 4.00)</span>
          </div>
        </div>
      </div>

      {/* Grades Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Cargando matriz de calificaciones...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Estudiante</th>
                {activities.map((act) => (
                  <th key={act.id} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                    <div className="flex flex-col">
                      <span className="text-slate-800">{act.name}</span>
                      <span className="text-[10px] font-normal text-slate-400">Peso: {act.weight.toFixed(1)}</span>
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
                      <span className="text-sm font-bold text-slate-800">{student.name}</span>
                    </td>
                    {activities.map((act) => (
                      <td key={act.id} className="px-6 py-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={grades[`${student.id}_${act.id}`] !== undefined ? grades[`${student.id}_${act.id}`] : ''}
                          onChange={(e) => handleGradeChange(student.id, act.id, e.target.value)}
                          className="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all font-semibold"
                        />
                      </td>
                    ))}
                    <td className={`px-6 py-4 text-center font-black text-sm bg-primary-50/50 ${getStatusColor(avg)}`}>
                      {avg}
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
