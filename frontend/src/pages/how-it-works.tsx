import { NextPage } from 'next';
import { ChatBubbleLeftRightIcon, VideoCameraIcon, CreditCardIcon, UserGroupIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Browse Experts',
    description: 'Explore profiles of verified experts with transparent hourly rates. Filter by expertise, ratings, and availability to find your perfect match.',
    icon: UserGroupIcon,
  },
  {
    title: 'Choose Your Expert',
    description: 'Select an expert based on their expertise, hourly rate, and reviews. Each expert sets their own competitive rates based on experience.',
    icon: StarIcon,
  },
  {
    title: 'Book & Pay',
    description: 'Schedule a consultation at your preferred time. Our platform handles secure payments with a simple 15% service fee for platform maintenance.',
    icon: CreditCardIcon,
  },
  {
    title: 'Start Consulting',
    description: 'Connect through video calls or text chat on our secure platform. Get professional guidance and only pay for the time you use.',
    icon: ChatBubbleLeftRightIcon,
  },
];

const features = [
  {
    title: 'Expert-Set Rates',
    description: 'Experts set their own competitive rates based on their experience and market value. No hidden fees or subscriptions required.',
  },
  {
    title: 'Simple Platform Fee',
    description: 'Just 15% platform fee on successful consultations. The rest goes directly to your chosen expert.',
  },
  {
    title: 'Secure Environment',
    description: 'End-to-end encrypted communications, secure payments, and built-in content protection.',
  },
  {
    title: 'Quality Assurance',
    description: 'Verified experts, detailed reviews, and our satisfaction guarantee ensure high-quality consultations.',
  },
];

const HowItWorks: NextPage = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How NexProLink Works
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Connect with experts at their professional rates. Pay only for the time you need, with transparent pricing and no subscriptions.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Steps to Get Started
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Professional consultation in four easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute -top-4 left-6 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="mb-4 mt-2">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Features Section */}
      <div id="pricing" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Transparent Pricing & Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No hidden fees, no subscriptions - just pay for the time you use
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Simple Fee Structure
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Expert's Rate</span>
                <span className="text-gray-900 dark:text-white font-medium">Set by expert</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Platform Fee</span>
                <span className="text-gray-900 dark:text-white font-medium">15% of consultation fee</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-semibold">Total Cost</span>
                  <span className="text-gray-900 dark:text-white font-semibold">Expert rate + 15%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
              >
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
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to Connect with an Expert?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/experts"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Experts
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Learn More About Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
