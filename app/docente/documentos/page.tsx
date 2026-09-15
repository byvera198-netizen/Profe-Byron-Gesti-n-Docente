'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Plus, Folder, HardDrive, ExternalLink, Search, X, CheckCircle2 } from 'lucide-react';
import DocumentCard from '@/components/DocumentCard';

interface DocItem {
  id: string;
  name: string;
  category: string;
  type: 'pdf' | 'xlsx' | 'csv';
  date: string;
  size: string;
  status: 'completed' | 'draft' | 'review';
}

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState('Todos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [uploadData, setUploadData] = useState({
    name: '',
    category: 'Material de Apoyo',
    type: 'pdf' as 'pdf' | 'xlsx' | 'csv',
  });

  const [documents, setDocuments] = useState<DocItem[]>([
    { id: '1', name: 'Consolidado_2BGU_A_2026.pdf', category: 'Consolidados Anuales', type: 'pdf', date: '2026-06-15', size: '1.2 MB', status: 'completed' },
    { id: '2', name: 'Acta_Supletorios_ECA_A.pdf', category: 'Actas de Supletorios', type: 'pdf', date: '2026-06-20', size: '850 KB', status: 'completed' },
    { id: '3', name: 'Nomina_Estudiantes_Export.xlsx', category: 'Consolidados Anuales', type: 'xlsx', date: '2026-05-10', size: '45 KB', status: 'completed' },
    { id: '4', name: 'Reporte_Cualitativo_General.pdf', category: 'Informes Cualitativos', type: 'pdf', date: '2026-06-18', size: '2.1 MB', status: 'review' },
    { id: '5', name: 'Planificacion_Curricular_ECA.pdf', category: 'Material de Apoyo', type: 'pdf', date: '2026-04-12', size: '3.4 MB', status: 'completed' },
    { id: '6', name: 'Registro_Asistencia_2BGU_B.xlsx', category: 'Material de Apoyo', type: 'xlsx', date: '2026-05-22', size: '110 KB', status: 'completed' },
  ]);

  const folders = [
    { name: 'Todas', icon: Folder, count: documents.length, color: 'text-slate-500' },
    { name: 'Consolidados Anuales', icon: FileText, count: documents.filter(d => d.category === 'Consolidados Anuales').length, color: 'text-blue-500' },
    { name: 'Actas de Supletorios', icon: FileText, count: documents.filter(d => d.category === 'Actas de Supletorios').length, color: 'text-amber-500' },
    { name: 'Informes Cualitativos', icon: FileText, count: documents.filter(d => d.category === 'Informes Cualitativos').length, color: 'text-emerald-500' },
    { name: 'Material de Apoyo', icon: Folder, count: documents.filter(d => d.category === 'Material de Apoyo').length, color: 'text-indigo-500' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || doc.category === selectedCategory;
    const matchesFormat = formatFilter === 'Todos' || doc.type.toUpperCase() === formatFilter;
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleDownload = (doc: DocItem) => {
    const content = `DOCUMENTO OFICIAL - UNIDAD EDUCATIVA TÉCNICA NACIONAL\nNombre: ${doc.name}\nCategoría: ${doc.category}\nFecha: ${doc.date}\nEstado: ${doc.status.toUpperCase()}\n\nEste archivo fue generado y verificado por el Sistema Profe. Byron Gestión Docente.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name.endsWith('.txt') ? doc.name : `${doc.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Descargando "${doc.name}"...`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Deseas eliminar el documento "${name}"?`)) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      showToast('Documento eliminado');
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.name) return;

    const newDoc: DocItem = {
      id: 'doc-' + Date.now(),
      name: uploadData.name.includes('.') ? uploadData.name : `${uploadData.name}.${uploadData.type}`,
      category: uploadData.category,
      type: uploadData.type,
      date: new Date().toISOString().split('T')[0],
      size: '1.5 MB',
      status: 'completed',
    };

    setDocuments(prev => [newDoc, ...prev]);
    setShowUploadModal(false);
    setUploadData({ name: '', category: 'Material de Apoyo', type: 'pdf' });
    showToast('Documento subido y sincronizado correctamente');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Gestión Documental</h1>
          <p className="text-slate-500">Tus reportes generados y archivos sincronizados con el repositorio institucional.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            <span>Subir Archivo</span>
          </button>
          <Link 
            href="/docente/consolidado" 
            className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-primary-500/20"
          >
            <FileText size={18} />
            <span>Generar Nuevo Documento</span>
          </Link>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Storage Integration Banner */}
      <div className="bg-primary-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-primary-600/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <HardDrive size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Sincronización con Repositorio Institucional</h3>
            <p className="text-primary-100 text-sm">Tus documentos se respaldan automáticamente en la nube institucional.</p>
          </div>
        </div>
        <button 
          onClick={() => showToast('Repositorio institucional sincronizado')}
          className="bg-white text-primary-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-50 transition-colors shadow"
        >
          <ExternalLink size={16} />
          Ver Nube
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Folder Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-4 rounded-2xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Carpetas</h3>
            <div className="space-y-1">
              {folders.map((folder) => {
                const isSelected = selectedCategory === folder.name;
                return (
                  <button 
                    key={folder.name} 
                    onClick={() => setSelectedCategory(folder.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                      isSelected 
                        ? 'bg-primary-50 text-primary-900 font-semibold border border-primary-100' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <folder.icon size={18} className={folder.color} />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {folder.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar documentos por nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              />
            </div>
            <select 
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm cursor-pointer"
            >
              <option value="Todos">Todos los formatos</option>
              <option value="PDF">PDF</option>
              <option value="XLSX">Excel (XLSX)</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 glass-card rounded-2xl">
                No se encontraron documentos en esta categoría.
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <DocumentCard 
                  key={doc.id}
                  name={doc.name}
                  type={doc.type}
                  date={doc.date}
                  size={doc.size}
                  status={doc.status}
                  onDownload={() => handleDownload(doc)}
                  onView={() => handleDownload(doc)}
                  onDelete={() => handleDelete(doc.id, doc.name)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Subir Archivo al Repositorio</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Nombre del Documento</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Plan_Recuperacion_Septiembre.pdf"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Categoría / Carpeta</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Consolidados Anuales">Consolidados Anuales</option>
                  <option value="Actas de Supletorios">Actas de Supletorios</option>
                  <option value="Informes Cualitativos">Informes Cualitativos</option>
                  <option value="Material de Apoyo">Material de Apoyo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Tipo de Archivo</label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="pdf">PDF (.pdf)</option>
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50">
                <FileText className="mx-auto text-slate-400" size={28} />
                <p className="text-xs text-slate-500">Arrastra tu archivo aquí o haz clic para seleccionarlo</p>
                <span className="text-[10px] text-slate-400 block">Formatos permitidos: PDF, XLSX, CSV (Máx. 10MB)</span>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/20"
                >
                  Subir y Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
