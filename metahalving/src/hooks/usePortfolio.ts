// src/hooks/usePortfolio.ts - VERSIÓN CON addAsset
import { useState, useEffect, useCallback } from 'react';
import type { WalletState, CryptoAsset } from '../types/wallet.types';
import { realWalletAPI } from '../services/api/realWalletAPI';
import { portfolioWebSocket } from '../services/websocket/portfolioWebSocket';

interface UsePortfolioOptions {
  userId?: string;
  realTimeUpdates?: boolean;
}

// API gratuita para obtener precio de Bitcoin
const BITCOIN_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24h_change=true';

export const usePortfolio = (options?: UsePortfolioOptions) => {
  const [portfolio, setPortfolio] = useState<WalletState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = options?.userId || 'demo';
  const realTimeUpdates = options?.realTimeUpdates ?? true;

  // Función para obtener el precio REAL de Bitcoin
  const fetchBitcoinPrice = useCallback(async () => {
    try {
      const response = await fetch(BITCOIN_PRICE_API);
      if (!response.ok) throw new Error('Error fetching Bitcoin price');
      
      const data = await response.json();
      const price = data.bitcoin.usd;
      const change = data.bitcoin.usd_24h_change;
      
      return { price, change };
    } catch (err) {
      console.error('Error fetching Bitcoin price:', err);
      // Usar precio por defecto si falla
      return { price: 44774.04, change: 9.33 };
    }
  }, []);

  // Función para calcular el resumen
  const calculateSummary = useCallback((assets: CryptoAsset[]) => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    const availableBalance = 5000;
    const investedAmount = totalValue - availableBalance;
    
    // Calcular cambios
    const totalChange24h = assets.reduce((sum, asset) => {
      const assetChange = (asset.valueUSD * asset.change24h) / 100;
      return sum + assetChange;
    }, 0);
    
    const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

    const initialInvestment = 30000;
    const profitLoss = totalValue - initialInvestment;
    const profitLossPercent = (profitLoss / initialInvestment) * 100;

    return {
      totalValue,
      availableBalance,
      investedAmount,
      profitLoss,
      profitLossPercent,
      totalChange24h,
      totalChangePercent
    };
  }, []);

  // Función para actualizar el precio de Bitcoin específicamente
  const updateBitcoinPrice = useCallback(async () => {
    const { price: newPrice, change: newChange } = await fetchBitcoinPrice();
    
    setPortfolio(prev => {
      if (!prev) return prev;

      const updatedAssets = prev.assets.map(asset => {
        if (asset.id === 'bitcoin' || asset.symbol === 'btc') {
          const newValueUSD = asset.amount * newPrice;
          
          return {
            ...asset,
            currentPrice: newPrice,
            valueUSD: newValueUSD,
            change24h: newChange,
            lastUpdated: new Date()
          };
        }
        return asset;
      });

      const summary = calculateSummary(updatedAssets);

      return {
        ...prev,
        assets: updatedAssets,
        summary,
        lastSync: new Date()
      };
    });
  }, [fetchBitcoinPrice, calculateSummary]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await realWalletAPI.getPortfolio(userId);
        
        // Obtener precio real de Bitcoin
        const { price: btcPrice, change: btcChange } = await fetchBitcoinPrice();
        
        // Actualizar el asset de Bitcoin con precio real
        const updatedAssets = data.assets.map(asset => {
          if (asset.id === 'bitcoin' || asset.symbol === 'btc') {
            return {
              ...asset,
              currentPrice: btcPrice,
              valueUSD: asset.amount * btcPrice,
              change24h: btcChange
            };
          }
          return asset;
        });

        const summary = calculateSummary(updatedAssets);
        
        setPortfolio({
          ...data,
          assets: updatedAssets,
          summary,
          lastSync: new Date()
        });
        
        if (realTimeUpdates) {
          portfolioWebSocket.connect();
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el portfolio');
        
        // Fallback a datos mock con precio real de Bitcoin
        const mockPortfolio = getMockPortfolio();
        const { price: btcPrice, change: btcChange } = await fetchBitcoinPrice();
        const updatedMockAssets = mockPortfolio.assets.map(asset => {
          if (asset.id === 'bitcoin') {
            return {
              ...asset,
              currentPrice: btcPrice,
              valueUSD: asset.amount * btcPrice,
              change24h: btcChange
            };
          }
          return asset;
        });
        
        const mockSummary = calculateSummary(updatedMockAssets);
        
        setPortfolio({
          ...mockPortfolio,
          assets: updatedMockAssets,
          summary: mockSummary
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();

    return () => {
      if (realTimeUpdates) {
        portfolioWebSocket.disconnect();
      }
    };
  }, [userId, realTimeUpdates, fetchBitcoinPrice, calculateSummary]);

  // Actualizar precio de Bitcoin automáticamente cada 30 segundos
  useEffect(() => {
    if (!realTimeUpdates || !portfolio) return;

    const interval = setInterval(() => {
      updateBitcoinPrice();
    }, 30000);

    return () => clearInterval(interval);
  }, [realTimeUpdates, portfolio, updateBitcoinPrice]);

  // Función para forzar una actualización
  const refreshPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await realWalletAPI.getPortfolio(userId);
      
      // Obtener precio actual de Bitcoin
      const { price: btcPrice, change: btcChange } = await fetchBitcoinPrice();
      
      // Actualizar Bitcoin con precio real
      const updatedAssets = data.assets.map(asset => {
        if (asset.id === 'bitcoin' || asset.symbol === 'btc') {
          return {
            ...asset,
            currentPrice: btcPrice,
            valueUSD: asset.amount * btcPrice,
            change24h: btcChange
          };
        }
        return asset;
      });

      const summary = calculateSummary(updatedAssets);
      setPortfolio({
        ...data,
        assets: updatedAssets,
        summary,
        lastSync: new Date()
      });
    } catch (err) {
      console.error('Error refreshing portfolio:', err);
      // Si falla, al menos actualizar el precio de Bitcoin
      await updateBitcoinPrice();
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchBitcoinPrice, calculateSummary, updateBitcoinPrice]);

  // Función para agregar un nuevo asset
  const addAsset = useCallback(async (newAsset: Omit<CryptoAsset, 'id' | 'valueUSD'>) => {
    try {
      const newAssetWithId: CryptoAsset = {
        ...newAsset,
        id: newAsset.symbol.toLowerCase(),
        valueUSD: newAsset.amount * newAsset.currentPrice
      };

      setPortfolio(prev => {
        if (!prev) return prev;

        const updatedAssets = [...prev.assets, newAssetWithId];
        const summary = calculateSummary(updatedAssets);

        return {
          ...prev,
          assets: updatedAssets,
          summary,
          lastSync: new Date()
        };
      });

    } catch (err) {
      console.error('Error adding asset:', err);
      throw err;
    }
  }, [calculateSummary]);

  return { 
    portfolio, 
    isLoading, 
    error,
    refreshPortfolio,
    addAsset, // AÑADIDO: Esta función debe estar aquí
    updateBitcoinPrice
  };
};

// Datos mock de respaldo
const getMockPortfolio = (): WalletState => ({
  assets: [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      amount: 0.5,
      currentPrice: 44774.04,
      valueUSD: 22387.02,
      change24h: 9.33,
      allocation: 45,
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      blockchain: 'Bitcoin'
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      amount: 3.2,
      currentPrice: 3083.04,
      valueUSD: 9865.72,
      change24h: 8.12,
      allocation: 25,
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      blockchain: 'Ethereum'
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      amount: 15,
      currentPrice: 98.18,
      valueUSD: 1472.72,
      change24h: 8.66,
      allocation: 8.0,
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      blockchain: 'Solana'
    }
  ],
  transactions: [],
  summary: {
    totalValue: 33725.46,
    totalChange24h: 2830.45,
    totalChangePercent: 9.16,
    availableBalance: 5000,
    investedAmount: 28725.46,
    profitLoss: 2250.46,
    profitLossPercent: 8.5
  },
  isLoading: false,
  error: null,
  lastSync: new Date()
});