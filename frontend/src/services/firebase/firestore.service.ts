import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserProfile } from './auth.service';

// Generic type for Firestore documents
interface FirestoreDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Consultant profile additional fields
export interface ConsultantProfile extends UserProfile {
  consultationRate: number;
  specializations: string[];
  biography: string;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    startYear: number;
    endYear?: number;
    current: boolean;
  }>;
  availability: {
    timezone: string;
    schedule: Record<string, Array<{ start: string; end: string }>>;
  };
}

class FirestoreService {
  private handleTimestamps<T extends DocumentData>(data: WithFieldValue<T>): T {
    return {
      ...data,
      createdAt: data.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as T;
  }

  private handleSnapshot<T extends FirestoreDocument>(
    snapshot: DocumentSnapshot,
    throwIfNotFound: boolean = true
  ): T | null {
    if (!snapshot.exists()) {
      if (throwIfNotFound) {
        throw new Error('Document not found');
      }
      return null;
    }
    return { id: snapshot.id, ...snapshot.data() } as T;
  }

  private handleQuerySnapshot<T extends FirestoreDocument>(
    snapshot: QuerySnapshot
  ): T[] {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  // Generic CRUD operations
  async getDocument<T extends FirestoreDocument>(
    collectionName: string,
    documentId: string,
    throwIfNotFound: boolean = true
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, documentId);
    const snapshot = await getDoc(docRef);
    return this.handleSnapshot<T>(snapshot, throwIfNotFound);
  }

  async queryDocuments<T extends FirestoreDocument>(
    collectionName: string,
    constraints: QueryConstraint[]
  ): Promise<T[]> {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return this.handleQuerySnapshot<T>(snapshot);
  }

  async setDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: WithFieldValue<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, this.handleTimestamps(data));
  }

  async updateDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  }

  // Consultant specific operations
  async getConsultantProfile(userId: string): Promise<ConsultantProfile | null> {
    return this.getDocument<ConsultantProfile>('consultants', userId);
  }

  async updateConsultantProfile(
    userId: string,
    data: Partial<ConsultantProfile>
  ): Promise<void> {
    await this.updateDocument<ConsultantProfile>('consultants', userId, data);
  }

  async searchConsultants(specialization?: string): Promise<ConsultantProfile[]> {
    const constraints: QueryConstraint[] = [];
    
    if (specialization) {
      constraints.push(where('specializations', 'array-contains', specialization));
    }

    return this.queryDocuments<ConsultantProfile>('consultants', constraints);
  }

  // User specific operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.getDocument<UserProfile>('users', userId);
  }

  async updateUserProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<void> {
    await this.updateDocument<UserProfile>('users', userId, data);
  }

  // Error handling wrapper
  private async handleFirestoreError<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      console.error('Firestore Error:', error);
      throw new Error(error.message || 'Database operation failed');
    }
  }
}

export const firestoreService = new FirestoreService();
