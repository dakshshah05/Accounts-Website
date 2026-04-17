import React, { useState } from 'react';
import { useMembers } from '../../hooks/useMembers';

const PasswordForm = ({ initialData, onSubmit, onCancel }) => {
  const { members } = useMembers();

  const [formData, setFormData] = useState({
    member: initialData?.member || '',
    category: initialData?.category || 'Banking',
    service: initialData?.service || '',
    url: initialData?.url || '',
    username: initialData?.username || '',
    password: initialData?.password || '',
    notes: initialData?.notes || ''
  });

  const categories = ['Banking', 'Social Media', 'Email', 'Government', 'Subscriptions', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(formData.password);
  const strengthColors = ['bg-slate-700', 'bg-red-500', 'bg-amber-500', 'bg-emerald-400', 'bg-emerald-600'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Family Member</label>
          <input 
            type="text"
            name="member" 
            list="member-list-pwds"
            required
            placeholder="Type or select name"
            value={formData.member} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <datalist id="member-list-pwds">
            {members.map(m => <option key={m.id} value={m.name} />)}
          </datalist>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Service / Website</label>
          <input 
            type="text" 
            name="service"
            required
            value={formData.service} 
            onChange={handleChange}
            placeholder="e.g. Netflix, SBI NetBanking"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Login URL (optional)</label>
          <input 
            type="url" 
            name="url"
            value={formData.url} 
            onChange={handleChange}
            placeholder="https://..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Username / Email</label>
          <input 
            type="text" 
            name="username"
            required
            value={formData.username} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <div className="relative">
            <input 
              type="text" 
              name="password"
              required
              value={formData.password} 
              onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors pr-10"
            />
            {/* Password Strength Indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
              {[1,2,3,4].map(level => (
                <div key={level} className={`w-1.5 h-1.5 rounded-full ${strength >= level ? strengthColors[strength] : 'bg-slate-700'}`} />
              ))}
            </div>
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
          {initialData ? 'Save Changes' : 'Vault Password'}
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;
