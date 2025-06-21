import React, { useState, useEffect } from 'react';
import { useNotificationSystem } from '../hooks/useNotificationSystem';
import NotificationToast from './NotificationToast';
import { Notification } from '../types/notifications';

const NotificationContainer: React.FC = () => {
  const { notifications, markNotificationAsRead, dismissNotification } = useNotificationSystem();
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);

  useEffect(() => {
    // Show new unread notifications as toasts
    const newNotifications = notifications.filter(
      n => !n.read_at && 
           !n.dismissed_at && 
           // Only show notifications from the last 5 minutes
           new Date(n.created_at).getTime() > Date.now() - 5 * 60 * 1000
    );

    if (newNotifications.length > 0) {
      setActiveToasts(prevActiveToasts => {
        // Filter out notifications that are already showing as toasts
        const filteredNewNotifications = newNotifications.filter(
          n => !prevActiveToasts.some(toast => toast.id === n.id)
        );
        
        if (filteredNewNotifications.length > 0) {
          // Max 3 toasts total
          const availableSlots = Math.max(0, 3 - prevActiveToasts.length);
          const toastsToAdd = filteredNewNotifications.slice(0, availableSlots);
          return [...prevActiveToasts, ...toastsToAdd];
        }
        
        return prevActiveToasts;
      });
    }
  }, [notifications]); // Removed activeToasts from dependency array

  const handleDismissToast = (notificationId: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== notificationId));
    dismissNotification(notificationId);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== notificationId));
    markNotificationAsRead(notificationId);
  };

  return (
    <div className="fixed top-20 right-4 z-40 space-y-3 max-w-sm">
      {activeToasts.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={() => handleDismissToast(notification.id)}
          onMarkAsRead={() => handleMarkAsRead(notification.id)}
          autoHide={notification.priority !== 'urgent'}
          duration={notification.priority === 'high' ? 8000 : 5000}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;