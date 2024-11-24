import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthTestResult {
  success: boolean;
  errors: string[];
}

export async function testAuthFlow(): Promise<AuthTestResult> {
  const errors: string[] = [];
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Test123!@#';

  try {
    // Test 1: User Creation
    console.log('Testing user creation...');
    let userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    if (!userCredential.user) {
      errors.push('Failed to create test user');
    }

    // Test 2: Sign Out
    console.log('Testing sign out...');
    await signOut(auth);
    if (auth.currentUser) {
      errors.push('Failed to sign out user');
    }

    // Test 3: Sign In
    console.log('Testing sign in...');
    userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    if (!userCredential.user) {
      errors.push('Failed to sign in test user');
    }

    // Test 4: User Properties
    console.log('Testing user properties...');
    const user = auth.currentUser;
    if (!user?.email || user.email !== testEmail) {
      errors.push('User email mismatch');
    }

    // Clean up
    await user?.delete();
    await signOut(auth);

  } catch (error: any) {
    errors.push(`Authentication test error: ${error.message}`);
  }

  return {
    success: errors.length === 0,
    errors
  };
}
