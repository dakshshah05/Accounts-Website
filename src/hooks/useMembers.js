import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

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
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching Members:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [familyId]);

  const addMember = async (data) => {
    await addDoc(collection(db, 'families', familyId, 'members'), {
      ...data,
      createdAt: serverTimestamp()
    });
  };

  const deleteMember = async (id) => {
    await deleteDoc(doc(db, 'families', familyId, 'members', id));
  };

  return { members, loading, addMember, deleteMember };
};
