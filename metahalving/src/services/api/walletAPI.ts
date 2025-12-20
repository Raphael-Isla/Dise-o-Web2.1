// src/services/api/walletAPI.ts
import type { WalletState } from '../../types/wallet.types';

// Mock data para desarrollo
const mockData: WalletState = {
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
      allocation: 8,
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      blockchain: 'Solana'
    }
  ],
  transactions: [
    {
      id: 'tx_001',
      type: 'BUY',
      assetSymbol: 'BTC',
      amount: 0.1,
      price: 44000,
      total: 4400,
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'COMPLETED',
      txHash: '0xabc123def456...'
    },
    {
      id: 'tx_002',
      type: 'SELL',
      assetSymbol: 'ETH',
      amount: 0.5,
      price: 2900,
      total: 1450,
      timestamp: new Date('2024-01-14T14:20:00'),
      status: 'COMPLETED',
      txHash: '0xdef456abc123...'
    }
  ],
  summary: {
    totalValue: 33600,
    totalChange24h: 850,
    totalChangePercent: 2.59,
    availableBalance: 5200,
    investedAmount: 28400,
    profitLoss: 2200,
    profitLossPercent: 8.4
  },
  isLoading: false,
  error: null
};

// Función para verificar si estamos en desarrollo
const isDevelopment = (): boolean => {
  // Para Vite/Client-side
  if (typeof import.meta !== 'undefined') {
    return import.meta.env.MODE === 'development' || import.meta.env.DEV;
  }
  // Por defecto, asumir desarrollo
  return true;
};

// Precios mock basados en símbolos
const mockPrices: Record<string, number> = {
  'BTC': 45000,
  'ETH': 3000,
  'SOL': 100,
  'ADA': 0.5,
  'BNB': 350,
  'XRP': 0.6,
  'DOGE': 0.08,
  'DOT': 7.5,
  'AVAX': 40,
  'LINK': 15
};

// API functions
export const walletAPI = {
  getPortfolio: async (): Promise<WalletState> => {
    // Simular delay de red (más realista)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (isDevelopment()) {
      console.log('📊 Usando datos mock para desarrollo');
      
      // Agregar variabilidad a los precios mock
      const updatedMockData = {
        ...mockData,
        assets: mockData.assets.map(asset => ({
          ...asset,
          currentPrice: mockPrices[asset.symbol.toUpperCase()] || asset.currentPrice,
          change24h: (Math.random() * 10) - 5, // Variación entre -5% y +5%
          valueUSD: asset.amount * (mockPrices[asset.symbol.toUpperCase()] || asset.currentPrice)
        }))
      };
      
      // Recalcular total
      updatedMockData.summary.totalValue = updatedMockData.assets
        .reduce((sum, asset) => sum + asset.valueUSD, 0);
      
      return updatedMockData;
    }
    
    // En producción, harías fetch a tu backend
    try {
      const response = await fetch('/api/wallet/portfolio', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching portfolio:', error);
      throw new Error('No se pudo obtener el portfolio. Intenta de nuevo más tarde.');
    }
  },
  
  getAssetPrice: async (symbol: string): Promise<number> => {
    console.log(`💰 Obteniendo precio para: ${symbol}`);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (isDevelopment()) {
      // Devolver precio mock con variación
      const basePrice = mockPrices[symbol.toUpperCase()] || 1;
      const variation = (Math.random() * 0.02) - 0.01; // ±1%
      return basePrice * (1 + variation);
    }
    
    // En producción, llamada real a API
    try {
      const response = await fetch(`/api/market/price/${symbol.toUpperCase()}`);
      if (!response.ok) throw new Error('Price fetch failed');
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw error;
    }
  },
  
  executeTrade: async (
    type: 'BUY' | 'SELL',
    symbol: string,
    amount: number
  ) => {
    console.log(`🔄 Ejecutando operación: ${type} ${amount} ${symbol}`);
    
    // Simular delay de red para operación
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (isDevelopment()) {
      // Mock de respuesta exitosa
      const price = mockPrices[symbol.toUpperCase()] || 1;
      const total = price * amount;
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ Operación simulada: ${type} ${amount} ${symbol} a $${price} = $${total}`);
      
      return { 
        success: true, 
        orderId,
        symbol: symbol.toUpperCase(),
        type,
        amount,
        price,
        total,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED'
      };
    }
    
    // En producción, llamada real
    try {
      const response = await fetch('/api/trade/execute', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, symbol, amount })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Trade execution failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error ejecutando trade:', error);
      throw error;
    }
  },
  
  // Función adicional: Obtener historial de precios
  getPriceHistory: async (symbol: string, days: number = 7) => {
    console.log(`📈 Obteniendo historial de ${days} días para ${symbol}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isDevelopment()) {
      const basePrice = mockPrices[symbol.toUpperCase()] || 100;
      const history = [];
      let price = basePrice;
      
      for (let i = days; i > 0; i--) {
        // Simular variación diaria
        const change = (Math.random() * 0.1) - 0.05; // ±5%
        price = price * (1 + change);
        
        history.push({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          price: parseFloat(price.toFixed(2)),
          volume: Math.random() * 1000000
        });
      }
      
      return history;
    }
    
    // Llamada real
    try {
      const response = await fetch(`/api/market/history/${symbol}?days=${days}`);
      if (!response.ok) throw new Error('History fetch failed');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching history for ${symbol}:`, error);
      throw error;
    }
  },
  
  // Función para obtener transacciones
  getTransactions: async (limit: number = 50, offset: number = 0) => {
    console.log(`📋 Obteniendo transacciones (limit: ${limit}, offset: ${offset})`);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (isDevelopment()) {
      // Generar transacciones mock adicionales
      const transactions = [];
      const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'BNB'];
      const types: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
      
      for (let i = 0; i < 20; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const price = mockPrices[symbol] || 100;
        const amount = parseFloat((Math.random() * 5).toFixed(4));
        
        transactions.push({
          id: `tx_${1000 + i}`,
          type,
          assetSymbol: symbol,
          amount,
          price,
          total: parseFloat((price * amount).toFixed(2)),
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          status: 'COMPLETED',
          txHash: `0x${Math.random().toString(36).substr(2, 16)}...`
        });
      }
      
      // Ordenar por fecha (más reciente primero)
      transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      return transactions.slice(offset, offset + limit);
    }
    
    // Llamada real
    try {
      const response = await fetch(`/api/wallet/transactions?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Transactions fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
};

export default walletAPI;