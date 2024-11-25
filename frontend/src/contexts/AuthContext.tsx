import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  serverTimestamp,
  addDoc,
  collection
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { UserProfile } from '@/types/user';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'client' | 'consultant') => Promise<{ success: boolean, message: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setProfile(profileDoc.data() as UserProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to fetch user profile');
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before signing in.');
      }
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile(userData as UserProfile);
        router.push(`/dashboard/${userData.role}`);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: 'client' | 'consultant') => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      
      const userData: UserProfile = {
        uid: userCredential.user.uid,
        email,
        displayName: email.split('@')[0],
        role,
        emailVerified: false,
        status: 'active',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        availability: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      // Create initial consultation
      const consultationData = {
        clientId: role === 'client' ? userCredential.user.uid : null,
        expertId: role === 'consultant' ? userCredential.user.uid : null,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'consultations'), consultationData);
      
      setProfile(userData);
      return { success: true, message: 'Please check your email to verify your account.' };
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email');
      throw err;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    try {
      setError(null);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedProfileDoc = await getDoc(userRef);
      if (updatedProfileDoc.exists()) {
        setProfile(updatedProfileDoc.data() as UserProfile);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
      throw err;
    }
  };

  const reauthenticate = async (password: string) => {
    if (!user || !user.email) throw new Error('No user logged in');
    try {
      setError(null);
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    } catch (err) {
      console.error('Reauthentication error:', err);
      setError('Failed to reauthenticate');
      throw err;
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    reauthenticate
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
