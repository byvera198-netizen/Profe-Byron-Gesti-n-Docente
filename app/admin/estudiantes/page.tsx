import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, Download, Upload, FileSpreadsheet } from 'lucide-react';
import DataTable from '@/components/DataTable';

export default function AdminStudents() {
  const [students, setStudents] = useState([
    { id: '1', firstName: 'Juan', lastName: 'Pérez', idNumber: '1712345678', email: 'juan@email.com', course: '2do BGU - A', listNum: 1 },
    { id: '2', firstName: 'María', lastName: 'García', idNumber: '1787654321', email: 'maria@email.com', course: '2do BGU - A', listNum: 2 },
    { id: '3', firstName: 'Carlos', lastName: 'Ruiz', idNumber: '1700112233', email: 'carlos@email.com', course: '2do BGU - A', listNum: 3 },
  ]);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Estudiantes</h1>
          <p className="text-slate-500">Administra la nómina estudiantil y las matriculaciones.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Upload size={18} />
            <span className="text-sm">Importar Excel</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span className="text-sm">Nuevo Estudiante</span>
          </button>
        </div>
      </header>

      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar estudiante por nombre o cédula..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <select className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer text-sm">
            <option>Todos los cursos</option>
            <option>2do BGU - A</option>
            <option>2do BGU - B</option>
          </select>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={18} />
          <span>Exportar Nómina</span>
        </button>
      </div>

      <DataTable 
        headers={['#', 'Estudiante', 'Cédula', 'Correo', 'Curso', 'Acciones']}
        data={students}
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
            <td className="px-6 py-4 text-sm text-slate-600 font-mono">{student.idNumber}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {student.course}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 transition-colors"><Edit3 size={16} /></button>
                <button className="p-1 rounded-md text-red-400 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
              </div>
            </td>
          </React.Fragment>
        )}
      />
    </div>
  );
}
