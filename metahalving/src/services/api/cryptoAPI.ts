// src/services/api/cryptoAPI.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Extiende la interfaz CryptoPrice para incluir todas las propiedades necesarias
export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  
  // Propiedades opcionales que pueden venir de la API
  total_volume?: number;
  high_24h?: number;
  low_24h?: number;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: string;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated?: string;
  
  image?: string;
  sparkline_in_7d?: {
    price: number[];
  };
}
// Agrega esta nueva interfaz para los detalles
export interface CryptoDetails {
  id: string;
  symbol: string;
  name: string;
  description?: {
    en: string;
  };
  links?: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: {
      github: string[];
    };
  };
  image?: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      eur: number;
      btc: number;
    };
    market_cap: {
      usd: number;
      eur: number;
      btc: number;
    };
    total_volume: {
      usd: number;
      eur: number;
      btc: number;
    };
    high_24h: {
      usd: number;
      eur: number;
      btc: number;
    };
    low_24h: {
      usd: number;
      eur: number;
      btc: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: {
      usd: number;
      eur: number;
      btc: number;
    };
    ath_change_percentage: {
      usd: number;
      eur: number;
      btc: number;
    };
    ath_date: {
      usd: string;
      eur: string;
      btc: string;
    };
    atl: {
      usd: number;
      eur: number;
      btc: number;
    };
    atl_change_percentage: {
      usd: number;
      eur: number;
      btc: number;
    };
    atl_date: {
      usd: string;
      eur: string;
      btc: string;
    };
    last_updated: string;
  };
  community_data?: {
    facebook_likes: number;
    twitter_followers: number;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
  };
  developer_data?: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number;
      deletions: number;
    };
  };
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  valueUSD: number;
  change24h: number;
  allocation?: number;
}

class CryptoAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async getTopCryptos(limit: number = 50): Promise<CryptoPrice[]> {
    try {
      const response = await this.api.get('/crypto/top', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      throw error;
    }
  }

  // Cambia Promise<any> por Promise<CryptoDetails>
  async getCryptoDetails(id: string): Promise<CryptoDetails> {
    try {
      const response = await this.api.get(`/crypto/details/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for ${id}:`, error);
      throw error;
    }
  }

  async getPortfolioPrices(assetIds: string[]): Promise<Record<string, CryptoPrice>> {
    try {
      const response = await this.api.post('/crypto/portfolio-prices', {
        ids: assetIds
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio prices:', error);
      throw error;
    }
  }

  async getWebSocketStatus(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await this.api.get('/crypto/ws-status');
      return response.data;
    } catch (error) {
      console.error('Error checking WebSocket status:', error);
      return { connected: false, message: 'Error checking connection' };
    }
  }
}

export const cryptoAPI = new CryptoAPI();