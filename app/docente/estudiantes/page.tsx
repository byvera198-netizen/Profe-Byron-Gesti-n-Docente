'use client';

import React, { useState } from 'react';
import { Search, Users, Mail, Phone, Filter, ArrowLeft, GraduationCap } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function DocenteEstudiantesPage() {
  const [selectedCourse, setSelectedCourse] = useState('2do BGU - A');
  const [searchTerm, setSearchTerm] = useState('');

  const [students] = useState([
    { id: '1', listNum: 1, firstName: 'Juan', lastName: 'Pérez', idNum: '1712345678', email: 'juan.perez@estudiante.edu.ec', course: '2do BGU - A', currentAverage: 7.5, status: 'Regular' },
    { id: '2', listNum: 2, firstName: 'María', lastName: 'García', idNum: '1787654321', email: 'maria.garcia@estudiante.edu.ec', course: '2do BGU - A', currentAverage: 9.6, status: 'Destacado' },
    { id: '3', listNum: 3, firstName: 'Carlos', lastName: 'Ruiz', idNum: '1700112233', email: 'carlos.ruiz@estudiante.edu.ec', course: '2do BGU - A', currentAverage: 4.8, status: 'Riesgo' },
    { id: '4', listNum: 4, firstName: 'Ana', lastName: 'López', idNum: '1722334455', email: 'ana.lopez@estudiante.edu.ec', course: '2do BGU - A', currentAverage: 6.8, status: 'Atención' },
    { id: '5', listNum: 5, firstName: 'Luis', lastName: 'Torres', idNum: '1799887766', email: 'luis.torres@estudiante.edu.ec', course: '2do BGU - A', currentAverage: 8.5, status: 'Regular' },
  ]);

  const filtered = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.idNum.includes(searchTerm);
    const matchesCourse = selectedCourse === 'Todos' || s.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Destacado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Regular':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Atención':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Riesgo':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Mis Estudiantes</h1>
          <p className="text-slate-500">Nómina y seguimiento académico de los alumnos en tus cursos.</p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar estudiante por nombre o cédula..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
            />
          </div>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer text-sm"
          >
            <option value="Todos">Todos los cursos</option>
            <option value="2do BGU - A">2do BGU - A</option>
            <option value="2do BGU - B">2do BGU - B</option>
            <option value="3ro BGU - A">3ro BGU - A</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total: {filtered.length} alumnos
        </div>
      </div>

      {/* Table */}
      <DataTable 
        headers={['#', 'Estudiante', 'Cédula', 'Correo Institucional', 'Curso', 'Promedio Actual', 'Estado']}
        data={filtered}
        renderRow={(student) => (
          <React.Fragment>
            <td className="px-6 py-4 text-sm font-medium text-slate-400">{student.listNum}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <p className="text-sm font-bold text-slate-800">{student.firstName} {student.lastName}</p>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600 font-mono">{student.idNum}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {student.course}
              </span>
            </td>
            <td className="px-6 py-4 font-bold text-sm text-slate-800">
              {student.currentAverage.toFixed(2)}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(student.status)}`}>
                {student.status}
              </span>
            </td>
          </React.Fragment>
        )}
      />
    </div>
  );
}
