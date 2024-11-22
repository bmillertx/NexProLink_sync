import { useState } from 'react';
import { createTestAccount } from '@/services/auth';
import { useRouter } from 'next/router';

export default function CreateTestAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const createAccount = async (type: 'client' | 'expert') => {
    setLoading(true);
    setError('');
    try {
      const { email, password } = await createTestAccount(type);
      console.log(`Test ${type} account created:`, { email, password });
      // Redirect to dashboard after successful account creation
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating test account:', err);
      setError(err instanceof Error ? err.message : 'Failed to create test account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Create Test Account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => createAccount('client')}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Test Client Account'}
          </button>

          <button
            onClick={() => createAccount('expert')}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Test Expert Account'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Test Account Credentials:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Email: testclient@example.com (for client)</li>
            <li>Password: Test123!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
