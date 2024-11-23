import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'client' | 'consultant';
  emailVerified: boolean;
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
      const { user } = userCredential;

      // Send email verification
      await sendEmailVerification(user);

      await updateProfile(user, { displayName });

      // Base user profile
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // If user is a consultant, create expert profile
      if (role === 'consultant') {
        const expertProfile = {
          ...userProfile,
          professionalInfo: professionalInfo || {
            title: '',
            specializations: [],
            experience: 0,
          },
          consultationRate: 0,
          availability: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            schedule: {},
          },
        };

        await setDoc(doc(db, 'experts', user.uid), {
          ...expertProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return userProfile;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw this.handleAuthError(error);
    }
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Get user profile including role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userProfile = userDoc.data() as UserProfile;

      // In development, skip email verification
      if (process.env.NODE_ENV !== 'development' && !user.emailVerified) {
        // Only resend verification email if enough time has passed (24 hours)
        const lastEmailSentKey = `lastVerificationEmail_${user.uid}`;
        const lastEmailSent = localStorage.getItem(lastEmailSentKey);
        const now = Date.now();
        
        if (!lastEmailSent || (now - parseInt(lastEmailSent)) > 24 * 60 * 60 * 1000) {
          try {
            await sendEmailVerification(user);
            localStorage.setItem(lastEmailSentKey, now.toString());
          } catch (error: any) {
            console.warn('Could not send verification email:', error);
          }
        }
        
        throw new Error('Please verify your email address before signing in. Check your inbox (and spam folder) for the verification link.');
      }

      // If user is a consultant, get expert profile
      if (userProfile.role === 'consultant') {
        const expertDoc = await getDoc(doc(db, 'experts', user.uid));
        if (!expertDoc.exists()) {
          throw new Error('Expert profile not found');
        }
        return {
          ...userProfile,
          ...expertDoc.data(),
        } as UserProfile;
      }

      return userProfile;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw this.handleAuthError(error);
    }
  }

  async resendVerificationEmail(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async verifyEmail(oobCode: string): Promise<void> {
    try {
      await auth.applyActionCode(oobCode);
      
      // Update user profile in Firestore
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { 
          emailVerified: true,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Force refresh the user to get the latest emailVerified status
        await user.reload();
      }
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
          emailVerified: user.emailVerified,
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

  async getUserProfile(uid: string): Promise<UserProfile> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data() as UserProfile;
      
      // If user is a consultant, fetch additional expert data
      if (userData.role === 'consultant') {
        const expertDoc = await getDoc(doc(db, 'experts', uid));
        if (expertDoc.exists()) {
          return {
            ...userData,
            ...expertDoc.data(),
          };
        }
      }
      
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
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

  private handleAuthError(error: any): Error {
    let message = 'An error occurred during authentication.';
    
    if (error?.code === 'auth/too-many-requests') {
      message = 'Too many attempts. Please try again later.';
    } else if (error?.code === 'auth/user-not-found') {
      message = 'No account found with this email.';
    } else if (error?.code === 'auth/wrong-password') {
      message = 'Invalid password.';
    } else if (error?.code === 'auth/email-already-in-use') {
      message = 'An account already exists with this email.';
    } else if (error?.code === 'auth/invalid-email') {
      message = 'Invalid email address.';
    } else if (error?.code === 'auth/weak-password') {
      message = 'Password should be at least 6 characters.';
    } else if (error?.message) {
      message = error.message;
    }

    return new Error(message);
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
