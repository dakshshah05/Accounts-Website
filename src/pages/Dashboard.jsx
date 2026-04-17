import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFDs } from '../hooks/useFDs';
import { usePasswords } from '../hooks/usePasswords';
import { useDocuments } from '../hooks/useDocuments';
import { Landmark, KeyRound, FileText, AlertTriangle, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const Dashboard = () => {
  const { userProfile } = useAuth();
  // Depending on how firebase is setup, these might return empty if no config. 
  // We'll calculate based on what's returned.
  const { fds, loading: loadingFds } = useFDs();
  const { passwords, loading: loadingPwds } = usePasswords();
  const { documents, loading: loadingDocs } = useDocuments();

  // MOCK DATA for wow effect if firebase lists are empty and still loading or failed.
  // In a generic scenario, if arrays are empty, we display empty states.
  // We will assume real arrays for now.

  const safeFds = fds || [];
  const totalFdValue = safeFds.reduce((acc, fd) => acc + Number(fd.principal || 0), 0);
  const totalMaturityValue = safeFds.reduce((acc, fd) => acc + Number(fd.maturityAmount || fd.principal || 0), 0);

  // Find nearest maturity
  const now = new Date();
  const upcomingMaturities = safeFds
    .filter(fd => fd.maturityDate && new Date(fd.maturityDate) > now)
    .sort((a, b) => new Date(a.maturityDate) - new Date(b.maturityDate));
  
  const nearestMaturity = upcomingMaturities[0];
  const maturingWithin30Days = upcomingMaturities.filter(
    fd => (new Date(fd.maturityDate) - now) / (1000 * 60 * 60 * 24) <= 30
  );

  const stats = [
    { label: 'Total FDs', value: safeFds.length, icon: Landmark, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Passwords', value: passwords?.length || 0, icon: KeyRound, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Documents', value: documents?.length || 0, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto opacity-0 animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Welcome back, {userProfile?.name}!
          </h1>
          <p className="text-slate-400 mt-1">Here is the latest snapshot of your family's vault.</p>
        </div>
      </header>

      {/* Maturity Alert Banner */}
      {maturingWithin30Days.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <AlertTriangle className="text-amber-500 flex-shrink-0" />
          <div>
            <span className="font-semibold text-amber-400">Attention:</span> You have {maturingWithin30Days.length} FD{maturingWithin30Days.length > 1 ? 's' : ''} maturing within the next 30 days.
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main FD Summary Card */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Total FD Value</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(totalFdValue)}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Maturity Value</h3>
            <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalMaturityValue)}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Nearest Maturity</h3>
            <p className="text-lg font-medium text-amber-300 block truncate">
              {nearestMaturity ? new Date(nearestMaturity.maturityDate).toLocaleDateString() : 'N/A'}
            </p>
            {nearestMaturity && <p className="text-xs text-slate-500">{nearestMaturity.bank} - {formatCurrency(nearestMaturity.maturityAmount)}</p>}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Yielding</h3>
            <p className="text-lg font-medium text-indigo-300">
              +{formatCurrency(totalMaturityValue - totalFdValue)} Total Interest
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        {stats.map((stat, i) => (
          <div key={i} className="flex p-6 rounded-2xl bg-slate-800/80 border border-white/5 hover:-translate-y-1 hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl group">
            <div className={`w-14 h-14 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
              <h3 className="text-sm font-medium text-slate-400">{stat.label}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="col-span-1 lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-indigo-400" />
            Recent Activity
          </h2>
          {/* Mock Activity List */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs">P</div>
              <div>
                <p className="text-sm"><span className="font-semibold text-slate-200">Papa</span> added a new Fixed Deposit <span className="text-indigo-400">HDFC Bank</span></p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">D</div>
              <div>
                <p className="text-sm"><span className="font-semibold text-slate-200">Daksh</span> updated password for <span className="text-indigo-400">Netflix</span></p>
                <p className="text-xs text-slate-500">Yesterday at 4:30 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-xs">M</div>
              <div>
                <p className="text-sm"><span className="font-semibold text-slate-200">Mummy</span> uploaded document <span className="text-indigo-400">Aadhaar Card</span></p>
                <p className="text-xs text-slate-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Family Members Row */}
        <div className="col-span-1 p-6 rounded-2xl bg-slate-800/80 border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">Family Members</h2>
          <div className="space-y-3">
            {[
              { name: 'Papa', role: 'admin', color: 'bg-emerald-500', online: true },
              { name: 'Mummy', role: 'admin', color: 'bg-amber-500', online: false },
              { name: 'Daksh', role: 'member', color: 'bg-indigo-500', online: true }
            ].map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                    {member.name[0]}
                  </div>
                  {member.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{member.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
