import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import authService, { UserProfile, ExpertRegistrationData } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    userType: 'client' | 'expert',
    expertData?: ExpertRegistrationData
  ) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && auth) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        setUser(user);
        if (user) {
          try {
            const profile = await authService.getUserProfile(user.uid);
            setUserProfile(profile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await authService.login(email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    userType: 'client' | 'expert',
    expertData?: ExpertRegistrationData
  ) => {
    try {
      setError(null);
      await authService.register(email, password, displayName, userType, expertData);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      setError(null);
      await authService.googleSignIn();
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    login,
    register,
    googleSignIn,
    logout,
    resetPassword,
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
