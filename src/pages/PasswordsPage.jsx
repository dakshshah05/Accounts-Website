import React, { useState } from 'react';
import PasswordCard from '../components/passwords/PasswordCard';
import PasswordForm from '../components/passwords/PasswordForm';
import Modal from '../components/shared/Modal';
import EmptyState from '../components/shared/EmptyState';
import MemberFilterTabs from '../components/shared/MemberFilterTabs';
import { KeyRound, Plus, Shield } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { usePasswords } from '../hooks/usePasswords';
import { useMembers } from '../hooks/useMembers';

const PasswordsPage = () => {
  const { state } = useFamilyData();
  const { passwords, addPassword, updatePassword, deletePassword } = usePasswords();
  const { members, addMember } = useMembers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPwd, setEditingPwd] = useState(null);

  const handleOpenModal = (pwd = null) => {
    setEditingPwd(pwd);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingPwd(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPwd) await updatePassword(editingPwd.id, formData);
      else await addPassword(formData);

      if (formData.member && !members.some(m => m.name.toLowerCase() === formData.member.toLowerCase())) {
        await addMember({ name: formData.member, role: 'member' });
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Error saving Password! Check Firebase Database Rules.");
    }
  };

  const handleDelete = async (pwd) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      try {
        await deletePassword(pwd.id);
      } catch (err) {
        alert("Delete failed! Check Firebase Database Rules.");
      }
    }
  };

  const processedPwd = passwords.filter(pwd => 
    state.memberFilter === 'All' || pwd.member === state.memberFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="text-indigo-400" /> Passwords Vault
          </h1>
          <p className="text-slate-400 text-sm mt-1">End-to-end security for shared family credentials.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25 w-fit">
          <Plus size={16} /> New Password
        </button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-xl flex items-center gap-2 text-sm">
        <Shield size={16} className="text-amber-500 flex-shrink-0" /> 
        <div>This is a seamless mock state layout interface. Features are fully interactive locally.</div>
      </div>

      {/* Filters */}
      <div className="pt-2">
        <MemberFilterTabs />
      </div>

      {processedPwd.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {processedPwd.map(pwd => (
            <PasswordCard 
              key={pwd.id} 
              pwd={pwd} 
              onEdit={handleOpenModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={KeyRound}
          title="No Passwords Saved"
          description="Your vault is currently empty. Add sensitive credentials directly."
          action={
            <button onClick={() => handleOpenModal()} className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium">+ File a new Password</button>
          }
        />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPwd ? "Edit Vault Password" : "New Vault Password"}>
        <PasswordForm initialData={editingPwd} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default PasswordsPage;
