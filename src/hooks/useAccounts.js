import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { encryptData, decryptData } from '../utils/encryption';

export const useAccounts = () => {
  const { familyId, userProfile } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) { setLoading(false); return; }

    const colRef = collection(db, 'families', familyId, 'accounts');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        const decrypted = docData.encryptedData ? decryptData(docData.encryptedData, familyId) : docData;
        return {
          id: doc.id,
          ...decrypted,
          updatedBy: docData.updatedBy || decrypted?.updatedBy,
          updatedAt: docData.updatedAt || decrypted?.updatedAt,
        };
      });
      setAccounts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addAccount = async (data) => {
    const encryptedData = encryptData(data, familyId);
    await addDoc(collection(db, 'families', familyId, 'accounts'), {
      encryptedData,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const updateAccount = async (id, data) => {
    const encryptedData = encryptData(data, familyId);
    await updateDoc(doc(db, 'families', familyId, 'accounts', id), {
      encryptedData,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const deleteAccount = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'accounts', id));
  };

  return { accounts, loading, addAccount, updateAccount, deleteAccount };
};
