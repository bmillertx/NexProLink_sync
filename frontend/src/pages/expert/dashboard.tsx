import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface ExpertStats {
  totalBookings: number;
  completedBookings: number;
  upcomingBookings: number;
  totalEarnings: number;
  monthlyEarnings: number;
  averageRating: number;
  totalReviews: number;
  availabilityHours: number;
}

const ExpertDashboard: NextPage = () => {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ExpertStats>({
    totalBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
    availabilityHours: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchExpertStats = async () => {
      if (!userProfile?.uid) return;

      try {
        // Fetch bookings data
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('expertId', '==', userProfile.uid)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookings = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate booking stats
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(
          booking => booking.status === 'completed'
        ).length;
        const upcomingBookings = bookings.filter(
          booking => booking.status === 'scheduled' && new Date(booking.startTime) > new Date()
        );

        // Calculate earnings
        const totalEarnings = bookings.reduce(
          (sum, booking) => sum + (booking.amount || 0),
          0
        );
        const monthlyEarnings = bookings
          .filter(booking => {
            const bookingDate = new Date(booking.startTime);
            const now = new Date();
            return (
              bookingDate.getMonth() === now.getMonth() &&
              bookingDate.getFullYear() === now.getFullYear()
            );
          })
          .reduce((sum, booking) => sum + (booking.amount || 0), 0);

        // Fetch reviews data
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('expertId', '==', userProfile.uid)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviews = reviewsSnapshot.docs.map(doc => doc.data());
        const totalReviews = reviews.length;
        const averageRating =
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          (totalReviews || 1);

        setStats({
          totalBookings,
          completedBookings,
          upcomingBookings: upcomingBookings.length,
          totalEarnings,
          monthlyEarnings,
          averageRating,
          totalReviews,
          availabilityHours: userProfile.availabilityHours || 0,
        });

        // Set upcoming sessions
        setUpcomingSessions(
          upcomingBookings
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Error fetching expert stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpertStats();
  }, [userProfile?.uid]);

  const statsCards = [
    {
      title: 'Bookings Overview',
      stats: [
        { label: 'Total Bookings', value: stats.totalBookings },
        { label: 'Completed', value: stats.completedBookings },
        { label: 'Upcoming', value: stats.upcomingBookings },
      ],
      icon: CalendarIcon,
      color: 'blue',
    },
    {
      title: 'Earnings',
      stats: [
        { label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}` },
        { label: 'This Month', value: `$${stats.monthlyEarnings.toLocaleString()}` },
      ],
      icon: CurrencyDollarIcon,
      color: 'green',
    },
    {
      title: 'Reviews & Ratings',
      stats: [
        { label: 'Average Rating', value: stats.averageRating.toFixed(1) },
        { label: 'Total Reviews', value: stats.totalReviews },
      ],
      icon: StarIcon,
      color: 'yellow',
    },
  ];

  return (
    <ProtectedRoute requiredRole="expert">
      <DashboardLayout title="Expert Dashboard">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((card) => (
              <div
                key={card.title}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 ${
                  card.color === 'blue'
                    ? 'border-blue-500'
                    : card.color === 'green'
                    ? 'border-green-500'
                    : 'border-yellow-500'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {card.title}
                  </h2>
                  <card.icon
                    className={`h-6 w-6 ${
                      card.color === 'blue'
                        ? 'text-blue-500'
                        : card.color === 'green'
                        ? 'text-green-500'
                        : 'text-yellow-500'
                    }`}
                  />
                </div>
                <div className="space-y-3">
                  {card.stats.map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">{stat.label}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {isLoading ? '...' : stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Upcoming Sessions
            </h2>
            <div className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming sessions scheduled
                </p>
              ) : (
                upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex items-center space-x-4">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Session with {session.clientName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(session.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-500 hover:text-blue-600">
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Availability
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You are currently available for {stats.availabilityHours} hours per week
              </p>
              <button 
                onClick={() => router.push('/expert/availability')}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Update Availability
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Keep your profile updated to attract more clients
              </p>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ExpertDashboard;
