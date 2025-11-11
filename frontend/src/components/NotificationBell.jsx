import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    loadNotifications, 
    updateUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    initializeSocket,
    disconnectSocket
  } = useNotificationStore();
  
  const { isAuthenticated, getAccessToken } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const token = getAccessToken();
      if (token) {
        // Inicializar Socket.io
        initializeSocket(token);
        
        // Carregar notificações
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

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white transition-all duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9997]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl z-[9999] border border-gray-700 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400">
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      to={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                        setIsOpen(false);
                      }}
                      className={`block px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                        !notification.is_read ? 'bg-gray-700/30' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {!notification.is_read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                          <button
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-700 text-center">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ver todas as notificações
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;

