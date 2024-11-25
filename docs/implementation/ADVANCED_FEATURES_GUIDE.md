# NexProLink Advanced Features Implementation Guide

## Overview
This guide provides detailed implementation instructions for advanced features in NexProLink, including Stripe payments, Firebase Authentication, video call integration, and role-based dashboards.

## Table of Contents
1. [Firebase Authentication & Role Management](#1-firebase-authentication--role-management)
2. [Stripe Payment Integration](#2-stripe-payment-integration)
3. [Video Call Implementation](#3-video-call-implementation)
4. [Role-Based Dashboard System](#4-role-based-dashboard-system)
5. [Security & Performance](#5-security--performance)

## 1. Firebase Authentication & Role Management

### 1.1 Role-Based Authentication Flow

```typescript
// src/services/auth/roleManager.ts
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserRole {
  role: 'admin' | 'consultant' | 'client';
  permissions: string[];
  isApproved?: boolean;
}

export const assignUserRole = async (uid: string, role: UserRole) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      role: role.role,
      permissions: role.permissions,
      isApproved: role.role === 'consultant' ? false : true,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error assigning role:', error);
    throw new Error('Failed to assign user role');
  }
};
```

### 1.2 Custom Claims for Role Management

```typescript
// src/services/auth/customClaims.ts
import { auth } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

export const setUserClaims = async (uid: string, claims: object) => {
  const functions = getFunctions();
  const setCustomClaims = httpsCallable(functions, 'setCustomClaims');
  
  try {
    await setCustomClaims({ uid, claims });
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new Error('Failed to set user claims');
  }
};
```

## 2. Stripe Payment Integration

### 2.1 Payment Processing Setup

```typescript
// src/services/payments/stripeService.ts
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface PaymentIntent {
  consultationId: string;
  amount: number;
  currency: string;
  description: string;
}

export const createPaymentSession = async (payment: PaymentIntent) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });

    const session = await response.json();
    return stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error('Payment session creation failed:', error);
    throw new Error('Failed to create payment session');
  }
};
```

### 2.2 Platform Fee Calculation

```typescript
// src/services/payments/feeCalculator.ts
export interface FeeStructure {
  platformFeePercentage: number;
  stripeFixedFee: number;
  stripePercentageFee: number;
}

export const calculateFees = (amount: number, feeStructure: FeeStructure) => {
  const platformFee = amount * (feeStructure.platformFeePercentage / 100);
  const stripeFee = (amount * (feeStructure.stripePercentageFee / 100)) + feeStructure.stripeFixedFee;
  
  return {
    platformFee,
    stripeFee,
    consultantPayout: amount - platformFee - stripeFee
  };
};
```

## 3. Video Call Implementation

### 3.1 Video Call Service Setup

```typescript
// src/services/video/videoService.ts
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

export class VideoCallService {
  private client: IAgoraRTCClient;
  private localAudioTrack: any;
  private localVideoTrack: any;

  constructor() {
    this.client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8'
    });
  }

  async joinCall(channelName: string, token: string, uid: string) {
    try {
      await this.client.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channelName,
        token,
        uid
      );

      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
    } catch (error) {
      console.error('Failed to join call:', error);
      throw new Error('Failed to join video call');
    }
  }

  async leaveCall() {
    this.localAudioTrack?.close();
    this.localVideoTrack?.close();
    await this.client?.leave();
  }
}
```

### 3.2 Call Duration Tracking

```typescript
// src/services/video/callTracker.ts
export interface CallSession {
  startTime: number;
  endTime?: number;
  duration?: number;
  consultationId: string;
}

export class CallTracker {
  private sessions: Map<string, CallSession>;

  constructor() {
    this.sessions = new Map();
  }

  startTracking(consultationId: string): void {
    this.sessions.set(consultationId, {
      startTime: Date.now(),
      consultationId
    });
  }

  endTracking(consultationId: string): CallSession {
    const session = this.sessions.get(consultationId);
    if (!session) throw new Error('No active session found');

    session.endTime = Date.now();
    session.duration = (session.endTime - session.startTime) / 1000; // Duration in seconds
    return session;
  }
}
```

## 4. Role-Based Dashboard System

### 4.1 Dashboard Access Control

```typescript
// src/components/dashboard/DashboardGuard.tsx
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export const DashboardGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  if (loading) return <LoadingSpinner />;

  if (!user || !profile) {
    router.push('/auth/login');
    return null;
  }

  if (profile.role === 'consultant' && !profile.isApproved) {
    return <PendingApprovalMessage />;
  }

  return <>{children}</>;
};
```

### 4.2 Role-Specific Components

```typescript
// src/components/dashboard/RoleBasedView.tsx
import { useAuth } from '@/hooks/useAuth';

export const RoleBasedView: React.FC = () => {
  const { profile } = useAuth();

  const renderDashboard = () => {
    switch (profile?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'consultant':
        return <ConsultantDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return <UnauthorizedView />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};
```

## 5. Security & Performance

### 5.1 Security Best Practices

```typescript
// src/services/security/securityMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';

export const validateAuthToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) throw new Error('No token provided');

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

### 5.2 Performance Optimization

```typescript
// src/utils/performance.ts
export const withPerformanceTracking = (
  Component: React.ComponentType
): React.FC => {
  return function WrappedComponent(props: any) {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`Component render time: ${endTime - startTime}ms`);
      };
    }, []);

    return <Component {...props} />;
  };
};
```

## Implementation Checklist

1. [ ] Firebase Authentication Setup
   - [ ] Configure Firebase project
   - [ ] Implement role-based auth
   - [ ] Set up custom claims

2. [ ] Stripe Integration
   - [ ] Configure Stripe account
   - [ ] Implement payment processing
   - [ ] Set up webhooks

3. [ ] Video Calls
   - [ ] Set up Agora account
   - [ ] Implement call service
   - [ ] Add call tracking

4. [ ] Dashboards
   - [ ] Create role-specific views
   - [ ] Implement access control
   - [ ] Add analytics

5. [ ] Security & Performance
   - [ ] Implement security middleware
   - [ ] Add performance monitoring
   - [ ] Set up error tracking

## Testing Guidelines

1. Authentication Testing
```typescript
describe('Authentication Flow', () => {
  it('should assign correct role on signup', async () => {
    // Test implementation
  });
  
  it('should handle unauthorized access correctly', async () => {
    // Test implementation
  });
});
```

2. Payment Testing
```typescript
describe('Payment Processing', () => {
  it('should calculate platform fees correctly', async () => {
    // Test implementation
  });
  
  it('should handle failed payments gracefully', async () => {
    // Test implementation
  });
});
```

## Deployment Considerations

1. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_AGORA_APP_ID=your_agora_id
```

2. Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /consultations/{consultationId} {
      allow read: if request.auth != null && (
        resource.data.clientId == request.auth.uid ||
        resource.data.consultantId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
  }
}
```

## Error Handling

```typescript
// src/utils/errorHandling.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    // Handle known application errors
    return {
      message: error.message,
      code: error.code,
      status: error.status
    };
  }
  
  // Handle unknown errors
  console.error('Unhandled error:', error);
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500
  };
};
```

## Support and Maintenance

1. Monitoring Setup
2. Error Tracking
3. Performance Metrics
4. User Analytics

For detailed implementation support or troubleshooting, refer to the respective documentation:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Agora Documentation](https://docs.agora.io/)
