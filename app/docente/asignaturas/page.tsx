'use client';

import React, { useState } from 'react';
import { BookOpen, Users, Clock, Award, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function MisAsignaturasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = [
    {
      id: '1',
      name: 'Educación Cultural y Artística (ECA)',
      code: 'ECA-01',
      area: 'Artes y Humanidades',
      courses: ['2do BGU - A', '2do BGU - B', '3ro BGU - A'],
      studentsCount: 96,
      weeklyHours: 4,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: '2',
      name: 'Sistemas Operativos y Redes',
      code: 'SOR-02',
      area: 'Técnica Informática',
      courses: ['2do BGU - A', '3ro BGU - A'],
      studentsCount: 64,
      weeklyHours: 6,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: '3',
      name: 'Soporte Técnico',
      code: 'ST-03',
      area: 'Técnica Informática',
      courses: ['1ro BGU - A', '2do BGU - B'],
      studentsCount: 58,
      weeklyHours: 4,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Mis Asignaturas</h1>
          <p className="text-slate-500">Cátedras asignadas para el año lectivo 2026-2027.</p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar asignatura por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-slate-200 flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-md`}>
                  <BookOpen size={24} />
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  {subject.code}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{subject.name}</h3>
                <p className="text-xs font-medium text-slate-400">{subject.area}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  <span>{subject.studentsCount} Alumnos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span>{subject.weeklyHours}h / semana</span>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Paralelos:</p>
                <div className="flex flex-wrap gap-1.5">
                  {subject.courses.map((c, i) => (
                    <span key={i} className="text-[11px] font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md border border-primary-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Link 
                href="/docente/calificaciones" 
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
              >
                <span>Ir a Calificaciones</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/docente/insumos" 
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Configurar Insumos
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
