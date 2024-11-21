export const TEST_CREDENTIALS = {
  experts: [
    {
      email: 'sarah.johnson@nexprolink.test',
      password: 'Test123!@#',
      role: 'expert',
      profile: {
        id: '1',
        name: 'Dr. Sarah Johnson',
        title: 'Senior Software Architect',
        hourlyRate: 150
      }
    }
  ],
  clients: [
    {
      email: 'test.client@nexprolink.test',
      password: 'Client123!@#',
      role: 'client',
      profile: {
        id: 'c1',
        name: 'John Test',
        company: 'Tech Corp'
      }
    }
  ]
};

export const TEST_BOOKING_SLOTS = {
  availableSlots: [
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      slots: ['09:00', '14:00', '16:00']
    },
    {
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
      slots: ['10:00', '13:00', '15:00']
    }
  ]
};

export const TEST_CONSULTATION_TYPES = {
  video: {
    durations: [30, 60, 90],
    baseRate: 150 // per hour
  },
  text: {
    durations: [30, 60],
    baseRate: 100 // per hour
  }
};
