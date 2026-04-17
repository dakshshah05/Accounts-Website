import React, { useState } from 'react';
import EmptyState from '../components/shared/EmptyState';
import Modal from '../components/shared/Modal';
import MemberForm from '../components/members/MemberForm';
import { Users, Plus, Shield, User } from 'lucide-react';
import { useMembers } from '../hooks/useMembers';

const FamilyMembersPage = () => {
  const { members, addMember, updateMember, deleteMember } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const handleOpenModal = (member = null) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingMember(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    if (editingMember) {
      await updateMember(editingMember.id, formData);
    } else {
      await addMember(formData);
    }
    handleCloseModal();
  };

  const handleDelete = async (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
      await deleteMember(member.id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-indigo-400" /> Family Members
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage family access and roles.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25 w-fit">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {members.map(member => (
            <div key={member.id} className="bg-slate-800 border border-white/5 p-6 rounded-2xl relative group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                  {member.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                    {member.name} {member.role === 'admin' && <Shield size={14} className="text-amber-400" />}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">{member.role || 'Member'}</p>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleOpenModal(member)} className="text-slate-400 hover:text-white hover:bg-slate-700/50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(member)} className="text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={User}
          title="No Members Added"
          description="Invite members to manage their unique documents and deposits."
          action={<button onClick={() => handleOpenModal()} className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium">+ Add someone now</button>}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMember ? "Edit Member" : "Add Family Member"}>
        <MemberForm initialData={editingMember} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default FamilyMembersPage;
