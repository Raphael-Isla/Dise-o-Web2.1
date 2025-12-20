// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/crypto.routes.ts';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API REST
app.use('/api/crypto', cryptoRoutes);

// Configuración WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('subscribe', (symbols: string[]) => {
    console.log('Cliente suscrito a:', symbols);
    // Lógica de suscripción aquí
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`WebSocket disponible en ws://localhost:${PORT}`);
});