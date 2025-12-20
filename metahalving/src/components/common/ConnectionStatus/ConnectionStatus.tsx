// src/components/common/ConnectionStatus/ConnectionStatus.tsx
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { priceFeedService } from '../../../services/websocket/priceFeed';
import { cryptoAPI } from '../../../services/api/cryptoAPI';

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(priceFeedService.isConnectedToSocket());
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
  const checkApiStatus = async () => {
    try {
      await cryptoAPI.getWebSocketStatus();
      setApiStatus('online');
    } catch (error) {
      console.error('Error checking API status:', error);
      setApiStatus('offline');
    }
  };

  checkApiStatus();
  const interval = setInterval(checkApiStatus, 30000); // Verificar cada 30 segundos

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(priceFeedService.isConnectedToSocket());
    };

    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReconnect = () => {
    // Aquí podrías implementar lógica de reconexión
    window.location.reload();
  };

  const getStatusColor = () => {
    if (!isConnected || apiStatus !== 'online') return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (apiStatus === 'checking') return 'Verificando conexión...';
    if (!isConnected || apiStatus !== 'online') return 'Conexión limitada';
    return 'Conectado en tiempo real';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {isConnected && apiStatus === 'online' ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span>{getStatusText()}</span>
      </div>
      
      {(apiStatus !== 'online' || !isConnected) && (
        <button
          onClick={handleReconnect}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          title="Reintentar conexión"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;