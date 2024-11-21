import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role?: 'client' | 'expert';
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const login = async (email: string, password: string): Promise<UserCredential> => {
  try {
    console.log('Attempting login with:', { email });
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Create or update user profile in Firestore
    await updateUserProfile(userCredential);
    
    return userCredential;
  } catch (error) {
    console.error('Auth Error:', error);
    throw error;
  }
};

export const googleSignIn = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Create or update user profile in Firestore
    await updateUserProfile(userCredential);
    
    return userCredential;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

const updateUserProfile = async (userCredential: UserCredential) => {
  const { user } = userCredential;
  const userRef = doc(db, 'users', user.uid);
  
  // Check if user profile exists
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    // Create new user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      photoURL: user.photoURL || undefined,
      role: 'client', // Default role
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(userRef, {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else {
    // Update existing profile
    await setDoc(userRef, {
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    }, { merge: true });
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

// Listen to auth state changes
export const initAuthStateListener = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log('Auth State Changed:', user ? 'User logged in' : 'User logged out');
    callback(user);
  });
};

export { auth };
