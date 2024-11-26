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
  createdAt: Timestamp;
  amount?: number;
  rating?: number;
}

export default function ConsultantDashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !profile) {
        router.push('/auth/signin');
        return;
      }

      // Updated role check to match Firebase user data
      if (profile.role !== 'consultant' || !profile.isApproved || profile.status !== 'active') {
        console.error('Access denied: Invalid role or status', { role: profile.role, isApproved: profile.isApproved, status: profile.status });
        router.push('/dashboard');
        return;
      }

      // Fetch consultant's consultations
      const fetchConsultations = async () => {
        try {
          const q = query(
            collection(db, 'consultations'),
            where('consultantId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(5)
          );

          const querySnapshot = await getDocs(q);
          const consultationsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Consultation[];

          setConsultations(consultationsData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching consultations:', err);
          setError('Failed to load consultations');
          setLoading(false);
        }
      };

      fetchConsultations();
    }
  }, [user, profile, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.displayName}</h1>
        <p className="text-gray-500">Manage your consultations and client appointments</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Consultations"
          value={consultations.length}
          icon={<ChartBarIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Active Consultations"
          value={consultations.filter(c => c.status === 'active').length}
          icon={<ClockIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Completed Consultations"
          value={consultations.filter(c => c.status === 'completed').length}
          icon={<CheckCircleIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Average Rating"
          value={calculateAverageRating(consultations)}
          icon={<StarIcon className="h-6 w-6" />}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Consultations</h2>
          <button
            onClick={() => router.push('/consultant/schedule')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Set Availability
          </button>
        </div>
        <div className="space-y-4">
          {consultations.length > 0 ? (
            consultations.map(consultation => (
              <ConsultationItem key={consultation.id} consultation={consultation} />
            ))
          ) : (
            <p className="text-gray-500">No consultations found</p>
          )}
        </div>
      </div>
    </div>
  );
}

function calculateAverageRating(consultations: Consultation[]): string {
  const ratingsCount = consultations.filter(c => c.rating).length;
  if (ratingsCount === 0) return 'N/A';
  
  const totalRating = consultations.reduce((sum, c) => sum + (c.rating || 0), 0);
  return (totalRating / ratingsCount).toFixed(1);
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="bg-blue-100 rounded-md p-3">
            {icon}
          </div>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ConsultationItem({ consultation }: { consultation: Consultation }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{consultation.title}</h3>
          <p className="text-sm text-gray-500">
            Created {new Date(consultation.createdAt.seconds * 1000).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {consultation.rating && (
            <span className="flex items-center text-sm text-yellow-600">
              <StarIcon className="h-5 w-5 mr-1" />
              {consultation.rating}
            </span>
          )}
          <span className={`px-2 py-1 text-sm rounded-full ${
            consultation.status === 'active' ? 'bg-green-100 text-green-800' :
            consultation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {consultation.status}
          </span>
        </div>
      </div>
    </div>
  );
}
