import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'expert' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      if (!user) {
        router.push('/auth/signin');
      } else if (requiredRole && profile?.userType !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = profile?.userType === 'client' ? '/client/dashboard' :
                           profile?.userType === 'expert' ? '/expert/dashboard' :
                           profile?.userType === 'admin' ? '/admin/dashboard' :
                           '/auth/signin';
        router.push(redirectPath);
      }
    }
  }, [user, profile, loading, router, requiredRole]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || (requiredRole && profile?.userType !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
