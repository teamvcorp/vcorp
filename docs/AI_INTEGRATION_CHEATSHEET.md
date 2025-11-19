# VCorp Authentication Integration - AI Cheatsheet

## Quick Overview
VCorp (api.thevacorp.com) is the central authentication hub for all managed sites. Users register once on VCorp, then authenticate across all sites using JWT tokens. **Program enrollment requires completing onboarding on VCorp dashboard before accessing external sites.**

## Authentication & Enrollment Flow
```
External Site → VCorp API → Email Magic Link → VCorp Verification
  ├─ If enrolled: → Redirect with JWT → External Site Dashboard
  └─ If NOT enrolled: → VCorp Dashboard → Complete Onboarding → Redirect with JWT
```

## Program IDs (Valid Values)
The following program IDs are supported:
- `spiritof` - Spirit of Peace Taekwondo
- `fyht4` - Fight 4 Health Training
- `taekwondo` - Traditional Taekwondo Programs
- `edynsgate` - Edyn's Gate Community
- `homeschool` - VCorp Homeschool Program

## Localhost Testing Ports
For local development, programs map to specific ports:
- Port **3001** = spiritof
- Port **3002** = fyht4
- Port **3003** = taekwondo
- Port **3004** = edynsgate
- Port **3005** = homeschool
- Port **3000** = VCorp main site

## Required Environment Variables
```bash
VCORP_API_URL=https://api.thevacorp.com  # or http://localhost:3000 for local
VCORP_JWT_SECRET=<same-secret-as-vcorp>  # Must match VCorp's JWT_SECRET
```

## API Endpoints

### 1. Registration (New Users)
**POST** `{VCORP_API_URL}/api/external/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "dateOfBirth": "1990-01-15",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "program": "program-slug",
  "tier": "Basic",
  "redirectUrl": "https://yoursite.com"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "userId": "507f1f77bcf86cd799439011"
}
```

### 2. Sign In (Existing Users)
**POST** `{VCORP_API_URL}/api/external/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "redirectUrl": "https://yoursite.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent. Please check your inbox."
}
```

## Handling the JWT Token & Enrollment

### After User Clicks Magic Link

**Scenario 1: User IS enrolled in the program**
VCorp redirects to: `{redirectUrl}/dashboard?token={JWT_TOKEN}`

**Scenario 2: User is NOT enrolled in the program**
VCorp redirects to its own dashboard with enrollment prompt:
```
https://api.thevacorp.com/user/dashboard?enroll={programId}&returnTo={redirectUrl}
```
User completes onboarding, then VCorp redirects to: `{redirectUrl}/dashboard?token={JWT_TOKEN}`

### Important: Enrollment Check Logic
When a user signs in from your site:
1. VCorp extracts the program ID from your `redirectUrl` domain/port
2. Checks if user has that program in their `programs` array with `status: 'active'`
3. If NOT enrolled:
   - Redirects to VCorp dashboard for onboarding
   - User completes program-specific onboarding form (including Stripe payment setup)
   - Program is added to their database record
   - Then redirects back to your site with JWT
4. If enrolled: Immediately redirects with JWT

**Key Takeaway:** Programs are only added to `user.programs[]` AFTER completing full onboarding on VCorp dashboard, including payment method setup. Payment methods are stored in the User collection and shared across all programs.

### Verify Token Server-Side
```javascript
import jwt from 'jsonwebtoken';

function verifyVCorpToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.VCORP_JWT_SECRET, {
      issuer: 'api.thevacorp.com',
      audience: 'vcorp-network'
    });
    return decoded; // Contains userId, email, firstName, lastName, programs[], accountStatus
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}
```

