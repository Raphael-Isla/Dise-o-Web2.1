import React from 'react';
import type { CryptoAsset } from '../../../types/wallet.types';
import { TrendingUp, TrendingDown, PieChart,  Zap } from 'lucide-react';

interface PortfolioChartProps {
  data: CryptoAsset[];
  isLoading?: boolean;
  lastUpdated?: Date;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  data, 
  isLoading = false,
  lastUpdated 
}) => {
  // Colores para el gráfico
  const colors = [
    '#3B82F6', // blue-500 (Bitcoin)
    '#10B981', // green-500 (Ethereum)
    '#F59E0B', // yellow-500 (Solana)
    '#EF4444', // red-500
    '#8B5CF6', // purple-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#8B5CF6', // violet-500
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <div className="h-64 w-64 bg-gray-200 rounded-full mx-auto"></div>
            </div>
            <div className="lg:w-1/2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PieChart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos para graficar</h3>
          <p className="text-gray-500 mb-4">Agrega activos a tu portfolio para ver la distribución</p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Agregar primer activo
          </button>
        </div>
      </div>
    );
  }

  // Calcular total para porcentajes
  const total = data.reduce((sum, asset) => sum + asset.valueUSD, 0);
  
  // Encontrar mejor y peor desempeño
  const sortedByPerformance = [...data].sort((a, b) => b.change24h - a.change24h);
  const bestPerformer = sortedByPerformance[0];
  const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

  // Formatear timestamp
  const formatTimeAgo = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace unos segundos';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header con indicador de tiempo real */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-gray-900">Distribución del Portfolio</h2>
            {lastUpdated && (
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <Zap className="h-3 w-3 text-green-500" />
                <span>{formatTimeAgo(lastUpdated)}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Total: <span className="font-medium">${total.toLocaleString()}</span>
          </p>
        </div>
        
        {/* Cambio total del portfolio */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm text-gray-600">Cambio 24h</div>
            <div className="text-lg font-semibold text-green-600">
              +2.8%
            </div>
          </div>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Gráfico de dona mejorado */}
        <div className="lg:w-2/5">
          <div className="relative h-72 w-72 mx-auto">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {data.map((asset, index) => {
                // Calcular ángulos
                const startAngle = index === 0 ? 0 : 
                  data.slice(0, index).reduce((sum, a) => sum + (a.valueUSD / total) * 360, 0);
                const angle = (asset.valueUSD / total) * 360;
                
                // Coordenadas para arco SVG
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (startAngle + angle - 90) * Math.PI / 180;
                
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                
                return (
                  <g key={asset.id}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                      className="opacity-90 hover:opacity-100 transition-all duration-300 cursor-pointer"
                      style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </g>
                );
              })}
              {/* Centro del donut */}
              <circle cx="50" cy="50" r="25" fill="white" />
              
              {/* Texto en el centro */}
              <text 
                x="50" 
                y="45" 
                textAnchor="middle" 
                className="text-xl font-bold fill-gray-900"
                fontSize="6"
              >
                ${total.toLocaleString().split('.')[0]}
              </text>
              <text 
                x="50" 
                y="55" 
                textAnchor="middle" 
                className="fill-gray-500"
                fontSize="3"
              >
                Valor total
              </text>
            </svg>
          </div>
          
          {/* Indicadores de rendimiento */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {bestPerformer && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-700">Mejor rendimiento</div>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="font-semibold text-green-900">{bestPerformer.symbol.toUpperCase()}</div>
                <div className="text-sm text-green-600">
                  +{bestPerformer.change24h.toFixed(1)}%
                </div>
              </div>
            )}
            
            {worstPerformer && worstPerformer.change24h < 0 && (
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-red-700">Peor rendimiento</div>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <div className="font-semibold text-red-900">{worstPerformer.symbol.toUpperCase()}</div>
                <div className="text-sm text-red-600">
                  {worstPerformer.change24h.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Leyenda mejorada */}
        <div className="lg:w-3/5">
          <div className="space-y-3">
            {data.map((asset, index) => {
              const percentage = total > 0 ? (asset.valueUSD / total) * 100 : 0;
              const isPositive = asset.change24h >= 0;
              
              return (
                <div 
                  key={asset.id} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center flex-1">
                    <div 
                      className="h-4 w-4 rounded-full mr-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900 group-hover:text-primary-600">
                          {asset.name}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {asset.symbol.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </span>
                        <span className="text-xs text-gray-500 mx-2">•</span>
                        <span className="text-xs text-gray-500">
                          {asset.amount.toFixed(6)} {asset.symbol.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="font-semibold text-gray-900">
                      ${asset.valueUSD.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Stats adicionales */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700 mb-1">Mayor tenencia</div>
                <div className="font-bold text-lg text-gray-900">
                  {data.length > 0 ? data[0].symbol.toUpperCase() : 'N/A'}
                </div>
                <div className="text-sm text-blue-600">
                  {total > 0 ? ((data[0]?.valueUSD / total) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-700 mb-1">Activos únicos</div>
                <div className="font-bold text-lg text-gray-900">
                  {data.length}
                </div>
                <div className="text-sm text-purple-600">
                  {data.length > 1 ? 'diversificado' : 'por diversificar'}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-700 mb-1">Cambio promedio</div>
                <div className="font-bold text-lg text-green-600">
                  {data.length > 0 
                    ? `+${(data.reduce((sum, a) => sum + a.change24h, 0) / data.length).toFixed(1)}%`
                    : '0%'
                  }
                </div>
                <div className="text-sm text-green-600">
                  24 horas
                </div>
              </div>
            </div>
            
            {/* Barra de progreso de diversificación */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Diversificación</span>
                <span className="text-sm text-gray-600">
                  {calculateDiversificationScore(data)}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${calculateDiversificationScore(data)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {getDiversificationMessage(data)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función para calcular score de diversificación
const calculateDiversificationScore = (assets: CryptoAsset[]): number => {
  if (assets.length <= 1) return 10;
  
  // Calcular índice de Herfindahl–Hirschman (HHI)
  const total = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
  let hhi = 0;
  
  assets.forEach(asset => {
    const share = (asset.valueUSD / total) * 100;
    hhi += share * share;
  });
  
  // Convertir HHI a score (0-100)
  // HHI máximo: 10000 (1 activo al 100%)
  // HHI mínimo: 10000/n (distribución perfecta)
  const maxScore = 10000;
  const minScore = 10000 / assets.length;
  const normalizedScore = ((hhi - minScore) / (maxScore - minScore)) * 100;
  
  // Invertir para que score alto = buena diversificación
  return Math.round(Math.max(0, Math.min(100, 100 - normalizedScore)));
};

// Función para mensaje de diversificación
const getDiversificationMessage = (assets: CryptoAsset[]): string => {
  const score = calculateDiversificationScore(assets);
  
  if (assets.length <= 1) return 'Agrega más activos para diversificar';
  if (score < 30) return 'Baja diversificación - Considera agregar más activos';
  if (score < 60) return 'Diversificación moderada';
  if (score < 80) return 'Buena diversificación';
  return 'Excelente diversificación - Portfolio bien balanceado';
};

export default PortfolioChart;