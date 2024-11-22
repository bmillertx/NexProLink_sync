import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'client' | 'consultant';
  createdAt: Date;
  updatedAt: Date;
  // Payment Integration Fields
  stripeCustomerId?: string;
  stripeAccountId?: string; // For consultants
  paymentMethods?: {
    default?: string;
    cards?: string[];
  };
  // Consultation Fields
  consultationRate?: number; // For consultants
  availability?: {
    timezone: string;
    schedule?: Record<string, { start: string; end: string }>;
  };
  // Video Service Fields
  videoServiceId?: string;
  videoPreferences?: {
    defaultMicrophoneId?: string;
    defaultCameraId?: string;
    defaultSpeakerId?: string;
  };
  // Professional Info (for consultants)
  professionalInfo?: {
    title?: string;
    specializations?: string[];
    experience?: number;
    education?: Array<{
      degree: string;
      institution: string;
      year: number;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      year: number;
    }>;
  };
}

class AuthService {
  async signUp(
    email: string, 
    password: string, 
    displayName: string, 
    role: 'client' | 'consultant',
    professionalInfo?: UserProfile['professionalInfo']
  ): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        photoURL: user.photoURL || undefined,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Add professional info if consultant
        ...(role === 'consultant' && professionalInfo && { professionalInfo }),
        // Add default timezone
        availability: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      await this.createUserProfile(userProfile);
      
      // If consultant, initiate Stripe account creation (to be implemented)
      if (role === 'consultant') {
        // TODO: Implement Stripe connect account creation
        // await this.createStripeConnectAccount(userProfile);
      }

      return userProfile;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return await this.getUserProfile(userCredential.user.uid);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signInWithGoogle(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists
      const userProfile = await this.getUserProfile(user.uid);
      if (!userProfile) {
        // Create new profile if first time
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || undefined,
          role: 'client', // Default role for Google sign-in
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.createUserProfile(newProfile);
        return newProfile;
      }
      return userProfile;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  private async createUserProfile(profile: UserProfile): Promise<void> {
    const userRef = doc(db, 'users', profile.uid);
    
    // Create Stripe customer for all users (to be implemented)
    // const stripeCustomerId = await this.createStripeCustomer(profile);
    
    await setDoc(userRef, {
      ...profile,
      // stripeCustomerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async getUserProfile(uid: string): Promise<UserProfile> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User profile not found');
    }
    
    return userSnap.data() as UserProfile;
  }

  private handleAuthError(error: any): Error {
    console.error('Auth Error:', error);
    
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Operation not allowed.',
      'auth/weak-password': 'Password is too weak.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
    };

    return new Error(errorMessages[error.code] || error.message || 'Authentication failed');
  }

  // Placeholder for Stripe integration
  private async createStripeCustomer(profile: UserProfile): Promise<string> {
    // TODO: Implement Stripe customer creation
    throw new Error('Not implemented');
  }

  private async createStripeConnectAccount(profile: UserProfile): Promise<string> {
    // TODO: Implement Stripe connect account creation
    throw new Error('Not implemented');
  }
}

export const authService = new AuthService();
