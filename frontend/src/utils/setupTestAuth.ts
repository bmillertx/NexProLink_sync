import authService from '../services/auth';

export async function setupTestAccounts() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Test accounts should only be created in development environment');
    return;
  }

  try {
    // Create test client account
    await authService.createTestAccount('client');
    console.log('✅ Test client account created successfully');

    // Create test expert account
    await authService.createTestAccount('expert');
    console.log('✅ Test expert account created successfully');

  } catch (error) {
    console.error('❌ Error setting up test accounts:', error);
    throw error;
  }
}

// Test account credentials for reference
export const TEST_ACCOUNTS = {
  client: {
    email: 'test.client@nexprolink.com',
    password: 'Test123!@#',
    type: 'client'
  },
  expert: {
    email: 'test.expert@nexprolink.com',
    password: 'Test123!@#',
    type: 'expert'
  }
} as const;
