import React, { useState, useEffect } from 'react';
import { calculateMaturity } from '../../utils/calculateMaturity';
import { useMembers } from '../../hooks/useMembers';

const FDForm = ({ initialData, onSubmit, onCancel }) => {
  const { members } = useMembers();

  const [formData, setFormData] = useState({
    member: initialData?.member || '',
    bank: initialData?.bank || '',
    accountNumber: initialData?.accountNumber || '',
    principal: initialData?.principal || '',
    rate: initialData?.rate || '',
    frequency: initialData?.frequency || 'Yearly',
    type: initialData?.type || 'Cumulative',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    tenure: initialData?.tenure || '',
    nomination: initialData?.nomination || '',
    notes: initialData?.notes || '',
    maturityAmount: initialData?.maturityAmount || '',
    maturityDate: initialData?.maturityDate || ''
  });

  // Auto calculate
  useEffect(() => {
    if (formData.principal && formData.rate && formData.tenure && formData.startDate) {
      const { amount, date } = calculateMaturity(
        formData.principal, 
        formData.rate, 
        formData.tenure, 
        formData.startDate, 
        formData.frequency
      );
      setFormData(prev => ({
        ...prev,
        maturityAmount: amount,
        maturityDate: date
      }));
    }
  }, [formData.principal, formData.rate, formData.tenure, formData.startDate, formData.frequency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...formData, status: 'Active'});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Family Member</label>
          <input 
            type="text"
            name="member" 
            list="member-list-fds"
            required
            placeholder="Type or select name"
            value={formData.member} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <datalist id="member-list-fds">
            {members.map(m => <option key={m.id} value={m.name} />)}
          </datalist>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Bank Name</label>
          <input 
            type="text" 
            name="bank"
            required
            value={formData.bank} 
            onChange={handleChange}
            placeholder="e.g. HDFC Bank"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Account Number</label>
          <input 
            type="text" 
            name="accountNumber"
            value={formData.accountNumber} 
            onChange={handleChange}
            placeholder="Last 4 digits or full"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Principal Amount (₹)</label>
          <input 
            type="number" 
            name="principal"
            required
            min="0"
            value={formData.principal} 
            onChange={handleChange}
            placeholder="10000"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Interest Rate (% p.a.)</label>
          <input 
            type="number" 
            name="rate"
            required
            step="0.01"
            min="0"
            value={formData.rate} 
            onChange={handleChange}
            placeholder="7.5"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Tenure (Months)</label>
          <input 
            type="number" 
            name="tenure"
            required
            min="1"
            value={formData.tenure} 
            onChange={handleChange}
            placeholder="12"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
          <input 
            type="date" 
            name="startDate"
            required
            value={formData.startDate} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Compounding</label>
          <select 
            name="frequency" 
            value={formData.frequency} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
          >
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Half-Yearly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      {/* Auto-calculated preview box */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex justify-between items-center">
        <div>
          <div className="text-sm font-medium text-indigo-300">Expected Maturity</div>
          <div className="text-xs text-indigo-500/70">Calculated automatically</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-indigo-400">
            ₹{Number(formData.maturityAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-indigo-300">
            on {formData.maturityDate ? new Date(formData.maturityDate).toLocaleDateString() : '---'}
          </div>
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
          className="flex-1 py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition-all font-medium"
        >
          {initialData ? 'Save Changes' : 'Add FD'}
        </button>
      </div>
    </form>
  );
};

export default FDForm;
