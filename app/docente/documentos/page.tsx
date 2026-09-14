import React from 'react';
import { FileText, Download, Plus, Folder, HardDrive, ExternalLink, Search } from 'lucide-react';
import DocumentCard from '@/components/DocumentCard';

export default function DocumentsPage() {
  const folders = [
    { name: 'Consolidados Anuales', icon: FileText, count: 12, color: 'text-blue-500' },
    { name: 'Actas de Supletorios', icon: FileText, count: 5, color: 'text-amber-500' },
    { name: 'Informes Cualitativos', icon: FileText, count: 8, color: 'text-emerald-500' },
    { name: 'Material de Apoyo', icon: Folder, count: 24, color: 'text-indigo-500' },
  ];

  const myDocuments = [
    { name: 'Consolidado_2BGU_A_2026.pdf', type: 'pdf' as const, date: '2026-06-15', size: '1.2 MB', status: 'completed' },
    { name: 'Acta_Supletorios_ECA_A.pdf', type: 'pdf' as const, date: '2026-06-20', size: '850 KB', status: 'completed' },
    { name: 'Nomina_Estudiantes_Export.xlsx', type: 'xlsx' as const, date: '2026-05-10', size: '45 KB', status: 'completed' },
    { name: 'Reporte_Cualitativo_General.pdf', type: 'pdf' as const, date: '2026-06-18', size: '2.1 MB', status: 'review' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Gestión Documental</h1>
          <p className="text-slate-500">Tus reportes generados y archivos sincronizados con el repositorio institucional.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Plus size={18} />
            <span className="text-sm">Subir Archivo</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FileText size={18} />
            <span className="text-sm">Generar Nuevo Documento</span>
          </button>
        </div>
      </header>

      {/* Storage Integration Banner */}
      <div className="bg-primary-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-primary-600/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <HardDrive size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Sincronización con Repositorio Institucional</h3>
            <p className="text-primary-100 text-sm">Tus documentos se guardan automáticamente en la nube de la institución.</p>
          </div>
        </div>
        <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-50 transition-colors">
          <ExternalLink size={16} />
          Abrir Repositorio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Folder Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-4 rounded-2xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Carpetas</h3>
            <div className="space-y-1">
              {folders.map((folder, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <folder.icon size={18} className={folder.color} />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{folder.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {folder.count}
                  </span>
                </button>
              ))}
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
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <select className="px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white text-sm cursor-pointer">
              <option>Todos los formatos</option>
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </div>

          <div className="space-y-3">
            {myDocuments.map((doc, i) => (
              <DocumentCard 
                key={i}
                name={doc.name}
                type={doc.type}
                date={doc.date}
                size={doc.size}
                status={doc.status}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
