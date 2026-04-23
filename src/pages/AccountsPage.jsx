import React, { useState } from 'react';
import AccountCard from '../components/accounts/AccountCard';
import AccountForm from '../components/accounts/AccountForm';
import Modal from '../components/shared/Modal';
import EmptyState from '../components/shared/EmptyState';
import MemberFilterTabs from '../components/shared/MemberFilterTabs';
import { Landmark, Plus, Shield } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { useAccounts } from '../hooks/useAccounts';
import { useMembers } from '../hooks/useMembers';

const AccountsPage = () => {
  const { state } = useFamilyData();
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { members, addMember } = useMembers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);

  const handleOpenModal = (acc = null) => {
    setEditingAcc(acc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAcc(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingAcc) await updateAccount(editingAcc.id, formData);
      else await addAccount(formData);

      if (formData.member && !members.some(m => m.name.toLowerCase() === formData.member.toLowerCase())) {
        await addMember({ name: formData.member, role: 'member' });
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Error saving Account! Check Firebase Database Rules.");
    }
  };

  const handleDelete = async (acc) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(acc.id);
      } catch (err) {
        alert("Delete failed! Check Firebase Database Rules.");
      }
    }
  };

  const processedAcc = accounts.filter(acc => 
    state.memberFilter === 'All' || acc.member === state.memberFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Landmark className="text-emerald-400" /> Bank Accounts
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage family bank accounts, credit cards, and loans securely.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/25 w-fit">
          <Plus size={16} /> New Account
        </button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-xl flex items-center gap-2 text-sm">
        <Shield size={16} className="text-amber-500 flex-shrink-0" /> 
        <div>Your account numbers and details are securely stored under your isolated family database.</div>
      </div>

      {/* Filters */}
      <div className="pt-2">
        <MemberFilterTabs />
      </div>

      {processedAcc.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {processedAcc.map(acc => (
            <AccountCard 
              key={acc.id} 
              acc={acc} 
              onEdit={handleOpenModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Landmark}
          title="No Accounts Saved"
          description="Your vault currently has no bank accounts linked. Add one to keep track."
          action={
            <button onClick={() => handleOpenModal()} className="mt-4 text-emerald-400 hover:text-emerald-300 font-medium">+ Add a new Account</button>
          }
        />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAcc ? "Edit Bank Account" : "New Bank Account"}>
        <AccountForm initialData={editingAcc} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default AccountsPage;
