import React, { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    updateUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    initializeSocket,
    disconnectSocket
  } = useNotificationStore();

  const { isAuthenticated, getAccessToken } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const token = getAccessToken();
      if (token) {
        initializeSocket(token);
        loadNotifications();
        updateUnreadCount();
      }
    }

    return () => {
      if (isAuthenticated) {
        disconnectSocket();
      }
    };
  }, [isAuthenticated]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match_request':
        return '👋';
      case 'match_accepted':
        return '✅';
      case 'match_rejected':
        return '❌';
      case 'project_invitation':
        return '📨';
      case 'project_update':
        return '📝';
      case 'comment':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.data?.projectId) {
      return `/projects/${notification.data.projectId}`;
    }
    if (notification.data?.matchId) {
      return '/matches';
    }
    return '/dashboard';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-gray-300 mb-4">Você precisa estar logado para ver notificações.</p>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Notificações</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
              >
                Marcar todas como lidas ({unreadCount})
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-gray-300 mt-4">Carregando notificações...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-300 text-lg">Nenhuma notificação ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={getNotificationLink(notification)}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                  }}
                  className={`block bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg p-4 transition-all ${
                    !notification.is_read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-300 mb-2">{notification.message}</p>
                          <p className="text-sm text-gray-400">{formatDate(notification.created_at)}</p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                          {!notification.is_read && (
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

