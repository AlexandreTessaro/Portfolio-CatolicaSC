import { Server } from 'socket.io';
import { verifyAccessToken } from './jwt.js';

/**
 * Configurar Socket.io com autenticação JWT
 */
export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware de autenticação para Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Token não fornecido'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  // Quando um cliente se conecta
  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.userId} (${socket.userEmail})`);
    
    // Entrar na sala do usuário para receber notificações
    socket.join(`user:${socket.userId}`);

    // Desconexão
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.userId}`);
    });
  });

  return io;
}

/**
 * Enviar notificação em tempo real para um usuário
 */
export function emitNotification(io, userId, notification) {
  io.to(`user:${userId}`).emit('notification', notification);
}

