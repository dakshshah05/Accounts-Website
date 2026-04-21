import React, { useState } from 'react';
import { useMembers } from '../../hooks/useMembers';

const AccountForm = ({ initialData, onSubmit, onCancel }) => {
  const { members } = useMembers();

  const [formData, setFormData] = useState({
    member: initialData?.member || '',
    accountType: initialData?.accountType || 'Savings',
    bankName: initialData?.bankName || '',
    accountNumber: initialData?.accountNumber || '',
    ifscCode: initialData?.ifscCode || '',
    notes: initialData?.notes || ''
  });

  const accountTypes = ['Savings', 'Current', 'Credit Card', 'Loan', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          <label className="block text-sm font-medium text-slate-300 mb-1">Account Type</label>
          <select 
            name="accountType" 
            value={formData.accountType} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
          >
            {accountTypes.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Bank Name</label>
          <input 
            type="text" 
            name="bankName"
            required
            value={formData.bankName} 
            onChange={handleChange}
            placeholder="e.g. HDFC Bank, SBI"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Account / Card Number</label>
          <input 
            type="text" 
            name="accountNumber"
            required
            value={formData.accountNumber} 
            onChange={handleChange}
            placeholder="Enter account number"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">IFSC / Routing Code</label>
          <input 
            type="text" 
            name="ifscCode"
            value={formData.ifscCode} 
            onChange={handleChange}
            placeholder="e.g. HDFC0001234"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Additional Notes</label>
          <input 
            type="text" 
            name="notes"
            value={formData.notes} 
            onChange={handleChange}
            placeholder="e.g. Branch name, UPI ID linked..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
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
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all font-medium"
        >
          {initialData ? 'Save Changes' : 'Save Account'}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
