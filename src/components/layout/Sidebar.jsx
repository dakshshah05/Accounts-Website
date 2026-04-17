import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Landmark, KeyRound, FileText, Settings, Menu, X, Users } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Fixed Deposits', path: '/fds', icon: Landmark },
    { name: 'Passwords', path: '/passwords', icon: KeyRound },
    { name: 'Documents', path: '/documents', icon: FileText },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Family Members', path: '/members', icon: Users });
  }
  menuItems.push({ name: 'Settings', path: '/settings', icon: Settings });

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-md border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar background overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar sidebar content */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-white/10 transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            FV
          </div>
          <span className="text-xl font-bold tracking-wide">Family Vault</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <item.icon size={20} className={({ isActive }) => isActive ? "text-indigo-400" : ""} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 m-4 rounded-xl bg-slate-900/50 border border-white/5">
          <div className="text-xs text-slate-500 text-center">
            Family Vault v1.0 <br />
            Secure & Real-time
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
