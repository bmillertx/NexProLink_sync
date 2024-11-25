import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { handleAuthError } from '@/utils/auth-errors';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'client' | 'consultant' | 'admin';
  emailVerified: boolean;
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: 'client' | 'consultant') => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          if (profile) {
            setProfile(profile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Error loading user profile');
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string, role: 'client' | 'consultant') => {
    try {
      clearError();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName,
        role,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), profile);
      setProfile(profile);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign-up error:', error);
      setError(handleAuthError(error));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError(handleAuthError(error));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      clearError();
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const existingProfile = await fetchUserProfile(user.uid);
      if (!existingProfile) {
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          role: user.email === 'brian.miller.allen@gmail.com' ? 'admin' : 'client',
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', user.uid), profile);
        setProfile(profile);
      } else {
        setProfile(existingProfile);
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(handleAuthError(error));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      clearError();
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
      router.push('/auth/signin');
    } catch (error: any) {
      console.error('Sign-out error:', error);
      setError(handleAuthError(error));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(handleAuthError(error));
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
