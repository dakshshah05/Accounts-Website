import React, { useState } from 'react';

const MemberForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    password: initialData?.password || '',
    role: initialData?.role || 'member',
  });

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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Member Name</label>
          <input 
            type="text" 
            name="name"
            required
            value={formData.name} 
            onChange={handleChange}
            placeholder="e.g. Rahul, Pooja"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Member Password</label>
          <input 
            type="text" 
            name="password"
            required
            value={formData.password} 
            onChange={handleChange}
            placeholder="Password for this member to login"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Access Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
          >
            <option value="admin">Administrator (Full Access)</option>
            <option value="member">Member (View & Add)</option>
            <option value="guest">Guest (View Only)</option>
          </select>
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
          {initialData ? 'Save Changes' : 'Invite Member'}
        </button>
      </div>
    </form>
  );
};

export default MemberForm;
