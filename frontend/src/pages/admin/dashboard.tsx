import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalExperts: number;
  pendingExperts: number;
  totalClients: number;
  activeClients: number;
  totalBookings: number;
  activeSessions: number;
  totalRevenue: number;
}

const AdminDashboard: NextPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExperts: 0,
    pendingExperts: 0,
    totalClients: 0,
    activeClients: 0,
    totalBookings: 0,
    activeSessions: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch experts data
        const expertsQuery = query(
          collection(db, 'users'),
          where('userType', '==', 'expert')
        );
        const expertsSnapshot = await getDocs(expertsQuery);
        const totalExperts = expertsSnapshot.size;
        const pendingExperts = expertsSnapshot.docs.filter(
          doc => !doc.data().isVerified
        ).length;

        // Fetch clients data
        const clientsQuery = query(
          collection(db, 'users'),
          where('userType', '==', 'client')
        );
        const clientsSnapshot = await getDocs(clientsQuery);
        const totalClients = clientsSnapshot.size;
        const activeClients = clientsSnapshot.docs.filter(
          doc => doc.data().lastLoginAt > Date.now() - 30 * 24 * 60 * 60 * 1000 // Active in last 30 days
        ).length;

        // Fetch bookings data
        const bookingsQuery = query(collection(db, 'bookings'));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const totalBookings = bookingsSnapshot.size;
        const activeSessions = bookingsSnapshot.docs.filter(
          doc => doc.data().status === 'active'
        ).length;

        // Calculate total revenue
        const totalRevenue = bookingsSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().amount || 0),
          0
        );

        setStats({
          totalExperts,
          pendingExperts,
          totalClients,
          activeClients,
          totalBookings,
          activeSessions,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statsCards = [
    {
      title: 'Expert Management',
      stats: [
        { label: 'Total Experts', value: stats.totalExperts },
        { label: 'Pending Approvals', value: stats.pendingExperts },
      ],
      icon: UserGroupIcon,
      buttonText: 'View Experts',
      buttonLink: '/admin/experts',
      color: 'blue',
    },
    {
      title: 'Client Overview',
      stats: [
        { label: 'Total Clients', value: stats.totalClients },
        { label: 'Active Clients', value: stats.activeClients },
      ],
      icon: UserGroupIcon,
      buttonText: 'View Clients',
      buttonLink: '/admin/clients',
      color: 'green',
    },
    {
      title: 'System Analytics',
      stats: [
        { label: 'Total Bookings', value: stats.totalBookings },
        { label: 'Active Sessions', value: stats.activeSessions },
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}` },
      ],
      icon: ChartBarIcon,
      buttonText: 'View Analytics',
      buttonLink: '/admin/analytics',
      color: 'purple',
    },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout title="Admin Dashboard">
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
                    : 'border-purple-500'
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
                        : 'text-purple-500'
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
                <button
                  className={`mt-4 w-full px-4 py-2 text-white rounded transition-colors ${
                    card.color === 'blue'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : card.color === 'green'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {card.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center space-x-4">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      New Expert Registration
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  View
                </button>
              </div>
              {/* Add more activity items here */}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
