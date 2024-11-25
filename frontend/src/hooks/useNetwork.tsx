import { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';

type SyncStatus = 'syncing' | 'synced' | 'pending' | 'error';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const db = getFirestore();
    let syncTimeout: NodeJS.Timeout;
    
    // Set syncing status when a write occurs
    const setSyncing = () => {
      setSyncStatus('syncing');
      // Reset to synced after a delay if no other sync events occur
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => setSyncStatus('synced'), 2000);
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setSyncing();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(syncTimeout);
    };
  }, []);

  return { isOnline, syncStatus };
}
