'use client';

import React, { useState } from 'react';
import { GraduationCap, Users, BookOpen, ArrowRight, Award, FileText } from 'lucide-react';
import Link from 'next/link';

export default function MisCursosPage() {
  const [courses] = useState([
    {
      id: '1',
      name: '2.º BGU',
      parallel: 'A',
      level: 'Bachillerato General Unificado',
      studentsCount: 32,
      isTutor: true,
      subjects: ['Educación Cultural y Artística', 'Sistemas Operativos y Redes'],
      generalAverage: 7.85,
    },
    {
      id: '2',
      name: '2.º BGU',
      parallel: 'B',
      level: 'Bachillerato General Unificado',
      studentsCount: 30,
      isTutor: false,
      subjects: ['Educación Cultural y Artística', 'Soporte Técnico'],
      generalAverage: 8.12,
    },
    {
      id: '3',
      name: '3.º BGU',
      parallel: 'A',
      level: 'Bachillerato General Unificado',
      studentsCount: 34,
      isTutor: false,
      subjects: ['Educación Cultural y Artística', 'Sistemas Operativos y Redes'],
      generalAverage: 7.42,
    },
  ]);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Mis Cursos</h1>
          <p className="text-slate-500">Paralelos en los que impartes clases y/o desempeñas tutoría.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-slate-200 flex flex-col justify-between">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-xl">
                    {course.parallel}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{course.name} - {course.parallel}</h3>
                    <p className="text-xs text-slate-400">{course.level}</p>
                  </div>
                </div>
                {course.isTutor && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Tutor
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400">Estudiantes</p>
                  <p className="font-bold text-slate-700 text-sm mt-0.5">{course.studentsCount}</p>
                </div>
                <div>
                  <p className="text-slate-400">Promedio Curso</p>
                  <p className={`font-bold text-sm mt-0.5 ${course.generalAverage >= 7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {course.generalAverage.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mis Materias:</p>
                <div className="space-y-1">
                  {course.subjects.map((sub, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-white border border-slate-100 text-slate-700 flex items-center gap-2">
                      <BookOpen size={13} className="text-primary-500" />
                      <span className="font-medium truncate">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/docente/calificaciones`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
              >
                <span>Calificaciones</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docente/consolidado"
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Consolidado
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
