import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../lib/db/mongodb.js';
import SpiritOfParent from '../../../lib/models/SpiritOfStudent';

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  try {
    const buf = await buffer(req.body);
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    await connectDB();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'setup_intent.succeeded':
        console.log('✅ Setup intent succeeded:', event.data.object.id);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object);
        break;

      case 'payment_method.attached':
        console.log('✅ Payment method attached:', event.data.object.id);
        break;

      case 'customer.updated':
        console.log('✅ Customer updated:', event.data.object.id);
        break;

      case 'charge.succeeded':
        console.log('✅ Charge succeeded:', event.data.object.id);
        break;

      case 'charge.updated':
        console.log('✅ Charge updated:', event.data.object.id);
        break;

      case 'payment_intent.created':
        console.log('✅ Payment intent created:', event.data.object.id);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent) {
  console.log('✅ Payment succeeded:', paymentIntent.id);

  const { userId, parentId, magicPoints } = paymentIntent.metadata;

  if (!parentId || !magicPoints) {
    console.error('❌ Missing metadata in payment intent');
    return;
  }

  try {
    const parent = await SpiritOfParent.findById(parentId);
    if (!parent) {
      console.error('❌ Parent not found:', parentId);
      return;
    }

    // Add magic points
    const pointsToAdd = parseInt(magicPoints);
    parent.balance.current += pointsToAdd;
    parent.balance.lastUpdated = new Date();
    parent.autoCharge.lastChargeDate = new Date();

    // Calculate next charge date if auto-charge is enabled
    if (parent.autoCharge.enabled) {
      const now = new Date();
      switch (parent.autoCharge.frequency) {
        case 'weekly':
          parent.autoCharge.nextChargeDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'biweekly':
          parent.autoCharge.nextChargeDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
        default:
          parent.autoCharge.nextChargeDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    await parent.save();

    console.log(`✅ Added ${pointsToAdd} magic points to parent ${parentId}. New balance: ${parent.balance.current}`);
  } catch (error) {
    console.error('❌ Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);

  const { userId, parentId } = paymentIntent.metadata;

  // TODO: Send notification email to user about failed payment
  // TODO: Disable auto-charge if payment fails multiple times

  console.log(`Payment failed for parent ${parentId}. Reason: ${paymentIntent.last_payment_error?.message}`);
}

async function handleSubscriptionChange(subscription) {
  console.log('🔄 Subscription updated:', subscription.id);
  
  // Handle subscription-based billing if needed
  // For now, we're using one-time charges with auto-charge scheduling
}

async function handleInvoicePayment(invoice) {
  console.log('💰 Invoice paid:', invoice.id);
  
  // Handle subscription invoice payments
  // Extract metadata and add magic points similar to payment_intent.succeeded
}
