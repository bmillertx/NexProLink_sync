import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function ConsultantOnboarding() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) {
    router.replace('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Become a Consultant
          </h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Complete Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tell us about your expertise and experience to get started as a consultant.
              </p>
              {/* Add your onboarding form here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
