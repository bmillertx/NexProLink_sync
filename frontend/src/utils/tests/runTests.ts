import { verifyNetworkStatus } from './networkTest';

async function runAllTests() {
  console.log('🔄 Starting system verification...\n');

  // Test Network Status
  console.log('Testing Network Integration:');
  const networkTestsPassed = await verifyNetworkStatus();
  
  if (!networkTestsPassed) {
    console.error('\n❌ System verification failed');
    process.exit(1);
  }

  console.log('\n✅ All system verifications passed successfully');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  });
}

export { runAllTests };
