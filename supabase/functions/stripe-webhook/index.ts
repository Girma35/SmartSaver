/*
  # Stripe Webhook Handler Edge Function
  
  This function handles Stripe webhook events to keep subscription data in sync.
  It processes events like subscription creation, updates, and cancellations.
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.15.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')
  const body = await request.text()
  
  let receivedEvent
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    return new Response(err.message, { status: 400 })
  }

  console.log(`🔔  Webhook received: ${receivedEvent.type}`)

  try {
    switch (receivedEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(receivedEvent.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(receivedEvent.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(receivedEvent.data.object)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(receivedEvent.data.object)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(receivedEvent.data.object)
        break
      default:
        console.log(`Unhandled event type: ${receivedEvent.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Webhook processing failed', { status: 500 })
  }

  return new Response('Webhook processed successfully', { status: 200 })
})

async function handleCheckoutSessionCompleted(session: any) {
  const userId = session.metadata?.user_id
  if (!userId) return

  const subscription = await stripe.subscriptions.retrieve(session.subscription)
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id)
  const product = await stripe.products.retrieve(price.product as string)

  await supabaseClient
    .from('subscriptions')
    .upsert({
      id: subscription.id,
      user_id: userId,
      status: subscription.status,
      plan_name: product.name,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
}

async function handleSubscriptionUpdated(subscription: any) {
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id)
  const product = await stripe.products.retrieve(price.product as string)

  await supabaseClient
    .from('subscriptions')
    .update({
      status: subscription.status,
      plan_name: product.name,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscription.id)
}

async function handleSubscriptionDeleted(subscription: any) {
  await supabaseClient
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscription.id)
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  // Handle successful payment - could update payment history, send confirmation emails, etc.
  console.log('Payment succeeded for invoice:', invoice.id)
}

async function handleInvoicePaymentFailed(invoice: any) {
  // Handle failed payment - could send notification emails, update subscription status, etc.
  console.log('Payment failed for invoice:', invoice.id)
}