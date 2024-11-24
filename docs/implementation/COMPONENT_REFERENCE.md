# Component Reference Guide

## Authentication Components

### AuthProvider
```typescript
// hooks/useAuth.tsx
// Manages authentication state and provides auth context to the app

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

### ProtectedRoute
```typescript
// components/auth/ProtectedRoute.tsx
// HOC for protecting routes based on authentication and role

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'expert' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  // Redirects to appropriate dashboard based on user role
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      if (!user) {
        router.push('/auth/signin');
      } else if (requiredRole && profile?.userType !== requiredRole) {
        const redirectPath = profile?.userType === 'client' ? '/client/dashboard' :
                           profile?.userType === 'expert' ? '/expert/dashboard' :
                           profile?.userType === 'admin' ? '/admin/dashboard' :
                           '/auth/signin';
        router.push(redirectPath);
      }
    }
  }, [user, profile, loading, router, requiredRole]);
};
```

### AuthModal
```typescript
// components/auth/AuthModal.tsx
// Modal component for login and registration

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Handles form submission for both login and registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName, userType);
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };
};
```

### NetworkStatus
```typescript
// components/common/NetworkStatus.tsx
// Displays network connection status

export function NetworkStatus() {
  const { online } = useNetwork();
  
  return (
    <div className={cn(
      'fixed bottom-4 right-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm',
      online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    )}>
      {online ? <CloudIcon className="h-5 w-5" /> : <ArrowPathIcon className="h-5 w-5 animate-spin" />}
      <span>{online ? 'Connected' : 'Connecting...'}</span>
    </div>
  );
}
```

## Dashboard Components

### AdminDashboard
```typescript
// components/admin/Dashboard.tsx
// Main admin dashboard with user management and analytics

interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    activeExperts: number;
    pendingExperts: number;
    totalBookings: number;
  };
}
```

### ExpertDashboard
```typescript
// components/expert/Dashboard.tsx
// Expert dashboard with booking management and availability

interface ExpertDashboardProps {
  bookings: Booking[];
  availability: AvailabilitySlot[];
}
```

### ClientDashboard
```typescript
// components/client/Dashboard.tsx
// Client dashboard with expert search and booking management

interface ClientDashboardProps {
  upcomingBookings: Booking[];
  recommendedExperts: Expert[];
}
```

## Form Components

### ExpertRegistrationForm
```typescript
// components/forms/ExpertRegistrationForm.tsx
// Extended registration form for experts

interface ExpertRegistrationFormProps {
  onSubmit: (data: ExpertRegistrationData) => Promise<void>;
  loading: boolean;
}

interface ExpertRegistrationData {
  professionalTitle: string;
  specialties: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  bio: string;
}
```

### BookingForm
```typescript
// components/forms/BookingForm.tsx
// Form for scheduling consultations

interface BookingFormProps {
  expertId: string;
  availableSlots: AvailabilitySlot[];
  onSubmit: (data: BookingData) => Promise<void>;
}
```

## Layout Components

### Layout
```typescript
// components/layout/Layout.tsx
// Main layout wrapper with navigation and auth state

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'client' | 'expert' | 'admin';
}
```

### Navigation
```typescript
// components/layout/Navigation.tsx
// Role-based navigation menu

interface NavigationProps {
  userType: 'client' | 'expert' | 'admin';
}
```

## Common Components

### LoadingSpinner
```typescript
// components/common/LoadingSpinner.tsx
// Reusable loading indicator

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

### ErrorBoundary
```typescript
// components/common/ErrorBoundary.tsx
// Error boundary for component error handling

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

## Best Practices

1. **Type Safety**
   - Use TypeScript interfaces for all props
   - Implement proper error handling
   - Validate all user inputs

2. **Performance**
   - Implement proper loading states
   - Use React.memo for expensive renders
   - Optimize re-renders with useMemo/useCallback

3. **Security**
   - Validate all authentication states
   - Implement proper role checks
   - Sanitize user inputs

4. **Accessibility**
   - Use semantic HTML
   - Implement proper ARIA attributes
   - Ensure keyboard navigation

## Component Dependencies
```
AuthProvider
└── App
    ├── Navigation
    ├── ProtectedRoute
    │   ├── AdminDashboard
    │   ├── ExpertDashboard
    │   └── ClientDashboard
    └── PublicRoute
        ├── SignIn
        └── SignUp
```

## State Management

### Authentication State
```typescript
{
  user: {
    uid: string,
    email: string,
    role: string,
    displayName: string
  },
  loading: boolean,
  error: string | null
}
```

### Dashboard State
```typescript
{
  experts: Expert[],
  clients: Client[],
  bookings: Booking[],
  analytics: Analytics,
  loading: boolean,
  error: string | null
}
```

## Testing Examples

### Component Test
```typescript
// __tests__/components/auth/SignUpForm.test.tsx
describe('SignUpForm', () => {
  it('should handle role selection', () => {
    // Test implementation
  });
});
```

### Hook Test
```typescript
// __tests__/hooks/useAuth.test.tsx
describe('useAuth', () => {
  it('should manage authentication state', () => {
    // Test implementation
  });
});
```

## Style Guide

### Component Structure
```typescript
// Template for new components
import React from 'react';
import PropTypes from 'prop-types';

interface ComponentProps {
  // Define props here
}

const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  // Component logic
  return (
    // JSX
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.func
};

export default ComponentName;
```

### CSS Modules
```css
/* styles/ComponentName.module.css */
.container {
  /* styles */
}

.element {
  /* styles */
}
```
