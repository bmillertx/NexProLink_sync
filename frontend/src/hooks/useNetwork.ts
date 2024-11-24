import { useState, useEffect } from 'react';
import { networkService } from '@/services/network/network.service';

export interface NetworkState {
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'pending';
  pendingChangesCount: number;
}

export function useNetwork() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: true,
    syncStatus: 'synced',
    pendingChangesCount: 0
  });

  useEffect(() => {
    const networkStatusSubscription = networkService
      .getNetworkStatus$()
      .subscribe(status => {
        setNetworkState(prev => ({
          ...prev,
          isOnline: status === 'online'
        }));
      });

    const syncStatusSubscription = networkService
      .getSyncStatus$()
      .subscribe(status => {
        setNetworkState(prev => ({
          ...prev,
          syncStatus: status
        }));
      });

    const pendingChangesSubscription = networkService
      .getPendingChangesCount$()
      .subscribe(count => {
        setNetworkState(prev => ({
          ...prev,
          pendingChangesCount: count
        }));
      });

    return () => {
      networkStatusSubscription.unsubscribe();
      syncStatusSubscription.unsubscribe();
      pendingChangesSubscription.unsubscribe();
    };
  }, []);

  const manualSync = async () => {
    await networkService.manualSync();
  };

  return {
    ...networkState,
    manualSync
  };
}
