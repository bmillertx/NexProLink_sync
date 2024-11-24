import { db } from '@/config/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { NetworkStatus } from '@/types/network';

/**
 * Utility class for handling offline data synchronization
 */
export class OfflineSyncManager {
  private static instance: OfflineSyncManager;
  private networkStatus: NetworkStatus = 'online';
  private pendingOperations: Map<string, any> = new Map();
  private syncInProgress = false;

  private constructor() {
    this.initNetworkListeners();
    this.loadPendingOperations();
  }

  public static getInstance(): OfflineSyncManager {
    if (!OfflineSyncManager.instance) {
      OfflineSyncManager.instance = new OfflineSyncManager();
    }
    return OfflineSyncManager.instance;
  }

  private initNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange('online'));
      window.addEventListener('offline', () => this.handleNetworkChange('offline'));
      this.networkStatus = navigator.onLine ? 'online' : 'offline';
    }
  }

  private async handleNetworkChange(status: NetworkStatus) {
    this.networkStatus = status;
    if (status === 'online' && !this.syncInProgress) {
      await this.syncPendingOperations();
    }
  }

  /**
   * Loads pending operations from localStorage on initialization
   */
  private loadPendingOperations() {
    if (typeof window !== 'undefined') {
      const storedOperations = localStorage.getItem('pendingOperations');
      if (storedOperations) {
        try {
          const operations = JSON.parse(storedOperations);
          this.pendingOperations = new Map(operations);
        } catch (error) {
          console.error('Error loading pending operations:', error);
          // Clear corrupted data
          localStorage.removeItem('pendingOperations');
        }
      }
    }
  }

  /**
   * Adds a pending operation to the queue when offline
   */
  private addPendingOperation(path: string, operation: any) {
    this.pendingOperations.set(path, {
      ...operation,
      timestamp: new Date().toISOString(),
      retryCount: 0
    });
    this.savePendingOperations();
  }

  /**
   * Saves pending operations to localStorage
   */
  private savePendingOperations() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingOperations', JSON.stringify(Array.from(this.pendingOperations.entries())));
    }
  }

  /**
   * Syncs all pending operations when back online
   */
  public async syncPendingOperations() {
    if (this.syncInProgress || this.networkStatus === 'offline') {
      return;
    }

    this.syncInProgress = true;
    const maxRetries = 3;

    try {
      for (const [path, operation] of this.pendingOperations) {
        try {
          if (operation.retryCount >= maxRetries) {
            console.error(`Operation for path ${path} failed after ${maxRetries} retries, skipping`);
            continue;
          }

          const docRef = doc(db, path);
          const serverDoc = await getDoc(docRef);
          
          if (!serverDoc.exists()) {
            // Document doesn't exist on server, create it
            await setDoc(docRef, {
              ...operation.data,
              lastModified: serverTimestamp()
            });
          } else {
            // Document exists, handle conflict resolution
            const serverData = serverDoc.data();
            const mergedData = this.resolveConflict(operation.data, serverData);
            await updateDoc(docRef, {
              ...mergedData,
              lastModified: serverTimestamp()
            });
          }
          
          // Remove from pending operations after successful sync
          this.pendingOperations.delete(path);
        } catch (error) {
          console.error(`Failed to sync operation for path ${path}:`, error);
          // Increment retry count
          operation.retryCount = (operation.retryCount || 0) + 1;
          this.pendingOperations.set(path, operation);
        }
      }
    } finally {
      this.syncInProgress = false;
      this.savePendingOperations();
    }
  }

  /**
   * Resolves conflicts between local and server data
   * Currently uses a "last-write-wins" strategy with some field-level merging
   */
  private resolveConflict(localData: any, serverData: any): any {
    const mergedData = { ...serverData };
    
    // Merge arrays if they exist
    Object.keys(localData).forEach(key => {
      if (Array.isArray(localData[key]) && Array.isArray(serverData[key])) {
        // Merge arrays using unique values
        mergedData[key] = Array.from(new Set([...serverData[key], ...localData[key]]));
      } else if (typeof localData[key] === 'object' && localData[key] !== null) {
        // Deep merge for nested objects
        mergedData[key] = this.resolveConflict(localData[key], serverData[key] || {});
      } else {
        // For primitive fields, use the local value (last-write-wins)
        mergedData[key] = localData[key];
      }
    });

    return mergedData;
  }

  /**
   * Saves data with offline support
   */
  public async saveData(path: string, data: any): Promise<void> {
    try {
      const docRef = doc(db, path);
      if (this.networkStatus === 'online') {
        await setDoc(docRef, {
          ...data,
          lastModified: serverTimestamp()
        });
      } else {
        // Store operation for later sync
        this.addPendingOperation(path, {
          type: 'set',
          data,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      // Store operation for later retry
      this.addPendingOperation(path, {
        type: 'set',
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Updates data with offline support
   */
  public async updateData(path: string, data: any): Promise<void> {
    try {
      const docRef = doc(db, path);
      if (this.networkStatus === 'online') {
        await updateDoc(docRef, {
          ...data,
          lastModified: serverTimestamp()
        });
      } else {
        // Store operation for later sync
        this.addPendingOperation(path, {
          type: 'update',
          data,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating data:', error);
      // Store operation for later retry
      this.addPendingOperation(path, {
        type: 'update',
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Gets the current network status
   */
  public getNetworkStatus(): NetworkStatus {
    return this.networkStatus;
  }

  /**
   * Gets the number of pending operations
   */
  public getPendingOperationsCount(): number {
    return this.pendingOperations.size;
  }

  /**
   * Gets all pending operations
   */
  public getPendingOperations(): Map<string, any> {
    return new Map(this.pendingOperations);
  }

  /**
   * Clears all pending operations
   */
  public clearPendingOperations(): void {
    this.pendingOperations.clear();
    this.savePendingOperations();
  }
}

// Export a singleton instance
export const offlineSyncManager = OfflineSyncManager.getInstance();
