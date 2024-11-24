# Authentication and Dashboard Implementation Guide

## Overview
This guide outlines the implementation of Firebase Authentication and role-based dashboards in NexProLink, with special attention to TypeScript integration and SSR considerations.

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Authentication Implementation](#authentication-implementation)
4. [User Management](#user-management)
5. [Dashboard Implementation](#dashboard-implementation)
6. [Testing Strategy](#testing-strategy)
7. [Troubleshooting](#troubleshooting)

## Environment Setup

### Environment Variables
Create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Required Dependencies
```json
{
  "dependencies": {
    "firebase": "^10.7.0",
    "next": "14.1.0",
    "react": "18.2.0"
  }
}
```

## Firebase Configuration

### Initialization Pattern
```typescript
// config/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

## Authentication Implementation

### Context Setup
The authentication system is implemented using a React Context (`AuthContext`) that provides authentication state and methods throughout the application.

```typescript
// Usage example
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, profile, signIn, signUp } = useAuth();
  // Use auth methods and state
}
```

### Available Authentication Methods
- `signIn(email: string, password: string)`: Sign in existing users
- `signUp(email: string, password: string, role: 'client' | 'consultant')`: Create new users
- `logout()`: Sign out the current user
- `resetPassword(email: string)`: Send password reset email
- `updateUserProfile(updates: Partial<UserProfile>)`: Update user profile
- `reauthenticate(password: string)`: Reauthenticate user for sensitive operations

### Role-Based Access Control
Access control is implemented using the `ProtectedRoute` component:

```typescript
// Pages with role-based access
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Client-only page
export default function ClientDashboard() {
  return (
    <ProtectedRoute requiredRole="client">
      <DashboardContent />
    </ProtectedRoute>
  );
}

// Consultant-only page
export default function ConsultantDashboard() {
  return (
    <ProtectedRoute requiredRole="consultant">
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

### User Profile Management
User profiles are stored in Firestore with the following structure:

```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'client' | 'consultant';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields based on role
  consultationRate?: number;      // For consultants
  availability?: {
    timezone: string;
    schedule?: Record<string, { start: string; end: string }>;
  };
  professionalInfo?: {
    title?: string;
    specializations?: string[];
    experience?: number;
    education?: Array<{
      degree: string;
      institution: string;
      year: number;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      year: number;
    }>;
  };
}
```

### Security Rules
Firestore security rules for user profiles:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'consultant'
      );
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Additional rules for consultant profiles
      match /availability/{document=**} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && 
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'consultant';
      }
    }
  }
}
```

### Error Handling
Authentication errors are handled consistently throughout the application:

```typescript
try {
  await signIn(email, password);
  // Success handling
} catch (error) {
  // Error is automatically handled by AuthContext
  // and stored in the error state
}
```

### Testing Authentication
Test authentication flows using the provided test utilities:

```typescript
import { authTest } from '@/utils/tests/auth/authTest';

// Run authentication tests
await authTest.runAll();
```

## User Management

### User Profile Structure
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: 'client' | 'expert' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  specialties?: string[];
}
```

### Role-Based Access Control
- Client: Basic profile, booking functionality
- Expert: Extended profile, availability management
- Admin: System management, user oversight

## Dashboard Implementation

### Route Structure
```
/pages
├── auth
│   ├── signin.tsx
│   └── signup.tsx
├── admin
│   ├── dashboard.tsx
│   └── users.tsx
├── expert
│   ├── dashboard.tsx
│   └── profile.tsx
└── client
    ├── dashboard.tsx
    └── bookings.tsx
```

## Testing Strategy

### Unit Tests
- Authentication service methods
- Protected route behavior
- Role-based access control

### Integration Tests
- User registration flow
- Login process
- Dashboard access control

### E2E Tests
- Complete user journeys
- Cross-role interactions

## Troubleshooting

### Common Issues

1. Firebase Initialization
```typescript
// Check if window is defined for SSR
if (typeof window !== 'undefined') {
  // Firebase initialization code
}
```

2. Auth State Updates
```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setLoading(true);
    try {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setProfile(profile);
      }
    } catch (error) {
      console.error('Auth state update error:', error);
    } finally {
      setLoading(false);
    }
  });
  return () => unsubscribe();
}, []);
```

3. Role-Based Routing
```typescript
const redirectPath = profile?.userType === 'client' ? '/client/dashboard' :
                    profile?.userType === 'expert' ? '/expert/dashboard' :
                    profile?.userType === 'admin' ? '/admin/dashboard' :
                    '/auth/signin';
```

### Error Handling
```typescript
try {
  // Auth operation
} catch (error) {
  console.error('Operation error:', error);
  throw error instanceof Error ? error : new Error('Authentication failed');
}
