import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { userProfile, logout } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/10 bg-slate-800/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex-1 max-w-md ml-12 md:ml-0 hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 rounded-full border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-slate-900 transition-colors">
        <Search size={16} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search vault..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-500"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-white/5">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10 relative group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{userProfile?.name || 'User'}</div>
            <div className="text-xs text-slate-400 capitalize">{userProfile?.role || 'Member'}</div>
          </div>
          <div className={`w-9 h-9 rounded-full ${userProfile?.color || 'bg-slate-600'} flex items-center justify-center font-bold text-sm cursor-pointer`}>
            {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {/* Dropdown via hover */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
