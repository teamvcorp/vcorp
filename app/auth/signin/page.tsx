"use client";

import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { FaEnvelope } from 'react-icons/fa';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [signInMethod, setSignInMethod] = useState<'magic' | 'pin'>('magic');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Cooldown timer effect
  React.useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleRequestPin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check cooldown
    if (cooldownSeconds > 0) {
      setMessage({
        type: 'error',
        text: `Please wait ${cooldownSeconds} seconds before requesting another code.`,
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, method: signInMethod }),
      });

      const data = await response.json();

      if (response.ok) {
        // Start 60-second cooldown
        setCooldownSeconds(60);

        if (signInMethod === 'pin') {
          setShowPinInput(true);
          setMessage({
            type: 'success',
            text: 'PIN code sent! Check your email and enter the 6-digit code below.',
          });
        } else {
          setMessage({
            type: 'success',
            text: 'Magic link sent! Check your email to sign in.',
          });
          setEmail('');
        }
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to send. Please try again.',
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pin: pinCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'PIN verified! Redirecting to dashboard...',
        });
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = '/user/dashboard';
        }, 1500);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Invalid PIN code. Please try again.',
        });
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-deep-black">
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              Sign In
            </h1>
            <p className="text-xl text-light-grey">
              Choose your preferred sign-in method
            </p>
          </div>

          {/* Sign-in Method Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => {
                setSignInMethod('magic');
                setShowPinInput(false);
                setMessage(null);
              }}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                signInMethod === 'magic'
                  ? 'bg-neon-cyan text-deep-black'
                  : 'bg-navy text-light-grey border-2 border-light-grey hover:border-neon-cyan'
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => {
                setSignInMethod('pin');
                setShowPinInput(false);
                setMessage(null);
              }}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                signInMethod === 'pin'
                  ? 'bg-neon-cyan text-deep-black'
                  : 'bg-navy text-light-grey border-2 border-light-grey hover:border-neon-cyan'
              }`}
            >
              PIN Code
            </button>
          </div>

          {/* Form */}
          <form onSubmit={showPinInput ? handleVerifyPin : handleRequestPin} className="bg-navy p-8 rounded-lg border-2 border-neon-cyan">
            
            {/* Success/Error Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg border-2 ${
                  message.type === 'success'
                    ? 'bg-deep-black border-neon-cyan text-neon-cyan'
                    : 'bg-deep-black border-neon-pink text-neon-pink'
                }`}
              >
                <p className="font-bold">{message.text}</p>
                {message.type === 'success' && (
                  <p className="text-sm text-light-grey mt-2">
                    The link is valid for 24 hours.
                  </p>
                )}
              </div>
            )}

            {/* Email Input */}
            <div className="mb-6">
              <label className="flex items-center text-white font-bold mb-2">
                <FaEnvelope className="text-neon-cyan mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
                disabled={showPinInput}
              />
            </div>

            {/* PIN Code Input (only shown after requesting PIN) */}
            {showPinInput && (
              <div className="mb-6">
                <label className="flex items-center text-white font-bold mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPinInput(false);
                    setPinCode('');
                    setMessage(null);
                    setCooldownSeconds(0); // Reset cooldown when requesting new code
                  }}
                  className="text-sm text-neon-cyan hover:text-white mt-2"
                >
                  ← Request new code
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              className="w-full"
              onClick={undefined}
            >
              {isSubmitting
                ? 'Please wait...'
                : showPinInput
                ? 'Verify PIN'
                : cooldownSeconds > 0
                ? `Wait ${cooldownSeconds}s`
                : signInMethod === 'pin'
                ? 'Send PIN Code'
                : 'Send Magic Link'}
            </Button>

            {cooldownSeconds > 0 && !showPinInput && (
              <p className="text-center text-light-grey text-sm mt-3">
                You can request a new code in {cooldownSeconds} seconds
              </p>
            )}

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-light-grey">
                Don't have an account?{' '}
                <a href="/register" className="text-neon-cyan hover:text-white font-bold">
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignInPage;
