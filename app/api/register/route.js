import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db/mongodb.js';
import User from '../../../lib/models/User.js';
import Stripe from 'stripe';
import crypto from 'crypto';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_API_SECRET);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, dateOfBirth, address, program, tier } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !dateOfBirth || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: email.toLowerCase(),
      name: `${firstName} ${lastName}`,
      phone: phone,
      address: {
        line1: address.street,
        city: address.city,
        state: address.state,
        postal_code: address.zipCode,
        country: 'US',
      },
      metadata: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
      },
    });

    // Generate verification token for magic link
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in MongoDB
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      dateOfBirth: new Date(dateOfBirth),
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
      stripeCustomerId: stripeCustomer.id,
      verificationToken,
      verificationTokenExpiry,
      accountStatus: 'pending',
      programs: program
        ? [
            {
              programId: program,
              tier: tier || null,
              enrolledAt: new Date(),
              status: 'active',
            },
          ]
        : [],
    });

    // Calculate initial profile completeness
    newUser.calculateProfileCompleteness();
    await newUser.save();

    // Generate magic link
    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Send magic link via email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'VCorp <onboarding@resend.dev>',
        to: email.toLowerCase(),
        subject: 'Welcome to VCorp - Verify Your Email',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1A1A2E 0%, #0A0A0A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: #00F0FF; margin: 0; font-size: 32px; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 15px 40px; background: #00F0FF; color: #0A0A0A; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to VCorp!</h1>
                </div>
                <div class="content">
                  <h2>Hi ${firstName},</h2>
                  <p>Thank you for registering! Click the button below to verify your email and complete your account setup:</p>
                  <div style="text-align: center;">
                    <a href="${magicLink}" class="button">Verify Email & Sign In</a>
                  </div>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #666; font-size: 12px;">${magicLink}</p>
                  <p><strong>This link expires in 24 hours.</strong></p>
                  <p>If you didn't create this account, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} The Von Der Becke Academy Corp. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      // Continue anyway - user is created, we'll log the link
    }

    console.log('🔗 Magic Link:', magicLink);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Check your email for the magic link.',
        userId: newUser._id,
        // In development, return the magic link (remove in production)
        ...(process.env.NODE_ENV === 'development' && { magicLink }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle duplicate key error (shouldn't happen due to check above, but just in case)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
