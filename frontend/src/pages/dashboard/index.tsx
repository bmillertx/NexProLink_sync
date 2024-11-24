import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import dashboardService, { DashboardStats } from '@/services/dashboard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { FaCalendar, FaUsers, FaClock, FaMoneyBillWave } from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      if (authLoading) return;

      if (!user || !profile) {
        router.push('/auth/signin');
        return;
      }

      // Check if email is verified
      if (!user.emailVerified) {
        if (mounted) {
          setError('Please verify your email address to access the dashboard.');
          setLoading(false);
        }
        return;
      }

      // For experts, check if they are verified
      if (profile.userType === 'expert' && !profile.isVerified) {
        if (mounted) {
          setError('Your expert account is pending verification. Please wait for admin approval.');
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const dashboardStats = await dashboardService.getStats(user.uid, profile.userType);
        if (mounted) {
          setStats(dashboardStats);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (mounted) {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, [user, profile, router, authLoading]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert message={error} />
        {!user.emailVerified && (
          <div className="mt-4">
            <button
              onClick={() => router.push('/auth/verify-email')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify Email
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const renderClientDashboard = () => {
    const clientStats = stats.client;
    if (!clientStats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Consultations"
          value={clientStats.totalConsultations}
          icon={<FaCalendar className="h-6 w-6 text-blue-500" />}
        />
        <DashboardCard
          title="Connected Experts"
          value={clientStats.connectedExperts}
          icon={<FaUsers className="h-6 w-6 text-green-500" />}
        />
        <DashboardCard
          title="Upcoming Sessions"
          value={clientStats.upcomingSessions}
          icon={<FaClock className="h-6 w-6 text-yellow-500" />}
        />
        <DashboardCard
          title="Total Spent"
          value={`$${clientStats.totalSpent.toFixed(2)}`}
          icon={<FaMoneyBillWave className="h-6 w-6 text-purple-500" />}
        />
      </div>
    );
  };

  const renderExpertDashboard = () => {
    const expertStats = stats.expert;
    if (!expertStats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Appointments"
          value={expertStats.totalAppointments}
          icon={<FaCalendar className="h-6 w-6 text-blue-500" />}
        />
        <DashboardCard
          title="Active Clients"
          value={expertStats.activeClients}
          icon={<FaUsers className="h-6 w-6 text-green-500" />}
        />
        <DashboardCard
          title="Hours Consulted"
          value={expertStats.hoursConsulted}
          icon={<FaClock className="h-6 w-6 text-yellow-500" />}
        />
        <DashboardCard
          title="Total Earnings"
          value={`$${expertStats.totalEarnings.toFixed(2)}`}
          icon={<FaMoneyBillWave className="h-6 w-6 text-purple-500" />}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {profile.displayName}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's an overview of your {profile.userType === 'client' ? 'consultation' : 'business'} activity
        </p>
      </div>

      {profile.userType === 'client' ? renderClientDashboard() : renderExpertDashboard()}
    </div>
  );
}
