import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

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
    
    // In a real app we'd also wrap this in a try-catch, but onSnapshot handles it internally
    // and calls the error callback.
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const fdData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert firestore timestamps for UI if needed
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
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
      const colRef = collection(db, 'families', familyId, 'fds');
      await addDoc(colRef, {
        ...fdData,
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
      const docRef = doc(db, 'families', familyId, 'fds', fdId);
      await updateDoc(docRef, {
        ...updates,
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
