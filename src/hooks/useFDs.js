import { useState } from 'react';

export const useFDs = () => {
  const [fds, setFds] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  const addFd = async (fdData) => {
    const newFd = { 
      ...fdData, 
      id: Date.now().toString(),
      createdBy: 'Family Admin',
      updatedBy: 'Family Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setFds(prev => [newFd, ...prev]);
  };

  const updateFd = async (fdId, updates) => {
    setFds(prev => prev.map(fd => fd.id === fdId ? { ...fd, ...updates, updatedAt: new Date() } : fd));
  };

  const deleteFd = async (fdId) => {
    setFds(prev => prev.filter(fd => fd.id !== fdId));
  };

  return { fds, loading, error, addFd, updateFd, deleteFd };
};