### JWT Token Payload
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  programs: [
    {
      programId: "program-slug",
      tier: "Basic",
      enrolledAt: "2025-01-15T10:30:00.000Z",
      status: "active"
    }
  ],
  accountStatus: "active",
  emailVerified: true,
  
  // Stripe Customer Information (NEW)
  stripeCustomerId: "cus_ABC123xyz",              // User's Stripe customer ID
  stripeDefaultPaymentMethod: "pm_ABC123xyz",     // Default payment method ID (null if not set)
  
  // Payment Methods Array (NEW)
  stripePaymentMethods: [
    {
      id: "pm_ABC123xyz",                         // Payment method ID
      type: "card",                               // "card", "bank_account", etc.
      last4: "4242",                              // Last 4 digits
      brand: "visa"                               // "visa", "mastercard", etc.
    }
  ],
  
  // JWT Standard Claims
  iat: 1704197400,
  exp: 1704802200,
  iss: "api.thevacorp.com",
  aud: "vcorp-network"
}
```

## Implementation Pattern

### 1. Registration/Login Form
```javascript
async function handleAuth(formData, isRegistration = true) {
  const endpoint = isRegistration ? '/api/external/register' : '/api/external/signin';
  const redirectUrl = `${window.location.origin}`;
  
  const response = await fetch(`${process.env.VCORP_API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      redirectUrl
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Show success message: "Check your email for verification link"
    showSuccessMessage(data.message);
  } else {
    showErrorMessage(data.message);
  }
}
```

### 2. Dashboard Route - Token Verification
```javascript
// pages/dashboard.js (Next.js example)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const { token } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // If token in URL, verify and store in cookie
    if (token) {
      fetch('/api/auth/verify-vcorp-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          // Remove token from URL for security
          router.replace('/dashboard', undefined, { shallow: true });
        } else {
          router.push('/signin');
        }
        setLoading(false);
      });
    } else {
      // No token in URL - check if we have a valid session cookie
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            router.push('/signin');
          }
          setLoading(false);
        });
    }
  }, [token]);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Enrolled Programs: {user.programs.map(p => p.programId).join(', ')}</p>
    </div>
  );
}
```

### 3. API Route - Verify Token & Store Session
```javascript
// pages/api/auth/verify-vcorp-token.js
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { token } = req.body;
  
  try {
    // Verify JWT with VCorp's signature
    const decoded = jwt.verify(token, process.env.VCORP_JWT_SECRET, {
      issuer: 'api.thevacorp.com',
      audience: 'vcorp-network'
    });
    
    // Store in httpOnly cookie for persistent authentication
    const cookie = serialize('vcorp_auth', token, {
      httpOnly: true,  // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
      sameSite: 'lax',  // CSRF protection
      maxAge: 60 * 60 * 24 * 7,  // 7 days
      path: '/'
    });
    
    res.setHeader('Set-Cookie', cookie);
    
    return res.status(200).json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        programs: decoded.programs
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}
```

### 4. API Route - Session Validation
```javascript
// pages/api/auth/session.js
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Parse cookies from request
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.vcorp_auth;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No session found'
    });
  }
  
  try {
    // Verify JWT from cookie
    const decoded = jwt.verify(token, process.env.VCORP_JWT_SECRET, {
      issuer: 'api.thevacorp.com',
      audience: 'vcorp-network'
    });
    
    // Return user data from token
    return res.status(200).json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        programs: decoded.programs
      }
    });
  } catch (error) {
    // Token invalid or expired - clear cookie
    const clearCookie = serialize('vcorp_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    
    res.setHeader('Set-Cookie', clearCookie);
    
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid'
    });
  }
}
```

## Security Checklist

✅ **Store JWT in httpOnly cookies** (not localStorage) - Prevents XSS attacks  
✅ **Always verify token server-side** before trusting user data  
✅ **Use HTTPS in production** (never HTTP) - Required for secure cookies  
✅ **Keep JWT_SECRET secure** (never commit to git) - Must match VCorp exactly  
✅ **Validate token expiry** (exp claim) - Tokens expire after 7 days  
✅ **Check issuer and audience** (iss: api.thevacorp.com, aud: vcorp-network)  
✅ **Implement session validation** - Create `/api/auth/session` endpoint to check cookie  
✅ **Clear cookies on logout** - Set maxAge: 0 to expire cookie  
✅ **Use sameSite: 'lax'** - CSRF protection for cross-site requests

## Common Errors

### "CORS Error"
**Solution:** VCorp must whitelist your domain in `/lib/utils/cors.js`  
Contact VCorp admin to add your domain to `ALLOWED_ORIGINS`

### "Invalid Token"
**Causes:**
- Token expired (7 days)
- JWT_SECRET mismatch between sites
- Token tampered with

### "Redirect Failed"
**Solution:** Ensure `redirectUrl` is an absolute URL (https://yoursite.com, not /dashboard)

### "User Not Enrolled"
**Expected Behavior:** User is redirected to VCorp dashboard to complete onboarding
**Solution:** This is by design - programs require onboarding completion before access
**Testing:** Use debug endpoint to clear programs and test enrollment flow

## Domain/Port to Program Mapping

VCorp's `extractProgramFromUrl()` function maps domains and ports to program IDs:

### Production Domains
- `spiritof.com` → `spiritof`
- `fyht4.com` or `fyght4.com` → `fyht4`
- `taekwondo.` (subdomain) → `taekwondo`
- `edynsgate.com` or `edyensgate.com` → `edynsgate`
- `homeschool.` (subdomain) → `homeschool`

### Localhost Ports (Testing)
- `localhost:3001` → `spiritof`
- `localhost:3002` → `fyht4`
- `localhost:3003` → `taekwondo`
- `localhost:3004` → `edynsgate`
- `localhost:3005` → `homeschool`

**Example:** When user signs in from `http://localhost:3001`, VCorp knows they want `spiritof` program

## Testing Locally

### 1. Start VCorp (Port 3000)
```bash
cd vcorp
npm run dev  # Runs on localhost:3000
```

### 2. Start Your Site (Specific Port)
Use port numbers that match program IDs (see port mapping above):
```bash
cd your-site
PORT=3001 npm run dev  # For spiritof
PORT=3002 npm run dev  # For fyht4
# etc.
```

### 3. Test Registration Flow
```bash
curl -X POST http://localhost:3000/api/external/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "(555) 000-0000",
    "dateOfBirth": "1990-01-01",
    "address": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "CA",
      "zipCode": "90000"
    },
    "program": "spiritof",
    "tier": "Basic",
    "redirectUrl": "http://localhost:3001"
  }'
```

### 4. Test Sign-In Flow (Existing User)
```bash
curl -X POST http://localhost:3000/api/external/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "redirectUrl": "http://localhost:3001"
  }'
```

### 5. Check Email & Click Magic Link
Email will contain link to VCorp verification page.

**If user is enrolled:** Redirects to:
```
http://localhost:3001/dashboard?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If user is NOT enrolled:** Redirects to:
```
http://localhost:3000/user/dashboard?enroll=spiritof&returnTo=http://localhost:3001
```
User completes onboarding, then redirects to your site with token.

### 6. Debug Endpoint (Testing Only)
To test enrollment flow, you may need to clear programs:

**GET user's programs:**
```bash
curl http://localhost:3000/api/debug/clear-programs?email=test@example.com
```

**DELETE all programs:**
```bash
curl -X DELETE http://localhost:3000/api/debug/clear-programs?email=test@example.com
```

⚠️ **IMPORTANT:** Remove this endpoint before production deployment!

## Quick Reference

| Action | Endpoint | Method | Redirect Destination |
|--------|----------|--------|---------------------|
| Register | `/api/external/register` | POST | `{redirectUrl}/dashboard?token={JWT}` |
| Sign In | `/api/external/signin` | POST | `{redirectUrl}/dashboard?token={JWT}` |
| Verify Token | `/api/auth/verify-vcorp-token` | POST | Stores JWT in httpOnly cookie |
| Check Session | `/api/auth/session` | GET | Validates cookie, returns user data |
| Logout | `/api/auth/logout` | POST | Clears httpOnly cookie |

## VCorp Domain Whitelist
Current whitelisted domains (as of setup):
- `localhost:3000` through `localhost:3010`
- `thevacorp.com` and all subdomains
- `fyght4.com` and `fyht4.com`
- `spiritof.com`
- `edynsgate.com` and `edyensgate.com`
- `taekwondo.*` domains

**To add new domain:** Contact VCorp admin or update `/lib/utils/cors.js`

## Enrollment & Onboarding Architecture

### User Database Schema
```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  emailVerified: true,
  programs: [
    {
      programId: "spiritof",  // Must be one of: spiritof, fyht4, taekwondo, edynsgate, homeschool
      tier: "Basic",
      enrolledAt: Date,
      status: "active",  // active | inactive | suspended
      programData: {}  // Program-specific data
    }
  ],
  accountStatus: "active"
}
```

### Onboarding Flow (VCorp Side)
1. User clicks "Start Onboarding" from VCorp dashboard
2. Navigates to `/onboarding/{programId}?returnTo={externalSiteUrl}`
3. User completes program-specific onboarding form (requirements vary by program)
4. On submission, VCorp POSTs to `/api/user/programs`:
   ```json
   {
     "programIds": ["spiritof"],
     "tier": "Basic"
   }
   ```
5. Program added to `user.programs[]` array in database
6. Redirects to external site with JWT token

### Your Site Responsibilities
- **Signin/Register:** POST to VCorp with `redirectUrl`
- **Token Verification:** Verify JWT and extract `programs[]` array
- **Access Control:** Check if user has your program in `programs[]` with `status: 'active'`
- **Trust VCorp:** Don't implement your own onboarding - VCorp handles it

## Support
For integration issues, provide:
1. Your site URL and program ID
2. Error message/response
3. Request payload (without sensitive data)
4. Expected behavior
5. Whether user completed onboarding on VCorp

---

**Last Updated:** January 15, 2025  
**VCorp Version:** 1.1.0 (Enrollment System)  
**Contact:** api.thevacorp.com

### Implementation Checklist

### For External Site Developers
- [ ] Add VCorp API URL and JWT_SECRET to environment variables
- [ ] Implement registration form that POSTs to `/api/external/register`
- [ ] Implement signin form that POSTs to `/api/external/signin`
- [ ] Create `/dashboard` route to receive JWT token from query params
- [ ] Create `/api/auth/verify-vcorp-token` endpoint to verify JWT and store in httpOnly cookie
- [ ] Create `/api/auth/session` endpoint to validate existing cookie sessions
- [ ] Create `/api/auth/logout` endpoint to clear authentication cookie
- [ ] Verify JWT server-side using `jwt.verify()` with correct issuer/audience
- [ ] Extract `programs[]` array from decoded JWT
- [ ] Check if user has your program ID in `programs[]` with `status: 'active'`
- [ ] Store JWT in httpOnly cookie (NOT localStorage) with secure/sameSite flags
- [ ] Implement session persistence - check cookie on page load before redirecting to signin
- [ ] Handle enrollment redirect gracefully (user will return with token after onboarding)
- [ ] Use correct localhost port for testing (see port mapping table)
- [ ] Request domain whitelisting from VCorp admin

### For VCorp Admin
- [ ] Add external site domain to CORS whitelist in `/lib/utils/cors.js`
- [ ] Update `extractProgramFromUrl()` if new domain pattern needed
- [ ] Create program-specific onboarding form in `/app/onboarding/[programId]/page.tsx`
- [ ] Test enrollment flow end-to-end
- [ ] Remove `/api/debug/clear-programs` endpoint before production
- [ ] Verify no sensitive console.logs in production build
- [ ] Ensure JWT_SECRET is set in production environment variables
