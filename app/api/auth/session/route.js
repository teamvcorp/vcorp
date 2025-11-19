import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../../../lib/utils/jwt.js';
import { cookies } from 'next/headers';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';

/**
 * Get current user session from JWT cookie
 * GET /api/auth/session
 */
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('vcorp_auth_token');

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = verifyAuthToken(token.value);

    if (!decoded) {
      // Token invalid or expired - clear cookie
      const response = NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
      
      response.cookies.delete('vcorp_auth_token');
      return response;
    }

    // Fetch fresh user data from database to get latest programs
    await connectDB();
    const user = await User.findById(decoded.userId).select('email firstName lastName programs accountStatus emailVerified profileCompleteness');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return fresh user data from database
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        programs: user.programs,
        accountStatus: user.accountStatus,
        emailVerified: user.emailVerified,
        profileCompleteness: user.profileCompleteness,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check session' },
      { status: 500 }
    );
  }
}
