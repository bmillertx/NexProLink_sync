import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import AdminNav from '@/components/admin/AdminNav';

interface ExpertProfile {
  uid: string;
  email: string;
  displayName: string;
  status: 'pending' | 'approved' | 'rejected';
  professionalTitle?: string;
  yearsOfExperience?: number;
  bio?: string;
  specialties?: string[];
  createdAt: any;
}

export default function AdminExperts() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperts = async () => {
      if (!user || !profile || profile.role !== 'admin') {
        router.push('/');
        return;
      }

      try {
        setLoading(true);
        const expertsRef = collection(db, 'users');
        const expertsQuery = query(expertsRef, where('userType', '==', 'expert'));
        const expertsSnapshot = await getDocs(expertsQuery);
        
        const expertsList: ExpertProfile[] = [];
        expertsSnapshot.forEach((doc) => {
          expertsList.push({ uid: doc.id, ...doc.data() } as ExpertProfile);
        });
        
        setExperts(expertsList.sort((a, b) => 
          a.status === 'pending' ? -1 : b.status === 'pending' ? 1 : 0
        ));
      } catch (err) {
        console.error('Error fetching experts:', err);
        setError('Failed to load experts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [user, profile, router]);

  const handleUpdateStatus = async (expertId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // Update user document
      const userRef = doc(db, 'users', expertId);
      await updateDoc(userRef, {
        status: newStatus,
        isVerified: newStatus === 'approved',
        updatedAt: new Date(),
      });

      // Update expert document
      const expertRef = doc(db, 'experts', expertId);
      await updateDoc(expertRef, {
        status: newStatus,
        isVerified: newStatus === 'approved',
        updatedAt: new Date(),
      });

      // Update local state
      setExperts(experts.map(expert => 
        expert.uid === expertId 
          ? { ...expert, status: newStatus, isVerified: newStatus === 'approved' }
          : expert
      ));
    } catch (err) {
      console.error('Error updating expert status:', err);
      setError('Failed to update expert status. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile || profile.role !== 'admin') {
    return null;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Expert Verification
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {experts.map((expert) => (
              <li key={expert.uid} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {expert.displayName}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <p>Email: {expert.email}</p>
                      <p>Title: {expert.professionalTitle || 'Not specified'}</p>
                      <p>Experience: {expert.yearsOfExperience || 0} years</p>
                      <p>Status: <span className={`font-medium ${
                        expert.status === 'approved' ? 'text-green-600' :
                        expert.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>{expert.status}</span></p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {expert.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(expert.uid, 'approved')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(expert.uid, 'rejected')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
