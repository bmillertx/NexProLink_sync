import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

interface ProfileFormData {
  displayName: string;
  bio: string;
  expertise?: string[];
  hourlyRate?: number;
  availability?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  phoneNumber: string;
  location: string;
  profileImage?: string;
}

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    bio: '',
    expertise: [],
    hourlyRate: 0,
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    phoneNumber: '',
    location: '',
    profileImage: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        expertise: profile.expertise || [],
        hourlyRate: profile.hourlyRate || 0,
        availability: profile.availability || {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        phoneNumber: profile.phoneNumber || '',
        location: profile.location || '',
        profileImage: profile.profileImage || '',
      });
    }
  }, [profile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const storageRef = ref(storage, `profile-images/${user?.uid}/${file.name}`);

    try {
      setLoading(true);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, profileImage: downloadURL }));
      setMessage({ type: 'success', content: 'Image uploaded successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Failed to upload image.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, formData);
      await refreshProfile();
      setMessage({ type: 'success', content: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleExpertiseChange = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise?.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...(prev.expertise || []), expertise],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

          {message.content && (
            <div
              className={`mb-4 p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.content}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 bg-white shadow rounded-lg p-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-24 w-24 text-gray-300" />
                  )}
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer"
                  >
                    <PencilIcon className="h-4 w-4 text-gray-500" />
                    <input
                      type="file"
                      id="profile-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                  <p className="text-sm text-gray-500">Upload a professional photo for your profile.</p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={formData.displayName}
                    onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Expert-specific fields */}
              {profile?.role === 'consultant' && (
                <>
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        'Web Development',
                        'Mobile Development',
                        'UI/UX Design',
                        'Cloud Architecture',
                        'DevOps',
                        'Data Science',
                        'Machine Learning',
                        'Cybersecurity',
                      ].map(expertise => (
                        <label key={expertise} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.expertise?.includes(expertise)}
                            onChange={() => handleExpertiseChange(expertise)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{expertise}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(formData.availability || {}).map(([day, isAvailable]) => (
                        <label key={day} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                availability: {
                                  ...(prev.availability || {}),
                                  [day]: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
