/* ========================================
ARCHIVO 7: src/services/api/storageAPI.ts
======================================== */

// ==================== INTERFACES ====================
interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  date: Date;
  fee?: number;
  notes?: string;
}
// En storageAPI.ts, actualiza la interfaz PriceAlert:
interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below' | 'equals';
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  // Agregar propiedades adicionales
  notificationCount?: number;
  enableEmail?: boolean;
  enablePush?: boolean;
}
// Interfaz para Transaction en formato JSON (con fecha como string)
interface RawTransaction extends Omit<Transaction, 'date'> {
  date: string;
}
interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below' | 'equals';
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  // Agregar propiedades adicionales
  notificationCount?: number;
  enableEmail?: boolean;
  enablePush?: boolean;
}

// Interfaz para PriceAlert en formato JSON
interface RawPriceAlert extends Omit<PriceAlert, 'createdAt' | 'triggeredAt'> {
  createdAt: string;
  triggeredAt?: string;
}

interface PortfolioItem {
  symbol: string;
  amount: number;
  avgPrice: number;
  currentPrice?: number;
  profitLoss?: number;
}

interface Portfolio {
  id: string;
  userId: string;
  items: PortfolioItem[];
  totalValue: number;
  totalInvested: number;
  lastUpdated: Date;
}

// Interfaz para Portfolio en formato JSON
interface RawPortfolio extends Omit<Portfolio, 'lastUpdated'> {
  lastUpdated: string;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
  currency: 'USD' | 'EUR' | 'GBP';
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorAuth: boolean;
  autoSave: boolean;
  defaultView: 'dashboard' | 'portfolio' | 'watchlist';
}

// ==================== CLASE STORAGE API ====================
class StorageAPI {
  private readonly PREFIX = 'metahalving_';

  // ========== PORTFOLIO ==========
  savePortfolio(userId: string, portfolio: Portfolio): void {
    try {
      const key = `${this.PREFIX}portfolio_${userId}`;
      localStorage.setItem(key, JSON.stringify(portfolio));
    } catch (error) {
      console.error('Error saving portfolio:', error);
      throw new Error('No se pudo guardar el portfolio');
    }
  }

