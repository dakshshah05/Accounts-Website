import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Bypassing auth completely logic for an open website.
  const [currentUser] = useState({ uid: 'open-user', email: `guest@demo.com` });
  const [userProfile] = useState({ name: 'Family Admin', role: 'admin', color: 'bg-indigo-500' });
  
  // Set consistent demo family ID to fetch shared state locally or from firebase
  const [familyId] = useState('demo-family');

  const value = {
    currentUser,
    userProfile,
    familyId,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    demoLogin: () => Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
