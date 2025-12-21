// src/services/api/walletAPI.ts - CON PRECIOS REALES DE COINGECKO
import type { WalletState } from '../../types/wallet.types';

interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

// Función para obtener precios reales
const getRealPrices = async (): Promise<{
  btc: number;
  eth: number;
  sol: number;
  btc_change: number;
  eth_change: number;
  sol_change: number;
}> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
    );
    
    if (!response.ok) throw new Error('Error fetching prices');
    
    const data: CoinGeckoPrice = await response.json();
    
    return {
      btc: data.bitcoin?.usd || 45000,
      eth: data.ethereum?.usd || 3000,
      sol: data.solana?.usd || 100,
      btc_change: data.bitcoin?.usd_24h_change || 0,
      eth_change: data.ethereum?.usd_24h_change || 0,
      sol_change: data.solana?.usd_24h_change || 0
    };
  } catch (error) {
    console.error('Error fetching real prices:', error);
    // Fallback a precios aproximados
    return {
      btc: 45000,
      eth: 3000,
      sol: 100,
      btc_change: 0,
      eth_change: 0,
      sol_change: 0
    };
  }
};

// Función para obtener datos mock DINÁMICOS
const getMockDataWithRealPrices = async (): Promise<WalletState> => {
  const prices = await getRealPrices();

  return {
    assets: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        amount: 0.5,
        currentPrice: prices.btc,
        valueUSD: 0.5 * prices.btc,
        change24h: prices.btc_change,
        allocation: 45,
        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        blockchain: 'Bitcoin'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        amount: 3.2,
        currentPrice: prices.eth,
        valueUSD: 3.2 * prices.eth,
        change24h: prices.eth_change,
        allocation: 25,
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        blockchain: 'Ethereum'
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        amount: 15,
        currentPrice: prices.sol,
        valueUSD: 15 * prices.sol,
        change24h: prices.sol_change,
        allocation: 8,
        icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
        blockchain: 'Solana'
      }
    ],
    transactions: [
      {
        id: 'tx_001',
        type: 'BUY',
        symbol: 'BTC',
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
        symbol: 'ETH',
        amount: 0.5,
        price: 2900,
        total: 1450,
        timestamp: new Date('2024-01-14T14:20:00'),
        status: 'COMPLETED',
        txHash: '0xdef456abc123...'
      }
    ],
    summary: {
      totalValue: 0,
      totalChange24h: 0,
      totalChangePercent: 0,
      availableBalance: 5200,
      investedAmount: 0,
      profitLoss: 2200,
      profitLossPercent: 8.4
    },
    isLoading: false,
    error: null
  };
};

// API functions
export const walletAPI = {
  getPortfolio: async (): Promise<WalletState> => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obtener datos con precios reales
      const portfolio = await getMockDataWithRealPrices();
      
      // Calcular resumen
      const totalValue = portfolio.assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
      const totalChange24h = portfolio.assets.reduce((sum, asset) => {
        const assetChange = (asset.valueUSD * asset.change24h) / 100;
        return sum + assetChange;
      }, 0);
      const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;
      
      const investedAmount = 28400;
      const profitLoss = totalValue - investedAmount;
      const profitLossPercent = (profitLoss / investedAmount) * 100;

      return {
        ...portfolio,
        summary: {
          totalValue,
          availableBalance: 5200,
          investedAmount,
          profitLoss,
          profitLossPercent,
          totalChange24h,
          totalChangePercent
        }
      };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw new Error('Error obteniendo el portfolio');
    }
  },
  
  getAssetPrice: async (symbol: string): Promise<number> => {
    console.log(`💰 Obteniendo precio para: ${symbol}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
      );
      
      if (!response.ok) throw new Error('Price fetch failed');
      
      const data = await response.json();
      const id = symbol.toLowerCase() === 'btc' ? 'bitcoin' :
                 symbol.toLowerCase() === 'eth' ? 'ethereum' :
                 symbol.toLowerCase() === 'sol' ? 'solana' : symbol.toLowerCase();
      
      return data[id]?.usd || 0;
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
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      const price = await walletAPI.getAssetPrice(symbol);
      const total = price * amount;
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ Operación: ${type} ${amount} ${symbol} a $${price} = $${total}`);
      
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
    } catch (error) {
      console.error('❌ Error ejecutando trade:', error);
      throw error;
    }
  },
  
  getPriceHistory: async (symbol: string, days: number = 7) => {
    console.log(`📈 Obteniendo historial de ${days} días para ${symbol}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const id = symbol.toLowerCase() === 'btc' ? 'bitcoin' :
                 symbol.toLowerCase() === 'eth' ? 'ethereum' :
                 symbol.toLowerCase() === 'sol' ? 'solana' : symbol.toLowerCase();
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) throw new Error('History fetch failed');
      
      const data = await response.json();
      
      return data.prices.map((price: [number, number]) => ({
        date: new Date(price[0]),
        price: price[1],
        volume: data.total_volumes[data.prices.indexOf(price)]?.[1] || 0
      }));
    } catch (error) {
      console.error(`Error fetching history for ${symbol}:`, error);
      throw error;
    }
  },
  
 getTransactions: async (limit: number = 50, offset: number = 0) => {
    console.log(`📋 Obteniendo transacciones (limit: ${limit}, offset: ${offset})`);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const transactions: Array<{
      id: string;
      type: 'BUY' | 'SELL';
      symbol: string;
      amount: number;
      price: number;
      total: number;
      timestamp: Date;
      status: 'COMPLETED' | 'PENDING' | 'FAILED';
      txHash: string;
    }> = [];
    
    const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'BNB'];
    const types: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
    const statuses: ('COMPLETED' | 'PENDING' | 'FAILED')[] = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'PENDING'];
    const mockPrices: Record<string, number> = {
      'BTC': 45000,
      'ETH': 3000,
      'SOL': 100,
      'ADA': 0.5,
      'BNB': 350
    };
    
    for (let i = 0; i < 20; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const price = mockPrices[symbol] || 100;
      const amount = parseFloat((Math.random() * 5).toFixed(4));
      const total = parseFloat((price * amount).toFixed(2));
      
      transactions.push({
        id: `tx_${1000 + i}`,
        type,
        symbol,
        amount,
        price,
        total,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status,
        txHash: `0x${Math.random().toString(36).substr(2, 16)}...`
      });
    }
    
    transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return transactions.slice(offset, offset + limit) ;
  }
};

export default walletAPI;