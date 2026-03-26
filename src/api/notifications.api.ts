import { 
  notificationsControllerFindAll,
  notificationsControllerFindUnread,
  notificationsControllerGetUnreadCount,
  notificationsControllerMarkAsRead,
  notificationsControllerMarkAllAsRead,
  notificationsControllerRemove
} from '../api-client/sdk.gen';

export const notificationsApi = {
  // Get all notifications for current user
  getAll: async () => {
    const res = await notificationsControllerFindAll();
    return res.data ?? [];
  },

  // Get unread notifications
  getUnread: async () => {
    const res = await notificationsControllerFindUnread();
    return res.data ?? [];
  },

  // Get unread count
  getUnreadCount: async () => {
    const res = await notificationsControllerGetUnreadCount();
    return (res.data as any)?.count ?? 0;
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const res = await notificationsControllerMarkAsRead({ path: { id } });
    return res.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const res = await notificationsControllerMarkAllAsRead();
    return res.data;
  },

  // Delete notification
  delete: async (id: string) => {
    const res = await notificationsControllerRemove({ path: { id } });
    return res.data;
  },
};