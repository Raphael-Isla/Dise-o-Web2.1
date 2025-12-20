import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  change: number;
  changePercent: number;
  icon: LucideIcon;
  isLoading?: boolean;
  isPositive?: boolean; // Para forzar color (ej: ganancias/pérdidas)
  showChange?: boolean; // Para ocultar cambio en algunos cards
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  change,
  changePercent,
  icon: Icon,
  isLoading = false,
  isPositive = change >= 0,
  showChange = true
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="card hover:shadow-md transition-shadow duration-200 bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Determinar colores basados en el cambio
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBgColor = isPositive ? 'bg-green-100' : 'bg-red-100';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const ChangeIconComponent = changeIcon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{formattedAmount}</h3>
        </div>
        <div className="p-3 rounded-full bg-primary-50 text-primary-600">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {showChange && (
        <div className="mt-4 flex items-center">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${changeBgColor} ${changeColor}`}>
            <ChangeIconComponent className="h-3 w-3" />
            <span className="text-xs font-medium">
              {isPositive ? '+' : ''}${Math.abs(change).toLocaleString()} 
              ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
          <span className="text-xs text-gray-500 ml-2">24h</span>
        </div>
      )}
      
      {/* Indicador de actualización en tiempo real (opcional) */}
      {showChange && (
        <div className="mt-2 flex items-center text-xs text-gray-400">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-1"></div>
          <span>Actualizado recientemente</span>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;