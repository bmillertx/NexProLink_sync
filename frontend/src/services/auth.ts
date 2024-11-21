import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
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

const updateUserProfile = async (userCredential: UserCredential): Promise<UserProfile> => {
  const { user } = userCredential;
  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || '',
    photoURL: user.photoURL || '',
    role: 'client', // Default role
    updatedAt: new Date(),
  };

  if (!userSnapshot.exists()) {
    // New user
    userProfile.createdAt = new Date();
  }

  await setDoc(userRef, {
    ...userProfile,
    createdAt: userProfile.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return userProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      return null;
    }

    const userData = userSnapshot.data() as UserProfile;
    return {
      ...userData,
      createdAt: userData.createdAt ? new Date(userData.createdAt as any) : undefined,
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt as any) : undefined,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  displayName: string,
  userType: 'client' | 'expert'
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Update the user's display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      role: userType,
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return userCredential;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password Reset Error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
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
