import React, { useState } from 'react';
import { Copy, ExternalLink, ShieldCheck, Building2, CreditCard, PiggyBank, Share2 } from 'lucide-react';
import Badge from '../shared/Badge';

const AccountCard = ({ acc, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const textToShare = `Bank Details:\nBank: ${acc.bankName}\nAccount Holder: ${acc.member}\nAccount Number: ${acc.accountNumber}${acc.ifscCode ? `\nIFSC/Routing: ${acc.ifscCode}` : ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${acc.bankName} Account Details`,
          text: textToShare
        });
      } catch (err) {
        console.error('Share failed', err);
        // Fallback or silently ignore if user cancelled
      }
    } else {
      // Fallback to clipboard if Web Share API is unavailable
      handleCopy(textToShare);
      alert('Details copied to clipboard!');
    }
  };

  // Mock category colors
  const typeIcons = {
    'Savings': <PiggyBank size={24} className="text-white" />,
    'Current': <Building2 size={24} className="text-white" />,
    'Credit Card': <CreditCard size={24} className="text-white" />,
    'Loan': <Building2 size={24} className="text-white" />
  };
  const typeColors = {
    'Savings': 'bg-emerald-500',
    'Current': 'bg-indigo-500',
    'Credit Card': 'bg-pink-500',
    'Loan': 'bg-red-500'
  };
  const bgColor = typeColors[acc.accountType] || 'bg-slate-500';
  const Icon = typeIcons[acc.accountType] || <Building2 size={24} className="text-white" />;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg group relative">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center font-bold text-white shadow-lg`}>
            {Icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-1.5">
              {acc.bankName}
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">{acc.accountType}</div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <button 
            onClick={handleShare}
            className="p-1.5 text-slate-400 hover:text-indigo-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors shadow-sm"
            title="Share Details"
          >
            <Share2 size={16} />
          </button>
          <Badge variant="default" className="text-[10px] uppercase tracking-wider">{acc.member}</Badge>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {/* Account Number */}
        <div className="bg-slate-900/50 rounded-xl p-3 flex justify-between items-center group/field hover:bg-slate-900 transition-colors border border-white/5">
          <div className="overflow-hidden">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Account Number</div>
            <div className="text-sm font-mono tracking-wider text-slate-300 truncate">{acc.accountNumber}</div>
          </div>
          <button 
            onClick={() => handleCopy(acc.accountNumber)}
            className="p-1.5 text-slate-500 hover:text-slate-300 opacity-0 group-hover/field:opacity-100 transition-opacity" title="Copy Number"
          >
            {copied ? <ShieldCheck size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        {/* IFSC / Routing */}
        {acc.ifscCode && (
        <div className="bg-slate-900/50 rounded-xl p-3 flex justify-between items-center group/field hover:bg-slate-900 transition-colors border border-white/5">
          <div className="overflow-hidden w-full">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex justify-between">
              IFSC / Routing Code
            </div>
            <div className="text-sm font-mono tracking-widest text-slate-300 truncate">
              {acc.ifscCode}
            </div>
          </div>
          <button 
            onClick={() => handleCopy(acc.ifscCode)}
            className="p-1.5 text-slate-500 hover:text-slate-300 opacity-0 group-hover/field:opacity-100 transition-opacity" title="Copy IFSC"
          >
            <Copy size={16} />
          </button>
        </div>
        )}

        {/* Notes */}
        {acc.notes && (
           <div className="text-xs text-slate-400 bg-slate-900/30 p-3 rounded-lg border border-white/5 line-clamp-2">
             {acc.notes}
           </div>
        )}
      </div>
    </div>
  );
};

export default AccountCard;
