import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@headlessui/react';
import {
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
  KeyIcon,
  UserIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import {
  updateNotificationSettings,
  updateSecuritySettings,
  updateUserPreferences,
  NotificationSettings,
  SecuritySettings,
  UserPreferences,
} from '@/services/settings';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function SettingsTab() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'email',
      name: 'Email Notifications',
      description: 'Receive email notifications for messages, appointments, and updates',
      enabled: true,
    },
    {
      id: 'sms',
      name: 'SMS Notifications',
      description: 'Receive text messages for important updates and reminders',
      enabled: false,
    },
    {
      id: 'appointments',
      name: 'Appointment Reminders',
      description: 'Get notified about upcoming appointments and schedule changes',
      enabled: true,
    },
    {
      id: 'messages',
      name: 'Message Notifications',
      description: 'Receive notifications for new messages and chat updates',
      enabled: true,
    },
  ]);

  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: '2fa',
      name: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: false,
    },
    {
      id: 'login-alerts',
      name: 'Login Alerts',
      description: 'Get notified of any new login attempts',
      enabled: true,
    },
    {
      id: 'data-sharing',
      name: 'Data Sharing',
      description: 'Share your profile data with trusted partners',
      enabled: false,
    },
  ]);

  const [timeZone, setTimeZone] = useState('America/New_York');
  const [language, setLanguage] = useState('en');

  const handleNotificationToggle = async (settingId: string) => {
    try {
      setLoading(true);
      const updatedSettings = notificationSettings.map(setting =>
        setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
      );
      setNotificationSettings(updatedSettings);

      const notificationUpdate: Partial<NotificationSettings> = {
        [settingId]: !notificationSettings.find(s => s.id === settingId)?.enabled,
      };

      await updateNotificationSettings(user?.uid || '', notificationUpdate);
      toast.success('Notification setting updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityToggle = async (settingId: string) => {
    try {
      setLoading(true);
      const updatedSettings = securitySettings.map(setting =>
        setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
      );
      setSecuritySettings(updatedSettings);

      const securityUpdate: Partial<SecuritySettings> = {
        [settingId === '2fa' ? 'twoFactorAuth' : settingId === 'login-alerts' ? 'loginAlerts' : 'dataSharing']: 
        !securitySettings.find(s => s.id === settingId)?.enabled,
      };

      await updateSecuritySettings(user?.uid || '', securityUpdate);
      toast.success('Security setting updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeZoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setLoading(true);
      setTimeZone(e.target.value);
      
      await updateUserPreferences(user?.uid || '', {
        timezone: e.target.value,
      });
      toast.success('Time zone updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update time zone');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setLoading(true);
      setLanguage(e.target.value);
      
      await updateUserPreferences(user?.uid || '', {
        language: e.target.value,
      });
      toast.success('Language preference updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update language preference');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion logic with proper confirmation
    toast.error('Account deletion is not implemented yet');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Notifications Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center space-x-2 mb-6">
          <BellIcon className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {setting.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={setting.enabled}
                onChange={() => handleNotificationToggle(setting.id)}
                className={`${
                  setting.enabled ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    setting.enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center space-x-2 mb-6">
          <ShieldCheckIcon className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>
        <div className="space-y-4">
          {securitySettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {setting.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={setting.enabled}
                onChange={() => handleSecurityToggle(setting.id)}
                className={`${
                  setting.enabled ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    setting.enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center space-x-2 mb-6">
          <GlobeAltIcon className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className="text-xl font-semibold">Preferences</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="timezone"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Time Zone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={timeZone}
              onChange={handleTimeZoneChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-900'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="language"
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Language
            </label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={handleLanguageChange}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-900'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 border border-red-200`}>
        <div className="flex items-center space-x-2 mb-6">
          <KeyIcon className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Delete Account
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
