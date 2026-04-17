import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export const useDocuments = () => {
  const { familyId, userProfile } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) { setLoading(false); return; }

    const colRef = collection(db, 'families', familyId, 'documents');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addDocument = async (data) => {
    await addDoc(collection(db, 'families', familyId, 'documents'), {
      ...data,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const updateDocument = async (id, data) => {
    await updateDoc(doc(db, 'families', familyId, 'documents', id), {
      ...data,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const deleteDocument = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'documents', id));
  };

  return { documents, loading, addDocument, updateDocument, deleteDocument };
};
