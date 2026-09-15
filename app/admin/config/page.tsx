'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Building, Calendar, Shield, Percent, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminService } from '@/lib/services/adminService';

export default function AdminConfigPage() {
  const [instConfig, setInstConfig] = useState({
    name: 'Unidad Educativa Técnica Nacional',
    code: '17H00123',
    address: 'Av. América y Universitaria, Quito - Ecuador',
    phone: '022345678',
    email: 'rectorado@tecnicanacional.edu.ec',
    currentYear: '2026-2027',
  });

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    adminService.getInstitutionConfig().then(cfg => {
      if (cfg) setInstConfig(cfg);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await adminService.saveInstitutionConfig(instConfig);
    setSaving(false);
    setSavedMessage('Configuración institucional guardada exitosamente');
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const [periods, setPeriods] = useState([
    { id: '1', name: 'I Trimestre / Período', weight: 33, startDate: '2026-09-01', endDate: '2026-11-28', status: 'Activo' },
    { id: '2', name: 'II Trimestre / Período', weight: 33, startDate: '2026-12-01', endDate: '2027-03-05', status: 'Próximo' },
    { id: '3', name: 'III Trimestre / Período', weight: 34, startDate: '2027-03-08', endDate: '2027-06-18', status: 'Próximo' },
  ]);

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Configuración Institucional</h1>
          <p className="text-slate-500">Parámetros globales, periodos académicos y ponderaciones.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Save size={18} />
          <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </header>

      {savedMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Institution Details */}
        <div className="glass-card p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="text-primary-500" size={20} />
            <h2 className="font-bold text-slate-800">Datos de la Institución</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nombre de la Institución</label>
              <input
                type="text"
                value={instConfig.name}
                onChange={(e) => setInstConfig({ ...instConfig, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Código AMIE</label>
                <input
                  type="text"
                  value={instConfig.code}
                  onChange={(e) => setInstConfig({ ...instConfig, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Año Lectivo Activo</label>
                <input
                  type="text"
                  value={instConfig.currentYear}
                  onChange={(e) => setInstConfig({ ...instConfig, currentYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Dirección</label>
              <input
                type="text"
                value={instConfig.address}
                onChange={(e) => setInstConfig({ ...instConfig, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Teléfono</label>
                <input
                  type="text"
                  value={instConfig.phone}
                  onChange={(e) => setInstConfig({ ...instConfig, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Correo Electrónico</label>
                <input
                  type="email"
                  value={instConfig.email}
                  onChange={(e) => setInstConfig({ ...instConfig, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Periods and Weights */}
        <div className="glass-card p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="text-primary-500" size={20} />
            <h2 className="font-bold text-slate-800">Periodos y Ponderaciones</h2>
          </div>

          <div className="space-y-3">
            {periods.map((period, index) => (
              <div key={period.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">{period.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    period.status === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {period.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ponderación:</span>
                    <span className="font-bold text-slate-700">{period.weight}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Inicio:</span>
                    <span className="font-medium text-slate-600">{period.startDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fin:</span>
                    <span className="font-medium text-slate-600">{period.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 flex items-start gap-3">
            <AlertCircle size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-primary-800 leading-relaxed">
              La suma total de ponderaciones es del <strong>100%</strong>. Cada periodo trimestral contribuye a la nota final para la definición automática de supletorios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
