// src/hooks/usePortfolio.ts - VERSIÓN CORREGIDA
import { useState, useEffect, useCallback } from 'react';
import type { WalletState, CryptoAsset, RealTimePrice } from '../types/wallet.types';
import { realWalletAPI } from '../services/api/realWalletAPI';
import { portfolioWebSocket } from '../services/websocket/portfolioWebSocket';

interface UsePortfolioOptions {
  userId?: string;
  realTimeUpdates?: boolean;
}

export const usePortfolio = (options?: UsePortfolioOptions) => {
  const [portfolio, setPortfolio] = useState<WalletState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = options?.userId || 'demo';
  const realTimeUpdates = options?.realTimeUpdates ?? true;

  // Función para calcular el resumen
  const calculateSummary = useCallback((assets: CryptoAsset[]) => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    const availableBalance = 5000; // Esto debería venir de una API
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

  // Función para actualizar un asset específico con nuevos precios
  const updateAssetPrice = useCallback((assetId: string, priceData: RealTimePrice) => {
    setPortfolio(prev => {
      if (!prev) return prev;

      const updatedAssets = prev.assets.map(asset => {
        if (asset.id === assetId) {
          const newValueUSD = asset.amount * priceData.price;
          const change24h = priceData.changePercent;
          
          return {
            ...asset,
            currentPrice: priceData.price,
            valueUSD: newValueUSD,
            change24h,
            lastUpdated: new Date()
          };
        }
        return asset;
      });

      // Recalcular summary usando la función definida arriba
      const summary = calculateSummary(updatedAssets);

      return {
        ...prev,
        assets: updatedAssets,
        summary,
        lastSync: new Date()
      };
    });
  }, [calculateSummary]); // Agregar calculateSummary como dependencia

  // Cargar datos iniciales
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await realWalletAPI.getPortfolio(userId);
        setPortfolio(data);
        
        // Iniciar conexión WebSocket si se solicitan actualizaciones en tiempo real
        if (realTimeUpdates) {
          portfolioWebSocket.connect();
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el portfolio');
        
        // Fallback a datos mock si la API falla
        setPortfolio(getMockPortfolio());
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();

    // Cleanup
    return () => {
      if (realTimeUpdates) {
        portfolioWebSocket.disconnect();
      }
    };
  }, [userId, realTimeUpdates]);

  // Suscribirse a actualizaciones en tiempo real
  useEffect(() => {
    if (!portfolio || !realTimeUpdates) return;

    const unsubscribeCallbacks: (() => void)[] = [];

    // Suscribirse a cada asset del portfolio
    portfolio.assets.forEach(asset => {
      const unsubscribe = portfolioWebSocket.subscribeToAsset(
        asset.id, 
        (assetId, priceData) => {
          updateAssetPrice(assetId, priceData);
        }
      );
      unsubscribeCallbacks.push(unsubscribe);
    });

    // Cleanup
    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, [portfolio, realTimeUpdates, updateAssetPrice]);

  // Función para forzar una actualización
  const refreshPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await realWalletAPI.getPortfolio(userId);
      setPortfolio(data);
    } catch (err) {
      console.error('Error refreshing portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // userId SÍ se usa aquí (en realWalletAPI.getPortfolio(userId))

  // Función para agregar un nuevo asset
  const addAsset = useCallback(async (newAsset: Omit<CryptoAsset, 'id' | 'valueUSD'>) => {
    try {
      // Aquí iría la llamada a la API para agregar el asset
      // const response = await walletAPI.addAsset(userId, newAsset);
      
      // Por ahora, actualizamos localmente
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

      // Suscribirse a actualizaciones del nuevo asset
      if (realTimeUpdates) {
        portfolioWebSocket.subscribeToAsset(
          newAssetWithId.id,
          (assetId, priceData) => {
            updateAssetPrice(assetId, priceData);
          }
        );
      }

    } catch (err) {
      console.error('Error adding asset:', err);
      throw err;
    }
  }, [realTimeUpdates, updateAssetPrice, calculateSummary]); // Remover userId ya que no se usa directamente

  return { 
    portfolio, 
    isLoading, 
    error,
    refreshPortfolio,
    addAsset,
    updateAssetPrice
  };
};

// Datos mock de respaldo (solo si la API falla)
const getMockPortfolio = (): WalletState => ({
  assets: [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      amount: 0.5,
      currentPrice: 45000,
      valueUSD: 22500,
      change24h: 2.5,
      allocation: 45,
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      blockchain: 'Bitcoin'
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      amount: 3.2,
      currentPrice: 3000,
      valueUSD: 9600,
      change24h: -1.2,
      allocation: 25,
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      blockchain: 'Ethereum'
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      amount: 15,
      currentPrice: 100,
      valueUSD: 1500,
      change24h: 5.3,
      allocation: 10,
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      blockchain: 'Solana'
    }
  ],
  transactions: [],
  summary: {
    totalValue: 33600,
    totalChange24h: 850,
    totalChangePercent: 2.59,
    availableBalance: 5000,
    investedAmount: 28600,
    profitLoss: 2200,
    profitLossPercent: 8.33
  },
  isLoading: false,
  error: null,
  lastSync: new Date()
});