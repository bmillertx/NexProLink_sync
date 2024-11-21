import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  userType: 'client' | 'professional';
  createdAt: number;
  isVerified: boolean;
}

class AuthService {
  constructor() {
    // Set up auth state listener in development
    if (process.env.NODE_ENV === 'development') {
      onAuthStateChanged(auth, (user) => {
        console.log('Auth State Changed:', user ? `User logged in: ${user.email}` : 'User logged out');
      });
    }
  }

  private handleError(error: any): Error {
    console.error('Auth Error:', {
      code: error.code,
      message: error.message,
      fullError: error
    });

    switch (error.code) {
      case 'auth/invalid-email':
        return new Error('Invalid email address');
      case 'auth/user-disabled':
        return new Error('This account has been disabled');
      case 'auth/user-not-found':
        return new Error('No account found with this email');
      case 'auth/wrong-password':
        return new Error('Incorrect password');
      case 'auth/invalid-credential':
        return new Error('Invalid email or password');
      default:
        return new Error(error.message || 'An error occurred during authentication');
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      console.log('Attempting login with:', { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user.email);
      return userCredential.user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(
    email: string,
    password: string,
    displayName: string,
    userType: 'client' | 'professional'
  ): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });
      await sendEmailVerification(user);

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        userType,
        createdAt: Date.now(),
        isVerified: false,
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() as UserProfile : null;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const authService = new AuthService();
