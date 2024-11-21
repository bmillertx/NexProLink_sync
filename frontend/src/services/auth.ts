import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
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
  async register(
    email: string,
    password: string,
    displayName: string,
    userType: 'client' | 'professional'
  ): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
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

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
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
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    console.error('Auth Error:', error);
    if (error.code === 'auth/email-already-in-use') {
      return new Error('Email is already registered');
    }
    if (error.code === 'auth/invalid-email') {
      return new Error('Invalid email address');
    }
    if (error.code === 'auth/operation-not-allowed') {
      return new Error('Operation not allowed');
    }
    if (error.code === 'auth/weak-password') {
      return new Error('Password is too weak');
    }
    if (error.code === 'auth/user-disabled') {
      return new Error('User account has been disabled');
    }
    if (error.code === 'auth/user-not-found') {
      return new Error('User not found');
    }
    if (error.code === 'auth/wrong-password') {
      return new Error('Incorrect password');
    }
    return new Error('Authentication failed');
  }
}

export const authService = new AuthService();
