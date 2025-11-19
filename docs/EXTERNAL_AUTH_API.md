# VCorp Central Authentication API

This document describes how to integrate external sites with VCorp's centralized authentication system.

## Overview

VCorp acts as a central authentication hub for all managed sites. Users register once on VCorp and can authenticate across all your sites using passwordless magic links. After successful authentication, users are redirected back to your site with a JWT token containing their user information.

## Base URL

**Production:** `https://api.thevacorp.com`  
**Development:** `http://localhost:3000`

## Authentication Flow

### 1. Registration Flow

```
External Site → VCorp Registration API → Email Sent → User Clicks Link → 
VCorp Verification → Redirect to External Site with JWT Token
```

### 2. Sign-In Flow

```
External Site → VCorp Sign-In API → Email Sent → User Clicks Link → 
VCorp Verification → Redirect to External Site with JWT Token
```

---

## API Endpoints

### 1. Register New User

**Endpoint:** `POST /api/external/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "address": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001"
  },
  "program": "fyght4",
  "tier": "premium",
  "redirectUrl": "https://fyght4.com"
}
```

**Required Fields:**
- `firstName` (string)
- `lastName` (string)
- `email` (string)
- `phone` (string)
- `dateOfBirth` (string, ISO date format)
- `address` (object with street, city, state, zipCode)
- `redirectUrl` (string, must be whitelisted)

**Optional Fields:**
- `program` (string): One of: `spiritof`, `fyght4`, `taekwondo`, `edyensgate`
- `tier` (string): Program-specific tier

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Check your email for the verification link.",
  "userId": "60f7b1c3e4b0c8a2d8e4f5a6"
}
```

**Error Responses:**
- `400`: Missing required fields or invalid redirect URL
- `409`: User already exists
- `500`: Server error

---

### 2. Sign In Existing User

**Endpoint:** `POST /api/external/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "redirectUrl": "https://fyght4.com"
}
```

**Required Fields:**
- `email` (string)
- `redirectUrl` (string, must be whitelisted)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sign-in link sent! Check your email."
}
```

**Error Responses:**
- `400`: Missing required fields or invalid redirect URL
- `403`: Email not verified or account inactive
- `500`: Server error

---

## JWT Token Structure

After successful verification, users are redirected to:
```
{redirectUrl}/dashboard?token={JWT_TOKEN}
```

### JWT Payload

```json
{
  "userId": "60f7b1c3e4b0c8a2d8e4f5a6",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "programs": [
    {
      "programId": "fyght4",
      "tier": "premium",
      "status": "active"
    }
  ],
  "accountStatus": "active",
  "emailVerified": true,
  "iat": 1632825600,
  "exp": 1633430400,
  "iss": "api.thevacorp.com",
  "aud": "vcorp-network"
}
```

### Token Details

- **Algorithm:** HS256
- **Expiry:** 7 days (configurable via `JWT_EXPIRY` env var)
- **Issuer:** `api.thevacorp.com`
- **Audience:** `vcorp-network`

---

## Integration Guide

### Step 1: Whitelist Your Domain

Contact VCorp admin to add your domain to the whitelist in `lib/utils/cors.js`:

```javascript
const ALLOWED_ORIGINS = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  // ...
];
```

### Step 2: Create Registration/Sign-In UI

**Registration Example:**

```javascript
async function registerUser(userData) {
  const response = await fetch('https://api.thevacorp.com/api/external/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userData,
      redirectUrl: 'https://yourdomain.com'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    alert('Check your email to verify your account!');
  } else {
    console.error('Registration failed:', data.error);
  }
}
```

**Sign-In Example:**

```javascript
async function signIn(email) {
  const response = await fetch('https://api.thevacorp.com/api/external/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      redirectUrl: 'https://yourdomain.com'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    alert('Check your email for the sign-in link!');
  } else {
    console.error('Sign-in failed:', data.error);
  }
}
```

### Step 3: Handle Redirect with Token

Users will be redirected to: `https://yourdomain.com/dashboard?token={JWT_TOKEN}`

**Token Verification Example (Node.js):**

```javascript
const jwt = require('jsonwebtoken');

// Get JWT secret from VCorp admin
const JWT_SECRET = process.env.VCORP_JWT_SECRET;

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'api.thevacorp.com',
      audience: 'vcorp-network'
    });
    
    console.log('User authenticated:', decoded);
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error.message);
    return null;
  }
}

// In your /dashboard route
app.get('/dashboard', (req, res) => {
  const token = req.query.token;
  
  if (!token) {
    return res.redirect('/login');
  }
  
  const user = verifyToken(token);
  
  if (!user) {
    return res.redirect('/login');
  }
  
  // Store token in session/cookie for subsequent requests
  req.session.user = user;
  req.session.token = token;
  
  // Render dashboard with user data
  res.render('dashboard', { user });
});
```

**Client-Side Example (Next.js):**

```javascript
// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = router.query.token;
    
    if (token) {
      // Verify token with your backend
      fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          // Store token in localStorage or cookie
          localStorage.setItem('authToken', token);
          // Remove token from URL
          router.replace('/dashboard', undefined, { shallow: true });
        } else {
          router.push('/login');
        }
      });
    } else {
      // Check if token exists in storage
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        // Verify stored token
        // ...
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {/* Your dashboard content */}
    </div>
  );
}
```

---

## Security Considerations

### 1. Token Storage
- **Client-side:** Use `httpOnly` cookies or secure `localStorage`
- **Server-side:** Store in secure session management system
- Never expose tokens in URLs after initial redirect

### 2. Token Validation
- Always verify tokens server-side before granting access
- Check token expiry and signature
- Validate issuer and audience claims

### 3. HTTPS Only
- All production traffic must use HTTPS
- Never send tokens over unsecured connections

### 4. Token Refresh
- Implement token refresh before expiry (7 days default)
- Request new token from VCorp API if expired

### 5. User Data Sync
- Token contains user data snapshot at authentication time
- For real-time data, query VCorp user API (to be implemented)

---

## Testing

### Development Testing

Use `http://localhost:3000` for local testing:

```javascript
const response = await fetch('http://localhost:3000/api/external/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-01-01',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '90001'
    },
    redirectUrl: 'http://localhost:3001' // Your test site
  })
});
```

---

## Environment Variables

External sites need:

```env
# JWT Secret (get from VCorp admin)
VCORP_JWT_SECRET=your-secret-key-here

# VCorp API URL
VCORP_API_URL=https://api.thevacorp.com
# or for development:
# VCORP_API_URL=http://localhost:3000
```

VCorp site needs:

```env
# JWT Configuration
JWT_SECRET=your-secure-secret-key
JWT_EXPIRY=7d

# Email Configuration
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@thevacorp.com

# Base URLs
NEXT_PUBLIC_BASE_URL=https://api.thevacorp.com

# Database
MONGODB_URL=your-mongodb-connection-string

# Stripe
STRIPE_API_SECRET=your-stripe-secret-key
```

---

## Support

For integration support or to request domain whitelisting:

- Email: dev@thevacorp.com
- Documentation: https://docs.thevacorp.com
- GitHub: https://github.com/teamvcorp/vcorp

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Registration and sign-in endpoints
- JWT token-based authentication
- Automatic redirect with token
- CORS whitelisting
- Magic link email delivery
