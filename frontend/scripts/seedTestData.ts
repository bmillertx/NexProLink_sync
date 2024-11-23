import { seedTestData } from '../src/utils/seedData';

// The expert ID from your test account
const TEST_EXPERT_ID = 'test.expert@nexprolink.com';

// Seed the test data
seedTestData(TEST_EXPERT_ID)
  .then(() => {
    console.log('✅ Test data seeded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  });
