import './test-setup';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { setupTestAccounts, TEST_ACCOUNTS } from './setupTestAuth';

async function testAuthentication() {
  try {
    // First, ensure test accounts exist
    await setupTestAccounts();
    
    const auth = getAuth();
    
    // Test client login
    console.log('\n🔑 Testing client login...');
    const clientCredentials = TEST_ACCOUNTS.client;
    const clientResult = await signInWithEmailAndPassword(
      auth,
      clientCredentials.email,
      clientCredentials.password
    );
    console.log('✅ Client login successful:', clientResult.user.email);
    
    // Sign out before testing expert account
    await auth.signOut();
    
    // Test expert login
    console.log('\n🔑 Testing expert login...');
    const expertCredentials = TEST_ACCOUNTS.expert;
    const expertResult = await signInWithEmailAndPassword(
      auth,
      expertCredentials.email,
      expertCredentials.password
    );
    console.log('✅ Expert login successful:', expertResult.user.email);
    
    // Sign out after tests
    await auth.signOut();
    
    console.log('\n✨ All authentication tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    throw error;
  }
}

// Run the tests
testAuthentication().catch(console.error);
