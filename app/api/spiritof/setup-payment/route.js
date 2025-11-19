import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';
import SpiritOfParent from '../../../../lib/models/SpiritOfStudent';

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

export async function POST(req) {
  try {
    await connectDB();

    const { userId, paymentMethodData } = await req.json();

    if (!userId || !paymentMethodData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user and verify Stripe customer exists
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

    // Create payment method in Stripe
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: paymentMethodData.cardNumber.replace(/\s/g, ''),
        exp_month: parseInt(paymentMethodData.expiry.split('/')[0]),
        exp_year: parseInt('20' + paymentMethodData.expiry.split('/')[1]),
        cvc: paymentMethodData.cvc,
      },
      billing_details: {
        name: paymentMethodData.name,
        email: user.email,
        address: {
          line1: paymentMethodData.billingAddress.street,
          city: paymentMethodData.billingAddress.city,
          state: paymentMethodData.billingAddress.state,
          postal_code: paymentMethodData.billingAddress.zipCode,
        },
      },
    });

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: user.stripeCustomerId,
    });

    // Set as default payment method
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    // Create setup intent for future payments
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method: paymentMethod.id,
      confirm: true,
      payment_method_types: ['card'],
    });

    // Update SpiritOfParent with payment info
    const parent = await SpiritOfParent.findOne({ userId });
    if (parent) {
      parent.stripePaymentMethodId = paymentMethod.id;
      parent.stripeSetupIntentId = setupIntent.id;
      parent.paymentMethodLast4 = paymentMethod.card.last4;
      parent.paymentMethodBrand = paymentMethod.card.brand;
      await parent.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment method saved successfully',
        paymentMethodId: paymentMethod.id,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Setup payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to setup payment method',
        stripeError: error.type || null,
      },
      { status: 500 }
    );
  }
}
