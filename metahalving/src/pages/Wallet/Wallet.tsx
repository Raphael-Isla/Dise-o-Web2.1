import React, { useState } from 'react';
import { Plus, Minus, ArrowUpDown } from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio';
import  AssetTable  from '../../components/wallet/AssetTable/AssetTable';
import { walletAPI } from '../../services/api/walletAPI';

const Wallet: React.FC = () => {
  const { portfolio, isLoading, error } = usePortfolio();
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [amount, setAmount] = useState<string>('');

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa una cantidad válida');
      return;
    }

    try {
      const result = await walletAPI.executeTrade(type, selectedAsset, parseFloat(amount));
      alert(`¡Operación exitosa! ID: ${result.orderId}`);
      setAmount('');
      setShowBuyForm(false);
      setShowSellForm(false);
      // Recargar la página o actualizar datos
      window.location.reload();
    } catch (error) {
      console.error('Error executing trade:', error);
      alert('Error al ejecutar la operación');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error cargando datos</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Cartera</h1>
          <p className="text-gray-600">Gestiona tus activos criptográficos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBuyForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Comprar
          </button>
          <button
            onClick={() => setShowSellForm(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Minus className="h-5 w-5" />
            Vender
          </button>
          <button
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowUpDown className="h-5 w-5" />
            Intercambiar
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
          <p className="text-2xl font-bold mt-2">
            ${portfolio?.summary.totalValue.toLocaleString() || '0'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Balance Disponible</h3>
          <p className="text-2xl font-bold mt-2">
            ${portfolio?.summary.availableBalance.toLocaleString() || '0'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Ganancias/Pérdidas</h3>
          <p className={`text-2xl font-bold mt-2 ${
            (portfolio?.summary.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${portfolio?.summary.profitLoss.toLocaleString() || '0'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Activos en Cartera</h3>
          <p className="text-2xl font-bold mt-2">
            {portfolio?.assets.length || 0}
          </p>
        </div>
      </div>

      {/* Tabla de Activos */}
      <div>
        <AssetTable
          assets={portfolio?.assets || []}
          onAssetClick={(asset) => {
            setSelectedAsset(asset.symbol);
            setShowBuyForm(true);
          }}
        />
      </div>

      {/* Formulario de Compra */}
      {showBuyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Comprar Criptomoneda</h3>
              <button
                onClick={() => setShowBuyForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Activo
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="ADA">Cardano (ADA)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Ej: 0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleTrade('BUY')}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                >
                  Confirmar Compra
                </button>
                <button
                  onClick={() => setShowBuyForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Venta */}
      {showSellForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Vender Criptomoneda</h3>
              <button
                onClick={() => setShowSellForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Activo
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  {portfolio?.assets.map(asset => (
                    <option key={asset.id} value={asset.symbol}>
                      {asset.name} ({asset.symbol.toUpperCase()}) - Disponible: {asset.amount}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad a Vender
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Ej: 0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleTrade('SELL')}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                >
                  Confirmar Venta
                </button>
                <button
                  onClick={() => setShowSellForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
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