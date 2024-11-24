import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  UserGroupIcon,
  VideoCameraIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { format, parseISO, subDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useRouter } from 'next/router';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Dynamically import Chart components with no SSR
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  ssr: false,
});

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isExpert } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalConsultations: 0,
    averageRating: 0,
    completionRate: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [earningsData, setEarningsData] = useState({
    labels: [],
    datasets: [],
  });
  const [reviewsData, setReviewsData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for auth to initialize
        if (authLoading) {
          setLoading(true);
          return;
        }

        // Redirect if not authenticated
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        // Check for user profile
        if (!profile) {
          console.error('No user profile found');
          setError('Unable to load user profile. Please try signing in again.');
          setLoading(false);
          return;
        }

        // Load dashboard data
        await fetchDashboardData();
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An error occurred while loading the dashboard.');
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, profile, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch consultations
      const consultationsRef = collection(db, 'consultations');
      const consultationsQuery = query(
        consultationsRef,
        where(isExpert ? 'expertId' : 'clientId', '==', user?.uid),
        orderBy('scheduledAt', 'desc'),
        limit(5)
      );

      const consultationsSnapshot = await getDocs(consultationsQuery);
      const consultations = consultationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update state with fetched data
      setRecentConsultations(consultations);
      
      // Calculate basic stats
      if (consultations.length > 0) {
        const completed = consultations.filter(c => c.status === 'completed').length;
        const total = consultations.length;
        
        setStats(prev => ({
          ...prev,
          totalConsultations: total,
          completionRate: (completed / total) * 100,
        }));
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => router.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <VideoCameraIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Consultations
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalConsultations}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completion Rate
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completionRate.toFixed(1)}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {isExpert && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <StarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Average Rating
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.averageRating.toFixed(1)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Recent Consultations</h2>
          <div className="mt-4">
            {recentConsultations.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {recentConsultations.map((consultation: any) => (
                    <li key={consultation.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-primary truncate">
                            {consultation.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              consultation.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {consultation.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {format(new Date(consultation.scheduledAt), 'PPp')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent consultations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
