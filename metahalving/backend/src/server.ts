// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configuración CORS - IMPORTANTE: Solo un origen
app.use(cors({
  origin: 'http://localhost:5173', // <-- SOLO 5173, no múltiples
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware para parsear JSON
app.use(express.json());

// ====================
// RUTAS DE LA API
// ====================

// Ruta de salud (para verificar que el servidor está vivo)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor backend funcionando',
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener portfolio (mock)
app.get('/api/portfolio/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`📊 Obteniendo portfolio para usuario: ${userId}`);
  
  const portfolio = {
    assets: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        amount: 0.5,
        currentPrice: 45000,
        valueUSD: 22500,
        change24h: 2.5,
        allocation: 45,
        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        blockchain: 'Bitcoin'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        amount: 3.2,
        currentPrice: 3000,
        valueUSD: 9600,
        change24h: -1.2,
        allocation: 25,
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        blockchain: 'Ethereum'
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        amount: 15,
        currentPrice: 100,
        valueUSD: 1500,
        change24h: 5.3,
        allocation: 8,
        icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
        blockchain: 'Solana'
      }
    ],
    transactions: [
      {
        id: 'tx_001',
        type: 'BUY',
        symbol: 'BTC',
        amount: 0.1,
        price: 44000,
        total: 4400,
        timestamp: new Date('2024-01-15T10:30:00').toISOString(),
        status: 'COMPLETED',
        txHash: '0xabc123def456...'
      },
      {
        id: 'tx_002',
        type: 'SELL',
        symbol: 'ETH',
        amount: 0.5,
        price: 2900,
        total: 1450,
        timestamp: new Date('2024-01-14T14:20:00').toISOString(),
        status: 'COMPLETED',
        txHash: '0xdef456abc123...'
      }
    ],
    summary: {
      totalValue: 33600,
      totalChange24h: 850,
      totalChangePercent: 2.59,
      availableBalance: 5200,
      investedAmount: 28400,
      profitLoss: 2200,
      profitLossPercent: 8.4
    }
  };
  
  res.json(portfolio);
});

// Ruta adicional para frontend
/*
app.get('/api/portfolio-demo', (req, res) => {
  res.json({
    assets: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        amount: 0.5,
        currentPrice: 45000,
        valueUSD: 22500,
        change24h: 2.5,
        allocation: 45
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        amount: 3.2,
        currentPrice: 3000,
        valueUSD: 9600,
        change24h: -1.2,
        allocation: 25
      }
    ],
    summary: {
      totalValue: 32100,
      availableBalance: 5000,
      investedAmount: 27100,
      profitLoss: 2200,
      profitLossPercent: 8.4,
      totalChange24h: 850,
      totalChangePercent: 2.59
    }
  });
});
*/
app.get('/api/crypto/ws-status', (req, res) => {
  res.json({ 
    status: 'ok',
    connected: true,
    message: 'WebSocket status check'
  });
});
// Ruta para obtener precios de criptos
app.post('/api/crypto/prices', (req, res) => {
  const { ids } = req.body;
  console.log(`💰 Solicitando precios para: ${ids}`);
  
  const prices: Record<string, any> = {};
  
  ids.forEach((id: string) => {
    const basePrices: Record<string, number> = {
      'bitcoin': 45000,
      'ethereum': 3000,
      'solana': 100
    };
    
    const basePrice = basePrices[id] || 100;
    const variation = (Math.random() * 0.1) - 0.05;
    
    prices[id] = {
      current_price: basePrice * (1 + variation),
      price_change_percentage_24h: (Math.random() * 20) - 10
    };
  });
  
  res.json(prices);
});

// ====================
// WEBSOCKET (Socket.io)
// ====================

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // <-- MISMO ORIGEN
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'] // <-- IMPORTANTE: agregar transports
});

// Manejar conexiones WebSocket
io.on('connection', (socket) => {
  console.log('✅ Cliente WebSocket conectado:', socket.id);
  
  // Suscribir a símbolos
  socket.on('subscribe', (symbols: string[]) => {
    console.log(`📡 Cliente ${socket.id} suscrito a:`, symbols);
    
    // Enviar datos iniciales
    symbols.forEach(symbol => {
      const basePrice = symbol === 'BTC' ? 45000 : 
                       symbol === 'ETH' ? 3000 : 
                       symbol === 'SOL' ? 100 : 50;
      
      socket.emit('priceUpdate', {
        symbol: symbol,
        price: basePrice,
        change: (Math.random() * 1000) - 500,
        changePercent: (Math.random() * 10) - 5,
        volume: Math.random() * 1000000,
        high: basePrice * 1.05,
        low: basePrice * 0.95,
        timestamp: Date.now()
      });
    });
    
    // Enviar actualizaciones periódicas
    const interval = setInterval(() => {
      symbols.forEach(symbol => {
        const basePrice = symbol === 'BTC' ? 45000 : 
                         symbol === 'ETH' ? 3000 : 
                         symbol === 'SOL' ? 100 : 50;
        
        const priceChange = (Math.random() * 0.02) - 0.01;
        const newPrice = basePrice * (1 + priceChange);
        
        socket.emit('priceUpdate', {
          symbol: symbol,
          price: newPrice,
          change: (newPrice - basePrice),
          changePercent: priceChange * 100,
          volume: Math.random() * 1000000,
          high: newPrice * 1.02,
          low: newPrice * 0.98,
          timestamp: Date.now()
        });
      });
    }, 3000); // Cada 3 segundos
    
    // Limpiar intervalo al desconectar
    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('❌ Cliente WebSocket desconectado:', socket.id);
    });
  });
  
  // Manejar desconexión general
  socket.on('disconnect', () => {
    console.log('❌ Cliente WebSocket desconectado:', socket.id);
  });
});

// ====================
// INICIAR SERVIDOR
// ====================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor backend iniciado en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket disponible en ws://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`👤 Portfolio demo: http://localhost:${PORT}/api/portfolio/demo`);
});