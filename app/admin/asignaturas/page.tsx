'use client';

import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, BookOpen, Filter } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function AdminAsignaturasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas');

  const [subjects] = useState([
    { id: '1', code: 'MAT-01', name: 'Matemáticas', area: 'Ciencias Exactas', level: 'BGU', weeklyHours: 5, teachersCount: 3 },
    { id: '2', code: 'LEN-02', name: 'Lengua y Literatura', area: 'Lenguaje y Comunicación', level: 'BGU', weeklyHours: 5, teachersCount: 3 },
    { id: '3', code: 'ECA-03', name: 'Educación Cultural y Artística', area: 'Artes y Humanidades', level: 'BGU', weeklyHours: 2, teachersCount: 2 },
    { id: '4', code: 'FIS-04', name: 'Física', area: 'Ciencias Naturales', level: 'BGU', weeklyHours: 4, teachersCount: 2 },
    { id: '5', code: 'ING-05', name: 'Inglés', area: 'Lenguas Extranjeras', level: 'BGU', weeklyHours: 5, teachersCount: 2 },
    { id: '6', code: 'SOR-06', name: 'Sistemas Operativos y Redes', area: 'Técnica Informática', level: 'BT Informática', weeklyHours: 6, teachersCount: 2 },
  ]);

  const filtered = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'Todas' || s.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Malla Curricular y Asignaturas</h1>
          <p className="text-slate-500">Gestión del catálogo de asignaturas institucionales y carga horaria.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Nueva Asignatura</span>
        </button>
      </header>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar asignatura por código o nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
            />
          </div>
          <select 
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer text-sm"
          >
            <option value="Todas">Todas las áreas</option>
            <option value="Ciencias Exactas">Ciencias Exactas</option>
            <option value="Lenguaje y Comunicación">Lenguaje y Comunicación</option>
            <option value="Artes y Humanidades">Artes y Humanidades</option>
            <option value="Ciencias Naturales">Ciencias Naturales</option>
            <option value="Lenguas Extranjeras">Lenguas Extranjeras</option>
            <option value="Técnica Informática">Técnica Informática</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total: {filtered.length} asignaturas
        </div>
      </div>

      <DataTable 
        headers={['Código', 'Asignatura', 'Área de Conocimiento', 'Nivel', 'Horas/Sem', 'Docentes', 'Acciones']}
        data={filtered}
        renderRow={(subject) => (
          <React.Fragment>
            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{subject.code}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-primary-500" />
                <span className="font-bold text-sm text-slate-800">{subject.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{subject.area}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded border border-slate-200">
                {subject.level}
              </span>
            </td>
            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{subject.weeklyHours}h</td>
            <td className="px-6 py-4 text-sm text-slate-600">{subject.teachersCount} asignados</td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 transition-colors">
                  <Edit3 size={16} />
                </button>
                <button className="p-1 rounded-md text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </React.Fragment>
        )}
      />
    </div>
  );
}
