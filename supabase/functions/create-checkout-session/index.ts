/*
  # Create Stripe Checkout Session
  
  This function creates a Stripe checkout session for subscription payments.
  It handles the creation of checkout sessions and redirects users to Stripe's hosted checkout page.
*/

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CheckoutRequest {
  priceId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment');
      throw new Error('Stripe configuration is missing');
    }

    // Parse request body
    const { priceId }: CheckoutRequest = await req.json();
    
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    console.log('Creating checkout session for price:', priceId);

    // Get the authorization header to identify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Create Supabase client to get user info
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not set');
    }

    // Create Supabase client with user's auth token
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Authenticated user:', user.email);

    // Get origin for redirect URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    
    // Create checkout session using Stripe API directly with fetch
    const stripeApiUrl = 'https://api.stripe.com/v1/checkout/sessions';
    
    const formData = new URLSearchParams();
    formData.append('mode', 'subscription');
    formData.append('line_items[0][price]', priceId);
    formData.append('line_items[0][quantity]', '1');
    formData.append('success_url', `${origin}/success?session_id={CHECKOUT_SESSION_ID}`);
    formData.append('cancel_url', `${origin}/pricing`);
    formData.append('billing_address_collection', 'required');
    formData.append('customer_email', user.email || '');
    formData.append('metadata[user_id]', user.id);
    formData.append('subscription_data[metadata][user_id]', user.id);
    // Removed automatic_tax to avoid origin address requirement in test mode

    console.log('Making request to Stripe API...');

    const stripeResponse = await fetch(stripeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2023-10-16',
      },
      body: formData.toString(),
    });

    console.log('Stripe response status:', stripeResponse.status);

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error response:', errorText);
      
      let errorMessage = 'Stripe API error';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // If we can't parse the error, use the raw text
        errorMessage = errorText;
      }
      
      throw new Error(`Stripe API error: ${stripeResponse.status} - ${errorMessage}`);
    }

    const session = await stripeResponse.json();
    console.log('Checkout session created successfully:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error('Checkout session error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create checkout session',
        details: error.toString()
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }
});