// src/hooks/usePriceAlerts.ts
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { storageAPI } from '../services/api/storageAPI';
import type { PriceAlert, AlertNotification } from '../types/alerts.types';
import { convertStorageAlertToUIAlert, convertUIAlertToStorageAlert } from '../types/alerts.types';

export const usePriceAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar alertas del storage
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const savedAlerts = storageAPI.getPriceAlerts(user.id);
      // Convertir las alertas del storage al tipo de la UI
      const uiAlerts = savedAlerts.map(convertStorageAlertToUIAlert);
      setAlerts(uiAlerts);
    } catch (error) {
      console.error('Error loading price alerts:', error);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Solo depende del user.id, no del objeto user completo

  // Agregar nueva alerta
  const addAlert = useCallback(
    (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'notificationCount' | 'lastTriggered'>) => {
      if (!user) return;

      const newAlert: PriceAlert = {
        ...alert,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        notificationCount: 0,
        lastTriggered: undefined,
      };

      try {
        // Convertir a formato storage antes de guardar
        const storageAlert = convertUIAlertToStorageAlert(newAlert);
        storageAPI.addPriceAlert(user.id, storageAlert);
        setAlerts(prev => [...prev, newAlert]);
        return newAlert;
      } catch (error) {
        console.error('Error adding price alert:', error);
        throw error;
      }
    },
    [user]
  );

  // Actualizar alerta
  const updateAlert = useCallback(
    (alertId: string, updates: Partial<PriceAlert>) => {
      if (!user) return;

      try {
        const storageUpdates = convertUIAlertToStorageAlert(updates as PriceAlert);
        storageAPI.updatePriceAlert(user.id, alertId, storageUpdates);
        setAlerts(prev =>
          prev.map(a => (a.id === alertId ? { ...a, ...updates } : a))
        );
      } catch (error) {
        console.error('Error updating price alert:', error);
        throw error;
      }
    },
    [user]
  );

  // Eliminar alerta
  const deleteAlert = useCallback(
    (alertId: string) => {
      if (!user) return;

      try {
        storageAPI.deletePriceAlert(user.id, alertId);
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      } catch (error) {
        console.error('Error deleting price alert:', error);
        throw error;
      }
    },
    [user]
  );

  // Activar/desactivar alerta
  const toggleAlert = useCallback(
    (alertId: string, active: boolean) => {
      updateAlert(alertId, { active });
    },
    [updateAlert]
  );

  // Crear notificación cuando se dispara una alerta
  const triggerAlert = useCallback(
    (alertId: string, currentPrice: number) => {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert || !alert.active) return;

      const notification: AlertNotification = {
        id: `notif_${Date.now()}`,
        alertId,
        symbol: alert.symbol,
        condition: alert.condition,
        currentPrice,
        targetPrice: alert.targetPrice,
        triggeredAt: new Date(),
        read: false,
      };

      setNotifications(prev => [notification, ...prev]);

      // Actualizar último disparo
      updateAlert(alertId, {
        lastTriggered: new Date(),
        notificationCount: (alert.notificationCount || 0) + 1,
      });

      // Auto-limpiar notificación después de 5 segundos
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);

      return notification;
    },
    [alerts, updateAlert]
  );

  // Resto del código sin cambios...
  const checkAlert = useCallback(
    (symbol: string, currentPrice: number) => {
      const activeAlerts = alerts.filter(
        a => a.active && a.symbol.toLowerCase() === symbol.toLowerCase()
      );

      activeAlerts.forEach(alert => {
        let shouldTrigger = false;

        switch (alert.condition) {
          case 'above':
            shouldTrigger = currentPrice >= (alert.targetPrice || 0);
            break;
          case 'below':
            shouldTrigger = currentPrice <= (alert.targetPrice || 0);
            break;
          case 'equals':
            shouldTrigger = Math.abs(currentPrice - (alert.targetPrice || 0)) < 1;
            break;
          default:
            break;
        }

        if (shouldTrigger) {
          triggerAlert(alert.id, currentPrice);
        }
      });
    },
    [alerts, triggerAlert]
  );

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const clearReadNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  return {
    alerts,
    notifications,
    isLoading,
    addAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    checkAlert,
    triggerAlert,
    markNotificationAsRead,
    clearReadNotifications,
  };
};

export default usePriceAlerts;