import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const LoginPage = () => {
  const { demoLogin } = useAuth();
  const [name, setName] = useState('');

  const handleDemoLogin = (e) => {
    e.preventDefault();
    if(name.trim()) demoLogin(name);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">Family Vault</h1>
          <p className="text-slate-400 mt-2">Secure digital storage for your family</p>
        </div>

        <form onSubmit={handleDemoLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Your Name (Demo)</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Papa, Mummy, Daksh"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/25"
          >
            Enter Vault
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>This is a demo version. Real auth involves email/password and Firebase Authentication.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
