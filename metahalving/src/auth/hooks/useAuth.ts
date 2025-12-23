/* eslint-disable @typescript-eslint/no-explicit-any */
// src/auth/hooks/useAuth.ts
import { useState, useCallback } from 'react';

// Tipos que ya debes tener definidos
export interface CryptoHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  currentValue: number;
  totalValue: number;
  change24h: number;
  allocation: number;
  icon?: string;
  blockchain?: string;
  lastUpdated?: Date;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  asset?: string;
  amount: number;
  price?: number;
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  dashboard: {
    totalBalance: number;
    totalInvested: number;
    totalProfit: number;
    portfolioValue: number;
    availableCash: number;
  };
  wallet: {
    balance: number;
    transactions: Transaction[];
    cryptoHoldings: CryptoHolding[];
  };
  settings?: {
     notifications: boolean;
    twoFactorAuth: boolean;
    currency: string;
    language: string;
    theme?: 'light' | 'dark'; // Agrega esta línea
  };
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  rememberMe?: boolean;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('metahalving_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const findUserByEmail = (email: string): User | null => {
    const users = JSON.parse(localStorage.getItem('metahalving_users') || '[]');
    return users.find((u: User) => u.email === email) || null;
  };

  const saveUser = (userData: User) => {
    const users = JSON.parse(localStorage.getItem('metahalving_users') || '[]');
    const existingIndex = users.findIndex((u: User) => u.id === userData.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    
    localStorage.setItem('metahalving_users', JSON.stringify(users));
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('metahalving_users') || '[]');
      const user = users.find((u: User) => u.email === credentials.email);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // En producción, aquí verificarías la contraseña hasheada
      // Por ahora solo validamos que exista el usuario
      
      localStorage.setItem('metahalving_user', JSON.stringify(user));
      
      if (credentials.rememberMe) {
        localStorage.setItem('metahalving_remember_email', credentials.email);
      } else {
        localStorage.removeItem('metahalving_remember_email');
      }

      setUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (credentials.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const existingUser = findUserByEmail(credentials.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear usuario con configuración por defecto
      const newUser: User = {
        id: generateId(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString(),
        dashboard: {
          totalBalance: 0,
          totalInvested: 0,
          totalProfit: 0,
          portfolioValue: 0,
          availableCash: 10000, // Dinero inicial
        },
        wallet: {
          balance: 0,
          transactions: [],
          cryptoHoldings: [],
        },
        settings: {
          notifications: true,
          twoFactorAuth: false,
          currency: 'USD',
          language: 'es'
        }
      };

      saveUser(newUser);
      localStorage.setItem('metahalving_user', JSON.stringify(newUser));
      
      if (credentials.rememberMe) {
        localStorage.setItem('metahalving_remember_email', credentials.email);
      } else {
        localStorage.removeItem('metahalving_remember_email');
      }

      setUser(newUser);
      return newUser;
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de logout mejorada
  const logout = useCallback(() => {
    localStorage.removeItem('metahalving_user');
    setUser(null);
    // Redirigir a login automáticamente
    window.location.href = '/login';
  }, []);

  // Actualizar usuario
  const updateUser = useCallback((updatedData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('metahalving_user', JSON.stringify(updatedUser));
    saveUser(updatedUser);
    setUser(updatedUser);
  }, [user]);

  // Actualizar configuración del usuario
  const updateSettings = useCallback((settings: Partial<User['settings']>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      settings: { ...user.settings, ...settings } as User['settings']
    };
    
    localStorage.setItem('metahalving_user', JSON.stringify(updatedUser));
    saveUser(updatedUser);
    setUser(updatedUser);
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    updateSettings,
    clearError,
  };
};