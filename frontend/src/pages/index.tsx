import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRightIcon, ChatBubbleLeftRightIcon as ChatAltIcon, ClockIcon, BanknotesIcon as CashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import TestimonialCarousel from '../components/testimonials/TestimonialCarousel';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/context/AuthContext';

// Mock data for online contributors
const onlineContributors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Psychiatrist",
    specialty: "Cognitive Behavioral Therapy",
    rating: 4.9,
    reviews: 128,
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    status: "Available",
    nextSlot: "In 15 mins",
    rate: "$150/hour",
    badges: ["Top Rated", "Verified"],
  },
  {
    id: 2,
    name: "Robert Mitchell",
    role: "Financial Advisor",
    specialty: "Investment Planning",
    rating: 4.8,
    reviews: 95,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "Available",
    nextSlot: "In 30 mins",
    rate: "$120/hour",
    badges: ["Expert", "Verified"],
  },
  {
    id: 3,
    name: "Maria Garcia",
    role: "Immigration Lawyer",
    specialty: "Visa Applications",
    rating: 5.0,
    reviews: 156,
    image: "https://randomuser.me/api/portraits/women/42.jpg",
    status: "Available",
    nextSlot: "Now",
    rate: "$180/hour",
    badges: ["Top Rated", "Featured"],
  },
  {
    id: 4,
    name: "Prof. James Wilson",
    role: "Mathematics Tutor",
    specialty: "Advanced Calculus",
    rating: 4.9,
    reviews: 203,
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    status: "Available",
    nextSlot: "In 45 mins",
    rate: "$75/hour",
    badges: ["PhD", "Verified"],
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "Career Coach",
    specialty: "Executive Development",
    rating: 4.8,
    reviews: 167,
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    status: "Available",
    nextSlot: "In 20 mins",
    rate: "$100/hour",
    badges: ["Certified", "Featured"],
  },
  {
    id: 6,
    name: "Dr. Michael Lee",
    role: "Nutritionist",
    specialty: "Sports Nutrition",
    rating: 4.9,
    reviews: 142,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    status: "Available",
    nextSlot: "Now",
    rate: "$90/hour",
    badges: ["PhD", "Verified"],
  }
];

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('signup');
  const { user } = useAuth();

  const handleAuthClick = (view: 'login' | 'signup') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] gradient-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
              Connect with Expert Professionals
              <span className="block text-primary-400">On Your Terms</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-200 mb-6">
              From electricians to professors, get instant access to verified professionals for personalized consultations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <button
                  onClick={() => window.location.href = '/find-professional'}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
                >
                  Find a Professional
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => handleAuthClick('signup')}
                className="inline-flex items-center px-8 py-3 border border-primary-400 text-base font-medium rounded-md text-primary-100 hover:bg-primary-800 md:text-lg"
              >
                Become a Contributor
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Online Contributors Section */}
      <section className="py-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-4">
                Online Contributors
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Connect with our verified professionals ready to help you right now
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {onlineContributors.map((contributor, index) => (
              <motion.div
                key={contributor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={contributor.image}
                        alt={contributor.name}
                        fill
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1">
                        <div className="flex items-center">
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {contributor.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contributor.role}
                      </p>
                      <p className="text-xs text-primary-600 dark:text-primary-400">
                        {contributor.specialty}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {contributor.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {contributor.reviews} reviews
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {contributor.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                      >
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {contributor.rate}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Next available: {contributor.nextSlot}
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.href = `/book/${contributor.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Why Choose NexProLink?
              </h2>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                Experience seamless professional consultations with our cutting-edge platform.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <div className="absolute top-0 -mt-8 left-1/2 -ml-8 bg-primary-500 rounded-full p-4">
                <ChatAltIcon className="h-8 w-8 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Video & Text Chat</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose your preferred consultation method with flexible communication options.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <div className="absolute top-0 -mt-8 left-1/2 -ml-8 bg-primary-500 rounded-full p-4">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Flexible Timing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Book consultations that fit your schedule with our time-based pricing.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <div className="absolute top-0 -mt-8 left-1/2 -ml-8 bg-primary-500 rounded-full p-4">
                <CashIcon className="h-8 w-8 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transparent Pricing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Clear fee structure with no hidden costs. Pay only for the time you need.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-10 bg-gray-50 dark:bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-primary-900/20 to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied professionals who have transformed their practice with NexProLink
            </p>
          </div>
          
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-10 gradient-bg">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-8">
              Ready to Get Started?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => handleAuthClick('signup')}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
              >
                Create Your Account
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </div>
  );
}
