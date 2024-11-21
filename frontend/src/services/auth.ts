import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: 'client' | 'expert';
  createdAt: string;
  updatedAt: string;
}

const createUserProfile = async (uid: string, email: string, displayName: string, userType: 'client' | 'expert') => {
  const userProfile: UserProfile = {
    uid,
    email: email || '',
    displayName,
    userType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', uid), userProfile);
  return userProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() as UserProfile : null;
};

export const register = async (email: string, password: string, displayName: string, userType: 'client' | 'expert') => {
  // Validate input
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
  if (!displayName) {
    throw new Error('Display name is required');
  }
  if (userType !== 'client' && userType !== 'expert') {
    throw new Error('Invalid user type');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    await createUserProfile(user.uid, email, displayName, userType);
  } catch (error: any) {
    const errorMessage = error.code === 'auth/email-already-in-use'
      ? 'Email is already registered. Please use a different email or try logging in.'
      : error.message;
    throw new Error(errorMessage);
  }
};

export const verifyAndCreateUserProfile = async (uid: string, email: string) => {
  try {
    console.log('Checking user profile for:', uid);
    const existingProfile = await getUserProfile(uid);
    
    if (!existingProfile) {
      console.log('Creating missing user profile for:', uid);
      await createUserProfile(
        uid,
        email,
        email.split('@')[0], // Use email prefix as display name
        'client' // Default user type
      );
      console.log('User profile created successfully');
    } else {
      console.log('Existing profile found:', existingProfile);
    }
    return true;
  } catch (error) {
    console.error('Error in profile verification:', error);
    return false;
  }
};

export const login = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    console.log('Attempting to sign in with:', { email });
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Sign in successful:', userCredential.user.uid);
    
    // Verify and create profile if needed
    await verifyAndCreateUserProfile(userCredential.user.uid, email);
    
    return userCredential;
  } catch (error: any) {
    console.error('Login error:', error.code, error.message);
    let errorMessage = 'Failed to login';
    switch (error.code) {
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many login attempts. Please try again later or reset your password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format. Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection and try again.';
        break;
      default:
        errorMessage = `Authentication failed: ${error.message}`;
    }
    console.error('Formatted error message:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;
    
    // Check if user profile exists
    const existingProfile = await getUserProfile(user.uid);
    if (!existingProfile) {
      // Create new profile for Google sign-in users
      await createUserProfile(
        user.uid,
        user.email || '',
        user.displayName || 'User',
        'client' // Default to client for Google sign-in
      );
    }
  } catch (error: any) {
    let errorMessage = 'Failed to sign in with Google';
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-in was cancelled';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup was blocked by the browser';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with the same email address';
        break;
      default:
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Failed to log out. Please try again.');
  }
};

export const resetPassword = async (email: string) => {
  if (!email) {
    throw new Error('Email is required');
  }
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    const errorMessage = error.code === 'auth/user-not-found'
      ? 'No account found with this email'
      : error.message;
    throw new Error(errorMessage);
  }
};

export const createTestAccount = async () => {
  const email = 'test@nexprolink.com';
  const password = 'Client123!@#';
  const displayName = 'Test User';
  const userType = 'client' as const;

  try {
    console.log('Creating test account...');
    await register(email, password, displayName, userType);
    console.log('Test account created successfully');
  } catch (error: any) {
    if (error.message.includes('already registered')) {
      console.log('Test account already exists');
    } else {
      console.error('Error creating test account:', error);
      throw error;
    }
  }
};

const authService = {
  login,
  register,
  logout,
  resetPassword,
  googleSignIn,
  getUserProfile,
  verifyAndCreateUserProfile,
  createTestAccount,
};

export default authService;
