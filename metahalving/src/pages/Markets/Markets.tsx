import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Star, Filter } from 'lucide-react';

interface CryptoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number | null;
  market_cap_rank: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number;
  circulating_supply: number | null;
  total_supply: number | null;
  total_volume: number | null;
  image: string;
}

const Markets: React.FC = () => {
  const [cryptos, setCryptos] = useState<CryptoMarket[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'market_cap' | 'price_change' | 'volume'>('market_cap');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCryptos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=es'
        );
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos cargados:', data.length, 'criptos');
        
        setCryptos(data);
        setFilteredCryptos(data);
      } catch (error) {
        console.error('Error loading cryptos:', error);
        setError('Error al cargar las criptomonedas. Usando datos de demostración.');
        
        // Fallback a datos mock
        const mockData = getMockCryptos();
        setCryptos(mockData);
        setFilteredCryptos(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    loadCryptos();
  }, []);

  // Filtrar y ordenar
  useEffect(() => {
    let filtered = [...cryptos];
    
    if (searchTerm) {
      filtered = filtered.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'market_cap') {
        return (b.market_cap || 0) - (a.market_cap || 0);
      } else if (sortBy === 'price_change') {
        return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
      } else {
        return (b.total_volume || 0) - (a.total_volume || 0);
      }
    });

    setFilteredCryptos(filtered);
  }, [searchTerm, sortBy, cryptos]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const formatNumber = (num: number | null | undefined, decimals: number = 2): string => {
    if (!num) return 'N/A';
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando criptomonedas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mercados de Criptomonedas</h1>
        <p className="text-gray-600 mt-2">Explora los top {filteredCryptos.length} criptomonedas por capitalización de mercado</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Controles */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Buscador */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cripto (Bitcoin, BTC, ETH...)..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtro de ordenamiento */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="outline-none text-gray-700 font-medium"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'market_cap' | 'price_change' | 'volume')}
            >
              <option value="market_cap">Market Cap</option>
              <option value="price_change">Cambio 24h</option>
              <option value="volume">Volumen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Criptos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cripto
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cambio 24h
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Volumen 24h
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Favorito
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCryptos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg">No se encontraron criptomonedas</p>
                  </td>
                </tr>
              ) : (
                filteredCryptos.map((crypto, index) => (
                  <tr key={crypto.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* Ranking */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                        {crypto.market_cap_rank || index + 1}
                      </span>
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {crypto.image ? (
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="h-10 w-10 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {crypto.symbol.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{crypto.name}</p>
                          <p className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Precio */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="font-semibold text-gray-900">
                        ${crypto.current_price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </td>

                    {/* Cambio 24h */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                        (crypto.price_change_percentage_24h || 0) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {(crypto.price_change_percentage_24h || 0) >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {(crypto.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                        {(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                      </div>
                    </td>

                    {/* Volumen 24h */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-gray-700 font-medium">
                        ${formatNumber(crypto.total_volume, 1)}
                      </p>
                    </td>

                    {/* Market Cap */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-gray-700 font-semibold">
                        ${formatNumber(crypto.market_cap, 1)}
                      </p>
                    </td>

                    {/* Favorito */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleFavorite(crypto.id)}
                        className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${
                          favorites.includes(crypto.id)
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Star
                          className="h-5 w-5"
                          fill={favorites.includes(crypto.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-blue-700 mb-2">Total Criptomonedas</h3>
          <p className="text-3xl font-bold text-blue-900">{filteredCryptos.length}</p>
          <p className="text-xs text-blue-600 mt-2">En la lista de mercados</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-green-700 mb-2">En Favoritos</h3>
          <p className="text-3xl font-bold text-green-900">{favorites.length}</p>
          <p className="text-xs text-green-600 mt-2">Criptos guardadas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-purple-700 mb-2">Top Cripto</h3>
          <p className="text-3xl font-bold text-purple-900">
            {filteredCryptos.length > 0 ? filteredCryptos[0].symbol.toUpperCase() : 'N/A'}
          </p>
          <p className="text-xs text-purple-600 mt-2">Mayor capitalización</p>
        </div>
      </div>
    </div>
  );
};

// Datos mock
const getMockCryptos = (): CryptoMarket[] => [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 45000,
    market_cap: 900000000000,
    market_cap_rank: 1,
    price_change_24h: 1200,
    price_change_percentage_24h: 2.8,
    circulating_supply: 21000000,
    total_supply: 21000000,
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    total_volume: 25000000000
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 3000,
    market_cap: 360000000000,
    market_cap_rank: 2,
    price_change_24h: -50,
    price_change_percentage_24h: -1.6,
    circulating_supply: 120000000,
    total_supply: 120000000,
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    total_volume: 15000000000
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    current_price: 100,
    market_cap: 35000000000,
    market_cap_rank: 5,
    price_change_24h: 3,
    price_change_percentage_24h: 3.1,
    circulating_supply: 350000000,
    total_supply: 500000000,
    image: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    total_volume: 2000000000
  }
];

export default Markets;