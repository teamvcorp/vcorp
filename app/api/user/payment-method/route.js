import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

/**
 * Save payment method to user account
 * POST /api/user/payment-method
 */
export async function POST(request) {
  try {
    await connectDB();

    const { userId, paymentMethodId } = await request.json();

    if (!userId || !paymentMethodId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { success: false, message: 'Stripe customer not found' },
        { status: 400 }
      );
    }

    try {
      // Retrieve payment method details from Stripe
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      // Attach payment method to customer if not already attached
      if (!paymentMethod.customer) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: user.stripeCustomerId,
        });
      }

      // Set as default payment method
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Update user record with payment method details
      user.stripePaymentMethodId = paymentMethodId;
      user.paymentMethodLast4 = paymentMethod.card.last4;
      user.paymentMethodBrand = paymentMethod.card.brand;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Payment method saved successfully',
        paymentMethod: {
          id: paymentMethodId,
          last4: paymentMethod.card.last4,
          brand: paymentMethod.card.brand,
        },
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return NextResponse.json(
        { success: false, message: `Stripe error: ${stripeError.message}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Save payment method error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save payment method' },
      { status: 500 }
    );
  }
}
