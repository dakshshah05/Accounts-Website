import React, { useState } from 'react';
import { Eye, EyeOff, Copy, ExternalLink, ShieldCheck, Pencil, Trash2 } from 'lucide-react';
import Badge from '../shared/Badge';

const PasswordCard = ({ pwd, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock categor colors
  const categoryColors = {
    Banking: 'bg-indigo-500',
    'Social Media': 'bg-pink-500',
    Email: 'bg-red-500',
    Government: 'bg-amber-500',
    Subscriptions: 'bg-purple-500',
    Other: 'bg-slate-500'
  };
  const bgColor = categoryColors[pwd.category] || categoryColors.Other;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg group relative">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center font-bold text-white shadow-lg`}>
            {pwd.service?.charAt(0) || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => window.open(pwd.url || '#', '_blank')}>
              {pwd.service}
              {pwd.url && <ExternalLink size={12} className="opacity-50" />}
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">{pwd.category}</div>
          </div>
        </div>
        
        <div className="flex gap-1.5 items-center">
          <button 
            onClick={() => onEdit(pwd)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-white/10 rounded-lg transition-colors"
            title="Edit Password"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(pwd)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
            title="Delete Password"
          >
            <Trash2 size={16} />
          </button>
          <div className="ml-1">
            <Badge variant="default" className="text-[10px] uppercase tracking-wider px-2 py-0.5">{pwd.member}</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {/* Username */}
        <div className="bg-slate-900/50 rounded-xl p-3 flex justify-between items-center group/field hover:bg-slate-900 transition-colors border border-white/5">
          <div className="overflow-hidden">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Username / Email</div>
            <div className="text-sm text-slate-300 truncate">{pwd.username}</div>
          </div>
          <button 
            onClick={() => handleCopy(pwd.username)}
            className="p-1.5 text-slate-500 hover:text-slate-300 opacity-0 group-hover/field:opacity-100 transition-opacity" title="Copy Username"
          >
            {copied ? <ShieldCheck size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        {/* Password */}
        <div className="bg-slate-900/50 rounded-xl p-3 flex justify-between items-center group/field hover:bg-slate-900 transition-colors border border-white/5">
          <div className="overflow-hidden w-full">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex justify-between">
              Password
            </div>
            <div className="text-sm font-mono tracking-widest text-slate-300 truncate">
              {showPassword ? pwd.password : '••••••••••••'}
            </div>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-opacity" title="Reveal"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button 
              onClick={() => handleCopy(pwd.password)}
              className="p-1.5 text-slate-500 hover:text-slate-300 opacity-0 group-hover/field:opacity-100 transition-opacity" title="Copy Password"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordCard;
