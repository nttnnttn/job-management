export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  recipient: string;
  sender?: {
    _id: string;
    email: string;
    fullName?: string;
  };
  job?: {
    _id: string;
    title: string;
    company: string;
  };
  jobCandidate?: {
    _id: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Keep Notification as an alias for backward compatibility
export type Notification = NotificationItem;