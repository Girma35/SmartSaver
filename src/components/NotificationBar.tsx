import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  Shield,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNotificationSystem } from '../hooks/useNotificationSystem';
import { Notification } from '../types/notifications';

const NotificationBar: React.FC = () => {
  const { notifications, markNotificationAsRead, dismissNotification } = useNotificationSystem();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Get unread notifications
  const unreadNotifications = notifications.filter(n => !n.read_at && !n.dismissed_at);
  const latestNotification = unreadNotifications[0];

  useEffect(() => {
    setIsVisible(unreadNotifications.length > 0);
  }, [unreadNotifications.length]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_balance':
        return <DollarSign className="w-4 h-4 text-orange-500" />;
      case 'suspicious_activity':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'overspending':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'recurring_bill':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'large_transaction':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    await markNotificationAsRead(notification.id);
  };

  const handleDismiss = async (notification: Notification) => {
    await dismissNotification(notification.id);
  };

  const handleDismissAll = async () => {
    for (const notification of unreadNotifications) {
      await dismissNotification(notification.id);
    }
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main notification bar */}
      <div className={`bg-white border-b border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        {/* Collapsed view */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              {/* Notification indicator */}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                {unreadNotifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                  </div>
                )}
              </div>

              {/* Latest notification preview */}
              {latestNotification && (
                <div className="flex items-center space-x-3">
                  {getNotificationIcon(latestNotification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {latestNotification.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {latestNotification.message}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(latestNotification.priority)}`}></div>
                </div>
              )}

              {/* Multiple notifications indicator */}
              {unreadNotifications.length > 1 && (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  +{unreadNotifications.length - 1} more
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {latestNotification && (
                <>
                  <button
                    onClick={() => handleMarkAsRead(latestNotification)}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDismiss(latestNotification)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              
              {unreadNotifications.length > 1 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title={isExpanded ? "Collapse" : "Show all"}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expanded view */}
        <div className={`border-t border-gray-100 bg-gray-50 transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  All Notifications ({unreadNotifications.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDismissAll}
                    className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Dismiss All
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications list */}
            <div className="max-h-64 overflow-y-auto">
              {unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-white transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleMarkAsRead(notification)}
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          Mark as Read
                        </button>
                        <button
                          onClick={() => handleDismiss(notification)}
                          className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <div className="text-center">
                <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                  View All Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default NotificationBar;