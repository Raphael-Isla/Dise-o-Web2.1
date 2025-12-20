// src/contexts/usePortfolioContext.ts
import { useContext } from 'react';
import { PortfolioContext, PortfolioContextType } from './PortfolioContext';

export const usePortfolioContext = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext debe usarse dentro de PortfolioProvider');
  }
  return context;
};