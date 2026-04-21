import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export const useAccounts = () => {
  const { familyId, userProfile } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) { setLoading(false); return; }

    const colRef = collection(db, 'families', familyId, 'accounts');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAccounts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addAccount = async (data) => {
    await addDoc(collection(db, 'families', familyId, 'accounts'), {
      ...data,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const updateAccount = async (id, data) => {
    await updateDoc(doc(db, 'families', familyId, 'accounts', id), {
      ...data,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const deleteAccount = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'accounts', id));
  };

  return { accounts, loading, addAccount, updateAccount, deleteAccount };
};
