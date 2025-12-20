// src/services/websocket/priceFeed.ts
import { io, Socket } from 'socket.io-client';

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

type PriceUpdateCallback = (price: RealTimePrice) => void;

class PriceFeedService {
  private socket: Socket | null = null;
  private subscribers: Map<string, Set<PriceUpdateCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnected = false;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3001';
    
    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Resuscribir a todos los símbolos
      this.subscribers.forEach((_, symbol) => {
        this.subscribeToSymbol(symbol);
      });
    });

    this.socket.on('priceUpdate', (data: RealTimePrice) => {
      this.handlePriceUpdate(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
      this.handleReconnection();
    });
  }

  private handlePriceUpdate(priceData: RealTimePrice) {
    const symbol = priceData.symbol.toLowerCase();
    const callbacks = this.subscribers.get(symbol);
    
    if (callbacks) {
      callbacks.forEach(callback => {
        callback({ ...priceData, timestamp: Date.now() });
      });
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        }
      }, 1000 * this.reconnectAttempts);
    }
  }

  private subscribeToSymbol(symbol: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe', [symbol]);
    }
  }

  subscribe(symbol: string, callback: PriceUpdateCallback): () => void {
    const normalizedSymbol = symbol.toLowerCase();
    
    if (!this.subscribers.has(normalizedSymbol)) {
      this.subscribers.set(normalizedSymbol, new Set());
    }
    
    this.subscribers.get(normalizedSymbol)?.add(callback);
    
    // Suscribir en el servidor si estamos conectados
    if (this.isConnected) {
      this.subscribeToSymbol(normalizedSymbol);
    }

    // Devolver función para desuscribir
    return () => {
      this.unsubscribe(normalizedSymbol, callback);
    };
  }

  private unsubscribe(symbol: string, callback: PriceUpdateCallback) {
    const normalizedSymbol = symbol.toLowerCase();
    this.subscribers.get(normalizedSymbol)?.delete(callback);
    
    // Si no hay más suscriptores, dejar de escuchar este símbolo
    if (this.subscribers.get(normalizedSymbol)?.size === 0) {
      this.subscribers.delete(normalizedSymbol);
      if (this.socket && this.isConnected) {
        this.socket.emit('unsubscribe', [normalizedSymbol]);
      }
    }
  }

  isConnectedToSocket(): boolean {
    return this.isConnected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.subscribers.clear();
      this.isConnected = false;
    }
  }
}

export const priceFeedService = new PriceFeedService();