# Component Reference Guide

## 1. Core Components

### 1.1 Layout Components
#### Layout Component (`src/components/layout/Layout.tsx`)
- Main application wrapper
- Network status integration
- Error boundary implementation

#### Navigation Components
- Header implementation
- Responsive menu
- Authentication state display

#### Footer Component
- Static content
- Dynamic links
- Responsive design

### 1.2 Common Components
#### LoadingSpinner (`src/components/common/LoadingSpinner.tsx`)
- Implementation details
- Usage patterns
- Customization options

#### NetworkStatus (`src/components/common/NetworkStatus.tsx`)
- Online/offline detection
- Status indication
- Error handling

#### Error Messages
- Error component hierarchy
- Message formatting
- Action handlers

### 1.3 Authentication Components
#### SignIn Form
- Form validation
- Error handling
- Success feedback

#### SignUp Form
- Field validation
- Password requirements
- Confirmation handling

#### Password Reset Flow
- Email verification
- Token handling
- Success/failure states

## 2. Dashboard Components

### 2.1 Appointment Management
#### AppointmentsTab (`src/components/dashboard/client/AppointmentsTab.tsx`)
```typescript
interface Props {
  expert: Expert;
  onDateSelect: (date: Date) => void;
  // ... other props
}
```
- Data fetching implementation
- State management
- Error handling

#### Calendar Integration
- Date picker implementation
- Available slots display
- Timezone handling

#### Booking Modal Flow
- Form validation
- Slot selection
- Confirmation handling

### 2.2 Expert Profile Display
#### Profile Card Component
- Data display
- Rating system
- Action buttons

#### Availability Display
- Schedule visualization
- Timezone conversion
- Slot selection

#### Event Schedule Integration
- Event type handling
- Duration display
- Capacity management

### 2.3 Data Handling Components
#### Data Fetching Patterns
- Loading states
- Error handling
- Cache management

#### Error State Management
- Error boundaries
- Fallback UI
- Recovery actions

#### Loading State Patterns
- Skeleton screens
- Progressive loading
- Transition handling

## 3. Component Best Practices

### 3.1 Performance Optimization
#### Memoization
- useMemo usage
- useCallback implementation
- Props optimization

#### Render Optimization
- React.memo usage
- Key management
- State updates

#### Lazy Loading
- Component splitting
- Route-based code splitting
- Prefetching strategies

### 3.2 State Management
#### Local State
- useState patterns
- useReducer implementation
- State initialization

#### Context Usage
- Provider implementation
- Consumer patterns
- Performance considerations

#### Props Management
- Prop drilling prevention
- Type safety
- Default props

### 3.3 Error Handling
#### Error Boundaries
- Implementation
- Fallback UI
- Recovery patterns

#### Form Validation
- Field validation
- Error messages
- Submit handling

#### Network Errors
- Retry logic
- User feedback
- Offline handling

## 4. Testing Components

### 4.1 Unit Testing
#### Test Setup
- Jest configuration
- Testing utilities
- Mock implementations

#### Component Testing
- Render testing
- Event handling
- State changes

#### Integration Testing
- Component interaction
- API mocking
- Error scenarios

### 4.2 Accessibility Testing
#### ARIA Implementation
- Role attributes
- State management
- Focus handling

#### Keyboard Navigation
- Tab order
- Shortcuts
- Focus trapping

#### Screen Reader Support
- Alt text
- ARIA labels
- Semantic HTML

## 5. Component Development Workflow

### 5.1 Development Process
#### Component Creation
- File structure
- Type definitions
- Documentation

#### Style Implementation
- Tailwind usage
- Responsive design
- Theme support

#### Testing Strategy
- Test coverage
- Edge cases
- Performance testing

### 5.2 Documentation
#### Props Documentation
- Type definitions
- Required vs optional
- Default values

#### Usage Examples
- Basic usage
- Advanced scenarios
- Error handling

#### Storybook Integration
- Story creation
- Variant documentation
- Interactive examples
