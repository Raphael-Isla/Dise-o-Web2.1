// src/hooks/useRealTimePrices.ts
import { useEffect, useState, useCallback } from 'react';
import { priceFeedService, RealTimePrice } from '../services/websocket/priceFeed';
import { cryptoAPI, CryptoPrice } from '../services/api/cryptoAPI';

export const useRealTimePrices = (symbols: string[]) => {
  const [prices, setPrices] = useState<Record<string, RealTimePrice>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener precios iniciales
  useEffect(() => {
    const fetchInitialPrices = async () => {
      try {
        setLoading(true);
        
        // Mapear símbolos a IDs de CoinGecko
        const coinGeckoIds = symbols.map(symbol => 
          symbol.toLowerCase() === 'btc' ? 'bitcoin' :
          symbol.toLowerCase() === 'eth' ? 'ethereum' :
          symbol.toLowerCase() === 'sol' ? 'solana' : symbol.toLowerCase()
        );
        
        const initialPrices = await cryptoAPI.getPortfolioPrices(coinGeckoIds);
        
        // Convertir a formato RealTimePrice
        const formattedPrices: Record<string, RealTimePrice> = {};
        Object.entries(initialPrices).forEach(([id, data]: [string, CryptoPrice]) => { // Cambia 'any' por 'CryptoPrice'
          const symbol = symbols.find(s => 
            s.toLowerCase() === id || 
            (id === 'bitcoin' && s.toLowerCase() === 'btc') ||
            (id === 'ethereum' && s.toLowerCase() === 'eth') ||
            (id === 'solana' && s.toLowerCase() === 'sol')
          );
          
          if (symbol) {
            formattedPrices[symbol.toUpperCase()] = {
              symbol: symbol.toUpperCase(),
              price: data.current_price,
              change: data.price_change_24h,
              changePercent: data.price_change_percentage_24h,
              volume: data.total_volume || 0, // Usa datos reales si existen
              high: data.high_24h || 0,
              low: data.low_24h || 0,
              timestamp: Date.now()
            };
          }
        });
        
        setPrices(formattedPrices);
        setError(null);
      } catch (err) {
        setError('Error al obtener precios iniciales');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (symbols.length > 0) {
      fetchInitialPrices();
    }
  }, [symbols]);

  // Suscribirse a actualizaciones en tiempo real
  useEffect(() => {
    const unsubscribeCallbacks: (() => void)[] = [];

    symbols.forEach(symbol => {
      const unsubscribe = priceFeedService.subscribe(symbol, (priceData) => {
        setPrices(prev => ({
          ...prev,
          [priceData.symbol.toUpperCase()]: priceData
        }));
      });
      unsubscribeCallbacks.push(unsubscribe);
    });

    // Cleanup
    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, [symbols]);

  const getPrice = useCallback((symbol: string) => {
    return prices[symbol.toUpperCase()] || null;
  }, [prices]);

  const getAllPrices = useCallback(() => {
    return prices;
  }, [prices]);

  return {
    prices: getAllPrices(),
    getPrice,
    loading,
    error,
    isConnected: priceFeedService.isConnectedToSocket()
  };
};