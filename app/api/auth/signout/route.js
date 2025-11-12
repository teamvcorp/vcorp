import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // TODO: Clear session/auth cookies when NextAuth is implemented
    
    console.log('✅ User signed out');

    return NextResponse.json(
      {
        success: true,
        message: 'Signed out successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Sign out failed' },
      { status: 500 }
    );
  }
}
