import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface CheckoutSessionResponse {
  url?: string;
  error?: string;
}

export const createCheckoutSession = async (priceId: string): Promise<CheckoutSessionResponse> => {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
    
    const headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ priceId })
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
    console.error('Stripe checkout error:', error);
    return { error: 'Failed to create checkout session' };
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