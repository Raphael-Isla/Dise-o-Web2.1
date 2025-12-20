// backend/src/controllers/crypto.controller.ts
import { Request, Response } from 'express';

export const cryptoController = {
  getTopCryptos: async (req: Request, res: Response) => {
    try {
      // Datos de ejemplo
      const topCryptos = [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 45000 },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2500 },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.5 }
      ];
      res.json(topCryptos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching top cryptos' });
    }
  },

  getCryptoDetails: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Lógica para obtener detalles
      res.json({ id, details: 'Crypto details here' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching crypto details' });
    }
  },

  getPortfolioPrices: async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;
      // Datos de ejemplo
      const prices = ids.reduce((acc: any, id: string) => {
        acc[id] = {
          current_price: Math.random() * 50000,
          price_change_percentage_24h: Math.random() * 20 - 10
        };
        return acc;
      }, {});
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching portfolio prices' });
    }
  },

  getWebSocketStatus: async (req: Request, res: Response) => {
    res.json({ status: 'connected', timestamp: new Date().toISOString() });
  }
};