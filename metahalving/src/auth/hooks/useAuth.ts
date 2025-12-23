// ═════════════════════════════════════════════════════════════════════
// ARCHIVO 2: src/auth/hooks/useAuth.ts
// ═════════════════════════════════════════════════════════════════════

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../types/auth.types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
};

export default useAuth;