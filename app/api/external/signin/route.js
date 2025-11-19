import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';
import crypto from 'crypto';
import { Resend } from 'resend';
import { configureCORS, handleCORSPreflight, validateRedirectUrl } from '../../../../lib/utils/cors.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Handle OPTIONS preflight
export async function OPTIONS(request) {
  return handleCORSPreflight(request);
}

/**
 * External Sign-In API (Passwordless Magic Link)
 * POST /api/external/signin
 * 
 * Request body:
 * {
 *   email: string,
 *   redirectUrl: string (URL to redirect after authentication)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
export async function POST(request) {
  try {
    const corsHeaders = configureCORS(request);
    const body = await request.json();
    const { email, redirectUrl, program, tier } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!program) {
      return NextResponse.json(
        { 
          error: 'Program is required. Please specify which program you are accessing.',
          code: 'PROGRAM_REQUIRED'
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate and sanitize redirect URL
    const validRedirectUrl = validateRedirectUrl(redirectUrl);
    if (!validRedirectUrl) {
      return NextResponse.json(
        { error: 'Invalid or unauthorized redirect URL' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if user exists or not
      return NextResponse.json(
        { 
          success: true, 
          message: 'If an account exists with this email, a sign-in link has been sent.' 
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email not verified. Please check your email for the verification link or register again.',
          code: 'EMAIL_NOT_VERIFIED'
        },
        { status: 403, headers: corsHeaders }
      );
    }

    // Check account status
    if (user.accountStatus !== 'active') {
      return NextResponse.json(
        { 
          error: 'Account is not active. Please contact support.',
          code: 'ACCOUNT_INACTIVE'
        },
        { status: 403, headers: corsHeaders }
      );
    }

    // Check if user has the requested program
    const existingProgram = user.programs.find(p => p.programId === program);
    if (!existingProgram) {
      // Add program as pending - user needs to complete onboarding
      user.programs.push({
        programId: program,
        tier: tier || null,
        enrolledAt: new Date(),
        status: 'pending',
      });
      console.log(`➕ Added ${program} as pending for existing user ${email}`);
    } else if (existingProgram.status !== 'active') {
      console.log(`⚠️ User has ${program} but status is ${existingProgram.status}`);
    }

    // Generate verification token for magic link
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Generate magic link with redirect URL
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    const magicLink = `${baseUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(validRedirectUrl)}`;

    // Send magic link via email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'VCorp <onboarding@resend.dev>',
        to: email.toLowerCase(),
        subject: 'VCorp - Sign In to Your Account',
        html: generateSignInEmail(user.firstName, magicLink),
      });
    } catch (emailError) {
      console.error('❌ Failed to send sign-in email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send sign-in email. Please try again.' },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('🔗 External sign-in - Magic Link:', magicLink);
    console.log('🔄 Will redirect to:', validRedirectUrl);

    return NextResponse.json(
      {
        success: true,
        message: 'Sign-in link sent! Check your email.',
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('External sign-in error:', error);

    const corsHeaders = configureCORS(request);

    return NextResponse.json(
      { error: 'Sign-in failed. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Extract program identifier from URL
 * Examples: fyht4.com -> fyht4, spiritof.com -> spiritof
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

/**
 * Generate enrollment email HTML
 */
function generateEnrollmentEmail(firstName, program, magicLink) {
  const programNames = {
    spiritof: 'Spirit Of',
    fyht4: 'Fyht4',
    taekwondo: 'Taekwondo Academy',
    edynsgate: 'Edyns Gate',
    homeschool: 'Homeschool',
  };

  const programName = programNames[program] || program;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1A1A2E 0%, #0A0A0A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: #00F0FF; margin: 0; font-size: 32px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 40px; background: #00F0FF; color: #0A0A0A; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .info-box { background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196F3; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Program Enrollment Required</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>You're trying to access <strong>${programName}</strong>, but you're not currently enrolled in this program.</p>
            <div class="info-box">
              <p style="margin: 0;"><strong>📋 What's Next?</strong></p>
              <p style="margin: 5px 0 0 0;">Click the button below to visit your VCorp dashboard and enroll in ${programName}. Once enrolled, you'll be automatically redirected back.</p>
            </div>
            <div style="text-align: center;">
              <a href="${magicLink}" class="button">Go to Dashboard</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${magicLink}</p>
            <p><strong>This link expires in 24 hours.</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} The Von Der Becke Academy Corp. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate sign-in email HTML
 */
function generateSignInEmail(firstName, magicLink) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1A1A2E 0%, #0A0A0A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: #00F0FF; margin: 0; font-size: 32px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 40px; background: #00F0FF; color: #0A0A0A; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VCorp Sign In</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Click the button below to sign in to your VCorp account:</p>
            <div style="text-align: center;">
              <a href="${magicLink}" class="button">Sign In to VCorp</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${magicLink}</p>
            <div class="warning">
              <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
              <p style="margin: 5px 0 0 0;">This link expires in 24 hours. If you didn't request this sign-in link, please ignore this email and consider changing your password.</p>
            </div>
            <p>After signing in, you'll be automatically redirected to your dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} The Von Der Becke Academy Corp. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
