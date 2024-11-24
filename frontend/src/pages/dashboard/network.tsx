import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface NetworkMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  rating: number;
  imageUrl: string;
  status: 'active' | 'pending' | 'inactive';
  lastInteraction: string;
}

export default function NetworkPage() {
  const { profile } = useAuth();
  const [members, setMembers] = useState<NetworkMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMembers = async () => {
      // Simulated API response
      const mockMembers: NetworkMember[] = profile?.userType === 'expert' ? [
        {
          id: '1',
          name: 'John Smith',
          role: 'Client',
          rating: 5,
          imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
          status: 'active',
          lastInteraction: '2024-01-10'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          role: 'Client',
          rating: 4,
          imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
          status: 'active',
          lastInteraction: '2024-01-09'
        }
      ] : [
        {
          id: '1',
          name: 'Dr. Emily Wilson',
          role: 'Expert',
          specialty: 'Business Strategy',
          rating: 5,
          imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
          status: 'active',
          lastInteraction: '2024-01-10'
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          role: 'Expert',
          specialty: 'Financial Planning',
          rating: 5,
          imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
          status: 'active',
          lastInteraction: '2024-01-08'
        }
      ];

      setMembers(mockMembers);
      setLoading(false);
    };

    fetchMembers();
  }, [profile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {profile?.userType === 'expert' ? 'My Clients' : 'My Experts'}
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="relative bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.specialty || member.role}
                        </p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < member.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            member.status
                          )}`}
                        >
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Last interaction: {member.lastInteraction}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Schedule Meeting
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
