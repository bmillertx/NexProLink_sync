import { NextPage } from 'next';
import { VideoCameraIcon, ChatBubbleLeftRightIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Expert-Set Rates',
    description: 'Experts set their own competitive rates based on experience and market value',
    icon: CurrencyDollarIcon,
  },
  {
    title: 'Simple Platform Fee',
    description: 'Just 15% platform fee on successful consultations. No hidden charges.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Video Consultations',
    description: 'High-quality video calls with screen sharing capabilities',
    icon: VideoCameraIcon,
  },
  {
    title: 'Text Chat',
    description: 'Instant messaging with code snippet support',
    icon: ChatBubbleLeftRightIcon,
  },
];

const benefits = [
  {
    title: 'For Experts',
    features: [
      'Set your own rates',
      'Flexible availability',
      'Built-in payment protection',
      'Professional profile',
      'Client reviews and ratings',
      'Instant payments',
    ],
  },
  {
    title: 'For Clients',
    features: [
      'No subscription required',
      'Pay only for time used',
      'Verified experts',
      'Secure platform',
      'Quality guarantee',
      'Dispute protection',
    ],
  },
];

export default function Pricing() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Connect with experts at their professional rates.<br />
            We only charge a 15% platform fee to maintain a quality service.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Simple and Transparent
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Example Calculation */}
        <div className="mb-20 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Example Calculation
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Expert's Rate</span>
                  <span className="text-gray-900 dark:text-white font-medium">$100/hour</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Platform Fee (15%)</span>
                  <span className="text-gray-900 dark:text-white font-medium">$15/hour</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white font-semibold">Total Client Cost</span>
                    <span className="text-gray-900 dark:text-white font-semibold">$115/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Platform Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((section) => (
              <div
                key={section.title}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href="/experts"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Browse Experts
          </a>
        </div>
      </div>
    </div>
  );
}
