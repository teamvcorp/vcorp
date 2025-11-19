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

    const user = await User.findOne({ email }).select('programs');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      programs: user.programs,
    });
  } catch (error) {
    console.error('Get programs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, programs } = body;

    if (!email || !programs) {
      return NextResponse.json(
        { success: false, message: 'Email and programs are required' },
        { status: 400 }
      );
    }

    // Validate program IDs
    const validProgramIds = ['spiritof', 'fyht4', 'taekwondo', 'edynsgate', 'homeschool'];
    const invalidPrograms = programs.filter(
      (p) => !validProgramIds.includes(p.programId)
    );

    if (invalidPrograms.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid program IDs: ${invalidPrograms.map((p) => p.programId).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update programs array - merge with existing programs
    const existingProgramIds = user.programs.map((p) => p.programId);
    const newPrograms = programs.filter(
      (p) => !existingProgramIds.includes(p.programId)
    );

    // Add new programs with default values
    const programsToAdd = newPrograms.map((p) => ({
      programId: p.programId,
      tier: p.tier || null,
      enrolledAt: new Date(),
      status: 'active',
      programData: p.programData || {},
    }));

    user.programs.push(...programsToAdd);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Programs updated successfully',
      programs: user.programs,
    });
  } catch (error) {
    console.error('Update programs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update programs' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const programId = searchParams.get('programId');

    if (!email || !programId) {
      return NextResponse.json(
        { success: false, message: 'Email and programId are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove program from array
    user.programs = user.programs.filter((p) => p.programId !== programId);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Program removed successfully',
      programs: user.programs,
    });
  } catch (error) {
    console.error('Delete program error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove program' },
      { status: 500 }
    );
  }
}
