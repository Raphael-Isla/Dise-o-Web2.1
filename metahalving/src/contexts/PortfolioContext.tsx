// src/contexts/PortfolioContext.tsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, ReactNode } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import type { WalletState, CryptoAsset } from '../types/wallet.types';

// Exportamos el tipo para que esté disponible
export interface PortfolioContextType {
  portfolio: WalletState | null;
  isLoading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
  addAsset: (asset: Omit<CryptoAsset, 'id' | 'valueUSD'>) => Promise<void>;
  lastSync?: Date;
}

// Creamos el contexto con el tipo exportado
export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode; userId?: string }> = ({ 
  children, 
  userId = 'demo' 
}) => {
  const { portfolio, isLoading, error, refreshPortfolio, addAsset } = usePortfolio({
    userId,
    realTimeUpdates: true
  });

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        isLoading,
        error,
        refreshPortfolio,
        addAsset,
        lastSync: portfolio?.lastSync
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};