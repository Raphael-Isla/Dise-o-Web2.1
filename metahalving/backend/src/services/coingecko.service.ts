// backend/src/services/coingecko.service.ts
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

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
  sparkline_in_7d?: {
    price: number[];
  };
}

export class CoinGeckoService {
  private cache: Map<string, { data: CryptoPrice[]; timestamp: number }> = new Map();
  private CACHE_DURATION = 60000; // 1 minuto

  async getTopCryptos(limit: number = 50): Promise<CryptoPrice[]> {
    const cacheKey = `top_${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: true,
          price_change_percentage: '1h,24h,7d'
        }
      });

      const data = response.data;
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Error fetching from CoinGecko:', error);
      throw error;
    }
  }

  async getCryptoDetails(id: string): Promise<any> {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for ${id}:`, error);
      throw error;
    }
  }

  async getMultiplePrices(ids: string[]): Promise<Record<string, CryptoPrice>> {
    const cryptos = await this.getTopCryptos(100);
    const result: Record<string, CryptoPrice> = {};
    
    ids.forEach(id => {
      const crypto = cryptos.find(c => c.id === id);
      if (crypto) result[id] = crypto;
    });
    
    return result;
  }
}

export const coingeckoService = new CoinGeckoService();