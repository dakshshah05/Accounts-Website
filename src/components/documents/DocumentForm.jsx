import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';

const DocumentForm = ({ initialData, onSubmit, onCancel }) => {
  const { members } = useMembers();

  const [formData, setFormData] = useState({
    member: initialData?.member || '',
    type: initialData?.type || 'Identity',
    label: initialData?.label || '',
    docNumber: initialData?.docNumber || '',
    issueDate: initialData?.issueDate || '',
    expiryDate: initialData?.expiryDate || '',
    notes: initialData?.notes || ''
  });
  
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || null);
  const [fileName, setFileName] = useState(initialData?.fileName || "");

  const docTypes = ['Identity', 'Banking', 'Insurance', 'Property', 'Medical', 'Education', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File is too large! For the free plan, please keep files under 1MB (compress the image if needed).");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result); // Base64 string
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, fileUrl, fileName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Family Member</label>
          <select
            name="member"
            required
            value={formData.member}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
          >
            <option value="" disabled>Select a family member</option>
            {members.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Document Category</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
          >
            {docTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Document Label / Name</label>
          <input 
            type="text" 
            name="label"
            required
            value={formData.label} 
            onChange={handleChange}
            placeholder="e.g. Aadhaar Card, Max Life Policy"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Document Number</label>
          <input 
            type="text" 
            name="docNumber"
            value={formData.docNumber} 
            onChange={handleChange}
            placeholder="e.g. XXXX-XXXX-1234"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Issue Date</label>
          <input 
            type="date" 
            name="issueDate"
            value={formData.issueDate} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date (Optional)</label>
          <input 
            type="date" 
            name="expiryDate"
            value={formData.expiryDate} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* File Upload Area */}
      <div className="relative group cursor-pointer">
        <label className="cursor-pointer block w-full p-8 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-center group-hover:border-indigo-500/50">
          <input type="file" className="hidden" onChange={handleFileChange} />
          {!fileUrl ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
              </div>
              <div className="text-sm font-medium text-slate-200">Click to upload file</div>
              <div className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-emerald-400 font-medium">✓ File Attached Successfully</div>
              <div className="text-xs text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded">{fileName || 'Attached file'}</div>
              <div className="text-xs text-slate-500 mt-2">Click to replace</div>
            </div>
          )}
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t border-white/10">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="flex-1 py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition-all font-medium"
        >
          {initialData ? 'Save Changes' : 'Upload Document'}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
