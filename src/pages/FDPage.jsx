import React, { useState } from 'react';
import { useFDs } from '../hooks/useFDs';
import { useMembers } from '../hooks/useMembers';
import FDCard from '../components/fd/FDCard';
import FDForm from '../components/fd/FDForm';
import Modal from '../components/shared/Modal';
import EmptyState from '../components/shared/EmptyState';
import MemberFilterTabs from '../components/shared/MemberFilterTabs';
import { Landmark, Plus, Search, Filter } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';

const FDPage = () => {
  const { fds, addFd, updateFd, deleteFd, loading } = useFDs();
  const { members, addMember } = useMembers();
  const { state, dispatch } = useFamilyData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFd, setEditingFd] = useState(null);

  // Filter and Sort Logic
  let processedFds = fds ? [...fds] : [];
  
  if (state.memberFilter !== 'All') {
    processedFds = processedFds.filter(fd => fd.member === state.memberFilter);
  }
  
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    processedFds = processedFds.filter(fd => 
      fd.bank.toLowerCase().includes(q) || 
      fd.member.toLowerCase().includes(q)
    );
  }

  if (state.fdSortBy === 'Maturity Date') {
    processedFds.sort((a, b) => new Date(a.maturityDate) - new Date(b.maturityDate));
  } else if (state.fdSortBy === 'Amount') {
    processedFds.sort((a, b) => b.principal - a.principal);
  } else if (state.fdSortBy === 'Member') {
    processedFds.sort((a, b) => a.member.localeCompare(b.member));
  }

  const handleOpenModal = (fd = null) => {
    setEditingFd(fd);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingFd(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingFd) {
        await updateFd(editingFd.id, formData);
      } else {
        await addFd(formData);
      }

      if (formData.member && members && !members.some(m => m.name.toLowerCase() === formData.member.toLowerCase())) {
        await addMember({ name: formData.member, role: 'member' });
      }

      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Error saving. Please check your Firebase Database Rules.");
    }
  };

  const handleDelete = async (fd) => {
    if (window.confirm("Are you sure you want to delete this FD?")) {
      try {
        await deleteFd(fd.id);
      } catch (err) {
        console.error("Delete failed", err);
        alert("Delete failed. Check Firebase Rules.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Landmark className="text-indigo-400" /> Fixed Deposits
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track all family FD accounts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search banks..." 
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              className="pl-9 pr-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button 
            onClick={() => handleOpenModal()} 
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25"
          >
            <Plus size={16} /> Add FD
          </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
        <MemberFilterTabs />
        
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <select 
            value={state.fdSortBy}
            onChange={(e) => dispatch({ type: 'SET_FD_SORT', payload: e.target.value })}
            className="bg-transparent text-sm text-slate-300 focus:outline-none appearance-none cursor-pointer"
          >
            <option>Maturity Date</option>
            <option>Amount</option>
            <option>Member</option>
          </select>
        </div>
      </div>

      {/* FD Grid */}
      {processedFds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedFds.map(fd => (
            <FDCard 
              key={fd.id} 
              fd={fd} 
              onEdit={handleOpenModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Landmark}
          title="No Fixed Deposits Found"
          description={state.fdFilter !== 'All' ? `No FDs found for ${state.fdFilter}.` : "You haven't added any fixed deposits yet."}
          action={
            <button onClick={() => handleOpenModal()} className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium">
              + Add a new FD
            </button>
          }
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingFd ? "Edit Fixed Deposit" : "Add Fixed Deposit"}
      >
        <FDForm 
          initialData={editingFd} 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default FDPage;
