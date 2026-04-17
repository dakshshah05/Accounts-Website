import React from 'react';
import { useMembers } from '../../hooks/useMembers';
import { useFamilyData } from '../../context/FamilyDataContext';

const MemberFilterTabs = () => {
  const { members } = useMembers();
  const { state, dispatch } = useFamilyData();
  
  // Create tabs: 'All' + uniquely mapped member names
  const dynamicNames = members ? members.map(m => m.name).filter(Boolean) : [];
  const tabs = ['All', ...new Set(dynamicNames)];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => dispatch({ type: 'SET_MEMBER_FILTER', payload: tab })}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            state.memberFilter === tab 
              ? 'bg-white text-slate-900 shadow-md' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-white/5'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default MemberFilterTabs;
