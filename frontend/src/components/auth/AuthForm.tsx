import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { validatePassword } from '@/utils/validation';
import { rateLimitService } from '@/services/rate-limit/rate-limit.service';
import { errorService } from '@/services/error/error.service';
import { performanceService } from '@/services/monitoring/performance.service';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, resetPassword, resendVerificationEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'client' as 'client' | 'expert'
  });

  useEffect(() => {
    setError(null);
    setShowVerificationMessage(false);
    setResetSent(false);
    setRegistrationSuccess(false);
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const redirectToSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setShowVerificationMessage(false);
    setRegistrationSuccess(false);

    try {
      if (mode === 'signup' && !formData.displayName.trim()) {
        throw new Error('Please enter your display name');
      }

      if (!formData.email.trim()) {
        throw new Error('Please enter your email address');
      }

      if (!formData.password.trim()) {
        throw new Error('Please enter your password');
      }

      if (mode === 'signup') {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          throw new Error(passwordError);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          throw new Error('Please enter a valid email address');
        }

        try {
          await signUp(
            formData.email,
            formData.password,
            formData.displayName,
            formData.role
          );

          setRegistrationSuccess(true);
          setShowVerificationMessage(true);
          setFormData({
            email: formData.email, // Keep email for convenience
            password: '',
            displayName: '',
            role: 'client'
          });
        } catch (err: any) {
          if (err?.message?.includes('already registered')) {
            setError('This email is already registered. Please try signing in instead.');
            return;
          }
          throw err;
        }
      } else {
        try {
          await signIn(formData.email, formData.password);
        } catch (err: any) {
          if (err?.message?.includes('verify your email')) {
            setShowVerificationMessage(true);
            setError('Please check your email and click the verification link before signing in. If you need a new verification email, please use the "Resend verification email" button below.');
            return;
          }
          throw err;
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      await resendVerificationEmail(formData.email);
      setError('A new verification email has been sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await signInWithGoogle();

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google sign-in error:', err);

      const errorMessage = errorService.parseError(err);
      setError(errorMessage);

      if (err?.code === 'auth/popup-blocked') {
        setError('Please enable popups in your browser and try again. Look for the popup blocker icon in your browser\'s address bar.');
      }

      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Click the Google button to try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await resetPassword(formData.email);
      setResetSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      const errorMessage = errorService.parseError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {registrationSuccess ? 'Registration Successful!' : mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {registrationSuccess ? (
            <div className="text-center space-y-4">
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="block text-lg font-medium">Thank you for registering!</span>
                  <p className="text-sm">Please check your email to verify your account.</p>
                  <p className="text-sm text-gray-500">You will be redirected to the sign-in page in a few seconds...</p>
                </div>
              </div>
              <button
                onClick={redirectToSignIn}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        required
                        value={formData.displayName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign {mode === 'signin' ? 'in' : 'up'} with Google</span>
                  </button>
                </div>
              </div>

              {mode === 'signin' && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isLoading || !formData.email}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {resetSent && (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
                  <span className="block sm:inline">
                    Password reset email sent. Please check your inbox.
                  </span>
                </div>
              )}

              {showVerificationMessage && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded relative">
                  <span className="block sm:inline">
                    Please check your email and click the verification link before signing in. If you need a new verification email, please use the "Resend verification email" button below.
                  </span>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
