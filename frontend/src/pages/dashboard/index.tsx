import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { UserProfile } from '@/services/auth';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import ExpertDashboard from '@/components/dashboard/ExpertDashboard';

export default function Dashboard() {
  const { user, userProfile: authUserProfile, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (authUserProfile) {
      setUserProfile(authUserProfile);
    }
  }, [authUserProfile]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {userProfile?.userType === 'expert' ? (
        <ExpertDashboard profile={userProfile} />
      ) : (
        <ClientDashboard profile={userProfile} />
      )}
    </DashboardLayout>
  );
}
