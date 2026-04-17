import React from 'react';
import { X, Download, FileText } from 'lucide-react';

const DocumentViewer = ({ isOpen, onClose, doc }) => {
  if (!isOpen || !doc) return null;

  const isImage = doc.fileUrl?.startsWith('data:image/');
  const isPDF = doc.fileUrl?.startsWith('data:application/pdf');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Content Container */}
      <div className="relative w-full max-w-5xl max-h-full bg-slate-900 rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">{doc.label}</h3>
              <p className="text-xs text-slate-400 capitalize">{doc.type}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const a = document.createElement('a');
                a.href = doc.fileUrl;
                a.download = doc.fileName || 'document';
                a.click();
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2 px-4 border border-white/10"
            >
              <Download size={18} />
              <span className="text-sm font-medium hidden sm:inline">Download</span>
            </button>
            
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 overflow-auto p-4 md:p-10 flex items-center justify-center min-h-[50vh]">
          {isImage ? (
            <img 
              src={doc.fileUrl} 
              alt={doc.label} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          ) : isPDF ? (
            <iframe 
              src={doc.fileUrl} 
              className="w-full h-full min-h-[70vh] rounded-lg border-0"
              title={doc.label}
            />
          ) : (
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-400">Preview not available for this file type.</p>
              <button 
                 onClick={() => window.open(doc.fileUrl)}
                 className="mt-4 text-indigo-400 hover:underline"
              >
                Try opening in new tab
              </button>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-4 bg-slate-900/80 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                Owner: {doc.member} • Document No: {doc.docNumber || 'N/A'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
