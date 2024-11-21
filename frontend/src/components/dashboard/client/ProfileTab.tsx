import { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  KeyIcon,
  BellIcon,
  CreditCardIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils/styles';
import { useTheme } from '@/context/ThemeContext';
import { updateUserProfile, ProfileData } from '@/services/profile';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface ProfileTabProps {
  profile: Partial<ProfileData>;
}

export default function ProfileTab({ profile: initialProfile }: ProfileTabProps) {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialProfile?.firstName || '',
    lastName: initialProfile?.lastName || '',
    email: initialProfile?.email || '',
    phone: initialProfile?.phone || '',
    title: initialProfile?.title || 'Financial Advisor',
    company: initialProfile?.company || 'NexProLink Financial',
    bio: initialProfile?.bio || 'Experienced financial advisor helping clients achieve their financial goals through personalized strategies and comprehensive planning.',
    location: initialProfile?.location || 'New York, NY',
    experience: initialProfile?.experience || '10+ years',
    education: initialProfile?.education || 'MBA - Finance',
    certifications: initialProfile?.certifications || ['CFP®', 'ChFC®', 'CLU®'],
    languages: initialProfile?.languages || ['English', 'Spanish'],
    website: initialProfile?.website || 'www.nexprolink.com/johndoe',
    linkedin: initialProfile?.linkedin || 'linkedin.com/in/johndoe',
    timezone: initialProfile?.timezone || 'America/New_York',
    notifications: initialProfile?.notifications || {
      email: true,
      sms: true,
      appointments: true,
      messages: true,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field: 'certifications' | 'languages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.uid, formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEditableField = (label: string, name: keyof typeof formData, type: string = 'text') => (
    <div className="mb-4">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name] as string}
          onChange={handleInputChange}
          rows={4}
          className={`w-full rounded-md shadow-sm ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-900'
          } focus:ring-blue-500 focus:border-blue-500`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] as string}
          onChange={handleInputChange}
          className={`w-full rounded-md shadow-sm ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-900'
          } focus:ring-blue-500 focus:border-blue-500`}
        />
      )}
    </div>
  );

  return (
    <div className={`max-w-5xl mx-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Profile Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Profile Photo */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-lg">
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Profile Header Content */}
          <div className="ml-44 flex justify-between items-start pt-4">
            <div>
              <h1 className="text-3xl font-bold">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formData.title}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formData.company} • {formData.location}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderEditableField('First Name', 'firstName')}
              {renderEditableField('Last Name', 'lastName')}
              {renderEditableField('Email', 'email', 'email')}
              {renderEditableField('Phone', 'phone', 'tel')}
              {renderEditableField('Title', 'title')}
              {renderEditableField('Company', 'company')}
              {renderEditableField('Location', 'location')}
              {renderEditableField('Experience', 'experience')}
              {renderEditableField('Education', 'education')}
              {renderEditableField('Website', 'website')}
              {renderEditableField('LinkedIn', 'linkedin')}
              <div className="md:col-span-2">
                {renderEditableField('Bio', 'bio', 'textarea')}
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.certifications.join(', ')}
                  onChange={(e) => handleArrayInputChange('certifications', e.target.value)}
                  className={`w-full rounded-md shadow-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languages.join(', ')}
                  onChange={(e) => handleArrayInputChange('languages', e.target.value)}
                  className={`w-full rounded-md shadow-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bio & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-line`}>
                {formData.bio}
              </p>
            </div>

            {/* Professional Info */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <BriefcaseIcon className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <h3 className="font-medium">Experience</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formData.experience}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AcademicCapIcon className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <h3 className="font-medium">Education</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formData.education}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <KeyIcon className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <h3 className="font-medium">Certifications</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <GlobeAltIcon className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <h3 className="font-medium">Languages</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Settings */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</label>
                  <p className="break-all">{formData.email}</p>
                </div>
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</label>
                  <p className="break-words">{formData.phone}</p>
                </div>
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Website</label>
                  <a
                    href={`https://${formData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 group"
                  >
                    <LinkIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="break-all group-hover:underline">{formData.website}</span>
                  </a>
                </div>
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>LinkedIn</label>
                  <a
                    href={`https://${formData.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 group"
                  >
                    <LinkIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="break-all group-hover:underline">{formData.linkedin}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time Zone</label>
                  <p>{formData.timezone.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notifications</label>
                  <div className="mt-1 space-y-2">
                    {Object.entries(formData.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => {}}
                          disabled={!isEditing}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 capitalize">
                          {key.replace('_', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
