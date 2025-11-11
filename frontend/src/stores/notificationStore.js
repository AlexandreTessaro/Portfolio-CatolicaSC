import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useAuthStore } from './authStore';
import { notificationService } from '../services/notificationService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useNotificationStore = create((set, get) => {
  let socket = null;

  return {
    // Estado
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isConnected: false,

    // Inicializar Socket.io
    initializeSocket: (accessToken) => {
      if (socket?.connected) {
        return; // Já está conectado
      }

      // Desconectar socket anterior se existir
      if (socket) {
        socket.disconnect();
      }

      // Criar nova conexão
      socket = io(SOCKET_URL, {
        auth: {
          token: accessToken
        },
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        console.log('✅ Socket.io conectado');
        set({ isConnected: true });
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket.io desconectado');
        set({ isConnected: false });
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Erro ao conectar Socket.io:', error);
        set({ isConnected: false });
      });

      // Escutar notificações em tempo real
      socket.on('notification', (notification) => {
        console.log('🔔 Nova notificação recebida:', notification);
        const currentNotifications = get().notifications;
        set({
          notifications: [notification, ...currentNotifications],
          unreadCount: get().unreadCount + 1
        });
      });

      return socket;
    },

    // Desconectar Socket.io
    disconnectSocket: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      set({ isConnected: false });
    },

    // Carregar notificações do servidor
    loadNotifications: async () => {
      set({ isLoading: true });
      try {
        const response = await notificationService.list();
        set({
          notifications: response.data || [],
          isLoading: false
        });
        await get().updateUnreadCount();
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        set({ isLoading: false });
      }
    },

    // Atualizar contador de não lidas
    updateUnreadCount: async () => {
      try {
        const response = await notificationService.getUnreadCount();
        set({ unreadCount: response.data?.count || 0 });
      } catch (error) {
        console.error('Erro ao atualizar contador:', error);
      }
    },

    // Marcar como lida
    markAsRead: async (notificationId) => {
      try {
        await notificationService.markAsRead(notificationId);
        const notifications = get().notifications.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        );
        set({
          notifications,
          unreadCount: Math.max(0, get().unreadCount - 1)
        });
      } catch (error) {
        console.error('Erro ao marcar como lida:', error);
      }
    },

    // Marcar todas como lidas
    markAllAsRead: async () => {
      try {
        await notificationService.markAllAsRead();
        const notifications = get().notifications.map(n => ({ ...n, is_read: true }));
        set({
          notifications,
          unreadCount: 0
        });
      } catch (error) {
        console.error('Erro ao marcar todas como lidas:', error);
      }
    },

    // Deletar notificação
    deleteNotification: async (notificationId) => {
      try {
        await notificationService.delete(notificationId);
        const notifications = get().notifications.filter(n => n.id !== notificationId);
        const deleted = get().notifications.find(n => n.id === notificationId);
        set({
          notifications,
          unreadCount: deleted && !deleted.is_read
            ? Math.max(0, get().unreadCount - 1)
            : get().unreadCount
        });
      } catch (error) {
        console.error('Erro ao deletar notificação:', error);
      }
    }
  };
});

