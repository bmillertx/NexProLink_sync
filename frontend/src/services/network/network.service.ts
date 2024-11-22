import { BehaviorSubject } from 'rxjs';
import { offlineSyncManager } from '@/utils/offlineSync';
import { errorService } from '@/services/error/error.service';

export class NetworkService {
  private static instance: NetworkService;
  private networkStatus$ = new BehaviorSubject<'online' | 'offline'>('online');
  private syncStatus$ = new BehaviorSubject<'synced' | 'syncing' | 'pending'>('synced');
  private pendingChangesCount$ = new BehaviorSubject<number>(0);

  private constructor() {
    this.initNetworkListeners();
  }

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  private initNetworkListeners() {
    if (typeof window !== 'undefined') {
      // Listen for online/offline events
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));

      // Set initial status
      this.networkStatus$.next(navigator.onLine ? 'online' : 'offline');
    }
  }

  private async handleNetworkChange(isOnline: boolean) {
    const status = isOnline ? 'online' : 'offline';
    this.networkStatus$.next(status);

    if (isOnline) {
      await this.syncPendingChanges();
    }

    // Notify user of network status change
    this.notifyNetworkChange(status);
  }

  private async syncPendingChanges() {
    try {
      this.syncStatus$.next('syncing');
      
      // Get pending changes count from offlineSyncManager
      const pendingCount = await offlineSyncManager.getPendingOperationsCount();
      this.pendingChangesCount$.next(pendingCount);

      if (pendingCount > 0) {
        // Start sync process
        await offlineSyncManager.syncPendingOperations();
        
        // Update pending count after sync
        const newPendingCount = await offlineSyncManager.getPendingOperationsCount();
        this.pendingChangesCount$.next(newPendingCount);

        if (newPendingCount === 0) {
          this.syncStatus$.next('synced');
          this.notifySyncComplete();
        } else {
          this.syncStatus$.next('pending');
          this.notifySyncIncomplete(newPendingCount);
        }
      } else {
        this.syncStatus$.next('synced');
      }
    } catch (error) {
      this.syncStatus$.next('pending');
      errorService.handleError(error, {
        context: 'network',
        action: 'sync',
      });
    }
  }

  private notifyNetworkChange(status: 'online' | 'offline') {
    const message = status === 'online'
      ? 'You are back online'
      : 'You are offline. Changes will be saved locally and synced when you reconnect.';
    
    // Use your notification system here (e.g., toast or snackbar)
    this.showNotification(message, status);
  }

  private notifySyncComplete() {
    this.showNotification('All changes have been synced successfully', 'success');
  }

  private notifySyncIncomplete(pendingCount: number) {
    this.showNotification(
      `${pendingCount} change${pendingCount > 1 ? 's' : ''} failed to sync. Will retry automatically.`,
      'warning'
    );
  }

  private showNotification(message: string, type: 'success' | 'warning' | 'error' | 'online' | 'offline') {
    // Implement your notification system here
    console.log(`[${type}] ${message}`);
    // Example: toast.show({ message, type });
  }

  // Public methods for components to subscribe to status changes
  public getNetworkStatus$() {
    return this.networkStatus$.asObservable();
  }

  public getSyncStatus$() {
    return this.syncStatus$.asObservable();
  }

  public getPendingChangesCount$() {
    return this.pendingChangesCount$.asObservable();
  }

  // Method to manually trigger sync
  public async manualSync(): Promise<void> {
    if (this.networkStatus$.value === 'online') {
      await this.syncPendingChanges();
    } else {
      this.showNotification('Cannot sync while offline', 'warning');
    }
  }
}

export const networkService = NetworkService.getInstance();
