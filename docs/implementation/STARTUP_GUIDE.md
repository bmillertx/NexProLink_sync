# NexProLink Startup Guide

## 1. Environment Setup

### Install Global Dependencies
```bash
# Install Firebase Tools
npm install -g firebase-tools

# Install development dependencies
npm install -g typescript @types/node
```

### Project Setup
```bash
# Navigate to project directory
cd C:\Users\AiMaster\Desktop\Home\NexProLink_project

# Install project dependencies
npm install

# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install
```

### Firebase Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select these options:
# - Firestore
# - Authentication
# - Storage
# - Hosting
```

### Environment Variables
Create `.env.local` in the frontend directory with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 2. Start Development Server

### Start Frontend
```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev
```

## 3. Verify Setup

1. Open browser to http://localhost:3000
2. Try signing up a new user
3. Verify email verification flow
4. Try signing in
5. Check dashboard access

## 4. Common Issues

### Firebase Initialization
If Firebase fails to initialize:
1. Check `.env.local` variables
2. Verify Firebase project settings
3. Check browser console for errors

### Authentication Issues
If auth doesn't work:
1. Enable Email/Password authentication in Firebase Console
2. Check email verification settings
3. Verify Firestore rules

### Database Access
If Firestore access fails:
1. Check Firebase rules
2. Verify collection names
3. Check user permissions

## 5. Development Commands

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

### Firebase Commands
```bash
# Deploy Firebase rules
firebase deploy --only firestore:rules

# Deploy hosting
firebase deploy --only hosting

# View Firebase logs
firebase functions:log
```
