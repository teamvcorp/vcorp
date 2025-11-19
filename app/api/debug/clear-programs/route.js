import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';

/**
 * Debug endpoint to clear all programs from a user
 * DELETE /api/debug/clear-programs?email=user@example.com
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('🗑️ Clearing programs for user:', email);
    console.log('📋 Programs before clear:', user.programs);

    // Clear programs array
    user.programs = [];
    await user.save();

    console.log('✅ Programs cleared successfully');

    return NextResponse.json({
      success: true,
      message: 'Programs cleared successfully',
      programs: user.programs,
    });
  } catch (error) {
    console.error('Clear programs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear programs' },
      { status: 500 }
    );
  }
}

/**
 * Debug endpoint to view user's current programs
 * GET /api/debug/clear-programs?email=user@example.com
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('email programs');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      email: user.email,
      programs: user.programs,
      count: user.programs.length,
    });
  } catch (error) {
    console.error('Get programs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get programs' },
      { status: 500 }
    );
  }
}
