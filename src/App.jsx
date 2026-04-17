import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import FDPage from './pages/FDPage';
import PasswordsPage from './pages/PasswordsPage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';
import FamilyMembersPage from './pages/FamilyMembersPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/fds" element={<ProtectedRoute><FDPage /></ProtectedRoute>} />
        <Route path="/passwords" element={<ProtectedRoute><PasswordsPage /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><FamilyMembersPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
