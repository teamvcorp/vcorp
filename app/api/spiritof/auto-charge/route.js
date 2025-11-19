import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';
import SpiritOfParent from '../../../../lib/models/SpiritOfStudent';

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// Authorization should be added in production
export async function POST(req) {
  try {
    // Simple auth check (in production, use proper auth)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const now = new Date();
    
    // Find all parents with auto-charge enabled and next charge date <= now
    const parentsToCharge = await SpiritOfParent.find({
      'autoCharge.enabled': true,
      'autoCharge.nextChargeDate': { $lte: now },
      'autoCharge.amount': { $gt: 0 },
    });

    console.log(`🔄 Found ${parentsToCharge.length} accounts to charge`);

    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const parent of parentsToCharge) {
      try {
        // Get user for Stripe customer ID and payment method
        const user = await User.findById(parent.userId);
        if (!user || !user.stripeCustomerId || !user.stripePaymentMethodId) {
          results.errors.push({
            parentId: parent._id,
            error: 'User, Stripe customer, or payment method not found',
          });
          results.failed++;
          continue;
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(parent.autoCharge.amount * 100),
          currency: 'usd',
          customer: user.stripeCustomerId,
          payment_method: user.stripePaymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          description: `SpiritOf Auto-Charge - ${parent.autoCharge.frequency}`,
          metadata: {
            userId: user._id.toString(),
            parentId: parent._id.toString(),
            magicPoints: (parent.autoCharge.amount * 100).toString(),
            programId: 'spiritof',
            autoCharge: 'true',
          },
        });

        if (paymentIntent.status === 'succeeded') {
          // Magic points will be added by webhook
          // Update next charge date
          const nextDate = new Date(now);
          switch (parent.autoCharge.frequency) {
            case 'weekly':
              nextDate.setDate(nextDate.getDate() + 7);
              break;
            case 'biweekly':
              nextDate.setDate(nextDate.getDate() + 14);
              break;
            case 'monthly':
            default:
              nextDate.setMonth(nextDate.getMonth() + 1);
              break;
          }
          
          parent.autoCharge.nextChargeDate = nextDate;
          parent.autoCharge.lastChargeDate = now;
          await parent.save();

          results.successful++;
          console.log(`✅ Charged parent ${parent._id}: $${parent.autoCharge.amount}`);
        } else {
          results.errors.push({
            parentId: parent._id,
            error: `Payment status: ${paymentIntent.status}`,
          });
          results.failed++;
        }
      } catch (error) {
        console.error(`❌ Failed to charge parent ${parent._id}:`, error);
        results.errors.push({
          parentId: parent._id,
          error: error.message,
        });
        results.failed++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Auto-charge cron completed',
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Auto-charge cron error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
