// src/types/alerts.types.ts

export type AlertCondition = 'above' | 'below' | 'equals' | 'change_percent';

// Interfaz principal de PriceAlert que usará tu aplicación
export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: AlertCondition;
  active: boolean;                // Para la UI
  isActive?: boolean;             // Para storage (alias opcional)
  createdAt: Date;
  lastTriggered?: Date;           // Para la UI
  triggeredAt?: Date;             // Para storage (alias opcional)
  notificationCount: number;
  enableEmail: boolean;
  enablePush: boolean;
}

export interface AlertNotification {
  id: string;
  alertId: string;
  symbol: string;
  condition: AlertCondition;
  currentPrice: number;
  targetPrice?: number;
  triggeredAt: Date;
  read: boolean;
}

export interface AlertStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredToday: number;
  totalTriggered: number;
}

export type AlertSeverity = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Tipo base que coincide con storageAPI
interface BasePriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below' | 'equals';
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

// Función helper para convertir entre tipos
export const convertStorageAlertToUIAlert = (
  storageAlert: BasePriceAlert & { 
    notificationCount?: number; 
    enableEmail?: boolean; 
    enablePush?: boolean 
  }
): PriceAlert => ({
  ...storageAlert,
  condition: storageAlert.condition as AlertCondition, // Conversión segura
  active: storageAlert.isActive,
  lastTriggered: storageAlert.triggeredAt,
  notificationCount: storageAlert.notificationCount || 0,
  enableEmail: storageAlert.enableEmail ?? true,
  enablePush: storageAlert.enablePush ?? true,
});

// Función helper para convertir UI Alert a Storage Alert
export const convertUIAlertToStorageAlert = (
  uiAlert: PriceAlert
): BasePriceAlert & { 
  notificationCount?: number; 
  enableEmail?: boolean; 
  enablePush?: boolean 
} => ({
  id: uiAlert.id,
  symbol: uiAlert.symbol,
  targetPrice: uiAlert.targetPrice,
  condition: uiAlert.condition as 'above' | 'below' | 'equals', // Conversión segura
  isActive: uiAlert.active,
  createdAt: uiAlert.createdAt,
  triggeredAt: uiAlert.lastTriggered,
  notificationCount: uiAlert.notificationCount,
  enableEmail: uiAlert.enableEmail,
  enablePush: uiAlert.enablePush,
});