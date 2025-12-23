// ═════════════════════════════════════════════════════════════════════
// ARCHIVO 4: src/components/common/AlertNotifications/AlertNotifications.tsx
// ═════════════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface AlertNotification {
  id: string;
  alertId: string;
  symbol: string;
  condition: string;
  currentPrice: number;
  targetPrice?: number;
  triggeredAt: Date;
  read: boolean;
}

interface AlertNotificationsProps {
  notifications?: AlertNotification[];
  onNotificationRead?: (id: string) => void;
}

export const AlertNotifications: React.FC<AlertNotificationsProps> = ({ 
  notifications = [],
  onNotificationRead 
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-40 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => onNotificationRead?.(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: AlertNotification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isBullish = notification.currentPrice >= (notification.targetPrice || 0);
  const changeAmount = notification.currentPrice - (notification.targetPrice || 0);
  const changePercent = ((changeAmount / (notification.targetPrice || 1)) * 100).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-primary-500 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${isBullish ? 'bg-green-100' : 'bg-red-100'}`}>
            {isBullish ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">
                {notification.symbol.toUpperCase()}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isBullish
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {isBullish ? '+' : ''}{changePercent}%
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              Alerta: Precio {
                notification.condition === 'above'
                  ? 'está por encima'
                  : notification.condition === 'below'
                  ? 'está por debajo'
                  : 'alcanzó'
              } ${notification.targetPrice?.toFixed(2) || '0.00'}
            </p>

            <p className="text-sm font-semibold text-gray-900 mt-1">
              Precio actual: ${notification.currentPrice.toFixed(2)}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(notification.triggeredAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertNotifications;