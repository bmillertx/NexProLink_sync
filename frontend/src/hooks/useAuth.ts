import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import authService, { UserProfile } from '@/services/auth/auth.service';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, userType: 'client' | 'expert') => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  resendVerificationEmail: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          const userProfile = await authService.getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            console.error('User exists in Auth but not in Firestore');
            setError(new Error('User profile not found'));
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
    } catch (err) {
      console.error('Error signing in:', err);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, userType: 'client' | 'expert') => {
    try {
      await authService.signUp(email, password, displayName, userType);
    } catch (err) {
      console.error('Error signing up:', err);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      console.error('Error signing in with Google:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.sendPasswordReset(email);
    } catch (err) {
      console.error('Error resetting password:', err);
      throw err;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await authService.resendVerificationEmail();
    } catch (err) {
      console.error('Error resending verification email:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signOut: signOutUser,
        resetPassword,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
