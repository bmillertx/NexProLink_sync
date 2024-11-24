# Component Reference Guide

## Authentication Components

### AuthProvider
```javascript
// components/auth/AuthProvider.js
// Manages authentication state and provides auth context to the app
```

### ProtectedRoute
```javascript
// components/auth/ProtectedRoute.js
// HOC for protecting routes based on authentication and role
```

### RoleBasedAccess
```javascript
// components/auth/RoleBasedAccess.js
// Component for conditional rendering based on user role
```

## Dashboard Components

### Admin Dashboard
```javascript
// components/admin/Dashboard.js
// Main admin dashboard layout and functionality
```

### Expert Dashboard
```javascript
// components/expert/Dashboard.js
// Main expert dashboard layout and functionality
```

### Client Dashboard
```javascript
// components/client/Dashboard.js
// Main client dashboard layout and functionality
```

## Form Components

### SignUpForm
```javascript
// components/auth/SignUpForm.js
// Handles user registration with role selection
```

### SignInForm
```javascript
// components/auth/SignInForm.js
// Handles user authentication
```

### ExpertProfileForm
```javascript
// components/expert/ProfileForm.js
// Expert profile creation and editing
```

## Layout Components

### DashboardLayout
```javascript
// components/layout/DashboardLayout.js
// Common layout for all dashboard pages
```

### Navigation
```javascript
// components/layout/Navigation.js
// Role-based navigation menu
```

## Utility Components

### LoadingSpinner
```javascript
// components/common/LoadingSpinner.js
// Loading state indicator
```

### ErrorBoundary
```javascript
// components/common/ErrorBoundary.js
// Error handling wrapper
```

### Toast
```javascript
// components/common/Toast.js
// Notification system
```

## Custom Hooks

### useAuth
```javascript
// hooks/useAuth.js
// Authentication state and methods
```

### useFirestore
```javascript
// hooks/useFirestore.js
// Firestore operations wrapper
```

### useRole
```javascript
// hooks/useRole.js
// Role-based permissions and access control
```

## API Services

### AuthService
```javascript
// services/auth.js
// Firebase authentication methods
```

### UserService
```javascript
// services/user.js
// User management operations
```

### BookingService
```javascript
// services/booking.js
// Booking system operations
```

## Constants

### Routes
```javascript
// constants/routes.js
// Application routes configuration
```

### Roles
```javascript
// constants/roles.js
// User role definitions and permissions
```

### ErrorCodes
```javascript
// constants/errorCodes.js
// Error code definitions and messages
```

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
```javascript
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
```javascript
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
```javascript
// __tests__/components/auth/SignUpForm.test.js
describe('SignUpForm', () => {
  it('should handle role selection', () => {
    // Test implementation
  });
});
```

### Hook Test
```javascript
// __tests__/hooks/useAuth.test.js
describe('useAuth', () => {
  it('should manage authentication state', () => {
    // Test implementation
  });
});
```

## Style Guide

### Component Structure
```javascript
// Template for new components
import React from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
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

## Best Practices

1. Use TypeScript for better type safety
2. Implement proper error boundaries
3. Use React.memo for performance optimization
4. Follow atomic design principles
5. Write comprehensive tests
6. Document component APIs
7. Use proper prop validation
8. Implement accessibility features
