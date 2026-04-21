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

  useEffect(() => {
    // Check local storage for persistent login
    const storedUser = localStorage.getItem('familyVaultUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setFamilyId(user.familyId);
      setUserProfile({ name: user.name, role: user.role, color: user.role === 'admin' ? 'bg-indigo-500' : 'bg-emerald-500' });
    }
    setLoading(false);
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
    localStorage.setItem('familyVaultUser', JSON.stringify(userData));
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
      localStorage.setItem('familyVaultUser', JSON.stringify(userData));
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
      localStorage.setItem('familyVaultUser', JSON.stringify(userData));
      return;
    }
    
    throw new Error("Incorrect Password.");
  };

  const logout = () => {
    setCurrentUser(null);
    setUserProfile(null);
    setFamilyId(null);
    localStorage.removeItem('familyVaultUser');
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
