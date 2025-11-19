import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';
import SpiritOfParent, { SpiritOfChild } from '../../../../lib/models/SpiritOfStudent';

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
    let parent = await SpiritOfParent.findOne({ userId });

    if (parent) {
      return NextResponse.json(
        { success: false, message: 'SpiritOf account already exists' },
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

    // Calculate initial magic points if auto-bill is enabled
    const initialMagicPoints = formData.autoBill.enabled 
      ? formData.autoBill.amount * 100 
      : 0;

    // Create parent account
    parent = new SpiritOfParent({
      userId,
      email,
      budgetSettings: {
        weeklyAllowance: 0,
        savingsGoal: 0,
        autoAllowance: false,
      },
      autoCharge: {
        enabled: formData.autoBill.enabled,
        amount: formData.autoBill.amount,
        frequency: formData.autoBill.frequency,
        nextChargeDate: formData.autoBill.enabled ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      },
      balance: {
        current: initialMagicPoints,
        pendingCharges: 0,
        lastUpdated: new Date(),
      },
      membershipStatus: 'active',
      membershipTier: 'family',
      membershipStartDate: new Date(),
    });

    await parent.save();

    // If auto-bill enabled and amount > 0, charge immediately
    let chargeSuccess = false;
    if (formData.autoBill.enabled && formData.autoBill.amount > 0) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(formData.autoBill.amount * 100),
          currency: 'usd',
          customer: user.stripeCustomerId,
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          description: 'SpiritOf Initial Magic Points Purchase',
          metadata: {
            userId: userId.toString(),
            parentId: parent._id.toString(),
            magicPoints: initialMagicPoints.toString(),
            programId: 'spiritof',
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

    // Create children and link to parent
    const childIds = [];
    for (const childData of formData.children) {
      const child = new SpiritOfChild({
        parentId: parent._id,
        parentEmail: email,
        firstName: childData.firstName,
        lastName: childData.lastName,
        dateOfBirth: new Date(childData.dateOfBirth),
        grade: childData.grade,
        points: 0,
        balance: childData.weeklyBudget, // Initial balance from weekly budget
        status: 'active',
      });

      await child.save();
      childIds.push(child._id);
    }

    // Update parent with child references
    parent.childrenIds = childIds;
    await parent.save();

    // Add or update program in user's programs array
    const existingProgram = user.programs.find(p => p.programId === 'spiritof');
    if (existingProgram) {
      // Update existing program to active
      existingProgram.status = 'active';
      existingProgram.tier = 'family';
      existingProgram.programData = {
        spiritofParentId: parent._id.toString(),
      };
    } else {
      // Add new program
      user.programs.push({
        programId: 'spiritof',
        tier: 'family',
        enrolledAt: new Date(),
        status: 'active',
        programData: {
          spiritofParentId: parent._id.toString(),
        },
      });
    }
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'SpiritOf account created successfully',
        parentId: parent._id,
        childCount: childIds.length,
        initialMagicPoints,
        chargeSuccess,
        paymentMethod: {
          last4: paymentMethodLast4,
          brand: paymentMethodBrand,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ SpiritOf onboarding error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create SpiritOf account' },
      { status: 500 }
    );
  }
}
