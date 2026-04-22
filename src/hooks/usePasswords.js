import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { encryptData, decryptData } from '../utils/encryption';

export const usePasswords = () => {
  const { familyId, userProfile } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) { setLoading(false); return; }

    const colRef = collection(db, 'families', familyId, 'passwords');
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
      setPasswords(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addPassword = async (data) => {
    const encryptedData = encryptData(data, familyId);
    await addDoc(collection(db, 'families', familyId, 'passwords'), {
      encryptedData,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const updatePassword = async (id, data) => {
    const encryptedData = encryptData(data, familyId);
    await updateDoc(doc(db, 'families', familyId, 'passwords', id), {
      encryptedData,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const deletePassword = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'passwords', id));
  };

  return { passwords, loading, addPassword, updatePassword, deletePassword };
};
