import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { encryptData, decryptData } from '../utils/encryption';

export const useFDs = () => {
  const { familyId, userProfile } = useAuth();
  const [fds, setFds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    const colRef = collection(db, 'families', familyId, 'fds');
    
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const fdData = snapshot.docs.map(doc => {
        const docData = doc.data();
        const decrypted = docData.encryptedData ? decryptData(docData.encryptedData, familyId) : docData;
        return {
          id: doc.id,
          ...decrypted,
          createdAt: doc.data().createdAt?.toDate() || decrypted?.createdAt || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || decrypted?.updatedAt || new Date()
        };
      });
      setFds(fdData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching FDs:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addFd = async (fdData) => {
    try {
      const encryptedData = encryptData(fdData, familyId);
      const colRef = collection(db, 'families', familyId, 'fds');
      await addDoc(colRef, {
        encryptedData,
        createdBy: userProfile.name,
        updatedBy: userProfile.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error adding FD:", err);
      throw err;
    }
  };

  const updateFd = async (fdId, updates) => {
    try {
      const encryptedData = encryptData(updates, familyId);
      const docRef = doc(db, 'families', familyId, 'fds', fdId);
      await updateDoc(docRef, {
        encryptedData,
        updatedBy: userProfile.name,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error updating FD:", err);
      throw err;
    }
  };

  const deleteFd = async (fdId) => {
    try {
      const docRef = doc(db, 'families', familyId, 'fds', fdId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting FD:", err);
      throw err;
    }
  };

  return { fds, loading, error, addFd, updateFd, deleteFd };
};
