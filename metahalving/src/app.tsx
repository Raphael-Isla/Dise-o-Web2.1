// src/App.tsx - NUEVA VERSIÓN COMPLETA
import React from 'react';
import { AuthProvider } from './auth/contexts/AuthContext';
import { useAuth } from './auth/hooks/useAuth';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';
import Header from './components/Layout/Header/Header';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import { ProtectedRoute } from './components/common/ProtectedRoute/ProtectedRoute';
import AlertNotifications from './components/common/AlertNotifications/AlertNotifications';  

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

  // Mostrar login si no está autenticado
  if (!isAuthenticated) {
    const path = window.location.pathname;
    if (path === '/register') {
      return <Register />;
    }
    return <Login />;
  }

  // Usuario autenticado - mostrar app
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </main>
      </div>
      <AlertNotifications />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;