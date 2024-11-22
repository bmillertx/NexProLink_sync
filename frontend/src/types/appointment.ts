export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
export type AppointmentType = 'video' | 'in-person';

export interface Appointment {
  id?: string;
  clientId: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  date: Date;
  time: string;
  duration: string;
  type: AppointmentType;
  location: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  availability: {
    [key: string]: TimeSlot[];
  };
}

export interface AppointmentFormData {
  date: Date;
  time: string;
  duration: string;
  type: AppointmentType;
  location: string;
  notes?: string;
  expertId: string;
}
