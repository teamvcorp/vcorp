"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const VerifyContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams?.get('token');
      const email = searchParams?.get('email');
      const redirectUrl = searchParams?.get('redirect');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email, redirectUrl }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Store user info in localStorage for other pages
          if (data.user) {
            localStorage.setItem('vcorp_user_email', data.user.email);
            localStorage.setItem('vcorp_user_id', data.user.id);
            localStorage.setItem('vcorp_user_name', `${data.user.firstName} ${data.user.lastName}`);
          }
          
          // Check if enrollment is required first
          if (data.requiresEnrollment && data.redirectUrl) {
            // Redirect to VCorp dashboard for onboarding
            setTimeout(() => {
              window.location.href = data.redirectUrl;
            }, 1000);
          } else if (data.redirectUrl) {
            // External redirect with token (user is fully enrolled)
            setTimeout(() => {
              window.location.href = data.redirectUrl;
            }, 2000);
          } else {
            // Otherwise redirect to internal dashboard
            setTimeout(() => {
              router.push('/user/dashboard');
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <main className="flex-1 bg-deep-black">
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Verifying State */}
          {status === 'verifying' && (
            <div>
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-navy rounded-full flex items-center justify-center border-4 border-neon-cyan">
                  <FaSpinner className="text-6xl text-neon-cyan animate-spin" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold text-white mb-4">
                Verifying Your Email
              </h1>
              <p className="text-xl text-light-grey">
                Please wait while we verify your account...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div>
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-neon-cyan rounded-full flex items-center justify-center animate-glow">
                  <FaCheckCircle className="text-7xl text-deep-black" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold text-white mb-4">
                Email Verified!
              </h1>
              <p className="text-2xl text-neon-cyan mb-8">
                {message}
              </p>
              <div className="bg-navy p-6 rounded-lg border-2 border-neon-cyan mb-8">
                <p className="text-light-grey">
                  Redirecting you to your dashboard...
                </p>
              </div>
              <Button variant="primary" size="lg" href="/user/dashboard">
                Go to Dashboard Now
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div>
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-navy rounded-full flex items-center justify-center border-4 border-neon-pink">
                  <FaExclamationTriangle className="text-6xl text-neon-pink" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold text-white mb-4">
                Verification Failed
              </h1>
              <p className="text-xl text-neon-pink mb-8">
                {message}
              </p>
              <div className="bg-navy p-6 rounded-lg border-2 border-neon-pink mb-8">
                <h3 className="text-xl font-bold text-white mb-3">Common Issues:</h3>
                <ul className="text-left text-light-grey space-y-2">
                  <li>• Link may have expired (valid for 24 hours)</li>
                  <li>• Link may have already been used</li>
                  <li>• Email address doesn't match</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" href="/register">
                  Register Again
                </Button>
                <Button variant="outline" size="lg" href="/">
                  Go Home
                </Button>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
};

const VerifyPage = () => {
  return (
    <Suspense fallback={
      <main className="flex-1 bg-deep-black">
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <FaSpinner className="text-neon-cyan text-6xl animate-spin mx-auto mb-6" />
            <p className="text-white text-2xl">Loading...</p>
          </div>
        </section>
      </main>
    }>
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
