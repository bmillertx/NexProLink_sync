import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { isUserAdmin } from '@/utils/admin-utils';
import LoadingSpinner from '../common/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        const currentPath = router.asPath;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      const adminStatus = await isUserAdmin(user.uid);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        router.push('/');
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, router]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
