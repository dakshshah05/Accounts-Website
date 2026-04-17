import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example familyId - in a real app this would be tied to the authenticated user.
  // We'll hardcode one for testing if not found.
  const [familyId, setFamilyId] = useState('demo-family');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile from firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile(data);
            if (data.familyId) setFamilyId(data.familyId);
          } else {
            // Mock profile if none exists
            setUserProfile({
              name: user.email.split('@')[0],
              role: 'admin',
              color: 'bg-indigo-500'
            });
          }
        } catch (e) {
          console.error("Error fetching user profile", e);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  // Skip actual auth in demo mode if firebase is not setup
  const demoLogin = (name) => {
    setCurrentUser({ uid: 'mock-uid', email: `${name}@demo.com` });
    setUserProfile({ name, role: 'admin', color: 'bg-indigo-500' });
  };

  const value = {
    currentUser,
    userProfile,
    familyId,
    login,
    logout,
    demoLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
