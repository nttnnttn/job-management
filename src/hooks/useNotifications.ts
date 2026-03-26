import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { NotificationItem } from '../types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const baseUrl = process.env.REACT_APP_API_BASE || 'http://localhost:3000';
    const socket = io(`${baseUrl}/notifications`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to notifications');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notifications');
      setIsConnected(false);
    });

    socket.on('new_notification', (notification: NotificationItem) => {
      console.log('New notification received:', notification);
      setNotifications((prev) => [notification, ...prev]);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo192.png',
        });
      }
    });

    socket.on('unread_count', ({ count }: { count: number }) => {
      setUnreadCount(count);
    });

    socket.on('notifications_list', (notificationsList: NotificationItem[]) => {
      setNotifications(notificationsList);
    });

    socketRef.current = socket;

    // Request notifications list on connect
    socket.emit('get_notifications');
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const refreshNotifications = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('get_notifications');
    }
  }, []);

  const refreshUnreadCount = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('get_unread_count');
    }
  }, []);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    notifications,
    unreadCount,
    isConnected,
    refreshNotifications,
    refreshUnreadCount,
    connect,
    disconnect,
  };
};