  getPortfolio(userId: string): Portfolio | null {
    try {
      const key = `${this.PREFIX}portfolio_${userId}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const parsed: RawPortfolio = JSON.parse(data);
      // Convertir fechas de string a Date
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated)
      };
    } catch (error) {
      console.error('Error loading portfolio:', error);
      return null;
    }
  }

  deletePortfolio(userId: string): void {
    const key = `${this.PREFIX}portfolio_${userId}`;
    localStorage.removeItem(key);
  }

  // ========== TRANSACTIONS ==========
  saveTransactions(userId: string, transactions: Transaction[]): void {
    try {
      const key = `${this.PREFIX}transactions_${userId}`;
      localStorage.setItem(key, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
      throw new Error('No se pudieron guardar las transacciones');
    }
  }

  getTransactions(userId: string): Transaction[] {
    try {
      const key = `${this.PREFIX}transactions_${userId}`;
      const data = localStorage.getItem(key);
      if (!data) return [];
      
      const rawTransactions: RawTransaction[] = JSON.parse(data);
      // Convertir fechas de string a Date
      return rawTransactions.map(t => ({
        ...t,
        date: new Date(t.date)
      }));
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  addTransaction(userId: string, transaction: Transaction): void {
    try {
      const transactions = this.getTransactions(userId);
      transactions.push(transaction);
      this.saveTransactions(userId, transactions);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  deleteTransaction(userId: string, transactionId: string): void {
    try {
      const transactions = this.getTransactions(userId);
      const filtered = transactions.filter(t => t.id !== transactionId);
      this.saveTransactions(userId, filtered);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // ========== PRICE ALERTS ==========
  savePriceAlerts(userId: string, alerts: PriceAlert[]): void {
    try {
      const key = `${this.PREFIX}price_alerts_${userId}`;
      localStorage.setItem(key, JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving price alerts:', error);
      throw new Error('No se pudieron guardar las alertas');
    }
  }

  getPriceAlerts(userId: string): PriceAlert[] {
    try {
      const key = `${this.PREFIX}price_alerts_${userId}`;
      const data = localStorage.getItem(key);
      if (!data) return [];
      
      const rawAlerts: RawPriceAlert[] = JSON.parse(data);
      return rawAlerts.map(a => ({
        ...a,
        createdAt: new Date(a.createdAt),
        triggeredAt: a.triggeredAt ? new Date(a.triggeredAt) : undefined
      }));
    } catch (error) {
      console.error('Error loading price alerts:', error);
      return [];
    }
  }

  addPriceAlert(userId: string, alert: PriceAlert): void {
    try {
      const alerts = this.getPriceAlerts(userId);
      alerts.push(alert);
      this.savePriceAlerts(userId, alerts);
    } catch (error) {
      console.error('Error adding price alert:', error);
      throw error;
    }
  }

  updatePriceAlert(userId: string, alertId: string, updates: Partial<PriceAlert>): void {
    try {
      const alerts = this.getPriceAlerts(userId);
      const index = alerts.findIndex(a => a.id === alertId);
      if (index !== -1) {
        alerts[index] = { ...alerts[index], ...updates };
        this.savePriceAlerts(userId, alerts);
      }
    } catch (error) {
      console.error('Error updating price alert:', error);
      throw error;
    }
  }

  deletePriceAlert(userId: string, alertId: string): void {
    try {
      const alerts = this.getPriceAlerts(userId);
      const filtered = alerts.filter(a => a.id !== alertId);
      this.savePriceAlerts(userId, filtered);
    } catch (error) {
      console.error('Error deleting price alert:', error);
      throw error;
    }
  }

  // ========== SETTINGS ==========
  saveSettings(userId: string, settings: UserSettings): void {
    try {
      const key = `${this.PREFIX}settings_${userId}`;
      localStorage.setItem(key, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  getSettings(userId: string): UserSettings {
    try {
      const key = `${this.PREFIX}settings_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  private getDefaultSettings(): UserSettings {
    return {
      theme: 'light',
      language: 'es',
      currency: 'USD',
      emailNotifications: true,
      pushNotifications: false,
      twoFactorAuth: false,
      autoSave: true,
      defaultView: 'dashboard'
    };
  }

  // ========== WATCHLIST ==========
  saveWatchlist(userId: string, symbols: string[]): void {
    try {
      const key = `${this.PREFIX}watchlist_${userId}`;
      localStorage.setItem(key, JSON.stringify(symbols));
    } catch (error) {
      console.error('Error saving watchlist:', error);
      throw error;
    }
  }

  getWatchlist(userId: string): string[] {
    try {
      const key = `${this.PREFIX}watchlist_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  }

  addToWatchlist(userId: string, symbol: string): void {
    try {
      const watchlist = this.getWatchlist(userId);
      if (!watchlist.includes(symbol.toUpperCase())) {
        watchlist.push(symbol.toUpperCase());
        this.saveWatchlist(userId, watchlist);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  removeFromWatchlist(userId: string, symbol: string): void {
    try {
      const watchlist = this.getWatchlist(userId);
      const filtered = watchlist.filter(s => s !== symbol.toUpperCase());
      this.saveWatchlist(userId, filtered);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  // ========== CLEANUP ==========
  clearUserData(userId: string): void {
    try {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.PREFIX) && key.includes(userId)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }

  // ========== UTILITIES ==========
  getStorageSize(): number {
    let size = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            size += value.length + key.length;
          }
        } catch {
          // Ignorar errores para keys no accesibles
        }
      }
    }
    return size;
  }

  // Método útil para debug
  getUserStorageInfo(userId: string): Record<string, number> {
    const info: Record<string, number> = {};
    const keys = ['portfolio', 'transactions', 'price_alerts', 'settings', 'watchlist'];
    
    keys.forEach(key => {
      const data = localStorage.getItem(`${this.PREFIX}${key}_${userId}`);
      info[key] = data?.length || 0;
    });
    
    return info;
  }
}

export const storageAPI = new StorageAPI();

// Exportar interfaces para uso en otros archivos
export type { Transaction, PriceAlert, Portfolio, UserSettings, PortfolioItem };