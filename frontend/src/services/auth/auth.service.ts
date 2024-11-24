import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: 'client' | 'expert';
  createdAt: any;
  updatedAt: any;
  emailVerified: boolean;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  professionalTitle?: string;
  yearsOfExperience?: number;
  bio?: string;
  hourlyRate?: number;
  credentials?: string[];
  specialties?: string[];
}

class AuthService {
  async createUserProfile(
    user: User,
    displayName: string,
    userType: 'client' | 'expert'
  ): Promise<void> {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      userType,
      emailVerified: user.emailVerified,
      isVerified: userType === 'client', // Clients are auto-verified, experts need approval
      status: userType === 'client' ? 'approved' : 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Create user document
    await setDoc(doc(db, 'users', user.uid), userProfile);

    // If expert, create expert profile
    if (userType === 'expert') {
      await setDoc(doc(db, 'experts', user.uid), {
        ...userProfile,
        professionalTitle: '',
        yearsOfExperience: 0,
        bio: '',
        hourlyRate: 0,
        credentials: [],
        specialties: [],
      });
    }

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName });
  }

  async signUp(
    email: string,
    password: string,
    displayName: string,
    userType: 'client' | 'expert'
  ): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await this.createUserProfile(user, displayName, userType);
      await sendEmailVerification(user);
      return user;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create new profile for Google sign-in (default to client)
        await this.createUserProfile(user, user.displayName || '', 'client');
      }
      
      return user;
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error in sendPasswordReset:', error);
      throw error;
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      console.error('Error in resendVerificationEmail:', error);
      throw error;
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserProfile;

      // If expert, get additional expert data
      if (userData.userType === 'expert') {
        const expertDoc = await getDoc(doc(db, 'experts', uid));
        if (expertDoc.exists()) {
          return { ...userData, ...expertDoc.data() };
        }
      }

      return userData;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
