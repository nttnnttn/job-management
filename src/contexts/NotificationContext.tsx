import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { notificationsApi } from '../api/notifications.api';
import type { NotificationItem } from '../types/notification';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  connect: () => void;
  disconnect: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    // Listen for unread count updates from backend
    socket.on('unread_count', ({ count }: { count: number }) => {
      console.log('Unread count updated:', count);
      setUnreadCount(count);
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch unread notifications from API
  const fetchUnreadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await notificationsApi.getUnread();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
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

  const value = {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    fetchNotifications,
    fetchUnreadNotifications,
    fetchUnreadCount,
    connect,
    disconnect,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
