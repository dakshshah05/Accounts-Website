import React from 'react';
import EmptyState from '../components/shared/EmptyState';
import { Users } from 'lucide-react';

const FamilyMembersPage = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-indigo-400" /> Family Members
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage family access and roles.</p>
        </div>
      </div>
      <EmptyState 
        icon={Users}
        title="Family Members"
        description="Invite and manage members of your family vault."
      />
    </div>
  );
};

export default FamilyMembersPage;
