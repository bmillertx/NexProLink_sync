import { db } from '@/config/firebase';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Expert } from '@/types/expert';

interface ExpertProfileTestResult {
  success: boolean;
  errors: string[];
}

export async function testExpertProfileFlow(): Promise<ExpertProfileTestResult> {
  const errors: string[] = [];
  const testExpertId = `test_expert_${Date.now()}`;

  try {
    // Test 1: Create Expert Profile
    console.log('Testing expert profile creation...');
    const testExpert: Omit<Expert, 'id'> = {
      name: 'Test Expert',
      title: 'Test Title',
      specialization: 'Test Specialization',
      availability: [{
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00'
      }],
      events: [],
      rating: 5,
      totalReviews: 0,
      hourlyRate: 100,
      languages: ['English'],
      expertise: ['Test Expertise'],
      experienceLevel: 'Senior',
      description: 'Test Description',
      location: 'Test Location',
      timezone: 'UTC',
      category: 'Test Category'
    };

    const expertRef = doc(db, 'experts', testExpertId);
    await updateDoc(expertRef, testExpert);

    // Test 2: Read Expert Profile
    console.log('Testing expert profile retrieval...');
    const expertDoc = await getDoc(expertRef);
    if (!expertDoc.exists()) {
      errors.push('Failed to retrieve expert profile');
    }

    // Test 3: Update Expert Profile
    console.log('Testing expert profile update...');
    const updateData = {
      title: 'Updated Test Title',
      hourlyRate: 150
    };
    await updateDoc(expertRef, updateData);

    // Test 4: Verify Update
    const updatedDoc = await getDoc(expertRef);
    const updatedData = updatedDoc.data();
    if (updatedData?.title !== updateData.title || updatedData?.hourlyRate !== updateData.hourlyRate) {
      errors.push('Expert profile update verification failed');
    }

    // Clean up
    await deleteDoc(expertRef);

  } catch (error: any) {
    errors.push(`Expert profile test error: ${error.message}`);
  }

  return {
    success: errors.length === 0,
    errors
  };
}
