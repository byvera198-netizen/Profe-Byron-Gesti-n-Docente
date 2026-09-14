import React, { useState } from 'react';
import { Save, Calendar, Users, FileText, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function JuntaDeCursoPage() {
  const [step, setStep] = useState<'config' | 'analysis' | 'agreements'>('config');
  
  const [meetingData, setMeetingData] = useState({
    date: '',
    time: '',
    agenda: '',
    director: '',
    tutor: 'Lic. Byron Vera'
  });

  const [agreements, setAgreements] = useState([
    { id: '1', description: 'Implementar tutorías intensivas para el grupo de riesgo en Física', responsible: 'Lic. Marta Solís', deadline: '2026-11-15', status: 'pending' },
    { id: '2', description: 'Citar a representantes de estudiantes con promedio < 4.0', responsible: 'Lic. Byron Vera', deadline: '2026-11-01', status: 'in_progress' },
  ]);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Junta de Curso</h1>
          <p className="text-slate-500">Planificación, análisis y actas de la sesión académica.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save size={18} />
          <span className="text-sm">Generar Acta Final (PDF)</span>
        </button>
      </header>

      {/* Stepper Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
          {[
            { id: 'config', label: '1. Configuración', icon: Calendar },
            { id: 'analysis', label: '2. Análisis Académico', icon: Users },
            { id: 'agreements', label: '3. Acuerdos y Compromisos', icon: CheckCircle2 },
          ].map((s) => (
            <button 
              key={s.id}
              onClick={() => setStep(s.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step === s.id ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <s.icon size={16} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Configuración */}
      {step === 'config' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="text-primary-500" size={20} />
              Datos de la Sesión
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Fecha de la Junta</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Hora</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Tutor Responsable</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none bg-slate-50 text-slate-500 cursor-not-allowed"
                  value={meetingData.tutor}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Directivo Responsable</label>
                <input 
                  type="text" 
                  placeholder="Ej: MSc. Roberto Gómez" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                  value={meetingData.director}
                  onChange={(e) => setMeetingData({...meetingData, director: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Orden del Día</label>
              <textarea 
                rows={4}
                placeholder="1. Análisis de rendimiento por materia... 2. Casos críticos..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                value={meetingData.agenda}
                onChange={(e) => setMeetingData({...meetingData, agenda: e.target.value})}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Análisis Académico */}
      {step === 'analysis' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-500" size={20} />
              <h2 className="font-bold text-slate-800">Resumen de Rendimiento del Curso</h2>
            </div>
            <button className="btn-secondary text-xs py-1 px-3">Sincronizar Notas</button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Estudiantes Destacados
              </h3>
              <div className="space-y-2">
                {['María García', 'Luis Torres'].map(s => (
                  <div key={s} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700 flex justify-between">
                    <span>{s}</span>
                    <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full">Promedio: 9.5+</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                Casos Críticos
              </h3>
              <div className="space-y-2">
                {['Carlos Ruiz', 'Ana López'].map(s => (
                  <div key={s} className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-700 flex justify-between">
                    <span>{s}</span>
                    <span className="text-[10px] bg-red-200 px-2 py-0.5 rounded-full">Riesgo Reprobación</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Acuerdos y Compromisos */}
      {step === 'agreements' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={20} />
                Acuerdos y Compromisos de la Junta
              </h2>
              <button className="btn-primary text-sm flex items-center gap-2 py-1.5">
                <Plus size={16} />
                <span>Nuevo Compromiso</span>
              </button>
            </div>

            <div className="space-y-3">
              {agreements.map((agr) => (
                <div key={agr.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between group hover:border-primary-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${agr.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{agr.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Users size={12} /> {agr.responsible}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {agr.deadline}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          agr.status === 'completed' ? 'bg-emerald-200 text-emerald-700' : 'bg-amber-200 text-amber-700'
                        }`}>
                          {agr.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-emerald-600 transition-colors" title="Marcar como cumplido">
                      <CheckCircle2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-red-600 transition-colors" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
