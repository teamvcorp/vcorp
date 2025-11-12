import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';

export async function POST(request) {
  try {
    const { token, email } = await request.json();

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

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
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

    console.log('✅ Email verified for user:', user.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! Welcome to VCorp.',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
