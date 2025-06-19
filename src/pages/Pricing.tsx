import React, { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowRight, Loader2, CreditCard, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { createCheckoutSession } from '../services/stripeService';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Tier',
      price: 0,
      period: 'month',
      description: 'Great for trying out the platform',
      icon: Star,
      color: 'from-gray-500 to-gray-600',
      features: [
        'Basic feature access',
        '5 requests/day',
        'Simple analytics',
        'Watermarked exports',
        'Community support',
        'Ad-supported experience'
      ],
      popular: false,
      stripePriceId: null
    },
    {
      id: 'pro',
      name: 'Pro Tier',
      price: 10,
      period: 'month',
      description: 'Perfect for power users & small businesses',
      icon: Zap,
      color: 'from-purple-500 to-blue-500',
      features: [
        'Everything in Free, plus:',
        '50 requests/day (10x more)',
        'Advanced customization tools',
        'Priority email support',
        'Ad-free experience',
        'Enhanced analytics dashboard',
        'Professional-quality exports'
      ],
      popular: true,
      stripePriceId: null // TODO: Replace with actual Stripe Price ID from your dashboard
    },
    {
      id: 'premium',
      name: 'Premium Tier',
      price: 20,
      period: 'month',
      description: 'Ideal for businesses & developers needing maximum capability',
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      features: [
        'All Pro features, plus:',
        'Unlimited requests',
        '24/7 priority chat support',
        'White-labeling & branding',
        'Advanced reporting & insights',
        'Full API access',
        'Early access to new features',
        'Dedicated account manager'
      ],
      popular: false,
      stripePriceId: null // TODO: Replace with actual Stripe Price ID from your dashboard
    }
  ];

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      setError('Please sign in to subscribe to a plan');
      return;
    }

    if (plan.id === 'free') {
      setError('You are already on the free plan!');
      return;
    }

    if (!plan.stripePriceId) {
      setError(`The ${plan.name} is not available for purchase yet. Please set up Stripe Price IDs in your dashboard first.`);
      return;
    }

    setLoadingPlan(plan.id);
    setError(null);

    try {
      console.log('Creating Stripe checkout session for:', plan.name);
      
      // Create Stripe checkout session
      const { url, error: checkoutError } = await createCheckoutSession(plan.stripePriceId);
      
      if (checkoutError) {
        setError('Checkout error: ' + checkoutError);
        return;
      }
      
      if (url) {
        // Redirect to Stripe's hosted checkout page
        window.location.href = url;
      } else {
        setError('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription) return 'free';
    return subscription.plan_name.toLowerCase();
  };

  const isCurrentPlan = (planId: string) => {
    return getCurrentPlan() === planId;
  };

  const getButtonText = (plan: typeof plans[0]) => {
    if (loadingPlan === plan.id) return 'Creating checkout...';
    if (isCurrentPlan(plan.id)) return 'Current Plan';
    if (plan.id === 'free') return 'Get Started Free';
    if (!plan.stripePriceId) return 'Setup Required';
    return 'Upgrade Now';
  };

  const getButtonDisabled = (plan: typeof plans[0]) => {
    return loadingPlan !== null || isCurrentPlan(plan.id) || (!plan.stripePriceId && plan.id !== 'free');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Flexible Pricing Plans for
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {' '}Every Need
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect subscription plan to match your needs and budget
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Check className="w-4 h-4 text-green-500" />
            <span>Start free, upgrade anytime</span>
            <span className="mx-2">•</span>
            <Check className="w-4 h-4 text-green-500" />
            <span>Cancel or change plans at any time</span>
          </div>
        </div>

        {/* Setup Required Notice */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-orange-100 border border-orange-300 rounded-full px-6 py-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800 font-medium">
              Stripe setup required for paid plans - see instructions below
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-100 border border-red-300 rounded-full px-6 py-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Current Subscription Status */}
        {user && !subscriptionLoading && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">
                Current Plan: {getCurrentPlan().charAt(0).toUpperCase() + getCurrentPlan().slice(1)}
              </span>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            const isCurrent = isCurrentPlan(plan.id);
            const needsSetup = !plan.stripePriceId && plan.id !== 'free';
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isPopular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
                } ${isCurrent ? 'ring-2 ring-green-500 ring-opacity-50' : ''} ${
                  needsSetup ? 'opacity-75' : ''
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Current
                    </div>
                  </div>
                )}

                {/* Setup Required Badge */}
                {needsSetup && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Setup Required
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 text-sm italic">{plan.description}</p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className={`text-gray-700 ${
                          feature.includes('Everything in') || feature.includes('All Pro features') 
                            ? 'font-semibold text-purple-700' 
                            : ''
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={getButtonDisabled(plan)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isCurrent
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : needsSetup
                        ? 'bg-orange-100 text-orange-700 cursor-not-allowed'
                        : plan.id === 'free'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>{getButtonText(plan)}</span>
                        {!isCurrent && !needsSetup && plan.id !== 'free' && <ArrowRight className="w-5 h-5" />}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stripe Setup Instructions */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Stripe Setup Required
            </h3>
            <div className="text-blue-800 space-y-3">
              <p className="font-medium">To enable paid subscriptions, you need to:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <a 
                    href="https://dashboard.stripe.com/products" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                  >
                    Go to your Stripe Dashboard → Products
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </li>
                <li>Create a "Pro Tier" product with a $10/month recurring price</li>
                <li>Create a "Premium Tier" product with a $20/month recurring price</li>
                <li>Copy the Price IDs (they start with "price_") from each product</li>
                <li>Replace the <code className="bg-blue-100 px-2 py-1 rounded">stripePriceId: null</code> values in the pricing plans with your actual Price IDs</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm">
                  <strong>Example:</strong> <code>stripePriceId: "price_1234567890abcdef"</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                Changes take effect at your next billing cycle.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and digital wallets through 
                our secure Stripe payment processing.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">
                Our Free Tier gives you access to core features with no time limit. 
                Upgrade anytime to unlock more powerful capabilities.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. 
                Contact support if you're not satisfied with your subscription.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Financial Life?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have taken control of their finances with our powerful tools and AI-driven insights.
            </p>
            <p className="text-purple-200 text-sm mb-6">
              Complete Stripe setup to enable paid subscriptions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;