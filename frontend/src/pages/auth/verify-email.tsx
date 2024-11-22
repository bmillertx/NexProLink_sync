import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/config/firebase';
import { toast } from 'react-hot-toast';

export default function VerifyEmail() {
  const router = useRouter();
  const { oobCode } = router.query;
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!oobCode || typeof oobCode !== 'string') {
        setError('Invalid verification code');
        setVerifying(false);
        return;
      }

      try {
        await auth.applyActionCode(oobCode);
        toast.success('Email verified successfully!');
        
        // If user is logged in, redirect to dashboard
        if (user) {
          router.push('/dashboard');
        } else {
          router.push('/auth/signin');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setError(error.message || 'Failed to verify email');
      } finally {
        setVerifying(false);
      }
    };

    if (oobCode) {
      verifyEmail();
    }
  }, [oobCode, router, user]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifying your email...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push('/auth/signin')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
