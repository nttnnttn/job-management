import React from 'react';
import type { NotificationItem as NotificationType } from '../../types/notification';
import { notificationsApi } from '../../api/notifications.api';
import './notifications.css';

interface NotificationItemProps {
  notification: NotificationType;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const handleMarkAsRead = async () => {
    if (notification.status === 'unread') {
      await notificationsApi.markAsRead(notification._id);
      onMarkAsRead(notification._id);
    }
  };

  const handleDelete = async () => {
    await notificationsApi.delete(notification._id);
    onDelete(notification._id);
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'job_application':
        return '📝';
      case 'application_approved':
        return '✅';
      case 'application_rejected':
        return '❌';
      case 'application_interview':
        return '📅';
      default:
        return '🔔';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`notification-item ${notification.status === 'unread' ? 'unread' : 'read'}`}
      onClick={handleMarkAsRead}
    >
      <div className="notification-icon">{getNotificationIcon()}</div>
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        {notification.job && (
          <div className="notification-job">
            {notification.job.title} at {notification.job.company}
          </div>
        )}
        <div className="notification-time">{formatTime(notification.createdAt)}</div>
      </div>
      <button
        className="notification-delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        aria-label="Delete notification"
      >
        ×
      </button>
    </div>
  );
};