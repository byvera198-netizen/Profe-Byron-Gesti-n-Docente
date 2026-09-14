'use client';

import React, { useState, useEffect } from 'react';
import { Save, Calendar, Users, FileText, CheckCircle2, AlertCircle, Plus, Trash2, TrendingUp, Printer, X, Download } from 'lucide-react';
import Link from 'next/link';
import { tutorService, CourseMeeting, MeetingAgreement } from '@/lib/services/tutorService';

export default function JuntaDeCursoPage() {
  const [step, setStep] = useState<'config' | 'analysis' | 'agreements'>('config');
  const [isActaModalOpen, setIsActaModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [meetingData, setMeetingData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    agenda: '1. Constatación del quórum reglamentario.\n2. Análisis del rendimiento académico del período.\n3. Identificación y tratamiento de casos con dificultades de aprendizaje.\n4. Resoluciones, acuerdos y compromisos pedagógicos.',
    director: 'MSc. Roberto Gómez (Vicerrector)',
    tutor: 'Lic. Byron Vera',
    course: '2.º BGU - Paralelo A',
  });

  const [agreements, setAgreements] = useState<MeetingAgreement[]>([
    { id: '1', description: 'Implementar tutorías intensivas para el grupo de riesgo en Física', responsible: 'Lic. Marta Solís', deadline: '2026-11-15', status: 'pending' },
    { id: '2', description: 'Citar a representantes de estudiantes con promedio < 7.00', responsible: 'Lic. Byron Vera', deadline: '2026-11-01', status: 'in_progress' },
  ]);

  const [newAgreementDesc, setNewAgreementDesc] = useState('');
  const [newAgreementResp, setNewAgreementResp] = useState('');
  const [newAgreementDate, setNewAgreementDate] = useState('');
  const [showAddAgreementForm, setShowAddAgreementForm] = useState(false);

  const handleAddAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgreementDesc.trim() || !newAgreementResp.trim()) return;

    const newAgr: MeetingAgreement = {
      id: 'agr-' + Date.now(),
      description: newAgreementDesc,
      responsible: newAgreementResp,
      deadline: newAgreementDate || new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setAgreements(prev => [...prev, newAgr]);
    setNewAgreementDesc('');
    setNewAgreementResp('');
    setNewAgreementDate('');
    setShowAddAgreementForm(false);
  };

  const handleToggleStatus = (id: string) => {
    setAgreements(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'completed' ? 'pending' : 'completed' };
      }
      return a;
    }));
  };

  const handleDeleteAgreement = (id: string) => {
    setAgreements(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveAndGenerateActa = async () => {
    await tutorService.saveMeeting({
      date: meetingData.date,
      time: meetingData.time,
      tutor: meetingData.tutor,
      director: meetingData.director,
      agenda: meetingData.agenda,
      status: 'finished',
      course: meetingData.course,
      agreements: agreements,
    });

    setNotification('¡Junta de Curso guardada en el historial oficial!');
    setIsActaModalOpen(true);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Junta de Curso</h1>
          <p className="text-slate-500">Planificación, análisis colegiado y actas oficiales de la sesión.</p>
        </div>
        <button
          onClick={handleSaveAndGenerateActa}
          className="btn-primary flex items-center gap-2 font-semibold shadow-md shadow-primary-600/20"
        >
          <Printer size={18} />
          <span>Generar Acta Oficial (PDF)</span>
        </button>
      </header>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Stepper Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
          {[
            { id: 'config', label: '1. Configuración', icon: Calendar },
            { id: 'analysis', label: '2. Análisis Académico', icon: Users },
            { id: 'agreements', label: '3. Acuerdos y Compromisos', icon: CheckCircle2 },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                step === s.id ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Configuración */}
      {step === 'config' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="text-primary-500" size={20} />
              Datos Generales de la Sesión
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Fecha de la Junta</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Hora de Instalación</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Tutor Responsable</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-slate-50 text-slate-600 text-sm font-medium"
                  value={meetingData.tutor}
                  onChange={(e) => setMeetingData({ ...meetingData, tutor: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Autoridad / Directivo</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  value={meetingData.director}
                  onChange={(e) => setMeetingData({ ...meetingData, director: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Orden del Día (Convocatoria)</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm leading-relaxed"
                value={meetingData.agenda}
                onChange={(e) => setMeetingData({ ...meetingData, agenda: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Análisis Académico */}
      {step === 'analysis' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-500" size={20} />
              <h2 className="font-bold text-slate-800">Diagnóstico del Curso para la Sesión</h2>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Datos Sincronizados
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Cuadro de Honor (Destacados)
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'María García', avg: '9.60', honor: '1.er Lugar' },
                  { name: 'Luis Torres', avg: '8.80', honor: '2.do Lugar' },
                  { name: 'Juan Pérez', avg: '8.15', honor: '3.er Lugar' },
                ].map((s) => (
                  <div key={s.name} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xs">{s.name}</p>
                      <p className="text-[10px] text-emerald-600">{s.honor}</p>
                    </div>
                    <span className="text-xs font-black bg-emerald-200 px-2 py-0.5 rounded-full">
                      {s.avg}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <AlertCircle size={18} className="text-red-500" />
                Casos de Atención Especial y Riesgo
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Carlos Ruiz', issue: 'Promedio 4.50 en Física y Matemáticas', action: 'Plan de Refuerzo Urgente' },
                  { name: 'Ana López', issue: 'Promedio 6.50 en Física', action: 'Tutoría Pedagógica' },
                ].map((s) => (
                  <div key={s.name} className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xs">{s.name}</p>
                      <p className="text-[10px] text-red-600">{s.issue}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-red-200 px-2.5 py-1 rounded-full text-red-900">
                      {s.action}
                    </span>
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
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <h2 className="font-bold text-slate-800">Acuerdos y Resoluciones de la Junta</h2>
              </div>
              <button
                onClick={() => setShowAddAgreementForm(true)}
                className="btn-primary text-xs flex items-center gap-1.5 py-1.5"
              >
                <Plus size={15} />
                <span>Nuevo Compromiso</span>
              </button>
            </div>

            {showAddAgreementForm && (
              <form onSubmit={handleAddAgreement} className="p-4 rounded-2xl bg-primary-50/50 border border-primary-100 space-y-3">
                <p className="text-xs font-bold text-primary-900">Registrar Nuevo Compromiso:</p>
                <input
                  type="text"
                  required
                  placeholder="Descripción del compromiso acordado..."
                  value={newAgreementDesc}
                  onChange={(e) => setNewAgreementDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-xs bg-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Docente / Autoridad responsable..."
                    value={newAgreementResp}
                    onChange={(e) => setNewAgreementResp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-xs bg-white"
                  />
                  <input
                    type="date"
                    required
                    value={newAgreementDate}
                    onChange={(e) => setNewAgreementDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-xs bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAgreementForm(false)}
                    className="btn-secondary py-1 px-3 text-xs"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary py-1 px-3 text-xs font-semibold">
                    Guardar Acuerdo
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {agreements.map((agr) => (
                <div
                  key={agr.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between group hover:border-primary-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleStatus(agr.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        agr.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      }`}
                      title="Alternar estado"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div>
                      <p className={`text-sm font-bold text-slate-800 ${agr.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                        {agr.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <Users size={12} className="text-slate-400" /> {agr.responsible}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" /> Límite: {agr.deadline}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            agr.status === 'completed'
                              ? 'bg-emerald-200 text-emerald-800'
                              : 'bg-amber-200 text-amber-800'
                          }`}
                        >
                          {agr.status === 'completed' ? 'Cumplido' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAgreement(agr.id)}
                    className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar acuerdo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Acta Modal */}
      {isActaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-primary-600" size={22} />
                Acta Oficial de Junta de Curso (Vista Previa)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3"
                >
                  <Printer size={15} />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  onClick={() => setIsActaModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Body (Print format) */}
            <div className="space-y-6 text-slate-900 border border-slate-200 p-8 rounded-2xl bg-white print:border-none print:p-0">
              {/* Institutional Header */}
              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                <h3 className="text-base font-extrabold uppercase tracking-wide">Unidad Educativa &quot;Técnica Nacional&quot;</h3>
                <p className="text-xs text-slate-500 font-mono">Código AMIE: 17H00123 | Año Lectivo: 2026-2027</p>
                <h4 className="text-sm font-bold uppercase pt-2 tracking-wider text-primary-900">
                  Acta de Sesión Ordinaria de Junta de Curso
                </h4>
                <p className="text-xs font-semibold">{meetingData.course}</p>
              </div>

              {/* Metadata Table */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-4 rounded-xl bg-slate-50">
                <div>
                  <p><strong>Fecha:</strong> {meetingData.date}</p>
                  <p><strong>Hora:</strong> {meetingData.time}</p>
                  <p><strong>Curso y Paralelo:</strong> {meetingData.course}</p>
                </div>
                <div>
                  <p><strong>Tutor Responsable:</strong> {meetingData.tutor}</p>
                  <p><strong>Directivo Presidente:</strong> {meetingData.director}</p>
                  <p><strong>Estado:</strong> Sesión Concluida</p>
                </div>
              </div>

              {/* Agenda */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold uppercase tracking-wider text-slate-700">1. Orden del Día:</p>
                <div className="p-3 rounded-lg bg-slate-50 text-slate-700 whitespace-pre-line leading-relaxed">
                  {meetingData.agenda}
                </div>
              </div>

              {/* Deliberations & Agreements */}
              <div className="space-y-2 text-xs">
                <p className="font-bold uppercase tracking-wider text-slate-700">2. Resoluciones y Compromisos:</p>
                <table className="w-full border-collapse border border-slate-200 text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-200 p-2 text-[11px]">#</th>
                      <th className="border border-slate-200 p-2 text-[11px]">Descripción del Compromiso</th>
                      <th className="border border-slate-200 p-2 text-[11px]">Responsable</th>
                      <th className="border border-slate-200 p-2 text-[11px]">Fecha Límite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreements.map((agr, idx) => (
                      <tr key={agr.id}>
                        <td className="border border-slate-200 p-2 font-medium">{idx + 1}</td>
                        <td className="border border-slate-200 p-2">{agr.description}</td>
                        <td className="border border-slate-200 p-2 font-semibold">{agr.responsible}</td>
                        <td className="border border-slate-200 p-2">{agr.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
                <div className="border-t border-slate-400 pt-2 space-y-0.5">
                  <p className="font-bold">{meetingData.director}</p>
                  <p className="text-[10px] text-slate-500 uppercase">Presidente / Directivo</p>
                </div>
                <div className="border-t border-slate-400 pt-2 space-y-0.5">
                  <p className="font-bold">{meetingData.tutor}</p>
                  <p className="text-[10px] text-slate-500 uppercase">Docente Tutor / Secretario</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
