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

### 1.4 Video Components
#### VideoQualityIndicator (`src/components/video/VideoQualityIndicator.tsx`)
- Real-time video call quality monitoring
- Visual quality indicators
- Detailed metrics display
- Features:
  * Connection quality status
  * Bitrate monitoring
  * Latency tracking
  * Packet loss detection
  * Frame rate display
  * Resolution information

#### Integration Points
- Integrates with `videoQualityMonitor` service
- Uses Firebase for metrics storage
- Connects with WebRTC stats API
- Updates in real-time (1-second intervals)

#### Usage Example
```tsx
<VideoQualityIndicator
  sessionId="video-session-id"
  onQualityChange={(quality) => {
    // Handle quality changes
  }}
/>
```

#### Props
| Prop | Type | Description |
|------|------|-------------|
| sessionId | string | Unique identifier for the video session |
| onQualityChange | (quality: VideoCallQuality) => void | Optional callback for quality changes |

#### Quality Thresholds
- Excellent: 2+ Mbps, <100ms latency, <0.5% packet loss
- Good: 1+ Mbps, <200ms latency, <2% packet loss
- Fair: 500+ Kbps, <300ms latency, <5% packet loss
- Poor: 250+ Kbps, <500ms latency, <10% packet loss
- Critical: Below minimum thresholds

## 2. Dashboard Components

### 2.1 Layout Components
#### DashboardLayout (`src/components/dashboard/DashboardLayout.tsx`)
- Main dashboard wrapper component
- Role-based navigation menu
- Responsive sidebar
- User profile display
- Dark mode support

Features:
- Dynamic menu based on user role (client/consultant)
- Integrated user profile
- Responsive design
- Navigation state management
- Theme support

Integration Points:
- AuthContext for user data
- Next.js routing
- Tailwind for styling
- HeroIcons for icons

### 2.2 Client Dashboard Components
#### Overview (`src/pages/client/dashboard/index.tsx`)
- Summary of upcoming consultations
- Recent activity
- Quick actions

#### ConsultantSearch (`src/components/dashboard/client/ConsultantSearch.tsx`)
- Search and filter consultants
- View consultant profiles
- Booking interface

#### ConsultationHistory (`src/components/dashboard/client/ConsultationHistory.tsx`)
- List of past consultations
- Session ratings and feedback
- Download session notes

#### VideoSessions (`src/components/dashboard/client/VideoSessions.tsx`)
- Upcoming video sessions
- Join session interface
- Session preparation checklist

### 2.3 Consultant Dashboard Components
#### Overview (`src/pages/consultant/dashboard/index.tsx`)
- Daily schedule
- Upcoming sessions
- Earnings summary
- Client requests

#### Schedule (`src/components/dashboard/consultant/Schedule.tsx`)
- Availability management
- Session calendar
- Break time settings

#### ClientManagement (`src/components/dashboard/consultant/ClientManagement.tsx`)
- Client list
- Session history per client
- Notes and feedback

#### ServiceManagement (`src/components/dashboard/consultant/ServiceManagement.tsx`)
- Service offerings
- Pricing configuration
- Availability slots

### 2.4 Shared Components
#### VideoCall (`src/components/dashboard/shared/VideoCall.tsx`)
- Video consultation interface
- Quality indicators
- Screen sharing
- Chat functionality

#### MessageCenter (`src/components/dashboard/shared/MessageCenter.tsx`)
- Direct messaging
- File sharing
- Message history

#### Settings (`src/components/dashboard/shared/Settings.tsx`)
- Profile management
- Notification preferences
- Account settings

### 2.5 Integration Points
#### Video Service
- Integration with video quality monitor
- WebRTC connection handling
- Quality metrics tracking

#### Payment Processing
- Stripe integration
- Session billing
- Payout management

#### Notifications
- Real-time updates
- Email notifications
- Push notifications

### 2.6 State Management
#### Dashboard Context
- Session state
- UI preferences
- Cache management

### 2.7 Testing
#### Dashboard Test Suite
- Component tests
- Integration tests
- Performance monitoring

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
