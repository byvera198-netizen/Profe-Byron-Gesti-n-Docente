'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, Download, Upload, X, CheckCircle2, FileSpreadsheet, Users } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { adminService, StudentAdminItem } from '@/lib/services/adminService';

export default function AdminStudents() {
  const [students, setStudents] = useState<StudentAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Todos los cursos');
  const [notification, setNotification] = useState<string | null>(null);

  // New Student Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    course: '2do BGU - A',
  });

  // Batch Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const data = await adminService.getStudents();
    setStudents(data);
    setLoading(false);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.firstName || !newStudent.lastName) return;

    await adminService.createStudent(newStudent);
    await loadStudents();
    setIsCreateModalOpen(false);
    setNewStudent({
      firstName: '',
      lastName: '',
      idNumber: '',
      email: '',
      course: '2do BGU - A',
    });
    setNotification('¡Estudiante matriculado con éxito!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBatchImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importCsvText.trim()) return;

    // Parse CSV lines
    // Expected format per line: Cedula, Apellidos, Nombres, Correo, Curso
    const lines = importCsvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsed: Array<Omit<StudentAdminItem, 'id' | 'listNum'>> = [];

    for (const line of lines) {
      // Ignore header line if present
      if (line.toLowerCase().includes('cedula') || line.toLowerCase().includes('apellidos')) continue;

      const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 3) {
        parsed.push({
          idNumber: cols[0] || '17' + Math.floor(10000000 + Math.random() * 90000000),
          lastName: cols[1] || 'Apellido',
          firstName: cols[2] || 'Nombre',
          email: cols[3] || `${cols[2]?.toLowerCase() || 'alumno'}@email.com`,
          course: cols[4] || '2do BGU - A',
        });
      }
    }

    if (parsed.length === 0) {
      alert('No se detectaron filas válidas. Revisa el formato sugerido.');
      return;
    }

    await adminService.importStudentsBatch(parsed);
    await loadStudents();
    setIsImportModalOpen(false);
    setImportCsvText('');
    setNotification(`¡Se importaron ${parsed.length} estudiantes exitosamente!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('¿Estás seguro de desvincular este estudiante de la nómina?')) {
      const updated = await adminService.deleteStudent(id);
      setStudents(updated);
      setNotification('Estudiante eliminado.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleExportCSV = () => {
    adminService.exportStudentsCSV(filtered);
    setNotification('Nómina exportada a archivo CSV.');
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = students.filter(s => {
    const matchesSearch =
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.idNumber.includes(searchTerm);
    const matchesCourse = selectedCourse === 'Todos los cursos' || s.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Estudiantes</h1>
          <p className="text-slate-500">Administra la nómina estudiantil, matriculaciones e importación masiva.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-secondary flex items-center gap-2 font-medium text-sm"
          >
            <Upload size={18} />
            <span>Importar CSV / Excel</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2 font-semibold text-sm shadow-md shadow-primary-600/20"
          >
            <Plus size={18} />
            <span>Nuevo Estudiante</span>
          </button>
        </div>
      </header>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombres, apellidos o cédula..." 
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
            <option>Todos los cursos</option>
            <option>2do BGU - A</option>
            <option>2do BGU - B</option>
            <option>3ro BGU - A</option>
          </select>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Download size={18} />
          <span>Exportar Nómina ({filtered.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Cargando nómina de estudiantes...</div>
      ) : (
        <DataTable 
          headers={['#', 'Estudiante', 'Cédula', 'Correo', 'Curso', 'Acciones']}
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
              <td className="px-6 py-4 text-sm text-slate-600 font-mono">{student.idNumber}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {student.course}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="p-1.5 rounded-md text-red-400 hover:bg-red-50 transition-colors"
                    title="Desvincular estudiante"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </React.Fragment>
          )}
        />
      )}

      {/* Modal Nuevo Estudiante */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Plus size={20} className="text-primary-500" />
                Matricular Estudiante
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Nombres</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Andrés"
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Apellidos</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Pérez Mora"
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">Cédula de Identidad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1712345678"
                  value={newStudent.idNumber}
                  onChange={(e) => setNewStudent({ ...newStudent, idNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-mono focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="alumno@colegio.edu.ec"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">Curso y Paralelo</label>
                <select
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm bg-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="1ro BGU - A">1ro BGU - A</option>
                  <option value="2do BGU - A">2do BGU - A</option>
                  <option value="2do BGU - B">2do BGU - B</option>
                  <option value="3ro BGU - A">3ro BGU - A</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 btn-secondary py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2 text-sm font-semibold"
                >
                  Matricular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Importación Masiva CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-emerald-500" />
                Importación Masiva de Estudiantes
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Formato requerido por cada línea (separado por comas):</p>
              <code className="text-primary-700 block font-mono text-[11px]">
                Cedula, Apellidos, Nombres, Correo, Curso
              </code>
              <p className="text-[10px] text-slate-400 italic">Ejemplo: 1720304050, Zambrano Lopez, David, david@email.com, 2do BGU - A</p>
            </div>

            <form onSubmit={handleBatchImport} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Pega aquí el contenido CSV o datos de Excel:</label>
                <textarea
                  rows={6}
                  required
                  placeholder={`1711223344, Morales Castro, Valeria, valeria@email.com, 2do BGU - A\n1755667788, Cárdenas Silva, Mateo, mateo@email.com, 2do BGU - A`}
                  value={importCsvText}
                  onChange={(e) => setImportCsvText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="flex-1 btn-secondary py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2 text-sm font-semibold"
                >
                  Procesar e Importar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
