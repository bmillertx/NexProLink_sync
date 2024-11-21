import { useState } from 'react';
import { CheckIcon, VideoCameraIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

const plans = [
  {
    name: 'Free',
    id: 'tier-free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Create professional profile',
      'Basic search functionality',
      'View expert profiles',
      'Text chat consultations',
      'Standard platform fee (15%)',
      'Basic analytics dashboard',
      'Content filtering protection'
    ],
  },
  {
    name: 'Expert',
    id: 'tier-expert',
    price: '$19',
    description: 'For professional consultants',
    features: [
      'All Free features',
      'Featured profile listing',
      'Priority search placement',
      'Advanced analytics',
      'Verified expert badge',
      'Custom availability calendar',
      'Reduced platform fee (12%)',
      'Priority support',
      'Dispute protection'
    ],
  },
];

const consultationTypes = [
  {
    name: 'Video Consultation',
    id: 'video-call',
    icon: VideoCameraIcon,
    baseRate: '1.00',
    minMinutes: 5,
    description: 'Professional face-to-face video consultations (5-minute minimum)',
    features: [
      'HD video quality',
      'Screen sharing',
      'Built-in code editor',
      'Anti-bypass protection',
      'Automated session summaries'
    ]
  },
  {
    name: 'Text Chat',
    id: 'text-chat',
    icon: ChatBubbleLeftRightIcon,
    baseRate: '0.50',
    minMinutes: 5,
    description: 'Instant messaging consultations (5-minute minimum)',
    features: [
      'Real-time messaging',
      'Code snippet support',
      'Smart content filtering',
      'Syntax highlighting',
      'Chat transcript'
    ]
  }
];

export default function Pricing() {
  const { user } = useAuth();

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      // Handle user not logged in
      return;
    }
    
    try {
      // TODO: Implement upgrade flow
      console.log(`Upgrading to ${planId}`);
    } catch (error) {
      console.error('Error upgrading:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Platform Fee Information */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
            Transparent Pricing
          </h1>
          <p className="mt-5 text-xl text-gray-500 dark:text-gray-400">
            Professional consultations with secure platform protection. 15% platform fee.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            5-minute minimum for all consultation types
          </div>
        </div>

        {/* Consultation Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Consultation Options
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {consultationTypes.map((type) => (
              <div
                key={type.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-8"
              >
                <div className="flex items-center mb-4">
                  <type.icon className="h-8 w-8 text-primary-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {type.name}
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {type.description}
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${type.baseRate}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400"> /minute</span>
                  <div className="text-sm text-gray-500 mt-1">
                    Minimum {type.minMinutes} minutes (${(parseFloat(type.baseRate) * type.minMinutes).toFixed(2)})
                  </div>
                </div>
                <ul className="space-y-3">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Plans */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Expert Plans
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-8"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {plan.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== '$0' && (
                    <span className="text-gray-500 dark:text-gray-400"> /month</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.name !== 'Free' && (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    className="w-full bg-primary-600 text-white rounded-md py-2 px-4 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Platform Protection & Benefits
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Protected payments and dispute resolution
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Content Monitoring
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                AI-powered protection against contact sharing
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quality Assurance
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Expert verification and rating system
              </p>
            </div>
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Fair Usage Policy
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To maintain platform integrity, we actively monitor for attempts to bypass our system. 
              Violations may result in account suspension and forfeiture of earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
