import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export const usePasswords = () => {
  const { familyId, userProfile } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) { setLoading(false); return; }

    const colRef = collection(db, 'families', familyId, 'passwords');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPasswords(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addPassword = async (data) => {
    await addDoc(collection(db, 'families', familyId, 'passwords'), {
      ...data,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const updatePassword = async (id, data) => {
    await updateDoc(doc(db, 'families', familyId, 'passwords', id), {
      ...data,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const deletePassword = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'passwords', id));
  };

  return { passwords, loading, addPassword, updatePassword, deletePassword };
};
