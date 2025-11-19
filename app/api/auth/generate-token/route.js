import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';
import { generateAuthToken } from '../../../../lib/utils/jwt.js';

/**
 * Generate a fresh JWT token for a user (typically after onboarding)
 * POST /api/auth/generate-token
 */
export async function POST(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch fresh user data from database
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate JWT token with latest user data
    const token = generateAuthToken(user);

    return NextResponse.json({
      success: true,
      token,
      message: 'Token generated successfully',
    });
  } catch (error) {
    console.error('Generate token error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
