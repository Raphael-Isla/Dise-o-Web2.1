// ═════════════════════════════════════════════════════════════════════
// ARCHIVO 1: src/auth/contexts/AuthContext.tsx
// ═════════════════════════════════════════════════════════════════════

import React, {  useState, useCallback, useEffect, ReactNode } from 'react';
import type { User, AuthContextType, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { authAPI } from '../../services/api/authAPI';
import { AuthContext } from './AuthContextInstance'; // Importa desde el archivo separado


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedUser = localStorage.getItem('metahalving_user');
        const storedToken = localStorage.getItem('metahalving_auth_token');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
        localStorage.removeItem('metahalving_user');
        localStorage.removeItem('metahalving_auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('metahalving_user', JSON.stringify(response.user));
      localStorage.setItem('metahalving_auth_token', response.token);
      
      if (credentials.rememberMe) {
        localStorage.setItem('metahalving_remember_email', credentials.email);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(credentials);
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('metahalving_user', JSON.stringify(response.user));
      localStorage.setItem('metahalving_auth_token', response.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    
    localStorage.removeItem('metahalving_user');
    localStorage.removeItem('metahalving_auth_token');
    localStorage.removeItem('metahalving_remember_email');
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('metahalving_user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
 
};
export { AuthContext };