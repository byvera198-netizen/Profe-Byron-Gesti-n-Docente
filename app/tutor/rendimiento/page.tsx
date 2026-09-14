'use client';

import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Users, Award, BarChart3, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function TutorRendimientoPage() {
  const [period, setPeriod] = useState('I Período');

  const stats = [
    { label: 'Promedio General', value: '7.85', change: '+0.3', isPositive: true },
    { label: 'Tasa de Aprobación', value: '87.5%', change: '+2.1%', isPositive: true },
    { label: 'Alumnos en Riesgo (<7)', value: '4', change: '-2', isPositive: true },
    { label: 'Casos Críticos (<4)', value: '1', change: '0', isPositive: false },
  ];

  const distribution = [
    { label: 'Domina los aprendizajes (9.00 - 10.00)', count: 8, percentage: 25, color: 'bg-emerald-500' },
    { label: 'Alcanza los aprendizajes (7.00 - 8.99)', count: 20, percentage: 62.5, color: 'bg-blue-500' },
    { label: 'Próximo a alcanzar (4.01 - 6.99)', count: 3, percentage: 9.4, color: 'bg-amber-500' },
    { label: 'No alcanza los aprendizajes (≤ 4.00)', count: 1, percentage: 3.1, color: 'bg-red-500' },
  ];

  const subjectsRanking = [
    { name: 'Lengua y Literatura', avg: 8.42, teacher: 'Lic. Luis Mora', passRate: '96%' },
    { name: 'Educación Cultural y Artística', avg: 8.15, teacher: 'Lic. Byron Vera', passRate: '94%' },
    { name: 'Inglés', avg: 7.90, teacher: 'Lic. John Doe', passRate: '90%' },
    { name: 'Sistemas Operativos', avg: 7.65, teacher: 'Ing. Carlos Ortiz', passRate: '88%' },
    { name: 'Matemáticas', avg: 6.95, teacher: 'Lic. Ana Pérez', passRate: '75%' },
    { name: 'Física', avg: 6.20, teacher: 'Lic. Marta Solís', passRate: '62%' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Análisis de Rendimiento</h1>
          <p className="text-slate-500">Métricas consolidadas y semáforo de alerta para 2.º BGU - A.</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm font-medium shadow-sm"
        >
          <option>I Período</option>
          <option>II Período</option>
          <option>III Período</option>
          <option>Consolidado Anual</option>
        </select>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-bold flex items-center ${stat.isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Scale Distribution */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <BarChart3 className="text-primary-500" size={20} />
            <h2 className="font-bold text-slate-800">Distribución de Aprendizajes</h2>
          </div>
          <div className="space-y-4">
            {distribution.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{item.label}</span>
                  <span className="font-bold">{item.count} est. ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects Performance Ranking */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <TrendingUp className="text-primary-500" size={20} />
            <h2 className="font-bold text-slate-800">Rendimiento por Materia</h2>
          </div>
          <div className="space-y-3">
            {subjectsRanking.map((sub, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-800">{sub.name}</p>
                  <p className="text-xs text-slate-400">{sub.teacher}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-extrabold ${sub.avg >= 7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {sub.avg.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-slate-400">{sub.passRate} apr.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
