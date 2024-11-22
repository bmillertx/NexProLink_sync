import Link from 'next/link';
import { useState } from 'react';
import ContactModal from '../modals/ContactModal';

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              NexProLink
            </Link>
            <p className="text-gray-500 dark:text-gray-400">
              Connect with verified professionals for expert consultations.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-500"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <Link href="/admin" className="text-gray-500 dark:text-gray-400 hover:text-primary-500">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/legal/terms-of-service" className="text-gray-500 dark:text-gray-400 hover:text-primary-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} NexProLink. All rights reserved.
          </p>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
