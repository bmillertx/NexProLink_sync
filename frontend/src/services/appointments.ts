import { db } from '@/config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from 'firebase/firestore';

export interface Appointment {
  id?: string;
  clientId: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  date: Date;
  time: string;
  duration: string;
  type: 'video' | 'in-person';
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const appointmentsCollection = 'appointments';

// Mock appointments storage for development
let mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    clientId: 'client-1',
    expertId: 'expert-1',
    expertName: 'Dr. Sarah Chen',
    expertTitle: 'Financial Advisor',
    date: new Date('2024-02-15'),
    time: '10:00 AM',
    duration: '60',
    type: 'video',
    location: 'Video Call',
    status: 'upcoming',
    notes: 'Initial financial planning consultation',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'appointment-2',
    clientId: 'client-1',
    expertId: 'expert-2',
    expertName: 'Michael Rodriguez',
    expertTitle: 'Tax Specialist',
    date: new Date('2024-02-20'),
    time: '02:00 PM',
    duration: '45',
    type: 'video',
    location: 'Video Call',
    status: 'upcoming',
    notes: 'Tax planning session',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const now = new Date();
    const appointmentData = {
      ...appointment,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const newAppointment = {
        id: `appointment-${mockAppointments.length + 1}`,
        ...appointmentData,
        createdAt: now,
        updatedAt: now,
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }

    const docRef = await addDoc(collection(db, appointmentsCollection), appointmentData);
    return { id: docRef.id, ...appointmentData };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const index = mockAppointments.findIndex(apt => apt.id === id);
      if (index !== -1) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          ...updates,
          updatedAt: new Date(),
        };
        return mockAppointments[index];
      }
      throw new Error('Appointment not found');
    }

    const appointmentRef = doc(db, appointmentsCollection, id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    };
    await updateDoc(appointmentRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

export async function deleteAppointment(id: string) {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const index = mockAppointments.findIndex(apt => apt.id === id);
      if (index !== -1) {
        mockAppointments.splice(index, 1);
        return true;
      }
      throw new Error('Appointment not found');
    }

    const appointmentRef = doc(db, appointmentsCollection, id);
    await deleteDoc(appointmentRef);
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}

export async function getClientAppointments(clientId: string) {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return mockAppointments.filter(apt => apt.clientId === clientId);
    }

    const q = query(
      collection(db, appointmentsCollection),
      where('clientId', '==', clientId),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Appointment[];
  } catch (error) {
    console.error('Error getting client appointments:', error);
    throw error;
  }
}

export async function getExpertAppointments(expertId: string) {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return mockAppointments.filter(apt => apt.expertId === expertId);
    }

    const q = query(
      collection(db, appointmentsCollection),
      where('expertId', '==', expertId),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Appointment[];
  } catch (error) {
    console.error('Error getting expert appointments:', error);
    throw error;
  }
}
