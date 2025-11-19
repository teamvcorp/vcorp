import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';
import { generateAuthToken } from '../../../../lib/utils/jwt.js';
import { validateRedirectUrl } from '../../../../lib/utils/cors.js';

/**
 * Extract program identifier from URL
 * For testing: localhost:3001 -> spiritof, localhost:3002 -> fyht4, etc.
 */
function extractProgramFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const port = urlObj.port;
    
    // For localhost testing - map ports to programs
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const portMap = {
        '3001': 'spiritof',
        '3002': 'fyht4',
        '3003': 'taekwondo',
        '3004': 'edynsgate',
        '3005': 'homeschool',
      };
      return portMap[port] || null;
    }
    
    // Map production domains to program IDs
    const domainMap = {
      'fyht4.com': 'fyht4',
      'spiritof.com': 'spiritof',
      'edynsgate.com': 'edynsgate',
      'thevacorp.com': 'homeschool',
    };

    // Check if hostname matches any program domain
    for (const [domain, programId] of Object.entries(domainMap)) {
      if (hostname.includes(domain)) {
        return programId;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting program from URL:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { token, email, redirectUrl } = await request.json();

    // Verification request received

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing token or email' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find user by email and token
    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationToken: token,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification link or email' },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (user.verificationTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Verification link has expired. Please register again.' },
        { status: 410 }
      );
    }

    // Check if already verified and redirect URL provided (re-authentication)
    if (user.emailVerified && redirectUrl) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Validate redirect URL
      const validRedirectUrl = validateRedirectUrl(redirectUrl);
      if (!validRedirectUrl) {
        return NextResponse.json(
          { error: 'Invalid redirect URL' },
          { status: 400 }
        );
      }

      // Extract program from redirect URL and check enrollment
      const programFromUrl = extractProgramFromUrl(validRedirectUrl);
      console.log('🔍 Program from URL:', programFromUrl);
      console.log('👤 User programs:', JSON.stringify(user.programs, null, 2));
      
      if (programFromUrl) {
        const isEnrolled = user.programs.some(
          (p) => p.programId === programFromUrl && p.status === 'active'
        );
        
        console.log(`✅ Is user enrolled in ${programFromUrl}?`, isEnrolled);

        if (!isEnrolled) {
          // User not enrolled - redirect to dashboard for enrollment
          const host = request.headers.get('host');
          const protocol = request.headers.get('x-forwarded-proto') || 'https';
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
          const dashboardUrl = `${baseUrl}/user/dashboard`;
          const enrollRedirect = `${dashboardUrl}?enroll=${programFromUrl}&returnTo=${encodeURIComponent(validRedirectUrl)}`;
          
          console.log('🔄 Redirecting to onboarding:', enrollRedirect);

          // Generate JWT token and set cookie
          const authToken = generateAuthToken(user);
          const response = NextResponse.json(
            { 
              success: true,
              message: 'Please enroll in the required program to continue.',
              requiresEnrollment: true,
              program: programFromUrl,
              redirectUrl: enrollRedirect
            },
            { status: 200 }
          );
          
          // Set HTTP-only cookie
          response.cookies.set('vcorp_auth_token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
          });

          return response;
        }
      }

      // Generate JWT token
      const authToken = generateAuthToken(user);

      const response = NextResponse.json(
        { 
          success: true,
          message: 'Email already verified! Redirecting to dashboard...',
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          authToken,
          redirectUrl: `${validRedirectUrl}/dashboard?token=${authToken}`
        },
        { status: 200 }
      );
      
      // Set HTTP-only cookie
      response.cookies.set('vcorp_auth_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      return response;
    }

    // Check if already verified (no redirect)
    if (user.emailVerified) {
      const authToken = generateAuthToken(user);
      const response = NextResponse.json(
        { 
          success: true,
          message: 'Email already verified! Redirecting to dashboard...',
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        },
        { status: 200 }
      );
      
      // Set HTTP-only cookie
      response.cookies.set('vcorp_auth_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      return response;
    }

    // Verify the email
    user.emailVerified = new Date();
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    user.accountStatus = 'active';
    user.lastLogin = new Date();
    
    // Recalculate profile completeness
    user.calculateProfileCompleteness();
    
    await user.save();

    // If redirect URL provided, validate and check enrollment
    if (redirectUrl) {
      const validRedirectUrl = validateRedirectUrl(redirectUrl);
      if (!validRedirectUrl) {
        return NextResponse.json(
          { error: 'Invalid redirect URL' },
          { status: 400 }
        );
      }

      // Extract program from redirect URL and check enrollment
      const programFromUrl = extractProgramFromUrl(validRedirectUrl);
      
      if (programFromUrl) {
        const isEnrolled = user.programs.some(
          (p) => p.programId === programFromUrl && p.status === 'active'
        );
        if (!isEnrolled) {
          // User not enrolled - redirect to dashboard for enrollment
          const host = request.headers.get('host');
          const protocol = request.headers.get('x-forwarded-proto') || 'https';
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
          const dashboardUrl = `${baseUrl}/user/dashboard`;
          const enrollRedirect = `${dashboardUrl}?enroll=${programFromUrl}&returnTo=${encodeURIComponent(validRedirectUrl)}`;

          const authToken = generateAuthToken(user);
          const response = NextResponse.json(
            { 
              success: true,
              message: 'Please enroll in the required program to continue.',
              requiresEnrollment: true,
              program: programFromUrl,
              redirectUrl: enrollRedirect
            },
            { status: 200 }
          );
          
          // Set HTTP-only cookie
          response.cookies.set('vcorp_auth_token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
          });

          return response;
        }
      }

      // Generate JWT token for authentication
      const authToken = generateAuthToken(user);

      const response = NextResponse.json(
        {
          success: true,
          message: 'Email verified successfully! Welcome to VCorp.',
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          authToken,
          redirectUrl: `${validRedirectUrl}/dashboard?token=${authToken}`
        },
        { status: 200 }
      );
      
      // Set HTTP-only cookie
      response.cookies.set('vcorp_auth_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      return response;
    }

    // No redirect URL - standard verification response
    // Generate JWT token for authentication
    const authToken = generateAuthToken(user);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! Welcome to VCorp.',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        authToken
      },
      { status: 200 }
    );
    
    // Set HTTP-only cookie
    response.cookies.set('vcorp_auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
