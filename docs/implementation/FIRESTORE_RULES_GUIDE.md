# NexProLink Firestore Security Rules Guide

## Overview
This guide documents the security rules implementation for NexProLink's Cloud Firestore database. These rules ensure proper access control and data security across different user roles and collections.

## Table of Contents
- [User Roles](#user-roles)
- [Helper Functions](#helper-functions)
- [Collection Rules](#collection-rules)
- [Common Operations](#common-operations)
- [Troubleshooting](#troubleshooting)

## User Roles

### Available Roles
- **Admin**: Full system access
  - Role identifier: `role: "admin"` or `userType: "admin"`
  - Required fields: `isApproved: true`, `status: "approved"` or `"active"`
  
- **Consultant**: Professional service provider
  - Role identifier: `role: "consultant"`
  - Required fields: `isApproved: true`
  
- **Client**: Service seeker
  - Role identifier: `role: "client"`
  - Required fields: `isApproved: true`

### Role Verification
```javascript
// Admin verification
function isAdmin() {
  let userData = getUserData();
  return isAuthenticated() && 
         userData != null && 
         (userData.role == 'admin' || userData.userType == 'admin') &&
         userData.isApproved == true &&
         (userData.status == 'approved' || userData.status == 'active');
}

// Role-based verification
function hasRole(role) {
  let userData = getUserData();
  return isAuthenticated() && 
         userData != null && 
         userData.role == role &&
         userData.isApproved == true;
}
```

## Helper Functions

### Authentication Helpers
```javascript
// Check if user is authenticated
function isAuthenticated() {
  return request.auth != null;
}

// Check if user owns the resource
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}

// Get user data
function getUserData() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
}
```

## Collection Rules

### Users Collection
```javascript
match /users/{userId} {
  allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
  allow create: if isAuthenticated();
  allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
  allow delete: if isAdmin();
}
```

### Consultations Collection
```javascript
match /consultations/{consultationId} {
  allow read: if isAuthenticated() && (
    !exists(resource.data) ||
    resource.data.clientId == request.auth.uid ||
    resource.data.consultantId == request.auth.uid ||
    isAdmin()
  );
  
  allow create: if isAuthenticated() && (
    (isClient() && request.resource.data.clientId == request.auth.uid) ||
    (isConsultant() && request.resource.data.consultantId == request.auth.uid) ||
    isAdmin()
  );
  
  allow update: if isAuthenticated() && (
    resource.data.clientId == request.auth.uid ||
    resource.data.consultantId == request.auth.uid ||
    isAdmin()
  );
  
  allow delete: if isAdmin();
}
```

### Appointments Collection
```javascript
match /appointments/{appointmentId} {
  allow read: if isAuthenticated() && (
    resource.data.clientId == request.auth.uid || 
    resource.data.consultantId == request.auth.uid ||
    isAdmin()
  );
  allow create: if isAuthenticated() && (
    (isClient() && request.resource.data.clientId == request.auth.uid) ||
    isAdmin()
  );
  allow update: if isAuthenticated() && (
    resource.data.clientId == request.auth.uid || 
    resource.data.consultantId == request.auth.uid ||
    isAdmin()
  );
  allow delete: if isAdmin();
}
```

## Common Operations

### Admin Operations
Admins have full access to all collections and can:
- Read/write any document
- Delete documents
- Manage user profiles
- Override standard permissions

### Consultant Operations
Consultants can:
- Read their own profile
- Update their profile
- Access their consultations
- Manage their appointments

### Client Operations
Clients can:
- Read their own profile
- Create and manage appointments
- Access their consultations
- Submit reviews for completed consultations

## Troubleshooting

### Common Issues

1. **Missing Permissions Error**
   - Check user role in Firebase Auth
   - Verify `isApproved` status
   - Confirm user document exists in Firestore

2. **Admin Access Denied**
   - Verify both `role` and `userType` fields
   - Check `status` field is either "approved" or "active"
   - Ensure `isApproved` is true

3. **Document Access Issues**
   - Confirm user authentication
   - Check resource ownership
   - Verify role-based permissions

### Debugging Tips

1. **Check User Profile**
```javascript
// Log user data for debugging
console.log('User:', request.auth);
console.log('Profile:', getUserData());
```

2. **Verify Role Access**
```javascript
// Test role access
let hasAccess = hasRole('desired_role');
console.log('Has Access:', hasAccess);
```

3. **Test Admin Rights**
```javascript
// Verify admin status
let isAdminUser = isAdmin();
console.log('Is Admin:', isAdminUser);
```

## Security Best Practices

1. **Always verify authentication**
   ```javascript
   if (!isAuthenticated()) return false;
   ```

2. **Check resource ownership**
   ```javascript
   if (!isOwner(userId) && !isAdmin()) return false;
   ```

3. **Validate data on write**
   ```javascript
   // Example: Ensure required fields
   request.resource.data.keys().hasAll(['field1', 'field2'])
   ```

4. **Use helper functions**
   - Keep rules DRY (Don't Repeat Yourself)
   - Use common validation functions
   - Maintain consistent access patterns

## Updating Rules

1. Access Firebase Console
2. Navigate to Firestore Database
3. Select "Rules" tab
4. Paste updated rules
5. Click "Publish"

## Version History

### Current Version (2024-11-25)
- Added comprehensive admin role verification
- Implemented role-based access control
- Enhanced security for all collections
- Added support for both role and userType fields
