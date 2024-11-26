import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const ADMIN_EMAIL = 'brian.miller.allen@gmail.com';

export enum FirebaseAuthError {
  NETWORK_ERROR = 'auth/network-error',
  INVALID_API_KEY = 'auth/invalid-api-key',
  APP_NOT_AUTHORIZED = 'auth/app-not-authorized',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  INTERNAL_ERROR = 'auth/internal-error'
}

export enum UserAccountError {
  USER_NOT_FOUND = 'auth/user-not-found',
  USER_DISABLED = 'auth/user-disabled',
  USER_TOKEN_EXPIRED = 'auth/user-token-expired',
  REQUIRES_RECENT_LOGIN = 'auth/requires-recent-login'
}

export enum EmailAuthError {
  INVALID_EMAIL = 'auth/invalid-email',
  WRONG_PASSWORD = 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',
  INVALID_CREDENTIAL = 'auth/invalid-credential'
}

export function handleAuthError(error: any): string {
  const errorCode = error.code;
  
  switch (errorCode) {
    // Network & Configuration Errors
    case FirebaseAuthError.NETWORK_ERROR:
      return 'Unable to connect to authentication servers. Please check your internet connection.';
    case FirebaseAuthError.INVALID_API_KEY:
      return 'Invalid API configuration. Please contact support.';
    case FirebaseAuthError.APP_NOT_AUTHORIZED:
      return 'Application not authorized to use Firebase Authentication.';
    case FirebaseAuthError.TOO_MANY_REQUESTS:
      return 'Too many unsuccessful attempts. Please try again later.';
    
    // User Account Errors
    case UserAccountError.USER_NOT_FOUND:
      return 'No account found with this email address.';
    case UserAccountError.USER_DISABLED:
      return 'This account has been disabled. Please contact support.';
    case UserAccountError.USER_TOKEN_EXPIRED:
      return 'Your session has expired. Please sign in again.';
    case UserAccountError.REQUIRES_RECENT_LOGIN:
      return 'This operation requires a recent login. Please sign in again.';
    
    // Email/Password Errors
    case EmailAuthError.INVALID_EMAIL:
      return 'Please enter a valid email address.';
    case EmailAuthError.WRONG_PASSWORD:
    case EmailAuthError.INVALID_CREDENTIAL:
      return 'Invalid email or password. Please try again.';
    case EmailAuthError.EMAIL_ALREADY_IN_USE:
      return 'An account already exists with this email address.';
    case EmailAuthError.WEAK_PASSWORD:
      return 'Password should be at least 6 characters long.';
    
    default:
      console.error('Unhandled auth error:', error);
      return 'An unexpected error occurred. Please try again.';
  }
}

export async function validateUserProfile(user: any): Promise<boolean> {
  if (!user) return false;
  
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    // Check if this is the admin email
    if (user.email === ADMIN_EMAIL) {
      if (!userSnap.exists()) {
        // Create admin profile if it doesn't exist
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: 'admin',
          displayName: user.displayName || 'Admin',
          emailVerified: user.emailVerified,
          isApproved: true,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      return true;
    }
    
    if (!userSnap.exists()) return false;
    
    const userData = userSnap.data();
    return userData.role === 'admin' || (userData.isApproved && userData.status === 'active');
  } catch (error) {
    console.error('Profile validation error:', error);
    return false;
  }
}

export async function isUserAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  
  try {
    // First check if it's the admin email
    if (user.email === ADMIN_EMAIL) return true;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;
    
    const userData = userSnap.data();
    return userData.role === 'admin' && userData.isApproved === true;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

export function handleAuthStateChange(
  user: any,
  onSuccess: () => void,
  onError: (error: string) => void
) {
  if (user) {
    validateUserProfile(user)
      .then(isValid => {
        if (!isValid) {
          onError('Profile not found or insufficient permissions. Please sign in again.');
          signOut(auth).catch(error => {
            console.error('Error signing out:', error);
          });
          return;
        }
        onSuccess();
      })
      .catch(error => {
        console.error('Auth state validation error:', error);
        onError('Authentication error. Please try again.');
        signOut(auth).catch(error => {
          console.error('Error signing out:', error);
        });
      });
  }
}
