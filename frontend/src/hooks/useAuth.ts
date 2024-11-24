import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseServices } from '@/config/firebase';
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
    if (typeof window !== 'undefined') {
      const { auth } = getFirebaseServices();
      if (!auth) {
        console.error('Auth is not initialized');
        setLoading(false);
        return;
      }

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
        } catch (error) {
          console.error('Error in auth state change:', error);
          setError(error instanceof Error ? error : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    signIn: authService.login,
    signUp: authService.register,
    signInWithGoogle: authService.googleSignIn,
    signOut: authService.logout,
    resetPassword: authService.resetPassword,
    resendVerificationEmail: authService.resendVerificationEmail,
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
