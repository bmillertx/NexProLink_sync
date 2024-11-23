import { BehaviorSubject } from 'rxjs';
import { offlineSyncManager } from '@/utils/offlineSync';
import { errorService } from '@/services/error/error.service';
import { rateLimitService } from '@/services/rate-limit/rate-limit.service';

interface RequestConfig extends RequestInit {
  retryCount?: number;
  retryDelay?: number;
  rateLimit?: {
    key: string;
    rule: string;
  };
}

interface QueuedRequest {
  url: string;
  config: RequestConfig;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

export class NetworkService {
  private static instance: NetworkService;
  private networkStatus$ = new BehaviorSubject<'online' | 'offline'>('online');
  private syncStatus$ = new BehaviorSubject<'synced' | 'syncing' | 'pending'>('synced');
  private pendingChangesCount$ = new BehaviorSubject<number>(0);
  private requestQueue: QueuedRequest[] = [];
  private isProcessingQueue = false;
  private maxRetries = 3;
  private baseRetryDelay = 1000; // 1 second

  private constructor() {
    this.initNetworkListeners();
    this.startQueueProcessor();
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
    this.networkStatus$.next(isOnline ? 'online' : 'offline');
    
    if (isOnline) {
      console.log('🌐 Network connection restored');
      this.syncStatus$.next('syncing');
      try {
        await this.processQueue();
        await offlineSyncManager.syncPendingChanges();
        this.syncStatus$.next('synced');
      } catch (error) {
        console.error('Failed to process queue after network restore:', error);
        this.syncStatus$.next('pending');
      }
    } else {
      console.log('📴 Network connection lost');
      this.syncStatus$.next('pending');
    }
  }

  private async processQueue() {
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (!request) break;

      try {
        const result = await this.processRequest(request.url, request.config);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  private async processRequest(url: string, config: RequestConfig): Promise<any> {
    let lastError: Error | null = null;
    const retryCount = config.retryCount || this.maxRetries;
    const retryDelay = config.retryDelay || this.baseRetryDelay;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        // Check rate limits before making request
        if (config.rateLimit) {
          await rateLimitService.checkRateLimit(config.rateLimit.key, config.rateLimit.rule);
        }

        // Add custom headers for request tracking
        const headers = new Headers(config.headers || {});
        headers.set('X-Request-Attempt', attempt.toString());
        headers.set('X-Client-Version', process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0');
        
        const response = await fetch(url, {
          ...config,
          headers
        });

        // Handle rate limiting response headers
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
        
        if (rateLimitRemaining && rateLimitReset && config.rateLimit) {
          rateLimitService.updateRateLimit(
            config.rateLimit.key,
            parseInt(rateLimitRemaining),
            parseInt(rateLimitReset)
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry if it's a client-side error (4xx)
        if (error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Check if we should retry
        if (attempt === retryCount) {
          throw new Error(`Failed after ${retryCount} attempts: ${error.message}`);
        }

        // Handle specific error cases
        if (error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.warn('Request blocked by client, attempting alternative route');
          // Try alternative route or fall back to local cache
          return this.handleBlockedRequest(url, config);
        }

        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Request failed');
  }

  private async handleBlockedRequest(url: string, config: RequestConfig) {
    // If request is blocked, try to use cached data or alternative route
    try {
      // Check if we have cached data
      const cachedData = await this.getCachedData(url);
      if (cachedData) {
        return cachedData;
      }

      // If no cached data, try alternative route
      return await this.tryAlternativeRoute(url, config);
    } catch (error) {
      console.error('Failed to handle blocked request:', error);
      throw error;
    }
  }

  private async getCachedData(url: string) {
    // Implement cache retrieval logic
    return null;
  }

  private async tryAlternativeRoute(url: string, config: RequestConfig) {
    // Implement alternative route logic
    // This could be a different endpoint or a different transport method
    throw new Error('No alternative route available');
  }

  private async startQueueProcessor() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (true) {
      if (this.requestQueue.length === 0) {
        this.isProcessingQueue = false;
        break;
      }

      if (this.networkStatus$.value === 'offline') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const request = this.requestQueue[0];
      try {
        const result = await this.processRequest(request.url, request.config);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      } finally {
        this.requestQueue.shift();
      }
    }
  }

  public async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        url,
        config,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      if (!this.isProcessingQueue) {
        this.startQueueProcessor();
      }
    });
  }

  // Helper methods for common HTTP methods
  public async get<T>(url: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  public async post<T>(url: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  }

  public async put<T>(url: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  }

  public async delete<T>(url: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
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
}

export const networkService = NetworkService.getInstance();
