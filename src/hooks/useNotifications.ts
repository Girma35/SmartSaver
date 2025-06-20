import { useState } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { 
  sendExpenseAddedNotification,
  sendBudgetAlertNotification,
  sendSpendingSummaryNotification,
  sendSecurityAlertNotification,
  sendSubscriptionUpdateNotification
} from '../services/emailService';

export const useNotifications = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [sending, setSending] = useState(false);

  const sendNotification = async (
    type: 'expense_added' | 'budget_alert' | 'spending_summary' | 'security_alert' | 'subscription_update',
    data: any
  ) => {
    if (!user?.email || !profile?.display_name) {
      console.warn('Cannot send notification: missing user email or name');
      return { success: false, error: 'User information not available' };
    }

    setSending(true);
    
    try {
      let result;
      
      switch (type) {
        case 'expense_added':
          result = await sendExpenseAddedNotification(user.email, profile.display_name, data);
          break;
        case 'budget_alert':
          result = await sendBudgetAlertNotification(user.email, profile.display_name, data);
          break;
        case 'spending_summary':
          result = await sendSpendingSummaryNotification(user.email, profile.display_name, data);
          break;
        case 'security_alert':
          result = await sendSecurityAlertNotification(user.email, profile.display_name, data);
          break;
        case 'subscription_update':
          result = await sendSubscriptionUpdateNotification(user.email, profile.display_name, data);
          break;
        default:
          result = { success: false, error: 'Unknown notification type' };
      }

      return result;
    } catch (error) {
      console.error('Notification error:', error);
      return { success: false, error: 'Failed to send notification' };
    } finally {
      setSending(false);
    }
  };

  return {
    sendNotification,
    sending
  };
};