import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [familyId, setFamilyId] = useState(null);

  // Initialize without any persistent storage
  useEffect(() => {
    setLoading(false);
  }, []);

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setUserProfile(null);
    setFamilyId(null);
  };

  // Listen for tab switch, app backgrounding, or device lock
  useEffect(() => {
    // 15 seconds grace period for brief tab switching or minimizing
    const GRACE_PERIOD_MS = 15000; 
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Record the exact absolute time they left the app
        localStorage.setItem('familyVaultHiddenAt', Date.now().toString());
      } else {
        // They returned. Check how long they were gone.
        const hiddenAt = localStorage.getItem('familyVaultHiddenAt');
        if (hiddenAt) {
          const timeAway = Date.now() - parseInt(hiddenAt, 10);
          if (timeAway > GRACE_PERIOD_MS) {
            // If they locked their phone or completely left the app for a while, lock them out.
            logout();
          }
          localStorage.removeItem('familyVaultHiddenAt');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const register = async (id, password, securityQuestion, securityAnswer) => {
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      throw new Error("Family ID already exists. Please choose a different one.");
    }
    await setDoc(userRef, {
      id,
      password, // Note: In a production app, never store passwords in plain text.
      securityQuestion,
      securityAnswer
    });
    
    // Auto login
    const userData = { uid: id, familyId: id, id, name: id, role: 'admin' };
    setCurrentUser(userData);
    setFamilyId(id);
    setUserProfile({ name: id, role: 'admin', color: 'bg-indigo-500' });
  };

  const login = async (id, password) => {
    // id here is the Family ID
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("Family ID not found.");
    }
    
    const adminData = userSnap.data();

    // 1. Check if the password matches the admin password
    if (adminData.password === password) {
      const userData = { uid: id, familyId: id, id, name: id, role: 'admin' };
      setCurrentUser(userData);
      setFamilyId(id);
      setUserProfile({ name: id, role: 'admin', color: 'bg-indigo-500' });
      return;
    }

    // 2. Check if the password matches any member in the family
    const membersRef = collection(db, 'families', id, 'members');
    const membersSnap = await getDocs(membersRef);
    let matchedMember = null;
    
    membersSnap.forEach(docSnap => {
      if (docSnap.data().password === password) {
        matchedMember = { id: docSnap.id, ...docSnap.data() };
      }
    });

    if (matchedMember) {
      const userData = { uid: matchedMember.id, familyId: id, id: matchedMember.id, name: matchedMember.name, role: matchedMember.role || 'member' };
      setCurrentUser(userData);
      setFamilyId(id);
      setUserProfile({ name: matchedMember.name, role: matchedMember.role || 'member', color: 'bg-emerald-500' });
      return;
    }
    
    throw new Error("Incorrect Password.");
  };

  const getSecurityQuestion = async (id) => {
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("Family ID not found.");
    }
    return userSnap.data().securityQuestion;
  };

  const resetPassword = async (id, answer, newPassword) => {
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("Family ID not found.");
    }
    const userData = userSnap.data();
    if (userData.securityAnswer.toLowerCase().trim() !== answer.toLowerCase().trim()) {
      throw new Error("Incorrect security answer.");
    }
    
    await updateDoc(userRef, {
      password: newPassword
    });
  };

  const value = {
    currentUser,
    userProfile,
    familyId,
    login,
    register,
    logout,
    getSecurityQuestion,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
