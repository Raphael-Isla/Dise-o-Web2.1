// backend/src/controllers/crypto.controller.ts
import { Request, Response } from 'express';
import { coingeckoService } from '../services/coingecko.service';
import { binanceService } from '../services/binance.service';

export class CryptoController {
  async getTopCryptos(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const cryptos = await coingeckoService.getTopCryptos(limit);
      res.json(cryptos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching cryptocurrencies' });
    }
  }

  async getCryptoDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const details = await coingeckoService.getCryptoDetails(id);
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching crypto details' });
    }
  }

  async getPortfolioPrices(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'IDs must be an array' });
      }
      
      const prices = await coingeckoService.getMultiplePrices(ids);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching portfolio prices' });
    }
  }

  async getWebSocketStatus(req: Request, res: Response) {
    res.json({
      connected: binanceService.isReady(),
      message: binanceService.isReady() ? 'WebSocket connected' : 'WebSocket disconnected'
    });
  }
}

export const cryptoController = new CryptoController();