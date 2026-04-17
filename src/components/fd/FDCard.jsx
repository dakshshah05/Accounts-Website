import React from 'react';
import { Pencil, Trash2, Landmark, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../shared/Badge';

const FDCard = ({ fd, onEdit, onDelete }) => {
  // Determine status
  let status = fd.status || 'Active';
  let badgeVariant = 'success';
  
  const now = new Date();
  const maturityDate = new Date(fd.maturityDate);
  const daysUntilMaturity = (maturityDate - now) / (1000 * 60 * 60 * 24);

  if (daysUntilMaturity <= 0 && status !== 'Closed') {
    status = 'Matured';
    badgeVariant = 'warning';
  } else if (status === 'Closed') {
    badgeVariant = 'default';
  }

  // Find member color (Mock colors logic, ideally passed down via context or saved on FD)
  const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500'];
  const memberColor = fd.memberColor || colors[fd.member?.length % colors.length || 0];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg relative group flex flex-col justify-between">
      
      {/* Background glow based on member */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${memberColor} opacity-5 rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-10`} />

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${memberColor} rounded-xl flex items-center justify-center font-bold text-white shadow-lg`}>
              {fd.member?.charAt(0) || '?'}
            </div>
            <div>
              <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                <Landmark size={14} className="text-indigo-400" />
                {fd.bank}
              </div>
              <div className="text-xs text-slate-400 border border-slate-700 bg-slate-800/50 px-2 py-0.5 rounded inline-block mt-1 uppercase tracking-wider">
                {fd.accountNumber ? `A/C **${fd.accountNumber.slice(-4)}` : 'No A/C No'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant}>{status}</Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-slate-800/80 backdrop-blur rounded-lg border border-white/10 p-1">
              <button onClick={() => onEdit(fd)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-md transition-colors" title="Edit">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(fd)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors" title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 my-5">
          <div>
            <div className="text-xs text-slate-500 mb-1">Principal Amount</div>
            <div className="text-lg font-semibold text-slate-200">{formatCurrency(fd.principal)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Interest Rate</div>
            <div className="text-lg font-semibold text-emerald-400">{fd.rate}% <span className="text-xs font-normal text-slate-500">p.a.</span></div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Tenure</div>
            <div className="text-sm font-medium text-slate-300">{fd.tenure} months</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">FD Type</div>
            <div className="text-sm font-medium text-slate-300">{fd.type}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mt-2">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
              Matures on 
              {daysUntilMaturity > 0 && daysUntilMaturity <= 30 && (
                 <ShieldAlert size={12} className="text-amber-500" />
              )}
            </div>
            <div className={clsx("text-sm font-medium", daysUntilMaturity > 0 && daysUntilMaturity <= 30 ? "text-amber-400" : "text-slate-300")}>
              {new Date(fd.maturityDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Maturity Value</div>
            <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              {formatCurrency(fd.maturityAmount)}
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-4 flex justify-between items-center text-[10px] text-slate-600">
          <span>{fd.nomination && `Nominee: ${fd.nomination}`}</span>
          <span>Last edited by {fd.updatedBy || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default FDCard;
