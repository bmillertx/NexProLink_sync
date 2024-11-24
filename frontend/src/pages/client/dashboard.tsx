import { NextPage } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

const ClientDashboard: NextPage = () => {
  const { userProfile } = useAuth();

  return (
    <ProtectedRoute requiredRole="client">
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Welcome, {userProfile?.displayName}!</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Upcoming Sessions Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-2">
              <p className="text-gray-600">No upcoming sessions</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Book a Session
              </button>
            </div>
          </div>

          {/* Recent Experts Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Experts</h2>
            <div className="space-y-2">
              <p className="text-gray-600">No recent experts</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Find Experts
              </button>
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
            <div className="space-y-2">
              <p className="text-gray-600">No payment methods added</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Payment Method
              </button>
            </div>
          </div>

          {/* Session History Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Session History</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Total Sessions: 0</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                View History
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ClientDashboard;
