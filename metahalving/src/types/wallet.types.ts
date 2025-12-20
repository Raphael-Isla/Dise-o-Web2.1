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
  assetId: string;
  symbol: string;
  amount: number;
  price: number;
  totalUSD: number;
  timestamp: Date;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  fee?: number;
  description?: string;
}

export interface WalletState {
  assets: CryptoAsset[];
  transactions: Transaction[]; // Cambia any[] por Transaction[]
  summary: PortfolioSummary;
  isLoading: boolean;
  error: string | null;
  // Nuevo campo para tiempo real
  lastSync?: Date;
}