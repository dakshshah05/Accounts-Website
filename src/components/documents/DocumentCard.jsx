import React from 'react';
import { FileText, Download, Eye, CalendarClock } from 'lucide-react';
import Badge from '../shared/Badge';

const DocumentCard = ({ doc, onEdit, onDelete }) => {
  const isExpiringSoon = false; // Mock logic
  const isExpired = false;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg group relative flex flex-col justify-between">
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 placeholder-slate-200">{doc.label}</h3>
            <div className="text-xs text-slate-400 mt-0.5">{doc.type}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge variant="primary" className="text-[10px] uppercase tracking-wider">{doc.member}</Badge>
          <div className="flex gap-1 bg-slate-800/80 backdrop-blur rounded-lg border border-white/10 p-1">
            {doc.fileUrl && (
              <>
                <button onClick={() => window.open(doc.fileUrl, '_blank')} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-md transition-colors" title="View">
                  <Eye size={16} />
                </button>
                <button onClick={() => {
                  const a = document.createElement('a');
                  a.href = doc.fileUrl;
                  a.download = doc.fileName || 'document';
                  a.click();
                }} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-md transition-colors" title="Download">
                  <Download size={16} />
                </button>
              </>
            )}
            {onEdit && (
              <button onClick={() => onEdit(doc)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-md transition-colors" title="Edit">
                <span className="text-xs font-semibold px-1">Edit</span>
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(doc)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors" title="Delete">
                <span className="text-xs font-semibold px-1">Del</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-white/5 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Document No.</div>
          <div className="text-sm font-mono tracking-widest text-slate-300">{doc.docNumber}</div>
        </div>
      </div>

      {(doc.issueDate || doc.expiryDate) && (
        <div className="mt-4 border-t border-white/10 pt-4 flex justify-between text-xs text-slate-400">
          {doc.issueDate && (
            <div>
              <span className="block text-[10px] text-slate-500 uppercase mb-0.5">Issued</span>
              {doc.issueDate}
            </div>
          )}
          {doc.expiryDate && (
            <div className="text-right flex items-center gap-1 text-amber-400">
              <CalendarClock size={12} />
              <div>
                <span className="block text-[10px] text-amber-500/70 uppercase mb-0.5">Expires</span>
                {doc.expiryDate}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
