import React, { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { createCheckoutSession } from '../services/stripeService';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

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
      stripePriceId: 'price_pro_monthly' // Replace with actual Stripe price ID
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
      stripePriceId: 'price_premium_monthly' // Replace with actual Stripe price ID
    }
  ];

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      // Redirect to auth or show login modal
      return;
    }

    if (plan.id === 'free') {
      // Handle free plan logic if needed
      return;
    }

    if (!plan.stripePriceId) {
      console.error('No Stripe price ID configured for this plan');
      return;
    }

    setLoadingPlan(plan.id);

    try {
      const { url, error } = await createCheckoutSession(plan.stripePriceId);
      
      if (error) {
        console.error('Checkout error:', error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
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
    if (loadingPlan === plan.id) return 'Processing...';
    if (isCurrentPlan(plan.id)) return 'Current Plan';
    if (plan.id === 'free') return 'Get Started Free';
    return 'Upgrade Now';
  };

  const getButtonDisabled = (plan: typeof plans[0]) => {
    return loadingPlan !== null || isCurrentPlan(plan.id);
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
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isPopular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
                } ${isCurrent ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
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
                        {!isCurrent && plan.id !== 'free' && <ArrowRight className="w-5 h-5" />}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
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
            <button
              onClick={() => handleSubscribe(plans[1])} // Pro plan
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;