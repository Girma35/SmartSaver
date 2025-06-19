import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface CheckoutSessionResponse {
  url?: string;
  error?: string;
}

export const createCheckoutSession = async (priceId: string): Promise<CheckoutSessionResponse> => {
  try {
    // Validate environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/create-checkout-session`;
    
    const headers = {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    };

    console.log('Creating checkout session with:', { priceId, apiUrl });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ priceId })
    });

    console.log('Checkout response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Checkout error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Checkout response data:', data);
    
    if (data.error) {
      return { error: data.error };
    }

    return { url: data.url };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create checkout session' };
  }
};

export const createPortalSession = async (): Promise<CheckoutSessionResponse> => {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`;
    
    const headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }

    return { url: data.url };
  } catch (error) {
    console.error('Stripe portal error:', error);
    return { error: 'Failed to create portal session' };
  }
};