import { verifyNetworkStatus } from './networkTest';
import { testAuthFlow } from './auth/authTest';
import { testExpertProfileFlow } from './expert/expertProfileTest';

async function runAllTests() {
  console.log('🔄 Starting system verification...\n');
  let allTestsPassed = true;

  // Test Network Status
  console.log('Testing Network Integration:');
  const networkTestsPassed = await verifyNetworkStatus();
  if (!networkTestsPassed) {
    allTestsPassed = false;
  }

  // Test Authentication Flow
  console.log('\nTesting Authentication Flow:');
  const authResults = await testAuthFlow();
  if (!authResults.success) {
    console.error('❌ Authentication tests failed:');
    authResults.errors.forEach(error => console.error(`  - ${error}`));
    allTestsPassed = false;
  } else {
    console.log('✅ Authentication tests passed successfully');
  }

  // Test Expert Profile Management
  console.log('\nTesting Expert Profile Management:');
  const expertResults = await testExpertProfileFlow();
  if (!expertResults.success) {
    console.error('❌ Expert profile tests failed:');
    expertResults.errors.forEach(error => console.error(`  - ${error}`));
    allTestsPassed = false;
  } else {
    console.log('✅ Expert profile tests passed successfully');
  }

  if (!allTestsPassed) {
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
