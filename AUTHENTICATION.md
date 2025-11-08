# Authentication Guide

This project implements JWT (JSON Web Token) based authentication for secure API access.

## Table of Contents
- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Using Authentication](#using-authentication)
- [Protecting Routes](#protecting-routes)
- [Role-Based Access Control](#role-based-access-control)
- [Error Handling](#error-handling)

## Overview

The authentication system uses:
- **JWT tokens** for stateless authentication
- **bcryptjs** for password hashing
- **Role-based access control** (user, admin, moderator)
- **Secure HTTP headers** with Helmet.js

## Authentication Flow

### 1. Registration
```
User submits credentials → Password hashed → User created in DB → JWT token generated → Token returned
```

### 2. Login
```
User submits credentials → Email verified → Password compared → JWT token generated → Token returned
```

### 3. Protected Route Access
```
Request with token → Token verified → User loaded from DB → Access granted
```

## API Endpoints

### Register a New User
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** Password is automatically excluded from responses.

---

### Login
**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current User
**GET** `/api/v1/auth/me`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true
    }
  }
}
```

---

### Update Password
**PUT** `/api/v1/auth/update-password`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** A new token is issued after password change.

---

### Logout
**POST** `/api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

**Note:** JWT tokens are stateless. Logout is handled client-side by removing the token. This endpoint exists for consistency and can be extended with token blacklisting if needed.

---

## Using Authentication

### Client-Side Implementation

#### 1. Store Token After Login/Register
```javascript
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
// Store token in localStorage or secure storage
localStorage.setItem('token', data.token);
```

#### 2. Include Token in Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### 3. Handle Token Expiration
```javascript
// Check for 401 errors and redirect to login
if (response.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

### cURL Examples

#### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Current User
```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Password
```bash
curl -X PUT http://localhost:3000/api/v1/auth/update-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456",
    "confirmPassword": "newpassword456"
  }'
```

---

## Protecting Routes

### Using requireAuth Middleware

Protect any route by adding the `requireAuth` middleware:

```javascript
import { requireAuth } from '../middlewares/auth.js';

router.get('/protected', requireAuth, (req, res) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});
```

### Optional Authentication

For routes that change behavior based on authentication status:

```javascript
import { optionalAuth } from '../middlewares/auth.js';

router.get('/public', optionalAuth, (req, res) => {
  if (req.user) {
    // User is authenticated
    res.json({ message: 'Welcome back!', user: req.user });
  } else {
    // User is not authenticated
    res.json({ message: 'Welcome, guest!' });
  }
});
```

---

## Role-Based Access Control

### Available Roles
- `user` (default)
- `moderator`
- `admin`

### Using requireRole Middleware

Restrict access to specific roles:

```javascript
import { requireAuth, requireRole } from '../middlewares/auth.js';

// Only admins can access
router.delete('/users/:id',
  requireAuth,
  requireRole('admin'),
  userController.deleteUser
);

// Admins and moderators can access
router.get('/users',
  requireAuth,
  requireRole('admin', 'moderator'),
  userController.getAllUsers
);
```

**Important:** `requireRole` must be used AFTER `requireAuth` middleware.

### Protected User Routes

| Route | Method | Access Level |
|-------|--------|--------------|
| GET /api/v1/users | GET | Admin, Moderator |
| POST /api/v1/users | POST | Admin only |
| GET /api/v1/users/:id | GET | Authenticated users |
| PUT /api/v1/users/:id | PUT | Authenticated users |
| DELETE /api/v1/users/:id | DELETE | Admin only |

---

## Error Handling

### Common Authentication Errors

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "statusCode": 401,
    "message": "You are not logged in. Please log in to get access."
  }
}
```

**Causes:**
- No token provided
- Invalid token
- Expired token
- User account deactivated

#### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "You do not have permission to perform this action."
  }
}
```

**Cause:** User doesn't have required role

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Email already in use"
  }
}
```

**Causes:**
- Email already exists (registration)
- Validation errors

---

## Token Details

### Token Structure
The JWT token contains:
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Expiration
Default expiration: **7 days**

Configure in `.env`:
```env
JWT_EXPIRE=7d
```

Supported formats:
- `60s` - 60 seconds
- `5m` - 5 minutes
- `2h` - 2 hours
- `7d` - 7 days
- `30d` - 30 days

### Security Best Practices

1. **Store JWT_SECRET securely**
   ```bash
   # Generate a secure secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Use HTTPS in production** - Never send tokens over HTTP

3. **Set appropriate token expiration** - Balance security vs. user experience

4. **Store tokens securely on client**
   - Use `httpOnly` cookies (if implementing cookie-based auth)
   - Or secure storage mechanisms (not `localStorage` for sensitive apps)

5. **Implement token refresh** (future enhancement)
   - Issue short-lived access tokens (15 minutes)
   - Use long-lived refresh tokens to get new access tokens

6. **Validate on every request** - The middleware checks:
   - Token validity
   - User still exists
   - User account is active

---

## Example Implementation

### Complete Registration and Login Flow

```javascript
// 1. Register new user
const registerResponse = await fetch('/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword123'
  })
});

const { data: registerData } = await registerResponse.json();
localStorage.setItem('token', registerData.token);

// 2. Make authenticated request
const token = localStorage.getItem('token');
const userResponse = await fetch('/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data: userData } = await userResponse.json();
console.log('Current user:', userData.user);

// 3. Access protected resource
const usersResponse = await fetch('/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

if (usersResponse.status === 403) {
  console.log('Access denied - insufficient permissions');
}

// 4. Logout
localStorage.removeItem('token');
```

---

## File Structure

```
src/
├── controllers/
│   └── auth.controller.js      # Authentication HTTP handlers
├── services/
│   └── auth.service.js         # Authentication business logic
├── middlewares/
│   └── auth.js                 # requireAuth, requireRole, optionalAuth
├── validators/
│   └── auth.validator.js       # Joi validation schemas
├── routes/
│   └── auth.routes.js          # Authentication endpoints
└── utils/
    └── jwt.js                  # JWT utility functions
```

---

## Next Steps

### Recommended Enhancements

1. **Email Verification**
   - Send verification email on registration
   - Require email verification before login

2. **Password Reset**
   - Forgot password endpoint
   - Reset token generation
   - Email with reset link

3. **Refresh Tokens**
   - Long-lived refresh tokens
   - Short-lived access tokens
   - Token refresh endpoint

4. **Token Blacklisting**
   - Redis-based token blacklist
   - Immediate logout capability
   - Revoke tokens on security events

5. **Two-Factor Authentication**
   - TOTP-based 2FA
   - SMS-based 2FA
   - Backup codes

6. **Rate Limiting on Auth Endpoints**
   - Stricter rate limits for login/register
   - Prevent brute force attacks

7. **Audit Logging**
   - Log all authentication events
   - Track failed login attempts
   - Monitor suspicious activity

---

## Troubleshooting

### Token Not Working

1. Check token format in header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Verify JWT_SECRET matches in `.env`

3. Check token hasn't expired

4. Ensure user account is active

### Permission Denied

1. Check user role in database
2. Verify `requireRole` middleware has correct roles
3. Check `requireAuth` is before `requireRole`

### Password Not Hashing

1. Ensure bcryptjs is installed
2. Check pre-save hook in user model
3. Verify password field is being modified

---

For more information, see:
- [QUICK_START.md](./QUICK_START.md) - Getting started guide
- [README.md](./README.md) - Project overview
