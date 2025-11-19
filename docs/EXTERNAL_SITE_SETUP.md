# External Site Setup Guide - VCorp Authentication

## Quick Setup Instructions

Your site will receive authenticated users from VCorp with a JWT token. Here's what you need to do:

---

## 1. Environment Variables

Add to your `.env.local` or `.env`:

```bash
VCORP_API_URL=http://localhost:3000
VCORP_JWT_SECRET=your_jwt_secret_here
```

**🔴 CRITICAL:** The `VCORP_JWT_SECRET` **MUST BE EXACTLY THE SAME** as VCorp's `JWT_SECRET`. 

Get the current secret from the VCorp admin or `.env.local` file.

---

## 2. Install JWT Package

```bash
npm install jsonwebtoken
```

---

## 3. Create Token Verification Utility

Create `lib/vcorp-auth.js`:

```javascript
import jwt from 'jsonwebtoken';

export function verifyVCorpToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.VCORP_JWT_SECRET, {
      issuer: 'api.thevacorp.com',
      audience: 'vcorp-network'
    });
    return { valid: true, user: decoded };
  } catch (error) {
    console.error('VCorp token verification failed:', error.message);
    return { valid: false, error: error.message };
  }
}

export function checkProgramAccess(user, requiredProgram) {
  if (!user || !user.programs) return false;
  
  return user.programs.some(
    (p) => p.programId === requiredProgram && p.status === 'active'
  );
}
```

---

## 4. Handle Incoming Token on Dashboard

Create or update your dashboard route to handle the `?token=` parameter:

### Next.js App Router Example (`app/dashboard/page.js`):

```javascript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams?.get('token');
    
    if (token) {
      // Send token to your API to verify and create session
      fetch('/api/auth/verify-vcorp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Remove token from URL
          router.replace('/dashboard');
          // User is now authenticated
        } else {
          // Invalid token - redirect to signin
          router.push('/signin');
        }
      })
      .catch(err => {
        console.error('Auth error:', err);
        router.push('/signin');
      });
    }
  }, [searchParams, router]);
  
  return <div>Dashboard Content</div>;
}
```

---

## 5. Create API Route to Verify Token and Store Session

Create `app/api/auth/verify-vcorp/route.js` (or `pages/api/auth/verify-vcorp.js` for Pages Router):

```javascript
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { verifyVCorpToken, checkProgramAccess } from '@/lib/vcorp-auth';

export async function POST(request) {
  const { token } = await request.json();
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No token provided' },
      { status: 400 }
    );
  }
  
  // Verify token
  const { valid, user, error } = verifyVCorpToken(token);
  
  if (!valid) {
    return NextResponse.json(
      { success: false, message: 'Invalid token', error },
      { status: 401 }
    );
  }
  
  // Check if user has access to this specific program
  const requiredProgram = 'spiritof'; // Change to your program ID
  const hasAccess = checkProgramAccess(user, requiredProgram);
  
  if (!hasAccess) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'You do not have access to this program',
        enrollmentRequired: true 
      },
      { status: 403 }
    );
  }
  
  // Store in httpOnly cookie
  const cookie = serialize('vcorp_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
  
  const response = NextResponse.json({
    success: true,
    user: {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      programs: user.programs,
      accountStatus: user.accountStatus
    }
  });
  
  response.headers.set('Set-Cookie', cookie);
  
  return response;
}
```

---

## 6. Create Sign In Flow

When users need to sign in, redirect them to VCorp:

### Sign In Button/Form Example:

```javascript
'use client';

export default function SignInPage() {
  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    
    // Send sign-in request to VCorp
    const response = await fetch(`${process.env.NEXT_PUBLIC_VCORP_API_URL}/api/external/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        redirectUrl: window.location.origin // Your site URL
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Check your email for the sign-in link!');
    } else {
      alert(data.message || 'Sign-in failed');
    }
  };
  
  return (
    <form onSubmit={handleSignIn}>
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        required 
      />
      <button type="submit">Sign In with VCorp</button>
    </form>
  );
}
```

---

## 7. Program ID Reference

Make sure you're checking for the correct program ID:

| Site Domain | Program ID | Program Name |
|------------|------------|--------------|
| spiritof.com | `spiritof` | Spirit Of |
| fyht4.com | `fyht4` | Fyht4 |
| edynsgate.com | `edynsgate` | Edyns Gate |
| thevacorp.com | `homeschool` | Homeschool |
| (taekwondo site) | `taekwondo` | Taekwondo Academy |

Update `requiredProgram` in your verification route to match your site.

---

## 8. JWT Token Structure

When you decode the token, you'll receive:

```javascript
{
  userId: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  programs: [
    {
      programId: "spiritof",
      tier: "Basic",
      enrolledAt: "2025-01-15T10:30:00.000Z",
      status: "active"
    }
  ],
  accountStatus: "active",
  emailVerified: true,
  iat: 1704197400,        // Issued at
  exp: 1704802200,        // Expires at (7 days)
  iss: "api.thevacorp.com",
  aud: "vcorp-network"
}
```

---

## 9. Testing Locally

1. Start VCorp on `localhost:3000`
2. Start your site on `localhost:3001` (or another port)
3. Update VCorp's CORS whitelist to include your local URL
4. Test the sign-in flow:
   - Click "Sign In" on your site
   - Check email for magic link
   - Click link → redirects to your site with token
   - Token is verified and session created

---

## 10. Security Checklist

✅ Store JWT in **httpOnly cookies** (never localStorage)  
✅ Use **HTTPS** in production (never HTTP)  
✅ Keep **JWT_SECRET secure** (never commit to git)  
✅ Validate **token expiry** server-side  
✅ Check **issuer and audience** when verifying  
✅ Verify **program enrollment** before granting access  
✅ Handle **expired tokens** gracefully (redirect to sign-in)

---

## Common Issues

### "Invalid Token" Error
- **Cause:** JWT_SECRET mismatch between VCorp and your site
- **Fix:** Ensure both sites have EXACTLY the same JWT_SECRET

### "You do not have access to this program"
- **Cause:** User not enrolled in your program
- **Fix:** User needs to visit VCorp dashboard and enroll in your program

### CORS Error
- **Cause:** Your domain not whitelisted in VCorp
- **Fix:** Contact VCorp admin to add your domain to `/lib/utils/cors.js`

---

## Support

If you encounter issues:
1. Check that JWT_SECRET matches VCorp exactly
2. Verify your program ID is correct
3. Confirm your domain is whitelisted in VCorp's CORS
4. Check browser console for detailed error messages

**Contact:** VCorp admin team
