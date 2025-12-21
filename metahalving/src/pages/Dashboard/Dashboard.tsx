// src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { BalanceCard } from '../../components/wallet/BalanceCard/BalanceCard';
import AssetTable from '../../components/wallet/AssetTable/AssetTable'; // Cambio: import default
import { PortfolioChart } from '../../components/wallet/PortfolioChart/PortfolioChart';
import { QuickActions } from '../../components/wallet/QuickActions/QuickActions';
import { usePortfolio } from '../../hooks/usePortfolio';
import type { CryptoAsset } from '../../types/wallet.types';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  ArrowUpDown, 
  Plus, 
  FileDown, 
  RefreshCw,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    portfolio, 
    isLoading, 
    error, 
    refreshPortfolio 
  } = usePortfolio({
    userId: 'demo',
    realTimeUpdates: true
  });
  
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  // Actualizar timestamp cuando cambie el portfolio - CORREGIDO
 // Actualizar timestamp cuando cambie el portfolio - CORREGIDO
useEffect(() => {
  if (portfolio?.lastSync) {
    // Usar setTimeout para evitar el error de cascading renders
    const timer = setTimeout(() => {
      setLastUpdated(portfolio.lastSync!); // El "!" le dice a TypeScript que sabemos que no es undefined
    }, 0);
    return () => clearTimeout(timer);
  }
}, [portfolio?.lastSync]);

  useEffect(() => {
  if (portfolio?.lastSync) {
    const timer = setTimeout(() => {
      setLastUpdated(portfolio.lastSync!);
    }, 0);
    return () => clearTimeout(timer);
  }
}, [portfolio?.lastSync]);


  // Simular estado de conexión
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshPortfolio();
    setIsRefreshing(false);
  }, [refreshPortfolio]);

  const handleAddAsset = async () => {
    // Esto abriría un modal/formulario para agregar nuevo activo
    console.log('Agregar nuevo activo');
  };

  const formatTimeAgo = useCallback((date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace unos segundos';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-600">Cargando datos en tiempo real...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium text-lg mb-2">Error cargando datos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
        
        {/* Mostrar datos mock como fallback */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Mostrando datos de demostración. Los precios no son en tiempo real.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estado de conexión */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Resumen del Portfolio</h1>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {connectionStatus === 'connected' ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>En tiempo real</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Sin conexión</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-600">Análisis detallado de tus inversiones en criptomonedas</p>
            
            {lastUpdated && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Actualizado {formatTimeAgo(lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Acciones del Dashboard */}
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button 
            onClick={handleAddAsset}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar Activo
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <FileDown className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BalanceCard
          title="Valor Total"
          amount={portfolio?.summary.totalValue || 0}
          change={portfolio?.summary.totalChange24h || 0}
          changePercent={portfolio?.summary.totalChangePercent || 0}
          icon={Wallet}
          isLoading={isLoading}
        />
        <BalanceCard
          title="Balance Disponible"
          amount={portfolio?.summary.availableBalance || 0}
          change={0}
          changePercent={0}
          icon={DollarSign}
          isLoading={isLoading}
        />
        <BalanceCard
          title="Invertido"
          amount={portfolio?.summary.investedAmount || 0}
          change={0}
          changePercent={0}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <BalanceCard
          title="Ganancias/Pérdidas"
          amount={portfolio?.summary.profitLoss || 0}
          change={portfolio?.summary.profitLossPercent || 0}
          changePercent={portfolio?.summary.profitLossPercent || 0}
          icon={ArrowUpDown}
          isLoading={isLoading}
          isPositive={portfolio?.summary.profitLoss ? portfolio.summary.profitLoss >= 0 : true}
        />
      </div>

      {/* Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioChart 
            data={portfolio?.assets || []}
            isLoading={isLoading}
          />
        </div>
        <div>
          {/* Eliminar o corregir QuickActions si no acepta estas props */}
          <QuickActions 
            // Si QuickActions no acepta estas props, comenta esta línea
            // onRefresh={handleRefresh}
            // isRefreshing={isRefreshing}
          />
        </div>
      </div>

      {/* Assets Table con indicador de tiempo real */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tus Activos</h2>
            <p className="text-sm text-gray-600">
              {portfolio?.assets.length || 0} activos en tu cartera
              {connectionStatus === 'connected' && ' • Precios en tiempo real'}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver historial →
            </button>
            <button 
              onClick={handleAddAsset}
              className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700"
            >
              + Agregar
            </button>
          </div>
        </div>
        
        <AssetTable
          assets={portfolio?.assets || []}
          onAssetClick={setSelectedAsset}
          showLiveIndicator={connectionStatus === 'connected'}
        />
        
        {/* Footer de la tabla */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Actualización automática cada 10s</span>
          </div>
          <div>
            <span>Total: ${portfolio?.summary.totalValue.toLocaleString() || '0'}</span>
          </div>
        </div>
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                {selectedAsset.icon && (
                  <img 
                    src={selectedAsset.icon} 
                    alt={selectedAsset.name}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedAsset.name}</h3>
                  <p className="text-gray-600">{selectedAsset.symbol.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Precio actual</p>
                  <p className="text-lg  font-bold text-gray-900">${selectedAsset.currentPrice.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  selectedAsset.change24h >= 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-sm text-gray-600">Cambio 24h</p>
                  <p className={`text-lg font-bold ${
                    selectedAsset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad en cartera:</span>
                  <span className="font-semibold">{selectedAsset.amount} {selectedAsset.symbol.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor total:</span>
                  <span className="font-semibold">${selectedAsset.valueUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Porcentaje del portfolio:</span>
                  <span className="font-semibold">{selectedAsset.allocation?.toFixed(1) || '0'}%</span>
                </div>
                {selectedAsset.lastUpdated && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última actualización:</span>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(selectedAsset.lastUpdated)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-medium">
                Comprar más
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium">
                Vender
              </button>
              <button className="px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                ...
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => console.log('Ver detalles completos')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Ver análisis detallado y gráficos →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;