// src/services/api/realWalletAPI.ts
import axios from 'axios';
import type { WalletState, CryptoAsset } from '../../types/wallet.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// Define el tipo PortfolioSummary aquí
export interface PortfolioSummary {
  totalValue: number;
  availableBalance: number;
  investedAmount: number;
  profitLoss: number;
  profitLossPercent: number;
  totalChange24h: number;
  totalChangePercent: number;
}

export class RealWalletAPI {
  async getPortfolio(userId?: string): Promise<WalletState> {
    try {
      // 1. Obtener portfolio del usuario (esto vendría de tu backend)
       console.log('API URL:', API_BASE_URL); // Para debug
      const portfolioResponse = await axios.get(`${API_BASE_URL}/portfolio/${userId || 'demo'}`);
      
      // 2. Obtener precios actualizados para los assets
      const assetIds = portfolioResponse.data.assets.map((asset: CryptoAsset) => asset.id);
      const pricesResponse = await axios.post(`${API_BASE_URL}/crypto/prices`, {
        ids: assetIds
      });

      // 3. Actualizar los assets con precios reales
      const updatedAssets = portfolioResponse.data.assets.map((asset: CryptoAsset) => {
        const realTimePrice = pricesResponse.data[asset.id];
        if (realTimePrice) {
          return {
            ...asset,
            currentPrice: realTimePrice.current_price,
            valueUSD: asset.amount * realTimePrice.current_price,
            change24h: realTimePrice.price_change_percentage_24h,
            lastUpdated: new Date()
          };
        }
        return asset;
      });

      // 4. Calcular resumen actualizado
      const summary = this.calculateSummary(updatedAssets);

      return {
        assets: updatedAssets,
        transactions: portfolioResponse.data.transactions || [],
        summary,
        isLoading: false,
        error: null,
        lastSync: new Date()
      };

    } catch (error) {
      console.error('Error fetching real portfolio:', error);
      throw error;
    }
  }

  async updateAssetPrice(assetId: string, newPrice: number): Promise<CryptoAsset> {
    // Lógica para actualizar precio individual
    const response = await axios.patch(`${API_BASE_URL}/portfolio/asset/${assetId}`, {
      currentPrice: newPrice
    });
    return response.data;
  }

  private calculateSummary(assets: CryptoAsset[]): PortfolioSummary {
    const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    const availableBalance = 5000; // Esto vendría de la API de usuario
    const investedAmount = totalValue - availableBalance;
    
    // Calcular cambios
    const totalChange24h = assets.reduce((sum, asset) => {
      const assetChange = (asset.valueUSD * asset.change24h) / 100;
      return sum + assetChange;
    }, 0);
    
    const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

    // Ganancia/pérdida (esto sería vs inversión inicial)
    const initialInvestment = 30000; // Debería venir de la base de datos
    const profitLoss = totalValue - initialInvestment;
    const profitLossPercent = (profitLoss / initialInvestment) * 100;

    return {
      totalValue,
      availableBalance,
      investedAmount,
      profitLoss,
      profitLossPercent,
      totalChange24h,
      totalChangePercent
    };
  }
}

export const realWalletAPI = new RealWalletAPI();