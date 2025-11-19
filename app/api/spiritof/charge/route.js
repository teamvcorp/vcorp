import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';
import SpiritOfParent from '../../../../lib/models/SpiritOfStudent';

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

export async function POST(req) {
  try {
    await connectDB();

    const { userId, amount, description } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { success: false, message: 'User or Stripe customer not found' },
        { status: 404 }
      );
    }

    // Check if user has a payment method
    if (!user.stripePaymentMethodId) {
      return NextResponse.json(
        { success: false, message: 'Payment method not found. Please add a payment method first.' },
        { status: 400 }
      );
    }

    // Get parent account
    const parent = await SpiritOfParent.findOne({ userId });
    if (!parent) {
      return NextResponse.json(
        { success: false, message: 'SpiritOf account not found' },
        { status: 404 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method: user.stripePaymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      description: description || 'SpiritOf Magic Points Purchase',
      metadata: {
        userId: userId.toString(),
        parentId: parent._id.toString(),
        magicPoints: amount * 100, // $1 = 100 magic points
        programId: 'spiritof',
      },
    });

    // If payment successful, add magic points immediately
    if (paymentIntent.status === 'succeeded') {
      const magicPoints = amount * 100;
      parent.balance.current += magicPoints;
      parent.balance.lastUpdated = new Date();
      await parent.save();

      return NextResponse.json(
        {
          success: true,
          message: 'Payment successful! Magic points added.',
          paymentIntentId: paymentIntent.id,
          amount,
          magicPointsAdded: magicPoints,
          newBalance: parent.balance.current,
        },
        { status: 200 }
      );
    }

    // Payment requires action (3D Secure, etc.)
    return NextResponse.json(
      {
        success: false,
        message: 'Payment requires additional authentication',
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Charge error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Payment failed',
        stripeError: error.type || null,
      },
      { status: 500 }
    );
  }
}
