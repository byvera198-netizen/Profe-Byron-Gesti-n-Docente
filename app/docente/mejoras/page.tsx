'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { docenteService, SummativeItem } from '@/lib/services/docenteService';

export default function ImprovementsPage() {
  const [items, setItems] = useState<SummativeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await docenteService.getImprovements();
    setItems(data);
    setLoading(false);
  };

  const handleFieldChange = (id: string, field: 'activity' | 'improvedGrade', value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      // Regla: la nota final es el mayor entre nota inicial y nota de mejora
      const final = Math.max(updated.initialGrade, updated.improvedGrade || 0);
      return { ...updated, finalGrade: final };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await docenteService.saveImprovements(items);
    setSaving(false);
    setNotification('¡Plan de mejoras y recuperaciones actualizado exitosamente!');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <Link
            href="/docente/calificaciones"
            className="flex items-center gap-2 text-slate-400 text-sm mb-1 hover:text-primary-600 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            <span>Volver a Calificaciones</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Evaluación Sumativa y Mejoras</h1>
          <p className="text-slate-500">Gestión de recuperaciones y ajuste de notas según normativa de evaluación formativa.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="btn-primary flex items-center gap-2 font-semibold shadow-md shadow-primary-600/20"
        >
          <Save size={18} />
          <span>{saving ? 'Guardando...' : 'Guardar Mejoras'}</span>
        </button>
      </header>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Normative Alert */}
      <div className="glass-card p-6 rounded-2xl bg-amber-50/70 border-amber-200 flex gap-4 items-start">
        <AlertCircle className="text-amber-600 mt-1 flex-shrink-0" size={20} />
        <div className="text-sm text-amber-900 space-y-1">
          <p className="font-bold">Regla de Acompañamiento y Refuerzo Académico:</p>
          <p className="text-amber-800 text-xs leading-relaxed">
            Los estudiantes con calificación inferior a <strong>7.00</strong> son automáticamente elegibles para actividades de mejora y refuerzo pedagógico. La nota final registrada corresponderá a la calificación más alta obtenida entre la evaluación original y la actividad de mejora.
          </p>
        </div>
      </div>

      {/* Improvements Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Cargando registros de recuperación...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Estudiante</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Nota Inicial</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actividad de Refuerzo / Mejora</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Nota Mejora</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center bg-primary-50 text-primary-700">Nota Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const needsImprovement = item.initialGrade < 7.0;

                return (
                  <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${needsImprovement ? 'bg-amber-50/20' : ''}`}>
                    <td className="px-6 py-4 text-sm text-center text-slate-400 font-medium">{item.listNum}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">{item.studentName}</span>
                    </td>
                    <td className={`px-6 py-4 text-center font-bold text-sm ${needsImprovement ? 'text-red-500' : 'text-slate-700'}`}>
                      {item.initialGrade.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder={needsImprovement ? "Asignar actividad de mejora..." : "No requiere"}
                        value={item.activity}
                        onChange={(e) => handleFieldChange(item.id, 'activity', e.target.value)}
                        disabled={!needsImprovement}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="0.0"
                        value={item.improvedGrade > 0 ? item.improvedGrade : ''}
                        onChange={(e) => handleFieldChange(item.id, 'improvedGrade', parseFloat(e.target.value) || 0)}
                        disabled={!needsImprovement}
                        className="w-16 px-2 py-1.5 text-center rounded-lg border border-slate-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </td>
                    <td className={`px-6 py-4 text-center font-black text-sm bg-primary-50/50 ${item.finalGrade >= 7.0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.finalGrade.toFixed(2)}
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
