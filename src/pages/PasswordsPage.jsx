import React, { useState } from 'react';
import PasswordCard from '../components/passwords/PasswordCard';
import EmptyState from '../components/shared/EmptyState';
import { KeyRound, Plus, Lock, Shield } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';

const PasswordsPage = () => {
  const { state } = useFamilyData();
  
  // Mock Data since we are skipping full form for brevity
  const [passwords] = useState([
    {
      id: '1', member: 'Papa', category: 'Banking', service: 'HDFC NetBanking', 
      url: 'https://netbanking.hdfcbank.com', username: 'cust123456', password: 'SecretPassword123'
    },
    {
      id: '2', member: 'Daksh', category: 'Social Media', service: 'Instagram', 
      url: 'https://instagram.com', username: 'daksh_ig', password: 'InstaPass!@#'
    }
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto opacity-0 animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="text-indigo-400" /> Passwords Vault
          </h1>
          <p className="text-slate-400 text-sm mt-1">End-to-end security for shared family credentials.</p>
        </div>

        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25 w-fit">
          <Plus size={16} /> New Password
        </button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-xl flex items-center gap-2 text-sm">
        <Shield size={16} className="text-amber-500" /> This is a mockup interface. In production, passwords should be encrypted client-side using CryptoJS before storing.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {passwords.map(pwd => <PasswordCard key={pwd.id} pwd={pwd} />)}
      </div>
    </div>
  );
};

export default PasswordsPage;
