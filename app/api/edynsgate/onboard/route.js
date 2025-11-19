import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';
import EdynsGateParent, { EdynsGateStudent } from '../../../../lib/models/EdynsGate.js';

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

export async function POST(req) {
  try {
    await connectDB();

    const { userId, email, formData } = await req.json();

    if (!userId || !email || !formData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if parent account already exists
    let parent = await EdynsGateParent.findOne({ userId });

    if (parent) {
      return NextResponse.json(
        { success: false, message: 'EdynsGate account already exists' },
        { status: 400 }
      );
    }

    // Get user to access Stripe customer ID
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { success: false, message: 'User or Stripe customer not found' },
        { status: 404 }
      );
    }

    // Verify payment method is already attached
    if (!user.stripePaymentMethodId) {
      return NextResponse.json(
        { success: false, message: 'Payment method not found. Please complete payment setup first.' },
        { status: 400 }
      );
    }

    const paymentMethodId = user.stripePaymentMethodId;
    const paymentMethodLast4 = user.paymentMethodLast4;
    const paymentMethodBrand = user.paymentMethodBrand;

    // Calculate next billing date based on subscription frequency
    const now = new Date();
    const nextBillingDate = formData.subscription.frequency === 'yearly'
      ? new Date(now.setFullYear(now.getFullYear() + 1))
      : new Date(now.setMonth(now.getMonth() + 1));

    // Create parent account
    parent = new EdynsGateParent({
      userId,
      email,
      subscriptionTier: formData.subscription.tier || 'basic',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      nextBillingDate,
      billingCycle: formData.subscription.frequency || 'monthly',
      autoCharge: {
        enabled: formData.subscription.autoCharge !== false,
        amount: formData.subscription.amount || 0,
        frequency: formData.subscription.frequency || 'monthly',
        nextChargeDate: nextBillingDate,
      },
      preferences: {
        emailNotifications: formData.preferences?.emailNotifications !== false,
        weeklyReports: formData.preferences?.weeklyReports !== false,
        learningReminders: formData.preferences?.learningReminders !== false,
      },
      status: 'active',
    });

    await parent.save();

    // If initial payment required, charge now
    let chargeSuccess = false;
    if (formData.subscription.amount > 0 && formData.subscription.autoCharge !== false) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(formData.subscription.amount * 100),
          currency: 'usd',
          customer: user.stripeCustomerId,
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          description: `EdynsGate ${formData.subscription.tier} Subscription - Initial Payment`,
          metadata: {
            userId: userId.toString(),
            parentId: parent._id.toString(),
            programId: 'edynsgate',
            subscriptionTier: formData.subscription.tier,
          },
        });

        if (paymentIntent.status === 'succeeded') {
          chargeSuccess = true;
          parent.autoCharge.lastChargeDate = new Date();
          await parent.save();
        }
      } catch (chargeError) {
        console.error('❌ Initial charge failed:', chargeError);
        // Continue with onboarding even if charge fails
      }
    }

    // Create students and link to parent
    const studentIds = [];
    if (formData.students && formData.students.length > 0) {
      for (const studentData of formData.students) {
        const student = new EdynsGateStudent({
          parentId: parent._id,
          parentEmail: email,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          dateOfBirth: new Date(studentData.dateOfBirth),
          grade: studentData.grade,
          learningLevel: studentData.learningLevel || 'beginner',
          subjects: studentData.subjects || [],
          learningGoals: studentData.learningGoals || '',
          status: 'active',
        });

        await student.save();
        studentIds.push(student._id);
      }

      // Update parent with student references
      parent.studentIds = studentIds;
      await parent.save();
    }

    // Add or update program in user's programs array
    const existingProgram = user.programs.find(p => p.programId === 'edynsgate');
    if (existingProgram) {
      // Update existing program to active
      existingProgram.status = 'active';
      existingProgram.tier = formData.subscription.tier || 'basic';
      existingProgram.programData = {
        edynsgateParentId: parent._id.toString(),
        subscriptionTier: formData.subscription.tier,
      };
    } else {
      // Add new program
      user.programs.push({
        programId: 'edynsgate',
        tier: formData.subscription.tier || 'basic',
        enrolledAt: new Date(),
        status: 'active',
        programData: {
          edynsgateParentId: parent._id.toString(),
          subscriptionTier: formData.subscription.tier,
        },
      });
    }
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'EdynsGate account created successfully',
        parentId: parent._id,
        studentCount: studentIds.length,
        chargeSuccess,
        paymentMethod: {
          last4: paymentMethodLast4,
          brand: paymentMethodBrand,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ EdynsGate onboarding error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create EdynsGate account' },
      { status: 500 }
    );
  }
}
