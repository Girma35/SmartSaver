interface EmailNotificationData {
  type: 'expense_added' | 'budget_alert' | 'spending_summary' | 'security_alert' | 'subscription_update';
  userEmail: string;
  userName?: string;
  data: any;
}

export const sendEmailNotification = async (notificationData: EmailNotificationData): Promise<{ success: boolean; error?: string }> => {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email-notification`;
    
    const headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email notification');
    }

    const result = await response.json();
    return { success: result.success };
  } catch (error) {
    console.error('Email service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email notification' 
    };
  }
};

// Specific notification functions for different events
export const sendExpenseAddedNotification = async (
  userEmail: string, 
  userName: string, 
  expense: { amount: number; category: string; date: string; notes?: string }
) => {
  return sendEmailNotification({
    type: 'expense_added',
    userEmail,
    userName,
    data: expense
  });
};

export const sendBudgetAlertNotification = async (
  userEmail: string,
  userName: string,
  budgetData: { category: string; spent: number; budget: number }
) => {
  return sendEmailNotification({
    type: 'budget_alert',
    userEmail,
    userName,
    data: budgetData
  });
};

export const sendSpendingSummaryNotification = async (
  userEmail: string,
  userName: string,
  summaryData: {
    period: string;
    totalSpent: number;
    transactionCount: number;
    topCategories: Array<{ category: string; amount: number }>;
    insights?: string;
  }
) => {
  return sendEmailNotification({
    type: 'spending_summary',
    userEmail,
    userName,
    data: summaryData
  });
};

export const sendSecurityAlertNotification = async (
  userEmail: string,
  userName: string,
  securityData: { action: string; ipAddress?: string }
) => {
  return sendEmailNotification({
    type: 'security_alert',
    userEmail,
    userName,
    data: securityData
  });
};

export const sendSubscriptionUpdateNotification = async (
  userEmail: string,
  userName: string,
  subscriptionData: {
    planName: string;
    status: string;
    action: string;
    nextBillingDate?: string;
  }
) => {
  return sendEmailNotification({
    type: 'subscription_update',
    userEmail,
    userName,
    data: subscriptionData
  });
};