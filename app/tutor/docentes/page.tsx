'use client';

import React, { useState } from 'react';
import { Users, Mail, Phone, BookOpen, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function TutorDocentesPage() {
  const [teachers] = useState([
    { id: '1', name: 'Lic. Ana Pérez', subject: 'Matemáticas', email: 'ana.perez@colegio.edu.ec', phone: '0991234567', gradesStatus: 'Completado', pendingItems: 0 },
    { id: '2', name: 'Lic. Luis Mora', subject: 'Lengua y Literatura', email: 'luis.mora@colegio.edu.ec', phone: '0987654321', gradesStatus: 'Completado', pendingItems: 0 },
    { id: '3', name: 'Lic. Byron Vera', subject: 'Educación Cultural y Artística', email: 'byron.vera@colegio.edu.ec', phone: '0993344556', gradesStatus: 'Completado', pendingItems: 0 },
    { id: '4', name: 'Lic. Marta Solís', subject: 'Física', email: 'marta.solis@colegio.edu.ec', phone: '0981122334', gradesStatus: 'Pendiente', pendingItems: 12 },
    { id: '5', name: 'Lic. John Doe', subject: 'Inglés', email: 'john.doe@colegio.edu.ec', phone: '0975566778', gradesStatus: 'Completado', pendingItems: 0 },
    { id: '6', name: 'Ing. Carlos Ortiz', subject: 'Sistemas Operativos', email: 'carlos.ortiz@colegio.edu.ec', phone: '0969988776', gradesStatus: 'En Progreso', pendingItems: 4 },
  ]);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Equipo Docente del Curso</h1>
          <p className="text-slate-500">Docentes asignados a las asignaturas de 2.º BGU - A (Tutoría).</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Docentes</p>
            <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Calificaciones Al Día</p>
            <p className="text-2xl font-bold text-slate-900">
              {teachers.filter(t => t.gradesStatus === 'Completado').length}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Entregas Pendientes</p>
            <p className="text-2xl font-bold text-slate-900">
              {teachers.filter(t => t.gradesStatus !== 'Completado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <DataTable
        headers={['Docente', 'Asignatura', 'Contacto', 'Estado de Notas', 'Acciones']}
        data={teachers}
        renderRow={(teacher) => (
          <React.Fragment>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200">
                  {teacher.name.split(' ').slice(1, 3).map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{teacher.name}</p>
                  <p className="text-xs text-slate-400">{teacher.email}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-primary-500" />
                <span className="text-sm font-medium text-slate-700">{teacher.subject}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-xs text-slate-500">
              <p>{teacher.phone}</p>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                teacher.gradesStatus === 'Completado'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : teacher.gradesStatus === 'En Progreso'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {teacher.gradesStatus} {teacher.pendingItems > 0 ? `(${teacher.pendingItems} pend.)` : ''}
              </span>
            </td>
            <td className="px-6 py-4">
              <a
                href={`mailto:${teacher.email}`}
                className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1.5"
              >
                <Mail size={14} />
                <span>Contactar</span>
              </a>
            </td>
          </React.Fragment>
        )}
      />
    </div>
  );
}
