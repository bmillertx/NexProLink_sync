import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Consultation {
  id: string;
  title: string;
  status: string;
  clientId: string;
  consultantId: string;
  createdAt: Timestamp | string;
  amount?: number;
  rating?: number;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'consultant' | 'client';
  emailVerified: boolean;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  status?: string;
  isApproved?: boolean;
  userType?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState({
    totalConsultations: 0,
    completionRate: 0,
    totalEarnings: 0,
    averageRating: 0,
    pendingApprovals: 0,
  });

  const fetchDashboardData = async () => {
    if (!user || !profile) {
      setError('Please complete your profile to access the dashboard');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('User Profile:', profile);
      console.log('Fetching consultations for role:', profile.role);

      const consultationsRef = collection(db, 'consultations');
      let q;

      // Query based on user role
      if (profile.role === 'admin') {
        q = query(
          consultationsRef,
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      } else if (profile.role === 'consultant') {
        // Additional check for consultant approval
        if (!profile.isApproved) {
          setError('Your consultant account is pending approval');
          setLoading(false);
          return;
        }
        
        q = query(
          consultationsRef,
          where('consultantId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      } else {
        q = query(
          consultationsRef,
          where('clientId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      }

      const querySnapshot = await getDocs(q);
      console.log('Query results:', querySnapshot.size);
      
      const fetchedConsultations = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt 
            : new Timestamp(
                Math.floor(new Date(data.createdAt).getTime() / 1000),
                0
              )
        };
      }) as Consultation[];

      console.log('Fetched consultations:', fetchedConsultations);

      setConsultations(fetchedConsultations);

      // Calculate stats
      const completed = fetchedConsultations.filter(c => c.status === 'completed');
      const stats = {
        totalConsultations: fetchedConsultations.length,
        completionRate: fetchedConsultations.length > 0 
          ? Math.round((completed.length / fetchedConsultations.length) * 100)
          : 0,
        totalEarnings: completed.reduce((sum, c) => sum + (c.amount || 0), 0),
        averageRating: completed.length > 0
          ? Math.round(completed.reduce((sum, c) => sum + (c.rating || 0), 0) / completed.length * 10) / 10
          : 0,
        pendingApprovals: profile.role === 'admin' 
          ? fetchedConsultations.filter(c => c.status === 'pending').length 
          : 0
      };

      setStats(stats);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user || !profile) {
      router.replace('/auth/signin');
      return;
    }

    console.log('User:', { 
      uid: user.uid, 
      email: user.email, 
      emailVerified: user.emailVerified 
    });
    console.log('Profile:', profile);

    if (!profile) {
      setLoading(false);
      setError('Please complete your profile to access the dashboard');
      return;
    }

    // Check email verification
    if (!user.emailVerified && profile.role !== 'admin') {
      setError('Please verify your email address to access the dashboard');
      setLoading(false);
      return;
    }

    // Redirect based on role
    if (profile.role === 'consultant') {
      router.push('/dashboard/consultant');
    } else if (profile.role === 'client') {
      router.push('/dashboard/client');
    } else {
      fetchDashboardData().catch(err => {
        console.error('Error in dashboard effect:', err);
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      });
    }
  }, [user, profile, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-3 text-sm text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {profile?.displayName}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Role: {profile?.role} | Status: {profile?.status || (profile?.isApproved ? 'Approved' : 'Pending')}
            </p>
          </div>
          {!user.emailVerified && profile.role !== 'admin' && (
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200">
                Please verify your email to access all features
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Consultations"
            value={stats.totalConsultations}
            icon={<UserGroupIcon className="h-6 w-6" />}
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<CheckCircleIcon className="h-6 w-6" />}
          />
          {profile.role !== 'client' && (
            <StatCard
              title="Total Earnings"
              value={`$${stats.totalEarnings}`}
              icon={<CurrencyDollarIcon className="h-6 w-6" />}
            />
          )}
          <StatCard
            title="Average Rating"
            value={stats.averageRating}
            icon={<StarIcon className="h-6 w-6" />}
          />
          {profile.role === 'admin' && (
            <StatCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              icon={<ClockIcon className="h-6 w-6" />}
            />
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Consultations</h2>
          <div className="mt-4 grid gap-5">
            {consultations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No consultations found.</p>
            ) : (
              consultations.map((consultation) => (
                <ConsultationItem key={consultation.id} consultation={consultation} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-primary-600 dark:text-primary-400">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd className="text-lg font-semibold text-gray-900 dark:text-white">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultationItem({ consultation }: { consultation: Consultation }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {consultation.title || 'Consultation'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Status: {consultation.status}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {consultation.createdAt instanceof Timestamp 
            ? new Date(consultation.createdAt.seconds * 1000).toLocaleDateString()
            : typeof consultation.createdAt === 'string'
              ? new Date(consultation.createdAt).toLocaleDateString()
              : 'Date not available'}
        </div>
      </div>
    </div>
  );
}
