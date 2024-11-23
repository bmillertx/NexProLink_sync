import { doc, collection, query, where, getDocs, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserProfile } from '@/types/user';
import { performanceService } from '../monitoring/performance.service';
import { errorService } from '../error/error.service';

export interface ExpertProfile extends UserProfile {
  consultationRate: number;
  availability: {
    timezone: string;
    schedule: Record<string, { start: string; end: string }>;
  };
  professionalInfo: {
    title: string;
    specializations: string[];
    experience: number;
    education: Array<{
      degree: string;
      institution: string;
      year: number;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      year: number;
    }>;
  };
  stats?: {
    totalConsultations: number;
    completedConsultations: number;
    averageRating: number;
    totalEarnings: number;
    completionRate: number;
  };
}

class ExpertService {
  private readonly COLLECTION_NAME = 'experts';

  async getExpertProfile(uid: string): Promise<ExpertProfile> {
    const trace = performanceService.startTrace('getExpertProfile');
    try {
      const expertDoc = await getDoc(doc(db, this.COLLECTION_NAME, uid));
      if (!expertDoc.exists()) {
        throw new Error('Expert profile not found');
      }
      return expertDoc.data() as ExpertProfile;
    } catch (error) {
      throw errorService.handleError('Failed to fetch expert profile', error);
    } finally {
      trace?.stop();
    }
  }

  async updateExpertProfile(uid: string, updates: Partial<ExpertProfile>): Promise<void> {
    const trace = performanceService.startTrace('updateExpertProfile');
    try {
      const expertRef = doc(db, this.COLLECTION_NAME, uid);
      await updateDoc(expertRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw errorService.handleError('Failed to update expert profile', error);
    } finally {
      trace?.stop();
    }
  }

  async searchExperts(criteria: {
    specializations?: string[];
    maxRate?: number;
    availability?: string;
  }): Promise<ExpertProfile[]> {
    const trace = performanceService.startTrace('searchExperts');
    try {
      let q = collection(db, this.COLLECTION_NAME);
      
      if (criteria.specializations?.length) {
        q = query(q, where('professionalInfo.specializations', 'array-contains-any', criteria.specializations));
      }
      
      if (criteria.maxRate) {
        q = query(q, where('consultationRate', '<=', criteria.maxRate));
      }

      const querySnapshot = await getDocs(q);
      const experts = querySnapshot.docs.map(doc => doc.data() as ExpertProfile);

      // Filter by availability if specified
      if (criteria.availability) {
        return experts.filter(expert => 
          expert.availability?.schedule?.[criteria.availability!]
        );
      }

      return experts;
    } catch (error) {
      throw errorService.handleError('Failed to search experts', error);
    } finally {
      trace?.stop();
    }
  }

  async getExpertStats(uid: string): Promise<ExpertProfile['stats']> {
    const trace = performanceService.startTrace('getExpertStats');
    try {
      const expertDoc = await getDoc(doc(db, this.COLLECTION_NAME, uid));
      if (!expertDoc.exists()) {
        throw new Error('Expert profile not found');
      }
      
      const expert = expertDoc.data() as ExpertProfile;
      return expert.stats || {
        totalConsultations: 0,
        completedConsultations: 0,
        averageRating: 0,
        totalEarnings: 0,
        completionRate: 0,
      };
    } catch (error) {
      throw errorService.handleError('Failed to fetch expert stats', error);
    } finally {
      trace?.stop();
    }
  }

  async updateExpertAvailability(
    uid: string,
    availability: ExpertProfile['availability']
  ): Promise<void> {
    const trace = performanceService.startTrace('updateExpertAvailability');
    try {
      const expertRef = doc(db, this.COLLECTION_NAME, uid);
      await updateDoc(expertRef, {
        availability,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw errorService.handleError('Failed to update expert availability', error);
    } finally {
      trace?.stop();
    }
  }

  async updateProfessionalInfo(
    uid: string,
    professionalInfo: ExpertProfile['professionalInfo']
  ): Promise<void> {
    const trace = performanceService.startTrace('updateProfessionalInfo');
    try {
      const expertRef = doc(db, this.COLLECTION_NAME, uid);
      await updateDoc(expertRef, {
        professionalInfo,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw errorService.handleError('Failed to update professional info', error);
    } finally {
      trace?.stop();
    }
  }
}

export const expertService = new ExpertService();
