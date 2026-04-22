import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { encryptData, decryptData } from '../utils/encryption';

export const useDocuments = () => {
  const { familyId, userProfile } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) { setLoading(false); return; }

    const colRef = collection(db, 'families', familyId, 'documents');
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
      setDocuments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addDocument = async (data) => {
    const encryptedData = encryptData(data, familyId);
    await addDoc(collection(db, 'families', familyId, 'documents'), {
      encryptedData,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const updateDocument = async (id, data) => {
    const encryptedData = encryptData(data, familyId);
    await updateDoc(doc(db, 'families', familyId, 'documents', id), {
      encryptedData,
      updatedBy: userProfile.name,
      updatedAt: serverTimestamp()
    });
  };

  const deleteDocument = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'documents', id));
  };

  return { documents, loading, addDocument, updateDocument, deleteDocument };
};
