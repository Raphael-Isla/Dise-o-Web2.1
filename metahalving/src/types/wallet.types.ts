// src/types/wallet.types.ts
export interface RealTimePrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  timestamp: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent: number;
  availableBalance: number;
  investedAmount: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  valueUSD: number;
  change24h: number;
  allocation?: number;
  icon?: string;
  blockchain?: string;
  // Nuevos campos para tiempo real
  lastUpdated?: Date;
  volume24h?: number;
  marketCap?: number;
}

// Define una interfaz para las transacciones
export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW' | 'SWAP';
  symbol: string; // Usa solo symbol (elimina assetSymbol)
  amount: number;
  price: number;
  total: number; // Usa solo total (elimina totalUSD)
  timestamp: Date;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  fee?: number;
  description?: string;
  txHash: string;
  // ELIMINA: assetSymbol, totalUSD, assertEquals
}

export interface WalletState {
  assets: CryptoAsset[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any ; // Cambia any[] por Transaction[]
  summary: PortfolioSummary;
  isLoading: boolean;
  error: string | null;
  // Nuevo campo para tiempo real
  lastSync?: Date;
}