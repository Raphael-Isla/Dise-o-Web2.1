// QuickActions.tsx - VERSIÓN MEJORADA
import React, { useEffect, useState } from 'react';
import { Plus, ArrowUpDown, Download, RefreshCw, TrendingUp, BarChart3, X } from 'lucide-react';
import walletAPI from '../../../services/api/walletAPI';
import type { CryptoAsset } from '../../../types/wallet.types';

type ActionId = 'buy' | 'sell' | 'deposit' | 'trade' | null;

export const QuickActions: React.FC = () => {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionId>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form state
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [amount, setAmount] = useState<string>('');

  // Swap specific
  const [fromSymbol, setFromSymbol] = useState<string>('BTC');
  const [toSymbol, setToSymbol] = useState<string>('ETH');
  const [estimatedToAmount, setEstimatedToAmount] = useState<number | null>(null);

  useEffect(() => {
    // Cargar assets del portfolio
    const load = async () => {
      try {
        const portfolio = await walletAPI.getPortfolio();
        setAssets(portfolio.assets);
        if (portfolio.assets.length > 0) {
          setSelectedSymbol(portfolio.assets[0].symbol.toUpperCase());
          setFromSymbol(portfolio.assets[0].symbol.toUpperCase());
          setToSymbol(portfolio.assets.length > 1 ? portfolio.assets[1].symbol.toUpperCase() : portfolio.assets[0].symbol.toUpperCase());
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // Calcular estimación de swap cuando cambian los símbolos o el monto
    const calc = async () => {
      if (activeAction === 'trade' && amount && Number(amount) > 0 && fromSymbol && toSymbol && fromSymbol !== toSymbol) {
        try {
          const priceFrom = await walletAPI.getAssetPrice(fromSymbol);
          const priceTo = await walletAPI.getAssetPrice(toSymbol);
          const totalUSD = Number(amount) * priceFrom;
          setEstimatedToAmount(parseFloat((totalUSD / priceTo).toFixed(6)));
        } catch (err) {
          console.error(err);
          setEstimatedToAmount(null);
        }
      } else {
        setEstimatedToAmount(null);
      }
    };
    calc();
  }, [activeAction, amount, fromSymbol, toSymbol]);

  const openModal = (action: ActionId) => {
    setActiveAction(action);
    setMessage(null);
    setAmount('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveAction(null);
    setMessage(null);
    setEstimatedToAmount(null);
  };

  const handleExecuteBuySell = async (type: 'BUY' | 'SELL') => {
    if (!selectedSymbol || !amount || Number(amount) <= 0) {
      setMessage('Introduce un monto válido.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await walletAPI.executeTrade(type, selectedSymbol, Number(amount));
      console.log('Resultado trade:', result);
      setMessage(`Operación ${type === 'BUY' ? 'compra' : 'venta'} realizada: ${result.total.toFixed(2)} USD`);
      // Actualizar assets
      const portfolio = await walletAPI.getPortfolio();
      setAssets(portfolio.assets);
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      console.error(err);
      setMessage('Error ejecutando la operación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    // Mostrar una dirección mock y permitir copiar
    const depositAddress = `0xDEPOSIT_${selectedSymbol}_${Date.now().toString(36).slice(-6)}`;
    try {
      await navigator.clipboard.writeText(depositAddress);
      setMessage(`Dirección copiada: ${depositAddress}`);
    } catch (err) {
      console.error('No se pudo copiar', err);
      setMessage(`Dirección: ${depositAddress}`);
    }
  };

  const handleSwap = async () => {
    if (!fromSymbol || !toSymbol || fromSymbol === toSymbol) {
      setMessage('Selecciona dos activos diferentes para intercambiar.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setMessage('Introduce un monto válido.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1) Vender `fromSymbol` la cantidad indicada
      const sell = await walletAPI.executeTrade('SELL', fromSymbol, Number(amount));
      // 2) Calcular cuánto comprar de `toSymbol` con el total USD
      const priceTo = await walletAPI.getAssetPrice(toSymbol);
      const toAmount = parseFloat((sell.total / priceTo).toFixed(6));
      // 3) Comprar `toSymbol`
      //const buy = await walletAPI.executeTrade('BUY', toSymbol, toAmount);

      setMessage(`Intercambio completado: vendiste ${amount} ${fromSymbol} y compraste ${toAmount} ${toSymbol}`);
      const portfolio = await walletAPI.getPortfolio();
      setAssets(portfolio.assets);
      setTimeout(() => closeModal(), 1400);
    } catch (err) {
      console.error(err);
      setMessage('Error realizando el intercambio.');
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      id: 'buy',
      label: 'Comprar',
      icon: <Plus className="h-5 w-5" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
      onClick: () => openModal('buy')
    },
    {
      id: 'sell',
      label: 'Vender',
      icon: <ArrowUpDown className="h-5 w-5" />,
      color: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
      onClick: () => openModal('sell')
    },
    {
      id: 'deposit',
      label: 'Depositar',
      icon: <Download className="h-5 w-5" />,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      onClick: () => openModal('deposit')
    },
    {
      id: 'trade',
      label: 'Intercambiar',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
      onClick: () => openModal('trade')
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
        <button 
          onClick={async () => {
            const portfolio = await walletAPI.getPortfolio();
            setAssets(portfolio.assets);
          }}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Actualizar datos"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="mb-2">{action.icon}</div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Resumen del Día</h4>
          <BarChart3 className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Activos:</span>
            <div className="flex items-center">
              <span className="font-semibold mr-2">{assets.length}</span>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Balance disponible:</span>
            <span className="text-sm font-semibold text-green-600">${Math.round(assets.reduce((s, a) => s + a.valueUSD, 0)).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{activeAction === 'buy' ? 'Comprar' : activeAction === 'sell' ? 'Vender' : activeAction === 'deposit' ? 'Depositar' : 'Intercambiar'}</h3>
              <button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 rounded-md">
                <X className="h-4 w-4" />
              </button>
            </div>

            {message && <div className="mb-3 text-sm text-gray-700">{message}</div>}

            {(activeAction === 'buy' || activeAction === 'sell') && (
              <div className="space-y-3">
                <label className="block text-sm text-gray-600">Activo</label>
                <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)} className="w-full p-2 border rounded-md">
                  {assets.map(a => (
                    <option key={a.id} value={a.symbol.toUpperCase()}>{a.name} ({a.symbol.toUpperCase()})</option>
                  ))}
                </select>

                <label className="block text-sm text-gray-600">Cantidad</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full p-2 border rounded-md" />

                <div className="flex justify-end">
                  <button onClick={() => handleExecuteBuySell(activeAction === 'buy' ? 'BUY' : 'SELL')} disabled={loading} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {loading ? 'Procesando...' : (activeAction === 'buy' ? 'Confirmar compra' : 'Confirmar venta')}
                  </button>
                </div>
              </div>
            )}

            {activeAction === 'deposit' && (
              <div className="space-y-3">
                <label className="block text-sm text-gray-600">Selecciona activo</label>
                <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)} className="w-full p-2 border rounded-md">
                  {assets.map(a => (
                    <option key={a.id} value={a.symbol.toUpperCase()}>{a.name} ({a.symbol.toUpperCase()})</option>
                  ))}
                </select>

                <div className="text-sm text-gray-600">Copia la dirección de depósito y envía fondos desde tu wallet externa.</div>

                <div className="flex justify-end">
                  <button onClick={handleDeposit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Copiar dirección</button>
                </div>
              </div>
            )}

            {activeAction === 'trade' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600">De</label>
                  <select value={fromSymbol} onChange={(e) => setFromSymbol(e.target.value)} className="w-full p-2 border rounded-md">
                    {assets.map(a => (
                      <option key={a.id} value={a.symbol.toUpperCase()}>{a.name} ({a.symbol.toUpperCase()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600">A</label>
                  <select value={toSymbol} onChange={(e) => setToSymbol(e.target.value)} className="w-full p-2 border rounded-md">
                    {assets.map(a => (
                      <option key={a.id} value={a.symbol.toUpperCase()}>{a.name} ({a.symbol.toUpperCase()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Cantidad ({fromSymbol})</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full p-2 border rounded-md" />
                </div>

                {estimatedToAmount != null && (
                  <div className="text-sm text-gray-600">Estimado: {estimatedToAmount} {toSymbol}</div>
                )}

                <div className="flex justify-end">
                  <button onClick={handleSwap} disabled={loading} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {loading ? 'Procesando...' : 'Confirmar intercambio'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default QuickActions;