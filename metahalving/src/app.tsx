// src/App.tsx - VERSIÓN CORREGIDA
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/contexts/AuthContext';
import { useAuth } from './auth/hooks/useAuth';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Markets from './pages/Markets/Markets';
import Settings from './pages/Settings/Settings';
import Transactions from './pages/Transactions/Transactions';
import Wallet from './pages/Wallet/Wallet';
import Layout from './components/Layout/LAyout';
import AlertNotifications from './components/common/AlertNotifications/AlertNotifications';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import { UIProvider } from './contexts/UIContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas con Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}> {/* Layout sin children */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/wallet" element={<Wallet />} />
          </Route>
        </Route>

        {/* Ruta por defecto */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
        />
      </Routes>
      <AlertNotifications />
    </>
  );
};

const App: React.FC = () => {
  return (
     <AuthProvider>
    <UIProvider>
      <AppContent />
    </UIProvider>
  </AuthProvider>
  );
};

export default App;