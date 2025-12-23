// src/pages/Dashboard/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { BalanceCard } from '../../components/wallet/BalanceCard/BalanceCard';
import AssetTable from '../../components/wallet/AssetTable/AssetTable';
import { PortfolioChart } from '../../components/wallet/PortfolioChart/PortfolioChart';
import { QuickActions } from '../../components/wallet/QuickActions/QuickActions';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  ArrowUpDown, 
  Plus, 
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  ChevronRight,
  MoreVertical,
  TrendingUp as ChartLine,
  PieChart as ChartPie,
  User
} from 'lucide-react';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  amount: number;
  valueUSD: number;
  change24h: number;
  allocation?: number;
  lastUpdated?: Date;
  icon?: string;
}

interface PortfolioSummary {
  totalValue: number;
  availableBalance: number;
  investedAmount: number;
  profitLoss: number;
  profitLossPercent: number;
  totalChange24h: number;
  totalChangePercent: number;
}

interface Portfolio {
  summary: PortfolioSummary;
  assets: CryptoAsset[];
  lastSync?: Date;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  // Cargar portfolio del usuario
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!user) {
        setIsLoading(false);
        setError('Usuario no autenticado');
        return;
      }

      try {
        setIsLoading(true);
        
        // Simular carga de datos (en producción esto vendría de una API)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Transformar datos del usuario al formato de portfolio
        const portfolioData: Portfolio = {
          summary: {
            totalValue: user.dashboard.totalBalance,
            availableBalance: user.dashboard.availableCash,
            investedAmount: user.dashboard.totalInvested,
            profitLoss: user.dashboard.totalProfit,
            profitLossPercent: user.dashboard.totalInvested > 0 ? 
              (user.dashboard.totalProfit / user.dashboard.totalInvested) * 100 : 0,
            totalChange24h: 0, // Esto vendría de una API de precios
            totalChangePercent: 0
          },
          assets: user.wallet.cryptoHoldings.map(holding => ({
            id: holding.id || holding.symbol,
            symbol: holding.symbol,
            name: holding.name,
            currentPrice: holding.currentValue,
            amount: holding.amount,
            valueUSD: holding.totalValue,
            change24h: holding.change24h || 0,
            allocation: holding.allocation || 0,
            lastUpdated: new Date()
          })),
          lastSync: new Date()
        };
        
        setPortfolio(portfolioData);
        setLastUpdated(new Date());
        setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Error al cargar el portfolio');
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [user]);

  // Actualizar timestamp cuando cambie el portfolio
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
    // Recargar datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const handleAddAsset = async () => {
    // Redirigir a la página de mercados para comprar activos
    window.location.href = '/markets';
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ChartLine className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-900">Cargando tu portfolio</p>
          <p className="text-gray-500 text-sm">Obteniendo información actualizada</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <WifiOff className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-red-900 font-bold text-xl mb-2">Error cargando datos</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="flex space-x-3">
                <button
                  onClick={handleRefresh}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con estado de conexión */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <ChartPie className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                ¡Hola, {user?.name || user?.email?.split('@')[0] || 'Inversor'}!
              </h1>
              <p className="text-gray-600 mt-1">Tu dashboard de inversiones en criptomonedas</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              connectionStatus === 'connected' 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm' 
                : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'
            }`}>
              {connectionStatus === 'connected' ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <Wifi className="h-4 w-4" />
                  <span>Conectado</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <WifiOff className="h-4 w-4" />
                  <span>Sin conexión</span>
                </>
              )}
            </div>
            
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Clock className="h-4 w-4" />
                <span>Actualizado {formatTimeAgo(lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Acciones del Dashboard */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button 
            onClick={handleAddAsset}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-sm hover:shadow"
          >
            <Plus className="h-5 w-5" />
            <span>Comprar Activos</span>
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

      {/* Bienvenida para nuevos usuarios */}
      {user && portfolio && portfolio.summary.totalValue === 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2">¡Bienvenido a MetaHalving!</h3>
              <p className="text-green-800 mb-3">
                Te hemos acreditado <span className="font-bold text-green-900">$10,000 USD</span> para que comiences a invertir en criptomonedas.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-700">Ve a <strong>Mercados</strong> para ver las criptomonedas disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-green-700">Compra desde tu <strong>Wallet</strong> con un solo clic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-green-700">Revisa tus <strong>Transacciones</strong> para ver tu historial</span>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => window.location.href = '/markets'}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-sm hover:shadow"
                >
                  Comenzar a invertir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart and Quick Actions */}
      {portfolio && portfolio.assets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioChart 
              data={portfolio?.assets || []}
              isLoading={isLoading}
            />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      )}

      {/* Assets Table con indicador de tiempo real */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>Tus Activos</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {portfolio?.assets.length || 0}
                </span>
              </h2>
              <p className="text-gray-600 mt-1">
                {portfolio?.assets.length === 0 ? (
                  "No tienes criptomonedas en tu portfolio"
                ) : (
                  connectionStatus === 'connected' ? (
                    <span className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Precios actualizados
                    </span>
                  ) : 'Datos fuera de línea'
                )}
              </p>
            </div>
            {portfolio && portfolio.assets.length > 0 && (
              <div className="flex gap-3">
                <button 
                  onClick={handleAddAsset}
                  className="text-sm bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1.5 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar más</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-1">
          {portfolio && portfolio.assets.length > 0 ? (
            <AssetTable
              assets={portfolio.assets}
              onAssetClick={setSelectedAsset}
              showLiveIndicator={connectionStatus === 'connected'}
            />
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tu portfolio está vacío</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Comienza a construir tu portfolio invirtiendo en criptomonedas. Tienes $10,000 USD disponibles para invertir.
              </p>
              <button 
                onClick={() => window.location.href = '/markets'}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg hover:from-primary-700 hover:to-blue-700 transition-all font-medium shadow-sm hover:shadow"
              >
                Explorar Mercados
              </button>
            </div>
          )}
        </div>
        
        {/* Footer de la tabla */}
        {portfolio && portfolio.assets.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Total del portfolio</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${portfolio.summary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500">
                Disponible: ${portfolio.summary.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-0 shadow-2xl overflow-hidden">
            {/* Header del modal con gradiente */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {selectedAsset.icon ? (
                    <img 
                      src={selectedAsset.icon} 
                      alt={selectedAsset.name}
                      className="h-12 w-12 rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <span className="font-bold text-lg">{selectedAsset.symbol.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{selectedAsset.name}</h3>
                    <p className="text-gray-300">{selectedAsset.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <p className="text-sm text-gray-300">Precio actual</p>
                  <p className="text-2xl font-bold">${selectedAsset.currentPrice.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl ${
                  selectedAsset.change24h >= 0 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' 
                    : 'bg-gradient-to-r from-red-500/20 to-rose-500/20'
                }`}>
                  <p className="text-sm text-gray-300">Cambio 24h</p>
                  <p className={`text-2xl font-bold ${
                    selectedAsset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Cantidad en cartera</span>
                  <span className="font-bold text-gray-900">{selectedAsset.amount} {selectedAsset.symbol.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Valor total</span>
                  <span className="font-bold text-gray-900">${selectedAsset.valueUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Porcentaje del portfolio</span>
                  <span className="font-bold text-gray-900">{selectedAsset.allocation?.toFixed(1) || '0'}%</span>
                </div>
                {selectedAsset.lastUpdated && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Última actualización</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {formatTimeAgo(selectedAsset.lastUpdated)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 space-y-3">
                <button 
                  onClick={() => window.location.href = `/markets?asset=${selectedAsset.symbol}`}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-medium shadow-sm hover:shadow"
                >
                  Comprar más {selectedAsset.symbol.toUpperCase()}
                </button>
                <div className="grid grid-cols-3 gap-2">
                  <button className="border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                    Vender
                  </button>
                  <button className="border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                    Cambiar
                  </button>
                  <button className="border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="pt-4 text-center">
                <button 
                  onClick={() => console.log('Ver detalles completos')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1 w-full"
                >
                  <span>Ver análisis detallado y gráficos</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;