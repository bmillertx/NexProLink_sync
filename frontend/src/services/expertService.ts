import { Expert } from '@/types/expert';
import { mockExperts } from '@/data/mockExperts';
import { db } from '@/config/firebase';
import { collection, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';

class ExpertService {
  private static instance: ExpertService;
  private experts: Expert[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ExpertService {
    if (!ExpertService.instance) {
      ExpertService.instance = new ExpertService();
    }
    return ExpertService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Try to fetch from Firebase first
      const expertsRef = collection(db, 'experts');
      const q = query(expertsRef, orderBy('rating', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        this.experts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expert[];
      } else {
        // If no data in Firebase, seed with mock data
        console.log('No experts found in Firebase, seeding with mock data...');
        await this.seedMockData();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing expert service:', error);
      // Fallback to mock data if Firebase fails
      this.experts = mockExperts;
      this.isInitialized = true;
    }
  }

  private async seedMockData() {
    try {
      const expertsRef = collection(db, 'experts');
      
      // Add each mock expert to Firebase
      for (const expert of mockExperts) {
        const { id, ...expertWithoutId } = expert;
        await addDoc(expertsRef, expertWithoutId);
      }

      // Fetch the seeded data
      const q = query(expertsRef, orderBy('rating', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      this.experts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expert[];

    } catch (error) {
      console.error('Error seeding mock data:', error);
      this.experts = mockExperts;
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

    return this.experts.filter(expert => {
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
  }
}

export const expertService = ExpertService.getInstance();
