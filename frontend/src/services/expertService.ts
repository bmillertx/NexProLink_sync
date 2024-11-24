import { Expert } from '@/types/expert';
import { mockExperts } from '@/data/mockExperts';
import { db } from '@/config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

class ExpertService {
  private static instance: ExpertService;
  private experts: Expert[] = mockExperts; // Initialize with mock data by default
  private isInitialized = false;
  private isFirebaseAvailable = true;

  private constructor() {}

  public static getInstance(): ExpertService {
    if (!ExpertService.instance) {
      ExpertService.instance = new ExpertService();
    }
    return ExpertService.instance;
  }

  private handleFirebaseError(error: any) {
    console.error('Firebase operation failed:', error);
    this.isFirebaseAvailable = false;
    if (error.code === 'permission-denied' || error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
      console.warn('Firebase access blocked or insufficient permissions, using local data');
    }
    return this.experts;
  }

  async initialize() {
    if (this.isInitialized) return;

    if (!this.isFirebaseAvailable) {
      this.isInitialized = true;
      return;
    }

    try {
      const expertsRef = collection(db, 'experts');
      const q = query(expertsRef, orderBy('rating', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        this.experts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expert[];
      }
      
      this.isInitialized = true;
    } catch (error) {
      this.handleFirebaseError(error);
      this.isInitialized = true;
    }
  }

  async getExperts(): Promise<Expert[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.experts;
  }

  async searchExperts(query: string, filters: any): Promise<Expert[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const filterExperts = (experts: Expert[]) => {
      return experts.filter(expert => {
        const matchesSearch = !query || 
          expert.name.toLowerCase().includes(query.toLowerCase()) ||
          expert.title.toLowerCase().includes(query.toLowerCase()) ||
          expert.expertise.some(skill => skill.toLowerCase().includes(query.toLowerCase()));

        const matchesRating = !filters.rating || expert.rating >= filters.rating;
        const matchesPrice = expert.hourlyRate >= filters.priceRange[0] && 
                           expert.hourlyRate <= filters.priceRange[1];
        const matchesLocation = !filters.location || 
                              expert.location.toLowerCase().includes(filters.location.toLowerCase());

        return matchesSearch && matchesRating && matchesPrice && matchesLocation;
      });
    };

    if (!this.isFirebaseAvailable) {
      return filterExperts(this.experts);
    }

    try {
      const expertsRef = collection(db, 'experts');
      const q = query(expertsRef, orderBy('rating', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expert[];

      return filterExperts(results);
    } catch (error) {
      this.handleFirebaseError(error);
      return filterExperts(this.experts);
    }
  }
}

export const expertService = ExpertService.getInstance();
