import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { encryptData, decryptData } from '../utils/encryption';

export const useMembers = () => {
  const { familyId } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    const colRef = collection(db, 'families', familyId, 'members');
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
      setMembers(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching Members:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addMember = async (data) => {
    const encryptedData = encryptData(data, familyId);
    await addDoc(collection(db, 'families', familyId, 'members'), {
      encryptedData,
      createdAt: serverTimestamp()
    });
  };

  const updateMember = async (id, data) => {
    const encryptedData = encryptData(data, familyId);
    const docRef = doc(db, 'families', familyId, 'members', id);
    await updateDoc(docRef, {
      encryptedData,
      updatedAt: serverTimestamp()
    });
  };

  const deleteMember = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'members', id));
  };

  return { members, loading, addMember, updateMember, deleteMember };
};
