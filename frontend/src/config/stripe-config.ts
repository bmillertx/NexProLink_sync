export const STRIPE_CONFIG = {
  // Subscription tiers
  SUBSCRIPTION_TIERS: {
    BASIC: {
      id: 'basic_tier',
      name: 'Basic',
      price: 49.99,
      features: [
        'Up to 5 consultations per month',
        'Basic video quality',
        'Email support',
        'Basic analytics'
      ]
    },
    PROFESSIONAL: {
      id: 'professional_tier',
      name: 'Professional',
      price: 99.99,
      features: [
        'Up to 20 consultations per month',
        'HD video quality',
        'Priority support',
        'Advanced analytics',
        'Custom branding'
      ]
    },
    ENTERPRISE: {
      id: 'enterprise_tier',
      name: 'Enterprise',
      price: 199.99,
      features: [
        'Unlimited consultations',
        '4K video quality',
        '24/7 dedicated support',
        'Enterprise analytics',
        'White-label solution',
        'API access'
      ]
    }
  },

  // Platform fees
  PLATFORM_FEE_PERCENTAGE: 15, // 15% platform fee
  STRIPE_FEE_PERCENTAGE: 2.9, // 2.9% + $0.30 per transaction
  STRIPE_FIXED_FEE: 0.30,

  // Currency
  DEFAULT_CURRENCY: 'usd',
  
  // Consultation duration options (in minutes)
  CONSULTATION_DURATIONS: [
    { value: 30, label: '30 minutes', price: 50 },
    { value: 60, label: '1 hour', price: 90 },
    { value: 90, label: '1.5 hours', price: 130 },
    { value: 120, label: '2 hours', price: 170 }
  ]
};
