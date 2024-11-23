import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface Consultation {
  id: string;
  expertId: string;
  expertName: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  topic: string;
  duration: number;
  meetingLink?: string;
}

export default function Consultations() {
  const { user, profile } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;

      try {
        const consultationsRef = collection(db, 'consultations');
        const q = query(
          consultationsRef,
          where(profile?.role === 'consultant' ? 'expertId' : 'clientId', '==', user.uid),
          orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedConsultations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Consultation[];

        setConsultations(fetchedConsultations);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user, profile]);

  const filteredConsultations = consultations.filter(consultation => {
    const consultationDate = new Date(consultation.date);
    const now = new Date();
    return activeTab === 'upcoming' ? consultationDate >= now : consultationDate < now;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`${
                  activeTab === 'upcoming'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`${
                  activeTab === 'past'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Past
              </button>
            </nav>
          </div>
        </div>

        {filteredConsultations.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} consultations</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming consultations scheduled."
                : "You haven't had any consultations yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{consultation.topic}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        with {profile?.role === 'consultant' ? consultation.clientName : consultation.expertName}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        consultation.status === 'scheduled'
                          ? 'bg-green-100 text-green-800'
                          : consultation.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {format(new Date(consultation.date), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {consultation.time} ({consultation.duration} minutes)
                    </div>
                  </div>
                  {consultation.meetingLink && consultation.status === 'scheduled' && (
                    <div className="mt-4">
                      <a
                        href={consultation.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <VideoCameraIcon className="mr-2 h-5 w-5" />
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
