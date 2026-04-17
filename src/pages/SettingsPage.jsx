import React from 'react';
import EmptyState from '../components/shared/EmptyState';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="text-indigo-400" /> Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure your vault preferences.</p>
        </div>
      </div>
      <EmptyState 
        icon={Settings}
        title="App Settings"
        description="Configuration for Vault themes, security pins, and export features will appear here."
      />
    </div>
  );
};

export default SettingsPage;
