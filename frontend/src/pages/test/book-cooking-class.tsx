import { useState, useEffect } from 'react';
import { Expert, ExpertEvent, getExpertById } from '@/services/experts';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import BookAppointmentModal from '@/components/dashboard/client/BookAppointmentModal';

export default function BookCookingClass() {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExpertEvent | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadChef = async () => {
      try {
        const chefData = await getExpertById('chef-mario-123');
        setExpert(chefData);
      } catch (err) {
        console.error('Error loading chef:', err);
        setError('Failed to load chef data');
      } finally {
        setLoading(false);
      }
    };

    loadChef();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Not Logged In</h2>
          <p className="mb-4">Please create a test account first.</p>
          <button
            onClick={() => router.push('/test/create-test-account')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Test Account
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <p>Loading chef data...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p>{error || 'Failed to load chef data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Chef Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start space-x-4">
            {expert.imageUrl && (
              <img
                src={expert.imageUrl}
                alt={expert.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{expert.name}</h2>
              <p className="text-gray-600">{expert.title}</p>
              <p className="text-gray-600">{expert.specialization}</p>
              <div className="mt-2 flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 text-gray-600">{expert.rating} ({expert.totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700">{expert.bio}</p>
          </div>
        </div>

        {/* Available Classes */}
        <div className="space-y-6">
          {expert.events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-gray-600 mt-2">{event.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${event.price}</p>
                  <p className="text-sm text-gray-500">
                    {event.type === 'scheduledEvent' ? 'Group Class' : 'Private Session'}
                  </p>
                </div>
              </div>

              {/* Scheduled Event Details */}
              {event.type === 'scheduledEvent' && event.schedules && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Available Sessions:</h4>
                  <div className="space-y-2">
                    {event.schedules.map((schedule, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{formatDate(schedule.startDate)}</p>
                          <p className="text-sm text-gray-600">
                            {formatTime(schedule.startTime)} • {schedule.duration} minutes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {schedule.spotsAvailable} spots available
                          </p>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsModalOpen(true);
                            }}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={schedule.spotsAvailable === 0}
                          >
                            {schedule.spotsAvailable === 0 ? 'Sold Out' : 'Book Now'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flexible Session Details */}
              {event.type === 'flexibleSession' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">
                        Duration: {event.duration} minutes
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Schedule based on Chef's availability
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Private Session
                    </button>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">What You'll Need:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {event.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {expert && selectedEvent && (
        <BookAppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          expert={expert}
          selectedEvent={selectedEvent}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            router.push('/dashboard');
          }}
        />
      )}
    </div>
  );
}
