// src/components/common/ConnectionStatus/ConnectionStatus.tsx
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setIsOnline(navigator.onLine);
    }, 1000);
  };

  if (isOnline) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-medium shadow-sm">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        <Wifi className="h-4 w-4" />
        <span>Conectado</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isChecking}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-rose-100 text-red-800 text-sm font-medium shadow-sm hover:from-red-200 hover:to-rose-200 transition-all disabled:opacity-50"
    >
      <div className="h-2 w-2 rounded-full bg-red-500"></div>
      <WifiOff className="h-4 w-4" />
      <span>Sin conexión</span>
      <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
    </button>
  );
};

export default ConnectionStatus;