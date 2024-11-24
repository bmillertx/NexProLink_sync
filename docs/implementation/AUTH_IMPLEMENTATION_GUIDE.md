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

### Auth Service
```typescript
// services/auth/auth.service.ts
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: 'client' | 'expert' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  specialties?: string[];
}

export const signIn = async (email: string, password: string): Promise<UserProfile>;
export const signUp = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: 'client' | 'expert'
): Promise<UserProfile>;
export const signInWithGoogle = async (): Promise<UserProfile>;
```

### Auth Context
```typescript
// hooks/useAuth.tsx
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isExpert: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, displayName: string, role: 'client' | 'expert') => Promise<UserProfile>;
  signInWithGoogle: () => Promise<UserProfile>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

### Protected Routes
```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'expert' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // Implementation details in component reference
};
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
