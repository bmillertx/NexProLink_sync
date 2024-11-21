# NexProLink

A modern platform connecting users with local professionals for paid consultations.

## Project Structure

```
NexProLink_project/
├── backend/           # Node.js/Express backend server
├── frontend/         # React web application
├── mobile/           # React Native mobile app
├── shared/           # Shared utilities and components
└── admin/            # Admin dashboard application
```

## Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Web Frontend**: React, Next.js, TailwindCSS
- **Mobile**: React Native
- **Authentication**: JWT, Firebase
- **Payment Processing**: Stripe
- **Real-time Communication**: WebSocket/Socket.io

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in required credentials

3. Start development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm run dev

   # Mobile
   cd mobile
   npm run start
   ```

## Features

- Professional consultation booking
- Video and text chat
- Secure payment processing
- Time-based billing
- User and professional profiles
- Admin dashboard
- Analytics and reporting
