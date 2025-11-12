import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, pin } = await request.json();

    if (!email || !pin) {
      return NextResponse.json(
        { error: 'Email and PIN are required' },
        { status: 400 }
      );
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: 'Invalid PIN format. Must be 6 digits.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid PIN or email' },
        { status: 401 }
      );
    }

    // Check if user has a PIN code
    if (!user.pinCode) {
      return NextResponse.json(
        { error: 'No PIN code found. Please request a new one.' },
        { status: 401 }
      );
    }

    // Check if PIN has expired (5 minutes)
    if (user.pinCodeExpiry < new Date()) {
      return NextResponse.json(
        { error: 'PIN has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    // Compare the provided PIN with the hashed PIN
    const isPinValid = await bcrypt.compare(pin, user.pinCode);

    if (!isPinValid) {
      return NextResponse.json(
        { error: 'Invalid PIN or email' },
        { status: 401 }
      );
    }

    // Verify email if not already verified
    if (!user.emailVerified) {
      user.emailVerified = new Date();
    }

    // Clear PIN after successful verification
    user.pinCode = null;
    user.pinCodeExpiry = null;
    user.accountStatus = 'active';
    user.lastLogin = new Date();
    
    // Recalculate profile completeness
    user.calculateProfileCompleteness();
    
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'PIN verified successfully! Redirecting to dashboard...',
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
    console.error('PIN verification error:', error);
    return NextResponse.json(
      { error: 'PIN verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
