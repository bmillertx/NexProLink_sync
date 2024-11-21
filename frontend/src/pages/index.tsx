import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, ChatBubbleLeftRightIcon as ChatAltIcon, ClockIcon, BanknotesIcon as CashIcon } from '@heroicons/react/24/outline';
import TestimonialCarousel from '../components/testimonials/TestimonialCarousel';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen gradient-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8">
              Connect with Expert Professionals
              <span className="block text-primary-400">On Your Terms</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-200 mb-12">
              From electricians to professors, get instant access to verified professionals for personalized consultations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/find-professional"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
              >
                Find a Professional
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/become-contributor"
                className="inline-flex items-center px-8 py-3 border border-primary-400 text-base font-medium rounded-md text-primary-100 hover:bg-primary-800 md:text-lg"
              >
                Become a Contributor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="relative py-20 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-primary-900/20 to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
      <section className="relative py-20 gradient-bg">
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
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
              >
                Create Your Account
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
