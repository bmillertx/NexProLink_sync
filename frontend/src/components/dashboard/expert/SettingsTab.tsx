import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  BellIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CreditCardIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts';
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
}

export default function SettingsTab() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    allowMessages: true,
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (
    key: keyof PrivacySettings,
    value: string | boolean
  ) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6">
      {/* Theme Settings */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6 mb-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isDarkMode ? (
              <MoonIcon className="h-6 w-6 text-blue-400 mr-3" />
            ) : (
              <SunIcon className="h-6 w-6 text-blue-600 mr-3" />
            )}
            <div>
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Theme
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Choose your preferred theme
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6 mb-6`}
      >
        <div className="flex items-center mb-4">
          <BellIcon
            className={`h-6 w-6 mr-3 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Notifications
          </h2>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
            >
              <div>
                <h3
                  className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Receive {key} notifications for important updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={() =>
                    handleNotificationChange(key as keyof NotificationSettings)
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6 mb-6`}
      >
        <div className="flex items-center mb-4">
          <LockClosedIcon
            className={`h-6 w-6 mr-3 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Privacy
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3
                className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Profile Visibility
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Control who can see your profile
              </p>
            </div>
            <select
              value={privacy.profileVisibility}
              onChange={(e) =>
                handlePrivacyChange('profileVisibility', e.target.value)
              }
              className={`rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                isDarkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900'
              }`}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </select>
          </div>

          {Object.entries(privacy)
            .filter(([key]) => key !== 'profileVisibility')
            .map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <div>
                  <h3
                    className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {key.includes('show')
                      ? `Show your ${key.replace('show', '').toLowerCase()} to others`
                      : `Allow others to send you messages`}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value as boolean}
                    onChange={() =>
                      handlePrivacyChange(key as keyof PrivacySettings, !value)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
