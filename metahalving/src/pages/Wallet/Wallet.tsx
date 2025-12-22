import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown,
  Wallet as WalletIcon,
  DollarSign,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio';
import AssetTable from '../../components/wallet/AssetTable/AssetTable';
import { walletAPI } from '../../services/api/walletAPI';

const Wallet: React.FC = () => {
  const { portfolio, isLoading, error, refreshPortfolio } = usePortfolio();
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [amount, setAmount] = useState<string>('');
  const [isTrading, setIsTrading] = useState(false);

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa una cantidad válida');
      return;
    }

    setIsTrading(true);
    try {
      const result = await walletAPI.executeTrade(type, selectedAsset, parseFloat(amount));
      alert(`¡Operación exitosa! ID: ${result.orderId}`);
      setAmount('');
      setShowBuyForm(false);
      setShowSellForm(false);
      // Actualizar los datos del portfolio
      await refreshPortfolio();
    } catch (error) {
      console.error('Error executing trade:', error);
      alert('Error al ejecutar la operación');
    } finally {
      setIsTrading(false);
    }
  };

  const handleAssetClick = (asset: { symbol: string }) => {
  const { symbol } = asset;
  setSelectedAsset(symbol);
  setShowBuyForm(true);
};
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu cartera...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-red-800 font-bold text-lg">Error cargando datos</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={() => refreshPortfolio()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <WalletIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mi Cartera</h1>
              <p className="text-gray-300">Gestiona tus activos criptográficos en tiempo real</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => refreshPortfolio()}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Actualizar datos"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowBuyForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="h-5 w-5" />
              Comprar
            </button>
            <button
              onClick={() => setShowSellForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <Minus className="h-5 w-5" />
              Vender
            </button>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <ArrowUpDown className="h-5 w-5" />
              Intercambiar
            </button>
          </div>
        </div>
      </div>

      {/* Resumen - Tarjetas mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${portfolio?.summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-green-600 font-medium">+{(portfolio?.summary.totalChangePercent || 0).toFixed(2)}%</span>
            <span className="mx-2">•</span>
            <span>24h</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Balance Disponible</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${portfolio?.summary.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-r from-green-50 to-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Para operaciones inmediatas
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ganancias/Pérdidas</h3>
              <p className={`text-3xl font-bold mt-2 ${
                (portfolio?.summary.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${portfolio?.summary.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              (portfolio?.summary.profitLoss || 0) >= 0 
                ? 'bg-gradient-to-r from-green-50 to-green-100' 
                : 'bg-gradient-to-r from-red-50 to-red-100'
            }`}>
              {(portfolio?.summary.profitLoss || 0) >= 0 
                ? <TrendingUp className="h-6 w-6 text-green-600" />
                : <TrendingDown className="h-6 w-6 text-red-600" />
              }
            </div>
          </div>
          <div className={`text-sm font-medium ${
            (portfolio?.summary.profitLossPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {(portfolio?.summary.profitLossPercent || 0) >= 0 ? '+' : ''}
            {(portfolio?.summary.profitLossPercent || 0).toFixed(2)}%
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Activos en Cartera</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {portfolio?.assets.length || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {portfolio?.assets.map(a => a.symbol.toUpperCase()).join(', ') || 'Sin activos'}
          </div>
        </div>
      </div>

      {/* Tabla de Activos con mejoras */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tus Activos</h2>
              <p className="text-gray-600">
                {portfolio?.assets.length || 0} activos en tu cartera • Total: 
                <span className="font-bold text-gray-900 ml-1">
                  ${portfolio?.summary.totalValue.toLocaleString() || '0'}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyForm(true)}
                className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium"
              >
                + Agregar Activo
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <AssetTable
            assets={portfolio?.assets || []}
            onAssetClick={handleAssetClick}
          />
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600">
              Última actualización: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-600 font-medium">Conectado en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Compra mejorado */}
      {showBuyForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Comprar Criptomoneda</h3>
                    <p className="text-gray-600 text-sm">Realiza una nueva compra</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBuyForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <span className="text-gray-700">Seleccionar Activo</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  <option value="BTC" className="text-gray-900">Bitcoin (BTC)</option>
                  <option value="ETH" className="text-gray-900">Ethereum (ETH)</option>
                  <option value="SOL" className="text-gray-900">Solana (SOL)</option>
                  <option value="ADA" className="text-gray-900">Cardano (ADA)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <span className="text-gray-700">Cantidad</span>
                  <span className="text-gray-500 text-sm ml-2">({selectedAsset})</span>
                </label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ej: 0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              {/* Información de la operación */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Precio estimado</p>
                      <p className="font-semibold text-gray-900">
                        ${(45000).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total estimado</p>
                      <p className="font-semibold text-gray-900">
                        ${(45000 * parseFloat(amount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleTrade('BUY')}
                  disabled={isTrading || !amount || parseFloat(amount) <= 0}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isTrading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Compra'
                  )}
                </button>
                <button
                  onClick={() => setShowBuyForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Venta mejorado */}
      {showSellForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-red-50 to-red-100 rounded-xl flex items-center justify-center">
                    <Minus className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Vender Criptomoneda</h3>
                    <p className="text-gray-600 text-sm">Realiza una nueva venta</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSellForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <span className="text-gray-700">Seleccionar Activo</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  {portfolio?.assets.map(asset => (
                    <option key={asset.id} value={asset.symbol} className="text-gray-900">
                      {asset.name} ({asset.symbol.toUpperCase()}) - Disponible: {asset.amount.toFixed(6)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <span className="text-gray-700">Cantidad a Vender</span>
                  <span className="text-gray-500 text-sm ml-2">({selectedAsset})</span>
                </label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Ej: 0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              {/* Información de la operación */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Precio estimado</p>
                      <p className="font-semibold text-gray-900">
                        ${(45000).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total estimado</p>
                      <p className="font-semibold text-gray-900">
                        ${(45000 * parseFloat(amount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleTrade('SELL')}
                  disabled={isTrading || !amount || parseFloat(amount) <= 0}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isTrading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Venta'
                  )}
                </button>
                <button
                  onClick={() => setShowSellForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;