import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb.js';
import User from '../../../../lib/models/User.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, method = 'magic' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please register first.' },
        { status: 404 }
      );
    }

    if (method === 'pin') {
      // Generate 6-digit PIN code
      const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
      const pinCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Hash the PIN before storing
      const hashedPin = await bcrypt.hash(pinCode, 10);

      // Update user directly with findOneAndUpdate
      const updatedUser = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { 
          $set: {
            pinCode: hashedPin,
            pinCodeExpiry: pinCodeExpiry
          }
        },
        { new: true, runValidators: false }
      );

      // Send PIN via email
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'VCorp <onboarding@resend.dev>',
          to: email.toLowerCase(),
          subject: 'Your VCorp Sign-In PIN Code',
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
                  .pin-box { background: #1A1A2E; color: #00F0FF; font-size: 48px; font-weight: bold; text-align: center; padding: 30px; border-radius: 10px; margin: 20px 0; letter-spacing: 10px; }
                  .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Your Sign-In PIN</h1>
                  </div>
                  <div class="content">
                    <h2>Hi ${user.firstName},</h2>
                    <p>Here's your 6-digit PIN code to sign in to VCorp:</p>
                    <div class="pin-box">${pinCode}</div>
                    <p><strong>This PIN expires in 15 minutes.</strong></p>
                    <p>Enter this code on the sign-in page to access your account.</p>
                    <p>If you didn't request this PIN, you can safely ignore this email.</p>
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
        return NextResponse.json(
          { error: 'Failed to send PIN. Please try again.' },
          { status: 500 }
        );
      }

      console.log('🔢 PIN Code:', pinCode);

      return NextResponse.json(
        {
          success: true,
          message: 'PIN code sent! Check your email.',
          // In development, return the PIN (remove in production)
          ...(process.env.NODE_ENV === 'development' && { pinCode }),
        },
        { status: 200 }
      );
    } else {
      // Original magic link logic
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Generate magic link
    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Send magic link via email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'VCorp <onboarding@resend.dev>',
        to: email.toLowerCase(),
        subject: 'Sign In to VCorp - Magic Link',
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
                  <h1>Sign In to VCorp</h1>
                </div>
                <div class="content">
                  <h2>Hi ${user.firstName},</h2>
                  <p>Click the button below to sign in to your VCorp account:</p>
                  <div style="text-align: center;">
                    <a href="${magicLink}" class="button">Sign In</a>
                  </div>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #666; font-size: 12px;">${magicLink}</p>
                  <p><strong>This link expires in 24 hours.</strong></p>
                  <p>If you didn't request this sign-in link, you can safely ignore this email.</p>
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
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('🔗 Sign-in Magic Link:', magicLink);

      return NextResponse.json(
        {
          success: true,
          message: 'Magic link sent! Check your email.',
          // In development, return the magic link (remove in production)
          ...(process.env.NODE_ENV === 'development' && { magicLink }),
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Sign in failed. Please try again.' },
      { status: 500 }
    );
  }
}
