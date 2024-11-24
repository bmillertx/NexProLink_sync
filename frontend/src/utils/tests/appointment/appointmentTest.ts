import { db } from '@/config/firebase';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import type { Appointment, AppointmentFormData } from '@/types/appointment';
import { format } from 'date-fns';

interface AppointmentTestResult {
  success: boolean;
  errors: string[];
}

export async function testAppointmentFlow(): Promise<AppointmentTestResult> {
  const errors: string[] = [];
  const testAppointmentId = `test_appointment_${Date.now()}`;
  const testClientId = `test_client_${Date.now()}`;
  const testExpertId = `test_expert_${Date.now()}`;

  try {
    // Test 1: Create Appointment
    console.log('Testing appointment creation...');
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 7); // Schedule for next week

    const testAppointment: Omit<Appointment, 'id'> = {
      clientId: testClientId,
      expertId: testExpertId,
      expertName: 'Test Expert',
      expertTitle: 'Test Title',
      date: appointmentDate,
      time: '14:00',
      duration: '60',
      type: 'video',
      location: 'Online',
      status: 'upcoming',
      notes: 'Test appointment notes',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const appointmentRef = doc(db, 'appointments', testAppointmentId);
    await updateDoc(appointmentRef, testAppointment);

    // Test 2: Read Appointment
    console.log('Testing appointment retrieval...');
    const appointmentDoc = await getDoc(appointmentRef);
    if (!appointmentDoc.exists()) {
      errors.push('Failed to retrieve appointment');
    }

    // Test 3: Update Appointment Status
    console.log('Testing appointment status update...');
    const updateData = {
      status: 'completed' as const,
      updatedAt: new Date()
    };
    await updateDoc(appointmentRef, updateData);

    // Test 4: Verify Update
    const updatedDoc = await getDoc(appointmentRef);
    const updatedData = updatedDoc.data();
    if (updatedData?.status !== updateData.status) {
      errors.push('Appointment status update verification failed');
    }

    // Test 5: Query Appointments by Client
    console.log('Testing appointment querying...');
    const clientAppointmentsQuery = query(
      collection(db, 'appointments'),
      where('clientId', '==', testClientId)
    );
    const clientAppointments = await getDocs(clientAppointmentsQuery);
    if (clientAppointments.empty) {
      errors.push('Failed to query appointments by client');
    }

    // Test 6: Appointment Form Data Validation
    console.log('Testing appointment form data validation...');
    const formData: AppointmentFormData = {
      date: appointmentDate,
      time: '14:00',
      duration: '60',
      type: 'video',
      location: 'Online',
      notes: 'Test notes',
      expertId: testExpertId
    };

    const validationErrors = validateAppointmentForm(formData);
    if (validationErrors.length > 0) {
      errors.push(`Form validation errors: ${validationErrors.join(', ')}`);
    }

    // Clean up
    await deleteDoc(appointmentRef);

  } catch (error: any) {
    errors.push(`Appointment test error: ${error.message}`);
  }

  return {
    success: errors.length === 0,
    errors
  };
}

function validateAppointmentForm(formData: AppointmentFormData): string[] {
  const errors: string[] = [];

  // Date validation
  if (!(formData.date instanceof Date) || isNaN(formData.date.getTime())) {
    errors.push('Invalid date');
  } else if (formData.date < new Date()) {
    errors.push('Cannot schedule appointments in the past');
  }

  // Time validation
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(formData.time)) {
    errors.push('Invalid time format');
  }

  // Duration validation
  const duration = parseInt(formData.duration);
  if (isNaN(duration) || duration <= 0 || duration > 240) {
    errors.push('Invalid duration');
  }

  // Type validation
  if (!['video', 'in-person'].includes(formData.type)) {
    errors.push('Invalid appointment type');
  }

  // Required fields
  if (!formData.expertId) {
    errors.push('Expert ID is required');
  }
  if (!formData.location) {
    errors.push('Location is required');
  }

  return errors;
}
