/*
  # Create Stripe Checkout Session
  
  This function creates a Stripe checkout session for subscription payments.
  It handles the creation of checkout sessions and redirects users to Stripe's hosted checkout page.
*/

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
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }

    // Parse request body
    const { priceId }: CheckoutRequest = await req.json();
    
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    // Get the authorization header to identify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Create Supabase client to get user info
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not set');
    }

    // For now, we'll create a simple checkout session without user verification
    // In production, you'd want to verify the user through Supabase
    
    // Create checkout session using Stripe API directly
    const stripeApiUrl = 'https://api.stripe.com/v1/checkout/sessions';
    
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    
    const formData = new URLSearchParams();
    formData.append('mode', 'subscription');
    formData.append('line_items[0][price]', priceId);
    formData.append('line_items[0][quantity]', '1');
    formData.append('success_url', `${origin}/success?session_id={CHECKOUT_SESSION_ID}`);
    formData.append('cancel_url', `${origin}/pricing`);
    formData.append('billing_address_collection', 'required');
    // Removed automatic_tax[enabled] to avoid requiring origin address configuration in Stripe test mode

    const stripeResponse = await fetch(stripeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', errorText);
      throw new Error(`Stripe API error: ${stripeResponse.status} - ${errorText}`);
    }

    const session = await stripeResponse.json();

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