// backend/src/services/binance.service.ts
import WebSocket from 'ws';

export interface BinanceTicker {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price  
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

export class BinanceWebSocketService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectInterval = 5000;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    this.ws.on('open', () => {
      console.log('Conectado a Binance WebSocket');
      this.isConnected = true;
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const tickers: BinanceTicker[] = JSON.parse(data.toString());
        this.handleTickers(tickers);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.ws.on('close', () => {
      console.log('Conexión Binance WebSocket cerrada');
      this.isConnected = false;
      setTimeout(() => this.connect(), this.reconnectInterval);
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleTickers(tickers: BinanceTicker[]) {
    tickers.forEach(ticker => {
      const symbol = ticker.s.toLowerCase();
      if (this.subscribers.has(symbol)) {
        const priceData = {
          symbol: ticker.s,
          price: parseFloat(ticker.c),
          change: parseFloat(ticker.p),
          changePercent: parseFloat(ticker.P),
          volume: parseFloat(ticker.v),
          high: parseFloat(ticker.h),
          low: parseFloat(ticker.l)
        };

        const callbacks = this.subscribers.get(symbol);
        callbacks?.forEach(callback => callback(priceData));
      }
    });
  }

  subscribe(symbol: string, callback: (data: any) => void) {
    const normalizedSymbol = symbol.toLowerCase();
    
    if (!this.subscribers.has(normalizedSymbol)) {
      this.subscribers.set(normalizedSymbol, new Set());
    }
    
    this.subscribers.get(normalizedSymbol)?.add(callback);
  }

  unsubscribe(symbol: string, callback: (data: any) => void) {
    const normalizedSymbol = symbol.toLowerCase();
    this.subscribers.get(normalizedSymbol)?.delete(callback);
  }

  isReady(): boolean {
    return this.isConnected;
  }
}

export const binanceService = new BinanceWebSocketService();