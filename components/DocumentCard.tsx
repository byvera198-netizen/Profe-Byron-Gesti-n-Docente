import React from 'react';
import { FileText, Download, Eye, Trash2, MoreVertical } from 'lucide-react';

interface DocumentCardProps {
  name: string;
  type: 'pdf' | 'xlsx' | 'csv';
  date: string;
  size: string;
  status: 'completed' | 'draft' | 'review';
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export default function DocumentCard({ name, type, date, size, status, onView, onDownload, onDelete }: DocumentCardProps) {
  const typeColors = {
    pdf: 'bg-red-100 text-red-600',
    xlsx: 'bg-emerald-100 text-emerald-600',
    csv: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="glass-card p-4 rounded-xl flex items-center justify-between hover:border-primary-300 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${typeColors[type]} bg-opacity-80`}>
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{name}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-semibold">
            <span>{type}</span>
            <span>•</span>
            <span>{size}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onView}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-all" 
          title="Ver documento"
        >
          <Eye size={16} />
        </button>
        <button 
          onClick={onDownload}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-all" 
          title="Descargar"
        >
          <Download size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-all" 
          title="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
