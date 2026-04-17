import { useState } from 'react';

export const usePasswords = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading] = useState(false);

  const addPassword = async (data) => {
    const newPwd = {
      ...data,
      id: Date.now().toString(),
      updatedBy: 'Family Admin',
      updatedAt: new Date()
    };
    setPasswords(prev => [newPwd, ...prev]);
  };

  const updatePassword = async (id, data) => {
    setPasswords(prev => prev.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date() } : p));
  };

  const deletePassword = async (id) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
  };

  return { passwords, loading, addPassword, updatePassword, deletePassword };
};
