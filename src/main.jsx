import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { FamilyDataProvider } from './context/FamilyDataContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FamilyDataProvider>
        <App />
      </FamilyDataProvider>
    </AuthProvider>
  </StrictMode>,
);
