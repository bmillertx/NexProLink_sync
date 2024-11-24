import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface DashboardStats {
  client?: {
    totalConsultations: number;
    connectedExperts: number;
    upcomingSessions: number;
    totalSpent: number;
  };
  expert?: {
    totalAppointments: number;
    activeClients: number;
    hoursConsulted: number;
    totalEarnings: number;
  };
}

class DashboardService {
  async getStats(userId: string, userType: 'client' | 'expert'): Promise<DashboardStats> {
    try {
      // First, verify user exists and get their profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      // Get user-specific stats based on their type
      if (userType === 'client') {
        return this.getClientStats(userId);
      } else {
        return this.getExpertStats(userId);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  private async getClientStats(userId: string): Promise<DashboardStats> {
    try {
      // Initialize default stats
      const stats = {
        totalConsultations: 0,
        connectedExperts: 0,
        upcomingSessions: 0,
        totalSpent: 0,
      };

      // Get client's consultations
      const consultationsRef = collection(db, 'consultations');
      const consultationsQuery = query(consultationsRef, where('clientId', '==', userId));
      const consultationsSnapshot = await getDocs(consultationsQuery);
      
      // Calculate consultation stats
      const now = new Date();
      consultationsSnapshot.forEach((doc) => {
        const consultation = doc.data();
        stats.totalConsultations++;
        stats.totalSpent += consultation.fee || 0;
        
        if (consultation.scheduledAt && new Date(consultation.scheduledAt) > now) {
          stats.upcomingSessions++;
        }
      });

      // Get client's connections with experts
      const connectionsRef = collection(db, 'connections');
      const connectionsQuery = query(connectionsRef, where('clientId', '==', userId));
      const connectionsSnapshot = await getDocs(connectionsQuery);
      stats.connectedExperts = connectionsSnapshot.size;

      return { client: stats };
    } catch (error) {
      console.error('Error fetching client stats:', error);
      return {
        client: {
          totalConsultations: 0,
          connectedExperts: 0,
          upcomingSessions: 0,
          totalSpent: 0,
        },
      };
    }
  }

  private async getExpertStats(userId: string): Promise<DashboardStats> {
    try {
      // Initialize default stats
      const stats = {
        totalAppointments: 0,
        activeClients: 0,
        hoursConsulted: 0,
        totalEarnings: 0,
      };

      // Get expert's consultations
      const consultationsRef = collection(db, 'consultations');
      const consultationsQuery = query(consultationsRef, where('expertId', '==', userId));
      const consultationsSnapshot = await getDocs(consultationsQuery);
      
      // Calculate consultation stats
      consultationsSnapshot.forEach((doc) => {
        const consultation = doc.data();
        stats.totalAppointments++;
        stats.totalEarnings += consultation.fee || 0;
        stats.hoursConsulted += consultation.duration || 0;
      });

      // Get expert's connections with clients
      const connectionsRef = collection(db, 'connections');
      const connectionsQuery = query(connectionsRef, where('expertId', '==', userId));
      const connectionsSnapshot = await getDocs(connectionsQuery);
      stats.activeClients = connectionsSnapshot.size;

      return { expert: stats };
    } catch (error) {
      console.error('Error fetching expert stats:', error);
      return {
        expert: {
          totalAppointments: 0,
          activeClients: 0,
          hoursConsulted: 0,
          totalEarnings: 0,
        },
      };
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
