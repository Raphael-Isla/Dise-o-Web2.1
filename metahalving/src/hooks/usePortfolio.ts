/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/usePortfolio.ts
import { useState, useEffect, useCallback } from 'react';
import type { WalletState, CryptoAsset } from '../types/wallet.types';
import { realWalletAPI } from '../services/api/realWalletAPI';
import { portfolioWebSocket } from '../services/websocket/portfolioWebSocket';
import { useAuth ,  type User,type CryptoHolding, Transaction} from '../auth/hooks/useAuth';
//import { CryptoHolding } from './services/api/cryptoAPI';
interface UsePortfolioOptions {
  userId?: string;
  realTimeUpdates?: boolean;
}

// API gratuita para obtener precio de Bitcoin
const BITCOIN_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24h_change=true';

export const usePortfolio = (options?: UsePortfolioOptions) => {
  const { user, updateUser } = useAuth();
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


 // Función para transformar datos del usuario a WalletState
  const transformUserToWalletState = useCallback((userData: User): WalletState => {
    const assets: CryptoAsset[] = userData.wallet.cryptoHoldings.map((holding: CryptoHolding) => ({
      id: holding.id,
      symbol: holding.symbol,
      name: holding.name,
      amount: holding.amount,
      currentPrice: holding.currentValue,
      valueUSD: holding.totalValue,
      change24h: holding.change24h,
      allocation: holding.allocation,
      icon: holding.icon,
      blockchain: holding.blockchain,
      lastUpdated: holding.lastUpdated
    }));

    const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    const availableBalance = userData.dashboard.availableCash;
    const investedAmount = userData.dashboard.totalInvested;
    
    // Calcular cambios
    const totalChange24h = assets.reduce((sum, asset) => {
      const assetChange = (asset.valueUSD * asset.change24h) / 100;
      return sum + assetChange;
    }, 0);
    
    const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

    const profitLoss = userData.dashboard.totalProfit;
    const profitLossPercent = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

    return {
      assets,
      transactions: userData.wallet.transactions.map((t: Transaction) => ({
        id: t.id,
        type: t.type,
        asset: t.asset || '',
        amount: t.amount,
        price: t.price || 0,
        total: t.total,
        date: t.date,
        status: t.status
      })),
      summary: {
        totalValue,
        totalChange24h,
        totalChangePercent,
        availableBalance,
        investedAmount,
        profitLoss,
        profitLossPercent
      },
      isLoading: false,
      error: null,
      lastSync: new Date()
    };
  }, []);

  // Función para cargar portfolio del usuario real
  const loadUserPortfolio = useCallback(async () => {
    if (!user) return null;

    try {
      const walletState = transformUserToWalletState(user);
      
      // Si el usuario tiene Bitcoin, obtener precio real
      const bitcoinAsset = walletState.assets.find(asset => 
        asset.id === 'bitcoin' || asset.symbol === 'btc'
      );

      if (bitcoinAsset) {
        const { price: btcPrice, change: btcChange } = await fetchBitcoinPrice();
        
        const updatedAssets = walletState.assets.map(asset => {
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

        // Recalcular summary con precio actualizado
        const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
        const investedAmount = updatedAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
        const profitLoss = totalValue - (user.dashboard.totalInvested || investedAmount);

        return {
          ...walletState,
          assets: updatedAssets,
          summary: {
            ...walletState.summary,
            totalValue,
            investedAmount,
            profitLoss,
            profitLossPercent: (user.dashboard.totalInvested || investedAmount) > 0 ? 
              (profitLoss / (user.dashboard.totalInvested || investedAmount)) * 100 : 0
          }
        };
      }

      return walletState;
    } catch (err) {
      console.error('Error loading user portfolio:', err);
      return transformUserToWalletState(user); // Devolver datos base si falla
    }
  }, [user, transformUserToWalletState, fetchBitcoinPrice]);

  // Función para cargar portfolio demo
  const loadDemoPortfolio = useCallback(async () => {
    try {
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

      const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
      const availableBalance = 5000;
      const investedAmount = totalValue - availableBalance;
      const totalChange24h = updatedAssets.reduce((sum, asset) => {
        const assetChange = (asset.valueUSD * asset.change24h) / 100;
        return sum + assetChange;
      }, 0);
      const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;
      const initialInvestment = 30000;
      const profitLoss = totalValue - initialInvestment;
      const profitLossPercent = (profitLoss / initialInvestment) * 100;

      return {
        ...data,
        assets: updatedAssets,
        summary: {
          totalValue,
          availableBalance,
          investedAmount,
          profitLoss,
          profitLossPercent,
          totalChange24h,
          totalChangePercent
        },
        lastSync: new Date()
      };
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      // Fallback a datos mock con precio real de Bitcoin
      return getMockPortfolioWithRealPrice();
    }
  }, [userId, fetchBitcoinPrice]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let portfolioData;
        
        if (user) {
          // Usuario real
          portfolioData = await loadUserPortfolio();
        } else {
          // Modo demo
          portfolioData = await loadDemoPortfolio();
        }
        
        if (portfolioData) {
          setPortfolio(portfolioData);
          
          if (realTimeUpdates) {
            portfolioWebSocket.connect();
          }
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el portfolio');
        
        // Fallback
        if (user) {
          const fallbackData = transformUserToWalletState(user);
          setPortfolio(fallbackData);
        } else {
          const mockPortfolio = getMockPortfolio();
          setPortfolio(mockPortfolio);
        }
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
  }, [user, realTimeUpdates, loadUserPortfolio, loadDemoPortfolio, transformUserToWalletState]);

  // Función para actualizar el precio de Bitcoin específicamente
  const updateBitcoinPrice = useCallback(async () => {
    const { price: newPrice, change: newChange } = await fetchBitcoinPrice();
    
    if (user) {
      // Actualizar usuario real
      const updatedCryptoHoldings = user.wallet.cryptoHoldings.map(holding => {
        if (holding.symbol === 'btc' || holding.id === 'bitcoin') {
          const newTotalValue = holding.amount * newPrice;
          return {
            ...holding,
            currentValue: newPrice,
            totalValue: newTotalValue,
            change24h: newChange,
            lastUpdated: new Date()
          };
        }
        return holding;
      });

      // Recalcular dashboard
      const totalValue = updatedCryptoHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
      const availableCash = user.dashboard.availableCash;
      const totalInvested = totalValue - availableCash;
      const totalProfit = totalValue - (user.dashboard.totalInvested + availableCash);

      const updatedUser = {
        ...user,
        dashboard: {
          ...user.dashboard,
          totalBalance: totalValue,
          portfolioValue: totalValue,
          totalInvested,
          totalProfit
        },
        wallet: {
          ...user.wallet,
          cryptoHoldings: updatedCryptoHoldings
        }
      };

      updateUser(updatedUser);
    } else {
      // Actualizar estado local (demo)
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

        const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
        const availableBalance = prev.summary.availableBalance;
        const investedAmount = totalValue - availableBalance;
        const totalChange24h = updatedAssets.reduce((sum, asset) => {
          const assetChange = (asset.valueUSD * asset.change24h) / 100;
          return sum + assetChange;
        }, 0);
        const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;
        const initialInvestment = 30000;
        const profitLoss = totalValue - initialInvestment;
        const profitLossPercent = (profitLoss / initialInvestment) * 100;

        return {
          ...prev,
          assets: updatedAssets,
          summary: {
            ...prev.summary,
            totalValue,
            investedAmount,
            profitLoss,
            profitLossPercent,
            totalChange24h,
            totalChangePercent
          },
          lastSync: new Date()
        };
      });
    }
  }, [user, fetchBitcoinPrice, updateUser]);

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
      
      let portfolioData;
      
      if (user) {
        portfolioData = await loadUserPortfolio();
      } else {
        portfolioData = await loadDemoPortfolio();
      }
      
      if (portfolioData) {
        setPortfolio(portfolioData);
      }
    } catch (err) {
      console.error('Error refreshing portfolio:', err);
      // Si falla, al menos actualizar el precio de Bitcoin
      await updateBitcoinPrice();
    } finally {
      setIsLoading(false);
    }
  }, [user, loadUserPortfolio, loadDemoPortfolio, updateBitcoinPrice]);

  // Función para agregar un nuevo asset
  const addAsset = useCallback(async (newAsset: Omit<CryptoAsset, 'id' | 'valueUSD'>) => {
    try {
      const newAssetWithId: CryptoAsset = {
        ...newAsset,
        id: newAsset.symbol.toLowerCase(),
        valueUSD: newAsset.amount * newAsset.currentPrice
      };

      if (user) {
        // Actualizar usuario real
        const updatedCryptoHoldings = [
          ...user.wallet.cryptoHoldings,
          {
            id: newAsset.symbol.toLowerCase(),
            symbol: newAsset.symbol,
            name: newAsset.name,
            amount: newAsset.amount,
            currentValue: newAsset.currentPrice,
            totalValue: newAsset.amount * newAsset.currentPrice,
            change24h: newAsset.change24h || 0,
            allocation: 0,
            lastUpdated: new Date()
          }
        ];

        // Recalcular dashboard
        const totalValue = updatedCryptoHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
        const availableCash = user.dashboard.availableCash - (newAsset.amount * newAsset.currentPrice);
        const totalInvested = totalValue - availableCash;
        const totalProfit = totalValue - (user.dashboard.totalInvested + availableCash);

        const updatedUser = {
          ...user,
          dashboard: {
            ...user.dashboard,
            totalBalance: totalValue,
            portfolioValue: totalValue,
            availableCash,
            totalInvested,
            totalProfit
          },
          wallet: {
            ...user.wallet,
            cryptoHoldings: updatedCryptoHoldings
          }
        };

        updateUser(updatedUser);
      } else {
        // Actualizar estado local (demo)
        setPortfolio(prev => {
          if (!prev) return prev;

          const updatedAssets = [...prev.assets, newAssetWithId];
          const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
          const availableBalance = 5000; // Mantener balance demo
          const investedAmount = totalValue - availableBalance;
          const totalChange24h = updatedAssets.reduce((sum, asset) => {
            const assetChange = (asset.valueUSD * asset.change24h) / 100;
            return sum + assetChange;
          }, 0);
          const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;
          const initialInvestment = 30000;
          const profitLoss = totalValue - initialInvestment;
          const profitLossPercent = (profitLoss / initialInvestment) * 100;

          return {
            ...prev,
            assets: updatedAssets,
            summary: {
              ...prev.summary,
              totalValue,
              investedAmount,
              profitLoss,
              profitLossPercent,
              totalChange24h,
              totalChangePercent
            },
            lastSync: new Date()
          };
        });
      }

    } catch (err) {
      console.error('Error adding asset:', err);
      throw err;
    }
  }, [user, updateUser]);

  return { 
    portfolio, 
    isLoading, 
    error,
    refreshPortfolio,
    addAsset,
    updateBitcoinPrice
  };
};

// Datos mock de respaldo con precio real de Bitcoin
const getMockPortfolioWithRealPrice = async (): Promise<WalletState> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24h_change=true');
    const data = await response.json();
    const btcPrice = data.bitcoin.usd;
    const btcChange = data.bitcoin.usd_24h_change;

    return {
      assets: [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          amount: 0.5,
          currentPrice: btcPrice,
          valueUSD: 0.5 * btcPrice,
          change24h: btcChange,
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
    };
  } catch (error) {
    // Si falla, usar datos mock estáticos
    return getMockPortfolio();
  }
};

// Datos mock estáticos
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