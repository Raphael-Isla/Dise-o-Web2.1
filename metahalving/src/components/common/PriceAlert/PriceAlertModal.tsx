// src/components/common/PriceAlert/PriceAlertModal.tsx
import React, { useState } from 'react';
import { usePriceAlerts } from '../../../hooks/usePriceAlerts';
import { X, Bell, AlertCircle } from 'lucide-react';
import type { AlertCondition } from '../../../types/alerts.types';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSymbol?: string;
  defaultPrice?: number;
}

/**
 * Modal para crear nuevas alertas de precio
 */
export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  defaultSymbol = 'BTC',
  defaultPrice = 45000,
}) => {
  const { addAlert } = usePriceAlerts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    symbol: defaultSymbol,
    condition: 'above' as AlertCondition,
    targetPrice: defaultPrice,
    enableEmail: true,
    enablePush: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.symbol || formData.symbol.length === 0) {
      setError('Por favor selecciona un símbolo');
      return;
    }

    if (!formData.targetPrice || formData.targetPrice <= 0) {
      setError('Por favor ingresa un precio válido');
      return;
    }

    setLoading(true);

    try {
      addAlert({
        symbol: formData.symbol.toUpperCase(),
        condition: formData.condition,
        targetPrice: formData.targetPrice,
        enableEmail: formData.enableEmail,
        enablePush: formData.enablePush,
        active: true,
      });

      onClose();
      setFormData({
        symbol: defaultSymbol,
        condition: 'above',
        targetPrice: defaultPrice,
        enableEmail: true,
        enablePush: true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al crear la alerta'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Nueva Alerta de Precio
              </h2>
              <p className="text-sm text-gray-600">
                Recibe notificaciones cuando el precio cambie
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Symbol */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Criptomoneda
            </label>
            <select
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="ADA">Cardano (ADA)</option>
              <option value="BNB">Binance (BNB)</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Condición
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="above">Precio está por encima de</option>
              <option value="below">Precio está por debajo de</option>
              <option value="equals">Precio es igual a</option>
            </select>
          </div>

          {/* Target Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Precio Objetivo (USD)
            </label>
            <input
              type="number"
              name="targetPrice"
              value={formData.targetPrice}
              onChange={handleChange}
              placeholder="45000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
              step="0.01"
              min="0"
            />
          </div>

          {/* Notifications */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900">
              Métodos de Notificación
            </h3>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableEmail"
                name="enableEmail"
                checked={formData.enableEmail}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 cursor-pointer"
                disabled={loading}
              />
              <label
                htmlFor="enableEmail"
                className="text-sm text-gray-700 cursor-pointer"
              >
                📧 Notificación por Email
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enablePush"
                name="enablePush"
                checked={formData.enablePush}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 cursor-pointer"
                disabled={loading}
              />
              <label
                htmlFor="enablePush"
                className="text-sm text-gray-700 cursor-pointer"
              >
                🔔 Notificación Push
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-primary-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Alerta'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal;