import React, { useState } from 'react';
import DocumentCard from '../components/documents/DocumentCard';
import { FileText, Plus, UploadCloud } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';

const DocumentsPage = () => {
  // Mock Data
  const [documents] = useState([
    {
      id: '1', member: 'Papa', type: 'Govt ID', label: 'PAN Card', 
      docNumber: 'ABCDE1234F', issueDate: '12/04/2010', expiryDate: null
    },
    {
      id: '2', member: 'Mummy', type: 'Insurance', label: 'Health Policy - Star Health', 
      docNumber: 'POL-123***89', issueDate: '01/01/2023', expiryDate: '31/12/2024'
    },
    {
      id: '3', member: 'Daksh', type: 'Identity', label: 'Passport', 
      docNumber: 'Z123***8', issueDate: '15/06/2018', expiryDate: '14/06/2028'
    }
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto opacity-0 animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="text-indigo-400" /> Important Documents
          </h1>
          <p className="text-slate-400 text-sm mt-1">Securely store and share KYC & family documents.</p>
        </div>

        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25 w-fit">
          <UploadCloud size={16} /> Upload Doc
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {documents.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
      </div>
    </div>
  );
};

export default DocumentsPage;
