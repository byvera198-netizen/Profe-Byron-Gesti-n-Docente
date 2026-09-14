'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Plus, Calendar, CheckCircle2, Search, Printer, X } from 'lucide-react';
import Link from 'next/link';
import { tutorService, CourseMeeting } from '@/lib/services/tutorService';

export default function TutorActasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [meetings, setMeetings] = useState<CourseMeeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<CourseMeeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(false);
    const data = await tutorService.getMeetings();
    setMeetings(data);
    setLoading(false);
  };

  const filtered = meetings.filter(m =>
    m.agenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.date.includes(searchTerm) ||
    m.tutor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Actas de Junta de Curso</h1>
          <p className="text-slate-500">Expediente oficial de resoluciones, compromisos y firmas del curso tutoriado.</p>
        </div>
        <Link href="/tutor/junta" className="btn-primary flex items-center gap-2 shadow-md shadow-primary-600/20 font-semibold">
          <Plus size={18} />
          <span>Nueva Sesión / Acta</span>
        </Link>
      </header>

      <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar actas por fecha, orden del día o autoridad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total: {filtered.length} actas oficiales
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Cargando archivo de actas...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((meeting) => (
            <div
              key={meeting.id}
              className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-primary-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">
                    Acta de Junta de Curso - {meeting.course}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Calendar size={13} /> {meeting.date} ({meeting.time})
                    </span>
                    <span>•</span>
                    <span>Tutor: {meeting.tutor}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {meeting.agreements?.length || 0} Acuerdos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMeeting(meeting)}
                  className="btn-secondary flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold"
                >
                  <Eye size={15} />
                  <span>Ver Acta Oficial</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedMeeting(meeting);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="btn-primary flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold"
                >
                  <Printer size={15} />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View/Print Acta Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-primary-600" size={22} />
                Expediente de Acta Oficial
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
                  onClick={() => setSelectedMeeting(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-6 text-slate-900 border border-slate-200 p-8 rounded-2xl bg-white print:border-none print:p-0">
              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                <h3 className="text-base font-extrabold uppercase tracking-wide">Unidad Educativa &quot;Técnica Nacional&quot;</h3>
                <p className="text-xs text-slate-500 font-mono">Código AMIE: 17H00123 | Año Lectivo: 2026-2027</p>
                <h4 className="text-sm font-bold uppercase pt-2 tracking-wider text-primary-900">
                  Acta de Sesión Ordinaria de Junta de Curso
                </h4>
                <p className="text-xs font-semibold">{selectedMeeting.course}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-4 rounded-xl bg-slate-50">
                <div>
                  <p><strong>Fecha:</strong> {selectedMeeting.date}</p>
                  <p><strong>Hora:</strong> {selectedMeeting.time}</p>
                  <p><strong>Curso y Paralelo:</strong> {selectedMeeting.course}</p>
                </div>
                <div>
                  <p><strong>Tutor Responsable:</strong> {selectedMeeting.tutor}</p>
                  <p><strong>Directivo Presidente:</strong> {selectedMeeting.director}</p>
                  <p><strong>Estado:</strong> Sesión Concluida</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-bold uppercase tracking-wider text-slate-700">1. Orden del Día:</p>
                <div className="p-3 rounded-lg bg-slate-50 text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedMeeting.agenda}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold uppercase tracking-wider text-slate-700">2. Acuerdos y Resoluciones Oficiales:</p>
                <table className="w-full border-collapse border border-slate-200 text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-200 p-2 text-[11px]">#</th>
                      <th className="border border-slate-200 p-2 text-[11px]">Descripción del Compromiso</th>
                      <th className="border border-slate-200 p-2 text-[11px]">Responsable</th>
                      <th className="border border-slate-200 p-2 text-[11px]">Fecha Límite</th>
                      <th className="border border-slate-200 p-2 text-[11px]">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMeeting.agreements?.map((agr, idx) => (
                      <tr key={agr.id}>
                        <td className="border border-slate-200 p-2 font-medium">{idx + 1}</td>
                        <td className="border border-slate-200 p-2">{agr.description}</td>
                        <td className="border border-slate-200 p-2 font-semibold">{agr.responsible}</td>
                        <td className="border border-slate-200 p-2">{agr.deadline}</td>
                        <td className="border border-slate-200 p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            agr.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {agr.status === 'completed' ? 'Cumplido' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
                <div className="border-t border-slate-400 pt-2 space-y-0.5">
                  <p className="font-bold">{selectedMeeting.director}</p>
                  <p className="text-[10px] text-slate-500 uppercase">Presidente / Directivo</p>
                </div>
                <div className="border-t border-slate-400 pt-2 space-y-0.5">
                  <p className="font-bold">{selectedMeeting.tutor}</p>
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
