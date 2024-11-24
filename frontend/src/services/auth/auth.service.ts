import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: 'client' | 'expert' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  specialties?: string[];
  imageUrl?: string;
}

export const signIn = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await getUserProfile(userCredential.user.uid);
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    return userProfile;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: 'client' | 'expert'
): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      userType: role,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: user.emailVerified,
    };
    
    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return userProfile;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists
    let userProfile = await getUserProfile(user.uid);
    
    if (!userProfile) {
      // Create new profile for Google sign-in users
      userProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        userType: 'client', // Default role for Google sign-in
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: user.emailVerified,
      };
      
      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    return userProfile;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export const resendVerificationEmail = async (user: User): Promise<void> => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};
