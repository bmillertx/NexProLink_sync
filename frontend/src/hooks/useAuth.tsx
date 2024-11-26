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

const ADMIN_EMAIL = 'brian.miller.allen@gmail.com'; // Admin email

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'client' | 'consultant' | 'admin';
  emailVerified: boolean;
  createdAt: any;
  updatedAt: any;
  isApproved?: boolean;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: 'client' | 'consultant' | 'admin') => Promise<void>;
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
      setLoading(true);
      try {
        if (user) {
          // Force refresh token to get latest custom claims
          await user.getIdToken(true);
          const profile = await fetchUserProfile(user.uid);
          
          setUser(user);
          if (profile) {
            setProfile(profile);
            
            // Only redirect to dashboard if on the home page or auth pages
            const currentPath = window.location.pathname;
            if (currentPath === '/' || currentPath.startsWith('/auth')) {
              if (profile.role === 'consultant' && (!profile.isApproved || profile.status !== 'active')) {
                router.push('/consultant/onboarding');
              } else if (profile.role === 'admin') {
                router.push('/admin/dashboard');
              } else {
                router.push('/dashboard');
              }
            }
          } else if (!window.location.pathname.includes('/auth/complete-profile')) {
            // Only redirect to complete profile if not already there
            router.push('/auth/complete-profile');
          }
        } else {
          setUser(null);
          setProfile(null);
          // Only redirect if on a protected route
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/dashboard') || 
              currentPath.startsWith('/consultant') || 
              currentPath.startsWith('/admin')) {
            router.push('/auth/signin');
          }
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signUp = async (email: string, password: string, displayName: string, role: 'client' | 'consultant' | 'admin') => {
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
        updatedAt: serverTimestamp(),
        isApproved: role === 'client' || role === 'admin', // Clients and admins are auto-approved
        status: role === 'consultant' ? 'pending' : 'active'
      };

      await setDoc(doc(db, 'users', user.uid), profile);
      
      // Create customer in Stripe only for clients and consultants
      if (role !== 'admin') {
        await fetch('/api/stripe/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email,
            role
          }),
        });
      }

      setProfile(profile);
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'consultant') {
        router.push('/consultant/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign-up error:', error);
      setError(handleAuthError(error));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      // If admin email but no profile, create it
      if (email === ADMIN_EMAIL && !userSnap.exists()) {
        const adminProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'Admin',
          role: 'admin',
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isApproved: true,
          status: 'active'
        };
        
        await setDoc(userRef, adminProfile);
        setProfile(adminProfile);
        router.push('/admin/dashboard');
        return;
      }
      
      // For existing users, check profile
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        if (userData.role === 'admin') {
          setProfile(userData);
          router.push('/admin/dashboard');
          return;
        }
      }
      
      // Non-admin users are handled by onAuthStateChanged
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
          role: 'client', // Default role for Google sign-in
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isApproved: true,
          status: 'active'
        };

        await setDoc(doc(db, 'users', user.uid), profile);
        
        // Create customer in Stripe
        await fetch('/api/stripe/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email,
            role: 'client'
          }),
        });

        setProfile(profile);
      } else {
        setProfile(existingProfile);
      }
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
      router.push('/');
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
