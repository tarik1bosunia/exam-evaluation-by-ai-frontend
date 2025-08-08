import type { Notification as AppNotification } from "@/types/conversation";

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  
  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};

// Format notification content
export const formatNotificationContent = (content: string, maxLength = 100) => {
  if (content.length <= maxLength) return content;
  
  return content.substring(0, maxLength) + '...';
};

// Group notifications by time
export const groupNotifications = (notifications: AppNotification[]) => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const grouped: Record<string, AppNotification[]> = {
    'Today': [],
    'Yesterday': [],
    'Older': []
  };
  
  notifications.forEach(notification => {
    const notifDate = new Date(notification.timestamp);
    
    if (notifDate >= today) {
      grouped['Today'].push(notification);
    } else if (notifDate >= yesterday) {
      grouped['Yesterday'].push(notification);
    } else {
      grouped['Older'].push(notification);
    }
  });
  
  return grouped;
};