import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'client' | 'expert' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/auth/signin');
    }
    return null;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && userProfile?.userType !== requiredRole) {
    if (typeof window !== 'undefined') {
      // Redirect to appropriate dashboard based on user role
      switch (userProfile?.userType) {
        case 'client':
          router.push('/client/dashboard');
          break;
        case 'expert':
          router.push('/expert/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/auth/signin');
      }
    }
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
