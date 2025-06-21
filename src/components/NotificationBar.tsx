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
  ChevronUp,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { useNotificationSystem } from '../hooks/useNotificationSystem';
import { Notification } from '../types/notifications';

const NotificationBar: React.FC = () => {
  const { notifications, markNotificationAsRead, dismissNotification, getNotificationSummary } = useNotificationSystem();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const summary = getNotificationSummary();
  const unreadNotifications = notifications.filter(n => !n.read_at && !n.dismissed_at);

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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleMarkAsRead = async (notification: Notification) => {
    await markNotificationAsRead(notification.id);
  };

  const handleDismiss = async (notification: Notification) => {
    await dismissNotification(notification.id);
  };

  const handleMarkAllAsRead = async () => {
    for (const notification of unreadNotifications) {
      await markNotificationAsRead(notification.id);
    }
    setIsDropdownOpen(false);
  };

  const handleDismissAll = async () => {
    for (const notification of unreadNotifications) {
      await dismissNotification(notification.id);
    }
    setIsDropdownOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Left side - Notification icon and count */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="relative">
                  <Bell className="w-5 h-5 text-gray-700" />
                  {summary.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {summary.unread_count > 9 ? '9+' : summary.unread_count}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {summary.unread_count} notification{summary.unread_count !== 1 ? 's' : ''}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={handleDismissAll}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Dismiss all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown Panel */}
        <div className={`absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-200 ease-in-out ${
          isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Notifications
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="text-xs text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-1">
                    <Settings className="w-3 h-3" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {unreadNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No new notifications</h3>
                  <p className="text-xs text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {unreadNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-3">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.created_at)}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                                <span className="text-xs text-gray-500 capitalize">
                                  {notification.priority}
                                </span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleMarkAsRead(notification)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Mark as read"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDismiss(notification)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Dismiss"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {unreadNotifications.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Showing {Math.min(unreadNotifications.length, 10)} of {unreadNotifications.length} notifications
                  </span>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-[-1]"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBar;