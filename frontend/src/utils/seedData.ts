import { db } from '@/config/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

interface TestData {
  consultations: any[];
  reviews: any[];
  earnings: any[];
  notifications: any[];
}

const generateTestData = (expertId: string): TestData => {
  const now = new Date();
  const clientIds = ['client1', 'client2', 'client3', 'client4', 'client5'];
  const clientNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'];
  const topics = [
    'React Performance Optimization',
    'Cloud Architecture Design',
    'Mobile App Development',
    'API Design Best Practices',
    'Database Optimization',
    'Security Implementation',
    'DevOps Pipeline Setup',
    'Code Review Session'
  ];

  const consultations = Array.from({ length: 20 }, (_, i) => {
    const clientIndex = i % clientIds.length;
    const date = new Date(now);
    // Distribute consultations between past and future
    date.setDate(date.getDate() + (i < 10 ? -i : i));
    
    return {
      id: `consultation${i}`,
      expertId,
      expertName: 'Test Expert',
      clientId: clientIds[clientIndex],
      clientName: clientNames[clientIndex],
      date: date.toISOString(),
      time: '10:00 AM',
      status: i < 10 ? 'completed' : 'scheduled',
      topic: topics[i % topics.length],
      duration: 60,
      meetingLink: 'https://meet.google.com/test-link',
      amount: 150,
      notes: 'Discussion about project architecture and implementation details.',
      rating: i < 10 ? Math.floor(Math.random() * 2) + 4 : null, // 4 or 5 stars for completed
    };
  });

  const reviews = consultations
    .filter(c => c.status === 'completed' && c.rating)
    .map(c => ({
      id: `review${c.id}`,
      consultationId: c.id,
      expertId,
      clientId: c.clientId,
      clientName: c.clientName,
      rating: c.rating,
      comment: 'Great session! Very knowledgeable and helpful expert.',
      date: c.date,
    }));

  // Generate daily earnings for the past 30 days
  const earnings = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    return {
      id: `earning${i}`,
      expertId,
      date: date.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 400) + 100, // Random amount between 100 and 500
      consultationsCount: Math.floor(Math.random() * 4) + 1, // 1-4 consultations per day
    };
  });

  const notifications = [
    {
      id: 'notif1',
      userId: expertId,
      type: 'new_booking',
      title: 'New Consultation Booked',
      message: 'John Doe has booked a consultation for tomorrow at 10:00 AM',
      date: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      read: false,
    },
    {
      id: 'notif2',
      userId: expertId,
      type: 'review',
      title: 'New Review Received',
      message: 'Sarah Wilson left you a 5-star review',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
    },
    {
      id: 'notif3',
      userId: expertId,
      type: 'earning',
      title: 'Payment Received',
      message: 'You received a payment of $150 for your recent consultation',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
    },
  ];

  return {
    consultations,
    reviews,
    earnings,
    notifications,
  };
};

export const seedTestData = async (expertId: string) => {
  try {
    const data = generateTestData(expertId);
    
    // Seed consultations
    for (const consultation of data.consultations) {
      await setDoc(doc(db, 'consultations', consultation.id), consultation);
    }

    // Seed reviews
    for (const review of data.reviews) {
      await setDoc(doc(db, 'reviews', review.id), review);
    }

    // Seed earnings
    for (const earning of data.earnings) {
      await setDoc(doc(db, 'earnings', earning.id), earning);
    }

    // Seed notifications
    for (const notification of data.notifications) {
      await setDoc(doc(db, 'notifications', notification.id), notification);
    }

    console.log('Test data seeded successfully!');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
};
