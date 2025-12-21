// src/components/wallet/AssetTable/AssetTable.tsx - VERSIÓN CORREGIDA
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap,
  ChevronRight
} from 'lucide-react';
import type { CryptoAsset } from '../../../types/wallet.types';

interface AssetTableProps {
  assets: CryptoAsset[];
  onAssetClick: (asset: CryptoAsset) => void;
  showLiveIndicator?: boolean;
  isLoading?: boolean;
}

// Tipo para propiedades seguras de CryptoAsset
type SafeCryptoAsset = {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  blockchain?: string;
  currentPrice: number;
  change24h: number;
  amount: number;
  valueUSD: number;
  allocation: number;
};

const AssetTable: React.FC<AssetTableProps> = ({ 
  assets = [], 
  onAssetClick, 
  showLiveIndicator = false,
  isLoading = false
}) => {
  // Validación de entrada
  const validAssets = Array.isArray(assets) ? assets.filter(asset => 
    asset && 
    typeof asset === 'object' &&
    asset.id !== undefined
  ) : [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!validAssets || validAssets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
          <TrendingUp className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay activos</h3>
        <p className="text-gray-600">Agrega tu primer activo para comenzar</p>
      </div>
    );
  }

  const formatCurrency = (value: number | undefined) => {
    const numValue = value || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  const formatPercentage = (value: number | undefined) => {
    const numValue = value || 0;
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
  };

  // Función para obtener propiedades seguras SIN usar 'any'
  const getSafeAsset = (asset: CryptoAsset): SafeCryptoAsset => {
    // Usamos valores por defecto seguros para cada propiedad
    return {
      id: asset.id || 'unknown',
      name: typeof asset.name === 'string' ? asset.name : 'Unknown Asset',
      symbol: typeof asset.symbol === 'string' ? asset.symbol : 'UNK',
      icon: typeof asset.icon === 'string' ? asset.icon : undefined,
      blockchain: typeof asset.blockchain === 'string' ? asset.blockchain : undefined,
      currentPrice: typeof asset.currentPrice === 'number' ? asset.currentPrice : 0,
      change24h: typeof asset.change24h === 'number' ? asset.change24h : 0,
      amount: typeof asset.amount === 'number' ? asset.amount : 0,
      valueUSD: typeof asset.valueUSD === 'number' ? asset.valueUSD : 0,
      allocation: typeof asset.allocation === 'number' ? asset.allocation : 0
    };
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                24h
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                %
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {validAssets.map((asset) => {
              // Obtener objeto seguro sin usar 'any'
              const safeAsset = getSafeAsset(asset);

              return (
                <tr 
                  key={safeAsset.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onAssetClick(safeAsset)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {safeAsset.icon ? (
                        <img 
                          src={safeAsset.icon} 
                          alt={safeAsset.name}
                          className="h-8 w-8 rounded-full mr-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                          {safeAsset.symbol.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {safeAsset.name}
                          </span>
                          {showLiveIndicator && (
                            <div className="ml-2 flex items-center">
                              <Zap className="h-3 w-3 text-green-500 animate-pulse" />
                              <span className="ml-1 text-xs text-green-600">LIVE</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {safeAsset.symbol.toUpperCase()}
                          {safeAsset.blockchain && ` • ${safeAsset.blockchain}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(safeAsset.currentPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm font-medium ${
                      safeAsset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {safeAsset.change24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {formatPercentage(safeAsset.change24h)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {safeAsset.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 8
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {safeAsset.symbol.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(safeAsset.valueUSD)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {safeAsset.allocation.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssetClick(safeAsset);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumen footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <span>Total activos: {validAssets.length}</span>
            {showLiveIndicator && (
              <>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1"></div>
                  Actualización en vivo
                </span>
              </>
            )}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(validAssets.reduce((sum, asset) => {
              const valueUSD = typeof asset.valueUSD === 'number' ? asset.valueUSD : 0;
              return sum + valueUSD;
            }, 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;