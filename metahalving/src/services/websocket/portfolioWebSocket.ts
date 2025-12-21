// src/services/websocket/portfolioWebSocket.ts
import { io, Socket } from 'socket.io-client';
import type { RealTimePrice } from '../../types/wallet.types';

type PriceUpdateCallback = (assetId: string, priceData: RealTimePrice) => void;

class PortfolioWebSocketService {
  private socket: Socket | null = null;
  private assetSubscribers: Map<string, Set<PriceUpdateCallback>> = new Map();
  private isConnected = false;

  connect() {
    const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
    
    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Portfolio WebSocket connected');
      this.isConnected = true;
    });

    this.socket.on('portfolio:priceUpdate', (data: { assetId: string; price: RealTimePrice }) => {
      this.handlePriceUpdate(data.assetId, data.price);
    });

    this.socket.on('disconnect', () => {
      console.log('Portfolio WebSocket disconnected');
      this.isConnected = false;
    });
  }

  private handlePriceUpdate(assetId: string, priceData: RealTimePrice) {
    const callbacks = this.assetSubscribers.get(assetId);
    if (callbacks) {
      callbacks.forEach(callback => callback(assetId, priceData));
    }
  }

  subscribeToAsset(assetId: string, callback: PriceUpdateCallback) {
    if (!this.assetSubscribers.has(assetId)) {
      this.assetSubscribers.set(assetId, new Set());
    }
    
    this.assetSubscribers.get(assetId)?.add(callback);
    
    // Enviar suscripción al servidor
    if (this.isConnected && this.socket) {
      this.socket.emit('portfolio:subscribe', assetId);
    }

    return () => {
      this.unsubscribeFromAsset(assetId, callback);
    };
  }

  private unsubscribeFromAsset(assetId: string, callback: PriceUpdateCallback) {
    this.assetSubscribers.get(assetId)?.delete(callback);
    
    if (this.assetSubscribers.get(assetId)?.size === 0) {
      this.assetSubscribers.delete(assetId);
      if (this.isConnected && this.socket) {
        this.socket.emit('portfolio:unsubscribe', assetId);
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.assetSubscribers.clear();
      this.isConnected = false;
    }
  }

  isConnectedToSocket(): boolean {
    return this.isConnected;
  }
}

export const portfolioWebSocket = new PortfolioWebSocketService();