import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'consultant';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      if (!user) {
        router.push('/auth/signin');
      } else if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = profile?.role === 'client' ? '/client/dashboard' :
                           profile?.role === 'consultant' ? '/consultant/dashboard' :
                           '/auth/signin';
        router.push(redirectPath);
      }
    }
  }, [user, profile, loading, router, requiredRole]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
