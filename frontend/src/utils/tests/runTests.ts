import { verifyNetworkStatus } from './networkTest';
import { testAuthFlow } from './auth/authTest';
import { testExpertProfileFlow } from './expert/expertProfileTest';
import { testAppointmentFlow } from './appointment/appointmentTest';
import { testErrorBoundaries } from './error/errorBoundaryTest';

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

  // Test Appointment Scheduling
  console.log('\nTesting Appointment Scheduling:');
  const appointmentResults = await testAppointmentFlow();
  if (!appointmentResults.success) {
    console.error('❌ Appointment scheduling tests failed:');
    appointmentResults.errors.forEach(error => console.error(`  - ${error}`));
    allTestsPassed = false;
  } else {
    console.log('✅ Appointment scheduling tests passed successfully');
  }

  // Test Error Boundaries
  console.log('\nTesting Error Boundaries:');
  const errorResults = await testErrorBoundaries();
  if (!errorResults.success) {
    console.error('❌ Error boundary tests failed:');
    errorResults.errors.forEach(error => console.error(`  - ${error}`));
    allTestsPassed = false;
  } else {
    console.log('✅ Error boundary tests passed successfully');
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
