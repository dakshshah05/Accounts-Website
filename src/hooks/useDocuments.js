import { useState } from 'react';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading] = useState(false);

  const addDocument = async (data) => {
    const newDoc = {
      ...data,
      id: Date.now().toString(),
      updatedBy: 'Family Admin',
      updatedAt: new Date()
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const updateDocument = async (id, data) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...data, updatedAt: new Date() } : d));
  };

  const deleteDocument = async (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return { documents, loading, addDocument, updateDocument, deleteDocument };
};
