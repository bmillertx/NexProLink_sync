import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, ChatBubbleLeftRightIcon as ChatAltIcon, ClockIcon, BanknotesIcon as CashIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-500 to-primary-800 animate-gradient-x">
          {/* Animated shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float" />
            <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float delay-150" />
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float delay-300" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              Expert Consultations
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400 mt-2">
                On Your Terms
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-100 mb-12 leading-relaxed">
              Connect with verified professionals for instant consultations. 
              From tech experts to medical advisors, find the right professional for your needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/find-professional"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-primary-600 hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Find a Professional
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/become-contributor"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white/10 transition-all transform hover:scale-105"
              >
                Become a Contributor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Glass Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose NexProLink?
            </h2>
            <p className="text-xl text-gray-300">
              Experience seamless professional consultations with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="absolute -top-8 left-1/2 -ml-8 p-4 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg group-hover:scale-110 transition-transform">
                  <ChatAltIcon className="h-8 w-8 text-white" />
                </div>
                <div className="pt-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Video & Text Chat</h3>
                  <p className="text-gray-300">
                    Choose your preferred consultation method with flexible communication options
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="absolute -top-8 left-1/2 -ml-8 p-4 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg group-hover:scale-110 transition-transform">
                  <ClockIcon className="h-8 w-8 text-white" />
                </div>
                <div className="pt-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Flexible Timing</h3>
                  <p className="text-gray-300">
                    Book consultations that fit your schedule with our time-based pricing
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="absolute -top-8 left-1/2 -ml-8 p-4 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg group-hover:scale-110 transition-transform">
                  <CashIcon className="h-8 w-8 text-white" />
                </div>
                <div className="pt-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Transparent Pricing</h3>
                  <p className="text-gray-300">
                    Clear fee structure with no hidden costs. Pay only for the time you need
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 to-secondary-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals and clients already using NexProLink for their consultation needs
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105"
            >
              Create Your Account
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
