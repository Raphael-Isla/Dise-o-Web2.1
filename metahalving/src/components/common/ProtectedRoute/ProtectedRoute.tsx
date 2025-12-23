// ═════════════════════════════════════════════════════════════════════
// ARCHIVO 3: src/components/common/ProtectedRoute/ProtectedRoute.tsx
// ═════════════════════════════════════════════════════════════════════

import React from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  
  fallback 
}) => {
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

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-xl p-6 mb-4">
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-red-700">
              Debes iniciar sesión para acceder a esta página.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

    return <Outlet/>;
};

export default ProtectedRoute;