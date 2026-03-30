import React, { useState, useEffect } from 'react';
import { NotificationItem } from './NotificationItem';
import { notificationsApi } from '../../api/notifications.api';
import './notifications.css';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, isLoading, isConnected, fetchNotifications, fetchUnreadNotifications, fetchUnreadCount } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (filter === 'all') {
      fetchNotifications();
    } else {
      fetchUnreadNotifications();
    }
  }, [filter, fetchNotifications, fetchUnreadNotifications]);

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => n.status === 'unread')
      : notifications;

  const handleMarkAsRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    // Refetch notifications list
    if (filter === 'all') {
      fetchNotifications();
    } else {
      fetchUnreadNotifications();
    }
    // Fallback: If socket disconnected, manually fetch unread count
    if (!isConnected) {
      fetchUnreadCount();
    }
  };

  const handleDelete = async (id: string) => {
    await notificationsApi.delete(id);
    // Refetch notifications list
    if (filter === 'all') {
      fetchNotifications();
    } else {
      fetchUnreadNotifications();
    }
    // Fallback: If socket disconnected, manually fetch unread count
    if (!isConnected) {
      fetchUnreadCount();
    }
  };

  const handleMarkAllAsRead = async () => {
    await notificationsApi.markAllAsRead();
    // Refetch notifications list
    if (filter === 'all') {
      fetchNotifications();
    } else {
      fetchUnreadNotifications();
    }
    // Fallback: If socket disconnected, manually fetch unread count
    if (!isConnected) {
      fetchUnreadCount();
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="notification-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
        {notifications.some((n) => n.status === 'unread') && (
          <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-list">
        {isLoading ? (
          <div className="no-notifications">
            <p>Loading...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
