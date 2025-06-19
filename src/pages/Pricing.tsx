import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, TrendingUp, Star, CreditCard } from 'lucide-react';
import { PricingPlan } from '../types/stripe';
import { useSubscription } from '../hooks/useSubscription';
import { stripePromise } from '../lib/stripe';

const Pricing: React.FC = () => {
  const { subscription, createCheckoutSession } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started with expense tracking',
      price: 0,
      interval: 'month',
      stripePriceId: '',
      features: [
        'Track up to 50 expenses per month',
        'Basic expense categories',
        'Simple dashboard',
        'Email support',
        'Mobile responsive design'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced features for serious budgeters',
      price: 9.99,
      interval: 'month',
      popular: true,
      stripePriceId: 'price_1234567890', // Replace with actual Stripe price ID
      features: [
        'Unlimited expense tracking',
        'Advanced AI financial advisor',
        'Custom categories and tags',
        'Detailed analytics and reports',
        'Budget planning tools',
        'Export data to CSV/PDF',
        'Priority email support',
        'Goal tracking and projections'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Complete financial management solution',
      price: 19.99,
      interval: 'month',
      stripePriceId: 'price_0987654321', // Replace with actual Stripe price ID
      features: [
        'Everything in Pro',
        'Multi-account management',
        'Investment tracking',
        'Tax preparation assistance',
        'Financial advisor consultations',
        'Advanced security features',
        'API access for integrations',
        'White-label options',
        '24/7 phone support'
      ]
    }
  ];

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.price === 0) return; // Free plan

    setLoading(plan.id);
    setError(null);

    try {
      const { data, error } = await createCheckoutSession(plan.stripePriceId);
      
      if (error) {
        setError(error);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setError('Stripe failed to load');
        return;
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (redirectError) {
        setError(redirectError.message);
      }
    } catch (err) {
      setError('Failed to start checkout process');
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === 'free' && !subscription) return true;
    if (subscription && planId === 'pro' && subscription.plan_name === 'Pro') return true;
    if (subscription && planId === 'premium' && subscription.plan_name === 'Premium') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock powerful features to take complete control of your financial future. 
            Start free and upgrade anytime.
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg">Active Subscription</h3>
                  <p className="text-green-100">
                    {subscription.plan_name} Plan - 
                    {subscription.cancel_at_period_end 
                      ? ` Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                      : ` Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Protected</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.id === 'free' 
                      ? 'bg-gray-100' 
                      : plan.id === 'pro' 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  }`}>
                    {plan.id === 'free' && <Zap className="w-8 h-8 text-gray-600" />}
                    {plan.id === 'pro' && <TrendingUp className="w-8 h-8 text-white" />}
                    {plan.id === 'premium' && <Crown className="w-8 h-8 text-white" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 ml-1">/{plan.interval}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id || isCurrentPlan(plan.id)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isCurrentPlan(plan.id)
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.id === 'free'
                        ? 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === plan.id ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : isCurrentPlan(plan.id) ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Current Plan</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>{plan.price === 0 ? 'Get Started Free' : `Subscribe to ${plan.name}`}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Compare All Features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Monthly Expense Limit', free: '50', pro: 'Unlimited', premium: 'Unlimited' },
                  { feature: 'AI Financial Advisor', free: 'Basic', pro: 'Advanced', premium: 'Expert' },
                  { feature: 'Custom Categories', free: '❌', pro: '✅', premium: '✅' },
                  { feature: 'Data Export', free: '❌', pro: '✅', premium: '✅' },
                  { feature: 'Goal Tracking', free: '❌', pro: '✅', premium: '✅' },
                  { feature: 'Investment Tracking', free: '❌', pro: '❌', premium: '✅' },
                  { feature: 'Multi-Account Support', free: '❌', pro: '❌', premium: '✅' },
                  { feature: 'Priority Support', free: '❌', pro: '✅', premium: '✅' },
                  { feature: 'Phone Support', free: '❌', pro: '❌', premium: '✅' }
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.pro}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
              <p className="text-gray-600 text-sm">
                Absolutely. We use Stripe for payment processing, which is PCI DSS compliant and 
                trusted by millions of businesses worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I cancel?</h3>
              <p className="text-gray-600 text-sm">
                You can cancel anytime. You'll continue to have access to premium features until 
                the end of your billing period, then automatically switch to the free plan.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee. If you're not satisfied within the first 
                30 days, contact support for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;