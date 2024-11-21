import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  appointments: boolean;
  messages: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  dataSharing: boolean;
}

export interface UserPreferences {
  timezone: string;
  language: string;
  darkMode: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  security: SecuritySettings;
  preferences: UserPreferences;
  updatedAt: string;
}

export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error: any) {
    console.error('Error updating settings:', error);
    throw new Error(error.message || 'Failed to update settings');
  }
};

export const updateNotificationSettings = async (
  userId: string,
  notifications: Partial<NotificationSettings>
) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'settings.notifications': notifications,
      'settings.updatedAt': new Date().toISOString(),
    });
    return true;
  } catch (error: any) {
    console.error('Error updating notification settings:', error);
    throw new Error(error.message || 'Failed to update notification settings');
  }
};

export const updateSecuritySettings = async (
  userId: string,
  security: Partial<SecuritySettings>
) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'settings.security': security,
      'settings.updatedAt': new Date().toISOString(),
    });
    return true;
  } catch (error: any) {
    console.error('Error updating security settings:', error);
    throw new Error(error.message || 'Failed to update security settings');
  }
};

export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'settings.preferences': preferences,
      'settings.updatedAt': new Date().toISOString(),
    });
    return true;
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    throw new Error(error.message || 'Failed to update preferences');
  }
};
