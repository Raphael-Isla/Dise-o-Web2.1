// src/components/wallet/AssetTable/AssetTable.tsx
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap,
  //MoreVertical,
  ChevronRight
} from 'lucide-react';
import type { CryptoAsset } from '../../../types/wallet.types';

interface AssetTableProps {
  assets: CryptoAsset[];
  onAssetClick: (asset: CryptoAsset) => void;
  showLiveIndicator?: boolean;
  isLoading?: boolean;
}

const AssetTable: React.FC<AssetTableProps> = ({ 
  assets, 
  onAssetClick, 
  showLiveIndicator = false,
  isLoading = false
}) => {
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

  if (assets.length === 0) {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
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
            {assets.map((asset) => (
              <tr 
                key={asset.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onAssetClick(asset)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {asset.icon ? (
                      <img 
                        src={asset.icon} 
                        alt={asset.name}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                        {asset.symbol.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {asset.name}
                        </span>
                        {showLiveIndicator && (
                          <div className="ml-2 flex items-center">
                            <Zap className="h-3 w-3 text-green-500 animate-pulse" />
                            <span className="ml-1 text-xs text-green-600">LIVE</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {asset.symbol.toUpperCase()}
                        {asset.blockchain && ` • ${asset.blockchain}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(asset.currentPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center text-sm font-medium ${
                    asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {asset.change24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {formatPercentage(asset.change24h)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {asset.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 8
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {asset.symbol.toUpperCase()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(asset.valueUSD)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {asset.allocation?.toFixed(1) || '0.0'}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssetClick(asset);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <span>Total activos: {assets.length}</span>
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
            {formatCurrency(assets.reduce((sum, asset) => sum + asset.valueUSD, 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;