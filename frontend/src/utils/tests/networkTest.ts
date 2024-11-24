import { networkService } from '@/services/network/network.service';

export async function testNetworkIntegration() {
  let errors: string[] = [];
  
  try {
    // Test 1: Network Status Observable
    const networkStatus = await new Promise(resolve => {
      const subscription = networkService.getNetworkStatus$().subscribe(status => {
        subscription.unsubscribe();
        resolve(status);
      });
    });
    
    if (!['online', 'offline'].includes(networkStatus as string)) {
      errors.push('Network status must be either "online" or "offline"');
    }

    // Test 2: Sync Status Observable
    const syncStatus = await new Promise(resolve => {
      const subscription = networkService.getSyncStatus$().subscribe(status => {
        subscription.unsubscribe();
        resolve(status);
      });
    });
    
    if (!['synced', 'syncing', 'pending'].includes(syncStatus as string)) {
      errors.push('Sync status must be one of: "synced", "syncing", "pending"');
    }

    // Test 3: Pending Changes Count Observable
    const pendingCount = await new Promise(resolve => {
      const subscription = networkService.getPendingChangesCount$().subscribe(count => {
        subscription.unsubscribe();
        resolve(count);
      });
    });
    
    if (typeof pendingCount !== 'number') {
      errors.push('Pending changes count must be a number');
    }

    // Test 4: Network Service Instance
    if (!networkService) {
      errors.push('Network service instance not properly initialized');
    }

  } catch (error) {
    errors.push(`Unexpected error during testing: ${error.message}`);
  }

  return {
    success: errors.length === 0,
    errors
  };
}

export async function verifyNetworkStatus() {
  console.log('Running network integration tests...');
  const results = await testNetworkIntegration();
  
  if (results.success) {
    console.log('✅ Network integration tests passed successfully');
    return true;
  } else {
    console.error('❌ Network integration tests failed:');
    results.errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }
}
