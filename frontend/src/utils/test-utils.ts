import { TEST_CREDENTIALS, TEST_BOOKING_SLOTS } from '../config/test-config';

export const testUtils = {
  auth: {
    loginAsExpert: async () => {
      try {
        // Simulated login - replace with actual auth implementation
        const expert = TEST_CREDENTIALS.experts[0];
        return {
          success: true,
          user: {
            ...expert.profile,
            email: expert.email,
            role: expert.role
          }
        };
      } catch (error) {
        console.error('Expert login failed:', error);
        return { success: false, error: 'Login failed' };
      }
    },

    loginAsClient: async () => {
      try {
        // Simulated login - replace with actual auth implementation
        const client = TEST_CREDENTIALS.clients[0];
        return {
          success: true,
          user: {
            ...client.profile,
            email: client.email,
            role: client.role
          }
        };
      } catch (error) {
        console.error('Client login failed:', error);
        return { success: false, error: 'Login failed' };
      }
    }
  },

  booking: {
    getAvailableSlots: async (expertId: string, date: string) => {
      // Simulated API call to get available slots
      return TEST_BOOKING_SLOTS.availableSlots.find(
        slot => slot.date === date
      ) || { date, slots: [] };
    },

    createBooking: async (bookingData: {
      expertId: string;
      clientId: string;
      date: string;
      time: string;
      durationType: string;
      consultationType: string;
    }) => {
      // Simulated booking creation
      console.log('Creating booking:', bookingData);
      return {
        success: true,
        bookingId: `booking-${Date.now()}`,
        ...bookingData
      };
    }
  },

  validation: {
    isValidBooking: (bookingData: {
      date: string;
      time: string;
      durationType: string;
      consultationType: string;
    }) => {
      const { date, time, durationType, consultationType } = bookingData;
      
      // Basic validation
      if (!date || !time || !durationType || !consultationType) {
        return false;
      }

      // Date validation
      const selectedDate = new Date(date);
      const today = new Date();
      if (selectedDate < today) {
        return false;
      }

      return true;
    }
  }
};
