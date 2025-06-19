import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface CheckoutSessionResponse {
  url?: string;
  error?: string;
}

export const createCheckoutSession = async (priceId: string, accessToken?: string): Promise<CheckoutSessionResponse> => {
  try {
    // Validate environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    if (!accessToken) {
      throw new Error('User must be authenticated to create checkout session');
    }

    // Clean the URL to ensure no trailing slash
    const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
    const apiUrl = `${cleanUrl}/functions/v1/create-checkout-session`;
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    console.log('Creating checkout session with:', { priceId, apiUrl });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ priceId }),
      // Add timeout and other fetch options for better reliability
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    console.log('Checkout response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Checkout error response:', errorText);
      
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch (e) {
        // If we can't parse the error, use the status text
        errorMessage = `${errorMessage} - ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Checkout response data:', data);
    
    if (data.error) {
      return { error: data.error };
    }

    if (!data.url) {
      return { error: 'No checkout URL received from server' };
    }

    return { url: data.url };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    if (error.name === 'AbortError') {
      return { error: 'Request timeout - please try again' };
    }
    
    return { error: error instanceof Error ? error.message : 'Failed to create checkout session' };
  }
};

export const createPortalSession = async (accessToken?: string): Promise<CheckoutSessionResponse> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    if (!accessToken) {
      throw new Error('User must be authenticated to create portal session');
    }

    const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
    const apiUrl = `${cleanUrl}/functions/v1/create-portal-session`;
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Portal error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }

    return { url: data.url };
  } catch (error) {
    console.error('Stripe portal error:', error);
    
    if (error.name === 'AbortError') {
      return { error: 'Request timeout - please try again' };
    }
    
    return { error: error instanceof Error ? error.message : 'Failed to create portal session' };
  }
};