/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LanguageProvider } from './lib/LanguageContext';
import { LoginPage } from './components/auth/LoginPage';
import { RoleSelection } from './components/auth/RoleSelection';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoadingScreen } from './components/ui/LoadingScreen';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) {
  const { user, userData, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!userData) return <Navigate to="/select-role" replace />;
  if (allowedRole && userData.role !== allowedRole) {
    // Redirect based on actual role if they try to access wrong portal
    if (userData.role === 'admin') return <Navigate to="/admin" replace />;
    if (userData.role === 'owner') return <Navigate to="/owner" replace />;
    return <Navigate to="/driver" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, userData, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : (userData ? <Navigate to={`/${userData.role}`} replace /> : <Navigate to="/select-role" replace />)} />
      <Route path="/select-role" element={user ? (userData ? <Navigate to={`/${userData.role}`} replace /> : <RoleSelection />) : <Navigate to="/login" replace />} />
      
      <Route path="/driver/*" element={
        <ProtectedRoute allowedRole="driver">
          <DriverDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/owner/*" element={
        <ProtectedRoute allowedRole="owner">
          <OwnerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen font-sans selection:bg-brand-accent selection:text-white">
            <AppContent />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
