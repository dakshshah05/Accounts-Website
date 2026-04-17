import React, { useState } from 'react';
import DocumentCard from '../components/documents/DocumentCard';
import DocumentForm from '../components/documents/DocumentForm';
import Modal from '../components/shared/Modal';
import EmptyState from '../components/shared/EmptyState';
import { FileText, UploadCloud } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { useDocuments } from '../hooks/useDocuments';

const DocumentsPage = () => {
  const { state } = useFamilyData();
  const { documents, addDocument, updateDocument, deleteDocument } = useDocuments();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const handleOpenModal = (doc = null) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingDoc(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    if (editingDoc) await updateDocument(editingDoc.id, formData);
    else await addDocument(formData);
    handleCloseModal();
  };

  const handleDelete = async (doc) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(doc.id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto opacity-0 animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="text-indigo-400" /> Important Documents
          </h1>
          <p className="text-slate-400 text-sm mt-1">Securely store and share KYC & family documents.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25 w-fit">
          <UploadCloud size={16} /> Upload Doc
        </button>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {documents.map(doc => (
            <div key={doc.id} className="relative group">
              <DocumentCard doc={doc} />
              {/* Optional inline generic edit/del actions for the mockup */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button onClick={() => handleOpenModal(doc)} className="bg-slate-800 border border-white/10 text-white p-1.5 rounded-lg hover:bg-slate-700 text-xs">Edit</button>
                <button onClick={() => handleDelete(doc)} className="bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg hover:bg-red-500/40 text-xs">Del</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FileText}
          title="No Documents Uploaded"
          description="Keep your important family documents completely mapped and tracked here."
          action={<button onClick={() => handleOpenModal()} className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium">+ Upload your first document</button>}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingDoc ? "Edit Document" : "Upload Document"}>
        <DocumentForm initialData={editingDoc} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default DocumentsPage;
