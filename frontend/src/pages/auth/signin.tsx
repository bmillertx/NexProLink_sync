import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';

export default function SignIn() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthForm mode="signin" />
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link 
            href="/auth/signup" 
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
