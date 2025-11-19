import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';

export async function GET(request) {
  try {
    await connectDB();

    // TODO: Get userId from session/auth token
    // For now, we'll use email from query params for testing
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('-pinCode -verificationToken');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        emailVerified: user.emailVerified,
        accountStatus: user.accountStatus,
        programs: user.programs,
        identityVerified: user.identityVerified,
        profileCompleteness: user.profileCompleteness,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
