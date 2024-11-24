import { NextPage } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AvailabilityManager from '@/components/expert/AvailabilityManager';
import { useRouter } from 'next/router';

const AvailabilityPage: NextPage = () => {
  const router = useRouter();

  const handleClose = () => {
    router.push('/expert/dashboard');
  };

  const handleUpdate = () => {
    // Refresh the dashboard data after updating availability
    router.push('/expert/dashboard');
  };

  return (
    <ProtectedRoute requiredRole="expert">
      <DashboardLayout title="Manage Availability">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AvailabilityManager onClose={handleClose} onUpdate={handleUpdate} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AvailabilityPage;
